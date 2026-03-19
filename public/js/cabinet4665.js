async function userLike(targetId, type) {
  if (!window.IS_LOG) {
    if (typeof showToast === 'function') showToast('Войдите чтобы поставить оценку');
    else showAlert('Войдите чтобы поставить оценку','info');
    return;
  }
  const likeBtn    = document.getElementById('ulBtn-like-' + targetId);
  const dislikeBtn = document.getElementById('ulBtn-dislike-' + targetId);
  const likeCnt    = document.getElementById('ulCnt-like-' + targetId);
  const dislikeCnt = document.getElementById('ulCnt-dislike-' + targetId);
  const r = await fetch('/api/user_like.php', {
    method: 'POST',
    headers: {'Content-Type':'application/json','X-Requested-With':'XMLHttpRequest'},
    body: JSON.stringify({target_id: targetId, type, csrf: window.CSRF})
  });
  const data = await r.json().catch(()=>null);
  if (!data?.ok) { if(typeof showToast==='function') showToast(data?.error||'Ошибка'); return; }
  if (likeCnt)    likeCnt.textContent    = data.likes;
  if (dislikeCnt) dislikeCnt.textContent = data.dislikes;
  const likeHeart    = likeBtn?.querySelector('svg');
  const dislikeHeart = dislikeBtn?.querySelector('svg');
  if (data.my_vote === 'like') {
    likeBtn?.classList.add('active-like');
    dislikeBtn?.classList.remove('active-dislike');
    if (likeHeart)    likeHeart.setAttribute('fill','currentColor');
    if (dislikeHeart) dislikeHeart.setAttribute('fill','none');
  } else if (data.my_vote === 'dislike') {
    dislikeBtn?.classList.add('active-dislike');
    likeBtn?.classList.remove('active-like');
    if (dislikeHeart) dislikeHeart.setAttribute('fill','currentColor');
    if (likeHeart)    likeHeart.setAttribute('fill','none');
  } else {
    likeBtn?.classList.remove('active-like');
    dislikeBtn?.classList.remove('active-dislike');
    if (likeHeart)    likeHeart.setAttribute('fill','none');
    if (dislikeHeart) dislikeHeart.setAttribute('fill','none');
  }
}
const CICONS = {
  lock:    `<svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  list:    `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
  bell:    `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  comment:`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  star:    `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  check:   `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  x:       `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  inbox:   `<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>`,
  belloff: `<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"><path d="M13.73 21a2 2 0 0 1-3.46 0"/><path d="M18.63 13A17.89 17.89 0 0 1 18 8"/><path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"/><path d="M18 8a6 6 0 0 0-9.33-5"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`,
  speech:  `<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  vote:    `<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
  eye:     `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  flag:    `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>`,
  disc:    `<svg width="18" height="14" viewBox="0 0 71 55" fill="currentColor"><path d="M60.1 4.9A58.5 58.5 0 0 0 45.7.5a.22.22 0 0 0-.23.1 40.8 40.8 0 0 0-1.8 3.7 54 54 0 0 0-16.2 0A37.6 37.6 0 0 0 25.6.6a.23.23 0 0 0-.23-.1A58.4 58.4 0 0 0 11 4.9a.2.2 0 0 0-.1.08C1.6 18.7-1 32.2.3 45.5a.24.24 0 0 0 .09.17 58.8 58.8 0 0 0 17.7 8.9.23.23 0 0 0 .25-.08 42 42 0 0 0 3.6-5.9.23.23 0 0 0-.12-.32 38.7 38.7 0 0 1-5.5-2.6.23.23 0 0 1-.02-.38l1.1-.86a.22.22 0 0 1 .23-.03c11.6 5.3 24.1 5.3 35.5 0a.22.22 0 0 1 .23.03l1.1.86a.23.23 0 0 1-.02.38 36.4 36.4 0 0 1-5.5 2.6.23.23 0 0 0-.13.32 47.1 47.1 0 0 0 3.6 5.9.22.22 0 0 0 .25.08A58.6 58.6 0 0 0 70.6 45.7a.23.23 0 0 0 .09-.17C73.2 30.1 69 16.7 60.2 5a.18.18 0 0 0-.1-.08z"/></svg>`,
};
async function loadCabinet(initialTab) {
  const content = document.getElementById('cabinetContent');
  if (!content) return;
  content.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;padding:60px;gap:12px;color:var(--text-d)">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin .8s linear infinite"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
    Загрузка...
  </div>`;
  const data = await fetch(BASE + '/api/profile.php', { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
    .then(r => r.json()).catch(() => null);
  if (!data || data.error) {
    content.innerHTML = `<div class="auth-wall">
      <div class="auth-wall-icon" style="color:var(--text-d)">${CICONS.lock}</div>
      <div class="auth-wall-title">Требуется авторизация</div>
      <div class="auth-wall-sub">Войдите через Discord чтобы открыть личный кабинет</div>
      <a href="${BASE}/auth/discord_login.php" class="discord-btn" style="display:inline-flex;margin:0 auto">
        ${CICONS.disc} Войти через Discord
      </a>
    </div>`;
    return;
  }
  const u = data.user, s = data.stats;
  const isAdmin = u.role === 'admin', isMod = u.role === 'moderator', isVip = u.role === 'vip';
  const roleClass = isAdmin ? 'badge-admin' : (isMod ? 'badge-mod' : (isVip ? 'badge-vip' : 'badge-user'));
  const roleLabel = isAdmin ? 'ADMIN' : (isMod ? 'MOD' : (isVip ? 'VIP' : 'USER'));
  let usernameHtml;
  if (isAdmin)
    usernameHtml = `<div class="admin-username" style="font-size:16px;margin-bottom:5px"><span>${esc(u.username)}</span></div>`;
  else if (isMod)
    usernameHtml = `<div class="mod-username" style="font-size:16px;margin-bottom:5px"><span>${esc(u.username)}</span></div>`;
  else if (isVip)
    usernameHtml = `<div class="vip-username" style="font-size:16px;margin-bottom:5px"><span>${esc(u.username)}</span></div>`;
  else
    usernameHtml = `<div class="cabinet-username">${esc(u.username)}</div>`;
  const avatarClass = isAdmin ? 'cabinet-avatar admin-av' : (isMod ? 'cabinet-avatar mod-av' : (isVip ? 'cabinet-avatar vip-av' : 'cabinet-avatar'));
  let html = `<div class="cabinet-layout">
  <!-- SIDEBAR -->
  <div class="cabinet-sidebar">
    <div class="card" style="padding:0;overflow:hidden">
      <div class="cabinet-avatar-wrap">
        <div class="${avatarClass}"><img src="${esc(u.avatar)}" alt=""></div>
        ${usernameHtml}
        <div class="cabinet-discord-id">ID: ${esc(u.discord_id)}</div>
        <span class="user-badge ${roleClass}">${roleLabel}</span>
        ${(isAdmin || isMod || isVip) ? `
        <div style="margin-top:10px;width:100%;padding:0 16px 4px">
          <div style="display:flex;gap:5px;align-items:center">
            <input id="cabinetNickInput" class="form-input" style="font-size:11.5px;padding:5px 8px;height:30px;flex:1" 
              value="${esc(u.username)}" maxlength="50" placeholder="Новый никнейм"
              onkeydown="if(event.key==='Enter')changeUsername()">
            <button onclick="changeUsername()" class="action-btn" style="padding:5px 8px;font-size:11px;height:30px;white-space:nowrap">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            </button>
          </div>
          <div id="cabinetNickError" style="color:var(--red);font-size:10.5px;margin-top:3px;display:none"></div>
        </div>` : ''}
      </div>
      <div class="cabinet-meta">
        <div class="cabinet-meta-row"><span class="cabinet-meta-label">Зарегистрирован</span><span class="cabinet-meta-val">${u.registered}</span></div>
        <div class="cabinet-meta-row"><span class="cabinet-meta-label">Последний вход</span><span class="cabinet-meta-val">${u.last_login}</span></div>
        <div class="cabinet-meta-row"><span class="cabinet-meta-label">Подано заявок</span><span class="cabinet-meta-val" style="color:var(--accent)" id="cMeta-submitted">0</span></div>
        <div class="cabinet-meta-row"><span class="cabinet-meta-label">Голосований</span><span class="cabinet-meta-val" id="cMeta-votes">0</span></div>
        <div class="cabinet-meta-row"><span class="cabinet-meta-label">Комментариев</span><span class="cabinet-meta-val" id="cMeta-comments">0</span></div>
      </div>
    </div>
    ${data.unread > 0 ? `<div class="alert alert-warning" style="margin-top:10px;cursor:pointer;display:flex;align-items:center;gap:6px" onclick="cabinetTab('notifs')">${CICONS.bell} <span>Непрочитанных: <b>${data.unread}</b></span></div>` : ''}
    <div class="card" style="margin-top:10px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div style="background:var(--bg-input);border:1px solid var(--border);border-radius:var(--radius);padding:10px 12px;text-align:center">
          <div style="font-size:22px;font-weight:800;color:var(--text-w);font-family:var(--mono)" id="cCard-total">0</div>
          <div style="font-size:9px;color:var(--text-d);text-transform:uppercase;letter-spacing:.8px;margin-top:2px">Всего заявок</div>
        </div>
        <div style="background:var(--bg-input);border:1px solid var(--border);border-radius:var(--radius);padding:10px 12px;text-align:center">
          <div style="font-size:22px;font-weight:800;color:var(--green);font-family:var(--mono)" id="cCard-confirmed">0</div>
          <div style="font-size:9px;color:var(--text-d);text-transform:uppercase;letter-spacing:.8px;margin-top:2px">Подтверждено</div>
        </div>
        <div style="background:var(--bg-input);border:1px solid var(--border);border-radius:var(--radius);padding:10px 12px;text-align:center">
          <div style="font-size:22px;font-weight:800;color:var(--yellow);font-family:var(--mono)" id="cCard-checking">0</div>
          <div style="font-size:9px;color:var(--text-d);text-transform:uppercase;letter-spacing:.8px;margin-top:2px">На проверке</div>
        </div>
        <div style="background:var(--bg-input);border:1px solid var(--border);border-radius:var(--radius);padding:10px 12px;text-align:center">
          <div style="font-size:22px;font-weight:800;color:var(--red);font-family:var(--mono)" id="cCard-fake">0</div>
          <div style="font-size:9px;color:var(--text-d);text-transform:uppercase;letter-spacing:.8px;margin-top:2px">Фейков</div>
        </div>
        <div style="background:var(--bg-input);border:1px solid var(--border);border-radius:var(--radius);padding:10px 12px;text-align:center">
          <div style="font-size:22px;font-weight:800;color:var(--blue);font-family:var(--mono)" id="cCard-pending">0</div>
          <div style="font-size:9px;color:var(--text-d);text-transform:uppercase;letter-spacing:.8px;margin-top:2px">Ожидают</div>
        </div>
        <div style="background:var(--bg-input);border:1px solid var(--border);border-radius:var(--radius);padding:10px 12px;text-align:center">
          <div style="font-size:22px;font-weight:800;color:var(--text);font-family:var(--mono)" id="cCard-votes">0</div>
          <div style="font-size:9px;color:var(--text-d);text-transform:uppercase;letter-spacing:.8px;margin-top:2px">Голосований</div>
        </div>
        <div style="background:var(--bg-input);border:1px solid var(--border);border-radius:var(--radius);padding:10px 12px;text-align:center;grid-column:1 / -1">
          <div style="font-size:22px;font-weight:800;color:var(--text);font-family:var(--mono)" id="cCard-comments">0</div>
          <div style="font-size:9px;color:var(--text-d);text-transform:uppercase;letter-spacing:.8px;margin-top:2px">Комментариев</div>
        </div>
      </div>

      <div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border)">
        <div class="stat-bar"><span class="stat-label">Подтверждено</span><div class="stat-track"><div class="stat-fill" id="bar-confirmed" style="width:0;background:var(--green)"></div></div><span class="stat-count" style="color:var(--green)">${s.confirmed}</span></div>
        <div class="stat-bar"><span class="stat-label">На проверке</span><div class="stat-track"><div class="stat-fill" id="bar-checking" style="width:0;background:var(--yellow)"></div></div><span class="stat-count" style="color:var(--yellow)">${s.checking}</span></div>
        <div class="stat-bar"><span class="stat-label">Ожидают</span><div class="stat-track"><div class="stat-fill" id="bar-pending" style="width:0;background:var(--blue)"></div></div><span class="stat-count" style="color:var(--blue)">${s.pending}</span></div>
        <div class="stat-bar"><span class="stat-label">Фейков</span><div class="stat-track"><div class="stat-fill" id="bar-fake" style="width:0;background:var(--red)"></div></div><span class="stat-count" style="color:var(--red)">${s.fake}</span></div>
      </div>
      ${(()=>{
        const total = s.confirmed + s.fake;
        if (!total) return '';
        const pct = Math.round((s.confirmed / total) * 100);
        const color = pct >= 80 ? 'var(--green)' : pct >= 50 ? 'var(--yellow)' : 'var(--red)';
        const label = pct >= 80 ? 'Высокая' : pct >= 50 ? 'Средняя' : 'Низкая';
        return '<div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border)">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">' +
            '<span style="font-size:11px;color:var(--text-d);text-transform:uppercase;letter-spacing:.5px;font-family:var(--mono)">Репутация</span>' +
            '<span style="font-size:12px;font-weight:700;color:' + color + '">' + label + ' · ' + pct + '%</span>' +
          '</div>' +
          '<div style="height:4px;background:var(--border);border-radius:99px;overflow:hidden">' +
            '<div style="height:100%;width:' + pct + '%;background:' + color + ';border-radius:99px;transition:width .6s ease"></div>' +
          '</div>' +
          '<div style="display:flex;justify-content:space-between;margin-top:4px;font-size:10px;color:var(--text-d)">' +
            '<span>' + s.confirmed + ' подтверждено</span>' +
            '<span>' + s.fake + ' фейков</span>' +
          '</div>' +
        '</div>';
      })()}
    </div>
  </div>
  <!-- CONTENT -->
  <div class="cabinet-content">
    ${buildActivityHeatmap(data.activity||{}, "", 18)}
    <div class="cabinet-tabs">
      <button class="cabinet-tab active" id="ctab-reports"  onclick="cabinetTab('reports')">${CICONS.list} Мои заявки</button>
      <button class="cabinet-tab" id="ctab-notifs"   onclick="cabinetTab('notifs')">${CICONS.bell} Уведомления${data.unread>0?`<span id="notifTabBadge" style="background:var(--accent);color:#fff;border-radius:99px;padding:0 5px;font-size:9px;margin-left:4px">${data.unread}</span>`:''}</button>
      <button class="cabinet-tab" id="ctab-comments" onclick="cabinetTab('comments')">${CICONS.comment} Комментарии</button>
      <button class="cabinet-tab" id="ctab-votes"    onclick="cabinetTab('votes')">${CICONS.star} Голоса</button>
      <button class="cabinet-tab" id="ctab-achievements" onclick="cabinetTab('achievements')">🏆 Достижения</button>
    </div>
    <div id="ctab-content-reports"  class="card cabinet-tab-content">${buildReportsTable(data.reports)}</div>
    <div id="ctab-content-notifs"   class="card cabinet-tab-content" style="display:none">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div class="card-title" style="margin-bottom:0">Уведомления</div>
        ${data.notifications.length?`<button class="action-btn" style="padding:4px 10px;font-size:11px" onclick="markNotifsRead()">Прочитать все</button>`:''}
      </div>
      ${buildNotifications(data.notifications)}
    </div>
    <div id="ctab-content-comments" class="card cabinet-tab-content" style="display:none"><div class="card-title">Мои комментарии</div>${buildCommentsList(data.comments)}</div>
    <div id="ctab-content-votes"    class="card cabinet-tab-content" style="display:none"><div class="card-title">Мои голоса</div>${buildVotesList(data.votes)}</div>
    <div id="ctab-content-achievements" class="card cabinet-tab-content" style="display:none"><div class="card-title">Достижения</div><div id="achievementsContent"><div style="color:var(--text-d);padding:20px;text-align:center">Загрузка...</div></div></div>
  </div>
</div>`;
  content.innerHTML = html;
  if (initialTab && initialTab !== 'reports') {
    cabinetTab(initialTab);
  }
  requestAnimationFrame(() => {
    const counters=[['cMeta-submitted',s.total_submitted],['cMeta-votes',s.votes_given],['cMeta-comments',s.comments_given],['cCard-total',s.total_submitted],['cCard-confirmed',s.confirmed],['cCard-checking',s.checking],['cCard-fake',s.fake],['cCard-pending',s.pending],['cCard-votes',s.votes_given],['cCard-comments',s.comments_given]];
    counters.forEach(([id,val],i)=>{const el=document.getElementById(id);if(el)setTimeout(()=>animateCountUp(el,val,700),i*40);});
    const total=s.total_submitted||1;
    setTimeout(()=>{
      animateBar('bar-confirmed',s.confirmed/total*100);
      animateBar('bar-checking', s.checking/total*100);
      animateBar('bar-pending',  s.pending/total*100);
      animateBar('bar-fake',     s.fake/total*100);
    },300);
  });
  window._cabinetData = data;
}
function animateBar(id,pct){const el=document.getElementById(id);if(!el)return;el.style.transition='width .8s cubic-bezier(.4,0,.2,1)';el.style.width=Math.min(100,pct).toFixed(1)+'%';}
function animateCountUp(el,target,duration=700){const start=performance.now();const update=(now)=>{const p=Math.min((now-start)/duration,1),e=1-Math.pow(1-p,3);el.textContent=Math.round(e*target).toLocaleString();if(p<1)requestAnimationFrame(update);else el.textContent=target.toLocaleString();};requestAnimationFrame(update);}
function cabinetTab(name){
  ['reports','notifs','comments','votes','achievements'].forEach(t=>{
    const btn=document.getElementById('ctab-'+t),cnt=document.getElementById('ctab-content-'+t);
    if(btn)btn.classList.toggle('active',t===name);
    if(cnt){const was=cnt.style.display==='none';cnt.style.display=t===name?'':'none';if(was&&t===name){cnt.classList.remove('cabinet-tab-content');void cnt.offsetWidth;cnt.classList.add('cabinet-tab-content');}}
  });
  if(name==='notifs')markNotifsRead();
  if(name==='achievements')loadAchievements();
}
function buildReportsTable(reports){
  if(!reports?.length)return`<div class="cabinet-empty">${CICONS.inbox}<br>Вы ещё не подавали заявок на читеров</div>`;
  const sc={confirmed:'var(--green)',checking:'var(--yellow)',pending:'var(--blue)',fake:'var(--red)'};
  const sl={confirmed:'Подтверждён',checking:'На проверке',pending:'Ожидает',fake:'Фейк'};
  return reports.map((r,i)=>`<div class="cabinet-report-row" style="animation-delay:${i*.05}s" onclick="openProfile(${r.id})">
    <div class="crr-left">
      <div class="crr-top">
        <span class="cabinet-report-nick">${esc(r.nick)}</span>
        <span class="crr-status" style="color:${sc[r.status]||'var(--text)'}">${sl[r.status]||r.status}</span>
      </div>
      <div class="crr-bottom">
        <span class="cabinet-report-meta">${esc(r.server_name)} · ${r.cheat_names?.length?r.cheat_names.map(n=>esc(n)).join(', '):esc(r.cheat_name)}${r.discord_tag?` · <span style="color:#5865f2">${esc(r.discord_tag)}</span>`:''}</span>
        <span class="crr-info">
          <span class="cabinet-report-date">${r.created}</span>
          <span style="display:inline-flex;align-items:center;gap:4px;color:var(--text-d);font-size:10.5px">${CICONS.eye} ${r.views} ${CICONS.flag} ${r.complaints}</span>
        </span>
      </div>
    </div>
  </div>`).join('');
}
function buildNotifications(notifs){
  if(!notifs?.length)return`<div class="cabinet-empty">${CICONS.belloff}<br>Уведомлений нет</div>`;
  const NEW_REPORT_ICON = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>';
  const icons={reported:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>',report_confirmed:CICONS.check,report_fake:CICONS.x,report_checking:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',comment:CICONS.comment,vote:CICONS.star,new_report:NEW_REPORT_ICON};
  return notifs.map((n,i)=>{
    const clickable = n.cheater_id;
    const style = clickable ? 'cursor:pointer' : '';
    const isAdminNotif = n.type === 'new_report';
    const onclick = isAdminNotif
      ? `onclick="window.location.href='/admin/'"` 
      : (clickable ? `onclick="navigate('profile');openProfile(${n.cheater_id})"` : '');
    const bgHover = clickable ? 'onmouseover="this.style.background=\'rgba(255,255,255,.03)\'" onmouseout="this.style.background=\'\'"' : '';
    const colors={report_confirmed:'var(--green)',report_fake:'var(--red)',report_checking:'var(--yellow)',report_pending:'var(--blue)',comment:'var(--accent)',vote:'var(--text-m)',new_report:'#ff6b35'};
    const color=colors[n.type]||'var(--text-m)';
    return `<div class="notif-item-full" style="animation-delay:${i*.04}s;${style};border-radius:var(--radius);transition:background .15s;padding:8px 6px" ${onclick} ${bgHover}>
      <div class="notif-dot-big ${n.is_read?'read':'unread'}"></div>
      <div style="flex:1">
        <div class="notif-msg" style="display:flex;align-items:center;gap:6px;color:${color}">${icons[n.type]||CICONS.bell} ${esc(n.message)}</div>
        <div class="notif-time">${n.date}${isAdminNotif
          ? ` · <span style="color:#ff6b35;font-size:10px;display:inline-flex;align-items:center;gap:3px">Перейти в админку <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><polyline points="12 5 19 12 12 19"/></svg></span>`
          : (clickable ? ` · <span style="color:var(--accent);font-size:10px;display:inline-flex;align-items:center;gap:3px">Перейти <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><polyline points="12 5 19 12 12 19"/></svg></span>` : '')
        }</div>
      </div>
    </div>`;
  }).join('');
}
function buildCommentsList(comments){
  if(!comments?.length)return`<div class="cabinet-empty">${CICONS.speech}<br>Вы ещё не оставляли комментариев</div>`;
  return comments.map((c,i)=>`<div style="padding:9px 0;border-bottom:1px solid var(--border-light);animation:fadeInRow .3s ease ${i*.05}s both">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px">
      <span style="font-size:11.5px;cursor:pointer;color:var(--accent);font-weight:700" onclick="openProfile(${c.cheater_id})">${esc(c.cheater_nick)}</span>
      <span style="font-size:10px;color:var(--text-d)">${c.date}</span>
    </div>
    <div style="font-size:12.5px;color:var(--text)">${esc(c.text)}</div>
  </div>`).join('');
}
function buildVotesList(votes){
  if(!votes?.length)return`<div class="cabinet-empty">${CICONS.vote}<br>Вы ещё не голосовали</div>`;
  return votes.map((v,i)=>{const ib=v.vote==='believe';return`<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border-light);animation:fadeInRow .3s ease ${i*.05}s both">
    <span style="color:${ib?'var(--green)':'var(--red)'}">${ib?CICONS.check:CICONS.x}</span>
    <span style="color:var(--accent);font-weight:700;cursor:pointer;font-size:12.5px" onclick="openProfile(${v.cheater_id})">${esc(v.cheater_nick)}</span>
    <span style="flex:1"></span>
    <span style="font-size:11px;font-weight:700;color:${ib?'var(--green)':'var(--red)'}">${ib?'Верю':'Не верю'}</span>
    <span style="font-size:10px;color:var(--text-d);font-family:var(--mono)">${v.date}</span>
  </div>`;}).join('');
}
async function changeUsername(){
  const input = document.getElementById('cabinetNickInput');
  const errEl = document.getElementById('cabinetNickError');
  if (!input) return;
  const username = input.value.trim();
  errEl.style.display = 'none';
  if (!username) return;
  const data = await fetch(BASE + '/api/change_username.php', {
    method: 'POST',
    headers: {'Content-Type':'application/json','X-Requested-With':'XMLHttpRequest'},
    body: JSON.stringify({username, csrf: window.CSRF})
  }).then(r => r.json()).catch(() => null);
  if (!data) { errEl.textContent = 'Ошибка запроса'; errEl.style.display = 'block'; return; }
  if (data.error) { errEl.textContent = data.error; errEl.style.display = 'block'; return; }
  const headerName = document.querySelector('.user-avatar-btn span');
  if (headerName) headerName.textContent = data.username;
  errEl.style.color = 'var(--green)';
  errEl.textContent = 'Никнейм изменён';
  errEl.style.display = 'block';
  setTimeout(() => { errEl.style.display = 'none'; errEl.style.color = 'var(--red)'; }, 2000);
}
async function markNotifsRead(){
  await fetch(BASE+'/api/notifications_read.php',{method:'POST',headers:{'Content-Type':'application/json','X-Requested-With':'XMLHttpRequest'},body:JSON.stringify({csrf:window.CSRF})});
  document.querySelectorAll('.notif-dot-big.unread').forEach(d=>{d.classList.remove('unread');d.classList.add('read');});
  const tabBadge = document.getElementById('notifTabBadge');
  if (tabBadge) tabBadge.remove();
  document.querySelectorAll('.alert-warning').forEach(el => el.remove());
  updateNotifBadge(0);
}
function esc(s){if(!s)return'';return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
/* ═══════════════════════════════════════
   PUBLIC USER PROFILE RENDERER
   ═══════════════════════════════════════ */

function buildActivityHeatmap(activity, cardStyle, numWeeks) {
  const today = new Date();
  today.setHours(0,0,0,0);
  const weeks = numWeeks || 18;
  const pad = n => String(n).padStart(2,'0');
  const fmt = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  const start = new Date(today);
  start.setDate(start.getDate() - weeks * 7 + 1);
  const startDow = start.getDay();
  const offset = (startDow === 0 ? 6 : startDow - 1);
  start.setDate(start.getDate() - offset);
  const cells = [];
  const cur = new Date(start);
  while (cur <= today) {
    cells.push({date: fmt(cur), cnt: activity[fmt(cur)] || 0});
    cur.setDate(cur.getDate() + 1);
  }
  const cols = Math.ceil(cells.length / 7);
  const maxVal = Math.max(...cells.map(c=>c.cnt), 1);
  const color = cnt => {
    if (!cnt) return 'var(--bg-input)';
    const t = cnt / maxVal;
    if (t < 0.25) return 'rgba(220,0,0,.25)';
    if (t < 0.5)  return 'rgba(220,0,0,.5)';
    if (t < 0.75) return 'rgba(220,0,0,.75)';
    return 'var(--accent)';
  };
  const months = ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'];
  const dows = ['Пн','','Ср','','Пт','',''];
  const total = cells.reduce((s,c)=>s+c.cnt,0);

  // Detect month boundaries: find the column that contains the 1st day of each new month
  const monthStartCols = new Map(); // col → month index
  for (let col = 1; col < cols; col++) {
    for (let row = 0; row < 7; row++) {
      const idx = col * 7 + row;
      if (idx >= cells.length) break;
      const d = new Date(cells[idx].date + 'T00:00:00');
      if (d.getDate() === 1 && !monthStartCols.has(col)) {
        monthStartCols.set(col, d.getMonth());
        break;
      }
    }
  }

  // Build grid with spacer columns at month boundaries
  let gridColTpl = '';
  let monthsColTpl = '20px ';
  let monthsHeaderHtml = '<div></div>';
  let cellsHtml = '';

  for (let col = 0; col < cols; col++) {
    // Insert spacer before month boundary
    if (monthStartCols.has(col)) {
      gridColTpl += '5px ';
      monthsColTpl += '5px ';
      monthsHeaderHtml += '<div></div>';
      for (let r = 0; r < 7; r++) cellsHtml += '<div></div>';
    }
    gridColTpl += '1fr ';
    monthsColTpl += '1fr ';

    // Month label — show on first column or at month boundary (where 1st is found)
    let monthLabel = '';
    if (monthStartCols.has(col)) {
      monthLabel = months[monthStartCols.get(col)];
    } else if (col === 0) {
      monthLabel = months[new Date(cells[0].date + 'T00:00:00').getMonth()];
    }
    monthsHeaderHtml += monthLabel ? `<div class="hm-month">${monthLabel}</div>` : '<div></div>';

    // Cells for this column
    for (let row = 0; row < 7; row++) {
      const idx = col * 7 + row;
      if (idx < cells.length) {
        const c = cells[idx];
        const dd = c.date.split('-').reverse().join('.');
        cellsHtml += `<div class="hm-cell" style="background:${color(c.cnt)}" title="${c.cnt ? c.cnt+' заявок — '+dd : dd}"></div>`;
      } else {
        cellsHtml += '<div></div>';
      }
    }
  }

  const totalCols = cols + monthStartCols.size;
  return `
<div class="card" style="${cardStyle !== undefined ? cardStyle : 'margin-top:10px'}">
  <div style="font-size:10px;color:var(--text-d);text-transform:uppercase;letter-spacing:.5px;font-family:var(--mono);margin-bottom:10px">График активности</div>
  <div class="hm-wrap">
    <div class="hm-months" style="grid-template-columns:${monthsColTpl}">${monthsHeaderHtml}</div>
    <div class="hm-body">
      <div class="hm-dows">${dows.map(d=>`<div class="hm-dow">${d}</div>`).join('')}</div>
      <div class="hm-grid" style="grid-template-rows:repeat(7,1fr);grid-template-columns:${gridColTpl}">${cellsHtml}</div>
    </div>
  </div>
  <div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px">
    <span style="font-size:10px;color:var(--text-d)">${total} заявок за ${weeks <= 13 ? '4' : '5'} месяцев</span>
    <div style="display:flex;align-items:center;gap:3px">
      <span style="font-size:9px;color:var(--text-d)">Меньше</span>
      ${['var(--bg-input)','rgba(220,0,0,.25)','rgba(220,0,0,.5)','rgba(220,0,0,.75)','var(--accent)'].map(c=>`<div style="width:11px;height:11px;border-radius:2px;background:${c}"></div>`).join('')}
      <span style="font-size:9px;color:var(--text-d)">Больше</span>
    </div>
  </div>
</div>`;
}

function renderPublicProfile(data) {
  const u = data.user;
  const s = data.stats;
  const isAdmin = u.role === 'admin';
  const isMod   = u.role === 'moderator';
  const isVip   = u.role === 'vip';
  let badgeHtml = '';
  if (isAdmin)    badgeHtml = `<span class="user-badge badge-admin">ADMIN</span>`;
  else if (isMod) badgeHtml = `<span class="user-badge badge-mod">MOD</span>`;
  else if (isVip) badgeHtml = `<span class="user-badge badge-vip">VIP</span>`;
  const avatarClass = isAdmin ? 'cabinet-avatar admin-av' : (isMod ? 'cabinet-avatar mod-av' : (isVip ? 'cabinet-avatar vip-av' : 'cabinet-avatar'));
  const sc = {confirmed:'var(--green)',checking:'var(--yellow)',pending:'var(--blue)',fake:'var(--red)'};
  const sl = {confirmed:'Подтверждён',checking:'На проверке',pending:'Ожидает',fake:'Фейк'};
  // Таблица заявок (публичная — без pending)
  const reportsHtml = !data.reports?.length
    ? `<div class="cabinet-empty">${CICONS.inbox}<br>Заявок нет</div>`
    : data.reports.map((r,i) => `<div class="cabinet-report-row" style="animation-delay:${i*.05}s" onclick="openProfile(${r.id})">
        <div class="crr-left">
          <div class="crr-top">
            <span class="cabinet-report-nick">${esc(r.nick)}</span>
            <span class="crr-status" style="color:${sc[r.status]||'var(--text)'}">${sl[r.status]||r.status}</span>
          </div>
          <div class="crr-bottom">
            <span class="cabinet-report-meta">${esc(r.server_name)} · ${r.cheat_names?.length ? r.cheat_names.map(n=>esc(n)).join(', ') : esc(r.cheat_name)}${r.discord_tag ? ` · <span style="color:#5865f2">${esc(r.discord_tag)}</span>` : ''}</span>
            <span class="crr-info">
              <span class="cabinet-report-date">${r.created}</span>
              <span style="display:inline-flex;align-items:center;gap:4px;color:var(--text-d);font-size:10.5px">${CICONS.eye} ${r.views} ${CICONS.flag} ${r.complaints}</span>
            </span>
          </div>
        </div>
      </div>`).join('');
  // Комментарии
  const commentsHtml = !data.comments?.length
    ? `<div class="cabinet-empty">${CICONS.speech}<br>Комментариев нет</div>`
    : data.comments.map((c,i) => `<div style="padding:9px 0;border-bottom:1px solid var(--border-light);animation:fadeInRow .3s ease ${i*.05}s both">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px">
          <span style="font-size:11.5px;cursor:pointer;color:var(--accent);font-weight:700" onclick="openProfile(${c.cheater_id})">${esc(c.cheater_nick)}</span>
          <span style="font-size:10px;color:var(--text-d)">${c.date}</span>
        </div>
        <div style="font-size:12.5px;color:var(--text)">${esc(c.text)}</div>
      </div>`).join('');
  // Голоса
  const votesHtml = !data.votes?.length
    ? `<div class="cabinet-empty">${CICONS.vote}<br>Голосований нет</div>`
    : data.votes.map((v,i) => { const ib = v.vote==='believe'; return `<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border-light);animation:fadeInRow .3s ease ${i*.05}s both">
        <span style="color:${ib?'var(--green)':'var(--red)'}">${ib?CICONS.check:CICONS.x}</span>
        <span style="color:var(--accent);font-weight:700;cursor:pointer;font-size:12.5px" onclick="openProfile(${v.cheater_id})">${esc(v.cheater_nick)}</span>
        <span style="flex:1"></span>
        <span style="font-size:11px;font-weight:700;color:${ib?'var(--green)':'var(--red)'}">${ib?'Верю':'Не верю'}</span>
        <span style="font-size:10px;color:var(--text-d);font-family:var(--mono)">${v.date}</span>
      </div>`; }).join('');
  return `<div class="cabinet-layout">
  <div class="cabinet-sidebar">
    <div class="cabinet-profile-card">
      <div class="cabinet-avatar-wrap">
        <img src="${esc(u.avatar)}" alt="" class="${avatarClass}">
        ${badgeHtml}
        ${isAdmin ? `<div class="admin-username" style="font-size:16px;margin-bottom:5px"><span>${esc(u.username)}</span></div>` : isMod ? `<div class="mod-username" style="font-size:16px;margin-bottom:5px"><span>${esc(u.username)}</span></div>` : isVip ? `<div class="vip-username" style="font-size:16px;margin-bottom:5px"><span>${esc(u.username)}</span></div>` : `<div class="cabinet-username">${esc(u.username)}</div>`}
        <div class="cabinet-discord-id">ID: ${esc(u.discord_id)}</div>
        ${window.MY_USER_ID !== u.id ? `<div class="user-like-row">
          <button id="ulBtn-like-${u.id}" class="user-like-btn ${data.my_vote==='like'?'active-like':''}" onclick="userLike(${u.id},'like')" title="Лайк">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="${data.my_vote==='like'?'currentColor':'none'}" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
            <span id="ulCnt-like-${u.id}">${data.likes||0}</span>
          </button>
          <button id="ulBtn-dislike-${u.id}" class="user-like-btn dislike-btn ${data.my_vote==='dislike'?'active-dislike':''}" onclick="userLike(${u.id},'dislike')" title="Дизлайк">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="${data.my_vote==='dislike'?'currentColor':'none'}" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/></svg>
            <span id="ulCnt-dislike-${u.id}">${data.dislikes||0}</span>
          </button>
        </div>` : ''}
      </div>
      <div class="cabinet-meta">
        <div class="cabinet-meta-row"><span class="cabinet-meta-label">Зарегистрирован</span><span class="cabinet-meta-val">${u.registered}</span></div>
        <div class="cabinet-meta-row"><span class="cabinet-meta-label">Последний вход</span><span class="cabinet-meta-val">${u.last_login}</span></div>
        <div class="cabinet-meta-row"><span class="cabinet-meta-label">Подано заявок</span><span class="cabinet-meta-val" style="color:var(--accent)">${s.total_submitted}</span></div>
        <div class="cabinet-meta-row"><span class="cabinet-meta-label">Голосований</span><span class="cabinet-meta-val">${s.votes_given}</span></div>
        <div class="cabinet-meta-row"><span class="cabinet-meta-label">Комментариев</span><span class="cabinet-meta-val">${s.comments_given}</span></div>
      </div>
    </div>
    <div class="card" style="margin-top:10px">
      <div class="cabinet-stats">
        <div class="cabinet-stat"><div class="cabinet-stat-val" style="color:var(--text-w)" id="ups-total">0</div><div class="cabinet-stat-lbl">Всего заявок</div></div>
        <div class="cabinet-stat"><div class="cabinet-stat-val" style="color:var(--green)" id="ups-confirmed">0</div><div class="cabinet-stat-lbl">Подтверждено</div></div>
        <div class="cabinet-stat"><div class="cabinet-stat-val" style="color:var(--yellow)" id="ups-checking">0</div><div class="cabinet-stat-lbl">На проверке</div></div>
        <div class="cabinet-stat"><div class="cabinet-stat-val" style="color:var(--red)" id="ups-fake">0</div><div class="cabinet-stat-lbl">Фейков</div></div>
      </div>

      <div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border)">
        <div class="stat-bar"><span class="stat-label">Подтверждено</span><div class="stat-track"><div class="stat-fill" id="bar-confirmed" style="width:0;background:var(--green)"></div></div><span class="stat-count" style="color:var(--green)">${s.confirmed}</span></div>
        <div class="stat-bar"><span class="stat-label">На проверке</span><div class="stat-track"><div class="stat-fill" id="bar-checking" style="width:0;background:var(--yellow)"></div></div><span class="stat-count" style="color:var(--yellow)">${s.checking}</span></div>
        <div class="stat-bar"><span class="stat-label">Ожидают</span><div class="stat-track"><div class="stat-fill" id="bar-pending" style="width:0;background:var(--blue)"></div></div><span class="stat-count" style="color:var(--blue)">${s.pending}</span></div>
        <div class="stat-bar"><span class="stat-label">Фейков</span><div class="stat-track"><div class="stat-fill" id="bar-fake" style="width:0;background:var(--red)"></div></div><span class="stat-count" style="color:var(--red)">${s.fake}</span></div>
      </div>
      ${(()=>{
        const total = s.confirmed + s.fake;
        if (!total) return '';
        const pct = Math.round((s.confirmed / total) * 100);
        const color = pct >= 80 ? 'var(--green)' : pct >= 50 ? 'var(--yellow)' : 'var(--red)';
        const label = pct >= 80 ? 'Высокая' : pct >= 50 ? 'Средняя' : 'Низкая';
        return `<div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
            <span style="font-size:11px;color:var(--text-d);text-transform:uppercase;letter-spacing:.5px;font-family:var(--mono)">Репутация</span>
            <span style="font-size:12px;font-weight:700;color:${color}">${label} · ${pct}%</span>
          </div>
          <div style="height:4px;background:var(--border);border-radius:99px;overflow:hidden">
            <div style="height:100%;width:${pct}%;background:${color};border-radius:99px;transition:width .6s ease"></div>
          </div>
          <div style="display:flex;justify-content:space-between;margin-top:4px;font-size:10px;color:var(--text-d)">
            <span>${s.confirmed} подтверждено</span>
            <span>${s.fake} фейков</span>
          </div>
        </div>`;
      })()}
    </div>
  </div>
  <div class="cabinet-main">
    ${buildActivityHeatmap(data.activity||{}, "", 18)}
    <div class="cabinet-tabs">
      <button class="cabinet-tab up-tab active" data-tab="reports" onclick="userProfileTab('reports')">${CICONS.list} Заявки</button>
      <button class="cabinet-tab up-tab" data-tab="comments" onclick="userProfileTab('comments')">${CICONS.comment} Комментарии</button>
      <button class="cabinet-tab up-tab" data-tab="votes" onclick="userProfileTab('votes')">${CICONS.star} Голоса</button>
      <button class="cabinet-tab up-tab" data-tab="achievements" onclick="userProfileTab('achievements')">🏆 Достижения</button>
    </div>
    <div id="uptc-reports"  class="card cabinet-tab-content up-tab-content">${reportsHtml}</div>
    <div id="uptc-comments" class="card cabinet-tab-content up-tab-content" style="display:none"><div class="card-title">Комментарии</div>${commentsHtml}</div>
    <div id="uptc-votes"    class="card cabinet-tab-content up-tab-content" style="display:none"><div class="card-title">Голоса</div>${votesHtml}</div>
    <div id="uptc-achievements" class="card cabinet-tab-content up-tab-content" style="display:none"><div class="card-title">Достижения</div><div id="upAchievementsContent"><div style="color:var(--text-d);padding:20px;text-align:center">Загрузка...</div></div></div>
  </div>
</div>`;
}

/* ─── ACHIEVEMENTS ─── */
let _achievementsLoaded = {};
async function loadAchievements(userId, containerId) {
  const cid = containerId || 'achievementsContent';
  const key = userId || 'me';
  if (_achievementsLoaded[key]) {
    const el = document.getElementById(cid);
    if (el) el.innerHTML = _achievementsLoaded[key];
    return;
  }
  const url = userId ? `/api/achievements.php?user_id=${userId}` : '/api/achievements.php';
  const data = await fetch(BASE + url, { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
    .then(r => r.json()).catch(() => null);
  const el = document.getElementById(cid);
  if (!el) return;
  if (!data || data.error) { el.innerHTML = '<div class="alert alert-info">Не удалось загрузить достижения</div>'; return; }
  const html = renderAchievements(data);
  _achievementsLoaded[key] = html;
  el.innerHTML = html;
}

function renderAchievements(data) {
  const unlocked = data.achievements.filter(a => a.unlocked);
  const locked   = data.achievements.filter(a => !a.unlocked);
  let html = `<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
    <span style="font-size:13px;font-weight:700;color:var(--text-w)">Получено: ${data.unlocked_count} / ${data.total_count}</span>
    <div style="flex:1;height:6px;background:var(--border);border-radius:99px;overflow:hidden">
      <div style="width:${Math.round(data.unlocked_count/data.total_count*100)}%;height:100%;background:var(--accent);border-radius:99px;transition:width .5s ease"></div>
    </div>
  </div>`;

  if (unlocked.length) {
    html += '<div class="achievements-grid">';
    unlocked.forEach(a => {
      html += `<div class="achievement-card unlocked" style="--ach-color:${a.color}">
        <div class="achievement-icon">${a.icon}</div>
        <div class="achievement-info">
          <div class="achievement-name">${esc(a.name)}</div>
          <div class="achievement-desc">${esc(a.desc)}</div>
        </div>
        <div class="achievement-check">${CICONS.check}</div>
      </div>`;
    });
    html += '</div>';
  }

  if (locked.length) {
    html += '<div style="margin-top:14px;margin-bottom:8px;font-size:11px;color:var(--text-d);text-transform:uppercase;letter-spacing:.5px">Ещё не получены</div>';
    html += '<div class="achievements-grid">';
    locked.forEach(a => {
      const pct = a.target > 0 ? Math.round(a.progress / a.target * 100) : 0;
      html += `<div class="achievement-card locked">
        <div class="achievement-icon" style="opacity:.3;filter:grayscale(1)">${a.icon}</div>
        <div class="achievement-info">
          <div class="achievement-name">${esc(a.name)}</div>
          <div class="achievement-desc">${esc(a.desc)}</div>
          <div class="achievement-progress">
            <div class="achievement-progress-track"><div class="achievement-progress-fill" style="width:${pct}%"></div></div>
            <span class="achievement-progress-text">${a.progress}/${a.target}</span>
          </div>
        </div>
      </div>`;
    });
    html += '</div>';
  }

  return html;
}