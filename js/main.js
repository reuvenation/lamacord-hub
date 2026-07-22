// Анимация рамок карточек: две половины окантовки «рисуются» от верхней
// середины по обеим сторонам вниз и встречаются в нижней середине.
// Пути строим в пикселях под фактический размер карточки (border-box),
// при ресайзе перестраиваем. Без JS остаётся обычный CSS-бордер.
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var NS = 'http://www.w3.org/2000/svg';
  var INSET = 1;   // половина stroke 2px — центр линии на месте CSS-бордера
  var RADIUS = 22; // border-radius карточки

  // старт отрисовки — сразу после каскадного появления карточки ([data-load])
  var DELAYS = { '6': 0.8, '7': 0.9, '8': 1.0, '10': 1.2 };

  function halves(w, h) {
    var r = RADIUS - INSET;
    var right =
      'M' + w / 2 + ' ' + INSET +
      'H' + (w - INSET - r) +
      'A' + r + ' ' + r + ' 0 0 1 ' + (w - INSET) + ' ' + (INSET + r) +
      'V' + (h - INSET - r) +
      'A' + r + ' ' + r + ' 0 0 1 ' + (w - INSET - r) + ' ' + (h - INSET) +
      'H' + w / 2;
    var left =
      'M' + w / 2 + ' ' + INSET +
      'H' + (INSET + r) +
      'A' + r + ' ' + r + ' 0 0 0 ' + INSET + ' ' + (INSET + r) +
      'V' + (h - INSET - r) +
      'A' + r + ' ' + r + ' 0 0 0 ' + (INSET + r) + ' ' + (h - INSET) +
      'H' + w / 2;
    return [left, right];
  }

  function build(card) {
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'card__border');
    svg.setAttribute('aria-hidden', 'true');
    var paths = [document.createElementNS(NS, 'path'), document.createElementNS(NS, 'path')];
    paths.forEach(function (p) {
      p.setAttribute('pathLength', '100');
      svg.appendChild(p);
    });
    card.appendChild(svg);
    var delay = DELAYS[card.getAttribute('data-load')] || 0.8;
    svg.style.setProperty('--draw-delay', delay + 's');
    card.classList.add('card--drawn');

    function size() {
      var d = halves(card.offsetWidth, card.offsetHeight);
      paths[0].setAttribute('d', d[0]);
      paths[1].setAttribute('d', d[1]);
    }
    size();
    return size;
  }

  var resizers = [];
  document.querySelectorAll('.sect--shops .card, .card--opt').forEach(function (card) {
    resizers.push(build(card));
  });

  var t;
  window.addEventListener('resize', function () {
    clearTimeout(t);
    t = setTimeout(function () { resizers.forEach(function (fn) { fn(); }); }, 120);
  });
})();
