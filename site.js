/* =============================================================
   site.js — 배롱 FLOWER DIARY 공통 스크립트
   · 프로필 데이터 1회 로드 → 전 페이지 공유 (P / pv)
   · 사이트 전역 요소 자동 적용 (배경사진 · 로고 · 머리말 · 푸터 · 문의 모달)
   · 다크모드 저장/복원 · 문의 전송 · 공통 유틸
   로드 순서: supabase.js → site.js → fx.js
   ============================================================= */

/* 기본값 — DB가 비어 있을 때 화면에 뜨는 값 / admin 에서 값을 넣으면 전부 덮어써집니다. / ️ 여기 키 = admin profileKeys = 페이지 data-hook/data-site (3곳 동일) */
var DEF = {
  /* 프사 · 이름 */
  'avatar': '', 'soop-id': 'baerong2',
  'info-name': '배롱', 'info-en': 'BAERONG',
  'bio': '당신과 행복한 하루를 만들고 싶은 배롱입니다 🍀',
  'quote': '오늘도 와줘서 고마워요, 우리 같이 좋은 하루 만들어요!',

  /* 프로필 정보 */
  'info-birth': '08.18', 'info-debut': '2024.09.23',
  'info-content': '게임 & 소통 & 풀트', 'info-mbti': 'IST(F)J',
  'info-fandom': 'ε:', 'info-agency': '개인세',
  'info-game': '배틀그라운드 · 마인크래프트 · 롤토체스',
  'info-extra': '',
  'info-tags': '달달보이스, 잔잔함, 바보스러움, 멘헤라',

  /* 프로필 콘텐츠 */
  'stats': '잔잔함:90\n멘헤라:80\n바보미:70\n게임력:40',
  'like-list': '게임, 소통, 배롱나무, 토끼, 마인크래프트',
  'dislike-list': '',
  'tmi': '좋아하는 음식:-\n요즘 듣는 노래:-\n최근 본 것:-',
  'milestones': '달성|첫 방송\n진행 중|매일 잔잔하게 방송하기',
  'msg': '🎮 시청자 참여 게임 — 마인크래프트 · 롤토체스\n🎲 룰렛 돌리기\n💬 고민 상담 / 수다 타임\n\n참여 방법은 공지를 확인해 주세요 🍀',
  'days': '0,1,2,3,4,5,6',
  'sched-note': '매일 8~9시 사이 (랜덤 휴방)',

  /* 링크 */
  'link-soop': 'https://www.sooplive.com/station/baerong2',
  'link-discord': 'https://discord.gg/tEsU79stA',
  'link-fancim': 'https://fancim.me/celeb/profile.aspx?url=504450',
  'link-youtube': '', 'link-x': '',

  /* 사이트 전역 */
  'site-bg': '',                    /* 비우면 assets/baerong-blossom.webp */
  'site-bg-pos': 'center 26%',
  'site-bg-wash': '80',             /* 0~100 — 클수록 사진이 연해짐 */
  'logo-text': '배롱',
  'main-sub': "Baerong's soft diary",
  'main-copy': 'BE SWEET|STAY A WHILE',
  'ghost-text': 'baerong ♡',
  'footer-note': 'be sweet, stay a while ♡',
  'footer-copy': 'BAERONG OFFICIAL · © 2026',
  'footer-email': 'baerong2486@gmail.com',
  'ask-title': '쪽지 남기기',
  'ask-desc': '배롱에게 하고 싶은 말을 남겨주세요. 익명으로 전달돼요 🍀',

  /* 페이지 머리말 */
  'hd-schedule-title': '일정', 'hd-schedule-en': "baerong's schedule",
  'hd-schedule-desc': '이번 주 계획과 한 달 달력이에요. 방송 시간은 랜덤이라 당일 공지를 함께 확인해 주세요.',
  'hd-notice-title': '공지', 'hd-notice-en': 'pinned notes',
  'hd-notice-desc': '채팅 규칙 · 시참 규칙 · 시그 이미지 · 구독 티콘 · 룰렛 확률 · 방셀 공지를 여기 붙여둬요. 제목을 누르면 내용이 펼쳐져요.',
  'hd-work-title': '업보', 'hd-work-en': 'who did what ♡',
  'hd-work-desc': '시청자분들이 쌓아 올린 업보를 한 장에 정리했어요. 카드를 누르면 항목별 기록이 펼쳐져요.',
  'hd-dress-title': '옷장', 'hd-dress-en': "baerong's closet",
  'hd-dress-desc': '새로 갈아입은 옷은 포스터로, 이미 입던 옷은 기존 옷에서 볼 수 있어요. 사진을 누르면 크게 볼 수 있어요.',

  /* 섹션 이름 */
  'sec-profile': '프로필', 'sec-stats': '능력치', 'sec-likes': '좋아 · 싫어',
  'sec-tmi': 'TMI', 'sec-goal': '목표',
  'sec-about': '참여 컨텐츠', 'sec-vod': '다시보기', 'sec-links': '관련 링크',
  'lbl-like': '🍀 좋아하는 것', 'lbl-dislike': '🥀 싫어하는 것',
  'lbl-today': '오늘의 방송',
  'sec-thisweek': '이번 주', 'sec-upcoming': '다가오는 일정',
  'lbl-new': '✨ 새 옷', 'lbl-old': '🗂 기존 옷'
};

var P = {};                       /* 로드된 프로필 데이터 */
function pv(k){ var v = asText(P[k]).trim(); return v || (DEF[k] || ''); }

/* 유틸 */
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
/* DB 값 타입 방어: 배열/객체가 와도 [object Object] 안 나오게 */
function asText(v) {
  if (v == null) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (Array.isArray(v)) return v.map(asText).filter(Boolean).join(', ');
  if (typeof v === 'object') {
    if (v.label != null) return asText(v.label);
    if (v.name != null) return asText(v.name);
    if (v.value != null) return asText(v.value);
    return Object.values(v).map(asText).filter(Boolean).join(', ');
  }
  return '';
}
function asLines(v) {
  if (v == null) return [];
  if (Array.isArray(v)) return v.map(asText).map(function(s){ return s.trim(); }).filter(Boolean);
  return asText(v).split(/\r?\n/).map(function(s){ return s.trim(); }).filter(Boolean);
}
function asList(v) {
  if (Array.isArray(v)) return v.map(asText).map(function(s){ return s.trim(); }).filter(Boolean);
  return asText(v).split(/[,\n]/).map(function(s){ return s.trim(); }).filter(Boolean);
}
/* '라벨:값' 줄 → [{k,v}] */
function asPairs(v, sep) {
  sep = sep || ':';
  return asLines(v).map(function (l) {
    var i = String(l).indexOf(sep);
    if (i < 0) return null;
    return { k: l.slice(0, i).trim(), v: l.slice(i + 1).trim() };
  }).filter(function (x) { return x && x.k; });
}

function soopAvatar(id) {
  id = String(id || '').trim().toLowerCase();
  if (id.length < 2) return '';
  return 'https://profile.img.sooplive.co.kr/LOGO/' + id.slice(0, 2) + '/' + id + '/' + id + '.jpg';
}
function avatarUrl() { return asText(P['avatar']).trim() || soopAvatar(pv('soop-id')); }

/* D-Day */
function ddayFromMMDD(mmdd) {
  var m = String(mmdd || '').match(/(\d{1,2})\s*[.\-/월]\s*(\d{1,2})/);
  if (!m) return null;
  var now = new Date(); now.setHours(0, 0, 0, 0);
  var t = new Date(now.getFullYear(), +m[1] - 1, +m[2]);
  if (t < now) t = new Date(now.getFullYear() + 1, +m[1] - 1, +m[2]);
  return Math.round((t - now) / 86400000);
}
function anniversary(ymd) {
  var m = String(ymd || '').match(/(\d{4})\s*[.\-/년]\s*(\d{1,2})\s*[.\-/월]\s*(\d{1,2})/);
  if (!m) return null;
  var now = new Date(); now.setHours(0, 0, 0, 0);
  var t = new Date(now.getFullYear(), +m[2] - 1, +m[3]);
  if (t < now) t = new Date(now.getFullYear() + 1, +m[2] - 1, +m[3]);
  return { days: Math.round((t - now) / 86400000), years: t.getFullYear() - (+m[1]) };
}
function ddLabel(n) { return n == null ? '' : (n === 0 ? 'D-DAY 🎉' : 'D-' + n); }

/* 프로필 로드 (페이지마다 1회) */
/* Last known values are cached so a revisit paints the correct text on the first frame
   instead of the HTML placeholders. Cache is refreshed after every successful fetch. */
var PCACHE_KEY = 'br-profile-cache';

function readCache() {
  try {
    var raw = localStorage.getItem(PCACHE_KEY);
    if (!raw) return null;
    var o = JSON.parse(raw);
    return (o && typeof o === 'object' && o.data && typeof o.data === 'object') ? o.data : null;
  } catch (e) { return null; }
}
function writeCache(data) {
  try { localStorage.setItem(PCACHE_KEY, JSON.stringify({ at: Date.now(), data: data })); } catch (e) {}
}

async function loadProfile() {
  var cached = readCache();
  if (cached) P = cached;                 /* paint immediately, then refresh below */
  try {
    const { data } = await db.from('profile').select('data').eq('id', 1).single();
    if (data && data.data && typeof data.data === 'object') {
      P = data.data;
      writeCache(P);
    } else if (!cached) { P = {}; }
  } catch (e) { if (!cached) P = {}; }
  return P;
}

/* 사이트 전역 적용 — 전 페이지 공통 */
function applySite() {
  var root = document.documentElement;
  var sub = document.body.classList.contains('sub');

  /* ① 배경 사진 */
  var base = sub ? '../' : './';
  var url = pv('site-bg') || (base + 'assets/baerong-blossom.webp');
  root.style.setProperty('--site-bg', 'url("' + url.replace(/"/g, '%22') + '")');
  root.style.setProperty('--site-bg-pos', pv('site-bg-pos'));
  var w = parseFloat(pv('site-bg-wash'));
  if (isNaN(w)) w = 80;
  root.style.setProperty('--wash-a', (Math.max(0, Math.min(100, w)) / 100).toFixed(3));

  /* 메인은 실제 <img> 라 따로 */
  var photo = document.querySelector('.flower-photo');
  if (photo) {
    photo.src = url;
    photo.style.objectPosition = pv('site-bg-pos');
  }

  /* ② 파비콘 (fx.js 로딩화면 이미지도 이걸 씁니다) */
  var fav = avatarUrl();
  if (fav) {
    var link = document.querySelector('link[rel="icon"]');
    if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
    link.href = fav;
  }

  /* ③ data-site 훅 일괄 치환 */
  document.querySelectorAll('[data-site]').forEach(function (el) {
    var v = pv(el.getAttribute('data-site'));
    if (v !== '') el.textContent = v;
  });

  /* ④ 하단 카피 (BE SWEET | STAY A WHILE) */
  var copy = pv('main-copy').split('|');
  var c1 = document.getElementById('copy1'), c2 = document.getElementById('copy2');
  if (c1) c1.textContent = (copy[0] || '').trim();
  if (c2) c2.textContent = (copy[1] || '').trim();

  /* ⑤ 푸터 이메일 */
  var em = document.getElementById('footEmail');
  if (em) {
    var mail = pv('footer-email');
    em.innerHTML = mail
      ? '비즈니스 문의 — <a href="mailto:' + esc(mail) + '">' + esc(mail) + '</a>'
      : '문의는 상단 ✉ 문의 버튼을 이용해 주세요';
  }

  /* ⑥ 문서 제목 */
  var t = document.body.getAttribute('data-title');
  if (t) document.title = pv('info-name') + ' · ' + t;
}

/* 다크모드 */
function initTheme() {
  var btn = document.getElementById('dkToggle');
  if (btn) btn.addEventListener('click', function () {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    paintKnob();
  });
  paintKnob();
}
function paintKnob() {
  var k = document.getElementById('dkKnob');
  if (k) k.textContent = document.body.classList.contains('dark') ? '☀' : '☾';
}

/* 문의 모달 */
function openAsk() { var m = document.getElementById('askmask'); if (m) m.classList.add('on'); }
function closeAsk() { var m = document.getElementById('askmask'); if (m) m.classList.remove('on'); }
async function sendAsk() {
  var t = document.getElementById('askmsg');
  if (!t) return;
  var v = (t.value || '').trim();
  if (!v) { alert('내용을 적어주세요!'); return; }
  var ok = false;
  try { ok = await insertRow('inquiries', { message: v }); } catch (e) { ok = false; }
  alert(ok ? '쪽지를 붙여뒀어요! 고마워요 🍀' : '전송에 실패했어요. 잠시 후 다시 시도해 주세요.');
  if (ok) { t.value = ''; closeAsk(); }
}

function markReady() { document.body.classList.add('ready'); }

/* Embed handling. In an iframe, position:fixed resolves against the whole iframe box,
   so modals must be placed at the last click position instead of the box centre. */
var EMBED = (function () { try { return window.self !== window.top; } catch (e) { return true; } })();
var lastClickY = 0;

function placeMask(el) {
  if (!EMBED || !el) return;
  var inner = el.querySelector('.askmodal, .mo, .inner');
  var dh = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
  el.style.height = dh + 'px';
  var ih = inner ? inner.offsetHeight : 280;
  var y = Math.round(Math.max(16, Math.min(lastClickY - ih / 2, dh - ih - 16)));
  if (inner) inner.style.marginTop = y + 'px';
  var x = el.querySelector('.x');
  if (x) x.style.top = Math.max(8, y - 34) + 'px';
  var t = document.getElementById('toast');
  if (t) t.style.top = Math.min(dh - 80, y + ih + 20) + 'px';
}

function initEmbed() {
  if (!EMBED) return;
  document.body.classList.add('embed');
  document.addEventListener('click', function (e) { if (e.pageY) lastClickY = e.pageY; }, true);
  /* Catches modals added later without touching each one individually. */
  new MutationObserver(function (muts) {
    muts.forEach(function (r) {
      var t = r.target;
      if (t.matches && t.matches('.askmask, .ov, .lightbox') &&
          (t.classList.contains('on') || t.classList.contains('open') || t.classList.contains('show'))) {
        placeMask(t);
      }
    });
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'], subtree: true });
}

document.addEventListener('DOMContentLoaded', function () {
  initEmbed();
  initTheme();
  var mask = document.getElementById('askmask');
  if (mask) mask.addEventListener('click', function (e) { if (e.target === mask) closeAsk(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAsk(); });
  setTimeout(markReady, 2500);            /* fallback: never stay hidden if the fetch hangs */
  try { if (typeof initIframeResize === 'function') initIframeResize(); } catch (e) {}
});
