class position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  setPosition(p) {
    this.x = p.pageX
    this.y = p.pageY
  }
}

class RepositionBanner {
  constructor(params) {
    this.Banner = params.Banner;
    this.Trigger = params.Trigger;
    this.SaveBtn = params.SaveBtn;
    this.CancelBtn = params.CancelBtn;
    this.Background = params.Background;
    this.slider = params.slider;
    this.sliderPointer = params.sliderPointer;
    this.isDraggable = false;
    this.position = {
      x: 0,
      y: 0
    };
    this.BottomValueSlider = 0;
    this.setUpEvent()
  }

  setDraggable() {

    this.isDraggable = !this.isDraggable

    if (this.isDraggable) {
      this.Banner.style.cursor = "move"

    } else {
      this.Banner.style.cursor = "default"
    }

    this.setVisible()

    console.log("isDraggable: ", this.isDraggable)
  }

  setVisible() {
    console.log("begin set visible")

    if (this.SaveBtn.style.display == "none") {
      this.SaveBtn.style.display = "initial"
      this.CancelBtn.style.display = "initial"
      this.slider.style.display = "initial"
    } else {
      this.SaveBtn.style.display = "none"
      this.CancelBtn.style.display = "none"
      this.slider.style.display = "none"
    }
  }

  drag() {
    if (this.isDraggable) {

    }
  }

  getValue() {
    let ret = {
      x: 0,
      y: 0
    }

    //get value css in css file
    let tmpX = window.getComputedStyle(this.Background, null).left;
    ret.x = tmpX.substr(0, tmpX.indexOf('p'));
    let tmpY = window.getComputedStyle(this.Background, null).top;
    ret.y = tmpY.substr(0, tmpY.indexOf('p'));

    console.log("ret: ", JSON.stringify(ret))

    return ret;
  }

  setPosition() {
    this.Background.style.left = this.position.x + "px";
    this.Background.style.top = this.position.y + "px";
  }



  setUpEvent() {
    let beginX = 0;
    let beginY = 0;
    let dragX = 0;
    let dragY = 0;

    let BeginPositionSlider = new position(0, 0)
    let MovePosition = new position(0, 0)

    let scale = localStorage.getItem("scale") || 0;
    let bottomValue = localStorage.getItem("bottomValue") || 0;

    //get bottom coordinate of bottom of slider
    let bottomSlider = this.slider.getBoundingClientRect().bottom + window.pageYOffset;

    window.addEventListener('resize', () => {
      bottomSlider = this.slider.getBoundingClientRect().bottom + window.pageYOffset;
      console.log("window width: ", window.innerWidth)
      console.log("bottomSlider: ", bottomSlider)
    })

    console.log("local firstwidth: ", localStorage.getItem("firstWidth"))

    let firstWidth = localStorage.getItem("firstWidth") || parseInt(window.getComputedStyle(this.Background, null).width)
    let firstHeight = localStorage.getItem("firstHeight") || parseInt(window.getComputedStyle(this.Background, null).height)
    //trigger drag slider pointer
    let isSliderClick = false;

    console.log("Storage position: ", localStorage.getItem("positionX"))

    this.position.x = localStorage.getItem("positionX")
    this.position.y = localStorage.getItem("positionY")

    this.setPosition()
    this.Background.style.width = firstWidth * scale + "px";
    this.Background.style.height = firstHeight * scale + "px";

    console.log("bottom value: ", localStorage.getItem("bottomValue"))
    this.sliderPointer.style.bottom = localStorage.getItem("bottomValue") + "px"

    console.log("firstWidth: ", firstWidth)
    console.log("scale: ", scale)

    let isMouseDown = false;

    console.log("begin setup")
    this.setVisible();
    this.Trigger.addEventListener("click", () => {
      this.setDraggable()
    }, false);

    this.Banner.addEventListener("pointerdown", (event) => {
      if (this.isDraggable) {
        // console.log(event.pageX)
        // console.log(event.pageY)
        isMouseDown = true
        console.log("isMouseDown when click: ", isMouseDown)
        beginX = event.pageX;
        beginY = event.pageY;
      }
    })

    this.Banner.addEventListener("pointerup", (event) => {
      if (isSliderClick) {
        console.log("mouse up")
        isSliderClick = false;

      }
      if (this.isDraggable) {
        isMouseDown = false;
      }

      this.Banner.style.cursor = "move"

    })

    let body = document.querySelector("body")

    body.addEventListener("pointermove", event => {
      if (this.isDraggable && isMouseDown) {
        dragX = event.pageX;
        dragY = event.pageY;

        let distanceX = dragX - beginX;
        let distanceY = dragY - beginY;

        console.log("distanceX: ", distanceX)
        console.log("distanceY: ", distanceY)

        this.position = this.getValue()

        this.position.x = parseInt(this.position.x) + distanceX
        this.position.y = parseInt(this.position.y) + distanceY

        this.setPosition()

        beginX = dragX;
        beginY = dragY;
      }
    })

    this.Banner.addEventListener("pointermove", function (event) {
      console.log("isSliderClick: ", isSliderClick)
      if (isSliderClick) {
        this.Banner.style.cursor = "pointer"

        MovePosition.setPosition(event)

        //bottom of slider button

        bottomValue = -1 * (MovePosition.y - bottomSlider)
        console.log("MovePosition y: ", MovePosition.y)
        console.log("bottomSlider: ", bottomSlider)
        console.log("bottomvalue: ", bottomValue)


        if (bottomValue > 180)
          bottomValue = 180
        else if (bottomValue < 0)
          bottomValue = 0

        this.sliderPointer.style.bottom = bottomValue + "px"

        scale = bottomValue / 100 + 1;
        console.log("scale: ", scale)

        // console.log("width scale: ", firstWidth*scale)
        // console.log("height scale: ", firstHeight*scale)

        this.Background.style.width = (firstWidth * scale) + "px";
        this.Background.style.height = (firstHeight * scale) + "px";

        console.log("bottomValue: ", bottomValue)

        event.stopPropagation();
      }
    }.bind(this), true)

    this.SaveBtn.addEventListener("click", () => {
      console.log(this.isDraggable)
      localStorage.setItem("positionX", this.position.x);
      localStorage.setItem("positionY", this.position.y);
      localStorage.setItem("scale", scale);
      localStorage.setItem("firstWidth", firstWidth)
      localStorage.setItem("firstHeight", firstHeight)
      localStorage.setItem("bottomValue", bottomValue)

      console.log("save postion x: ", this.position.x)

      this.setDraggable();
    })

    this.CancelBtn.addEventListener("click", () => {
      this.setDraggable();
    })

    this.sliderPointer.addEventListener("pointerdown", (event) => {
      console.log("click slider");
      BeginPositionSlider.setPosition(event);
      isSliderClick = true;

      const rect = this.slider.getBoundingClientRect();
      console.log("bottom: ", rect.bottom + window.pageYOffset);

      event.stopPropagation();
    })

    // this.Banner.addEventListener("touchstart", (event) => {
    //     if (this.isDraggable) {
    //         isMouseDown = true
    //         console.log("isMouseDown when click: ", isMouseDown)
    //         beginX = event.pageX;
    //         beginY = event.pageY;
    //     }
    // })

    // this.Banner.addEventListener("touchend", (event) => {
    //     if (isSliderClick) {
    //         console.log("touched up")
    //         isSliderClick = false;

    //     }
    //     if (this.isDraggable) {
    //         isMouseDown = false;
    //     }

    //     this.Banner.style.cursor = "move"

    // })

    // this.Banner.addEventListener("pointermove", function (event) {
    //     if (isSliderClick) {
    //         this.Banner.style.cursor = "pointer"

    //         MovePosition.x = event.changedTouches[0].screenX;
    //         MovePosition.y = event.changedTouches[0].screenY;

    //         //bottom of slider button
    //         bottomValue = -1 * (MovePosition.y - bottomSlider)

    //         if (bottomValue > 180)
    //             bottomValue = 180
    //         else if (bottomValue < 0)
    //             bottomValue = 0

    //         this.sliderPointer.style.bottom = bottomValue + "px"

    //         scale = bottomValue / 100 + 1;
    //         console.log("scale: ", scale)

    //         console.log("width scale: ", firstWidth*scale)
    //         console.log("height scale: ", firstHeight*scale)

    //         this.Background.style.width = (firstWidth*scale) + "px";
    //         this.Background.style.height = (firstHeight*scale) + "px";

    //         console.log("bottomValue: ", bottomValue)


    //     }

    // }.bind(this), true)


  }
}