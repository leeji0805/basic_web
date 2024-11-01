window.onload = function () {
  ['plant1', 'plant2', 'plant3', 'plant4', 'plant5', 'plant6', 'plant7', 'plant8', 'plant9', 'plant10', 'plant11', 'plant12', 'plant13', 'plant14'].forEach(id => {
    setupDragAndDrop(document.getElementById(id));
  });

  function setupDragAndDrop(terrariumElement) {
    let Z = 1;
    const initialPosition = {
      top: terrariumElement.offsetTop,
      left: terrariumElement.offsetLeft
    };

    terrariumElement.draggable = true;

    terrariumElement.addEventListener('dragstart', dragStart);
    terrariumElement.addEventListener('drag', drag);
    terrariumElement.addEventListener('dragend', dragEnd);

    function dragStart(e) {
      e.dataTransfer.setData('text/plain', e.target.id);
      e.dataTransfer.effectAllowed = 'move';
    }

    function drag(e) {
      e.preventDefault();
    }

    function dragEnd(e) {
      const x = e.clientX;
      const y = e.clientY;
      terrariumElement.style.position = 'absolute';
      terrariumElement.style.left = x + 'px';
      terrariumElement.style.top = y + 'px';
    }

    terrariumElement.ondblclick = bringToFront;
    function bringToFront() {
      terrariumElement.style.zIndex = Z;
      Z = Z + 1;
    }

    terrariumElement.oncontextmenu = function (event) {
      event.preventDefault();
      if (confirm('이 요소를 삭제하시겠습니까?')) {
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

  // Set up drop zone (the entire document in this case)
  document.addEventListener('dragover', function(e) {
    e.preventDefault(); // Necessary to allow dropping
  });

  document.addEventListener('drop', function(e) {
    e.preventDefault();
    const id = e.dataTransfer.getData('text');
    const draggableElement = document.getElementById(id);
    draggableElement.style.left = e.clientX + 'px';
    draggableElement.style.top = e.clientY + 'px';
  });
};