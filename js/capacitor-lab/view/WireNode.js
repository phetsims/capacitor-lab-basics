//  Copyright 2002-2014, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );

  function WireNode(model, options) {
    Node.call( this, options );
    
    var xLength = 350;
    var yLength = 110;
    var batteryOffset = 0;
    var topPlateOffset = 20;
    var bottomPlateOffset = -7;
    var wireWidth = 8;
    var separation = 208;
    
    var topWire = makeTopShape();
    this.addChild( topWire );
    
    var bottomWire = makeBottomShape();
    this.addChild( bottomWire );
    
    
    var thisNode = this;
    model.voltageProperty.link( function () {
      if (model.voltageProperty.value < 0) {
        batteryOffset = 8;
      }
      else if (model.voltageProperty.value >= 0) {
        batteryOffset = 0;
      }
      thisNode.removeChild(topWire);
      topWire = makeTopShape();
      thisNode.addChild( topWire );
    });
    
    model.batteryConnectedProperty.link( function () {
      if (!model.batteryConnectedProperty.value) {
        thisNode.visible = false;
      }
      else {
        thisNode.visible = true;
      }
    });
    
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
      var topWire = new Path( topWireShape, {stroke: 'black', fill: '#aaaaaa'} );
      return topWire;
    }
    
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
      var bottomWire = new Path( bottomWireShape, {x: 0, y: separation, stroke: 'black', fill: '#aaaaaa'});
      return bottomWire;
    }
  }
  
  return inherit( Node, WireNode);
} );