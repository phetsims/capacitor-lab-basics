//  Copyright 2002-2014, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );

  /**
   * Constructor for the node containing the wires of the circuit
   * @param topPlate: the top plate of the capacitor, of the PlateNode class
   * @param bottomPlate: the bottom plate of the capacitor, of the PlateNode class
   **/
  function WireNode(model, topPlate, bottomPlate, options) {
    Node.call( this, options );
    
    // horizontal length of wires
    var xLength = 350;
    // vertical length of wires
    var yLength = 110;
    // shift to lengthen the top wire when the battery switches polarization
    var batteryOffset = 0;
    // increase in length for top wire so that it remains in the center of the top plate
    var topPlateOffset = 20;
    // increase in length of the bottom wire so that it remains at the bottom of the bottom plate
    var bottomPlateOffset = -7;
    // width of the wire
    var wireWidth = 8;
    // height of the battery
    var separation = 208;
    // scale to convert the plateSeparationProperty value into pixels
    var plateSeparationScale = 10;
    // plate separation in pixels
    var plateSeparation = model.plateSeparationProperty.value * plateSeparationScale;
    
    var thisNode = this;
    
    // upper wire
    var topWireShape = makeTopShape();
    this.topWire = new Path( topWireShape, {stroke: 'black', fill: '#aaaaaa'} );
    this.addChild( this.topWire );
    
    // lower wire
    var bottomWireShape = makeBottomShape();
    this.bottomWire = new Path( bottomWireShape, {x: 0, y: separation, stroke: 'black', fill: '#aaaaaa'});
    this.addChild( this.bottomWire );

    model.voltageProperty.link( function () {
      if (model.voltageProperty.value < 0) {
        batteryOffset = 8;
      }
      else if (model.voltageProperty.value >= 0) {
        batteryOffset = 0;
      }
      thisNode.topWire.shape = makeTopShape();
    });
    
    model.batteryConnectedProperty.link( function () {
      if (!model.batteryConnectedProperty.value) {
        thisNode.visible = false;
      }
      else {
        thisNode.visible = true;
      }
    });
    
    model.plateSeparationProperty.link( function () {
      // change in wire length caused by plates moving up and down
      var diff = (model.plateSeparationProperty.value * plateSeparationScale - plateSeparation)*.8;
      // change in bottom wire length caused by plates expanding
      var shift = 30 * (Math.sqrt(model.capacitorPlateAreaProperty.value / 100) - 1)*.8;
      
      topPlateOffset = 20 - diff;
      bottomPlateOffset = -7 - diff - shift;
      thisNode.topWire.shape = makeTopShape();
      thisNode.bottomWire.shape = makeBottomShape();
    });
    
    model.capacitorPlateAreaProperty.link( function () {
      // change in wire length caused by plates moving up and down
      var shift = 30 * (Math.sqrt(model.capacitorPlateAreaProperty.value / 100) - 1)*.8;
      // change in bottom wire length caused by plates expanding
      var diff = (model.plateSeparationProperty.value * plateSeparationScale - plateSeparation)*.8;
      
      bottomPlateOffset = -7 - diff - shift;
      thisNode.bottomWire.shape = makeBottomShape();
    });
    
    // create the shape for the upper wire
    function makeTopShape() {
      var topWireShape = new Shape().
        moveTo( 0, batteryOffset ).
        verticalLineTo( -yLength ).
        horizontalLineTo( xLength ).
        verticalLineTo( topPlateOffset ).
        horizontalLineTo( xLength - wireWidth ).
        verticalLineTo( -yLength + wireWidth ).
        horizontalLineTo( wireWidth ).
        verticalLineTo( batteryOffset ).
        horizontalLineTo( 0 ).
        verticalLineTo( -yLength );
      return topWireShape;
    }
    
    // create the shape for the lower wire
    function makeBottomShape() {
      var bottomWireShape = new Shape().
        verticalLineTo( yLength ).
        horizontalLineTo( xLength ).
        verticalLineTo( -bottomPlateOffset ).
        horizontalLineTo( xLength - wireWidth ).
        verticalLineTo( yLength - wireWidth ).
        horizontalLineTo( wireWidth ).
        verticalLineTo( 0 ).
        horizontalLineTo( 0 ).
        verticalLineTo( yLength );
      return bottomWireShape;
    }
  }
  
  return inherit( Node, WireNode );
} );