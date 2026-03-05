// グローバル変数としても利用可能にする
const DEVICE = {
  isSp: false,
  isIos: false,
  isAndroid: false,
  isTablet: false,
  isPc: false,
  isSafariPc: false,
  isFirefox: false,
  isChrome: false,
};

// グローバル変数としても利用可能にする
window.DEVICE = DEVICE;

const ua = navigator.userAgent.toLowerCase();
const body = document.body;

/**
 * bodyにクラスを追加するヘルパー関数
 * @param {...string} classNames - 追加するクラス名
 */
const addBodyClass = (...classNames) => {
  body.classList.add(...classNames);
};

if (ua.includes('ipod') || ua.includes('iphone')) {
  DEVICE.isSp = true;
  DEVICE.isIos = true;
  addBodyClass('isSp', 'isIos');
} else if (ua.includes('android') && ua.includes('mobile')) {
  DEVICE.isSp = true;
  DEVICE.isAndroid = true;
  addBodyClass('isSp', 'isAndroid');
} else if (
  ua.includes('ipad') ||
  (ua.includes('macintosh') && 'ontouchend' in document)
) {
  DEVICE.isIos = true;
  DEVICE.isTablet = true;
  addBodyClass('isTablet', 'isIos');
} else if (ua.includes('android')) {
  DEVICE.isTablet = true;
  DEVICE.isAndroid = true;
  addBodyClass('isTablet', 'isAndroid');
} else {
  DEVICE.isPc = true;
  addBodyClass('isPc');

  if (ua.includes('safari') && !ua.includes('chrome')) {
    DEVICE.isSafariPc = true;
    addBodyClass('isSafariPc');
  } else if (ua.includes('firefox')) {
    DEVICE.isFirefox = true;
    addBodyClass('isFirefox');
  } else if (ua.includes('chrome')) {
    DEVICE.isChrome = true;
    addBodyClass('isChrome');
  }
}
