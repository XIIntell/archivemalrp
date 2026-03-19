/**
 * Target Cursor — vanilla JS (GSAP required)
 * Ported from reactbits.dev/animations/target-cursor
 */
(function () {
  'use strict';

  /* ── Config ── */
  var TARGET_SELECTOR  = 'a, button, .nav-btn, .card, .nick-link, .vote-btn, .comment-send, .submit-btn, .page-btn, .logo, .discord-btn, .theme-toggle-btn, .burger-btn, input, textarea, select, [onclick]';
  var SPIN_DURATION    = 2;
  var HOVER_DURATION   = 0.2;
  var PARALLAX_ON      = true;
  var HIDE_DEFAULT     = true;
  var BORDER_WIDTH     = 3;
  var CORNER_SIZE      = 12;

  /* ── Mobile check ── */
  var hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  var isSmall        = window.innerWidth <= 768;
  var mobileRe       = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
  if ((hasTouchScreen && isSmall) || mobileRe.test((navigator.userAgent || '').toLowerCase())) return;

  /* ── Build DOM ── */
  var wrapper = document.createElement('div');
  wrapper.className = 'target-cursor-wrapper';

  var dot = document.createElement('div');
  dot.className = 'target-cursor-dot';
  wrapper.appendChild(dot);

  var cornerClasses = ['corner-tl', 'corner-tr', 'corner-br', 'corner-bl'];
  cornerClasses.forEach(function (cls) {
    var el = document.createElement('div');
    el.className = 'target-cursor-corner ' + cls;
    wrapper.appendChild(el);
  });

  document.body.appendChild(wrapper);
  var corners = wrapper.querySelectorAll('.target-cursor-corner');

  /* ── Hide system cursor ── */
  if (HIDE_DEFAULT) document.body.style.cursor = 'none';

  /* ── State ── */
  var isActive           = false;
  var activeStrength     = { current: 0 };
  var targetCornerPos    = null;
  var activeTarget       = null;
  var currentLeaveHandler = null;
  var resumeTimeout      = null;
  var spinTl             = null;
  var tickerAdded        = false;

  /* ── Init position ── */
  gsap.set(wrapper, {
    xPercent: -50,
    yPercent: -50,
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  });

  /* ── Spin animation ── */
  function createSpin() {
    if (spinTl) spinTl.kill();
    spinTl = gsap.timeline({ repeat: -1 })
      .to(wrapper, { rotation: '+=360', duration: SPIN_DURATION, ease: 'none' });
  }
  createSpin();

  /* ── Move cursor ── */
  function moveCursor(x, y) {
    if (isActive) {
      /* While hovering — only move the dot inside the locked frame */
      var wx = gsap.getProperty(wrapper, 'x');
      var wy = gsap.getProperty(wrapper, 'y');
      gsap.to(dot, { x: x - wx, y: y - wy, duration: 0.1, ease: 'power3.out' });
    } else {
      gsap.to(wrapper, { x: x, y: y, duration: 0.1, ease: 'power3.out' });
    }
  }

  /* ── Ticker (parallax corners while hovering) ── */
  function tickerFn() {
    if (!targetCornerPos || !corners.length) return;
    var strength = activeStrength.current;
    if (strength === 0) return;

    var cursorX = gsap.getProperty(wrapper, 'x');
    var cursorY = gsap.getProperty(wrapper, 'y');

    Array.from(corners).forEach(function (corner, i) {
      var currentX = gsap.getProperty(corner, 'x');
      var currentY = gsap.getProperty(corner, 'y');
      var targetX  = targetCornerPos[i].x - cursorX;
      var targetY  = targetCornerPos[i].y - cursorY;
      var finalX   = currentX + (targetX - currentX) * strength;
      var finalY   = currentY + (targetY - currentY) * strength;
      var dur      = strength >= 0.99 ? (PARALLAX_ON ? 0.2 : 0) : 0.05;

      gsap.to(corner, {
        x: finalX, y: finalY,
        duration: dur,
        ease: dur === 0 ? 'none' : 'power1.out',
        overwrite: 'auto'
      });
    });
  }

  /* ── Cleanup helper ── */
  function cleanupTarget(target) {
    if (currentLeaveHandler) target.removeEventListener('mouseleave', currentLeaveHandler);
    currentLeaveHandler = null;
  }

  /* ── Mousemove ── */
  window.addEventListener('mousemove', function (e) { moveCursor(e.clientX, e.clientY); });

  /* ── Mousedown / up ── */
  window.addEventListener('mousedown', function () {
    gsap.to(dot, { scale: 0.7, duration: 0.3 });
    gsap.to(wrapper, { scale: 0.9, duration: 0.2 });
  });
  window.addEventListener('mouseup', function () {
    gsap.to(dot, { scale: 1, duration: 0.3 });
    gsap.to(wrapper, { scale: 1, duration: 0.2 });
  });

  /* ── Scroll — drop hover if scrolled away ── */
  window.addEventListener('scroll', function () {
    if (!activeTarget) return;
    var mx = gsap.getProperty(wrapper, 'x');
    var my = gsap.getProperty(wrapper, 'y');
    var el = document.elementFromPoint(mx, my);
    var stillOver = el && (el === activeTarget || el.closest(TARGET_SELECTOR) === activeTarget);
    if (!stillOver && currentLeaveHandler) currentLeaveHandler();
  }, { passive: true });

  /* ── Hover enter ── */
  window.addEventListener('mouseover', function (e) {
    var target = e.target.closest(TARGET_SELECTOR);
    if (!target || !corners.length) return;
    if (activeTarget === target) return;
    if (activeTarget) cleanupTarget(activeTarget);
    if (resumeTimeout) { clearTimeout(resumeTimeout); resumeTimeout = null; }

    activeTarget = target;
    Array.from(corners).forEach(function (c) { gsap.killTweensOf(c); });
    gsap.killTweensOf(wrapper, 'rotation');
    if (spinTl) spinTl.pause();
    gsap.set(wrapper, { rotation: 0 });

    var rect = target.getBoundingClientRect();
    var centerX = rect.left + rect.width / 2;
    var centerY = rect.top + rect.height / 2;
    var cursorX = gsap.getProperty(wrapper, 'x');
    var cursorY = gsap.getProperty(wrapper, 'y');

    targetCornerPos = [
      { x: rect.left - BORDER_WIDTH,                      y: rect.top - BORDER_WIDTH },
      { x: rect.right + BORDER_WIDTH - CORNER_SIZE,       y: rect.top - BORDER_WIDTH },
      { x: rect.right + BORDER_WIDTH - CORNER_SIZE,       y: rect.bottom + BORDER_WIDTH - CORNER_SIZE },
      { x: rect.left - BORDER_WIDTH,                      y: rect.bottom + BORDER_WIDTH - CORNER_SIZE }
    ];

    isActive = true;
    if (!tickerAdded) { gsap.ticker.add(tickerFn); tickerAdded = true; }

    /* Lock wrapper to the center of the hovered element */
    gsap.to(wrapper, { x: centerX, y: centerY, duration: 0.2, ease: 'power2.out' });

    /* Move dot to current mouse position relative to new wrapper center */
    gsap.to(dot, { x: cursorX - centerX, y: cursorY - centerY, duration: 0.2, ease: 'power2.out' });

    gsap.to(activeStrength, { current: 1, duration: HOVER_DURATION, ease: 'power2.out' });

    Array.from(corners).forEach(function (corner, i) {
      gsap.to(corner, {
        x: targetCornerPos[i].x - centerX,
        y: targetCornerPos[i].y - centerY,
        duration: 0.2,
        ease: 'power2.out'
      });
    });

    /* ── Leave handler ── */
    var leaveHandler = function () {
      if (tickerAdded) { gsap.ticker.remove(tickerFn); tickerAdded = false; }
      isActive = false;
      targetCornerPos = null;
      gsap.set(activeStrength, { current: 0, overwrite: true });
      activeTarget = null;

      /* Reset dot back to wrapper center */
      gsap.to(dot, { x: 0, y: 0, duration: 0.2, ease: 'power2.out' });

      /* Snap wrapper to current mouse position */
      var lastMx = gsap.getProperty(wrapper, 'x') + gsap.getProperty(dot, 'x');
      var lastMy = gsap.getProperty(wrapper, 'y') + gsap.getProperty(dot, 'y');
      gsap.set(wrapper, { x: lastMx, y: lastMy });

      var positions = [
        { x: -CORNER_SIZE * 1.5, y: -CORNER_SIZE * 1.5 },
        { x:  CORNER_SIZE * 0.5, y: -CORNER_SIZE * 1.5 },
        { x:  CORNER_SIZE * 0.5, y:  CORNER_SIZE * 0.5 },
        { x: -CORNER_SIZE * 1.5, y:  CORNER_SIZE * 0.5 }
      ];
      var tl = gsap.timeline();
      Array.from(corners).forEach(function (corner, idx) {
        tl.to(corner, { x: positions[idx].x, y: positions[idx].y, duration: 0.3, ease: 'power3.out' }, 0);
      });

      resumeTimeout = setTimeout(function () {
        if (!activeTarget && wrapper && spinTl) {
          var rot = gsap.getProperty(wrapper, 'rotation') % 360;
          spinTl.kill();
          spinTl = gsap.timeline({ repeat: -1 }).to(wrapper, { rotation: '+=360', duration: SPIN_DURATION, ease: 'none' });
          gsap.to(wrapper, {
            rotation: rot + 360,
            duration: SPIN_DURATION * (1 - rot / 360),
            ease: 'none',
            onComplete: function () { if (spinTl) spinTl.restart(); }
          });
        }
        resumeTimeout = null;
      }, 50);

      cleanupTarget(target);
    };

    currentLeaveHandler = leaveHandler;
    target.addEventListener('mouseleave', leaveHandler);
  }, { passive: true });
})();
