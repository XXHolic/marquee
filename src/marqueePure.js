import { v4 as uuidv4 } from 'uuid';

const defaultOptions = {
  duration: 5000,
  gap: 20,
  timing: 'linear',
  delayBeforeStart: 0,
  className:'',
  duplicated: false, // 收尾衔接无空隙循环
  startVisible: false
}

const wrapInElement = (parent,child,append=false) => {
  const ele = document.createElement('div');
  ele.setAttribute('data-mark',parent);
  if (append) {
    ele.appendChild(child)
  } else {
    ele.innerHTML = child.innerHTML;
  }
  return ele;
}

const getPrefix = () => {
  const testEle = document.body;
  const prefixList = 'Webkit Moz O ms'.split(' ');
  let prefix = '';
  if (testEle.style.animationName!== undefined) {
    return prefix;
  }
  for (const ele of prefixList) {
    if (testEle.style[`${ele}AnimationName`] !== undefined) {
      prefix = `-${ele.toLocaleLowerCase()}-`;
      break;
    }
  }

  return prefix;
}

const prefixedEvent = function(element, type, callback) {
  var pfx = ["webkit", "moz", "MS", "o", ""];
  for (var p = 0; p < pfx.length; p++) {
      if (!pfx[p]) type = type.toLowerCase();
      element.addEventListener(pfx[p] + type, callback, false);
  }
}

const marquee = (params={}) => {
  const options = {...defaultOptions,...params};
  const { className,gap,duration,timing,delayBeforeStart,duplicated } = options;

  const itemGap = duplicated ? parseInt(gap,10):0;
  const randomId = uuidv4();
  const target = document.querySelector('.example');
  const targetWidth = parseInt(target.offsetWidth,10);

  const parentId = `marquee-${randomId}`;
  const parentEle = wrapInElement(parentId,target);
  // const parentStyle = `margin-right:${itemGap}px;float:left;-webkit-backface-visibility: hidden;backface-visibility: hidden;`
  const parentStyle = `margin-right:${itemGap}px;`
  parentEle.setAttribute('style',parentStyle);



  const wrapId = `marquee-wrap-${randomId}`;
  const wrapEle = wrapInElement(wrapId,parentEle,true);
  wrapEle.setAttribute('class',className);

  if (duplicated) {
    wrapEle.appendChild(parentEle.cloneNode(true))
  }

  target.innerHTML = '';
  target.appendChild(wrapEle);


  // const parentWidth = parseInt(parentEle.offsetWidth,10);
  const parentWidth = parseInt(412,10);
  console.log('parentWidth',parentWidth)
  let animationTime = ((targetWidth + parentWidth)/targetWidth)*duration;
  if (duplicated) {
    animationTime = animationTime/2;
  }
  let animationDelayTime = parseInt(delayBeforeStart/1000,10);
  let animationName = `animation-${randomId}`;

  // const animationName = `animation1`;
  if (target.style.animation!== undefined) {
    let originDuration = animationTime;
    let animationCount = 'infinite';
    const setAnima = (isEnd) => {
      console.log('run~')
      let styleStr = 'overflow:hidden;width: 100000px;display:flex;justify-content:flex-start;'
      const prefix = getPrefix();
      const moveDistance = parentWidth + itemGap;
      if (!isEnd) {
        let keyframeStr = `@${prefix}keyframes ${animationName} { 100% {transform: translateX(-${moveDistance}px)} }`;
        const styleEle = document.createElement('style');
        styleEle.innerHTML = keyframeStr;
        document.head.appendChild(styleEle);
      }

      if (duplicated) {
        // debugger
        animationTime = animationTime + (targetWidth / (parentWidth/animationTime));
        animationCount = 1;
      }
      if (isEnd) {
        animationTime = originDuration;
        animationCount = 'infinite';
      }
      const animationDuration = parseInt(animationTime/1000,10);
      // 使用 fill-mode 来控制第一次顺序后的状态，切换会更加可控无感知
      const animationStr = `${prefix}animation: ${animationName} ${animationDuration}s ${animationDelayTime}s ${timing} ${animationCount} forwards;`;
      styleStr = `${styleStr}${animationStr}`;

      let wrapTranslateNum = targetWidth;
      if (isEnd) {
        wrapTranslateNum = 0;
      }
      const wrapTranslate = `transform: translateX(${wrapTranslateNum}px);`
      styleStr = `${styleStr}${wrapTranslate}`;
      wrapEle.style = styleStr;

      prefixedEvent(wrapEle, "AnimationEnd", function() {
        setAnima(true);
      });


    }

    setAnima();

    // if (!duplicated) {
    // } else {

    // }


  }


}


export default marquee