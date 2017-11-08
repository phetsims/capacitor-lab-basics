// Copyright 2014-2017, University of Colorado Boulder

/**
 * Visual representation of a DC battery, with a control for setting its voltage. Image flips when the polarity of the
 * voltage changes. Origin is at center of this node's bounding rectangle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg
 * @author Andrew Adare
 */
define( function( require ) {
  'use strict';

  // modules
  var BatteryGraphicNode = require( 'CAPACITOR_LAB_BASICS/common/view/BatteryGraphicNode' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var LABEL_FONT = new PhetFont( 12 );

  // strings
  var pattern0Value1UnitsString = require( 'string!CAPACITOR_LAB_BASICS/pattern.0value.1units' );
  var unitsVoltsString = require( 'string!CAPACITOR_LAB_BASICS/units.volts' );

  /**
   * @constructor
   *
   * @param {Battery} battery
   * @param {RangeWithValue} voltageRange
   * @param {Tandem} tandem
   */
  function BatteryNode( battery, voltageRange, tandem ) {

    Node.call( this );

    // battery image, scaled to match model dimensions
    var graphicNode = new Node( {
      scale: 0.30,
      children: [ BatteryGraphicNode.POSITIVE_UP ]
    } );
    this.addChild( graphicNode );

    // voltage slider
    var trackLength = 0.55 * graphicNode.bounds.height;
    var sliderNode = new HSlider( battery.voltageProperty, voltageRange, {
      trackSize: new Dimension2( trackLength, 8 ),
      thumbSize: new Dimension2( 20, 35 ),
      thumbTouchAreaXDilation: 11,
      thumbTouchAreaYDilation: 11,
      majorTickLength: 18,
      thumbFillEnabled: 'rgb(255,237,53)',
      thumbFillHighlighted: 'rgb(71,207,255)', // same as default
      thumbStroke: 'rgb(191,191,191)',
      thumbLineWidth: 2,
      thumbCenterLineStroke: 'black',
      endDrag: function() {
        if ( Math.abs( battery.voltageProperty.value ) < CLBConstants.BATTERY_VOLTAGE_SNAP_TO_ZERO_THRESHOLD ) {
          battery.voltageProperty.value = 0;
        }
      },
      tandem: tandem.createTandem( 'sliderNode' )
    } );

    // function to create the tick mark labels using a string pattern.
    var createTickLabels = function( value, textFill, tandem ) {
      var labelText = new Text( StringUtils.format( pattern0Value1UnitsString, value, unitsVoltsString ), {
        font: LABEL_FONT,
        fill: textFill,
        cursor: 'arrow',
        maxWidth: graphicNode.width * 0.3,
        tandem: tandem
      } );
      labelText.rotate( Math.PI / 2 ); // rotate label to match rotation of the slider.
      return labelText;
    };
    // add the tick marks
    var maxTick = createTickLabels( voltageRange.max, 'black', tandem.createTandem( 'maximumTickLabel' ) );
    var defaultTick = createTickLabels( voltageRange.defaultValue, 'white', tandem.createTandem( 'defaultTickLabel' ) );
    var minTick = createTickLabels( voltageRange.min, 'white', tandem.createTandem( 'minimumTickLabel' ) );
    sliderNode.addMajorTick( voltageRange.max, maxTick );
    sliderNode.addMajorTick( voltageRange.defaultValue, defaultTick );
    sliderNode.addMajorTick( voltageRange.min, minTick );

    sliderNode.rotate( -Math.PI / 2 );
    this.addChild( sliderNode );

    // layout, set by visual inspection, depends on battery image.
    sliderNode.center = new Vector2( graphicNode.center.x + 5, graphicNode.center.y + 12 ); // sort of centered.

    // when battery polarity changes, change the battery image
    battery.polarityProperty.link( function( polarity ) {
      if ( polarity === CLBConstants.POLARITY.POSITIVE ) {
        graphicNode.children = [ BatteryGraphicNode.POSITIVE_UP ];
        minTick.fill = 'white';
        maxTick.fill = 'black';
      } else {
        graphicNode.children = [ BatteryGraphicNode.POSITIVE_DOWN ];
        minTick.fill = 'black';
        maxTick.fill = 'white';
      }
    } );

    // tandem support
    this.mutate( {
      tandem: tandem
    } );
  }

  capacitorLabBasics.register( 'BatteryNode', BatteryNode );

  return inherit( Node, BatteryNode, {} );
} );