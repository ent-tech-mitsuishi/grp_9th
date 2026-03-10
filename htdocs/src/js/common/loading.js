import $ from 'jquery';

let lottieInstance = null;
let isPageLoaded = false;
let isLoadingFinished = false;

const MIN_LOADING_TIME = 600;

const $window = $(window);
const $htmlBody = $('html, body');
const $loading = $('.common__loading');
const $lock = $('.common__lock');
const $wrap = $('.common__wrap');

const isSpDevice = () => {
  if (typeof DEVICE !== 'undefined' && typeof DEVICE.isSp !== 'undefined') {
    return DEVICE.isSp;
  }
  return window.matchMedia('(max-width: 768px)').matches;
};

const isLandscapeSp = () => {
  return isSpDevice() && window.matchMedia('(orientation: landscape)').matches;
};

const showLock = () => {
  $lock.removeClass('js--hide');
};

const hideLock = () => {
  $lock.addClass('js--hide');
};

const showLoading = () => {
  $loading.removeClass('js--hide');

  if (lottieInstance && typeof lottieInstance.play === 'function') {
    lottieInstance.play();
  }
};

const hideLoading = () => {
  $loading.addClass('js--hide');

  if (lottieInstance && typeof lottieInstance.stop === 'function') {
    lottieInstance.stop();
  }
};

const scrollToTop = () => {
  $htmlBody.stop().animate(
    {
      scrollTop: 0,
    },
    1
  );

  if (!isSpDevice()) {
    $wrap.stop().animate(
      {
        scrollTop: 0,
      },
      0
    );
  }
};

const finishLoading = () => {
  if (isLoadingFinished) return;

  isLoadingFinished = true;
  hideLoading();
  hideLock();
  scrollToTop();
};

const startLoadingIfReady = () => {
  if (isLoadingFinished) return;
  if (isLandscapeSp()) {
    showLock();
    hideLoading();
    return;
  }
  hideLock();
  showLoading();

  if (isPageLoaded) {
    window.setTimeout(() => {
      if (isLandscapeSp()) return;
      finishLoading();
    }, MIN_LOADING_TIME);
  }
};

// --------------------
// Lottie初期化
// --------------------
document.addEventListener('DOMContentLoaded', function () {
  const container = document.querySelector('.common__loading-item');

  if (container && window.lottie) {
    lottieInstance = window.lottie.loadAnimation({
      container: container,
      renderer: 'svg',
      loop: true,
      autoplay: false,
      path: '/circle-newsletter/assets/data/json/loading.json',
    });
  }

  // 初期表示判定
  if (isLandscapeSp()) {
    showLock();
    hideLoading();
  } else {
    hideLock();
    showLoading();

    if (lottieInstance && typeof lottieInstance.play === 'function') {
      lottieInstance.play();
    }
  }

  scrollToTop();
});

// --------------------
// ページロード完了
// --------------------
$window.on('load', function () {
  isPageLoaded = true;
  // SP横向きで来た場合はここでは閉じない
  if (isLandscapeSp()) {
    showLock();
    hideLoading();
    return;
  }
  // 縦向きで訪問した通常導線
  window.setTimeout(() => {
    if (isLandscapeSp()) return;
    finishLoading();
  }, MIN_LOADING_TIME);
});

// --------------------
// 向き変更 / リサイズ対応
// --------------------
const handleOrientation = () => {
  // すでに表示完了後でも、横向きになったら向き画面を出す
  if (isLandscapeSp()) {
    showLock();
    if (!isLoadingFinished) {
      hideLoading();
    }
    return;
  }
  // 縦向きに戻ったとき
  if (!isLoadingFinished) {
    startLoadingIfReady();
  } else {
    hideLock();
  }
};

$window.on('resize orientationchange', handleOrientation);