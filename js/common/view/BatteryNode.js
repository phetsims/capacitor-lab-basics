// Copyright 2014-2015, University of Colorado Boulder

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
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Vector2 = require( 'DOT/Vector2' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  // constants
  var LABEL_FONT = new PhetFont( 12 );

  // images
  var batteryUpImage = require( 'image!CAPACITOR_LAB_BASICS/battery.png' );
  var batteryDownImage = require( 'image!CAPACITOR_LAB_BASICS/battery_upside-down.png' );

  // strings
  var pattern0Value1UnitsString = require( 'string!CAPACITOR_LAB_BASICS/pattern.0value.1units' );
  var unitsVoltsString = require( 'string!CAPACITOR_LAB_BASICS/units.volts' );

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
        if ( Math.abs( battery.voltage ) < CLBConstants.BATTERY_VOLTAGE_SNAP_TO_ZERO_THRESHOLD ) {
          battery.voltage = 0;
        }
      }
    } );

    // function to create the tick mark labels using a string pattern.
    var createTickLabels = function( value, textFill ) {
      var labelText = new Text( StringUtils.format( pattern0Value1UnitsString, value, unitsVoltsString ), {
        font: LABEL_FONT,
        fill: textFill
      } );
      labelText.rotate( Math.PI / 2 ); // rotate label to match rotation of the slider.
      return labelText;
    };
    // add the tick marks
    var maxTick = createTickLabels( voltageRange.max, 'black' );
    var defaultTick = createTickLabels( voltageRange.defaultValue, 'white' );
    var minTick = createTickLabels( voltageRange.min, 'white' );
    sliderNode.addMajorTick( voltageRange.max, maxTick );
    sliderNode.addMajorTick( voltageRange.defaultValue, defaultTick );
    sliderNode.addMajorTick( voltageRange.min, minTick );

    sliderNode.rotate( -Math.PI / 2 );
    this.addChild( sliderNode );

    // layout, set by visual inspection, depends on battery image.
    sliderNode.center = new Vector2( imageNode.center.x + 5, imageNode.center.y + 12 ); // sort of centered.

    // when battery polarity changes, change the battery image
    battery.polarityProperty.link( function( polarity ) {
      if ( polarity === CLBConstants.POLARITY.POSITIVE ) {
        imageNode.image = batteryUpImage;
        minTick.fill = 'white';
        maxTick.fill = 'black';
      }
      else {
        imageNode.image = batteryDownImage;
        minTick.fill = 'black';
        maxTick.fill = 'white';
      }
    } );
  }

  capacitorLabBasics.register( 'BatteryNode', BatteryNode );

  return inherit( Node, BatteryNode, {} );

} );