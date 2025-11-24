document.addEventListener("DOMContentLoaded", async function () {
  // Cookie banner
  var acceptBtn = document.getElementById("cookie-accept");
  var banner = document.getElementById("cookie-banner");
  if (acceptBtn && banner) {
    acceptBtn.onclick = function () {
      banner.style.display = "none";
      document.cookie = "cookieAccepted=true; path=/; max-age=31536000";
    };
    if (document.cookie.indexOf("cookieAccepted=true") !== -1) {
      banner.style.display = "none";
    }
  }

  // Tab navigation
  var tabItems = document.querySelectorAll(".tab-item");
  var tabContents = document.querySelectorAll(".tab-content");

  tabItems.forEach(function(tab) {
    tab.addEventListener("click", function() {
      var targetTab = this.getAttribute("data-tab");

      // Remove active class from all tabs and contents
      tabItems.forEach(function(t) {
        t.classList.remove("active");
      });
      tabContents.forEach(function(c) {
        c.classList.remove("active");
      });

      // Add active class to clicked tab and corresponding content
      this.classList.add("active");
      var targetContent = document.querySelector('[data-content="' + targetTab + '"]');
      if (targetContent) {
        targetContent.classList.add("active");
      }
    });
  });

  // Analyze button and FAB
  var analyzeBtn = document.querySelector(".analyze-btn");
  var fabBtn = document.querySelector(".fab-reanalyze");
  var inputBox = document.getElementById("inputbox");
  var modal = document.getElementById("ai-modal");
  var progress = [
    document.getElementById("bar-1"),
    document.getElementById("bar-2"),
    document.getElementById("bar-3"),
  ];
  var aiProgress = document.getElementById("ai-progress");
  var aiResult = document.getElementById("ai-result");
  var chatBtn = document.getElementById("chat-btn");

  function runAnalysis() {
    var stockCode = inputBox ? inputBox.value.trim().toUpperCase() : '';

    if (!stockCode) {
      alert('Please enter a stock symbol');
      return;
    }

    modal.style.display = "block";
    aiProgress.style.display = "block";
    aiResult.style.display = "none";
    progress.forEach(function (bar) {
      bar.style.width = "0%";
    });

    var t = 0,
      interval = 30,
      duration = 1500;
    var timer = setInterval(function () {
      t += interval;
      var percent = Math.min(100, Math.round((t / duration) * 100));
      progress[0].style.width = percent + "%";
      if (percent > 33) progress[1].style.width = (percent - 33) * 1.5 + "%";
      if (percent > 66) progress[2].style.width = (percent - 66) * 3 + "%";
      if (t >= duration) {
        clearInterval(timer);
        progress.forEach(function (bar) {
          bar.style.width = "100%";
        });
        setTimeout(function () {
          aiProgress.style.display = "none";
          aiResult.style.display = "block";

          // Update tips-code with stock symbol
          var tipsCode = document.getElementById("tips-code");
          if (tipsCode && stockCode) {
            tipsCode.textContent = stockCode + " ";
          }

          // Auto switch to report tab after analysis
          setTimeout(function() {
            var reportTab = document.querySelector('[data-tab="report"]');
            if (reportTab) {
              reportTab.click();
            }
          }, 100);
        }, 200);
      }
    }, interval);
  }

  if (analyzeBtn) {
    analyzeBtn.addEventListener("click", runAnalysis);
  }

  if (fabBtn) {
    fabBtn.addEventListener("click", function() {
      if (inputBox) {
        inputBox.focus();
        inputBox.select();
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function removeLoadingOverlay() {
    const loadingOverlay = document.getElementById("loading-overlay");
    if (loadingOverlay) {
      loadingOverlay.style.display = "none";
    }
  }

  if (chatBtn) {
    try {
      const response = await fetch(`/api/get-links`);
      if (!response.ok) {
        return;
      }
      const data = await response.json();
      const redirectUrl = data.data?.[0]?.redirectUrl;
      if (redirectUrl) {
        window.globalLink = redirectUrl;
        removeLoadingOverlay();
      }
    } catch (error) {}

    chatBtn.addEventListener("click", function () {
      if (window.globalLink) {
        gtag_report_conversion(window.globalLink);
      }
    });
  }
});
