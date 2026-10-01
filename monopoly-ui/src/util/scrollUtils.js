/**
防抖函数：滚动停止后执行逻辑
 */
export const debounce = (fn, delay = 200) => {
  let timer = undefined;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
      clearTimeout(timer);
      timer = undefined
    }, delay);
  };
};

/**
 * 节流函数
 */
export const throttle = (func, delay) => {
  let lastTime = 0; // 记录上次执行的时间戳

  return function (...args) {
    const now = Date.now(); // 获取当前时间
    
    // 如果当前时间与上次执行时间的差值大于等于设定间隔
    if (now - lastTime >= delay) {
      lastTime = now; // 更新上次执行时间
      func.apply(this, args); // 执行原函数，保持 this 指向和参数
    }
  };
}


export const onScrollXAction = (e ,handle) => {

  const target = e.target;
  const scrollLeft = target.scrollLeft;
  //const clientWidth = target.clientWidth;
  const scrollWidth = target.scrollWidth;

  //console.log('当前滚动位置:', scrollLeft,"clientWidth:",clientWidth,"scrollWidth:",scrollWidth,"scrollLeft/scrollWidth:",(scrollLeft/scrollWidth));
  if(handle){
    handle(scrollLeft,scrollWidth)
  }

};