// ══════════════════════════════
// Кастомные диалоги (замена alert/confirm)
// ══════════════════════════════
function showAlert(msg, type) {
  // type: 'error' | 'success' | 'info' (влияет на цвет иконки)
  const existing = document.getElementById('customAlertOverlay');
  if (existing) existing.remove();
  const colors = {
    error:   { icon: '✕', color: 'var(--red)',    bg: 'rgba(255,50,50,.08)',   border: 'rgba(255,50,50,.2)' },
    success: { icon: '✓', color: 'var(--green)',  bg: 'rgba(0,200,80,.08)',    border: 'rgba(0,200,80,.2)' },
    info:    { icon: '!', color: 'var(--accent)',  bg: 'rgba(220,0,0,.08)',     border: 'rgba(220,0,0,.2)' },
  };
  const c = colors[type] || colors.info;
  const el = document.createElement('div');
  el.id = 'customAlertOverlay';
  el.className = 'modal-overlay open';
  el.style.alignItems = 'center';
  el.innerHTML = `
    <div class="modal" onclick="event.stopPropagation()" style="max-width:360px">
      <div style="padding:24px 24px 20px;text-align:center">
        <div style="width:40px;height:40px;border-radius:50%;background:${c.bg};border:1px solid ${c.border};display:flex;align-items:center;justify-content:center;margin:0 auto 14px;font-size:18px;font-weight:800;color:${c.color}">${c.icon}</div>
        <div style="font-size:13px;color:var(--text);line-height:1.6">${msg}</div>
      </div>
      <div class="modal-footer" style="justify-content:center">
        <button class="action-btn" style="min-width:80px;justify-content:center" onclick="document.getElementById('customAlertOverlay').remove()">ОК</button>
      </div>
    </div>`;
  el.onclick = (e) => { if (e.target === el) el.remove(); };
  document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { el.remove(); document.removeEventListener('keydown', esc); } });
  document.body.appendChild(el);
}

function showConfirm(msg, onOk, onCancel) {
  const existing = document.getElementById('customConfirmOverlay');
  if (existing) existing.remove();
  const el = document.createElement('div');
  el.id = 'customConfirmOverlay';
  el.className = 'modal-overlay open';
  el.style.alignItems = 'center';
  el.innerHTML = `
    <div class="modal" onclick="event.stopPropagation()" style="max-width:360px">
      <div style="padding:24px 24px 20px;text-align:center">
        <div style="width:40px;height:40px;border-radius:50%;background:rgba(220,0,0,.08);border:1px solid rgba(220,0,0,.2);display:flex;align-items:center;justify-content:center;margin:0 auto 14px;font-size:18px;font-weight:800;color:var(--accent)">?</div>
        <div style="font-size:13px;color:var(--text);line-height:1.6">${msg}</div>
      </div>
      <div class="modal-footer" style="justify-content:center;gap:10px">
        <button class="action-btn btn-secondary" style="min-width:80px;justify-content:center" id="_confirmNo">Отмена</button>
        <button class="action-btn" style="min-width:80px;justify-content:center" id="_confirmYes">Подтвердить</button>
      </div>
    </div>`;
  const close = () => el.remove();
  el.onclick = (e) => { if (e.target === el) { close(); if (onCancel) onCancel(); } };
  document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { close(); if (onCancel) onCancel(); document.removeEventListener('keydown', esc); } });
  document.body.appendChild(el);
  document.getElementById('_confirmYes').onclick = () => { close(); onOk(); };
  document.getElementById('_confirmNo').onclick  = () => { close(); if (onCancel) onCancel(); };
}

async function toggleLike(cheaterId) {
  if (!window.IS_LOG) { showToast('Войдите чтобы поставить лайк'); return; }
  const btn = document.getElementById('likeBtn' + cheaterId);
  const cnt = document.getElementById('likeCnt' + cheaterId);
  if (!btn) return;
  const r = await fetch('/api/like.php', {
    method: 'POST',
    headers: {'Content-Type':'application/json','X-Requested-With':'XMLHttpRequest'},
    body: JSON.stringify({cheater_id: cheaterId, csrf: window.CSRF || window.MY_CSRF})
  });
  const data = await r.json();
  if (!data.ok) { showToast(data.error || 'Ошибка'); return; }
  const heart = btn.querySelector('svg');
  if (data.liked) {
    btn.classList.add('liked');
    if (heart) heart.setAttribute('fill', 'currentColor');
  } else {
    btn.classList.remove('liked');
    if (heart) heart.setAttribute('fill', 'none');
  }
  if (cnt) cnt.textContent = data.count;
  showToast(data.liked ? '❤️ Лайк поставлен' : 'Лайк убран');
}
function openLightbox(src) {
  const overlay = document.getElementById('lightboxOverlay');
  const img = document.getElementById('lightboxImg');
  img.src = src;
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  const overlay = document.getElementById('lightboxOverlay');
  overlay.style.display = 'none';
  document.getElementById('lightboxImg').src = '';
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
const ICONS = {
  search:  `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`,
  plus:    `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`,
  chart:   `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>`,
  back:    `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>`,
  bell:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  user:    `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  list:    `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
  comment:`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  star:    `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  server:  `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>`,
  help:    `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  settings:`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  logout:  `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
  pin:     `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="17" x2="12" y2="22"/><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24z"/></svg>`,
  eye:     `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  flag:    `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>`,
  send:    `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  check:   `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  x:       `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  lock:    `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  disc:    `<svg width="18" height="14" viewBox="0 0 71 55" fill="currentColor"><path d="M60.1 4.9A58.5 58.5 0 0 0 45.7.5a.22.22 0 0 0-.23.1 40.8 40.8 0 0 0-1.8 3.7 54 54 0 0 0-16.2 0A37.6 37.6 0 0 0 25.6.6a.23.23 0 0 0-.23-.1A58.4 58.4 0 0 0 11 4.9a.2.2 0 0 0-.1.08C1.6 18.7-1 32.2.3 45.5a.24.24 0 0 0 .09.17 58.8 58.8 0 0 0 17.7 8.9.23.23 0 0 0 .25-.08 42 42 0 0 0 3.6-5.9.23.23 0 0 0-.12-.32 38.7 38.7 0 0 1-5.5-2.6.23.23 0 0 1-.02-.38l1.1-.86a.22.22 0 0 1 .23-.03c11.6 5.3 24.1 5.3 35.5 0a.22.22 0 0 1 .23.03l1.1.86a.23.23 0 0 1-.02.38 36.4 36.4 0 0 1-5.5 2.6.23.23 0 0 0-.13.32 47.1 47.1 0 0 0 3.6 5.9.22.22 0 0 0 .25.08A58.6 58.6 0 0 0 70.6 45.7a.23.23 0 0 0 .09-.17C73.2 30.1 69 16.7 60.2 5a.18.18 0 0 0-.1-.08zM23.7 37.3c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2c3.6 0 6.5 3.2 6.4 7.2 0 3.9-2.8 7.2-6.4 7.2zm23.7 0c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2c3.6 0 6.5 3.2 6.4 7.2 0 3.9-2.8 7.2-6.4 7.2z"/></svg>`,
};
const $ = id => document.getElementById(id);
let currentPage = 1, searchType = 'nick', homeStatsVisible = false;
const BASE = window.BASE || '';
function navigate(page) {
  const current = document.querySelector('.page.active');
  if (current && current.id !== 'page-' + page) {
    current.style.animation = 'pageOut .18s ease forwards';
    setTimeout(() => {
      current.style.animation = '';
      current.classList.remove('active');
      _activatePage(page);
    }, 160);
    return;
  }
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const el = $('page-' + page);
  if (!el) return;
  el.classList.add('active');
  document.querySelectorAll('.nav-btn[data-page], .mobile-nav-btn[data-page]').forEach(b =>
    b.classList.toggle('active', b.dataset.page === page));
  if (page === 'home')    loadHome();
  if (page === 'stats')   loadStats();
  if (page === 'scammers') loadScammers();
  if (page === 'servers') loadServers();
  if (page === 'form')    initForm();
  if (page === 'cabinet') loadCabinet();
  if (page === 'members')  loadMembers();
  if (page === 'user-profile') {} 
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function _activatePage(page) {
  document.querySelectorAll('.page').forEach(p => { p.classList.remove('active'); p.style.animation = ''; });
  const el = document.getElementById('page-' + page);
  if (!el) return;
  el.classList.add('active');
  document.querySelectorAll('.nav-btn[data-page], .mobile-nav-btn[data-page]').forEach(b =>
    b.classList.toggle('active', b.dataset.page === page));
  if (page === 'home')    loadHome();
  if (page === 'stats')   loadStats();
  if (page === 'scammers') loadScammers();
  if (page === 'servers') loadServers();
  if (page === 'form')    initForm();
  if (page === 'cabinet') loadCabinet();
  if (page === 'members')  loadMembers();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
let _notifPollTimer = null;
function startNotifPolling() {
  if (!window.IS_LOG) return;
  _updateBell();
  _notifPollTimer = setInterval(_updateBell, 60000); 
}
async function _updateBell() {
  try {
    const r = await fetch(BASE + '/api/unread_count.php', {
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    });
    const d = await r.json();
    const count = d.count || 0;
    const dot = document.getElementById('notifDot');
    const badge = document.getElementById('notifBadge');
    if (dot) dot.style.display = count > 0 ? 'block' : 'none';
    if (badge) {
      badge.textContent = count > 9 ? '9+' : count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  } catch(e) {}
}
function stopNotifPolling() {
  if (_notifPollTimer) clearInterval(_notifPollTimer);
}
async function api(url, opts = {}) {
  try {
    const res = await fetch(BASE + url, { headers: {'X-Requested-With':'XMLHttpRequest',...opts.headers}, ...opts });
    if (res.status === 401) { window.location.href = BASE+'/auth/discord_login.php'; return null; }
    const text = await res.text();
    try { return JSON.parse(text); } catch(e) { console.error('JSON error:', text.substring(0,200)); return null; }
  } catch(e) { console.error('API error:', e); return null; }
}
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) closeMobileMenu();
});
async function pollOnlineCount() {
  try {
    const r = await fetch('/api/online_count.php', {headers:{'X-Requested-With':'XMLHttpRequest'}});
    const d = await r.json();
    const el = document.getElementById('onlineCountText');
    if (!el || !d.count) return;
    const newVal = d.count + ' онлайн';
    if (el.textContent === newVal) return;
    el.style.transition = 'transform .2s ease-in, opacity .2s ease-in';
    el.style.transform = 'translateY(-8px)';
    el.style.opacity = '0';
    setTimeout(() => {
      el.textContent = newVal;
      el.style.transition = 'none';
      el.style.transform = 'translateY(8px)';
      el.style.opacity = '0';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        el.style.transition = 'transform .22s ease-out, opacity .22s ease-out';
        el.style.transform = 'translateY(0)';
        el.style.opacity = '1';
      }));
    }, 210);
  } catch(e) {}
}
pollOnlineCount();
setInterval(pollOnlineCount, 30000);
function updateNotifBadge(count) {
  const dot   = document.getElementById('notifDot');
  const badge = document.getElementById('notifBadge');
  if (!badge) return;
  if (count > 0) {
    badge.style.display = 'flex';
    badge.textContent = count > 9 ? '9+' : count;
    if (dot) dot.style.display = 'block';
  } else {
    badge.style.display = 'none';
    if (dot) dot.style.display = 'none';
  }
}
async function pollNotifications() {
  if (!window.IS_LOG) return;
  try {
    const r = await fetch('/api/unread_count.php', {headers:{'X-Requested-With':'XMLHttpRequest'}});
    const d = await r.json();
    updateNotifBadge(d.count || 0);
  } catch(e) {}
}
if (window.IS_LOG) {
  setInterval(pollNotifications, 60000);
}
function toggleMobileMenu() {
  const menu    = document.getElementById('mobileMenu');
  const overlay = document.getElementById('mobileMenuOverlay');
  const burger  = document.getElementById('burgerBtn');
  const open = menu.classList.toggle('open');
  overlay.classList.toggle('open', open);
  burger.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}
function closeMobileMenu() {
  document.getElementById('mobileMenu')?.classList.remove('open');
  document.getElementById('mobileMenuOverlay')?.classList.remove('open');
  document.getElementById('burgerBtn')?.classList.remove('open');
  document.body.style.overflow = '';
}
function mobileNavigate(page) {
  closeMobileMenu();
  navigate(page);
  document.querySelectorAll('.mobile-nav-btn[data-page]').forEach(b =>
    b.classList.toggle('active', b.dataset.page === page));
}
function initFilterCS(csId, items, selectedVal) {
  const wrap = document.getElementById(csId+'Options');
  if (!wrap) return;
  wrap.innerHTML = items.map(item =>
    `<div class="cs-option${item.id===selectedVal?' selected':''}" onclick="pickFilterCS('${csId}','${item.id}','${item.name.replace(/'/g,'\'')}')">${item.name}</div>`
  ).join('');
}
function pickFilterCS(csId, val, label) {
  const _fm = {csFilterServer:'filterServer', csFilterCheat:'filterCheat', csMembersRole:'membersRole', csMembersSort:'membersSort'};
  const hiddenId = _fm[csId] || csId;
  const hidden  = document.getElementById(hiddenId);
  const valSpan = document.getElementById(csId+'Val');
  const drop    = document.getElementById(csId+'Drop');
  const btn     = document.getElementById(csId+'Btn');
  if (hidden)  hidden.value = val;
  if (valSpan) valSpan.textContent = label;
  document.querySelectorAll('#'+csId+'Options .cs-option').forEach(o=>o.classList.toggle('selected', o.textContent.trim()===label));
  if (drop) drop.classList.remove('open');
  if (btn)  btn.classList.remove('open');
  if (csId === 'csMembersRole' || csId === 'csMembersSort') { _membersPage = 1; loadMembers(); }
  else doSearch();
}
function toggleFilterCS(csId) {
  const drop = document.getElementById(csId+'Drop');
  const btn  = document.getElementById(csId+'Btn');
  if (!drop || !btn) return;
  const isOpen = drop.classList.contains('open');
  document.querySelectorAll('.custom-select-drop.open').forEach(d=>d.classList.remove('open'));
  document.querySelectorAll('.custom-select-btn.open').forEach(b=>b.classList.remove('open'));
  if (!isOpen) { drop.classList.add('open'); btn.classList.add('open'); }
}
document.addEventListener('click', e => {
  if (!e.target.closest('.filter-cs')) {
    document.querySelectorAll('.filter-cs .custom-select-drop.open').forEach(d=>d.classList.remove('open'));
    document.querySelectorAll('.filter-cs .custom-select-btn.open').forEach(b=>b.classList.remove('open'));
  }
});
async function loadHome() {
  const q=($('searchInput')||{}).value||'', srv=($('filterServer')||{}).value||'', cht=($('filterCheat')||{}).value||'';
  const df=($('filterDateFrom')||{}).value||'', dt=($('filterDateTo')||{}).value||'';
  const data = await api('/api/cheaters.php?'+new URLSearchParams({q,type:searchType,server:srv,cheat:cht,page:currentPage,date_from:df,date_to:dt}));
  if (!data) {
    const errHtml = '<div style="padding:20px;color:var(--text-d);text-align:center">Ошибка загрузки. <span style="color:var(--accent);cursor:pointer;text-decoration:underline" onclick="loadHome()">Повторить</span></div>';
    if ($('topTable'))  $('topTable').innerHTML  = errHtml;
    if ($('mainTable')) $('mainTable').innerHTML = errHtml;
    if ($('countText')) $('countText').textContent = '';
    return;
  }
  if ($('topTable'))  $('topTable').innerHTML  = buildTable(data.top||[],  false);
  _mainRows = data.rows||[];
  if ($('mainTable')) $('mainTable').innerHTML = buildTable(_mainRows, false, true);
  if ($('countText')) $('countText').textContent = `Показано ${(data.rows||[]).length} из ${data.total||0} записей`;
  if (data.pinned?.length) {
    if ($('pinnedSection')) $('pinnedSection').style.display = '';
    if ($('pinnedTable'))   $('pinnedTable').innerHTML = buildTable(data.pinned, true);
  } else if ($('pinnedSection')) $('pinnedSection').style.display = 'none';
  buildPagination(data.total, data.per_page||8);
  if (homeStatsVisible && data.serverStats && $('homeStatsContent'))
    $('homeStatsContent').innerHTML = buildStatBars(data.serverStats);
}
function doSearch()    { currentPage=1; loadHome(); }
function changePage(p) { currentPage=p; loadHome(); }
function toggleHomeStats() {
  homeStatsVisible = !homeStatsVisible;
  if ($('homeStats')) $('homeStats').style.display = homeStatsVisible?'':'none';
  const btn = document.querySelector('[onclick="toggleHomeStats()"]');
  if (btn) {
    if (homeStatsVisible) {
      btn.style.background = 'rgba(255,255,255,0.08)';
      btn.style.borderColor = 'rgba(255,255,255,0.18)';
      btn.style.color = '#eee';
    } else {
      btn.style.background = '';
      btn.style.borderColor = '';
      btn.style.color = '';
    }
  }
  if (homeStatsVisible) loadHome();
}
let _sortCol = null, _sortDir = 0; 
let _mainRows = [];
function sortMainTable(col) {
  if (_sortCol !== col) { _sortCol = col; _sortDir = 1; }
  else { _sortDir = (_sortDir + 1) % 3; }
  if (_sortDir === 0) { _sortCol = null; }
  if ($('mainTable')) $('mainTable').innerHTML = buildTable(_mainRows, false, true);
}
function getSortedRows(rows) {
  if (!_sortCol || _sortDir === 0) return rows;
  return [...rows].sort((a, b) => {
    let va, vb;
    if (_sortCol === 'nick') { va = (a.nick||'').toLowerCase(); vb = (b.nick||'').toLowerCase(); }
    if (_sortCol === 'views') { va = +a.views||0; vb = +b.views||0; }
    if (va < vb) return _sortDir === 1 ? 1 : -1;
    if (va > vb) return _sortDir === 1 ? -1 : 1;
    return 0;
  });
}
function sortArrow(col) {
  if (_sortCol !== col || _sortDir === 0) return '<span style="opacity:.3;font-size:9px;margin-left:3px">⇅</span>';
  return _sortDir === 1
    ? '<span style="font-size:9px;margin-left:3px;color:var(--accent)">↓</span>'
    : '<span style="font-size:9px;margin-left:3px;color:var(--accent)">↑</span>';
}
function buildTable(rows, showPin, isMain) {
  if (!rows?.length)
    return `<table><tbody><tr><td class="empty-row" colspan="7">Ничего не найдено</td></tr></tbody></table>`;
  const displayRows = isMain ? getSortedRows(rows) : rows;
  const w = window.innerWidth;

  // Десктоп — оригинальные пропорции, не трогаем
  if (w > 768) {
    let h = '<table style="table-layout:fixed;width:100%">';
    if (showPin) {
      h += '<colgroup><col style="width:28px"><col style="width:20%"><col style="width:21%"><col style="width:11%"><col style="width:18%"><col style="width:8%"><col style="width:9%"><col style="width:11%"></colgroup>';
    } else {
      h += '<colgroup><col style="width:20%"><col style="width:21%"><col style="width:11%"><col style="width:18%"><col style="width:8%"><col style="width:9%"><col style="width:11%"></colgroup>';
    }
    h += '<thead><tr>';
    if (showPin) h += '<th style="width:28px"></th>';
    const nickTh = isMain ? `<th style="cursor:pointer;user-select:none" onclick="sortMainTable('nick')">Ник${sortArrow('nick')}</th>` : '<th>Ник</th>';
    const viewsTh = isMain ? `<th style="cursor:pointer;user-select:none" onclick="sortMainTable('views')">Просмотры${sortArrow('views')}</th>` : '<th>Просмотры</th>';
    h += nickTh + '<th>Discord</th><th>Сервер</th><th>Чит</th>' + viewsTh + '<th>Дата</th><th>Статус</th></tr></thead><tbody>';
    displayRows.forEach(c => {
      h += `<tr${showPin&&c.pinned?' class="pinned-row"':''}>`;
      if (showPin) h += `<td style="color:var(--accent)">${ICONS.pin}</td>`;
      h += `<td>${nickHtml(c)}</td>`;
      h += `<td class="discord-tag">${esc(c.discord_tag)||'<span style="color:var(--text-d)">—</span>'}</td>`;
      h += `<td style="color:var(--text-m)">${esc(c.server_name)}</td>`;
      h += `<td style="font-size:11px">${buildCheatCell(c)}</td>`;
      h += `<td class="views-col">${c.views}</td><td class="date-col">${c.date}</td>`;
      h += `<td>${statusBadge(c.status)}</td></tr>`;
    });
    return h + '</tbody></table>';
  }

  // Мобильный — адаптивные колонки
  const showDiscord = w > 540;
  const showServer  = w > 380;

  let h = '<table style="table-layout:fixed;width:100%"><colgroup>';
  if (showPin) h += '<col style="width:28px">';
  if (showDiscord && showServer) {
    // 541–768px: Ник + Discord + Сервер + Чит + Статус
    h += '<col style="width:22%">';
    h += '<col style="width:28%">';
    h += '<col style="width:14%">';
    h += '<col>';
    h += '<col style="width:22%">';
  } else if (showServer) {
    // 381–540px: Ник + Сервер + Чит + Статус
    h += '<col style="width:28%">';
    h += '<col style="width:18%">';
    h += '<col>';
    h += '<col style="width:22%">';
  } else {
    // ≤380px: Ник + Чит + Статус
    h += '<col style="width:35%">';
    h += '<col>';
    h += '<col style="width:22%">';
  }
  h += '</colgroup><thead><tr>';
  if (showPin) h += '<th style="width:28px"></th>';
  h += '<th>Ник</th>';
  if (showDiscord) h += '<th>Discord</th>';
  if (showServer)  h += '<th>Сервер</th>';
  h += '<th>Чит</th><th>Статус</th></tr></thead><tbody>';

  displayRows.forEach(c => {
    h += `<tr${showPin&&c.pinned?' class="pinned-row"':''}>`;
    if (showPin)     h += `<td style="color:var(--accent)">${ICONS.pin}</td>`;
    h += `<td>${nickHtml(c)}</td>`;
    if (showDiscord) h += `<td class="discord-tag">${esc(c.discord_tag)||'<span style="color:var(--text-d)">—</span>'}</td>`;
    if (showServer)  h += `<td style="color:var(--text-m)">${esc(c.server_name)}</td>`;
    h += `<td style="font-size:10px">${buildCheatCell(c)}</td>`;
    h += `<td>${statusBadge(c.status)}</td></tr>`;
  });
  return h + '</tbody></table>';
}
// nickHtml теперь nickHtmlWithPreview (hover tooltip)
function nickHtml(c) { return nickHtmlWithPreview(c); }
function statusBadge(s) {
  const m={confirmed:['Подтверждён','confirmed'],checking:['На проверке','checking'],fake:['Фейк','fake'],pending:['Ожидает','pending']};
  const [l,c]=m[s]||m.pending;
  return `<span class="status status-${c}">${l}</span>`;
}
function buildPagination(total, perPage) {
  const el=$('pagination'); if(!el)return;
  const tp=Math.max(1,Math.ceil(total/perPage));
  let pg=`<button class="page-btn" onclick="changePage(${currentPage-1})" ${currentPage===1?'disabled':''}>‹</button>`;
  let s=Math.max(1,currentPage-2), e=Math.min(tp,s+4);
  if(e-s<4)s=Math.max(1,e-4);
  for(let i=s;i<=e;i++) pg+=`<button class="page-btn${i===currentPage?' active':''}" onclick="changePage(${i})">${i}</button>`;
  pg+=`<button class="page-btn" onclick="changePage(${currentPage+1})" ${currentPage===tp?'disabled':''}>›</button>`;
  el.innerHTML=pg;
}
function roleNickHtml(username, role, userId) {
  const cls = role === 'admin' ? 'admin-username' : (role === 'moderator' ? 'mod-username' : (role === 'vip' ? 'vip-username' : ''));
  const click = userId ? `onclick="openUserProfile(${userId}, window._currentCheaterId)" style="cursor:pointer"` : '';
  if (cls) return `<span class="${cls}" ${click}><span>${esc(username)}</span></span>`;
  return `<span ${click}>${esc(username)}</span>`;
}
function shareProfile(btn, url, nick) {
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  if (isMobile && navigator.share) {
    navigator.share({title: nick + ' — ARCHIVEMALRP', url: url}).catch(()=>{});
    return;
  }
  const orig = btn.innerHTML;
  const ok = () => {
    btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg> Скопировано';
    setTimeout(() => btn.innerHTML = orig, 2000);
  };
  if (navigator.clipboard && location.protocol === 'https:') {
    navigator.clipboard.writeText(url).then(ok).catch(() => { prompt('Скопируйте ссылку:', url); });
  } else {
    prompt('Скопируйте ссылку:', url);
  }
}
function buildTrustBar(score, level, totalVotes) {
  if (totalVotes < 1) return '<div class="trust-bar-wrap" style="margin-top:12px"><span style="font-size:11px;color:var(--text-d)">Недостаточно голосов для оценки доверия</span></div>';
  const levelLabels = { high:'Высокое доверие', medium:'Среднее доверие', neutral:'Нейтрально', low:'Низкое доверие', very_low:'Очень низкое' };
  const levelColors = { high:'#48bb78', medium:'#9ae6b4', neutral:'#f0b429', low:'#fc8181', very_low:'#e53e3e' };
  const label = levelLabels[level] || 'Нейтрально';
  const color = levelColors[level] || '#f0b429';
  return `<div class="trust-bar-wrap" style="margin-top:14px">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px">
      <span style="font-size:11.5px;color:var(--text-m);font-weight:600">Уровень доверия</span>
      <span style="font-size:11.5px;font-weight:700;color:${color}">${label} (${score}%)</span>
    </div>
    <div style="width:100%;height:8px;background:rgba(255,255,255,.06);border-radius:4px;overflow:hidden">
      <div style="width:${score}%;height:100%;background:${color};border-radius:4px;transition:width .5s ease"></div>
    </div>
    <span style="font-size:10px;color:var(--text-d);margin-top:3px;display:block">На основе ${totalVotes} голос${totalVotes===1?'а':totalVotes<5?'ов':'ов'}</span>
  </div>`;
}
async function openProfile(id) {
  window._currentCheaterId = id;
  closeMobileMenu();
  navigate('profile');
  if ($('profileContent')) $('profileContent').innerHTML='<div style="color:var(--text-d);padding:30px;text-align:center">Загрузка...</div>';
  const data=await api(`/api/cheater.php?id=${id}`);
  if (!data||data.error) { if($('profileContent'))$('profileContent').innerHTML='<div class="alert alert-error">Запись не найдена</div>'; return; }
  const c=data.cheater;
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.nick)}&background=1a0000&color=dc0000&size=128&bold=true&format=svg`;
  const shareUrl = location.origin + '/?cheater=' + c.id;
  let h=`<div class="profile-top">
    <div class="profile-avatar-wrap">
      <img class="profile-avatar-img" src="${avatarUrl}" alt="${esc(c.nick)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      <div class="avatar avatar-fallback" style="display:none">${ICONS.user.replace('width="13" height="13"','width="44" height="44"').replace('stroke-width="2"','stroke-width="1.2"').replace('stroke="currentColor"','stroke="#2a2a2a"')}</div>
    </div>
    <div style="flex:1">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;flex-wrap:wrap">
        <div><div class="profile-nick">${esc(c.nick)}</div>${statusBadge(c.status)}</div>
        <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
          <button id="shareBtn" class="action-btn share-btn" onclick="shareProfile(this,'${shareUrl}','${esc(c.nick)}')">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            Поделиться
          </button>
          <button class="action-btn" id="exportPngBtn" onclick="exportCheaterCard(${c.id})" title="Скачать карточку PNG">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            PNG
          </button>
          <button id="likeBtn${c.id}" class="action-btn like-btn ${c.user_liked ? 'liked' : ''}" onclick="toggleLike(${c.id})" title="${c.user_liked ? 'Убрать лайк' : 'Лайк'}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="${c.user_liked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <span id="likeCnt${c.id}">${c.likes_count||0}</span>
          </button>
        </div>
      </div>
      <div class="profile-meta">
        <span class="meta-item">Сервер: <span class="meta-value">${esc(c.server_name)}</span></span>
        <span class="meta-item">Discord: <span class="discord-tag">${esc(c.discord_tag)||'—'}</span></span>
        <span class="meta-item">Добавлен: <span class="meta-value">${c.date}</span></span>
        ${c.submitted_by ? `<span class="meta-item">Подал: <span class="meta-value" style="cursor:pointer;color:var(--blue);text-decoration:underline" onclick="openUserProfile(${c.submitted_by}, window._currentCheaterId)">${esc(c.submitted_username||'Неизвестно')}</span></span>` : ''}
        <span class="meta-break">${c.approved_username && c.status === 'confirmed' ? `<span class="meta-item">Одобрил: ${roleNickHtml(c.approved_username, c.approved_role, null)}</span>` : ''}<span class="meta-item" style="display:inline-flex;align-items:center;gap:3px">${ICONS.flag} <span class="meta-accent">${c.complaints}</span></span><span class="meta-item" style="display:inline-flex;align-items:center;gap:3px">${ICONS.eye} <span class="meta-value">${c.views}</span></span></span>
      </div>
    </div></div>
  <div class="card"><div class="card-title">Описание</div>
    <p style="color:var(--text);font-size:12.5px;line-height:1.6">${esc(c.description)||'<span style="color:var(--text-d)">Не указано</span>'}</p>
  </div>
  <div class="card"><div class="card-title">Доказательства</div>`;
  const vids=(data.evidence||[]).filter(e=>e.type==='video');
  const imgs=(data.evidence||[]).filter(e=>e.type==='screenshot');
  if(vids.length)vids.forEach(v=>{
    const isYT = v.url.includes('youtube.com') || v.url.includes('youtu.be');
    let ytEmbed = '';
    if(isYT){
      let vid='';
      const m1=v.url.match(/[?&]v=([^&]+)/), m2=v.url.match(/youtu\.be\/([^?]+)/), m3=v.url.match(/\/shorts\/([^?]+)/);
      if(m1)vid=m1[1]; else if(m2)vid=m2[1]; else if(m3)vid=m3[1];
      if(vid)ytEmbed=`<div style="position:relative;height:220px;overflow:hidden;border-radius:6px;margin-top:8px"><iframe src="https://www.youtube.com/embed/${vid}" frameborder="0" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;border-radius:6px"></iframe></div>`;
    }
    h+=`<div class="evidence-block"><a href="${esc(v.url)}" target="_blank" class="evidence-link">${esc(v.url)}</a>${ytEmbed}</div>`;
  });
  if(imgs.length)imgs.forEach(s=>{h+=`<div class="evidence-block"><img src="${esc(s.url)}" alt="Скриншот" onclick="openLightbox('${esc(s.url)}')" style="max-width:100%;max-height:320px;border-radius:6px;border:1px solid var(--border);cursor:zoom-in;display:block;transition:opacity .15s" onmouseover="this.style.opacity='.85'" onmouseout="this.style.opacity='1'"></div>`;});
  if(!vids.length&&!imgs.length)h+='<span style="color:var(--text-d);font-size:11.5px">Доказательства не добавлены</span>';
  h+=`</div>
  <div class="card"><div class="card-title">Голосование</div>
    <span style="font-size:11.5px;color:var(--text-m)">Считаете ли вы эту информацию достоверной?</span>
    <div class="vote-row">
      <button class="vote-btn vote-believe" onclick="vote(${c.id},'believe')">${ICONS.check} Верю (<span id="vBel${c.id}">${c.votes_believe}</span>)</button>
      <button class="vote-btn vote-not" onclick="vote(${c.id},'not_believe')">${ICONS.x} Не верю (<span id="vNot${c.id}">${c.votes_not}</span>)</button>
    </div>
    ${buildTrustBar(data.trust_score, data.trust_level, data.trust_votes)}
  </div>
  <div class="card" style="padding:12px 16px">
    <div style="display:flex;align-items:center;justify-content:space-between">
      <span style="font-size:11.5px;color:var(--text-d)">Считаете информацию неверной?</span>
      <button class="action-btn" style="font-size:11px;padding:4px 10px;display:inline-flex;align-items:center;gap:5px" onclick="openReportModal(${c.id},'${esc(c.nick).replace(/'/g,"\\'")}')">${ICONS.flag} Пожаловаться</button>
    </div>
  </div>
  <div class="card"><div class="card-title">Комментарии (<span id="cmtCount${c.id}">${(data.comments||[]).length}</span>)</div>
    <div id="cmtList${c.id}">`;
  if(data.comments?.length)data.comments.forEach(cm=>{
    const canDel = window.MY_ROLE==='admin'||window.MY_ROLE==='moderator';
    const delBtn = canDel ? `<button class="comment-del-btn" onclick="deleteComment(${cm.id},this)" title="Удалить комментарий">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
      Удалить
    </button>` : '';
    h+=`<div class="comment-item"><div class="comment-user">${roleNickHtml(cm.username, cm.user_role, cm.user_id)}<span class="comment-date">${cm.date}</span>${delBtn}</div><div class="comment-text">${esc(cm.text)}</div></div>`;
  });
  else h+='<div class="no-comments">Комментариев пока нет</div>';
  h+=`</div><div id="commentAuth"></div></div>`;
  if($('profileContent'))$('profileContent').innerHTML=h;
  loadCommentInput(c.id);
}
async function loadCommentInput(cheaterId) {
  const el=$('commentAuth'); if(!el)return;
  if(window.IS_LOG){el.innerHTML=`<div class="comment-input-row"><input class="comment-input" id="cmtInput${cheaterId}" placeholder="Написать комментарий..." onkeydown="if(event.key==='Enter')addComment(${cheaterId})"><button class="comment-send" onclick="addComment(${cheaterId})">${ICONS.send}</button></div>`;}
  else{el.innerHTML=`<div class="alert alert-info" style="margin-top:10px"><a href="${BASE}/auth/discord_login.php" style="color:var(--blue)">Войдите через Discord</a> чтобы комментировать</div>`;}
}
function openReportModal(cheaterId, nick) {
  if (!window.IS_LOG) { window.location.href = BASE + '/auth/discord_login.php'; return; }
  const existing = document.getElementById('reportModal');
  if (existing) existing.remove();
  const reasons = [
    'Неверная информация',
    'Чит указан неправильно',
    'Это я сам / ложное обвинение',
    'Запись устарела',
    'Другое',
  ];
  const modal = document.createElement('div');
  modal.id = 'reportModal';
  modal.className = 'modal-overlay open';
  modal.onclick = (e) => { if (e.target === modal) closeReportModal(); };
  modal.innerHTML = `
    <div class="modal" onclick="event.stopPropagation()" style="max-width:420px">
      <div class="modal-header">
        <span class="modal-title">Пожаловаться на запись</span>
        <button type="button" class="modal-close" onclick="closeReportModal()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div style="padding:0 20px 20px">
        <div style="font-size:12px;color:var(--text-d);margin:14px 0">Запись: <b style="color:var(--text-w)">${esc(nick)}</b></div>
        <div class="form-group">
          <label class="form-label">Причина жалобы *</label>
          <div id="reportReasons" style="display:flex;flex-direction:column;gap:4px">
            ${reasons.map((r,i) => `
              <label style="display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:var(--radius);border:1px solid var(--border);background:var(--bg-input);cursor:pointer;transition:border-color .15s" id="rr${i}">
                <input type="radio" name="reportReason" value="${esc(r)}" style="display:none" onchange="highlightReason(${i})">
                <span class="rr-dot" style="width:13px;height:13px;border-radius:50%;border:2px solid #333;flex-shrink:0;transition:all .15s"></span>
                <span style="font-size:12px;color:var(--text-m)">${esc(r)}</span>
              </label>`).join('')}
          </div>
        </div>
        <div class="form-group" id="reportOtherWrap" style="display:none">
          <label class="form-label">Уточните</label>
          <textarea class="form-input" id="reportOtherText" placeholder="Опишите проблему..." style="min-height:70px;resize:none"></textarea>
        </div>
        <div id="reportError" style="color:var(--red);font-size:11.5px;margin-top:8px;display:none"></div>
      </div>
      <div class="modal-footer">
        <button type="button" class="action-btn" onclick="closeReportModal()">Отмена</button>
        <button type="button" class="action-btn red" id="reportSubmitBtn" onclick="submitReport(${cheaterId})">Отправить жалобу</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
}
function highlightReason(idx) {
  document.querySelectorAll('#reportReasons label').forEach((l,i) => {
    const active = i === idx;
    l.style.borderColor = active ? 'rgba(220,0,0,.4)' : 'var(--border)';
    l.style.background  = active ? 'rgba(220,0,0,.06)' : 'var(--bg-input)';
    l.querySelector('.rr-dot').style.borderColor  = active ? 'var(--accent)' : '#333';
    l.querySelector('.rr-dot').style.background   = active ? 'var(--accent)' : 'transparent';
    l.querySelector('.rr-dot').style.boxShadow    = active ? '0 0 6px rgba(220,0,0,.4)' : 'none';
  });
  const isOther = document.querySelector('input[name="reportReason"]:checked')?.value === 'Другое';
  document.getElementById('reportOtherWrap').style.display = isOther ? '' : 'none';
}
function closeReportModal() {
  document.getElementById('reportModal')?.remove();
}
async function submitReport(cheaterId) {
  const selected = document.querySelector('input[name="reportReason"]:checked');
  const errEl = document.getElementById('reportError');
  errEl.style.display = 'none';
  if (!selected) {
    errEl.textContent = 'Выберите причину жалобы';
    errEl.style.display = 'block';
    return;
  }
  let reason = selected.value;
  if (reason === 'Другое') {
    const extra = document.getElementById('reportOtherText')?.value.trim();
    if (extra) reason = extra;
  }
  const btn = document.getElementById('reportSubmitBtn');
  btn.disabled = true;
  btn.textContent = 'Отправка...';
  const data = await api('/api/report_submit.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cheater_id: cheaterId, reason, csrf: window.CSRF }),
  });
  if (!data) { btn.disabled=false; btn.textContent='Отправить жалобу'; errEl.textContent='Ошибка запроса'; errEl.style.display='block'; return; }
  if (data.error) { btn.disabled=false; btn.textContent='Отправить жалобу'; errEl.textContent=data.error; errEl.style.display='block'; return; }
  closeReportModal();
  showToast(data.auto_checking
    ? 'Жалоба принята. Запись отправлена на проверку'
    : 'Жалоба принята, спасибо');
  const cntEl = document.querySelector(`.meta-accent[data-complaints="${cheaterId}"]`);
  if (cntEl) cntEl.textContent = data.complaints;
}
async function vote(id,type){
  if(!window.IS_LOG){window.location.href=BASE+'/auth/discord_login.php';return;}
  const data=await api('/api/vote.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({cheater_id:id,vote:type,csrf:window.CSRF})});
  if(!data)return;if(data.error){showAlert(data.error,'error');return;}
  if($(`vBel${id}`))$(`vBel${id}`).textContent=data.believe;
  if($(`vNot${id}`))$(`vNot${id}`).textContent=data.not_believe;
}
async function addComment(id){
  const input=$(`cmtInput${id}`);if(!input)return;
  const text=input.value.trim();if(!text)return;
  const data=await api('/api/comment.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({cheater_id:id,text,csrf:window.CSRF})});
  if(!data)return;if(data.error){showAlert(data.error,'error');return;}
  input.value='';
  const list=$(`cmtList${id}`);const noC=list?.querySelector('.no-comments');if(noC)noC.remove();
  if(list)list.insertAdjacentHTML('beforeend',`<div class="comment-item"><div class="comment-user">${esc(data.username)}<span class="comment-date">Только что</span></div><div class="comment-text">${esc(text)}</div></div>`);
  const cnt=$(`cmtCount${id}`);if(cnt)cnt.textContent=parseInt(cnt.textContent||'0')+1;
}
const _csData = {}; 
function initCS(csId, items, placeholder) {
  _csData[csId] = items;
  renderCSOptions(csId, items);
  const btn = document.getElementById(csId + 'Btn');
  const val = document.getElementById(csId + 'Val');
  if (btn) { btn.querySelector('.cs-val').textContent = placeholder; btn.querySelector('.cs-val').classList.add('cs-placeholder'); }
}
function renderCSOptions(csId, items) {
  const wrap = document.getElementById(csId + 'Options');
  if (!wrap) return;
  if (!items.length) { wrap.innerHTML = '<div class="cs-empty">Ничего не найдено</div>'; return; }
  wrap.innerHTML = items.map(item => {
    const abbr = item.name.substring(0, 2).toUpperCase();
    return `<div class="cs-option" onclick="selectCS('${csId}', ${item.id}, '${esc(item.name)}')" data-id="${item.id}">
      <span class="cs-icon">${abbr}</span>
      <span>${esc(item.name)}</span>
    </div>`;
  }).join('');
}
function toggleCS(csId) {
  const drop = document.getElementById(csId + 'Drop');
  const btn  = document.getElementById(csId + 'Btn');
  const isOpen = drop.classList.contains('open');
  document.querySelectorAll('.custom-select-drop.open').forEach(d => d.classList.remove('open'));
  document.querySelectorAll('.custom-select-btn.open').forEach(b => b.classList.remove('open'));
  if (!isOpen) {
    drop.classList.add('open');
    btn.classList.add('open');
    const si = drop.querySelector('input');
    if (si) { si.value = ''; filterCS(csId, ''); setTimeout(() => si.focus(), 50); }
  }
}
const _selectedCheats = []; 
function selectCS(csId, id, name) {
  if (csId === 'csCheat') {
    const existing = _selectedCheats.findIndex(c => c.id === id);
    if (existing >= 0) {
      _selectedCheats.splice(existing, 1); 
    } else {
      _selectedCheats.push({id, name});
    }
    const ids = _selectedCheats.map(c => c.id);
    const mainInput = document.getElementById('formCheat');
    const allInput  = document.getElementById('formCheatIds');
    if (mainInput) mainInput.value = ids[0] || '';
    if (allInput)  allInput.value  = ids.join(',');
    const valSpan = document.getElementById('csCheatVal');
    if (valSpan) {
      if (_selectedCheats.length === 0) {
        valSpan.textContent = 'Выберите читы...';
        valSpan.classList.add('cs-placeholder');
      } else {
        valSpan.textContent = _selectedCheats.length === 1
          ? _selectedCheats[0].name
          : `${_selectedCheats.length} чита выбрано`;
        valSpan.classList.remove('cs-placeholder');
      }
    }
    renderCheatTags();
    document.querySelectorAll(`#csCheatOptions .cs-option`).forEach(o => {
      o.classList.toggle('selected', _selectedCheats.some(c => c.id === +o.dataset.id));
    });
    return;
  }
  const _inputMap = { csServer: 'formServer', csAddServer: 'addServer' };
  const hiddenInput = document.getElementById(_inputMap[csId] || 'formServer');
  const valSpan = document.getElementById(csId + 'Val');
  const btn = document.getElementById(csId + 'Btn');
  if (hiddenInput) hiddenInput.value = id;
  if (valSpan) { valSpan.textContent = name; valSpan.classList.remove('cs-placeholder'); }
  document.querySelectorAll(`#${csId}Options .cs-option`).forEach(o => o.classList.toggle('selected', +o.dataset.id === id));
  document.getElementById(csId + 'Drop').classList.remove('open');
  if (btn) btn.classList.remove('open');
}
function renderCheatTags() {
  const wrap = document.getElementById('csCheatTags');
  if (!wrap) return;
  wrap.innerHTML = _selectedCheats.map(c => `
    <span style="display:inline-flex;align-items:center;gap:4px;background:rgba(220,0,0,.1);border:1px solid rgba(220,0,0,.2);border-radius:4px;padding:2px 8px;font-size:11px;color:var(--accent)">
      ${esc(c.name)}
      <button type="button" onclick="removeCheat(${c.id})" style="background:none;border:none;color:var(--text-d);cursor:pointer;padding:0;font-size:12px;line-height:1;margin-left:2px">×</button>
    </span>`).join('');
}
function removeCheat(id) {
  const idx = _selectedCheats.findIndex(c => c.id === id);
  if (idx >= 0) _selectedCheats.splice(idx, 1);
  const ids = _selectedCheats.map(c => c.id);
  const mainInput = document.getElementById('formCheat');
  const allInput  = document.getElementById('formCheatIds');
  if (mainInput) mainInput.value = ids[0] || '';
  if (allInput)  allInput.value  = ids.join(',');
  const valSpan = document.getElementById('csCheatVal');
  if (valSpan) {
    if (_selectedCheats.length === 0) {
      valSpan.textContent = 'Выберите читы...';
      valSpan.classList.add('cs-placeholder');
    } else {
      valSpan.textContent = _selectedCheats.length === 1 ? _selectedCheats[0].name : `${_selectedCheats.length} чита выбрано`;
      valSpan.classList.remove('cs-placeholder');
    }
  }
  renderCheatTags();
  document.querySelectorAll('#csCheatOptions .cs-option').forEach(o => {
    o.classList.toggle('selected', _selectedCheats.some(c => c.id === +o.dataset.id));
  });
}
function filterCS(csId, q) {
  const items = (_csData[csId] || []).filter(i => i.name.toLowerCase().includes(q.toLowerCase()));
  renderCSOptions(csId, items);
  const _fMap = { csServer: 'formServer', csAddServer: 'addServer', csCheat: 'formCheat' };
  const hiddenInput = document.getElementById(_fMap[csId] || 'formServer');
  if (hiddenInput?.value) {
    document.querySelectorAll(`#${csId}Options .cs-option`).forEach(o => o.classList.toggle('selected', +o.dataset.id === +hiddenInput.value));
  }
}
document.addEventListener('click', e => {
  if (!e.target.closest('.custom-select')) {
    document.querySelectorAll('.custom-select-drop.open').forEach(d => d.classList.remove('open'));
    document.querySelectorAll('.custom-select-btn.open').forEach(b => b.classList.remove('open'));
  }
});
async function initForm() {
  const data = await api('/api/form_data.php'); if (!data) return;
  initCS('csServer', data.servers || [], 'Выберите сервер');
  initCS('csCheat',  data.cheats  || [], 'Выберите читы...');
  const fs = $('formServer'); if (fs) fs.value = '';
  _selectedCheats.length = 0;
  const fc = $('formCheat'); if (fc) fc.value = '';
  const fci = $('formCheatIds'); if (fci) fci.value = '';
  renderCheatTags();
  const sv = $('csServerVal'); if (sv) { sv.textContent = 'Выберите сервер'; sv.classList.add('cs-placeholder'); }
  const cv = $('csCheatVal');  if (cv) { cv.textContent = 'Выберите читы...'; cv.classList.add('cs-placeholder'); }
  // Decrypt text animation
  document.querySelectorAll('#page-form [data-decrypt]').forEach(el => decryptText(el));
}

/* ── Decrypted Text Animation ── */
function decryptText(el, opts = {}) {
  const text = el.getAttribute('data-decrypt') || '';
  if (!text) return;
  const duration = opts.duration || 2000;   // total ms for full reveal
  const interval = 30;                       // tick speed (ms)
  const totalTicks = Math.ceil(duration / interval);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзиклмнопрстуфхцчшщъыьэюя';
  const len = text.length;
  const revealed = new Array(len).fill(false);
  // Each char has a tick at which it reveals (spread evenly across duration)
  const revealAt = [];
  for (let i = 0; i < len; i++) {
    if (text[i] === ' ') { revealAt.push(0); revealed[i] = true; }
    else revealAt.push(Math.floor((i / len) * totalTicks * 0.85) + Math.floor(Math.random() * 4));
  }

  function randChar() { return chars[Math.floor(Math.random() * chars.length)]; }
  function render() {
    let html = '';
    for (let i = 0; i < len; i++) {
      if (text[i] === ' ') html += ' ';
      else if (revealed[i]) html += `<span class="decrypt-revealed">${text[i]}</span>`;
      else html += `<span class="decrypt-scramble">${randChar()}</span>`;
    }
    el.innerHTML = html;
  }

  let tick = 0;
  render();
  const timer = setInterval(() => {
    tick++;
    for (let i = 0; i < len; i++) {
      if (!revealed[i] && tick >= revealAt[i]) revealed[i] = true;
    }
    render();
    if (tick >= totalTicks || revealed.every(Boolean)) clearInterval(timer);
  }, interval);
}
/* ─── FORM EVIDENCE UPLOAD (DRAG & DROP) ─── */
let formUploadedUrls = [];
function formDragOver(e) {
  e.preventDefault();
  document.getElementById('formDropZone').classList.add('dragover');
}
function formDragLeave(e) {
  document.getElementById('formDropZone').classList.remove('dragover');
}
function formDrop(e) {
  e.preventDefault();
  document.getElementById('formDropZone').classList.remove('dragover');
  const files = e.dataTransfer.files;
  if (files.length) Array.from(files).forEach(f => formUploadFile(f));
}
function formFilesSelected(input) {
  Array.from(input.files).forEach(f => formUploadFile(f));
  input.value = '';
}
async function formUploadFile(file) {
  if (file.size > 1 * 1024 * 1024) { showAlert('Файл слишком большой. Максимум 1 МБ', 'error'); return; }
  if (!file.type.startsWith('image/')) { showAlert('Допустимы только изображения (JPG, PNG, GIF, WEBP)', 'error'); return; }
  const dropZone = document.getElementById('formDropZone');
  const dropText = document.getElementById('formDropText');
  dropText.textContent = 'Загрузка...';
  dropZone.classList.add('uploading');
  const fd = new FormData();
  fd.append('image', file);
  fd.append('csrf', window.CSRF);
  try {
    const r = await fetch('/api/upload_evidence.php', { method:'POST', headers:{'X-Requested-With':'XMLHttpRequest'}, body:fd });
    const data = await r.json();
    if (data.error) { showAlert(data.error, 'error'); dropText.textContent = 'Перетащите скриншоты сюда или нажмите для выбора'; dropZone.classList.remove('uploading'); return; }
    formUploadedUrls.push(data.url);
    formAddPreview(data.url);
    dropText.textContent = 'Перетащите ещё или нажмите для выбора';
    dropZone.classList.remove('uploading');
    showAlert('Скриншот загружен', 'success');
  } catch(e) {
    showAlert('Ошибка загрузки файла', 'error');
    dropText.textContent = 'Перетащите скриншоты сюда или нажмите для выбора';
    dropZone.classList.remove('uploading');
  }
}
function formAddPreview(url) {
  const container = document.getElementById('formUploadedPreviews');
  const wrap = document.createElement('div');
  wrap.className = 'form-upload-preview';
  wrap.innerHTML = `<img src="${url}" onclick="window.open('${url}','_blank')"><button type="button" class="remove-btn" onclick="formRemovePreview(this,'${url}')">✕</button>`;
  container.appendChild(wrap);
}
function formRemovePreview(btn, url) {
  btn.closest('.form-upload-preview').remove();
  formUploadedUrls = formUploadedUrls.filter(u => u !== url);
}

async function submitForm(){
  const nick=($('formNick')?.value||'').trim(),discord=($('formDiscord')?.value||'').trim(),server=$('formServer')?.value,cheat=$('formCheat')?.value,cheatIds=$('formCheatIds')?.value||cheat,desc=($('formDesc')?.value||'').trim(),evidenceInput=($('formEvidence')?.value||'').trim(),confirm=$('formConfirm')?.checked,anon=$('formAnon')?.checked||false;
  // Собираем все доказательства: ссылки из поля + загруженные скриншоты
  let allEvidence = evidenceInput;
  if (formUploadedUrls.length) {
    const uploadedStr = formUploadedUrls.join(' | ');
    allEvidence = allEvidence ? allEvidence + ' | ' + uploadedStr : uploadedStr;
  }
  if(!nick||!server||!cheat||!confirm){showAlert('Заполните обязательные поля и подтвердите достоверность данных','error');return;}
  const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&\/=]*)/gi;
  const hasUrl = evidenceInput && urlRegex.test(evidenceInput);
  const hasUploads = formUploadedUrls.length > 0;
  if(!hasUrl && !hasUploads){
    const evidenceEl=$('formEvidence');
    if(evidenceEl){evidenceEl.focus();evidenceEl.classList.add('input-error');setTimeout(()=>evidenceEl.classList.remove('input-error'),2000);}
    showAlert('Необходимо добавить хотя бы одну ссылку на доказательства или загрузить скриншот','error');
    return;
  }
  const data=await api('/api/submit.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({nick,discord_tag:discord,server_id:server,cheat_id:cheat,cheat_ids:cheatIds,description:desc,evidence:allEvidence,anonymous:anon,csrf:window.CSRF})});
  if(!data)return;if(data.error){showAlert(data.error,'error');return;}
  formUploadedUrls = [];
  const previews = document.getElementById('formUploadedPreviews');
  if (previews) previews.innerHTML = '';
  showAlert('Заявка успешно отправлена на модерацию','success');navigate('home');
}
async function loadStats(){
  const [data, globeData] = await Promise.all([
    api('/api/stats.php'),
    api('/api/malinovka')
  ]);
  if(!data)return;

  // Summary bar
  const summaryHtml=`
<div class="srv-summary srv-summary-6">
  <div class="srv-sum-item"><div class="srv-sum-val">${(data.total||0).toLocaleString('ru')}</div><div class="srv-sum-lbl">Всего записей</div></div>
  <div class="srv-sum-item"><div class="srv-sum-val" style="color:var(--green)">${(data.confirmed||0).toLocaleString('ru')}</div><div class="srv-sum-lbl">Подтверждено</div></div>
  <div class="srv-sum-item"><div class="srv-sum-val" style="color:var(--yellow)">${(data.checking||0).toLocaleString('ru')}</div><div class="srv-sum-lbl">На проверке</div></div>
  <div class="srv-sum-item"><div class="srv-sum-val" style="color:var(--blue)">${(data.pending||0).toLocaleString('ru')}</div><div class="srv-sum-lbl">Ожидают</div></div>
  <div class="srv-sum-item"><div class="srv-sum-val" style="color:var(--accent)">${(data.fake||0).toLocaleString('ru')}</div><div class="srv-sum-lbl">Фейков</div></div>
  <div class="srv-sum-item"><div class="srv-sum-val">${(data.views||0).toLocaleString('ru')}</div><div class="srv-sum-lbl">Просмотров</div></div>
</div>`;

  // Server cards
  const servers = data.servers||[];
  const maxS = Math.max(...servers.map(s=>s.suspects),1);
  const serverCardsHtml = servers.length ? `<div class="sc-grid">${
    servers.map((sv,i)=>{
      const pct = Math.round(sv.suspects/maxS*100);
      const barColor = pct>60?'var(--accent)':pct>30?'rgba(220,100,0,.8)':'rgba(220,0,0,.4)';
      const rank = i+1;
      const rankBadge = rank<=3
        ? `<span class="sc-rank sc-top${rank}">#${rank}</span>`
        : `<span class="sc-rank">#${rank}</span>`;
      const weekBadge = sv.week_new>0
        ? `<span class="sc-week">+${sv.week_new} за неделю</span>` : '';
      return `<div class="sc-card" onclick="applyServerFilter(${sv.id})">
  <div class="sc-head">
    ${rankBadge}
    <span class="sc-name">${esc(sv.name)}</span>
    ${weekBadge}
  </div>
  <div class="sc-stats">
    <div class="sc-stat">
      <div class="sc-val">${sv.suspects}</div>
      <div class="sc-lbl">подозр.</div>
    </div>
    <div class="sc-stat">
      <div class="sc-val sc-green">${sv.confirmed}</div>
      <div class="sc-lbl">подтв.</div>
    </div>
    <div class="sc-stat">
      <div class="sc-val sc-yellow">${sv.checking}</div>
      <div class="sc-lbl">проверка</div>
    </div>
    <div class="sc-stat">
      <div class="sc-val sc-dim">${sv.pending}</div>
      <div class="sc-lbl">ожидает</div>
    </div>
  </div>
  <div class="sc-bar-wrap">
    <div class="sc-bar-track"><div class="sc-bar-fill" style="width:${pct}%;background:${barColor}"></div></div>
    <span class="sc-bar-pct">${pct}%</span>
  </div>
  ${sv.last_activity ? `<div class="sc-footer">Активность: ${sv.last_activity}</div>` : ''}
</div>`;
    }).join('')
  }</div>` : '';

  // Cheats cards
  const cheats = data.cheats||[];
  const maxC = Math.max(...cheats.map(ch=>ch.count),1);
  const cheatsHtml = cheats.length ? buildCheatsCards(cheats) : '';

  // Summary goes into its own container ABOVE the globe
  const summaryEl = $('statsSummary');
  if (summaryEl) summaryEl.innerHTML = summaryHtml;
  // Server cards + cheats go below the globe
  const el=$('statsContent');
  if(el) el.innerHTML = serverCardsHtml + cheatsHtml;
  // Init globe
  if (globeData?.servers?.length) initServerGlobe(globeData.servers);
}
function buildCheatsCards(cheats){
  const maxC = Math.max(...cheats.map(ch=>ch.count), 1);
  let html = '<div class="sc-section-title">Топ читов</div><div class="sc-cheat-grid">';
  cheats.forEach((ch, i) => {
    const pct = Math.round(ch.count / maxC * 100);
    const rank = i + 1;
    const rankBadge = rank <= 3
      ? '<span class="sc-rank sc-top' + rank + '">#' + rank + '</span>'
      : '<span class="sc-rank">#' + rank + '</span>';
    const weekBadge = ch.week_new > 0
      ? '<span class="sc-week">+' + ch.week_new + ' за неделю</span>' : '';
    const barColor = pct > 60 ? 'var(--accent)' : pct > 30 ? 'rgba(220,100,0,.8)' : 'rgba(220,0,0,.45)';
    html += '<div class="sc-card sc-cheat-card" onclick="applyCheatFilter(' + ch.id + ')">'
      + '<div class="sc-head">' + rankBadge + '<span class="sc-name">' + esc(ch.name) + '</span>' + weekBadge + '</div>'
      + '<div class="sc-cheat-stats">'
      + '<div class="sc-stat"><div class="sc-val">' + ch.count + '</div><div class="sc-lbl">всего</div></div>'
      + '<div class="sc-stat"><div class="sc-val sc-green">' + ch.confirmed + '</div><div class="sc-lbl">подтв.</div></div>'
      + '<div class="sc-stat"><div class="sc-val sc-yellow">' + ch.checking + '</div><div class="sc-lbl">проверка</div></div>'
      + '</div>'
      + '<div class="sc-bar-wrap"><div class="sc-bar-track"><div class="sc-bar-fill" style="width:' + pct + '%;background:' + barColor + '"></div></div><span class="sc-bar-pct">' + pct + '%</span></div>'
      + '</div>';
  });
  html += '</div>';
  return html;
}
function applyCheatFilter(cheatId){
  navigate('home');
  setTimeout(()=>{
    const ci=$('filterCheat')||document.querySelector('[data-cs="csFilterCheat"]');
    if(ci){ ci.value=String(cheatId); doSearch(); }
  },200);
}
function applyServerFilter(serverId){
  navigate('home');
  setTimeout(()=>{
    const si=$('filterServer');
    if(si){ si.value=String(serverId); doSearch(); }
  },200);
}
let _serversRefreshTimer = null;
async function loadServers(){
  if (_serversRefreshTimer) { clearInterval(_serversRefreshTimer); _serversRefreshTimer = null; }
  const el=$('serversContent');if(!el)return;
  el.innerHTML=`<div style="text-align:center;padding:40px;color:var(--text-d);font-size:12px">
    <div style="margin-bottom:8px">Загрузка онлайна серверов...</div>
    <div style="width:120px;height:2px;background:rgba(220,0,0,.15);border-radius:99px;margin:0 auto;overflow:hidden">
      <div style="width:40%;height:100%;background:var(--accent);border-radius:99px;animation:shimmer 1s ease-in-out infinite"></div>
    </div>
  </div>`;

  // Парсим malinovka.live через proxy для обхода CORS
  let data = null;
  try {
    const MAX_PLAYERS = 500; // макс игроков на сервер
    const resp = await fetch('/api/malinovka');
    const json = await resp.json();
    const html = json.contents;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const blocks = [...doc.querySelectorAll('.components--status-page--2Gez7')].length > 0
      ? [...doc.querySelectorAll('.components--status-page--2Gez7')]
      : [...doc.querySelectorAll('[class*="component"]')];

    // Ищем строки с "Сервер #"
    const allText = doc.body.innerText || doc.body.textContent;
    const lines = allText.split('\n').map(s=>s.trim()).filter(Boolean);
    const servers = [];
    for(let i=0;i<lines.length;i++){
      const m = lines[i].match(/Сервер #(\d+)/i);
      if(m){
        const num = parseInt(m[1]);
        if(num < 1 || num > 4) continue;
        // Следующая строка — онлайн
        let online = 0, status = 'offline';
        for(let j=i+1;j<Math.min(i+4,lines.length);j++){
          const om = lines[j].match(/(\d+)\s*игро/i);
          if(om){ online = parseInt(om[1]); }
          if(lines[j].toLowerCase().includes('работает')) { status = 'online'; }
          if(lines[j].toLowerCase().includes('недост') || lines[j].toLowerCase().includes('обслужив')) { status = 'offline'; }
        }
        servers.push({ num, name: `Сервер #${num}`, online, max: MAX_PLAYERS, status });
      }
    }
    // Сортируем по номеру, берём только 1-4
    servers.sort((a,b)=>a.num-b.num);
    if(servers.length > 0){
      const total_online = servers.reduce((s,sv)=>s+sv.online,0);
      const total_max = servers.reduce((s,sv)=>s+sv.max,0);
      data = { servers, total_online, total_max, updated_at: new Date().toLocaleTimeString('ru') };
    }
  } catch(e){ console.error('Malinovka parse error:', e); }

  if(!data||!data.servers?.length){
    el.innerHTML='<div style="color:var(--text-d);text-align:center;padding:40px">Не удалось получить данные с malinovka.live. <a href="#" onclick="loadServers();return false" style="color:var(--accent)">Повторить</a></div>';
    return;
  }
  const totalLoad=data.total_max>0?Math.round(data.total_online/data.total_max*100):0;
  const summaryHtml=`
<div class="srv-summary">
  <div class="srv-sum-item">
    <div class="srv-sum-val">${data.servers.length}</div>
    <div class="srv-sum-lbl">Серверов</div>
  </div>
  <div class="srv-sum-item">
    <div class="srv-sum-val" style="color:var(--green)">${data.total_online.toLocaleString('ru')}</div>
    <div class="srv-sum-lbl">Онлайн сейчас</div>
  </div>
  <div class="srv-sum-item">
    <div class="srv-sum-val">${data.total_max.toLocaleString('ru')}</div>
    <div class="srv-sum-lbl">Вместимость</div>
  </div>
  <div class="srv-sum-item">
    <div class="srv-sum-val" style="color:${totalLoad>70?'var(--accent)':totalLoad>40?'var(--yellow)':'var(--green)'}">${totalLoad}%</div>
    <div class="srv-sum-lbl">Загрузка</div>
  </div>
</div>
<div class="srv-total-bar-wrap">
  <div class="srv-total-bar-track"><div class="srv-total-bar-fill" style="width:${totalLoad}%"></div></div>
  <span class="srv-total-bar-lbl">Загрузка проекта: ${totalLoad}%</span>
</div>`;
  const cardsHtml=data.servers.map((sv)=>{
    const pct = sv.max > 0 ? Math.round(sv.online/sv.max*100) : 0;
    const barColor=pct>80?'var(--accent)':pct>50?'var(--yellow)':'var(--green)';
    const isOffline = sv.status === 'offline' || sv.online === 0;
    const dotColor = isOffline ? '#444' : 'var(--green)';
    const statusLabel = isOffline ? '<span style="color:#444;font-size:10px">офлайн</span>' : '<span style="color:var(--green);font-size:10px">онлайн</span>';
    return `<div class="srv-card">
  <div class="srv-card-head">
    <span class="srv-num">#${sv.num}</span>
    <span class="srv-card-name">${esc(sv.name)}</span>
    <span class="srv-dot" style="background:${dotColor}"></span>
    ${statusLabel}
  </div>
  <div class="srv-online-row">
    <div>
      <div class="srv-online-val">${sv.online.toLocaleString('ru')} <span class="srv-online-sep">/</span> <span class="srv-online-max">${sv.max.toLocaleString('ru')}</span></div>
      <div class="srv-online-lbl">Игроков онлайн</div>
    </div>
    <div style="text-align:right">
      <div class="srv-peak-val">${pct}%</div>
      <div class="srv-online-lbl">Загрузка</div>
    </div>
  </div>
  <div class="srv-bar-wrap">
    <div class="srv-bar-track"><div class="srv-bar-fill" style="width:${pct}%;background:${barColor}"></div></div>
    <span class="srv-bar-pct">${pct}%</span>
  </div>
</div>`;
  }).join('');
  el.innerHTML=summaryHtml+'<div class="srv-grid">'+cardsHtml+'</div>'
    +`<div style="text-align:right;font-size:10px;color:var(--text-d);margin-top:8px">Источник: malinovka.live · Обновлено: ${data.updated_at}</div>`;
  // Авторефреш каждые 60 сек пока вкладка активна
  _serversRefreshTimer = setInterval(() => {
    if (document.getElementById('page-servers')?.classList.contains('active')) {
      loadServers();
    } else {
      clearInterval(_serversRefreshTimer);
      _serversRefreshTimer = null;
    }
  }, 60000);
}

/* ── 3D SERVER GLOBE ── */
let _globeAnim = null;
function initServerGlobe(servers) {
  const canvas = document.getElementById('globeCanvas');
  const tooltip = document.getElementById('globeTooltip');
  if (!canvas || !servers.length) return;
  if (_globeAnim) cancelAnimationFrame(_globeAnim);

  const wrap = canvas.parentElement;
  const dpr = window.devicePixelRatio || 1;
  let W, H, R;

  function resize() {
    W = wrap.clientWidth;
    H = wrap.clientHeight;
    R = Math.min(W, H) * 0.38;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
  }
  resize();
  window.addEventListener('resize', resize);

  const ctx = canvas.getContext('2d');
  const maxS = Math.max(...servers.map(s => s.suspects), 1);
  const mono = getComputedStyle(document.body).getPropertyValue('--mono').trim() || 'monospace';

  // Assign lat/lng to each server (spread around the globe)
  const points = servers.map((s, i) => {
    const golden = 2.399963; // golden angle
    const t = i / servers.length;
    const lat = Math.asin(2 * t - 1);
    const lng = golden * i;
    const intensity = s.suspects / maxS;
    return { ...s, lat, lng, intensity, dotR: 5 + intensity * 10 };
  });

  let rotY = 0, rotX = -0.3;
  let autoRotate = true;
  let autoResumeTimer = null;
  let dragStartX = 0, dragStartY = 0, dragRotY = 0, dragRotX = 0, isDragging = false;
  let hoveredPoint = null;
  let mouseX = -1, mouseY = -1;

  function scheduleAutoResume() {
    clearTimeout(autoResumeTimer);
    autoResumeTimer = setTimeout(() => { autoRotate = true; }, 2000);
  }

  function project(lat, lng) {
    // Rotate
    const cosRY = Math.cos(rotY), sinRY = Math.sin(rotY);
    const cosRX = Math.cos(rotX), sinRX = Math.sin(rotX);
    const cosLat = Math.cos(lat), sinLat = Math.sin(lat);
    const cosLng = Math.cos(lng), sinLng = Math.sin(lng);

    let x = cosLat * sinLng;
    let y = sinLat;
    let z = cosLat * cosLng;

    // Rotate Y
    const x1 = x * cosRY - z * sinRY;
    const z1 = x * sinRY + z * cosRY;
    // Rotate X
    const y1 = y * cosRX - z1 * sinRX;
    const z2 = y * sinRX + z1 * cosRX;

    return {
      x: W / 2 + x1 * R,
      y: H / 2 + y1 * R,
      z: z2,
      visible: z2 > -0.15
    };
  }

  function nodeColor(intensity, alpha) {
    const r = Math.round(40 + intensity * 180);
    const g = Math.round(90 - intensity * 90);
    const b = Math.round(40 - intensity * 40);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function draw() {
    if (autoRotate) rotY += 0.003;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    const cx = W / 2, cy = H / 2;

    // Outer atmosphere glow
    const atmo = ctx.createRadialGradient(cx, cy, R * 0.7, cx, cy, R * 1.6);
    atmo.addColorStop(0, 'rgba(220,40,40,.04)');
    atmo.addColorStop(0.5, 'rgba(220,0,0,.02)');
    atmo.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = atmo;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.6, 0, Math.PI * 2);
    ctx.fill();

    // Globe sphere — dark body
    const sphereGrd = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.35, R * 0.05, cx + R * 0.15, cy + R * 0.2, R * 1.1);
    sphereGrd.addColorStop(0, 'rgba(35,12,12,.75)');
    sphereGrd.addColorStop(0.45, 'rgba(15,5,5,.6)');
    sphereGrd.addColorStop(0.85, 'rgba(5,0,0,.5)');
    sphereGrd.addColorStop(1, 'rgba(0,0,0,.3)');
    ctx.fillStyle = sphereGrd;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fill();

    // Specular highlight — top-left shine for 3D depth
    const spec = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.35, 0, cx - R * 0.2, cy - R * 0.2, R * 0.7);
    spec.addColorStop(0, 'rgba(255,180,180,.07)');
    spec.addColorStop(0.3, 'rgba(255,100,100,.03)');
    spec.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = spec;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fill();

    // Rim light — bottom-right edge glow for depth
    const rim = ctx.createRadialGradient(cx + R * 0.4, cy + R * 0.4, R * 0.5, cx, cy, R * 1.05);
    rim.addColorStop(0, 'rgba(0,0,0,0)');
    rim.addColorStop(0.85, 'rgba(0,0,0,0)');
    rim.addColorStop(1, 'rgba(220,50,50,.06)');
    ctx.fillStyle = rim;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.05, 0, Math.PI * 2);
    ctx.fill();

    // Globe border (inner shadow)
    const borderGrd = ctx.createRadialGradient(cx - R * 0.2, cy - R * 0.2, R * 0.9, cx + R * 0.2, cy + R * 0.2, R);
    borderGrd.addColorStop(0, 'rgba(220,0,0,.08)');
    borderGrd.addColorStop(1, 'rgba(220,0,0,.2)');
    ctx.strokeStyle = borderGrd;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.stroke();

    // Shadow below globe for floating 3D effect
    const shadow = ctx.createRadialGradient(cx, cy + R + 20, 0, cx, cy + R + 20, R * 0.6);
    shadow.addColorStop(0, 'rgba(0,0,0,.15)');
    shadow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = shadow;
    ctx.beginPath();
    ctx.ellipse(cx, cy + R + 20, R * 0.6, R * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wireframe: latitude lines
    ctx.lineWidth = 0.4;
    for (let lat = -60; lat <= 60; lat += 30) {
      const latRad = lat * Math.PI / 180;
      ctx.strokeStyle = 'rgba(220,0,0,.06)';
      ctx.beginPath();
      let started = false;
      for (let lng = 0; lng <= 360; lng += 5) {
        const p = project(latRad, lng * Math.PI / 180);
        if (p.z > 0) {
          if (!started) { ctx.moveTo(p.x, p.y); started = true; }
          else ctx.lineTo(p.x, p.y);
        } else { started = false; }
      }
      ctx.stroke();
    }

    // Wireframe: longitude lines
    for (let lng = 0; lng < 360; lng += 30) {
      const lngRad = lng * Math.PI / 180;
      ctx.strokeStyle = 'rgba(220,0,0,.06)';
      ctx.beginPath();
      let started = false;
      for (let lat = -90; lat <= 90; lat += 5) {
        const p = project(lat * Math.PI / 180, lngRad);
        if (p.z > 0) {
          if (!started) { ctx.moveTo(p.x, p.y); started = true; }
          else ctx.lineTo(p.x, p.y);
        } else { started = false; }
      }
      ctx.stroke();
    }

    // Connection arcs between nearby servers (on front)
    const projected = points.map(p => ({ ...p, ...project(p.lat, p.lng) }));
    ctx.lineWidth = 0.4;
    for (let i = 0; i < projected.length; i++) {
      for (let j = i + 1; j < projected.length; j++) {
        const a = projected[i], b = projected[j];
        if (!a.visible || !b.visible) continue;
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < R * 0.8) {
          const alpha = (1 - dist / (R * 0.8)) * 0.06 * Math.min(a.z, b.z);
          ctx.strokeStyle = `rgba(220,80,80,${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          // Curved arc through globe surface
          const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
          const lift = dist * 0.15;
          const nx = (a.y - b.y) / dist, ny = (b.x - a.x) / dist;
          ctx.quadraticCurveTo(mx + nx * lift, my + ny * lift, b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // Sort by depth (back first)
    projected.sort((a, b) => a.z - b.z);

    // Draw server points
    projected.forEach(p => {
      if (!p.visible) return;
      const depthFade = Math.max(0.15, (p.z + 1) / 2);
      const dr = p.dotR * depthFade;
      const isHov = p === hoveredPoint;

      // Glow
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, dr * 4);
      glow.addColorStop(0, nodeColor(p.intensity, (isHov ? 0.35 : 0.2) * depthFade));
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(p.x, p.y, dr * 4, 0, Math.PI * 2);
      ctx.fill();

      // Dot
      ctx.fillStyle = nodeColor(p.intensity, (isHov ? 0.9 : 0.65) * depthFade);
      ctx.beginPath();
      ctx.arc(p.x, p.y, dr, 0, Math.PI * 2);
      ctx.fill();

      // Border ring
      ctx.strokeStyle = nodeColor(p.intensity, (isHov ? 1 : 0.5) * depthFade);
      ctx.lineWidth = isHov ? 1.5 : 0.8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, dr + 1, 0, Math.PI * 2);
      ctx.stroke();

      // Labels — always show for visible front-facing points
      if (p.visible && p.z > 0.05) {
        const fontSize = isHov ? 13 : 11;
        ctx.font = `${isHov ? '700' : '600'} ${fontSize}px ${mono}`;
        ctx.fillStyle = `rgba(255,255,255,${(isHov ? 1 : 0.75) * depthFade})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        // Shadow for readability
        ctx.shadowColor = 'rgba(0,0,0,.7)';
        ctx.shadowBlur = 4;
        ctx.fillText(p.name, p.x, p.y - dr - 4);
        ctx.shadowBlur = 0;

        ctx.font = `800 ${isHov ? 13 : 10}px ${mono}`;
        ctx.fillStyle = nodeColor(p.intensity, (isHov ? 1 : 0.85) * depthFade);
        ctx.textBaseline = 'top';
        ctx.shadowColor = 'rgba(0,0,0,.7)';
        ctx.shadowBlur = 4;
        ctx.fillText(p.suspects, p.x, p.y + dr + 3);
        ctx.shadowBlur = 0;
      }
    });

    // Outer highlight ring
    ctx.strokeStyle = 'rgba(220,0,0,.035)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.arc(cx, cy, R + 10, 0, Math.PI * 2);
    ctx.stroke();
    // Second ring for depth
    ctx.strokeStyle = 'rgba(220,0,0,.02)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.arc(cx, cy, R + 18, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
    _globeAnim = requestAnimationFrame(draw);
  }

  // Drag to rotate
  canvas.addEventListener('mousedown', e => {
    isDragging = true;
    autoRotate = false;
    clearTimeout(autoResumeTimer);
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    dragRotY = rotY;
    dragRotX = rotX;
  });
  window.addEventListener('mousemove', e => {
    if (isDragging) {
      rotY = dragRotY + (e.clientX - dragStartX) * 0.005;
      rotX = Math.max(-1.2, Math.min(1.2, dragRotX + (e.clientY - dragStartY) * 0.005));
    }
  });
  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      scheduleAutoResume();
    }
  });

  // Hover
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    hoveredPoint = null;
    const projected2 = points.map(p => ({ ...p, ...project(p.lat, p.lng) }));
    for (let i = projected2.length - 1; i >= 0; i--) {
      const p = projected2[i];
      if (!p.visible) continue;
      const dx = mouseX - p.x, dy = mouseY - p.y;
      const hitR = Math.max(p.dotR * ((p.z + 1) / 2), 8);
      if (Math.sqrt(dx*dx + dy*dy) <= hitR + 5) { hoveredPoint = p; break; }
    }
    if (hoveredPoint && !isDragging) {
      const n = hoveredPoint;
      canvas.style.cursor = 'pointer';
      tooltip.style.display = 'block';
      tooltip.innerHTML = `<div class="gt-name">${esc(n.name)}</div>
        <div>Подозреваемых: <span class="gt-val">${n.suspects}</span></div>
        <div>Подтверждено: <span class="gt-val gt-confirmed">${n.confirmed}</span></div>
        <div>На проверке: <span class="gt-val gt-checking">${n.checking}</span></div>
        ${n.week_new > 0 ? `<div>За неделю: <span class="gt-val gt-red">+${n.week_new}</span></div>` : ''}
        ${n.last_activity ? `<div style="margin-top:3px;font-size:10px;color:var(--text-d)">Активность: ${n.last_activity}</div>` : ''}`;
      let tx = mouseX + 16, ty = mouseY - 10;
      const tw = tooltip.offsetWidth, th = tooltip.offsetHeight;
      if (tx + tw > W) tx = mouseX - tw - 10;
      if (ty + th > H) ty = H - th - 5;
      if (ty < 0) ty = 5;
      tooltip.style.left = tx + 'px';
      tooltip.style.top = ty + 'px';
    } else {
      canvas.style.cursor = isDragging ? 'grabbing' : 'grab';
      tooltip.style.display = 'none';
    }
  });

  canvas.addEventListener('mouseleave', () => {
    hoveredPoint = null;
    tooltip.style.display = 'none';
    canvas.style.cursor = 'grab';
  });

  canvas.addEventListener('click', () => {
    if (hoveredPoint) applyServerFilter(hoveredPoint.id);
  });

  // Touch rotate
  let touchStartX = 0, touchStartY = 0, touchRotY = 0, touchRotX = 0;
  canvas.addEventListener('touchstart', e => {
    autoRotate = false;
    clearTimeout(autoResumeTimer);
    const t = e.touches[0];
    touchStartX = t.clientX; touchStartY = t.clientY;
    touchRotY = rotY; touchRotX = rotX;
  }, { passive: true });
  canvas.addEventListener('touchmove', e => {
    const t = e.touches[0];
    rotY = touchRotY + (t.clientX - touchStartX) * 0.005;
    rotX = Math.max(-1.2, Math.min(1.2, touchRotX + (t.clientY - touchStartY) * 0.005));
  }, { passive: true });
  canvas.addEventListener('touchend', () => {
    scheduleAutoResume();
  }, { passive: true });

  draw();
}

function buildStatBars(items){
  if(!items?.length)return'<span style="color:var(--text-d)">Нет данных</span>';
  const mx=Math.max(...items.map(x=>x.count||0),1);
  return items.map(it=>`<div class="stat-bar"><span class="stat-label">${esc(it.name)}</span><div class="stat-track"><div class="stat-fill" style="width:${((it.count||0)/mx*100).toFixed(1)}%"></div></div><span class="stat-count">${it.count||0}</span></div>`).join('');
}
function animateCountUp(el,target,duration=800){
  const start=performance.now();
  const update=(now)=>{const p=Math.min((now-start)/duration,1),e=1-Math.pow(1-p,3);el.textContent=Math.round(e*target).toLocaleString();if(p<1)requestAnimationFrame(update);else el.textContent=target.toLocaleString();};
  requestAnimationFrame(update);
}
function buildCheatCell(c) {
  const names = c.cheat_names && c.cheat_names.length ? c.cheat_names : (c.cheat_name ? [c.cheat_name] : []);
  return `<span style="color:var(--text-m)">${names.map(n=>esc(n)).join(', ')||'—'}</span>`;
}
function esc(s){if(!s)return'';return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function initUserMenu(){
  const btn=document.getElementById('userMenuBtn'),drop=document.getElementById('userDrop');
  if(!btn||!drop)return;
  btn.addEventListener('click',e=>{e.stopPropagation();drop.classList.toggle('open');});
  document.addEventListener('click',()=>drop.classList.remove('open'));
}
function toggleTheme(){
  const isLight=document.documentElement.getAttribute('data-theme')==='light';
  const next=isLight?'dark':'light';
  applyTheme(next);
  localStorage.setItem('archive5rp_theme',next);
}
function applyTheme(theme){
  const btn = document.getElementById('themeToggleBtn');
  if(theme==='light'){
    document.documentElement.setAttribute('data-theme','light');
    if(btn) btn.classList.add('is-light');
  }else{
    document.documentElement.removeAttribute('data-theme');
    if(btn) btn.classList.remove('is-light');
  }
}
(function(){
  const saved=localStorage.getItem('archive5rp_theme');
  if(saved==='light')applyTheme('light');
})();
/* ── DELETE COMMENT ── */
async function deleteComment(id, el) {
  showConfirm('Удалить комментарий?', async () => {
    const data = await api('/api/comment_delete.php', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({id, csrf: window.CSRF})
    });
    if (data?.ok) {
      el.closest('.comment-item')?.remove();
    }
  });
}
/* ── PROFILE CARD TILT & GLOW ── */
function initPcardTilt() {
  document.querySelectorAll('[data-pcard-tilt]').forEach(card => {
    const outer = card.closest('.pcard-outer');
    const glow = card.querySelector('.pcard-glow');
    const behindGlow = outer?.querySelector('.pcard-behind-glow');

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;

      const pctX = ((x / rect.width) * 100).toFixed(1);
      const pctY = ((y / rect.height) * 100).toFixed(1);

      if (glow) {
        glow.style.setProperty('--glow-x', pctX + '%');
        glow.style.setProperty('--glow-y', pctY + '%');
      }
      if (behindGlow) {
        behindGlow.style.setProperty('--glow-x', pctX + '%');
        behindGlow.style.setProperty('--glow-y', pctY + '%');
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateX(0) rotateY(0) scale(1)';
    });
  });
}

/* ── MEMBERS ── */
let _membersPage = 1, _membersDebTimer = null;
function membersDebounce() {
  clearTimeout(_membersDebTimer);
  _membersDebTimer = setTimeout(() => { _membersPage = 1; loadMembers(); }, 300);
}
async function loadMembers() {
  const q    = ($('membersSearch')?.value || '').trim();
  const role = $('membersRole')?.value || '';
  const sortBy = $('membersSort')?.value || '';
  const el   = $('membersTable');
  if (!el) return;
  el.innerHTML = '<div style="color:var(--text-d);text-align:center;padding:30px">Загрузка...</div>';
  const data = await api(`/api/members.php?${new URLSearchParams({q, role, sort_by: sortBy, page: _membersPage})}`);
  if (!data) { el.innerHTML = '<div class="alert alert-error">Ошибка загрузки</div>'; return; }
  const roleLabel = {admin:'ADMIN', moderator:'MOD', vip:'VIP', user:'USER'};
  const roleClass = {admin:'badge-admin', moderator:'badge-mod', vip:'badge-vip', user:'badge-user'};
  const nickClass  = {admin:'admin-username', moderator:'mod-username', vip:'vip-username'};
  if (!data.members || !data.members.length) {
    el.innerHTML = '<div style="color:var(--text-d);text-align:center;padding:30px;font-size:12px">Никого не найдено</div>';
    $('membersPager').innerHTML = ''; return;
  }
  let h = '<div class="members-grid">';
  data.members.forEach(u => {
    const nc = nickClass[u.role] || '';
    const nickHtml = nc
      ? `<div class="${nc} members-nick"><span>${esc(u.username)}</span></div>`
      : `<div class="members-nick-plain">${esc(u.username)}</div>`;
    const avatar = u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.username)}&background=1a0000&color=dc0000&size=64&bold=true&format=svg`;
    const fallbackAv = `https://ui-avatars.com/api/?name=${encodeURIComponent(u.username)}&background=1a0000&color=dc0000&size=64&bold=true&format=svg`;
    const hasRoleBorder = (u.role === 'admin' || u.role === 'moderator' || u.role === 'vip');
    const roleColorMap = {admin: 'admin', moderator: 'mod', vip: 'vip'};
    const borderClass = hasRoleBorder ? ` pcard-border-${roleColorMap[u.role]}` : '';

    h += `<div class="pcard-outer" onclick="openUserProfile(${u.id}, null, 'members')">
      ${hasRoleBorder ? '<div class="pcard-behind-glow"></div>' : ''}
      <div class="pcard-wrap${borderClass}" data-pcard-tilt>
        <div class="pcard-inner">
          <div class="pcard-glow"></div>
          <div class="member-av-wrap">
            <img class="member-av" src="${esc(avatar)}" alt="${esc(u.username)}" onerror="this.src='${fallbackAv}'">
          </div>
          <div class="member-info">
            ${nickHtml}
            <span class="user-badge ${roleClass[u.role]||'badge-user'}" style="font-size:9px;padding:1px 5px">${roleLabel[u.role]||'USER'}</span>
          </div>
          <div class="member-stats">
            <div class="member-stat"><span class="member-stat-val">${u.submitted||0}</span><span class="member-stat-lbl">заявок</span></div>
            <div class="member-stat"><span class="member-stat-val" style="color:var(--green)">${u.confirmed||0}</span><span class="member-stat-lbl">подтв.</span></div>
            <div class="member-stat"><span class="member-stat-val" style="color:var(--red)">${u.fake||0}</span><span class="member-stat-lbl">фейков</span></div>
          </div>
          <div class="member-date">${u.created_at ? new Date(u.created_at).toLocaleDateString('ru') : '—'}</div>
        </div>
      </div>
    </div>`;
  });
  h += '</div>';
  el.innerHTML = h;
  // ── Init card tilt & glow ──
  initPcardTilt();
  // Пагинация
  let pg = '';
  if (data.pages > 1) {
    pg = '<div class="pager">';
    for (let i = 1; i <= data.pages; i++) {
      pg += `<button class="pager-btn${i===_membersPage?' active':''}" onclick="_membersPage=${i};loadMembers()">${i}</button>`;
    }
    pg += `</div><div class="pager-info" style="text-align:center;margin-top:6px">${data.total} участников</div>`;
  } else {
    pg = `<div class="pager-info" style="text-align:center;margin-top:10px">${data.total} участников</div>`;
  }
  $('membersPager').innerHTML = pg;
}

// ══════════════════════════════════════
// Экспорт карточки читера в PNG
// ══════════════════════════════════════
async function exportCheaterCard(id) {
  const btn = document.getElementById('exportPngBtn');
  if (btn) { btn.disabled = true; btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/></svg> Генерация...'; }

  const data = await api(`/api/cheater.php?id=${id}`);
  if (!data || data.error) {
    if (btn) { btn.disabled = false; btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> PNG'; }
    return;
  }
  const c = data.cheater;

  const W = 760, H = 380;
  const canvas = document.createElement('canvas');
  canvas.width  = W * 2;
  canvas.height = H * 2;
  const ctx = canvas.getContext('2d');
  ctx.scale(2, 2); // Retina

  const statusColors = { confirmed: '#00c850', checking: '#f5a623', pending: '#4a9eff', fake: '#e00' };
  const statusLabels = { confirmed: 'ПОДТВЕРЖДЁН', checking: 'НА ПРОВЕРКЕ', pending: 'ОЖИДАЕТ', fake: 'ФЕЙК' };
  const sColor = statusColors[c.status] || '#888';
  const sLabel = statusLabels[c.status] || c.status.toUpperCase();

  // ── Фон
  ctx.fillStyle = '#080808';
  ctx.fillRect(0, 0, W, H);

  // ── Тонкая сетка
  ctx.strokeStyle = 'rgba(255,255,255,.025)';
  ctx.lineWidth = 0.5;
  for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  // ── Красный градиент левый верх
  const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, 320);
  grd.addColorStop(0, 'rgba(220,0,0,.18)');
  grd.addColorStop(1, 'rgba(220,0,0,0)');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, W, H);

  // ── Рамка
  ctx.strokeStyle = 'rgba(220,0,0,.35)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, 0, 0, W, H, 12);
  ctx.stroke();

  // ── Красная полоса сверху
  ctx.fillStyle = '#dc0000';
  ctx.fillRect(0, 0, W, 3);

  // ── ARCHIVEMALRP логотип
  ctx.font = '700 11px Courier New, monospace';
  ctx.fillStyle = '#dc0000';
  ctx.letterSpacing = '2px';
  ctx.fillText('ARCHIVEMALRP', 24, 30);
  ctx.letterSpacing = '0px';

  // ── Линия разделитель
  ctx.strokeStyle = 'rgba(220,0,0,.2)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(24, 40); ctx.lineTo(W - 24, 40); ctx.stroke();

  // ── Аватар (буква)
  // Верхняя зона: логотип + разделитель до y=48
  // Аватар стартует от y=56, радиус 36 → нижний край y=128
  const AX = 24, AY = 56, AR = 36;
  ctx.fillStyle = '#1a0000';
  ctx.beginPath(); ctx.arc(AX + AR, AY + AR, AR, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(220,0,0,.5)';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(AX + AR, AY + AR, AR, 0, Math.PI * 2); ctx.stroke();
  ctx.font = '700 28px Courier New, monospace';
  ctx.fillStyle = '#dc0000';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText((c.nick || '?')[0].toUpperCase(), AX + AR, AY + AR + 1);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  // ── Ник — центрируем по вертикали с аватаром (середина аватара = AY+AR = 92)
  const nickX = AX + AR * 2 + 18;
  ctx.font = '700 26px Courier New, monospace';
  ctx.fillStyle = '#ffffff';
  const nickTxt = truncate(ctx, c.nick || '—', W - nickX - 160);
  ctx.fillText(nickTxt, nickX, AY + AR + 10); // центр аватара + небольшой сдвиг вниз

  // ── Статус badge — по центру аватара по вертикали
  const badgeX = W - 24;
  const badgeW = 130, badgeH = 24;
  const badgeBX = badgeX - badgeW;
  const badgeBY = AY + AR - badgeH / 2; // выровнен по центру аватара
  ctx.fillStyle = sColor + '22';
  roundRect(ctx, badgeBX, badgeBY, badgeW, badgeH, 4);
  ctx.fill();
  ctx.strokeStyle = sColor + '66';
  ctx.lineWidth = 1;
  roundRect(ctx, badgeBX, badgeBY, badgeW, badgeH, 4);
  ctx.stroke();
  ctx.fillStyle = sColor;
  ctx.beginPath(); ctx.arc(badgeBX + 12, badgeBY + badgeH / 2, 4, 0, Math.PI * 2); ctx.fill();
  ctx.font = '700 10px Courier New, monospace';
  ctx.fillStyle = sColor;
  ctx.textAlign = 'center';
  ctx.fillText(sLabel, badgeBX + badgeW / 2 + 4, badgeBY + badgeH / 2 + 4);
  ctx.textAlign = 'left';

  // ── Метаданные — строго ПОСЛЕ нижнего края аватара + отступ
  const metaY = AY + AR * 2 + 22; // 56 + 72 + 22 = 150
  const metaItems = [
    ['СЕРВЕР',  c.server_name  || '—'],
    ['ДИСКОРД', c.discord_tag  || '—'],
    ['ДАТА',    c.date         || '—'],
    ['ПРОСМОТРЫ', String(c.views || 0)],
  ];
  metaItems.forEach((item, i) => {
    const mx = 24 + i * 180;
    ctx.font = '600 9px Courier New, monospace';
    ctx.fillStyle = '#555';
    ctx.fillText(item[0], mx, metaY);
    ctx.font = '600 12px Courier New, monospace';
    ctx.fillStyle = '#ccc';
    const val = truncate(ctx, item[1], 160);
    ctx.fillText(val, mx, metaY + 18);
  });

  // ── Разделитель
  ctx.strokeStyle = 'rgba(255,255,255,.06)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(24, metaY + 30); ctx.lineTo(W - 24, metaY + 30); ctx.stroke();

  // ── Описание
  const descY = metaY + 50;
  ctx.font = '600 9px Courier New, monospace';
  ctx.fillStyle = '#555';
  ctx.fillText('ОПИСАНИЕ', 24, descY - 12);
  ctx.font = '400 12px Courier New, monospace';
  ctx.fillStyle = '#999';
  const desc = c.description || 'Не указано';
  wrapText(ctx, desc, 24, descY, W - 48, 18, 2);

  // ── Голосование
  const voteY = descY + 52;
  ctx.font = '600 9px Courier New, monospace';
  ctx.fillStyle = '#555';
  ctx.fillText('ГОЛОСОВАНИЕ', 24, voteY);

  // Верю
  ctx.fillStyle = 'rgba(0,200,80,.1)';
  roundRect(ctx, 24, voteY + 8, 100, 26, 4); ctx.fill();
  ctx.strokeStyle = 'rgba(0,200,80,.25)'; ctx.lineWidth = 1;
  roundRect(ctx, 24, voteY + 8, 100, 26, 4); ctx.stroke();
  ctx.font = '700 11px Courier New, monospace';
  ctx.fillStyle = '#00c850';
  ctx.textAlign = 'center';
  ctx.fillText(`✓ Верю (${c.votes_believe || 0})`, 74, voteY + 25);

  // Не верю
  ctx.fillStyle = 'rgba(220,0,0,.1)';
  roundRect(ctx, 136, voteY + 8, 110, 26, 4); ctx.fill();
  ctx.strokeStyle = 'rgba(220,0,0,.25)'; ctx.lineWidth = 1;
  roundRect(ctx, 136, voteY + 8, 110, 26, 4); ctx.stroke();
  ctx.fillStyle = '#dc0000';
  ctx.fillText(`✗ Не верю (${c.votes_not || 0})`, 191, voteY + 25);
  ctx.textAlign = 'left';

  // Чит
  if (c.cheat_names && c.cheat_names.length) {
    ctx.font = '600 9px Courier New, monospace';
    ctx.fillStyle = '#555';
    ctx.fillText('ЧИТ', 300, voteY);
    ctx.font = '700 12px Courier New, monospace';
    ctx.fillStyle = '#f5a623';
    ctx.fillText(c.cheat_names.join(', '), 300, voteY + 20);
  }

  // ── URL сайта внизу
  ctx.font = '400 10px Courier New, monospace';
  ctx.fillStyle = '#333';
  ctx.textAlign = 'right';
  ctx.fillText('archivemalrp.ru · #' + c.id, W - 24, H - 14);
  ctx.textAlign = 'left';

  // ── Скачать
  const link = document.createElement('a');
  link.download = `archive5rp-${c.nick || id}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();

  if (btn) { btn.disabled = false; btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> PNG'; }
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function truncate(ctx, text, maxW) {
  if (ctx.measureText(text).width <= maxW) return text;
  let t = text;
  while (t.length > 0 && ctx.measureText(t + '…').width > maxW) t = t.slice(0, -1);
  return t + '…';
}

function wrapText(ctx, text, x, y, maxW, lineH, maxLines) {
  const words = text.split(' ');
  let line = '', lines = 0;
  for (let i = 0; i < words.length; i++) {
    const test = line ? line + ' ' + words[i] : words[i];
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, y + lines * lineH);
      line = words[i]; lines++;
      if (lines >= maxLines) { ctx.fillText(truncate(ctx, line, maxW), x, y + lines * lineH); return; }
    } else { line = test; }
  }
  if (line) ctx.fillText(line, x, y + lines * lineH);
}


// ══════════════════════════════════════
// Hover-preview читера
// ══════════════════════════════════════
let _hoverTimer = null, _hoverEl = null, _hoverAjax = null;

function initHoverPreview() {
  const tip = document.createElement('div');
  tip.id = 'hoverTip';
  tip.className = 'hover-tip';
  document.body.appendChild(tip);
}

function onNickEnter(e, id) {
  clearTimeout(_hoverTimer);
  if (_hoverAjax) { _hoverAjax = null; }
  const anchor = e.currentTarget; // сохраняем ДО setTimeout — currentTarget обнуляется после события
  _hoverTimer = setTimeout(() => showHoverTip(anchor, id), 320);
}
function onNickLeave(e) {
  if (e && e.currentTarget && e.currentTarget.contains(e.relatedTarget)) return;
  clearTimeout(_hoverTimer);
  const tip = document.getElementById('hoverTip');
  if (tip) { tip.classList.remove('visible'); }
}

async function showHoverTip(anchor, id) {
  const tip = document.getElementById('hoverTip');
  if (!tip) return;
  tip.classList.remove('visible');
  tip.innerHTML = '<div class="htip-loading"><span class="htip-spin"></span></div>';
  positionTip(tip, anchor);
  tip.classList.add('visible');

  const data = await api(`/api/cheater.php?id=${id}&preview=1`).catch(() => null);
  if (!data || data.error) { tip.classList.remove('visible'); return; }
  const c = data.cheater;
  const sColors = { confirmed:'#00c850', checking:'#f5a623', pending:'#4a9eff', fake:'#e00' };
  const sLabels = { confirmed:'Подтверждён', checking:'На проверке', pending:'Ожидает', fake:'Фейк' };
  const col = sColors[c.status] || '#888';
  const lbl = sLabels[c.status] || c.status;
  const ev = data.evidence || [];
  const thumb = ev.find(x => x.type === 'screenshot');
  tip.innerHTML = `
    <div class="htip-body">
      ${thumb ? `<div class="htip-thumb" style="background-image:url('${esc(thumb.url)}')"></div>` : ''}
      <div class="htip-info">
        <div class="htip-nick-row">
          <div class="htip-nick">${esc(c.nick)}</div>
          <div class="htip-badge" style="color:${col};border-color:${col}22;background:${col}11">
            <span style="width:5px;height:5px;border-radius:50%;background:${col};display:inline-block;margin-right:4px;flex-shrink:0"></span>${lbl}
          </div>
        </div>
        <div class="htip-row"><span class="htip-lbl">Сервер</span><span class="htip-val">${esc(c.server_name||'—')}</span></div>
        ${c.discord_tag ? `<div class="htip-row"><span class="htip-lbl">Discord</span><span class="htip-val htip-discord">${esc(c.discord_tag)}</span></div>` : ''}
        <div class="htip-row"><span class="htip-lbl">Чит</span><span class="htip-val" style="color:#f5a623">${esc((c.cheat_names||[c.cheat_name||'—']).join(', '))}</span></div>
        <div class="htip-row htip-votes">
          <span style="color:#00c850">✓ ${c.votes_believe||0}</span>
          <span style="color:#e00">✗ ${c.votes_not||0}</span>
          <span class="htip-views">${c.views||0} просм.</span>
        </div>
      </div>
    </div>
    <div class="htip-footer">Нажмите для просмотра</div>`;
  positionTip(tip, anchor);
}

function positionTip(tip, anchor) {
  const rect = anchor.getBoundingClientRect();
  const tw = 260, th = 300, margin = 8;
  let left = rect.left;
  let top  = rect.bottom + margin;
  if (left + tw > window.innerWidth - 10) left = window.innerWidth - tw - 10;
  if (left < 8) left = 8;
  if (top + th > window.innerHeight - 10) top = rect.top - th - margin;
  tip.style.left = left + 'px';
  tip.style.top  = top + 'px';
}

// Патчим nickHtml чтобы добавить hover события
function nickHtmlWithPreview(c) {
  const base = `onmouseenter="onNickEnter(event,${c.id})" onmouseleave="onNickLeave(event)"`;
  if (c.submitted_by_role==='admin')
    return `<span class="nick-admin" onclick="openProfile(${c.id})" ${base}><span>${esc(c.nick)}</span></span>`;
  if (c.submitted_by_role==='moderator')
    return `<span class="nick-mod" onclick="openProfile(${c.id})" ${base}><span>${esc(c.nick)}</span></span>`;
  if (c.submitted_by_role==='vip')
    return `<span class="nick-vip" onclick="openProfile(${c.id})" ${base}><span>${esc(c.nick)}</span></span>`;
  return `<span class="nick-link" onclick="openProfile(${c.id})" ${base}>${esc(c.nick)}</span>`;
}

// ══════════════════════════════════════
// Лента активности
// ══════════════════════════════════════
document.addEventListener('DOMContentLoaded', async()=>{
  initHoverPreview();
  document.querySelectorAll('.nav-btn[data-page]').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.page)));
  // Back buttons — вставляем SVG иконку
  document.querySelectorAll('.back-btn').forEach(btn=>{
    const raw=btn.textContent||btn.innerText;
    const txt=raw.replace(/←|←/g,'').trim()||'Назад';
    btn.innerHTML=`${ICONS.back}<span>${txt}</span>`;
  });
  // Кастомный чекбокс
  document.querySelectorAll('.check-row').forEach(row => {
    const cb = row.querySelector('input[type="checkbox"]');
    const box = row.querySelector('.check-box');
    if (!cb || !box) return;
    const sync = () => box.classList.toggle('checked', cb.checked);
    cb.addEventListener('change', sync);
    box.addEventListener('click', e => { e.stopPropagation(); cb.checked = !cb.checked; sync(); });
    row.addEventListener('click', e => { if (e.target === row || (e.target.tagName === 'SPAN' && !e.target.classList.contains('check-box'))) { cb.checked = !cb.checked; sync(); } });
  });
  document.querySelectorAll('input[name="searchType"]').forEach(r => r.addEventListener('change', e => {
    searchType = e.target.value;
    const ph = {nick:'Введите ник...',server:'Введите сервер...',cheat:'Введите чит...',discord:'Введите Discord...'};
    const si = $('searchInput'); if (si) si.placeholder = ph[searchType] || '';
    doSearch();
  }));
  const si=$('searchInput');if(si)si.addEventListener('input',doSearch);
  initUserMenu();
  const fd=await api('/api/form_data.php');
  if(fd){
    initFilterCS('csFilterServer', [{id:'',name:'Все серверы'}].concat((fd.servers||[]).map(s=>({id:String(s.id),name:s.name}))), '');
    initFilterCS('csMembersRole', [
    {id:'', name:'Все роли'}, {id:'admin', name:'Admin'},
    {id:'moderator', name:'Moderator'}, {id:'vip', name:'VIP'}, {id:'user', name:'User'}
  ], '');
  initFilterCS('csMembersSort', [
    {id:'', name:'По умолчанию'},
    {id:'submitted', name:'По заявкам ↓'},
    {id:'confirmed', name:'По подтверждённым ↓'},
    {id:'fake', name:'По фейкам ↓'}
  ], '');
  initFilterCS('csFilterCheat',  [{id:'',name:'Все читы'}].concat((fd.cheats||[]).map(c=>({id:String(c.id),name:c.name}))),  '');
  }
  loadHome();
  const urlCheaterId = new URLSearchParams(location.search).get('cheater');
  if(urlCheaterId && !isNaN(urlCheaterId)) openProfile(Number(urlCheaterId));
});
/* ═══════════════════════════════════════
   USER PUBLIC PROFILE
   ═══════════════════════════════════════ */
let _userProfileFrom = null; // id читера откуда перешли
let _userProfileFromPage = null; // страница откуда перешли
function openUserProfile(userId, fromCheaterId, fromPage) {
  _userProfileFrom = fromCheaterId || null;
  _userProfileFromPage = fromPage || null;
  closeMobileMenu();
  navigate('user-profile');
  setTimeout(() => {
    const btn = document.getElementById('userProfileBackBtn');
    if (btn) btn.innerHTML = _userProfileFrom ? `<svg width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M19 12H5\"/><polyline points=\"12 5 5 12 12 19\"/></svg> Назад к читеру` : _userProfileFromPage === 'members' ? `<svg width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M19 12H5\"/><polyline points=\"12 5 5 12 12 19\"/></svg> К участникам` : `<svg width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M19 12H5\"/><polyline points=\"12 5 5 12 12 19\"/></svg> Назад`;
  }, 50);
  loadUserProfile(userId);
}
function userProfileGoBack() {
  if (_userProfileFrom) {
    openProfile(_userProfileFrom);
  } else if (_userProfileFromPage === 'members') {
    navigate('members');
  } else {
    navigate('home');
  }
}
async function loadUserProfile(userId) {
  window._publicProfileUserId = userId;
  const wrap = document.getElementById('userProfileContent');
  if (!wrap) return;
  wrap.innerHTML = '<div style="color:var(--text-d);text-align:center;padding:40px">Загрузка...</div>';
  const data = await fetch(BASE + '/api/public_profile.php?id=' + userId, {
    headers: { 'X-Requested-With': 'XMLHttpRequest' }
  }).then(r => r.json()).catch(() => null);
  if (!data || data.error) {
    wrap.innerHTML = `<div class="alert" style="margin:20px 0">${esc(data?.error || 'Пользователь не найден')}</div>`;
    return;
  }
  if (data.banned) {
    const uname = data.user?.username || 'Пользователь';
    wrap.innerHTML = `<div class="banned-profile-card">
      <div class="banned-avatar">
        <img src="https:
        <div class="banned-overlay"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg></div>
      </div>
      <div class="banned-info">
        <div class="banned-nick">${esc(uname)}</div>
        <div class="banned-label">Аккаунт заблокирован</div>
        <div class="banned-desc">Этот пользователь был заблокирован администрацией. Его профиль недоступен.</div>
      </div>
    </div>`;
    return;
  }
  // Используем тот же рендер что и в cabinet.js, но без уведомлений
  if (typeof renderPublicProfile === 'function') {
    wrap.innerHTML = renderPublicProfile(data);
    userProfileTab('reports');
    // Анимация счётчиков
    animateCounter('ups-total',     data.stats.total_submitted);
    animateCounter('ups-confirmed', data.stats.confirmed);
    animateCounter('ups-checking',  data.stats.checking);
    animateCounter('ups-fake',      data.stats.fake);
    // Анимация stat-track баров
    const s = data.stats;
    const total = s.total_submitted || 1;
    setTimeout(() => {
      if (typeof animateBar === 'function') {
        animateBar('bar-confirmed', s.confirmed / total * 100);
        animateBar('bar-checking',  s.checking  / total * 100);
        animateBar('bar-pending',   s.pending   / total * 100);
        animateBar('bar-fake',      s.fake      / total * 100);
      }
    }, 300);
  }
}
function userProfileTab(name) {
  document.querySelectorAll('.up-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === name));
  document.querySelectorAll('.up-tab-content').forEach(c => c.style.display = c.id === 'uptc-' + name ? '' : 'none');
  if (name === 'achievements' && window._publicProfileUserId) loadAchievements(window._publicProfileUserId, 'upAchievementsContent');
}
function animateCounter(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  let n = 0; const step = Math.max(1, Math.ceil(target / 30));
  const t = setInterval(() => { n = Math.min(n + step, target); el.textContent = n; if (n >= target) clearInterval(t); }, 30);
}

// ===== СКАММЕРЫ =====
async function loadScammers() {
  const topEl = document.getElementById('topScammers');
  const allEl = document.getElementById('allScammers');
  if (!topEl || !allEl) return;
  topEl.innerHTML = '<div style="color:var(--text-d);text-align:center;padding:20px">Загрузка...</div>';
  allEl.innerHTML  = '<div style="color:var(--text-d);text-align:center;padding:20px">Загрузка...</div>';
  try {
    const data = await api('/api/scammers.php');
    renderScammers(data);
  } catch(e) {
    topEl.innerHTML = '<div style="color:var(--text-d);text-align:center;padding:20px">База скаммеров пуста или недоступна</div>';
    allEl.innerHTML = '<div style="color:var(--text-d);text-align:center;padding:20px">—</div>';
  }
}

function renderScammers(data) {
  const topEl = document.getElementById('topScammers');
  const allEl = document.getElementById('allScammers');
  if (!topEl || !allEl) return;

  const scammers = data?.scammers || [];
  if (!scammers.length) {
    topEl.innerHTML = '<div style="color:var(--text-d);text-align:center;padding:20px">Записей пока нет</div>';
    allEl.innerHTML = '<div style="color:var(--text-d);text-align:center;padding:20px">—</div>';
    return;
  }

  const top3 = scammers.slice(0, 3);
  topEl.innerHTML = top3.map((s, i) => `
    <div class="cheater-card" style="margin-bottom:10px;display:flex;align-items:center;gap:14px;padding:12px 16px">
      <span style="font-size:18px;font-weight:800;color:var(--accent);min-width:24px">#${i+1}</span>
      <div style="flex:1">
        <div style="font-weight:700;color:var(--text)">${esc(s.nick)}</div>
        <div style="font-size:12px;color:var(--text-d)">${esc(s.discord || '—')} · ${esc(s.server || '—')}</div>
      </div>
      <span class="status-badge confirmed">СКАММЕР</span>
    </div>
  `).join('');

  allEl.innerHTML = `
    <table style="width:100%;border-collapse:collapse;font-size:13px">
      <thead><tr style="color:var(--text-d);border-bottom:1px solid var(--border)">
        <th style="text-align:left;padding:8px">НИК</th>
        <th style="text-align:left;padding:8px">DISCORD</th>
        <th style="text-align:left;padding:8px">СЕРВЕР</th>
        <th style="text-align:left;padding:8px">СУММА</th>
        <th style="text-align:left;padding:8px">ДАТА</th>
        <th style="text-align:left;padding:8px">СТАТУС</th>
      </tr></thead>
      <tbody>${scammers.map(s=>`<tr style="border-bottom:1px solid var(--border)">
        <td style="padding:8px;color:var(--accent);font-weight:600">${esc(s.nick)}</td>
        <td style="padding:8px;color:var(--text-d)">${esc(s.discord||'—')}</td>
        <td style="padding:8px;color:var(--text)">${esc(s.server||'—')}</td>
        <td style="padding:8px;color:var(--text)">${esc(s.amount||'—')}</td>
        <td style="padding:8px;color:var(--text-d)">${esc(s.date||'—')}</td>
        <td style="padding:8px"><span class="status-badge confirmed">ПОДТВЕРЖДЁН</span></td>
      </tr>`).join('')}</tbody>
    </table>
  `;
}

async function searchScammers() {
  const q = document.getElementById('scammerSearchInput')?.value?.trim();
  if (!q) { loadScammers(); return; }
  const allEl = document.getElementById('allScammers');
  allEl.innerHTML = '<div style="color:var(--text-d);text-align:center;padding:20px">Поиск...</div>';
  try {
    const data = await api('/api/scammers.php?q=' + encodeURIComponent(q));
    const scammers = data?.scammers || [];
    if (!scammers.length) {
      allEl.innerHTML = '<div style="color:var(--text-d);text-align:center;padding:20px">Ничего не найдено</div>';
      return;
    }
    renderScammers(data);
  } catch(e) {
    allEl.innerHTML = '<div style="color:var(--text-d);text-align:center;padding:20px">Ошибка поиска</div>';
  }
}
