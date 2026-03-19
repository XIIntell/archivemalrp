require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const axios = require('axios');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;

// ======= База данных =======
const db = mysql.createPool({
  host:     process.env.DB_HOST,
  port:     parseInt(process.env.DB_PORT) || 3306,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

// ======= Middleware =======
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'archivemalrp_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 }
}));
app.use(express.static(path.join(__dirname, 'public')));

// Главная страница
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ======= Хелперы =======
const ADMIN_IDS = (process.env.ADMIN_IDS || '').split(',').map(s => s.trim());
function getRole(discordId) {
  return ADMIN_IDS.includes(discordId) ? 'admin' : 'user';
}

// ======= Auth Routes =======

// Редирект на Discord
app.get('/auth/discord_login.php', (req, res) => {
  const params = new URLSearchParams({
    client_id:     process.env.DISCORD_CLIENT_ID,
    redirect_uri:  process.env.DISCORD_REDIRECT_URI,
    response_type: 'code',
    scope:         'identify email',
  });
  res.redirect('https://discord.com/oauth2/authorize?' + params.toString());
});

// Callback от Discord
app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.redirect('/');

  try {
    // Получаем токен
    const tokenRes = await axios.post('https://discord.com/api/oauth2/token',
      new URLSearchParams({
        client_id:     process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type:    'authorization_code',
        code,
        redirect_uri:  process.env.DISCORD_REDIRECT_URI,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { access_token } = tokenRes.data;

    // Получаем пользователя
    const userRes = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const user = userRes.data;
    const role = getRole(user.id);
    const avatar = user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
      : 'https://cdn.discordapp.com/embed/avatars/0.png';

    // Сохраняем/обновляем в БД
    await db.execute(
      `INSERT INTO users (discord_id, username, avatar, role) VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE username=VALUES(username), avatar=VALUES(avatar), role=VALUES(role)`,
      [user.id, user.username, avatar, role]
    );

    // Сохраняем сессию
    req.session.user = { id: user.id, username: user.username, avatar, role };
    res.redirect('/');

  } catch (e) {
    console.error('Auth error:', e.message);
    res.redirect('/?auth_error=1');
  }
});

// Выход
app.get('/auth/logout.php', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// ======= API Routes =======

// Текущий пользователь
app.get('/api/me.php', (req, res) => {
  if (req.session.user) {
    res.json({ logged_in: true, user: req.session.user });
  } else {
    res.json({ logged_in: false });
  }
});

// Читеры
app.get('/api/cheaters.php', async (req, res) => {
  try {
    const { q = '', server = '', cheat = '', page = 1 } = req.query;
    const limit = 15;
    const offset = (Math.max(1, parseInt(page)) - 1) * limit;

    let where = ["status = 'confirmed'"];
    let params = [];

    if (q) {
      where.push('(nick LIKE ? OR discord LIKE ?)');
      params.push(`%${q}%`, `%${q}%`);
    }
    if (server) { where.push('server = ?'); params.push(server); }
    if (cheat)  { where.push('cheat LIKE ?'); params.push(`%${cheat}%`); }

    const whereStr = where.join(' AND ');

    const [[{ total }]] = await db.execute(`SELECT COUNT(*) as total FROM cheaters WHERE ${whereStr}`, params);
    const [cheaters]    = await db.execute(`SELECT * FROM cheaters WHERE ${whereStr} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`, params);
    const [top]         = await db.execute(`SELECT * FROM cheaters WHERE status='confirmed' ORDER BY views DESC LIMIT 3`);
    const [serverRows]  = await db.execute(`SELECT DISTINCT server FROM cheaters WHERE status='confirmed' AND server != '' ORDER BY server`);

    res.json({
      cheaters,
      top,
      servers: serverRows.map(r => r.server),
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (e) {
    console.error(e);
    res.json({ cheaters: [], top: [], servers: [], total: 0, pages: 0 });
  }
});

// Скаммеры
app.get('/api/scammers.php', async (req, res) => {
  try {
    const { q = '' } = req.query;
    let where = ["status = 'confirmed'"];
    let params = [];

    if (q) {
      where.push('(nick LIKE ? OR discord LIKE ?)');
      params.push(`%${q}%`, `%${q}%`);
    }

    const whereStr = where.join(' AND ');
    const [scammers] = await db.execute(`SELECT * FROM scammers WHERE ${whereStr} ORDER BY created_at DESC`, params);
    res.json({ scammers });
  } catch (e) {
    res.json({ scammers: [] });
  }
});

// Подать заявку (читер)
app.post('/api/submit.php', async (req, res) => {
  if (!req.session.user) return res.json({ ok: false, error: 'Не авторизован' });

  try {
    const { nick, discord, server, cheat, description } = req.body;
    if (!nick) return res.json({ ok: false, error: 'Ник обязателен' });

    const [userRows] = await db.execute('SELECT id FROM users WHERE discord_id = ?', [req.session.user.id]);
    const userId = userRows[0]?.id || null;

    await db.execute(
      'INSERT INTO cheaters (nick, discord, server, cheat, description, status, submitted_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nick, discord || '', server || '', cheat || '', description || '', 'pending', userId]
    );
    res.json({ ok: true });
  } catch (e) {
    res.json({ ok: false, error: e.message });
  }
});

// Подать заявку (скаммер)
app.post('/api/submit_scammer.php', async (req, res) => {
  if (!req.session.user) return res.json({ ok: false, error: 'Не авторизован' });

  try {
    const { nick, discord, server, amount, description } = req.body;
    if (!nick) return res.json({ ok: false, error: 'Ник обязателен' });

    const [userRows] = await db.execute('SELECT id FROM users WHERE discord_id = ?', [req.session.user.id]);
    const userId = userRows[0]?.id || null;

    await db.execute(
      'INSERT INTO scammers (nick, discord, server, amount, description, status, submitted_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nick, discord || '', server || '', amount || '', description || '', 'pending', userId]
    );
    res.json({ ok: true });
  } catch (e) {
    res.json({ ok: false, error: e.message });
  }
});

// Одобрить/отклонить (только admin/moderator)
app.post('/api/moderate.php', async (req, res) => {
  if (!req.session.user || !['admin','moderator'].includes(req.session.user.role)) {
    return res.json({ ok: false, error: 'Нет прав' });
  }
  try {
    const { id, type, action } = req.body; // type: cheater|scammer, action: confirm|reject
    const status = action === 'confirm' ? 'confirmed' : 'rejected';
    const table = type === 'scammer' ? 'scammers' : 'cheaters';
    await db.execute(`UPDATE ${table} SET status = ? WHERE id = ?`, [status, id]);
    res.json({ ok: true });
  } catch (e) {
    res.json({ ok: false, error: e.message });
  }
});

// Статистика
app.get('/api/stats.php', async (req, res) => {
  try {
    const [[{ cheaters }]] = await db.execute(`SELECT COUNT(*) as cheaters FROM cheaters WHERE status='confirmed'`);
    const [[{ scammers }]] = await db.execute(`SELECT COUNT(*) as scammers FROM scammers WHERE status='confirmed'`);
    const [[{ users }]]    = await db.execute(`SELECT COUNT(*) as users FROM users`);
    const [[{ pending }]]  = await db.execute(`SELECT COUNT(*) as pending FROM cheaters WHERE status='pending'`);
    res.json({ cheaters, scammers, users, pending });
  } catch (e) {
    res.json({ cheaters: 0, scammers: 0, users: 0, pending: 0 });
  }
});

// Участники
app.get('/api/members.php', async (req, res) => {
  try {
    const { q = '', role = '', page = 1 } = req.query;
    const limit = 20;
    const offset = (Math.max(1, parseInt(page)) - 1) * limit;

    let where = ['1=1'];
    let params = [];
    if (q)    { where.push('username LIKE ?'); params.push(`%${q}%`); }
    if (role) { where.push('role = ?'); params.push(role); }

    const whereStr = where.join(' AND ');
    const [[{ total }]] = await db.execute(`SELECT COUNT(*) as total FROM users WHERE ${whereStr}`, params);
    const [members]     = await db.execute(`SELECT id, discord_id, username, avatar, role, created_at FROM users WHERE ${whereStr} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`, params);

    res.json({ members, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (e) {
    console.error('Members error:', e.message);
    res.json({ members: [], total: 0, pages: 0 });
  }
});

// Прокси для malinovka.live (обход CORS)
app.get('/api/malinovka', async (req, res) => {
  try {
    const response = await axios.get('https://malinovka.live/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      timeout: 10000,
    });
    res.json({ contents: response.data });
  } catch (e) {
    console.error('Malinovka proxy error:', e.message);
    res.json({ contents: '' });
  }
});

// Публичный профиль
app.get('/api/public_profile.php', async (req, res) => {
  try {
    const { id, discord_id } = req.query;
    let user = null;
    if (id) {
      const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
      user = rows[0] || null;
    } else if (discord_id) {
      const [rows] = await db.execute('SELECT * FROM users WHERE discord_id = ?', [discord_id]);
      user = rows[0] || null;
    }
    if (!user) return res.json({ ok: false, error: 'Пользователь не найден' });

    const [submitted] = await db.execute('SELECT COUNT(*) as c FROM cheaters WHERE submitted_by = ?', [user.id]);
    const [confirmed] = await db.execute('SELECT COUNT(*) as c FROM cheaters WHERE submitted_by = ? AND status="confirmed"', [user.id]);
    const [fake]      = await db.execute('SELECT COUNT(*) as c FROM cheaters WHERE submitted_by = ? AND status="rejected"', [user.id]);

    res.json({
      ok: true,
      user: {
        ...user,
        submitted: submitted[0].c,
        confirmed: confirmed[0].c,
        fake: fake[0].c,
      }
    });
  } catch (e) {
    res.json({ ok: false, error: e.message });
  }
});

// Онлайн счётчик
app.get('/api/online_count.php', async (req, res) => {
  try {
    const [[{ count }]] = await db.execute('SELECT COUNT(*) as count FROM users');
    res.json({ count: parseInt(count) });
  } catch(e) {
    res.json({ count: 0 });
  }
});

// Данные для формы (серверы и читы)
app.get('/api/form_data.php', async (req, res) => {
  try {
    const servers = [
      { id: '1', name: 'Сервер #1' },
      { id: '2', name: 'Сервер #2' },
      { id: '3', name: 'Сервер #3' },
      { id: '4', name: 'Сервер #4' },
    ];
    const cheats = [
      { id: '1', name: 'SilentAim' },
      { id: '2', name: 'VectorAim' },
      { id: '3', name: 'TriggerBot' },
      { id: '4', name: 'Visuals' },
      { id: '5', name: 'ESP' },
      { id: '6', name: 'Aimbot' },
      { id: '7', name: 'SpeedHack' },
    ];
    res.json({ servers, cheats });
  } catch (e) {
    res.json({ servers: [], cheats: [] });
  }
});

// Онлайн серверов
app.get('/api/servers_online.php', async (req, res) => {
  try {
    const response = await axios.get('https://malinovka.live/', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 10000,
    });
    res.json({ contents: response.data });
  } catch (e) {
    res.json({ contents: '' });
  }
});

// ======= Запуск =======
app.listen(PORT, () => {
  console.log(`✅ ARCHIVEMALRP запущен на порту ${PORT}`);
});
