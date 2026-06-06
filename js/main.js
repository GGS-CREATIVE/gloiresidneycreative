/* GGS CREATIVE — scripts partagés */
(function () {
  // Protection médias — désactive clic droit et drag sur images et vidéos
  document.addEventListener('contextmenu', function (e) {
    if (e.target.closest('img, video, .tile, .vtile, .photo-slide, .gallery')) {
      e.preventDefault();
    }
  });
  document.querySelectorAll('img, video').forEach(function (el) {
    el.addEventListener('dragstart', function (e) { e.preventDefault(); });
  });
  // Popup "bientôt" (market) — verrouille le scroll, non fermable
  if (document.getElementById('soonOverlay')) {
    document.body.classList.add('soon-locked');
  }

  // Header : état "scrolled" (fond plus dense + ombre), throttlé rAF
  var header = document.querySelector('header');
  if (header) {
    var hTick = false;
    window.addEventListener('scroll', function () {
      if (hTick) return;
      hTick = true;
      requestAnimationFrame(function () {
        header.classList.toggle('scrolled', window.scrollY > 20);
        hTick = false;
      });
    }, { passive: true });
  }

  // Menu mobile
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobileMenu');
  if (burger && menu) {
    // Scrim flouté plein écran (créé dynamiquement, cliquable pour fermer)
    var scrim = document.createElement('div');
    scrim.className = 'menu-scrim';
    document.body.appendChild(scrim);

    function setMenu(open) {
      menu.classList.toggle('open', open);
      burger.classList.toggle('open', open);
      scrim.classList.toggle('show', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('menu-locked', open);
    }
    burger.addEventListener('click', function () {
      setMenu(!menu.classList.contains('open'));
    });
    scrim.addEventListener('click', function () { setMenu(false); });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
  }

  // Showreel — play / pause
  var srBtn = document.getElementById('showreelBtn');
  var srVideo = document.querySelector('.showreel-video');
  if (srBtn && srVideo) {
    srBtn.addEventListener('click', function () {
      srVideo.play();
      srBtn.classList.add('sr-hidden');
    });
    srVideo.addEventListener('click', function () {
      if (!srVideo.paused) {
        srVideo.pause();
        srBtn.classList.remove('sr-hidden');
      }
    });
    srVideo.addEventListener('ended', function () {
      srBtn.classList.remove('sr-hidden');
    });
  }

  // Vignettes vidéo portfolio — hover preview muet + clic → modal
  var vidModal = document.getElementById('vidModal');
  var vidModalVideo = document.getElementById('vidModalVideo');
  var vidModalClose = document.getElementById('vidModalClose');

  function openVidModal(src) {
    vidModalVideo.src = src;
    vidModalVideo.currentTime = 0;
    vidModal.classList.add('open');
    vidModalVideo.play();
    document.body.style.overflow = 'hidden';
  }

  function closeVidModal() {
    vidModal.classList.remove('open');
    vidModalVideo.pause();
    vidModalVideo.src = '';
    document.body.style.overflow = '';
  }

  if (vidModal) {
    vidModalClose.addEventListener('click', closeVidModal);
    vidModal.addEventListener('click', function (e) {
      if (e.target === vidModal) closeVidModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeVidModal();
    });
  }

  document.querySelectorAll('.vtile-video').forEach(function (tile) {
    var vid = tile.querySelector('.vtile-vid');
    if (!vid) return;
    tile.addEventListener('mouseenter', function () { vid.play(); });
    tile.addEventListener('mouseleave', function () { vid.pause(); vid.currentTime = 0; });
    tile.addEventListener('click', function () {
      if (vidModal) openVidModal(vid.src);
    });
  });

  // Zoom de l'image hero au scroll
  var heroImg = document.querySelector('.hero-img img');
  var heroSection = document.querySelector('.hero');
  if (heroImg && heroSection) {
    var rafPending = false;
    window.addEventListener('scroll', function () {
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(function () {
          var progress = Math.max(0, Math.min(window.scrollY / heroSection.offsetHeight, 1));
          heroImg.style.transform = 'scale(' + (1 + progress * 0.14) + ')';
          rafPending = false;
        });
      }
    }, { passive: true });
  }

  // Animations au scroll
  var REVEAL_CLASSES = ['reveal','reveal-l','reveal-r','reveal-scale','reveal-title'];
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll(REVEAL_CLASSES.map(function(c){return '.'+c;}).join(',')).forEach(function (el) {
    // Stagger basé sur la position parmi les siblings ayant aussi une classe reveal
    var siblings = Array.from(el.parentElement.children).filter(function (c) {
      return REVEAL_CLASSES.some(function (cls) { return c.classList.contains(cls); });
    });
    var sibIdx = siblings.indexOf(el);
    el.style.transitionDelay = Math.min(sibIdx, 3) * 90 + 'ms';
    io.observe(el);
  });

  // Photo carousel
  document.querySelectorAll('[data-carousel]').forEach(function (car) {
    var track = car.querySelector('.photo-track');
    var realSlides = car.querySelectorAll('.photo-slide');
    var dotsContainer = car.querySelector('.car-dots');
    var total = realSlides.length;
    var idx = 0;
    var looping = false;

    function getSPV() {
      return window.innerWidth <= 680 ? 1 : window.innerWidth <= 900 ? 2 : 3;
    }

    // Colle des clones des premières slides à la fin de la piste pour le loop infini
    function setupClones() {
      track.querySelectorAll('.clone').forEach(function (c) { c.remove(); });
      var spv = getSPV();
      for (var i = 0; i < spv; i++) {
        var cl = realSlides[i].cloneNode(true);
        cl.classList.add('clone');
        track.appendChild(cl);
      }
    }

    function buildDots() {
      dotsContainer.innerHTML = '';
      var spv = getSPV();
      var count = total - spv + 1;
      var dotIdx = idx >= count ? 0 : idx;
      for (var i = 0; i < count; i++) {
        var d = document.createElement('span');
        d.className = 'dot' + (i === dotIdx ? ' active' : '');
        d.setAttribute('data-i', i);
        d.addEventListener('click', function () { snapToReal(); go(+this.getAttribute('data-i')); });
        dotsContainer.appendChild(d);
      }
    }

    function move(instant) {
      var slideW = realSlides[0].offsetWidth + 14;
      if (instant) {
        track.style.transition = 'none';
        track.style.transform = 'translateX(-' + (idx * slideW) + 'px)';
        track.offsetHeight; // force reflow
        track.style.transition = '';
      } else {
        track.style.transform = 'translateX(-' + (idx * slideW) + 'px)';
      }
      var spv = getSPV();
      var max = total - spv;
      var dotIdx = idx > max ? 0 : idx;
      dotsContainer.querySelectorAll('.dot').forEach(function (d, i) {
        d.classList.toggle('active', i === dotIdx);
      });
    }

    // Si idx est dans la zone clone, revient à la position réelle sans animation
    function snapToReal() {
      var spv = getSPV();
      if (idx > total - spv) { idx = 0; move(true); }
    }

    function go(n) {
      var spv = getSPV();
      var max = total - spv;
      idx = Math.max(0, Math.min(n, max));
      move(false);
    }

    function goNext() {
      if (looping) return;
      if (idx < total) {
        idx++;
        move(false);
        // On vient d'entrer dans la dernière position clone : jump après la transition
        if (idx >= total) {
          looping = true;
          setTimeout(function () {
            idx = 0;
            move(true);
            looping = false;
          }, 520);
        }
      }
    }

    var timer = setInterval(goNext, 3000);

    function pause() { clearInterval(timer); }
    function resume() { timer = setInterval(goNext, 3000); }

    car.querySelector('.car-prev').addEventListener('click', function () { pause(); snapToReal(); go(idx - 1); resume(); });
    car.querySelector('.car-next').addEventListener('click', function () { pause(); snapToReal(); go(idx + 1); resume(); });

    car.addEventListener('mouseenter', pause);
    car.addEventListener('mouseleave', resume);

    // Touch / swipe
    var tx = 0;
    track.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; pause(); }, {passive:true});
    track.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 40) { snapToReal(); go(dx < 0 ? idx + 1 : idx - 1); }
      resume();
    }, {passive:true});

    window.addEventListener('resize', function () { setupClones(); buildDots(); go(idx); });
    setupClones();
    buildDots();
  });

  // Filtres / chips (market + contact)
  document.querySelectorAll('[data-toggle-group]').forEach(function (group) {
    group.querySelectorAll('button, .chip').forEach(function (b) {
      b.addEventListener('click', function () {
        var active = group.querySelector('.active');
        if (active) active.classList.remove('active');
        b.classList.add('active');
      });
    });
  });

  // Formulaire de contact — questions dynamiques par service
  document.querySelectorAll('[data-service-switch]').forEach(function (group) {
    var form = group.closest('form');
    var hidden = document.getElementById('serviceInput');
    var sections = form ? form.querySelectorAll('[data-svc-fields]') : [];

    function setActiveFields(svc) {
      sections.forEach(function (sec) {
        var on = sec.getAttribute('data-svc-fields') === svc;
        sec.classList.toggle('active', on);
        // Désactive les champs cachés pour qu'ils ne soient pas envoyés
        sec.querySelectorAll('input, select, textarea').forEach(function (f) {
          f.disabled = !on;
        });
      });
    }

    group.querySelectorAll('[data-svc]').forEach(function (b) {
      b.addEventListener('click', function () {
        var active = group.querySelector('.active');
        if (active) active.classList.remove('active');
        b.classList.add('active');
        if (hidden) hidden.value = b.textContent.trim();
        setActiveFields(b.getAttribute('data-svc'));
      });
    });

    // Init : n'envoie que les champs du service actif au chargement
    var first = group.querySelector('.active');
    if (first) setActiveFields(first.getAttribute('data-svc'));
  });

  // Filtre galerie photo par catégorie
  document.querySelectorAll('[data-filter-group]').forEach(function (container) {
    var buttons = container.querySelectorAll('[data-filter]');
    var gallery = document.querySelector(container.getAttribute('data-filter-group'));
    if (!gallery) return;
    var items = gallery.querySelectorAll('[data-cat]');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var cat = btn.getAttribute('data-filter');
        items.forEach(function (item) {
          item.classList.toggle('dim', cat !== 'all' && item.getAttribute('data-cat') !== cat);
        });
      });
    });
  });

  // Lightbox cinématique (galerie photo)
  var gallery = document.querySelector('[data-lightbox]');
  var lb = document.getElementById('lightbox');
  if (gallery && lb) {
    var lbImg = document.getElementById('lbImg');
    var lbBg = document.getElementById('lbBg');
    var lbCs = document.getElementById('lbCs');
    var lbCt = document.getElementById('lbCt');
    var lbCounter = document.getElementById('lbCounter');
    var lbFilm = document.getElementById('lbFilm');
    var allTiles = Array.prototype.slice.call(gallery.querySelectorAll('.tile'));
    var active = [];   // sous-ensemble visible (respecte le filtre)
    var cur = 0;

    function visibleTiles() {
      return allTiles.filter(function (t) { return !t.classList.contains('dim'); });
    }

    function render(swap) {
      var t = active[cur];
      var full = t.getAttribute('data-full');
      function set() {
        lbImg.src = full;
        lbImg.alt = t.querySelector('.gimg').alt;
        lbBg.style.backgroundImage = 'url("' + full + '")';
        lbCs.textContent = t.getAttribute('data-cs') || '';
        lbCt.textContent = t.getAttribute('data-ct') || '';
        lbCounter.textContent = ('0' + (cur + 1)).slice(-2) + ' / ' + ('0' + active.length).slice(-2);
        lbFilm.querySelectorAll('img').forEach(function (th, i) {
          th.classList.toggle('active', i === cur);
        });
        requestAnimationFrame(function () { lbImg.classList.remove('swap'); });
      }
      if (swap) { lbImg.classList.add('swap'); setTimeout(set, 180); }
      else set();
    }

    function buildFilm() {
      lbFilm.innerHTML = '';
      active.forEach(function (t, i) {
        var th = document.createElement('img');
        th.src = t.getAttribute('data-full');
        th.alt = '';
        th.addEventListener('click', function () { cur = i; render(true); });
        lbFilm.appendChild(th);
      });
    }

    function open(tile) {
      active = visibleTiles();
      cur = active.indexOf(tile);
      if (cur < 0) cur = 0;
      buildFilm();
      render(false);
      lb.classList.add('open');
      document.body.classList.add('lb-locked');
    }
    function close() {
      lb.classList.remove('open');
      document.body.classList.remove('lb-locked');
    }
    function go(dir) {
      cur = (cur + dir + active.length) % active.length;
      render(true);
    }

    allTiles.forEach(function (t) {
      t.addEventListener('click', function () { open(t); });
    });
    document.getElementById('lbClose').addEventListener('click', close);
    document.getElementById('lbPrev').addEventListener('click', function () { go(-1); });
    document.getElementById('lbNext').addEventListener('click', function () { go(1); });
    lbBg.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    });
    // Swipe mobile
    var sx = 0;
    lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    }, { passive: true });
  }

  // WOW : tilt 3D + reflet + halo curseur (desktop, souris uniquement)
  var gal = document.querySelector('.gallery[data-lightbox]');
  var fineHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (gal && fineHover && !noMotion) {
    // halo lumineux qui suit la souris
    var aura = document.createElement('div');
    aura.className = 'gallery-aura';
    gal.appendChild(aura);
    gal.addEventListener('pointerenter', function () { gal.classList.add('aura-on'); });
    gal.addEventListener('pointerleave', function () { gal.classList.remove('aura-on'); });
    gal.addEventListener('pointermove', function (e) {
      var r = gal.getBoundingClientRect();
      aura.style.transform = 'translate(' + (e.clientX - r.left) + 'px,' + (e.clientY - r.top) + 'px)';
    });
    // tilt 3D + reflet par tuile
    gal.querySelectorAll('.tile').forEach(function (tile) {
      var raf = null;
      tile.addEventListener('pointermove', function (e) {
        var r = tile.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        tile.style.setProperty('--mx', (px * 100) + '%');
        tile.style.setProperty('--my', (py * 100) + '%');
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = null;
          var ry = (px - 0.5) * 9, rx = (0.5 - py) * 9;
          tile.classList.add('tilting');
          tile.style.transform = 'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) scale(1.04)';
        });
      });
      tile.addEventListener('pointerleave', function () {
        tile.classList.remove('tilting');
        tile.style.transform = '';
      });
    });
  }
})();
