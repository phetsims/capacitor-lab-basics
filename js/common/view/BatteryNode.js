// Copyright 2002-2015, University of Colorado Boulder

/**
 * Visual representation of a DC battery, with a control for setting its voltage. Image flips when the polarity of the
 * voltage changes. Origin is at center of this node's bounding rectangle.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );
  var HSlider = require( 'SUN/HSlider' );
  var CLConstants = require( 'CAPACITOR_LAB_BASICS/common/CLConstants' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var Vector2 = require( 'DOT/Vector2' );
  // constants
  var LABEL_FONT = new PhetFont( 12 );
  var TICK_LENGTH = 16;
  var TICK_LABEL_SPACING = 5;

  // images
  var batteryUpImage = require( 'image!CAPACITOR_LAB_BASICS/battery_3D_up.png' );
  var batteryDownImage = require( 'image!CAPACITOR_LAB_BASICS/battery_3D_down.png' );
  var sliderKnobImage = require( 'image!CAPACITOR_LAB_BASICS/sliderKnob.png' );
  var sliderKnobHighlightImage = require( 'image!CAPACITOR_LAB_BASICS/sliderKnobHighlight.png' );

  // strings
  var pattern_0value1units = require( 'string!CAPACITOR_LAB_BASICS/pattern.0value.1units' );
  var unitsVoltsString = require( 'string!CAPACITOR_LAB_BASICS/units.volts' );

  /**
   * ThumbNode for the BatteryNode slider.
   *
   * @constructor
   */
  function ThumbNode() {
    var thumbNode = new Image( sliderKnobImage );
    Node.call( this, { touchArea: thumbNode.bounds.dilated( 15 ), mouseArea: thumbNode.bounds } );
    this.addChild( thumbNode );

    // highlight thumb on pointer over
    this.addInputListener( new ButtonListener( {
      over: function( event ) {
        thumbNode.image = sliderKnobHighlightImage;
      },
      up: function( event ) {
        thumbNode.image = sliderKnobImage;
      }
    } ) );
    this.rotate( -Math.PI / 2 ); // Rotate node to match rotated slider
  }

  inherit( Node, ThumbNode );

  /**
   * Ticks for the slider on the BatteryNode.  This is used instead of HSlider ticks because these ticks need to be
   * on the side of the slider opposite of what HSlider supports.  If HSlider is ever changed to support more freedom
   * of tick position, this can be removed.
   *
   * @param {number} voltage
   * @param {Vector2} startPoint starting point of tick.  Tick will extend vertically down from here.
   * @constructor
   */
  function BatteryTickNode( voltage, startPoint ) {
    Node.call( this ); // supertype constructor

    // add the tick
    var tick = new Path( new Shape()
        .moveToPoint( startPoint )
        .lineTo( startPoint.x, startPoint.y + TICK_LENGTH ), {
        lineWidth: 2,
        stroke: 'black'
      }
    );
    this.addChild( tick );

    // create the label text.
    var voltageText = new Text( StringUtils.format( pattern_0value1units, voltage, unitsVoltsString ), { font: LABEL_FONT } );
    voltageText.rotate( Math.PI / 2 ); // rotate to match rotated slider.
    this.addChild( voltageText );
    voltageText.centerX = tick.centerX;
    voltageText.top = tick.bottom + TICK_LABEL_SPACING;
  }

  inherit( Node, BatteryTickNode );

  /**
   * Constructor for a BatteryNode.
   *
   * @param {Battery} battery
   * @param {Range} voltageRange
   * @constructor
   */
  function BatteryNode( battery, voltageRange ) {

    Node.call( this );

    // battery image, scaled to match model dimensions
    var imageNode = new Image( batteryUpImage );
    this.addChild( imageNode );

    // voltage slider
    var trackLength = 0.60 * imageNode.bounds.height;
    var sliderNode = new HSlider( battery.voltageProperty, voltageRange, {
      trackSize: new Dimension2( trackLength, 1 ),
      thumbNode: new ThumbNode(),
      endDrag: function() {
        if ( Math.abs( battery.voltage ) < CLConstants.BATTERY_VOLTAGE_SNAP_TO_ZERO_THRESHOLD ) {
          battery.voltage = 0;
        }
      }
    } );
    var batteryTicks = [
      new BatteryTickNode( voltageRange.max, sliderNode.rightCenter ),
      new BatteryTickNode( voltageRange.defaultValue, sliderNode.center ),
      new BatteryTickNode( voltageRange.min, sliderNode.leftCenter )
    ];
    batteryTicks.forEach( function( tick ) {
      sliderNode.addChild( tick );
      tick.moveToBack(); // Move the tick behind the slider so the thumb is above it.
    } );
    sliderNode.rotate( -Math.PI / 2 );
    this.addChild( sliderNode );

    // layout, set by visual inspection, depends on images.
    sliderNode.center = new Vector2( imageNode.center.x - 10, imageNode.center.y + 15 ); // sort of centered.

    // when battery polarity changes, change the battery image
    battery.polarityProperty.link( function( polarity ) {
      if ( polarity === CLConstants.POLARITY.POSITIVE ) {
        imageNode.image = batteryUpImage;
      }
      else {
        imageNode.image = batteryDownImage;
      }
    } );

  }

  return inherit( Node, BatteryNode, {} );

} );