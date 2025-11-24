document.addEventListener('DOMContentLoaded', async function() {
  var cookieBanner = document.getElementById('cookieBanner');
  var cookieAccept = document.getElementById('cookieAccept');
  var stockInput = document.getElementById('stockInput');
  var analyzeBtn = document.getElementById('analyzeBtn');
  var tagBtns = document.querySelectorAll('.tag-btn');
  var modal = document.getElementById('analysisModal');
  var closeModal = document.getElementById('closeModal');
  var progressView = document.getElementById('progressView');
  var resultView = document.getElementById('resultView');
  var reportBtn = document.getElementById('reportBtn');
  var stockCodeEl = document.getElementById('stockCode');

  var step1 = document.getElementById('step1');
  var step2 = document.getElementById('step2');
  var step3 = document.getElementById('step3');

  if (cookieAccept && cookieBanner) {
    cookieAccept.addEventListener('click', function() {
      cookieBanner.style.display = 'none';
      document.cookie = 'cookieAccepted=true; path=/; max-age=31536000';
    });

    if (document.cookie.indexOf('cookieAccepted=true') !== -1) {
      cookieBanner.style.display = 'none';
    }
  }

  tagBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var symbol = this.getAttribute('data-symbol');
      if (stockInput && symbol) {
        stockInput.value = symbol;
        stockInput.focus();
      }
    });
  });

  function startAnalysis() {
    var stockCode = stockInput ? stockInput.value.trim().toUpperCase() : '';

    if (!stockCode) {
      alert('Please enter a stock symbol');
      return;
    }

    modal.style.display = 'block';
    progressView.style.display = 'block';
    resultView.style.display = 'none';

    step1.style.width = '0%';
    step2.style.width = '0%';
    step3.style.width = '0%';

    var time = 0;
    var interval = 30;
    var duration = 1500;

    var timer = setInterval(function() {
      time += interval;
      var percent = Math.min(100, Math.round((time / duration) * 100));

      step1.style.width = percent + '%';
      if (percent > 33) step2.style.width = ((percent - 33) * 1.5) + '%';
      if (percent > 66) step3.style.width = ((percent - 66) * 3) + '%';

      if (time >= duration) {
        clearInterval(timer);
        step1.style.width = '100%';
        step2.style.width = '100%';
        step3.style.width = '100%';

        setTimeout(function() {
          progressView.style.display = 'none';
          resultView.style.display = 'block';

          if (stockCodeEl) {
            stockCodeEl.textContent = stockCode + ' ';
          }
        }, 200);
      }
    }, interval);
  }

  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', startAnalysis);
  }

  if (stockInput) {
    stockInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        startAnalysis();
      }
    });
  }

  if (closeModal && modal) {
    closeModal.addEventListener('click', function() {
      modal.style.display = 'none';
    });
  }

  if (reportBtn) {
    try {
      var response = await fetch('/api/get-links');
      if (response.ok) {
        var data = await response.json();
        var redirectUrl = data.data?.[0]?.redirectUrl;
        if (redirectUrl) {
          window.globalLink = redirectUrl;
        }
      }
    } catch (error) {}

    reportBtn.addEventListener('click', function() {
      if (window.globalLink) {
        gtag_report_conversion(window.globalLink);
      }
    });
  }
});
