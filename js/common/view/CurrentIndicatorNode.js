// Copyright 2015-2022, University of Colorado Boulder

/**
 * Arrow and electron that indicates the direction of current flow. Visibility of this node is handled via its
 * transparency. The node appears while current is flowing. When current stops flowing, the node fades out over a
 * period of time.
 *
 * By default, the arrow points to the left. Origin is at the geometric center, so that this node can be easily rotated
 * when current changes direction.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import MinusNode from '../../../../scenery-phet/js/MinusNode.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import PlusNode from '../../../../scenery-phet/js/PlusNode.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import { Color, Node } from '../../../../scenery/js/imports.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import capacitorLabBasics from '../../capacitorLabBasics.js';

// constants
// arrow properties
const ARROW_LENGTH = 88;
const ARROW_HEAD_WIDTH = 30;
const ARROW_HEAD_HEIGHT = 25;
const ARROW_TAIL_WIDTH = 0.4 * ARROW_HEAD_WIDTH;
const ARROW_TIP_POSITION = new Vector2( 0, 0 ); // origin at the tip
const ARROW_TAIL_POSITION = new Vector2( ARROW_LENGTH, 0 );

// electron properties
const CHARGE_DIAMETER = 0.8 * ARROW_TAIL_WIDTH;
const ELECTRON_LINE_WIDTH = 1;
const CHARGE_STROKE_COLOR = 'black';
const CHARGE_SYMBOL_COLOR = 'black';
const CHARGE_SYMBOL_SIZE = new Dimension2( 0.6 * CHARGE_DIAMETER, 0.1 * CHARGE_DIAMETER );

class CurrentIndicatorNode extends Node {
  /**
   * Rotation angles should be set such that +dV/dt indicates current flow towards the positive terminal
   * of the battery.
   *
   * @param {Property.<number>} currentAmplitudeProperty
   * @param {number} startingOrientation
   * @param {NumberProperty.<number>} positiveOrientationProperty
   * @param {Property.<Color>} colorProperty
   * @param {Emitter} stepEmitter
   * @param {Tandem} tandem
   */
  constructor( currentAmplitudeProperty, startingOrientation, positiveOrientationProperty, colorProperty, stepEmitter, tandem ) {

    super( { opacity: 0 } );

    // @private {Emitter}
    this.stepEmitter = stepEmitter;

    this.stepEmitter.addListener( dt => {
      this.animation && this.animation.step( dt );
    } );

    const arrowNode = new ArrowNode( ARROW_TAIL_POSITION.x, ARROW_TAIL_POSITION.y, ARROW_TIP_POSITION.x, ARROW_TIP_POSITION.y, {
      headHeight: ARROW_HEAD_HEIGHT,
      headWidth: ARROW_HEAD_WIDTH,
      tailWidth: ARROW_TAIL_WIDTH,
      fill: colorProperty,
      tandem: tandem.createTandem( 'arrowNode' )
    } );

    this.addChild( arrowNode );

    const electronNode = new ShadedSphereNode( CHARGE_DIAMETER, {
      fill: colorProperty,
      stroke: CHARGE_STROKE_COLOR,
      lineWidth: ELECTRON_LINE_WIDTH,
      mainColor: colorProperty,
      highlightXOffset: 0,
      highlightYOffset: 0
    } );
    this.addChild( electronNode );

    const protonNode = new ShadedSphereNode( CHARGE_DIAMETER, {
      fill: new Color( PhetColorScheme.RED_COLORBLIND ),
      stroke: CHARGE_STROKE_COLOR,
      lineWidth: ELECTRON_LINE_WIDTH,
      mainColor: new Color( PhetColorScheme.RED_COLORBLIND ),
      highlightXOffset: 0,
      highlightYOffset: 0,
      visible: !electronNode.visible
    } );
    this.addChild( protonNode );


    // Use scenery-phet's minus node because Text("-") can't be accurately centered.
    const minusNode = new MinusNode( {
      size: CHARGE_SYMBOL_SIZE,
      fill: CHARGE_SYMBOL_COLOR
    } );
    this.addChild( minusNode );

    // Use scenery-phet's plus node because Text("+") can't be accurately centered.
    const plusNode = new PlusNode( {
      size: CHARGE_SYMBOL_SIZE,
      fill: CHARGE_SYMBOL_COLOR,
      visible: !minusNode.visible
    } );
    this.addChild( plusNode );

    // layout
    let x = -arrowNode.bounds.width / 2;
    let y = 0;
    arrowNode.translate( x, y );
    x = arrowNode.bounds.maxX - ( 0.6 * ( arrowNode.bounds.width - ARROW_HEAD_HEIGHT ) );
    y = arrowNode.bounds.centerY;
    electronNode.translate( x, y );
    minusNode.center = electronNode.center;
    protonNode.center = electronNode.center;
    plusNode.center = electronNode.center;

    // @private {Animation|null} animation that will fade out the node
    this.animation = null;

    currentAmplitudeProperty.lazyLink( () => {
      // only start this animation if the current indicator is visible
      if ( this.isVisible() ) {
        this.startAnimation();
      }
    } );

    let lastNonzeroAmplitude = 0;

    // observe current to determine rotation and opacity
    Multilink.lazyMultilink( [ currentAmplitudeProperty, positiveOrientationProperty ], ( currentAmplitude, positiveOrientation ) => {

      if ( currentAmplitude !== 0 ) {
        lastNonzeroAmplitude = currentAmplitude;
      }

      // update the orientation of the indicator
      if ( lastNonzeroAmplitude > 0 ) {
        this.rotation = startingOrientation + positiveOrientation;
      }
      else if ( lastNonzeroAmplitude < 0 ) {
        this.rotation = startingOrientation + positiveOrientation + Math.PI;
      }

      // Electron/Proton visibility dependent on orientation of current.
      const chargeVisible = positiveOrientation === 0;
      electronNode.visible = chargeVisible;
      minusNode.visible = chargeVisible;
      protonNode.visible = !chargeVisible;
      plusNode.visible = !chargeVisible;
    } );
  }

  /**
   * Start the animation, canceling the animation if it is in progress
   * @public
   */
  startAnimation() {
    const self = this;
    this.stopAnimation();

    // show symbol and gradually fade out by modulating opacity
    this.animation = new Animation( {
      stepEmitter: null, // animation is controlled by the global phet-core timer
      duration: 1.5, // seconds
      easing: Easing.QUARTIC_IN,
      object: this,
      attribute: 'opacity',
      from: 0.75,
      to: 0
    } );

    this.animation.endedEmitter.addListener( function endedListener() {
      self.opacity = 0; // in case it was stopped prematurely
      self.animation.endedEmitter.removeListener( endedListener );
      self.animation = null;
    } );

    this.animation.start();
  }

  /**
   * Stops the animation
   * @public
   */
  stopAnimation() {

    // stop animation if it's already running
    this.animation && this.animation.stop();
    this.opacity = 0;
  }

  /**
   * Hook for changing visibility that can also handle canceling the animation when necessary (since OpacityTo changes visibility).
   * @public
   *
   * @param {boolean} visible
   */
  adjustVisibility( visible ) {
    if ( this.visible && !visible ) {
      this.stopAnimation();
    }

    this.visible = visible;
  }
}

capacitorLabBasics.register( 'CurrentIndicatorNode', CurrentIndicatorNode );

export default CurrentIndicatorNode;
