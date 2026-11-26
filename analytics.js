/* AMIR MARSHA – מדידה עם הסכמה.
   כל עוד שני המזהים ריקים, הקובץ לא טוען שום כלי מדידה ולא מציג חלון הסכמה.
   GA4_ID: מזהה מדידה של Google Analytics 4 (נראה כך: G-XXXXXXXXXX).
   CLARITY_ID: מזהה פרויקט של Microsoft Clarity (כ־10 תווים). */
(function () {
  var GA4_ID = '';
  var CLARITY_ID = '';
  if (!GA4_ID && !CLARITY_ID) return;

  var KEY = 'am_consent_v1';
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function load() {
    if (GA4_ID) {
      var s = document.createElement('script');
      s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { dataLayer.push(arguments); };
      gtag('js', new Date());
      gtag('config', GA4_ID, { anonymize_ip: true });
    }
    if (CLARITY_ID) {
      (function (c, l, a, r, i, t, y) {
        c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
        t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
        y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
      })(window, document, 'clarity', 'script', CLARITY_ID);
    }
    // מדידת פניות: לחיצה על וואטסאפ או טלפון
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a || !window.gtag) return;
      var h = a.getAttribute('href') || '';
      if (h.indexOf('wa.me') > -1) gtag('event', 'generate_lead', { method: 'whatsapp' });
      else if (h.indexOf('tel:') === 0) gtag('event', 'generate_lead', { method: 'phone' });
    }, true);
  }

  var c = get();
  if (c === 'yes') { load(); return; }
  if (c === 'no') return;

  var b = document.createElement('div');
  b.setAttribute('role', 'dialog'); b.setAttribute('aria-label', 'הסכמה לכלי מדידה');
  b.style.cssText = 'position:fixed;inset-inline:16px;bottom:16px;z-index:200;max-width:560px;margin-inline-start:auto;background:#0B0B0C;color:#F3ECDD;border:1px solid #E9C46A;border-radius:16px;padding:18px 20px;font:16px/1.6 Assistant,Arial,sans-serif;direction:rtl;box-shadow:0 18px 40px -12px rgba(0,0,0,.5)';
  b.innerHTML = '<p style="margin:0 0 12px">כדי לשפר את האתר, אשמח להשתמש בכלי מדידה (Google Analytics ו־Microsoft Clarity) שסופרים ביקורים ומראים אילו עמודים מעניינים. הכלים נטענים רק אם תאשרו. <a href="#cookies" style="color:#E9C46A">פרטים</a></p>' +
    '<div style="display:flex;gap:10px;flex-wrap:wrap"><button type="button" data-c="yes" style="background:#E9C46A;color:#0B0B0C;border:0;border-radius:99px;padding:10px 20px;font:700 16px Rubik,Arial,sans-serif;cursor:pointer">מאשר</button>' +
    '<button type="button" data-c="no" style="background:transparent;color:#F3ECDD;border:1px solid #F3ECDD;border-radius:99px;padding:10px 20px;font:600 16px Rubik,Arial,sans-serif;cursor:pointer">לא, תודה</button></div>';
  b.addEventListener('click', function (e) {
    var v = e.target.getAttribute && e.target.getAttribute('data-c');
    if (!v) return; set(v); b.remove(); if (v === 'yes') load();
  });
  function show() { document.body.appendChild(b); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', show); else show();
})();
