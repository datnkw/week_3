class Carousel {
  constructor(params) {
    this.carouselContainer = params.carouselContainer;
    this.controler = params.controler;
    this.ItemsCarousel = [...params.arrayItems];
    this.originalArrItems = [...params.arrayItems];
    this.indexOfFirstItem = 0;
    this.canDrag = true;
    this.arrVisibleItems = [];

    this.canClickControl = true;
    this.setUpEvent()
  }

  setVisibleItemsCarousel() {
    const lengthArrItems = this.ItemsCarousel.length;
    let indexItemInArrayItems = this.indexOfFirstItem;

    for (let i = 0; i < 6; i++) {
      if (indexItemInArrayItems >= lengthArrItems) {
        if (indexItemInArrayItems <= 3) {
          break;
        }
        indexItemInArrayItems = 0;
      }

      this.arrVisibleItems[i] = this.ItemsCarousel[indexItemInArrayItems];
      this.replaceClass(i);
      indexItemInArrayItems++;
    }
  }

  clearClass(i) {
    this.arrVisibleItems[i].className = this.arrVisibleItems[i].className.replace(" zero", "")
    .replace(" first", "").replace(" second", "").replace(" third", "")
    .replace(" forth", "").replace(" fifth", "")
  }

  setArrClass(len){
    if (len >= 6) {
      return [" first", " second", " third", " forth", " fifth", " zero"]
    } else if (len == 3) {
      return [" second", " third", " forth"]
    } else if (len == 2) {
      return [" third", " forth"]
    } else if (len == 1) {
      return [" third"]
    }
  }

  addClass(i) {
    const len = this.ItemsCarousel.length;
    const arrClass = this.setArrClass(len)

    this.arrVisibleItems[i].className += arrClass[i]
  }

  replaceClass(i) {
    this.clearClass(i)
    this.addClass(i);
  }

  moveBackward() {
    if (this.canDrag) {
      this.indexOfFirstItem++;

      if (this.indexOfFirstItem >= this.ItemsCarousel.length)
        this.indexOfFirstItem = 0;

      this.setVisibleItemsCarousel()
    }
  }

  moveForward() {
    if (this.canDrag) {
      this.indexOfFirstItem--;

      if (this.indexOfFirstItem < 0)
        this.indexOfFirstItem = this.ItemsCarousel.length - 1

      this.setVisibleItemsCarousel()
    }
  }

  createDivHaveClassItem() {
    let newDiv = document.createElement("div");

    newDiv.className += "item"

    return newDiv
  }

  canDragFalse() {
    const arrLength = this.ItemsCarousel.length
    const WindowWidth = window.innerWidth

    const WidthMedium = 1024
    const ArrLengthMedium = 2

    const WidthLarge = 1124
    const ArrLengthLarge = 3

    return (WindowWidth < WidthMedium && arrLength < ArrLengthMedium) ||
      (WindowWidth >= WidthMedium && arrLength <= ArrLengthMedium) ||
      (WindowWidth >= WidthLarge && arrLength <= ArrLengthLarge)
  }

  setUpItemFixed() {
    const arrLength = this.ItemsCarousel.length
    const arrClass = this.setArrClass(len)

    for (let i = 0; i < arrLength; i++) {
      this.ItemsCarousel[i].className += arrClass[i]
    }
  }

  cloneArrayItems(arrLength) {
    //double the items until the array has the length which is more than 6
    while (this.ItemsCarousel.length < 6) {
      for (let i = 0; i < arrLength; i++) {
        const child = this.createDivHaveClassItem();
        child.innerHTML = this.ItemsCarousel[i].innerHTML
        this.ItemsCarousel.push(child)
        this.carouselContainer.appendChild(child)
      }
    }
  }

  setUpDraggable() {
    let arrLength = this.ItemsCarousel.length

    if (this.canDragFalse()) {
      this.canDrag = false;
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
    this.ItemsCarousel = [...this.originalArrItems]

    for (let k = 0; k < this.ItemsCarousel.length; k++) {
      this.carouselContainer.appendChild(this.ItemsCarousel[k])
    }
    if (this.canDragFalse()) {
      //Not draggable
      //->set positon each card, hide controler
      this.canDrag = false
      this.controler.style.display = "none"
      this.setVisibleItemsCarousel()
    } else {
      this.canDrag = true
      // this.controler.style.display = "initial"
      //draggable
      const arrLength = this.ItemsCarousel.length
      if (arrLength < 6) {
        this.cloneArrayItems(arrLength)
      }

      this.setVisibleItemsCarousel()
    }
  }

  preventClickingTooMuch(){
    setTimeout(() => {
      this.canClickControl = true
    }, 500)
  }

  setUpControler(){
    if (!this.canDrag) {
      this.controler.style.display = "none"
    } else {
      this.controler.addEventListener('click', () => {
        if (this.canClickControl && this.canDrag) {
          this.moveForward()
          this.canClickControl = false

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
      console.log("canDrag: ", this.canDrag)
      if (this.canClickControl && this.canDrag) {
        if (touchendX <= touchstartX) {
          this.moveBackward()
        } else if (touchendX > touchstartX) {
          this.moveForward()
        }
        this.canClickControl = false

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