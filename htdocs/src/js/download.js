document.addEventListener("DOMContentLoaded", function () {

  const ua = navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/i.test(ua);

  const downloadBtn = document.querySelector(".top-flyer__btn");
  const iosMessage = document.querySelector(".top-flyer__txt");

  if (isIOS) {
    if (downloadBtn) downloadBtn.style.display = "none";
    if (iosMessage) iosMessage.style.display = "block";
  }

});