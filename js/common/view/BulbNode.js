// Copyright 2015-2022, University of Colorado Boulder

/**
 * Bulb Node.  Bulb is composed of a image at the base, and the bulb and filament are drawn.
 * Bulb brightness is a function of the current running through the bulb.
 *
 * NOTE: This code is borrowed directly from Faraday's Law.  LightBulbNode is still being generalized, see
 * https://github.com/phetsims/scenery-phet/issues/170.
 *
 * @author Vasily Shakhov (MLearner)
 * @author John Blanco (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import LinearFunction from '../../../../dot/js/LinearFunction.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import lightBulbBase_png from '../../../../scenery-phet/mipmaps/lightBulbBase_png.js';
import { Circle, Image, Node, Path, RadialGradient } from '../../../../scenery/js/imports.js';
import capacitorLabBasics from '../../capacitorLabBasics.js';
import CircuitState from '../model/CircuitState.js';

// constants
const BULB_HEIGHT = 130;
const BULB_WIDTH = 65;
const BULB_BASE_WIDTH = 42;
const NUM_FILAMENT_ZIG_ZAGS = 8;
const FILAMENT_ZIG_ZAG_SPAN = 8;

class BulbNode extends Node {
  /**
   * @param {LightBulb} lightBulb
   * @param {Property.<number>} voltageProperty - voltage across the terminals of the lightbulb, determines brightness
   * @param {Property.<CircuitState>} circuitConnectionProperty
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( lightBulb, voltageProperty, circuitConnectionProperty, tandem, options ) {

    super( {
      tandem: tandem
    } );

    // @private {LightBulb}
    this.bulb = drawBulbNode( options );
    this.addChild( this.bulb );

    // NOTE: this map deviates from the bulb in faradays-law
    const bulbBrightnessMap = new LinearFunction( 0, 5E-13, 0, 225, true );

    const updateBrightnessScale = voltage => {
      if ( circuitConnectionProperty.value === CircuitState.LIGHT_BULB_CONNECTED ) {
        const targetScaleFactor = bulbBrightnessMap.evaluate( Math.abs( lightBulb.getCurrent( voltage ) ) );
        if ( targetScaleFactor < 0.1 ) {
          this.bulb.haloNode.visible = false;
        }
        else {
          this.bulb.haloNode.visible = true;
          const scale = targetScaleFactor / this.bulb.haloNode.transform.matrix.scaleVector.x;
          this.bulb.haloNode.scale( scale );
        }
      }

      // Light bulb is not connected to the circuit, so no current can flow through it.
      else {
        this.bulb.haloNode.visible = false;
      }
    };

    // Update the halo as the needle angle changes.
    voltageProperty.link( voltage => {
      updateBrightnessScale( voltage );
    } );

    // make sure that the light bulb turns off instantly when disconnected from capacitor.
    circuitConnectionProperty.link( circuitConnection => {
      updateBrightnessScale( voltageProperty.value );
    } );
  }

  /**
   * Create a bulb node icon.  This creates a node that is not linked to any model properties.
   * @public
   *
   * @param {Object} [options]
   * @returns {Node}
   */
  static createBulbIcon( options ) {
    return drawBulbNode( options );
  }
}

capacitorLabBasics.register( 'BulbNode', BulbNode );

/**
 * Create the visual components for a bulbNode with a base, bulb, filament and halo.
 * The halo is made public so that the BulbNode can change its size as a representation
 * of brightness.
 * @private
 *
 * @param {Object} [options]
 * @returns {Node}
 */
function drawBulbNode( options ) {

  const iconNode = new Node( options );

  // Create the base of the bulb
  const bulbBase = new Image( lightBulbBase_png );
  bulbBase.scale( BULB_BASE_WIDTH / bulbBase.bounds.height );

  // Important Note: For the drawing code below, the reference frame is assumed to be such that the point x=0, y=0 is
  // at the left side of the light bulb base, which is also the right side of the light bulb body, and the vertical
  // center of both.  This was the easiest to work with.

  // Create the bulb body.
  const bulbNeckWidth = BULB_BASE_WIDTH * 0.85;
  const bulbBodyHeight = BULB_HEIGHT - bulbBase.bounds.width;
  const controlPointYValue = BULB_WIDTH * 0.7;
  const bulbShape = new Shape().moveTo( 0, -bulbNeckWidth / 2 ).cubicCurveTo( -bulbBodyHeight * 0.33, -controlPointYValue, -bulbBodyHeight * 0.95, -controlPointYValue, -bulbBodyHeight, 0 ).cubicCurveTo( -bulbBodyHeight * 0.95, controlPointYValue, -bulbBodyHeight * 0.33,
    controlPointYValue, 0, bulbNeckWidth / 2 );
  const bulbBodyOutline = new Path( bulbShape, {
    stroke: 'black',
    lineCap: 'round'
  } );
  const bulbBodyFill = new Path( bulbShape, {
    fill: new RadialGradient( bulbBodyOutline.centerX, bulbBodyOutline.centerY, BULB_WIDTH / 10, bulbBodyOutline.centerX,
      bulbBodyOutline.centerY, BULB_WIDTH / 2 ).addColorStop( 0, '#eeeeee' ).addColorStop( 1, '#bbccbb' )
  } );

  // Create the filament support wires.
  const filamentWireHeight = bulbBodyHeight * 0.6;
  const filamentTopPoint = new Vector2( -filamentWireHeight, -BULB_WIDTH * 0.3 );
  const filamentBottomPoint = new Vector2( -filamentWireHeight, BULB_WIDTH * 0.3 );
  const filamentSupportWiresShape = new Shape();
  filamentSupportWiresShape.moveTo( 0, -BULB_BASE_WIDTH * 0.3 );
  filamentSupportWiresShape.cubicCurveTo( -filamentWireHeight * 0.3, -BULB_BASE_WIDTH * 0.3, -filamentWireHeight * 0.4, filamentTopPoint.y, filamentTopPoint.x, filamentTopPoint.y );
  filamentSupportWiresShape.moveTo( 0, BULB_BASE_WIDTH * 0.3 );
  filamentSupportWiresShape.cubicCurveTo( -filamentWireHeight * 0.3, BULB_BASE_WIDTH * 0.3, -filamentWireHeight * 0.4, filamentBottomPoint.y, filamentBottomPoint.x, filamentBottomPoint.y );
  const filamentSupportWires = new Path( filamentSupportWiresShape, { stroke: 'black' } );

  // Create the filament, which is a zig-zag shape.
  const filamentShape = new Shape().moveToPoint( filamentBottomPoint ).zigZagToPoint( filamentTopPoint, FILAMENT_ZIG_ZAG_SPAN, NUM_FILAMENT_ZIG_ZAGS, true );
  const filament = new Path( filamentShape, { stroke: 'black' } );

  // Create the 'halo' that makes the bulb look like it is shining.
  // @public
  iconNode.haloNode = new Node();
  iconNode.haloNode.addChild( new Circle( 5, {
    fill: 'white',
    opacity: 0.46
  } ) );
  iconNode.haloNode.addChild( new Circle( 3.75, {
    fill: 'white',
    opacity: 0.51
  } ) );
  iconNode.haloNode.addChild( new Circle( 2, {
    fill: 'white'
  } ) );

  // Add the children in the order needed to get the desired layering
  iconNode.addChild( bulbBodyFill );
  iconNode.addChild( filamentSupportWires );
  iconNode.addChild( filament );
  iconNode.addChild( iconNode.haloNode );
  iconNode.addChild( bulbBase );
  iconNode.addChild( bulbBodyOutline );

  // Do some last layout
  bulbBase.centerY = 0;
  bulbBase.left = 0;
  iconNode.haloNode.center = filament.center;
  iconNode.haloNode.visible = false;

  iconNode.rotate( Math.PI );

  return iconNode;
}

export default BulbNode;