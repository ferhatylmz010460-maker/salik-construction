(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    // mobile menu
    var burger = document.getElementById('burger');
    var nav = document.getElementById('nav');
    if (burger && nav) {
      burger.addEventListener('click', function () {
        var open = nav.classList.toggle('open');
        burger.classList.toggle('open', open);
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      nav.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          nav.classList.remove('open');
          burger.classList.remove('open');
          burger.setAttribute('aria-expanded', 'false');
        });
      });
    }
    // lightbox galerie
    var gimgs = Array.prototype.slice.call(document.querySelectorAll('.gm-gallery img'));
    if (gimgs.length) {
      var lb = document.createElement('div');
      lb.className = 'gm-lb';
      lb.innerHTML = '<button class="lb-close" aria-label="Închide">&times;</button>' +
        '<button class="lb-prev" aria-label="Anterior">&#8249;</button>' +
        '<button class="lb-next" aria-label="Următor">&#8250;</button>' +
        '<img alt=""><div class="cap"></div>';
      document.body.appendChild(lb);
      var lbImg = lb.querySelector('img');
      var lbCap = lb.querySelector('.cap');
      var idx = 0;
      function show(i) {
        idx = (i + gimgs.length) % gimgs.length;
        var s = gimgs[idx];
        lbImg.src = s.getAttribute('data-full') || s.currentSrc || s.src;
        lbImg.alt = s.alt || '';
        lbCap.textContent = s.getAttribute('data-caption') || '';
      }
      function open(i) { show(i); lb.classList.add('open'); document.body.style.overflow = 'hidden'; }
      function close() { lb.classList.remove('open'); document.body.style.overflow = ''; }
      gimgs.forEach(function (im, i) { im.addEventListener('click', function () { open(i); }); });
      lb.querySelector('.lb-close').addEventListener('click', close);
      lb.querySelector('.lb-prev').addEventListener('click', function () { show(idx - 1); });
      lb.querySelector('.lb-next').addEventListener('click', function () { show(idx + 1); });
      lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
      document.addEventListener('keydown', function (e) {
        if (!lb.classList.contains('open')) return;
        if (e.key === 'Escape') close();
        else if (e.key === 'ArrowLeft') show(idx - 1);
        else if (e.key === 'ArrowRight') show(idx + 1);
      });
    }
    // accordion
    document.querySelectorAll('.acc .acc-h').forEach(function (h) {
      h.addEventListener('click', function () {
        var scope = h.closest('.acc');
        var item = h.parentElement;
        var body = h.nextElementSibling;
        var isOpen = item.classList.contains('open');
        scope.querySelectorAll('.acc-item').forEach(function (x) {
          x.classList.remove('open');
          var b = x.querySelector('.acc-b');
          if (b) b.style.maxHeight = null;
        });
        if (!isOpen) {
          item.classList.add('open');
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    });
  });
})();
