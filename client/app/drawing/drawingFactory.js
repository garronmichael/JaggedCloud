/**
 * canvasFactory.js
 *
 * This is a service designed to handle the drawing on canvas functionality within a given room.
 * It uses fabric.js, a library on top of HTML5 canvas
 * The data will be continually synced via WebSockets and saved at the end
 */

(function() {
  angular
    .module('hackbox')
    .factory('Drawing', Drawing);

  Drawing.$inject = ['Sockets'];

  function Drawing(Sockets) {
    var _fabricCanvas = null;
    var _socket = null;
    var _intervalID = null;

    var instance = {
      makeCanvas: makeCanvas,
      initializeIO: initializeIO,
      removeCanvas: removeCanvas,
      updateCanvas: updateCanvas
    };

    return instance;

    //// IMPLEMENTATION /////

    /**
     * Function: Drawing.makeCanvas()
     * This Function will create and return a new HTML% canvas element
     * set its initial position, id and size it can then be appended to the DOM where/when desired
     * 
     * @return: Canvas element to append to DOM. 
     */
    function makeCanvas() {
      console.log('making a canvas');
      var newCanvas = $('<canvas></canvas>')
        .attr('id', 'drawingCanvas');

      $('.drawing-container').append(newCanvas);

      _fabricCanvas = new fabric.Canvas('drawingCanvas', {
        isDrawingMode: true
      });

      _fabricCanvas.freeDrawingBrush = new fabric['Circle'+ 'Brush'](_fabricCanvas);
      _fabricCanvas.setHeight(2000);
      _fabricCanvas.setWidth(2000);

      return _fabricCanvas;
    }

    function initializeIO() {
      console.log('Initializing Sockets IO');
      _socket = io();

      Sockets.on('init', function (initialData) {
       console.log('Socket connection initialized!', initialData);
      });

      Sockets.on('coordinates', updateCanvas);
      _fabricCanvas.on('mouse:down', sendData); 
      _fabricCanvas.on('mouse:up', clearData);       
    }

    /**
     * Function: Drawing.removeCanvas(containerClassName)
     * This Function finds a canvas on screen with the specified id
     * and then removes the canvas
     *
     * @param containerClassName: The class to find elements by in the DOM. 
     * @return: True if canvas was removed, false if no action was taken. 
     */
    function removeCanvas() {
      var canvas = $('.canvas-container'); //this might need to be the lower canvas
      if( canvas ) {
        canvas.remove();
        return true;
      }
      return false;
    }

    //Function: Drawing.updateCanvas()
    //This Function takes in canvas data in the stringified png format
    //It then updates the canvas with the data
    //This happens on every mousemove (really mouseup)
    function updateCanvas(data) {
      var obj = JSON.parse(data);
      _fabricCanvas.loadFromJSON(obj, _fabricCanvas.renderAll.bind(_fabricCanvas));
    }

    function sendData(options) {
      _intervalID = setInterval(function() {
        var json = JSON.stringify( _fabricCanvas.toJSON() );
        Sockets.emit('coords', json);
        console.log('emit!');
      }, 50);
    }

    function clearData() {
      console.log('interval cleared');
      clearInterval(_intervalID);
      var json = JSON.stringify( _fabricCanvas.toJSON() );
      Sockets.emit('coords', json);
    }
  }
})();