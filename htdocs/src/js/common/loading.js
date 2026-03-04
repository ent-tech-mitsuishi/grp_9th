import $ from 'jquery';

// Lottie初期化
document.addEventListener('DOMContentLoaded', function () {
  const container = document.querySelector('.common__loading-item');
  if (container && window.lottie) {
    window.lottie.loadAnimation({
      container: container,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '../assets/data/json/loading.json',
    });
  }
});

$('body, html').stop().animate(
  {
    scrollTop: 0,
  },
  1
);

$(window).on('load', function () {
  $('.common__loading').addClass('js--hide');
  if (!DEVICE.isSp) {
    $('.common__wrap').stop().animate(
      {
        scrollTop: 0,
      },
      0
    );
  }
});
