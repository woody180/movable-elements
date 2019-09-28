let Movable = function(args = {}) {
    let options = {
        movableSelector: args.hasOwnProperty('movableSelector') ? args.movableSelector : '.movable',
        x: args.hasOwnProperty('x') ? args.x : true,
        y: args.hasOwnProperty('y') ? args.y : true,
        restrict: args.hasOwnProperty('restrict') ? args.restrict : null,
        onDrag: args.hasOwnProperty('onDrag') ? args.onDrag : null,
        onMouseDown: args.hasOwnProperty('onMouseDown') ? args.onMouseDown : null,
        onMouseUp: args.hasOwnProperty('onMouseUp') ? args.onMouseUp : null,
    }

    const This = this;
    let isPressed = false;
    let mousePosition = {x: 0, y: 0};
    let offset = [0, 0];
    let currentElement = undefined;
    let restrictContainer = document.querySelector(options.restrict) || document.body;

    // Percent calculator
    let percentCalc = (from, total) => {
        return (from / total) * 100;
    }

    // Calculating percent
    function calcPercent() {
        return {
            x: percentCalc((currentElement.offsetLeft - restrictContainer.getBoundingClientRect().left), (restrictContainer.offsetWidth - currentElement.offsetWidth)),
            y: percentCalc((currentElement.offsetTop - restrictContainer.getBoundingClientRect().top), (restrictContainer.offsetHeight - currentElement.offsetHeight)),
        }
    }

    // Public variables
    this.movableEl = document.querySelectorAll(options.movableSelector);

    // Functions factory / Object
    let el = (function() {
        let Methods = function(sel) {
            this.on = (event, calllback) => {
                sel.forEach((el) => {
                    el.addEventListener(event, calllback);
                })
            }
            this.css = (styleObj) => {
                sel.forEach(item => {
                    for (const key in styleObj) {
                        item.style[key] = styleObj[key]
                    }
                });
            }
        }

        return (selector) => {
            let sel = selector.nodeType || typeof selector === 'object' ? selector : document.querySelectorAll(selector);
            return new Methods(sel);
        };
    })();

    // Add styles
    el(this.movableEl).css({position: 'absolute'});

    // Array.from(document.querySelector('.movable').children)
    this.movableEl.forEach(item => {
        Array.from(item.children).forEach(child => {
            console.log(child);
            child.style.pointerEvents = 'none';
        })
    })

    // Disable text selection
    function disableSelect(event) {
        event.preventDefault();
    }

    /////////////////////// Adding event listeners ///////////////////////
    // Mouse down to movable element
    el(this.movableEl).on('mousedown', (e) => {
        isPressed = true;
        currentElement = e.target;

        offset = [
            currentElement.offsetLeft - e.clientX, // Position from left
            currentElement.offsetTop - e.clientY // Position from top
        ];

        if (options.onMouseDown) {
            options.onMouseDown(e, currentElement, calcPercent())
        }

        currentElement.style.zIndex = 9;
    })

    // Mouse up
    document.addEventListener('mouseup', (e) => {
        isPressed = false;
        e.target.style.zIndex = 1;
        
        if (options.onMouseUp) {
            options.onMouseUp(e, currentElement, 'no percent')
        }

        window.addEventListener('selectstart', disableSelect);
    })

    // Mouse move
    document.addEventListener('mousemove', (e) => {
        window.addEventListener('selectstart', disableSelect);

        if (isPressed) {
            mousePosition.x = e.clientX;
            mousePosition.y = e.clientY;

            if (options.onDrag) {
                options.onDrag(e, currentElement, calcPercent())
            }

            // Moving element, giving style to the element
            (options.x) ? currentElement.style.left = (mousePosition.x + offset[0]) + 'px' : false;
            (options.y) ? currentElement.style.top = (mousePosition.y + offset[1]) + 'px' : false;

            // Restriction
            if (options.restrict) {
                if (currentElement.offsetLeft <= restrictContainer.getBoundingClientRect().left) {
                    currentElement.style.left = restrictContainer.getBoundingClientRect().left + 'px'
                }
                if (currentElement.offsetTop <= restrictContainer.getBoundingClientRect().top) {
                    currentElement.style.top = restrictContainer.getBoundingClientRect().top + 'px'
                }
                if (currentElement.offsetLeft >= (restrictContainer.getBoundingClientRect().right - currentElement.offsetWidth)) {
                    currentElement.style.left = (restrictContainer.getBoundingClientRect().right - currentElement.offsetWidth) + 'px'
                }
                if (currentElement.offsetTop >= (restrictContainer.getBoundingClientRect().bottom - currentElement.offsetHeight)) {
                    currentElement.style.top = (restrictContainer.getBoundingClientRect().bottom - currentElement.offsetHeight) + 'px'
                }
            }
        }
    })
}