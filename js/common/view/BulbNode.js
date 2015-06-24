// Copyright 2002-2014, University of Colorado Boulder

/**
 * Bulb node for 'Faradays Law' simulation
 *
 * TODO: DRAWING CODE IS TAKEN DIRECTLY FROM FARADAY'S LAW.
 * TODO: THIS CODE IS TEMPORARY.  WE NEED TO MAKE DESIGN DECISIONS ABOUT WHAT THE DESIRED BULB SHAPE AND BEHAVIOR IS ( AND WHY ).
 *
 * TODO: THIS CODE WILL BE REMOVED AND APPROPRIATE CHANGES WILL BE MADE TO LightBulbNode of scenery-phet IN THE NEAR FUTURE.
 *
 * TODO: NOT PULLING FROM FARADAY'S LAW AT THE TIME BEING BECAUSE I NEED THE FACTORY FUNCTIONS TO DRAW A BULB
 * TODO: WITHOUT LINKING TO MODEL PROPERTIES.
 *
 * @author Vasily Shakhov (MLearner)
 * @author John Blanco
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );
  var LinearFunction = require( 'DOT/LinearFunction' );

  // images
  var bulbBaseImage = require( 'image!CAPACITOR_LAB_BASICS/light-bulb-base.png' );

  // constants
  var BULB_HEIGHT = 125;
  var BULB_WIDTH = 65;
  var BULB_BASE_WIDTH = 36;
  var NUM_FILAMENT_ZIG_ZAGS = 8;
  var FILAMENT_ZIG_ZAG_SPAN = 8;
  var BULB_X_DISPLACEMENT = -45; // Bulb dx relative to center position

  function createBulb( options ) {

    var bulbNode = new Node( options );

    // Create the base of the bulb
    var bulbBase = new Image( bulbBaseImage );
    bulbBase.scale( BULB_BASE_WIDTH / bulbBase.bounds.height );

    // Important Note: For the drawing code below, the reference frame is assumed to be such that the point x=0, y=0 is
    // at the left side of the light bulb base, which is also the right side of the light bulb body, and the vertical
    // center of both.  This was the easiest to work with.

    // Create the bulb body.
    var bulbNeckWidth = BULB_BASE_WIDTH * 0.85;
    var bulbBodyHeight = BULB_HEIGHT - bulbBase.bounds.width;
    var controlPointYValue = BULB_WIDTH * 0.7;
    var bulbShape = new Shape().
      moveTo( 0, -bulbNeckWidth / 2 ).
      cubicCurveTo( -bulbBodyHeight * 0.33, -controlPointYValue, -bulbBodyHeight * 0.95, -controlPointYValue, -bulbBodyHeight, 0 ).
      cubicCurveTo( -bulbBodyHeight * 0.95, controlPointYValue, -bulbBodyHeight * 0.33, controlPointYValue, 0, bulbNeckWidth / 2 );
    var bulbBodyOutline = new Path( bulbShape, {
      stroke: 'black',
      lineCap: 'round'
    } );
    var bulbBodyFill = new Path( bulbShape, {
      fill: new RadialGradient( bulbBodyOutline.centerX, bulbBodyOutline.centerY, BULB_WIDTH / 10, bulbBodyOutline.centerX,
        bulbBodyOutline.centerY, BULB_WIDTH / 2 ).addColorStop( 0, '#eeeeee' ).addColorStop( 1, '#bbccbb' )
    } );

    // Create the filament support wires.
    var filamentWireHeight = bulbBodyHeight * 0.6;
    var filamentTopPoint = new Vector2( -filamentWireHeight, -BULB_WIDTH * 0.3 );
    var filamentBottomPoint = new Vector2( -filamentWireHeight, BULB_WIDTH * 0.3 );
    var filamentSupportWiresShape = new Shape();
    filamentSupportWiresShape.moveTo( 0, -BULB_BASE_WIDTH * 0.3 );
    filamentSupportWiresShape.cubicCurveTo( -filamentWireHeight * 0.3, -BULB_BASE_WIDTH * 0.3, -filamentWireHeight * 0.4, filamentTopPoint.y, filamentTopPoint.x, filamentTopPoint.y );
    filamentSupportWiresShape.moveTo( 0, BULB_BASE_WIDTH * 0.3 );
    filamentSupportWiresShape.cubicCurveTo( -filamentWireHeight * 0.3, BULB_BASE_WIDTH * 0.3, -filamentWireHeight * 0.4, filamentBottomPoint.y, filamentBottomPoint.x, filamentBottomPoint.y );
    var filamentSupportWires = new Path( filamentSupportWiresShape, { stroke: 'black' } );

    // Create the filament, which is a zig-zag shape.
    var filamentShape = new Shape().moveToPoint( filamentTopPoint );
    for ( var i = 0; i < NUM_FILAMENT_ZIG_ZAGS - 1; i++ ) {
      var yPos = filamentTopPoint.y + ( filamentBottomPoint.y - filamentTopPoint.y ) / NUM_FILAMENT_ZIG_ZAGS * (i + 1);
      if ( i % 2 === 0 ) {
        // zig
        filamentShape.lineTo( filamentTopPoint.x + FILAMENT_ZIG_ZAG_SPAN, yPos );
      }
      else {
        // zag
        filamentShape.lineTo( filamentTopPoint.x, yPos );
      }
    }
    filamentShape.lineToPoint( filamentBottomPoint );
    var filament = new Path( filamentShape, { stroke: 'black' } );

    // Create the 'halo' that makes the bulb look like it is shining.
    bulbNode.haloNode = new Node();
    bulbNode.haloNode.addChild( new Circle( 5, {
      fill: 'white',
      opacity: 0.46
    } ) );
    bulbNode.haloNode.addChild( new Circle( 3.75, {
      fill: 'white',
      opacity: 0.51
    } ) );
    bulbNode.haloNode.addChild( new Circle( 2, {
      fill: 'white'
    } ) );

    // Add the children in the order needed to get the desired layering
    bulbNode.addChild( bulbBodyFill );
    bulbNode.addChild( filamentSupportWires );
    bulbNode.addChild( filament );
    bulbNode.addChild( bulbNode.haloNode );
    bulbNode.addChild( bulbBase );
    bulbNode.addChild( bulbBodyOutline );

    // Do some last layout
    bulbBase.centerY = 0;
    bulbBase.left = 0;
    bulbNode.haloNode.center = filament.center;

    bulbNode.centerX = bulbNode.centerX + BULB_X_DISPLACEMENT;

    return bulbNode;
  }

  /**
   * Constructor for a BulbNode.
   *
   * @param currentAmplitudeProperty - current amplitude through the circuit, determines brightness
   * @param {Object} [options]
   * @constructor
   */
  function BulbNode( currentAmplitudeProperty, options ) {

    Node.call( this );
    var thisNode = this;

    this.bulb = createBulb( options );
    this.addChild( this.bulb );

    // TODO: Still testing this mapping funciton.  Not spending a lot of time on it because we do not have input from
    // TODO: the design team about what this behavior should be like.
    var bulbBrightnessMap = new LinearFunction( 0, 5E-13, 0, 50, true );

    // Update the halo as the needle angle changes.
    currentAmplitudeProperty.link( function( current ) {
      var targetScaleFactor = bulbBrightnessMap( Math.abs( current ) );
      if ( targetScaleFactor < 0.1 ) {
        thisNode.bulb.haloNode.visible = false;
      }
      else {
        thisNode.bulb.haloNode.visible = true;
        var scale = targetScaleFactor / thisNode.bulb.haloNode.transform.matrix.scaleVector.x;
        thisNode.bulb.haloNode.scale( scale );
      }
    } );
  }

  return inherit( Node, BulbNode, {}, {

    /** Factory function to create a BulbNode.  This creates a node that is not linked to any model properties.
     * This is useful in cases such as control panel content where the node should not respond to model changes.
     *
     * @param {Object} options
     */
    createBulb: function( options ) {
      return createBulb( options );
    }
  } );
} );
