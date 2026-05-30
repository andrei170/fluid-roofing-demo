// ===== Fluid Roofing demo - shared interactions =====

// Set this to a Formspree (https://formspree.io/f/XXXX) or Web3Forms endpoint to make
// the quote form deliver real leads to an inbox/CRM. Left empty = demo confirmation only.
var FORM_ENDPOINT = "";

document.addEventListener('DOMContentLoaded', function () {

  // ---- Scroll reveal ----
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  // ---- Multi-step quote form ----
  var form = document.getElementById('qform');
  if (!form) return;
  var steps = Array.prototype.slice.call(form.querySelectorAll('.step'));
  var bars = Array.prototype.slice.call(form.querySelectorAll('.progress i'));
  var cur = 0;

  function show(i) {
    steps.forEach(function (s, n) { s.classList.toggle('active', n === i); });
    bars.forEach(function (b, n) { b.classList.toggle('on', n <= i); });
    cur = i;
  }

  // service option selection (step 1)
  form.querySelectorAll('.opt').forEach(function (o) {
    o.addEventListener('click', function () {
      form.querySelectorAll('.opt').forEach(function (x) { x.classList.remove('sel'); });
      o.classList.add('sel');
      form.querySelector('#svc').value = o.getAttribute('data-v');
      form.querySelector('#svcErr').style.display = 'none';
    });
  });

  function valid(i) {
    if (i === 0) {
      if (!form.querySelector('#svc').value) { form.querySelector('#svcErr').style.display = 'block'; return false; }
    }
    if (i === 2) {
      var n = form.querySelector('[name=name]').value.trim();
      var p = form.querySelector('[name=phone]').value.trim();
      if (!n || !p) { form.querySelector('#contactErr').style.display = 'block'; return false; }
      form.querySelector('#contactErr').style.display = 'none';
    }
    return true;
  }

  form.querySelectorAll('[data-next]').forEach(function (b) {
    b.addEventListener('click', function () { if (valid(cur)) show(Math.min(cur + 1, steps.length - 1)); });
  });
  form.querySelectorAll('[data-back]').forEach(function (b) {
    b.addEventListener('click', function () { show(Math.max(cur - 1, 0)); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!valid(2)) return;
    var done = function () {
      form.style.display = 'none';
      document.getElementById('qok').style.display = 'block';
    };
    if (FORM_ENDPOINT) {
      var data = new FormData(form);
      fetch(FORM_ENDPOINT, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } })
        .then(done).catch(done);
    } else {
      done(); // demo mode
    }
  });

  show(0);
});
