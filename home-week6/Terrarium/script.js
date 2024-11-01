window.onload = function () {
  console.log(document.getElementById('plant1'));
  ['plant1',
    'plant2',
    'plant3',
    'plant4',
    'plant5',
    'plant6',
    'plant7',
    'plant8',
    'plant9',
    'plant10',
    'plant11',
    'plant12',
    'plant13',
    'plant14'].forEach(id => {
      dragElement(document.getElementById(id));
    });

  function dragElement(terrariumElement) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    let Z = 1;
    const initialPosition = {
      top: terrariumElement.offsetTop,
      left: terrariumElement.offsetLeft
    };

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

    terrariumElement.oncontextmenu = function (event) {
      event.preventDefault();
      if (confirm('이 요소를 삭제하시겠습니까?')) {
        stopElementDrag();
        terrariumElement.style.display = 'none';
        setTimeout(() => {
          terrariumElement.style.top = initialPosition.top + 'px';
          terrariumElement.style.left = initialPosition.left + 'px';
          terrariumElement.style.zIndex = Z++;
          terrariumElement.style.display = 'block';
        }, 1000);
      }
    };
  }
};