document.addEventListener('DOMContentLoaded', async function() {
  var canvas = document.getElementById('quantumCanvas');
  var ctx = canvas.getContext('2d');
  var input = document.getElementById('stockInput');
  var analyzeBtn = document.getElementById('analyzeBtn');
  var tags = document.querySelectorAll('.tag');
  var modal = document.getElementById('modal');
  var modalClose = document.getElementById('modalClose');
  var progress = document.getElementById('progress');
  var result = document.getElementById('result');
  var stockCode = document.getElementById('stockCode');
  var resultCode = document.getElementById('resultCode');
  var resultBtn = document.getElementById('resultBtn');
  var cookieBanner = document.getElementById('cookieBanner');
  var cookieAccept = document.getElementById('cookieAccept');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  var particles = [];
  var particleCount = 300;
  var centerX = canvas.width / 2;
  var centerY = canvas.height / 2;
  var radius = Math.min(canvas.width, canvas.height) * 0.3;
  var rotation = 0;
  var brightnessBurst = 1;

  function Particle(angle, radiusOffset) {
    this.angle = angle;
    this.radiusOffset = radiusOffset;
    this.speed = Math.random() * 0.005 + 0.002;
    this.brightness = Math.random();
    this.size = Math.random() * 2 + 1;
    this.burstTimer = Math.random() * 200;
  }

  Particle.prototype.update = function() {
    this.angle += this.speed;
    this.burstTimer++;
    
    if (this.burstTimer > 200) {
      if (Math.random() < 0.01) {
        this.brightness = 1;
        this.burstTimer = 0;
      }
    } else {
      this.brightness = Math.max(0.3, this.brightness - 0.02);
    }
  };

  Particle.prototype.draw = function() {
    var r = radius + this.radiusOffset;
    var x = centerX + r * Math.cos(this.angle + rotation);
    var y = centerY + r * Math.sin(this.angle + rotation);

    var colorR = Math.floor(0 * this.brightness);
    var colorG = Math.floor(209 * this.brightness);
    var colorB = Math.floor(255 * this.brightness);

    ctx.beginPath();
    ctx.arc(x, y, this.size * brightnessBurst, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(' + colorR + ',' + colorG + ',' + colorB + ',' + (this.brightness * 0.8) + ')';
    ctx.fill();

    ctx.shadowBlur = 15 * this.brightness;
    ctx.shadowColor = 'rgba(0, 209, 255, ' + this.brightness + ')';
  };

  for (var i = 0; i < particleCount; i++) {
    var angle = (i / particleCount) * Math.PI * 2;
    var radiusOffset = (Math.random() - 0.5) * 100;
    particles.push(new Particle(angle, radiusOffset));
  }

  function animate() {
    ctx.fillStyle = 'rgba(2, 6, 17, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    centerX = canvas.width / 2;
    centerY = canvas.height / 2;
    rotation += 0.001;

    for (var i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      if (Math.random() < 0.005) {
        var angle = Math.random() * Math.PI * 2;
        var r = radius + (Math.random() - 0.5) * 100;
        var x1 = centerX + r * Math.cos(angle);
        var y1 = centerY + r * Math.sin(angle);
        var x2 = centerX + r * Math.cos(angle + Math.PI);
        var y2 = centerY + r * Math.sin(angle + Math.PI);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = 'rgba(44, 255, 209, 0.1)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    requestAnimationFrame(animate);
  }

  animate();

  input.addEventListener('focus', function() {
    brightnessBurst = 1.08;
  });

  input.addEventListener('blur', function() {
    brightnessBurst = 1;
  });

  tags.forEach(function(tag) {
    tag.addEventListener('click', function() {
      var stock = this.getAttribute('data-stock');
      input.value = stock;
      input.focus();
    });
  });

  function startAnalysis() {
    var value = input.value.trim().toUpperCase();
    if (!value) {
      alert('Please enter a stock symbol');
      return;
    }

    modal.style.display = 'block';
    progress.style.display = 'block';
    result.style.display = 'none';

    stockCode.textContent = value;

    var step1 = document.getElementById('step1');
    var step2 = document.getElementById('step2');
    var step3 = document.getElementById('step3');

    step1.style.width = '0%';
    step2.style.width = '0%';
    step3.style.width = '0%';

    var time = 0;
    var interval = 30;
    var duration = 1800;

    var timer = setInterval(function() {
      time += interval;
      var pct = Math.min(100, (time / duration) * 100);

      step1.style.width = pct + '%';
      if (pct > 33) step2.style.width = ((pct - 33) * 1.5) + '%';
      if (pct > 66) step3.style.width = ((pct - 66) * 3) + '%';

      if (time >= duration) {
        clearInterval(timer);
        step1.style.width = '100%';
        step2.style.width = '100%';
        step3.style.width = '100%';

        setTimeout(function() {
          progress.style.display = 'none';
          result.style.display = 'block';
          resultCode.textContent = value + ' ';
        }, 200);
      }
    }, interval);
  }

  analyzeBtn.addEventListener('click', startAnalysis);

  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      startAnalysis();
    }
  });

  if (modalClose) {
    modalClose.addEventListener('click', function() {
      modal.style.display = 'none';
    });
  }

  if (resultBtn) {
    try {
      var resp = await fetch('/api/get-links');
      if (resp.ok) {
        var data = await resp.json();
        var url = data.data?.[0]?.redirectUrl;
        if (url) window.globalLink = url;
      }
    } catch(e) {}

    resultBtn.addEventListener('click', function() {
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
