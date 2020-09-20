import { v4 as uuidv4 } from 'uuid';

const defaultOptions = {
  duration: 5000,
  gap: 20,
  timing: 'linear',
  delayBeforeStart: 0,
  className:'',
  duplicated: false,
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

const marquee = (params={}) => {
  const options = {...params,...defaultOptions};
  const { className,gap,duration,timing,delayBeforeStart,duplicated } = options;
  const randomId = uuidv4();
  const target = document.querySelector('.example');
  const targetWidth = parseInt(target.offsetWidth,10);

  const parentId = `marquee-${randomId}`;
  const parentEle = wrapInElement(parentId,target);
  const parentStyle = `margin-right:${gap}px;float:left;`
  parentEle.setAttribute('style',parentStyle);



  const wrapId = `marquee-wrap-${randomId}`;
  const wrapEle = wrapInElement(wrapId,parentEle,true);
  wrapEle.setAttribute('class',className);
  if (duplicated) {
    wrapEle.appendChild(parentEle.cloneNode())
  }
  let styleStr = 'overflow:hidden;width: 100000px;'
  target.innerHTML = '';
  target.appendChild(wrapEle);

  const parentWidth = parseInt(parentEle.offsetWidth,10);
  const animationTime = parseInt(((targetWidth + parentWidth)/targetWidth)*duration/1000,10);
  const animationDelayTime = parseInt(delayBeforeStart/1000,10);
  // const animationName = `animation-${randomId}`;
  const animationName = `animation1`;
  if (target.style.animation!== undefined) {
    const prefix = getPrefix();
    const moveDistance = parentWidth + gap;
    let keyframeStr = `@${prefix}keyframes ${animationName} { 100% {transform: translateX(-${moveDistance}px)} }`;
    const styleEle = document.createElement('style');
    styleEle.innerHTML = keyframeStr;
    document.head.appendChild(styleEle);

    const animationStr = `${prefix}animation: ${animationName} ${animationTime}s ${animationDelayTime}s ${timing} infinite;`;
    styleStr = `${styleStr}${animationStr}`;
    if (!duplicated) {
      const wrapTranslate = `transform: translateX(${targetWidth}px)`
      styleStr = `${styleStr}${wrapTranslate}`;
    } else {

    }
    wrapEle.style = styleStr;


  }


}


export default marquee