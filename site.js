/* =============================================================
   site.js — 배롱 FLOWER DIARY 공통 스크립트
   · 다크모드 저장/복원 (localStorage 'theme')
   · 문의 모달 (inquiries.message)
   · 공통 유틸 (esc / soopAvatar / D-Day / body.ready)
   ⚠️ supabase.js 보다 "뒤", fx.js 보다 "앞"에 넣으세요.
   ============================================================= */

/* ─ 안전한 HTML 이스케이프 ─ */
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ─ DB 값 타입 방어: 배열/객체가 와도 절대 [object Object] 안 나오게 ─ */
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
/* 여러 줄 텍스트 → 배열 (문자열/배열 둘 다 허용) */
function asLines(v) {
  if (v == null) return [];
  if (Array.isArray(v)) return v.map(asText).map(s => s.trim()).filter(Boolean);
  return asText(v).split(/\r?\n/).map(s => s.trim()).filter(Boolean);
}
/* 쉼표 목록 → 배열 */
function asList(v) {
  if (Array.isArray(v)) return v.map(asText).map(s => s.trim()).filter(Boolean);
  return asText(v).split(/[,\n]/).map(s => s.trim()).filter(Boolean);
}

/* ─ SOOP 프사 주소 ─ */
function soopAvatar(id) {
  id = String(id || '').trim().toLowerCase();
  if (id.length < 2) return '';
  return 'https://profile.img.sooplive.co.kr/LOGO/' + id.slice(0, 2) + '/' + id + '/' + id + '.jpg';
}

/* ─ D-Day ─ 'MM.DD' / 'MM-DD' → 다음 생일까지 남은 일수 */
function ddayFromMMDD(mmdd) {
  var m = String(mmdd || '').match(/(\d{1,2})\s*[.\-/월]\s*(\d{1,2})/);
  if (!m) return null;
  var now = new Date(); now.setHours(0, 0, 0, 0);
  var y = now.getFullYear();
  var t = new Date(y, +m[1] - 1, +m[2]);
  if (t < now) t = new Date(y + 1, +m[1] - 1, +m[2]);
  return Math.round((t - now) / 86400000);
}
/* ─ 기념일(데뷔일) — 'YYYY.MM.DD' → {days: 다음 기념일까지, years: 몇 주년} */
function anniversary(ymd) {
  var m = String(ymd || '').match(/(\d{4})\s*[.\-/년]\s*(\d{1,2})\s*[.\-/월]\s*(\d{1,2})/);
  if (!m) return null;
  var now = new Date(); now.setHours(0, 0, 0, 0);
  var y = now.getFullYear();
  var t = new Date(y, +m[2] - 1, +m[3]);
  if (t < now) { t = new Date(y + 1, +m[2] - 1, +m[3]); }
  var years = t.getFullYear() - (+m[1]);
  return { days: Math.round((t - now) / 86400000), years: years };
}
function ddLabel(n) {
  if (n == null) return '';
  return n === 0 ? 'D-DAY 🎉' : 'D-' + n;
}

/* ─ 다크모드 (전 페이지 동일 키) ─ */
function initTheme() {
  var btn = document.getElementById('dkToggle');
  if (!btn) return;
  btn.addEventListener('click', function () {
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

/* ─ 문의 모달 ─ */
function openAsk() { var m = document.getElementById('askmask'); if (m) m.classList.add('on'); }
function closeAsk() { var m = document.getElementById('askmask'); if (m) m.classList.remove('on'); }
async function sendAsk() {
  var t = document.getElementById('askmsg');
  if (!t) return;
  var v = (t.value || '').trim();
  if (!v) { alert('내용을 적어주세요!'); return; }
  try {
    await insertRow('inquiries', { message: v });
    alert('쪽지를 붙여뒀어요! 고마워요 🍀');
  } catch (e) {
    alert('전송에 실패했어요. 잠시 후 다시 시도해 주세요.');
  }
  t.value = ''; closeAsk();
}

/* ─ 화면 표시 (FOUC 방지 폴백 포함) ─ */
function markReady() { document.body.classList.add('ready'); }

document.addEventListener('DOMContentLoaded', function () {
  initTheme();
  var mask = document.getElementById('askmask');
  if (mask) mask.addEventListener('click', function (e) { if (e.target === mask) closeAsk(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAsk(); });
  setTimeout(markReady, 1400);            // 데이터가 늦어도 영영 숨지 않게
  try { if (typeof initIframeResize === 'function') initIframeResize(); } catch (e) {}
});
