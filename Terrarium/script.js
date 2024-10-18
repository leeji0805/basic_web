console.log(document.getElementById('plant1'));
dragElement(document.getElementById('plant1'));
dragElement(document.getElementById('plant2'));
dragElement(document.getElementById('plant3'));
dragElement(document.getElementById('plant4'));
dragElement(document.getElementById('plant5'));
dragElement(document.getElementById('plant6'));
dragElement(document.getElementById('plant7'));
dragElement(document.getElementById('plant8'));
dragElement(document.getElementById('plant9'));
dragElement(document.getElementById('plant10'));
dragElement(document.getElementById('plant11'));
dragElement(document.getElementById('plant12'));
dragElement(document.getElementById('plant13'));
dragElement(document.getElementById('plant14'));

function dragElement(terrariumElement) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  let Z = 1;
  terrariumElement.onpointerdown = pointerDrag;

  function pointerDrag(event) {
    event.preventDefault();
    pos3 = event.clientX;
    pos4 = event.clientY;
    document.onpointermove = elementDrag;
    document.onpointerup = stopElementDrag;
  }

  function elementDrag(event) {
    event.preventDefault();
    pos1 = pos3 - event.clientX;
    pos2 = pos4 - event.clientY;
    pos3 = event.clientX;
    pos4 = event.clientY;
    terrariumElement.style.top = (terrariumElement.offsetTop - pos2) + "px";
    terrariumElement.style.left = (terrariumElement.offsetLeft - pos1) + "px";
  }

  function stopElementDrag() {
    document.onpointerup = null;
    document.onpointermove = null;
  }
  terrariumElement.ondblclick = bringToFront;
  function bringToFront() {
    terrariumElement.style.zIndex = Z;
    Z = Z + 1;
  }
}
