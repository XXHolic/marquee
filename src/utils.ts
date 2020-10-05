export const wrapInElement = function (mark: string,child: HTMLElement | null,append=false):HTMLElement {
  const ele = document.createElement('div');
  ele.setAttribute('data-mark',mark);

  if (child) {
    if (append) {
      ele.appendChild(child)
    } else {
      ele.innerHTML = child.innerHTML;
    }
  }

  return ele;
}

export const getPrefix = function (): string {
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

export const prefixedEvent = function (element: HTMLElement, type: string, callback: any): void {
  var pfx = ["webkit", "moz", "MS", "o", ""];
  for (var p = 0; p < pfx.length; p++) {
      if (!pfx[p]) type = type.toLowerCase();
      element.addEventListener(pfx[p] + type, callback, false);
  }
}