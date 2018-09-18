// Copyright 2018, University of Colorado Boulder

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
define( function( require ) {
  'use strict';

  // modules
  var Animation = require( 'TWIXT/Animation' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var Color = require( 'SCENERY/util/Color' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Easing = require( 'TWIXT/Easing' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MinusNode = require( 'SCENERY_PHET/MinusNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var PlusNode = require( 'SCENERY_PHET/PlusNode' );
  var ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  // arrow properties
  var ARROW_LENGTH = 88;
  var ARROW_HEAD_WIDTH = 30;
  var ARROW_HEAD_HEIGHT = 25;
  var ARROW_TAIL_WIDTH = 0.4 * ARROW_HEAD_WIDTH;
  var ARROW_TIP_LOCATION = new Vector2( 0, 0 ); // origin at the tip
  var ARROW_TAIL_LOCATION = new Vector2( ARROW_LENGTH, 0 );

  // electron properties
  var CHARGE_DIAMETER = 0.8 * ARROW_TAIL_WIDTH;
  var ELECTRON_LINE_WIDTH = 1;
  var CHARGE_STROKE_COLOR = 'black';
  var CHARGE_SYMBOL_COLOR = 'black';
  var CHARGE_SYMBOL_SIZE = new Dimension2( 0.6 * CHARGE_DIAMETER, 0.1 * CHARGE_DIAMETER );

  /**
   * Rotation angles should be set such that +dV/dt indicates current flow towards the positive terminal
   * of the battery.
   * @constructor
   *
   * @param {Property.<number>} currentAmplitudeProperty
   * @param {number} startingOrientation
   * @param {NumberProperty.<number>} positiveOrientationProperty
   * @param {Color} colorProperty
   * @param {Emitter} stepEmitter
   * @param {Tandem} tandem
   */
  function CurrentIndicatorNode( currentAmplitudeProperty, startingOrientation, positiveOrientationProperty, colorProperty, stepEmitter, tandem ) {

    Node.call( this, { opacity: 0 } );
    var self = this;

    // @private {number}
    this.positiveOrientation = positiveOrientationProperty.value;

    // @private {Emitter}
    this.stepEmitter = stepEmitter;

    this.stepEmitter.addListener( function( dt ) {
      self.animation && self.animation.step( dt );
    } );

    var arrowNode = new ArrowNode( ARROW_TAIL_LOCATION.x, ARROW_TAIL_LOCATION.y, ARROW_TIP_LOCATION.x, ARROW_TIP_LOCATION.y, {
      headHeight: ARROW_HEAD_HEIGHT,
      headWidth: ARROW_HEAD_WIDTH,
      tailWidth: ARROW_TAIL_WIDTH,
      fill: colorProperty.value,
      tandem: tandem.createTandem( 'arrowNode' )
    } );

    this.addChild( arrowNode );

    var electronNode = new ShadedSphereNode( CHARGE_DIAMETER, {
      fill: colorProperty.value,
      stroke: CHARGE_STROKE_COLOR,
      lineWidth: ELECTRON_LINE_WIDTH,
      mainColor: colorProperty.value,
      highlightXOffset: 0,
      highlightYOffset: 0
    } );
    this.addChild( electronNode );

    var protonNode = new ShadedSphereNode( CHARGE_DIAMETER, {
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
    var minusNode = new MinusNode( {
      size: CHARGE_SYMBOL_SIZE,
      fill: CHARGE_SYMBOL_COLOR
    } );
    this.addChild( minusNode );

    // Use scenery-phet's plus node because Text("+") can't be accurately centered.
    var plusNode = new PlusNode( {
      size: CHARGE_SYMBOL_SIZE,
      fill: CHARGE_SYMBOL_COLOR,
      visible: !minusNode.visible
    } );
    this.addChild( plusNode );

    // layout
    var x = -arrowNode.bounds.width / 2;
    var y = 0;
    arrowNode.translate( x, y );
    x = arrowNode.bounds.maxX - ( 0.6 * ( arrowNode.bounds.width - ARROW_HEAD_HEIGHT ) );
    y = arrowNode.bounds.centerY;
    electronNode.translate( x, y );
    minusNode.center = electronNode.center;
    protonNode.center = electronNode.center;
    plusNode.center = electronNode.center;

    // @private {Animation|null} animation that will fade out the node
    this.animation = null;

    positiveOrientationProperty.link( function( value ) {
      if ( value === 0 ) {
        colorProperty.set( new Color( 83, 200, 236 ) );
      }
      else if ( value === Math.PI ) {
        colorProperty.set( new Color( PhetColorScheme.RED_COLORBLIND ) );
      }

    } );

    // observe current to determine rotation and opacity
    currentAmplitudeProperty.lazyLink( function( currentAmplitude ) {

      // only start this animation if the current indicator is visible
      if ( self.isVisible() ) {
        self.startAnimation();
      }

      // update the orientation of the indicator
      if ( currentAmplitude > 0 ) {
        self.rotation = startingOrientation + positiveOrientationProperty.value;
        arrowNode.fill = colorProperty.value;
      }
      else if ( currentAmplitude < 0 ) {
        self.rotation = startingOrientation + positiveOrientationProperty.value + Math.PI;
        arrowNode.fill = colorProperty.value;
      }

      // Electron/Proton visibility dependent on orientation of current.
      var chargeVisible = positiveOrientationProperty.value === 0;
      electronNode.visible = chargeVisible;
      minusNode.visible = chargeVisible;
      protonNode.visible = !chargeVisible;
      plusNode.visible = !chargeVisible;
    } );
  }

  capacitorLabBasics.register( 'CurrentIndicatorNode', CurrentIndicatorNode );

  return inherit( Node, CurrentIndicatorNode, {
    /**
     * Start the animation, canceling the animation if it is in progress
     * @public
     */
    startAnimation: function() {
      var self = this;
      this.stopAnimation();

      // show symbol and gradually fade out by modulating opacity
      this.animation = new Animation( {
        stepper: 'manual', // animation is controlled by the global phet-core timer
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
    },

    /**
     * Stops the animation
     * @public
     */
    stopAnimation: function() {

      // stop animation if it's already running
      this.animation && this.animation.stop();
      this.opacity = 0;
    },

    /**
     * Hook for changing visibility that can also handle canceling the animation when necessary (since OpacityTo changes visibility).
     * @public
     *
     * @param {boolean} visible
     */
    adjustVisibility: function( visible ) {
      if ( this.visible && !visible ) {
        this.stopAnimation();
      }

      this.visible = visible;
    }
  } );
} );
