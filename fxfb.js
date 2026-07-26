/* =============================================================
   fxfb.js — 미리보기 전용 폴백 (fx.js 가 없을 때만 동작)
   ⚠️ 반드시 fx.js <script> "뒤"에 놓을 것 (앞에 두면 입자가 이중으로 뜸)
   ⚠️ 클래스는 .fxfb 로 한정 (#fx span 같은 포괄 선택자 금지)
   ============================================================= */
(function () {
  if (typeof window.fxHearts === 'function') return;   // fx.js 가 이미 있으면 아무것도 안 함
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var SHAPES = ['✿', '♡', '✧', '♡', '✿', '♡'];
  var st = document.createElement('style');
  st.textContent =
    '#fxfb{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}' +
    '#fxfb .fxfb{position:absolute;top:-24px;color:var(--main-dark,#B1798D);opacity:0;animation:fxfbFall linear infinite}' +
    '@keyframes fxfbFall{0%{transform:translateY(-24px);opacity:0}14%{opacity:.42}86%{opacity:.34}100%{transform:translateY(103vh) translateX(26px) rotate(200deg);opacity:0}}' +
    '.fxfb-pop{position:fixed;z-index:500;pointer-events:none;color:var(--main-dark,#B1798D);transform:translate(-50%,-50%);animation:fxfbPop .9s ease-out forwards}' +
    '@keyframes fxfbPop{0%{opacity:0;transform:translate(-50%,-50%) scale(.4)}18%{opacity:.85}100%{opacity:0;transform:translate(-50%,calc(-50% - 60px)) scale(1.05)}}';
  document.head.appendChild(st);

  var box = document.createElement('div');
  box.id = 'fxfb';
  document.body.appendChild(box);

  for (var i = 0; i < 14; i++) {
    var s = document.createElement('span');
    s.className = 'fxfb';
    s.textContent = SHAPES[i % SHAPES.length];
    s.style.left = Math.random() * 100 + '%';
    s.style.fontSize = (11 + Math.random() * 12).toFixed(1) + 'px';
    s.style.animationDuration = (13 + Math.random() * 12).toFixed(1) + 's';
    s.style.animationDelay = (-Math.random() * 18).toFixed(1) + 's';
    box.appendChild(s);
  }

  document.addEventListener('click', function (e) {
    for (var i = 0; i < 4; i++) {
      var p = document.createElement('span');
      p.className = 'fxfb-pop';
      p.textContent = '♡';
      p.style.left = e.clientX + (Math.random() * 40 - 20) + 'px';
      p.style.top = e.clientY + (Math.random() * 20 - 10) + 'px';
      p.style.fontSize = (13 + Math.random() * 10).toFixed(0) + 'px';
      document.body.appendChild(p);
      setTimeout((function (el) { return function () { el.remove(); }; })(p), 950);
    }
  });
})();
