class Carousel {
    constructor(params) {
        this.carouselContainer = params.carouselContainer;
        this.controler = params.controler;
        this.arrayItems = [...params.arrayItems];
        this.firstArrItems = [...params.arrayItems];
        this.index = 0;
        this.isDraggable = true;
        this.arr = [null, null, null, null, null, null];

        this.isClickable = true;
        this.setUpEvent()
    }

    setCarousel() {
        const lengthArrItems = this.arrayItems.length;
        let cur = this.index;

        let i
        for (i = 0; i < 6; i++) {
            if (cur >= lengthArrItems) {
                if (cur <= 3)
                    break;
                cur = 0;
            }

            this.arr[i] = this.arrayItems[cur]
            this.addClass(i)
            cur++;
        }

        //   }
    }

    addClass(i) {
        this.arr[i].className = this.arr[i].className.replace(" zero", "").replace(" first", "").replace(" second", "").replace(" third", "").replace(" forth", "").replace(" fifth", "")

        let len = this.arrayItems.length
        if (len >= 6) {
            const tmp = (i + 1) > 5 ? 0 : (i + 1)

            if (tmp == 0)
                this.arr[i].className += " zero"
            else if (tmp == 1)
                this.arr[i].className += " first"
            else if (tmp == 2)
                this.arr[i].className += " second"
            else if (tmp == 3)
                this.arr[i].className += " third"
            else if (tmp == 4)
                this.arr[i].className += " forth"
            else if (tmp == 5)
                this.arr[i].className += " fifth"
        } else if (len == 3) {
            console.log("len 3")
            const tmp = i
            if (tmp == 0)
                this.arr[i].className += " second"
            else if (tmp == 1)
                this.arr[i].className += " third"
            else if (tmp == 2)
                this.arr[i].className += " forth"
        } else if (len == 2) {
            const tmp = i
            if (tmp == 0)
                this.arr[i].className += " third"
            else if (tmp == 1)
                this.arr[i].className += " forth"
        } else if (len == 1) {
            const tmp = i
            if (tmp == 0)
                this.arr[i].className += " third"
        }

        //console.log("class name after replace: ", this.arr[i].className)
    }

    moveBackward() {
        if (this.isDraggable) {
            this.index++;
            if (this.index >= this.arrayItems.length)
                this.index = 0;

            this.setCarousel()
        }
    }

    moveForward() {
        if (this.isDraggable) {
            this.index--;
            if (this.index < 0)
                this.index = this.arrayItems.length - 1

            this.setCarousel()
        }
    }

    createDivItem() {
        let newDiv = document.createElement("div");

        newDiv.className += "item"

        return newDiv
    }

    addEvent = function (object, type, callback) {
        //console.log("callback: ", callback)
        if (object == null || typeof (object) == 'undefined') return;
        if (object.addEventListener) {
            object.addEventListener(type, callback, false);
        } else if (object.attachEvent) {
            object.attachEvent("on" + type, callback);
        } else {
            object["on" + type] = callback;
        }
    };

    isDraggableFalse() {
        let arrLength = this.arrayItems.length
        console.log("innerWidth: ", window.innerWidth)
        console.log("arrLength: ", arrLength)
        return (window.innerWidth < 1024 && arrLength < 2) || (window.innerWidth >= 1024 && arrLength <= 2) || (window.innerWidth >= 1124 && arrLength <= 3)
    }

    setUpItemFixed() {
        let arrLength = this.arrayItems.length
        if (arrLength == 3) {
            this.arrayItems[0].className += " second"
            this.arrayItems[1].className += " third"
            this.arrayItems[2].className += " forth"
        } else if (arrLength == 2) {
            this.arrayItems[0].className += " third"
            this.arrayItems[1].className += " forth"
        } else if (arrLength == 1) {
            this.arrayItems[0].className += " third"
        }
    }

    fillItemsToItemWrapper() {
        this.carouselContainer.innerHTML = ""
        //let tmpArr = 
        for (let i = 0; i < this.arrayItems.length; i++) {

            this.carouselContainer.appendChild(this.arrayItems[i]);
            //setCarousel();
        }
    }

    setUpDraggable() {
        let arrLength = this.arrayItems.length
        if ((window.innerWidth < 1024 && arrLength == 1) || (window.innerWidth >= 1024 && arrLength <= 2) || (window.innerHTML >= 1124 && arrLength <= 3)) {
            this.isDraggable = false;
            this.setUpItemFixed()

        } else {

            // if (arrLength > 3 && arrLength < 6) {
            if (arrLength < 6) {
                while (this.arrayItems.length < 6) {
                    for (let i = 0; i < arrLength; i++) {
                        //console.log("add: ", this.arrayItems[i])
                        let child = this.createDivItem();
                        child.innerHTML = this.arrayItems[i].innerHTML
                        this.arrayItems.push(child)
                        //console.log("child: ", child)
                        this.carouselContainer.appendChild(child)
                    }
                }
            }

        }
    }

    setUpCa(){
        this.index = 0;
        this.carouselContainer.innerHTML = "";
        console.log("carousel clear: " + this.carouselContainer.innerHTML)
        this.arrayItems = [...this.firstArrItems]
        for(let k = 0; k < this.arrayItems.length; k++){
            this.carouselContainer.appendChild(this.arrayItems[k])
        }
        if (this.isDraggableFalse()) {
            //Not draggable
            //->set positon each card
            this.isDraggable = false
            console.log("is disable drag")
            this.controler.style.display = "none"
            this.setCarousel()
        } else {
            this.isDraggable = true
            // this.controler.style.display = "initial"
            //draggable
            let arrLength = this.arrayItems.length
            if (arrLength < 6) {
                while (this.arrayItems.length < 6) {
                    for (let i = 0; i < arrLength; i++) {
                        console.log("add: ", this.arrayItems[i])
                        let child = this.createDivItem();
                        child.innerHTML = this.arrayItems[i].innerHTML
                        this.arrayItems.push(child)
                        console.log("child: ", child)
                        this.carouselContainer.appendChild(child)
                    }
                }
            }

            this.setCarousel()
        }
    }

    setUpEvent() {
        //check idDraggable
        this.setUpCa()

        window.addEventListener('resize', () => {
            this.setUpCa()
        })

        let touchstartX = 0;
        let touchendX = 0;

        if (!this.isDraggable) {
            this.controler.style.display = "none"
        } else {
            this.controler.addEventListener('click', () => {
                if (this.isClickable && this.isDraggable) {
                    this.moveForward()
                    this.isClickable = false

                    setTimeout(() => {
                        this.isClickable = true
                    }, 500)
                }
            }, false);

        }

        this.carouselContainer.addEventListener('pointerdown', function (event) {
            touchstartX = event.pageX;
            console.log("grab")
            this.carouselContainer.style.cursor = "grabbing"
        }.bind(this), false);
        this.carouselContainer.addEventListener('pointerup', function (event) {
            

            touchendX = event.pageX;
            console.log("isDraggable: ", this.isDraggable)
            if (this.isClickable && this.isDraggable) {
                if (touchendX <= touchstartX) {
                    this.moveBackward()
                } else if (touchendX > touchstartX) {
                    this.moveForward()
                }
                this.isClickable = false
                setTimeout(() => {
                    this.isClickable = true
                }, 500)
            }

            this.carouselContainer.style.cursor = "grab"
        }.bind(this), false);

        this.carouselContainer.addEventListener('touchstart', function (event) {
            touchstartX = event.changedTouches[0].screenX;
            console.log("grab")
            console.log("touchstart: ", touchstartX)
            this.carouselContainer.style.cursor = "grabbing"
        }.bind(this), false);
        this.carouselContainer.addEventListener('touchend', function (event) {
            

            touchendX = event.changedTouches[0].screenX;
            console.log("isDraggable: ", this.isDraggable)
            if (this.isClickable && this.isDraggable) {
                if (touchendX <= touchstartX) {
                    this.moveBackward()
                } else if (touchendX > touchstartX) {
                    this.moveForward()
                }
                this.isClickable = false
                setTimeout(() => {
                    this.isClickable = true
                }, 500)
            }

            this.carouselContainer.style.cursor = "grab"
        }.bind(this), false);
    }

}