class Carousel {
  constructor(params) {
    this.carouselContainer = params.carouselContainer;
    this.controler = params.controler;
    this.arrayItems = [...params.arrayItems];
    this.primaryArrItems = [...params.arrayItems];
    this.indexOfFirstItem = 0;
    this.isDraggable = true;
    this.arrVisibleItems = [null, null, null, null, null, null];

    this.isControlClickable = true;
    this.setUpEvent()
  }

  setVisibleItemsCarousel() {
    const lengthArrItems = this.arrayItems.length;
    let indexItemInArrayItems = this.indexOfFirstItem;

    for (let i = 0; i < 6; i++) {
      if (indexItemInArrayItems >= lengthArrItems) {
        if (indexItemInArrayItems <= 3) {
          break;
        }
        indexItemInArrayItems = 0;
      }

      this.arrVisibleItems[i] = this.arrayItems[indexItemInArrayItems]
      this.replaceClass(i)
      indexItemInArrayItems++;
    }
  }

  clearClass(i) {
    this.arrVisibleItems[i].className = this.arrVisibleItems[i].className.replace(" zero", "").replace(" first", "").replace(" second", "").replace(" third", "").replace(" forth", "").replace(" fifth", "")
  }

  addClass(i) {
    let len = this.arrayItems.length;
    let arrClass = [];

    if (len >= 6) {
      arrClass = [" first", " second", " third", " forth", " fifth", " zero"]
    } else if (len == 3) {
      arrClass = [" second", " third", " forth"]
    } else if (len == 2) {
      arrClass = [" third", " forth"]
    } else if (len == 1) {
      arrClass = [" third"]
    }

    this.arrVisibleItems[i].className += arrClass[i]
  }

  replaceClass(i) {
    this.clearClass(i)
    this.addClass(i);
  }

  moveBackward() {
    if (this.isDraggable) {
      this.indexOfFirstItem++;

      if (this.indexOfFirstItem >= this.arrayItems.length)
        this.indexOfFirstItem = 0;

      this.setVisibleItemsCarousel()
    }
  }

  moveForward() {
    if (this.isDraggable) {
      this.indexOfFirstItem--;

      if (this.indexOfFirstItem < 0)
        this.indexOfFirstItem = this.arrayItems.length - 1

      this.setVisibleItemsCarousel()
    }
  }


  createDivHaveClassItem() {
    let newDiv = document.createElement("div");

    newDiv.className += "item"

    return newDiv
  }

  isDraggableFalse() {
    let arrLength = this.arrayItems.length
    let WindowWidth = window.innerWidth

    const WidthMedium = 1024
    const ArrLengthMedium = 2

    const WidthLarge = 1124
    const ArrLengthLarge = 3

    return (WindowWidth < WidthMedium && arrLength < ArrLengthMedium) ||
      (WindowWidth >= WidthMedium && arrLength <= ArrLengthMedium) ||
      (WindowWidth >= WidthLarge && arrLength <= ArrLengthLarge)
  }

  setUpItemFixed() {
    let arrLength = this.arrayItems.length
    let arrClass = []
    if (arrLength == 3) {
      arrClass = [" second", " third", " forth"]
      // this.arrayItems[0].className += " second"
      // this.arrayItems[1].className += " third"
      // this.arrayItems[2].className += " forth"
    } else if (arrLength == 2) {
      arrClass = [" third", " forth"]
      // this.arrayItems[0].className += " third"
      // this.arrayItems[1].className += " forth"
    } else if (arrLength == 1) {
      arrClass = [" third"]
      // this.arrayItems[0].className += " third"
    }

    for (let i = 0; i < arrLength; i++) {
      this.arrayItems[i].className += arrClass[i]
    }
  }

  cloneArrayItems(arrLength) {
    //double the items until the array has the length which is more than 6
    while (this.arrayItems.length < 6) {
      for (let i = 0; i < arrLength; i++) {
        let child = this.createDivHaveClassItem();
        child.innerHTML = this.arrayItems[i].innerHTML
        this.arrayItems.push(child)
        this.carouselContainer.appendChild(child)
      }
    }
  }

  setUpDraggable() {
    let arrLength = this.arrayItems.length

    if (this.isDraggableFalse()) {
      this.isDraggable = false;
      this.setUpItemFixed()
    } else {
      if (arrLength < 6) {
        this.cloneArrayItems(arrLength)
      }
    }
  }

  rerenderCarousel() {
    this.indexOfFirstItem = 0;
    this.carouselContainer.innerHTML = "";
    console.log("carousel clear: " + this.carouselContainer.innerHTML)
    this.arrayItems = [...this.primaryArrItems]

    for (let k = 0; k < this.arrayItems.length; k++) {
      this.carouselContainer.appendChild(this.arrayItems[k])
    }
    if (this.isDraggableFalse()) {
      //Not draggable
      //->set positon each card, hide controler
      this.isDraggable = false
      this.controler.style.display = "none"
      this.setVisibleItemsCarousel()
    } else {
      this.isDraggable = true
      // this.controler.style.display = "initial"
      //draggable
      let arrLength = this.arrayItems.length
      if (arrLength < 6) {
        this.cloneArrayItems(arrLength)
      }

      this.setVisibleItemsCarousel()
    }
  }

  preventClickingTooMuch(){
    setTimeout(() => {
      this.isControlClickable = true
    }, 500)
  }

  setUpControler(){
    if (!this.isDraggable) {
      this.controler.style.display = "none"
    } else {
      this.controler.addEventListener('click', () => {
        if (this.isControlClickable && this.isDraggable) {
          this.moveForward()
          this.isControlClickable = false

          this.preventClickingTooMuch()
        }
      }, false);
    }
  }

  handleBeginDragging(event, pairCoordinates){
    pairCoordinates.touchstartX = event.pageX;
    this.carouselContainer.style.cursor = "grabbing"
  }

  handleFinishDragging(event, pairCoordinates){
    let touchendX = pairCoordinates.touchendX
    let touchstartX = pairCoordinates.touchstartX

    touchendX = event.pageX;
      console.log("isDraggable: ", this.isDraggable)
      if (this.isControlClickable && this.isDraggable) {
        if (touchendX <= touchstartX) {
          this.moveBackward()
        } else if (touchendX > touchstartX) {
          this.moveForward()
        }
        this.isControlClickable = false

        this.preventClickingTooMuch()
      }

      this.carouselContainer.style.cursor = "grab"
  }

  setUpDragginhCaurolsel(){
    let pairCoordinates = {
      touchstartX: 0,
      touchendX: 0
    }

    // let touchstartX = 0;
    // let touchendX = 0;

    this.carouselContainer.addEventListener('pointerdown', function (event) {
      this.handleBeginDragging(event, pairCoordinates)
    }.bind(this), false);

    this.carouselContainer.addEventListener('pointerup', function (event) {
      this.handleFinishDragging(event, pairCoordinates)
    }.bind(this), false);
  }

  setUpDraggingCarouselOnIOS(){
    let pairCoordinates = {
      touchstartX: 0,
      touchendX: 0
    }

    this.carouselContainer.addEventListener('touchstart', function (event) {
      this.handleBeginDragging(event, pairCoordinates)
    }.bind(this), false);
    this.carouselContainer.addEventListener('touchend', function (event) {
      this.handleFinishDragging(event, pairCoordinates)
    }.bind(this), false);
  }

  setUpEvent() {
    //check idDraggable
    this.rerenderCarousel()

    window.addEventListener('resize', () => {
      this.rerenderCarousel()
    })

    this.setUpControler()

    this.setUpDragginhCaurolsel()

    this.setUpDraggingCarouselOnIOS()
  }
}