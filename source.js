/* AMIR MARSHA – זיהוי מקור פנייה, בלי עוגיות ובלי כלי צד שלישי.
   מבקר שנכנס עם utm_source (למשל מהביו בטיקטוק) ולוחץ על וואטסאפ שולח הודעה עם תגית מקור, למשל "(הגעתי מטיקטוק)".
   המקור נשמר רק ללשונית הנוכחית (sessionStorage) ונמחק כשסוגרים אותה. */
(function () {
  var NAMES = { tiktok: 'טיקטוק', instagram: 'אינסטגרם', facebook: 'פייסבוק', youtube: 'יוטיוב' };
  var src = '';
  try {
    src = new URLSearchParams(location.search).get('utm_source') || '';
    if (src) sessionStorage.setItem('am_src', src); else src = sessionStorage.getItem('am_src') || '';
  } catch (e) {}
  if (!NAMES[src]) return;
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="wa.me"]');
    if (!a) return;
    try {
      var u = new URL(a.getAttribute('href'), location.href);
      var tag = ' (הגעתי מ' + NAMES[src] + ')';
      var t = u.searchParams.get('text') || 'היי אמיר';
      if (t.indexOf(tag) === -1) { u.searchParams.set('text', t + tag); a.setAttribute('href', u.toString()); }
    } catch (err) {}
  }, true);
})();
