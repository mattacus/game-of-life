const mousePosition = function(event, zoom) {
  // http://www.malleus.de/FAQ/getImgMousePos.html
  // http://www.quirksmode.org/js/events_properties.html#position
  let x, y, domObject, posx = 0, posy = 0, top = 0, left = 0, cellSize = zoom.schemes[zoom.current].cellSize + 1;

  if (!event) {
    event = window.event;
  }

  if (event.pageX || event.pageY) {
    posx = event.pageX;
    posy = event.pageY;
  } else if (event.clientX || event.clientY) {
    posx = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    posy = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }

  domObject = event.target || event.srcElement;

  while (domObject.offsetParent) {
    left += domObject.offsetLeft;
    top += domObject.offsetTop;
    domObject = domObject.offsetParent;
  }

  domObject.pageTop = top;
  domObject.pageLeft = left;

  x = Math.ceil(((posx - domObject.pageLeft) / cellSize) - 1);
  y = Math.ceil(((posy - domObject.pageTop) / cellSize) - 1);

  return [x, y];
};

export default mousePosition;