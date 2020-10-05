import { v4 as uuidv4 } from 'uuid';
import { wrapInElement,getPrefix,prefixedEvent } from './utils';

class Marquee {
  options: any = {
    duration: 5000,
    gap: 20,
    timing: 'linear',
    delayBeforeStart: 0,
    className:'',
    duplicated: false, // 首尾衔接无空隙循环
    startVisible: false
  };

  // 滚动元素初始宽度
  targetWidth: number = 0;
  parentWidth: number = 0;
  uuid: string = '';
  itemGap: number = 0;
  wrapEle: any;

  constructor(params: object) {
    this.options = {...this.options,...params};
    this.uuid = uuidv4();
    this.init();
    this.setAnimation();
  }

  init() {
    const { ele,className,gap,duration,timing,delayBeforeStart,duplicated } = this.options;
    const uuid = this.uuid;

    const itemGap = duplicated ? parseInt(gap,10):0;
    // 可能存在多个滚动的情况，所以要生成对应唯一的标识
    const target: HTMLElement | null = document.querySelector('.example');

    // 创建包裹滚动元素的父元素
    const parentMark = `marquee-${uuid}`;
    const parentEle = wrapInElement(parentMark, target);
    const parentStyle = `float: left;margin-right: ${itemGap}px;`
    parentEle.setAttribute('style',parentStyle);

    const wrapMark = `marquee-wrap-${uuid}`;
    const wrapEle = wrapInElement(wrapMark,parentEle,true);
    wrapEle.setAttribute('class',className);

    if (duplicated) {
      wrapEle.appendChild(parentEle.cloneNode(true))
    }

    let targetOffsetWidth = ''
    let parentOffsetWidth = ''
    if (target) {
      targetOffsetWidth = String(target.offsetWidth)
      target.innerHTML = '';
      target.appendChild(wrapEle);
      parentOffsetWidth = String(parentEle.offsetWidth)
    }
    console.log('parentOffsetWidth',parentOffsetWidth)
    this.targetWidth= parseInt(targetOffsetWidth,10);
    this.parentWidth = parseInt(parentOffsetWidth,10);
    this.itemGap = itemGap;
    this.wrapEle = wrapEle;
  }

  setAnimation(isEnd=false) {
    const { ele,className,gap,duration,timing,delayBeforeStart,duplicated } = this.options;
    const {targetWidth,parentWidth,uuid,itemGap,wrapEle} = this;
    let animationTime = ((targetWidth + parentWidth)/targetWidth)*duration;
    if (duplicated) {
      animationTime = animationTime/2;
    }

    let animationDelayTime = parseInt(String(delayBeforeStart/1000),10);
    let animationName = `animation-${uuid}`;

    let originDuration = animationTime;
    let animationCount: string | number = 'infinite';
    console.log('run~')
    // let styleStr = 'overflow:hidden;width: 100000px;display:flex;justify-content:flex-start;'
    let styleStr = 'overflow:hidden;width: 100000px;'
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
    const animationDuration = parseInt(String(animationTime/1000),10);
    // 使用 fill-mode 来控制第一次顺序后的状态，切换会更加可控无感知
    const animationStr = `${prefix}animation: ${animationName} ${animationDuration}s ${animationDelayTime}s ${timing} ${animationCount} forwards;`;
    styleStr = `${styleStr}${animationStr}`;

    let wrapTranslateNum = targetWidth;
    if (isEnd) {
      wrapTranslateNum = 0;
    }
    const wrapTranslate = `transform: translateX(${wrapTranslateNum}px);`
    styleStr = `${styleStr}${wrapTranslate}`;
    console.log('styleStr',styleStr)
    wrapEle.style = styleStr;

    const that = this;
    // prefixedEvent(wrapEle, "AnimationEnd", function() {
    //   that.setAnimation(true);
    // });

  }

}

export default Marquee