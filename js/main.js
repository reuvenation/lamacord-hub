// Анимация рамок карточек: две половины окантовки «рисуются» от верхней
// середины по обеим сторонам вниз и встречаются в нижней середине.
// SVG живёт ТОЛЬКО на время анимации: после её конца возвращается обычный
// CSS-бордер (в статике он идеален при любом зуме). Размеры берём из
// getBoundingClientRect (дробные пиксели — без расхождений с карточкой).
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var NS = 'http://www.w3.org/2000/svg';
  var INSET = 1;   // половина stroke 2px — центр линии на месте CSS-бордера
  var RADIUS = 22; // border-radius карточки

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

  document.querySelectorAll('.sect--shops .card, .card--opt').forEach(function (card) {
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'card__border');
    svg.setAttribute('aria-hidden', 'true');
    var paths = [document.createElementNS(NS, 'path'), document.createElementNS(NS, 'path')];
    paths.forEach(function (p) {
      p.setAttribute('pathLength', '100');
      svg.appendChild(p);
    });

    function size() {
      var rect = card.getBoundingClientRect();
      var d = halves(rect.width, rect.height);
      paths[0].setAttribute('d', d[0]);
      paths[1].setAttribute('d', d[1]);
    }
    size();

    card.appendChild(svg);
    card.classList.add('card--drawn');

    // рамка дорисована — убираем SVG, возвращаем CSS-бордер
    var done = 0;
    svg.addEventListener('animationend', function () {
      if (++done < paths.length) return;
      card.classList.remove('card--drawn');
      svg.remove();
    });

    // пока SVG жив, при ресайзе/зуме перестраиваем пути под новый размер
    var t;
    window.addEventListener('resize', function () {
      if (!svg.isConnected) return;
      clearTimeout(t);
      t = setTimeout(size, 100);
    });
  });
})();
