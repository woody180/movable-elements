# Js draggable element plugin. No libraries
It's small, simple, easy to use plugin which gives you ability to move html elements, restrict tham by parent element size, get position in percent...

Plugin is written in native javascript. It means that no library such as jquery is required for use it.

# How to use
By default the plugin looks for '.movable' class.
```javascript
new Movable();
```
Additional options
```javascript
new Movable({
    movableSelector: '.movable', // Default selector
    restrict: '.container', // Default is body
    x: true, // True by defautl
    y: true, // True by default
});
```
Events 
```javascript
new Movable({
    onMouseDown: function(e, elem, percent) {
        elem.innerText = `${Math.floor(percent.x)}%`
    },
    onMouseUp: function(e, elem) {
        elem.innerText = 'Mouse up';
    },
    onDrag: function(e, elem, percent) {
        elem.innerText = `${Math.floor(percent.x)}%`
    },
});
```