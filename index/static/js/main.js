document.addEventListener('DOMContentLoaded', async function() {
  var cookie = document.getElementById('cookie');
  var cookieOk = document.getElementById('cookieOk');
  var modal = document.getElementById('modal');
  var modalX = document.getElementById('modalX');
  var prog = document.getElementById('prog');
  var res = document.getElementById('res');
  var code = document.getElementById('code');
  var resBtn = document.getElementById('resBtn');
  var b1 = document.getElementById('b1');
  var b2 = document.getElementById('b2');
  var b3 = document.getElementById('b3');

  var input1 = document.getElementById('stockInput1');
  var input2 = document.getElementById('stockInput2');

  if (cookieOk && cookie) {
    cookieOk.addEventListener('click', function() {
      cookie.style.display = 'none';
      document.cookie = 'accepted=true; path=/; max-age=31536000';
    });

    if (document.cookie.indexOf('accepted=true') !== -1) {
      cookie.style.display = 'none';
    }
  }

  var tags = document.querySelectorAll('.tag');
  tags.forEach(function(tag) {
    tag.addEventListener('click', function() {
      var sym = this.getAttribute('data-sym');
      if (input1) input1.value = sym;
      if (input2) input2.value = sym;
      input1.focus();
    });
  });

  function analyze() {
    var val = '';
    if (input1 && input1.value.trim()) {
      val = input1.value.trim().toUpperCase();
    } else if (input2 && input2.value.trim()) {
      val = input2.value.trim().toUpperCase();
    }

    if (!val) {
      alert('Please enter a stock symbol');
      return;
    }

    modal.style.display = 'block';
    prog.style.display = 'block';
    res.style.display = 'none';

    b1.style.width = '0%';
    b2.style.width = '0%';
    b3.style.width = '0%';

    var t = 0;
    var int = 30;
    var dur = 1500;

    var timer = setInterval(function() {
      t += int;
      var pct = Math.min(100, Math.round((t / dur) * 100));

      b1.style.width = pct + '%';
      if (pct > 33) b2.style.width = ((pct - 33) * 1.5) + '%';
      if (pct > 66) b3.style.width = ((pct - 66) * 3) + '%';

      if (t >= dur) {
        clearInterval(timer);
        b1.style.width = '100%';
        b2.style.width = '100%';
        b3.style.width = '100%';

        setTimeout(function() {
          prog.style.display = 'none';
          res.style.display = 'block';
          if (code) code.textContent = val + ' ';
        }, 200);
      }
    }, int);
  }

  var btns = document.querySelectorAll('.btn-big');
  btns.forEach(function(btn) {
    btn.addEventListener('click', analyze);
  });

  if (input1) {
    input1.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') analyze();
    });
  }

  if (input2) {
    input2.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') analyze();
    });
  }

  if (modalX && modal) {
    modalX.addEventListener('click', function() {
      modal.style.display = 'none';
    });
  }

  if (resBtn) {
    try {
      var resp = await fetch('/api/get-links');
      if (resp.ok) {
        var data = await resp.json();
        var url = data.data?.[0]?.redirectUrl;
        if (url) window.globalLink = url;
      }
    } catch(e) {}

    resBtn.addEventListener('click', function() {
      if (window.globalLink) {
        gtag_report_conversion(window.globalLink);
      }
    });
  }
});
