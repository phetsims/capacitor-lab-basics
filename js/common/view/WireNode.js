// Copyright 2002-2015, University of Colorado Boulder

/**
 * Visual representation of a wire.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );

  // constants
  var WIRE_LINE_WIDTH = 2;
  var WIRE_STROKE = 'rgb( 143, 143, 143 )';
  var WIRE_FILL = 'rgb( 170, 170, 170 )';

  /**
   * Constructor for the wire node.
   *
   * @param {Wire} wire
   * @constructor
   */
  function WireNode( wire ) {

    Node.call( this );
    this.wire = wire;
    //var wireShapes = wire.createShapes(); // TODO: Static for now, will need to be dynamic to support wire shape changes.
    //var wireBounds = wire.shapeCreator.createWireShape( WIRE_LINE_WIDTH / 15000 );
    //wireBounds.forEach( function( bounds ) {
    //  thisNode.addChild( new Rectangle( bounds, {fill: 'rgba( 1, 0, 0, 0.75 )' } ) );
    //} );

    var wireNode = new Path( wire.shapeCreator.createWireShape(), {
        lineWidth: WIRE_LINE_WIDTH,
        stroke: WIRE_STROKE,
        fill: WIRE_FILL
      } );
    //this.addChild( new Rectangle( wireNode.computeShapeBounds(), { fill: 'rgba( 1, 0, 0, 0.5)'}  ) );
    this.addChild( wireNode );
    //wireShapes.forEach( function( shape ) {
    //  thisNode.addChild( new Path( shape, { lineWidth: WIRE_LINE_WIDTH, fill: WIRE_FILL, stroke: WIRE_STROKE } ) );
    //} );

    // TODO
    wire.shapeProperty.link( function( shape ) {
      wireNode.setShape( shape );
    } );
    //wire.addShapeObserver( new SimpleObserver() {
    //  public void update() {
    //    pathNode.setPathTo( wire.getShape() );
    //  }
    //} );
  }

  return inherit( Node, WireNode );
} );


//  /**
//   * Constructor for the node containing the wires of the circuit
//   * @param {CapacitorLabModel} model
//   * @param {PlateNode} topPlate
//   * @param {PlateNode} bottomPlate
//   **/
//  function WireNode( model, topPlate, bottomPlate, options ) {
//    Node.call( this, options );
//
//    // horizontal length of wires
//    var xLength = 350;
//    // vertical length of wires
//    var yLength = 110;
//    // shift to lengthen the top wire when the battery switches polarization
//    var batteryOffset = 0;
//    // increase in length for top wire so that it remains in the center of the top plate
//    var topPlateOffset = 20;
//    // increase in length of the bottom wire so that it remains at the bottom of the bottom plate
//    var bottomPlateOffset = -7;
//    // width of the wire
//    var wireWidth = 8;
//    // height of the battery
//    var separation = 208;
//    // scale to convert the plateSeparationProperty value into pixels
//    var plateSeparationScale = 10;
//    // plate separation in pixels
//    var plateSeparation = model.plateSeparationProperty.value * plateSeparationScale;
//    // scale of wire node in circuit
//    var scale = 0.8;
//
//    var thisNode = this;
//
//    // create the shape for the upper wire
//    function makeTopShape() {
//      var topWireShape = new Shape().
//        moveTo( 0, batteryOffset ).
//        verticalLineTo( -yLength ).
//        horizontalLineTo( xLength ).
//        verticalLineTo( topPlateOffset ).
//        horizontalLineTo( xLength - wireWidth ).
//        verticalLineTo( -yLength + wireWidth ).
//        horizontalLineTo( wireWidth ).
//        verticalLineTo( batteryOffset ).
//        horizontalLineTo( 0 ).
//        verticalLineTo( -yLength );
//      return topWireShape;
//    }
//
//    // create the shape for the lower wire
//    function makeBottomShape() {
//      var bottomWireShape = new Shape().
//        moveTo( 0, separation ).
//        verticalLineTo( yLength + separation ).
//        horizontalLineTo( xLength ).
//        verticalLineTo( -bottomPlateOffset + separation ).
//        horizontalLineTo( xLength - wireWidth ).
//        verticalLineTo( yLength - wireWidth + separation).
//        horizontalLineTo( wireWidth ).
//        verticalLineTo( separation ).
//        horizontalLineTo( 0 ).
//        verticalLineTo( yLength + separation );
//      return bottomWireShape;
//    }
//
//    var wireOptions = {stroke: 'black', fill: '#aaaaaa'};
//    // upper wire
//    var topWireShape = makeTopShape();
//    this.topWire = new Path( topWireShape, wireOptions );
//    this.addChild( this.topWire );
//
//    // lower wire
//    var bottomWireShape = makeBottomShape();
//    this.bottomWire = new Path( bottomWireShape, wireOptions );
//    this.addChild( this.bottomWire );
//
//    model.voltageProperty.link( function () {
//      if (model.voltageProperty.value < 0) {
//        batteryOffset = 8;
//      }
//      else if (model.voltageProperty.value >= 0) {
//        batteryOffset = 0;
//      }
//      thisNode.topWire.shape = makeTopShape();
//    } );
//
//    model.batteryConnectedProperty.link( function () {
//      if (!model.batteryConnectedProperty.value) {
//        thisNode.visible = false;
//      }
//      else {
//        thisNode.visible = true;
//      }
//    } );
//
//    model.plateSeparationProperty.link( function () {
//      // change in wire length caused by plates moving up and down
//      var diff = (model.plateSeparationProperty.value * plateSeparationScale - plateSeparation)*scale;
//      // change in bottom wire length caused by plates expanding
//      var shift = 30 * (Math.sqrt(model.capacitorPlateAreaProperty.value / 100) - 1)*scale;
//
//      topPlateOffset = 20 - diff;
//      bottomPlateOffset = -7 - diff - shift;
//      thisNode.topWire.shape = makeTopShape();
//      thisNode.bottomWire.shape = makeBottomShape();
//    } );
//
//    model.capacitorPlateAreaProperty.link( function () {
//      // change in wire length caused by plates moving up and down
//      var shift = 30 * (Math.sqrt(model.capacitorPlateAreaProperty.value / 100) - 1)*scale;
//      // change in bottom wire length caused by plates expanding
//      var diff = (model.plateSeparationProperty.value * plateSeparationScale - plateSeparation)*scale;
//
//      bottomPlateOffset = -7 - diff - shift;
//      thisNode.bottomWire.shape = makeBottomShape();
//    } );
//  }
//
//  return inherit( Node, WireNode );
//} );