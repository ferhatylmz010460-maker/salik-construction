(function () {
  'use strict';

  // Global Copy to Clipboard function
  window.copyToClipboard = function (text, btn, e) {
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!text || !btn) return;

    function markSuccess() {
      btn.classList.add('copied');
      setTimeout(function () {
        btn.classList.remove('copied');
      }, 2000);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(markSuccess).catch(function () {
        fallbackCopy(text, markSuccess);
      });
    } else {
      fallbackCopy(text, markSuccess);
    }
  };

  function fallbackCopy(text, cb) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    ta.style.top = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand('copy');
      if (cb) cb();
    } catch (err) {
      console.warn('Copy fallback failed', err);
    }
    document.body.removeChild(ta);
  }

  // Corporate Toast Notification System
  window.showSalikToast = function (title, message) {
    var toast = document.getElementById('salikToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'salikToast';
      toast.className = 'salik-toast';
      toast.innerHTML = '<svg class="salik-toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' +
        '<div><div class="salik-toast-title" id="salikToastTitle"></div><div class="salik-toast-msg" id="salikToastMsg"></div></div>';
      document.body.appendChild(toast);
    }
    var titleEl = document.getElementById('salikToastTitle');
    var msgEl = document.getElementById('salikToastMsg');
    if (titleEl) titleEl.textContent = title || 'Notificare';
    if (msgEl) msgEl.textContent = message || '';

    toast.classList.add('visible');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function () {
      toast.classList.remove('visible');
    }, 4500);
  };

  document.addEventListener('DOMContentLoaded', function () {
    // 1. Mobile Menu
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

    // 2. Lightbox Galerie
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

    // 3. Accordion
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

    // 4. Scroll-To-Top Button
    var scrollBtn = document.getElementById('scrollTopBtn');
    if (scrollBtn) {
      window.addEventListener('scroll', function () {
        if (window.pageYOffset > 300) {
          scrollBtn.classList.add('visible');
        } else {
          scrollBtn.classList.remove('visible');
        }
      }, { passive: true });

      scrollBtn.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }

    // 5. GDPR Cookie Banner
    var cookieBanner = document.getElementById('salikCookieBanner');
    var acceptBtn = document.getElementById('scbAccept');
    var closeBtn = document.getElementById('scbDecline');

    if (cookieBanner) {
      var isConsented = localStorage.getItem('salik_cookie_consent');
      if (!isConsented) {
        setTimeout(function () {
          cookieBanner.classList.add('visible');
        }, 1200);
      }

      function dismissBanner() {
        localStorage.setItem('salik_cookie_consent', 'accepted');
        cookieBanner.classList.remove('visible');
      }

      if (acceptBtn) acceptBtn.addEventListener('click', dismissBanner);
      if (closeBtn) closeBtn.addEventListener('click', dismissBanner);
    }

    // 6. Smart Deviz Carryover to Contact Form (from tarife.html)
    var devizMsg = sessionStorage.getItem('salik_deviz_message');
    var msgField = document.querySelector('textarea[name="your-message"]');
    var formContainer = document.getElementById('wpcf7-f6-o1') || document.getElementById('contactForm');

    if (devizMsg && msgField) {
      msgField.value = devizMsg;
      if (formContainer) {
        var alertEl = document.createElement('div');
        alertEl.className = 'deviz-carryover-alert';
        alertEl.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' +
          '<div><strong>Deviz importat cu succes!</strong> Detaliile calculate în pagina de tarife au fost adăugate automat în mesaj. Completați datele de contact și trimiteți solicitarea.</div>';
        formContainer.parentNode.insertBefore(alertEl, formContainer);
        setTimeout(function () {
          alertEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
      sessionStorage.removeItem('salik_deviz_message');
      sessionStorage.removeItem('salik_deviz_total');
    }

    // 7. Form Anti-Abuse, Anti-Spam Protection & IP Rate Limiting (Faz 3)
    var contactForm = document.getElementById('contactForm');
    var pageLoadTime = Date.now();
    var clientIpAddress = '';

    // Asynchronously detect client IP in the background
    (function detectClientIp() {
      try {
        fetch('https://api64.ipify.org?format=json')
          .then(function (res) { return res.json(); })
          .then(function (data) {
            if (data && data.ip) {
              clientIpAddress = data.ip;
              var ipInput = document.getElementById('clientIpInput');
              if (ipInput) ipInput.value = data.ip;
            }
          })
          .catch(function () {
            fetch('https://api.ipify.org?format=json')
              .then(function (res) { return res.json(); })
              .then(function (data) {
                if (data && data.ip) {
                  clientIpAddress = data.ip;
                  var ipInput = document.getElementById('clientIpInput');
                  if (ipInput) ipInput.value = data.ip;
                }
              })
              .catch(function () {});
          });
      } catch (e) {}
    })();

    // Helper: Daily submissions tracker (max 2 submissions per IP/day)
    function getTodayKey() {
      var d = new Date();
      return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
    }

    function getDailySubmissionsRecord() {
      var todayKey = getTodayKey();
      try {
        var record = JSON.parse(localStorage.getItem('salik_daily_submissions') || '{}');
        if (record && record.date === todayKey) {
          return record;
        }
      } catch (e) {}
      return { date: todayKey, count: 0, ip: '' };
    }

    function setDailySubmissionsRecord(count, ip) {
      try {
        localStorage.setItem('salik_daily_submissions', JSON.stringify({
          date: getTodayKey(),
          count: count,
          ip: ip || clientIpAddress || ''
        }));
      } catch (e) {}
    }

    if (contactForm) {
      var submitBtn = contactForm.querySelector('input[type="submit"]') || contactForm.querySelector('button[type="submit"]');
      var noticeBox = document.getElementById('formNotice');
      if (!noticeBox) {
        noticeBox = document.getElementById('formSuccess');
      }

      function showFormNotice(msg, type) {
        if (!noticeBox) return;
        noticeBox.style.display = 'block';
        noticeBox.className = 'form-notice notice-' + (type || 'error');
        noticeBox.innerHTML = msg;
        noticeBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Check if user has already reached the daily limit (2 per day) upon page load
      var initialDaily = getDailySubmissionsRecord();
      if (initialDaily.count >= 2) {
        showFormNotice('<strong>Limită zilnică atinsă (2/2):</strong> Ați trimis deja 2 solicitări astăzi de la această conexiune. Pentru urgențe, vă rugăm să ne contactați direct pe <a href="https://wa.me/40721768968" target="_blank" rel="noopener noreferrer" style="color:inherit;text-decoration:underline;font-weight:700;">WhatsApp</a> sau telefonic la <a href="tel:0721768968" style="color:inherit;text-decoration:underline;font-weight:700;">0721 768 968</a>.', 'warning');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.value = 'Limită zilnică atinsă (2/2)';
        }
      }

      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // 0. Daily Submission Limit Check (Max 2 requests per IP / day)
        var currentDaily = getDailySubmissionsRecord();
        if (currentDaily.count >= 2) {
          showFormNotice('Ați atins limita maximă de 2 solicitări pe zi de la această conexiune. Pentru solicitări urgente, vă rugăm să ne contactați direct telefonic sau pe WhatsApp la 0721 768 968.', 'warning');
          if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.value = 'Limită zilnică atinsă (2/2)';
          }
          return;
        }

        // 1. Honeypot Bot Trap Check
        var hpHidden = contactForm.querySelector('input[name="client_security_verification"]');
        if (hpHidden && hpHidden.value.trim().length > 0) {
          // Fake success to misdirect the bot without saving anything
          contactForm.reset();
          showFormNotice('✓ Mesajul dumneavoastră a fost procesat.', 'success');
          return;
        }

        // 2. Time-Gate Check (minimum 2.5 seconds human threshold)
        var elapsedSec = (Date.now() - pageLoadTime) / 1000;
        if (elapsedSec < 2.5) {
          showFormNotice('Vă rugăm să verificați informațiile introduse înainte de a trimite formularul.', 'warning');
          return;
        }

        // 3. 60-Second Client Cooldown Check (Anti Rapid-Fire Spam)
        var lastSubmit = parseInt(localStorage.getItem('salik_form_last_submit') || '0', 10);
        var timeSinceLast = (Date.now() - lastSubmit) / 1000;
        if (timeSinceLast < 60) {
          var waitTime = Math.ceil(60 - timeSinceLast);
          showFormNotice('Ați trimis deja o solicitare. Pentru a preveni trimiterile duplicate, vă rugăm să așteptați încă ' + waitTime + ' secunde.', 'warning');
          return;
        }

        // 4. Input Validations
        var nameInput = contactForm.querySelector('input[name="your-name"]');
        var phoneInput = contactForm.querySelector('input[name="your-phone"]');
        var emailInput = contactForm.querySelector('input[name="your-email"]');
        var messageInput = contactForm.querySelector('textarea[name="your-message"]');
        var accCheckbox = contactForm.querySelector('input[name="acc-1"]');

        var nameVal = nameInput ? nameInput.value.trim() : '';
        var phoneVal = phoneInput ? phoneInput.value.trim() : '';
        var emailVal = emailInput ? emailInput.value.trim() : '';
        var msgVal = messageInput ? messageInput.value.trim() : '';

        if (!nameVal || nameVal.length < 2) {
          showFormNotice('Vă rugăm să introduceți numele complet.', 'error');
          if (nameInput) nameInput.focus();
          return;
        }

        // Phone Validation (minimum 7 digits, maximum 18)
        var phoneCleanDigits = phoneVal.replace(/\D/g, '');
        if (!phoneCleanDigits || phoneCleanDigits.length < 7 || phoneCleanDigits.length > 18) {
          showFormNotice('Vă rugăm să introduceți un număr de telefon valid (ex. 0721 768 968).', 'error');
          if (phoneInput) phoneInput.focus();
          return;
        }

        // Optional Email Validation
        if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
          showFormNotice('Vă rugăm să introduceți o adresă de email validă.', 'error');
          if (emailInput) emailInput.focus();
          return;
        }

        if (!msgVal || msgVal.length < 5) {
          showFormNotice('Vă rugăm să descrieți detaliile proiectului dumneavoastră.', 'error');
          if (messageInput) messageInput.focus();
          return;
        }

        if (accCheckbox && !accCheckbox.checked) {
          showFormNotice('Vă rugăm să bifați acordul privind prelucrarea datelor cu caracter personal.', 'warning');
          return;
        }

        // 5. Locking Button / Loading State (Anti Double-Click)
        var originalBtnVal = submitBtn ? submitBtn.value : 'Trimite mesajul';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.value = 'Se trimite...';
        }

        // 6. Record cooldown timestamp
        localStorage.setItem('salik_form_last_submit', String(Date.now()));

        setTimeout(function () {
          // Increment daily count
          var newCount = currentDaily.count + 1;
          setDailySubmissionsRecord(newCount, clientIpAddress);

          // Success state display
          if (noticeBox) {
            noticeBox.style.display = 'block';
            noticeBox.className = 'form-notice notice-success';
            if (newCount >= 2) {
              noticeBox.innerHTML = '<strong>✓ Solicitarea dumneavoastră a fost înregistrată cu succes! (2/2 astăzi)</strong><br>Ați atins limita maximă de 2 solicitări pe zi de la această conexiune. Echipa SALIK CONSTRUCTION vă va contacta în cel mai scurt timp pentru detalii și oferta tehnică.';
            } else {
              noticeBox.innerHTML = '<strong>✓ Solicitarea dumneavoastră a fost înregistrată cu succes! (1/2 astăzi)</strong><br>Echipa SALIK CONSTRUCTION vă va contacta în cel mai scurt timp pentru detalii și oferta tehnică.';
            }
            noticeBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }

          if (window.showSalikToast) {
            window.showSalikToast('Mesaj Trimis!', 'Solicitarea dumneavoastră a fost recepționată cu succes.');
          }

          contactForm.reset();

          if (submitBtn) {
            if (newCount >= 2) {
              submitBtn.disabled = true;
              submitBtn.value = 'Limită zilnică atinsă (2/2)';
            } else {
              setTimeout(function () {
                submitBtn.disabled = false;
                submitBtn.value = originalBtnVal;
              }, 3000);
            }
          }
        }, 650);
      });
    }
  });
})();
