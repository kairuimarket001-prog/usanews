document.addEventListener("DOMContentLoaded", function () {
  var acceptBtn = document.getElementById("cookie-accept");
  var banner = document.getElementById("cookie-banner");

  if (!acceptBtn || !banner) return;

  acceptBtn.onclick = function () {
    banner.style.display = "none";
    document.cookie = "cookieAccepted=true; path=/; max-age=31536000";
  };

  if (document.cookie.indexOf("cookieAccepted=true") !== -1) {
    banner.style.display = "none";
  }
});
