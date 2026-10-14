export function isMobile() {
  const ua = navigator.userAgent;
  const isMobileUA = /Android|iPhone|iPad|iPod|IEMobile|Windows Phone|BlackBerry/i.test(ua);
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const smallScreen = screen.width <= 768;
  return isMobileUA && (hasTouch || smallScreen);
}

export function isLandscape() {
  return true;
  //以下算法有问题
  //return window.matchMedia('(orientation: landscape)').matches;
}


// 监听旋转变化
// window.matchMedia('(orientation: landscape)').addEventListener('change', (e) => {
//   if (e.matches) {
//     // 进入横屏
//   } else {
//     // 进入竖屏
//   }
// });