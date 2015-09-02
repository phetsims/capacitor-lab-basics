// Copyright 2002-2015, University of Colorado Boulder

/**
 * Control for applying charge to the capacitor plates.This control is activated when the battery is disconnected.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var HSlider = require( 'SUN/HSlider' );
  var Panel = require( 'SUN/Panel' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Vector2 = require( 'DOT/Vector2' );
  var Shape = require('KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );

  // constants
  // track
  var TRACK_SIZE = new Dimension2( 200, 5 );
  var TRACK_FILL_COLOR = 'lightgray';
  //var TRACK_STROKE_COLOR = 'black';
  var TRACK_LINE_WIDTH = 1;

  // background
  //var BACKGROUND_X_MARGIN = 10;
  //var BACKGROUND_Y_MARGIN = 5;
  //var BACKGROUND_LINE_WIDTH = 1;
  //var BACKGROUND_STROKE_COLOR = 'black';
  //var BACKGROUND_FILL_COLOR = new JPanel().getBackground();

  // knob
  var KNOB_SIZE = new Dimension2( 20, 15 );
  var KNOB_LINE_WIDTH = 1;
  var KNOB_NORMAL_COLOR = 'green';
  var KNOB_HIGHLIGHT_COLOR = 'yellow';
  var KNOB_STROKE_COLOR = 'black';

  // ticks
  //var TICK_MARK_LENGTH = 8;
  //var TICK_MARK_COLOR = TRACK_STROKE_COLOR;
  //var TICK_MARK_STROKE = TRACK_STROKE_COLOR;
  //var TICK_LABEL_X_SPACING = 3;

  // range labels
  var RANGE_LABEL_FONT = new PhetFont( 14 );
  //var RANGE_LABEL_COLOR = 'black';

  // title
  var TITLE_FONT = new PhetFont( { weight: 'bold', size: 16 } );
  //var TITLE_COLOR = 'black';

  // strings
  var plateChargeTopString = require( 'string!CAPACITOR_LAB_BASICS/plateCharge.top' );
  var noneString = require( 'string!CAPACITOR_LAB_BASICS/none' );
  var lotsPlusString = require( 'string!CAPACITOR_LAB_BASICS/lots.plus' );
  var lotsMinusString = require( 'string!CAPACITOR_LAB_BASICS/lots.minus' );

  /**
   * Constructor.  Creates a unique triangular thumb for the control slider that points to the left.
   *
   * @constructor
   */
  function ThumbNode() {

    var thisNode = this;

    var w = KNOB_SIZE.width;
    var h = KNOB_SIZE.height;

    var thumbShape = new Shape()
      .moveTo( 0, 0)
      .lineTo( 0.35 * w, h / 2 )
      .lineTo( w, h / 2 )
      .lineTo( w, -h / 2 )
      .lineTo( 0.35 * w, -h / 2 )
      .close();

    Path.call( this, thumbShape, {
      fill: KNOB_NORMAL_COLOR,
      lineWidth: KNOB_LINE_WIDTH,
      stroke: KNOB_STROKE_COLOR
    } );

    // highlight the arrow on pointer over
    this.addInputListener( new ButtonListener( {
      over: function( event ) {
        thisNode.fill = KNOB_HIGHLIGHT_COLOR;
      },
      up: function( event ) {
        thisNode.fill = KNOB_NORMAL_COLOR;
      }
    } ) );

    // TODO: Redraw the node so this rotation is not necessary.
    this.rotation = Math.PI / 2; // Rotate to compensate for future rotation of the slider.
  }

  inherit( Path, ThumbNode );

  /**
   * Constructor.
   *
   * @param {CapacitanceCircuit} circuit
   * @param {Range} range
   * @constructor
   */
  function PlateChargeControlNode( circuit, range ) {

    Node.call( this );
    this.range = range;

    this.circuit = circuit;

    // TODO
    //circuit.addCircuitChangeListener( new CircuitChangeListener() {
    //  public void circuitChanged() {
    //    if ( !circuit.isBatteryConnected() ) {
    //      update();
    //    }
    //  }
    //} );

    this.sliderNode = new HSlider( circuit.disconnectedPlateChargeProperty, range, {
      trackSize: TRACK_SIZE,
      trackFill: TRACK_FILL_COLOR,
      trackStroke: TRACK_LINE_WIDTH,
      thumbNode: new ThumbNode()
    } ); // @private
    var tickOptions = { font: RANGE_LABEL_FONT, rotation: Math.PI / 2 };
    this.sliderNode.addMajorTick( 0, new Text( noneString, tickOptions) );
    this.sliderNode.addMajorTick( range.min, new Text( lotsMinusString, tickOptions) );
    this.sliderNode.addMajorTick( range.max, new Text( lotsPlusString, tickOptions ) );

    this.sliderNode.rotation = -Math.PI / 2;

    // background, sized to fit around slider
    var backgroundPanel = new Panel( this.sliderNode );

    var titleNode = new Text( plateChargeTopString, { font: TITLE_FONT } );

    // rendering order
    this.addChild( backgroundPanel );
    this.addChild( titleNode );

    // title centered below background
    var x = backgroundPanel.bounds.centerX - ( titleNode.bounds.width / 2 );
    var y = backgroundPanel.bounds.maxY + 20;
    titleNode.translation = new Vector2( x, y );
  }

  return inherit( Node, PlateChargeControlNode, {

    // Updates the control to match the circuit model.
    update: function() {
      //var plateCharge = this.circuit.getDisconnectedPlateCharge();
      // knob location
      //double xOffset = sliderNode.knobNode.getXOffset();
      //double yOffset = sliderNode.trackNode.getFullBoundsReference().getHeight() * ( ( range.getMax() - plateCharge ) / range.getLength() );
      //sliderNode.knobNode.setOffset( xOffset, yOffset );
    }
  } );
} );