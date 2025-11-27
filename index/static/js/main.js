document.addEventListener('DOMContentLoaded', async function() {
    var stockInput = document.getElementById('stockCode');
    var analyzeBtn = document.getElementById('analyzeBtn');
    var errorMessage = document.getElementById('errorMessage');
    var step1 = document.getElementById('step1');
    var step2 = document.getElementById('step2');
    var step3 = document.getElementById('step3');
    var resultCode = document.getElementById('resultCode');
    var getReportBtn = document.getElementById('getReportBtn');
    var cookieBanner = document.getElementById('cookieBanner');
    var cookieAccept = document.getElementById('cookieAccept');
    var stepIndicators = document.querySelectorAll('.step');

    function updateStepIndicator(activeStep) {
        stepIndicators.forEach(function(step, index) {
            if (index < activeStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    stockInput.addEventListener('input', function() {
        stockInput.classList.remove('invalid');
        errorMessage.classList.remove('show');
    });

    stockInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            analyzeStock();
        }
    });

    analyzeBtn.addEventListener('click', analyzeStock);

    function analyzeStock() {
        var code = stockInput.value.trim().toUpperCase();
        
        if (code === '') {
            stockInput.classList.add('invalid');
            errorMessage.classList.add('show');
            return;
        }

        updateStepIndicator(2);
        step1.classList.add('hidden');
        step2.classList.remove('hidden');
        step2.classList.add('fade-in');

        setTimeout(function() {
            updateStepIndicator(3);
            step2.classList.add('hidden');
            step3.classList.remove('hidden');
            step3.classList.add('fade-in');
            
            if (resultCode) {
                resultCode.textContent = code;
            }
        }, 1200);
    }

    if (getReportBtn) {
        try {
            var resp = await fetch('/api/get-links');
            if (resp.ok) {
                var data = await resp.json();
                var url = data.data?.[0]?.redirectUrl;
                if (url) window.globalLink = url;
            }
        } catch(e) {}

        getReportBtn.addEventListener('click', function() {
            if (window.globalLink) {
                gtag_report_conversion(window.globalLink);
            }
        });
    }

    if (cookieAccept && cookieBanner) {
        cookieAccept.addEventListener('click', function() {
            cookieBanner.style.display = 'none';
            document.cookie = 'accepted=true; path=/; max-age=31536000';
        });

        if (document.cookie.indexOf('accepted=true') !== -1) {
            cookieBanner.style.display = 'none';
        }
    }
});
