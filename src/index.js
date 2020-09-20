function component() {
  var element = document.createElement("div");
  element.innerHTML = 'fdsaf';
  return element;
}

let element = component();
document.body.appendChild(element);