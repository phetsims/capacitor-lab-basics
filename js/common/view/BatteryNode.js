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
  //var Path = require( 'SCENERY/nodes/Path' ); // keeping until TODO below is resolved.
  //var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var LABEL_FONT = new PhetFont( 12 );
  //var TICK_LENGTH = 16; // keeping these values until the TODO below is resolved.
  //var TICK_LABEL_SPACING = 5;

  // images
  var batteryUpImage = require( 'image!CAPACITOR_LAB_BASICS/battery.png' );
  var batteryDownImage = require( 'image!CAPACITOR_LAB_BASICS/battery_upside-down.png' );

  // strings
  var pattern_0value1units = require( 'string!CAPACITOR_LAB_BASICS/pattern.0value.1units' );
  var unitsVoltsString = require( 'string!CAPACITOR_LAB_BASICS/units.volts' );

  /**
   * Ticks for the slider on the BatteryNode.  This is used instead of HSlider ticks because these ticks need to be
   * on the side of the slider opposite of what HSlider supports.  If HSlider is ever changed to support more freedom
   * of tick position, this can be removed.
   *
   * TODO: It was decided that the slider can be rotated so that normal HSlider ticks can beused.  But this means
   * that the slider tick labels are hidden in the specular lighting of the battery.  Keeping this function in case
   * the slider needs to be rotated again. See issue #15
   *
   * @param {number} voltage
   * @param {Vector2} startPoint starting point of tick.  Tick will extend vertically down from here.
   * @constructor
   */
  //function BatteryTickNode( voltage, startPoint ) {
  //  Node.call( this ); // supertype constructor
  //
  //   add the tick
  //var tick = new Path( new Shape()
  //    .moveToPoint( startPoint )
  //    .lineTo( startPoint.x, startPoint.y + TICK_LENGTH ), {
  //    lineWidth: 2,
  //    stroke: 'black'
  //  }
  //);
  //this.addChild( tick );

  // create the label text.
  //var voltageText = new Text( StringUtils.format( pattern_0value1units, voltage, unitsVoltsString ), { font: LABEL_FONT } );
  //voltageText.rotate( Math.PI / 2 ); // rotate to match rotated slider.
  //this.addChild( voltageText );
  //voltageText.centerX = tick.centerX;
  //voltageText.top = tick.bottom + TICK_LABEL_SPACING;
  //}

  //inherit( Node, BatteryTickNode );

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
    var imageNode = new Image( batteryUpImage, { scale: 0.30 } );
    this.addChild( imageNode );

    // voltage slider
    var trackLength = 0.55 * imageNode.bounds.height;
    var sliderNode = new HSlider( battery.voltageProperty, voltageRange, {
      trackSize: new Dimension2( trackLength, 8 ),
      thumbSize: new Dimension2( 20, 35 ),
      majorTickLength: 18,
      endDrag: function() {
        if ( Math.abs( battery.voltage ) < CLConstants.BATTERY_VOLTAGE_SNAP_TO_ZERO_THRESHOLD ) {
          battery.voltage = 0;
        }
      }
    } );

    // function to create the tick mark labels using a string pattern.
    var createTickLabels = function( value, textFill ) {
      var labelText = new Text( StringUtils.format( pattern_0value1units, value, unitsVoltsString ), {
        font: LABEL_FONT,
        fill: textFill
      } );
      labelText.rotate( Math.PI / 2 ); // rotate label to match rotation of the slider.
      return labelText;
    };
    // add the tick marks
    sliderNode.addMajorTick( voltageRange.max, createTickLabels( voltageRange.max, 'black' ) );
    sliderNode.addMajorTick( voltageRange.defaultValue, createTickLabels( voltageRange.defaultValue, 'white' ) );
    sliderNode.addMajorTick( voltageRange.min, createTickLabels( voltageRange.min, 'white' ) );

    // keeping until the TODO above is resolved.
    //var batteryTicks = [
    //  new BatteryTickNode( voltageRange.max, sliderNode.rightCenter ),
    //  new BatteryTickNode( voltageRange.defaultValue, sliderNode.center ),
    //  new BatteryTickNode( voltageRange.min, sliderNode.leftCenter )
    //];
    //batteryTicks.forEach( function( tick ) {
    //  sliderNode.addChild( tick );
    //  tick.moveToBack(); // Move the tick behind the slider so the thumb is above it.
    //} );
    //sliderNode.rotate( -Math.PI / 2 );

    sliderNode.rotate( -Math.PI / 2 );
    this.addChild( sliderNode );

    // layout, set by visual inspection, depends on battery image.
    sliderNode.center = new Vector2( imageNode.center.x + 5, imageNode.center.y + 12 ); // sort of centered.

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