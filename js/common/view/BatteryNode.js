// Copyright 2014-2019, University of Colorado Boulder

/**
 * Visual representation of a DC battery, with a control for setting its voltage. Image flips when the polarity of the
 * voltage changes. Origin is at center of this node's bounding rectangle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BatteryGraphicNode = require( 'CAPACITOR_LAB_BASICS/common/view/BatteryGraphicNode' );
  const capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  const CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );
  const VSlider = require( 'SUN/VSlider' );

  // constants
  var LABEL_FONT = new PhetFont( 12 );

  // strings
  const voltsPatternString = require( 'string!CAPACITOR_LAB_BASICS/voltsPattern' );

  /**
   * @constructor
   *
   * @param {Battery} battery
   * @param {RangeWithValue} voltageRange
   * @param {Tandem} tandem
   */
  function BatteryNode( battery, voltageRange, tandem ) {

    Node.call( this, { tandem: tandem } );

    // battery image, scaled to match model dimensions
    var graphicNode = new Node( {
      scale: 0.30,
      children: [ BatteryGraphicNode.POSITIVE_UP ]
    } );
    this.addChild( graphicNode );

    // voltage slider
    var trackLength = 0.55 * graphicNode.bounds.height;
    var sliderNode = new VSlider( battery.voltageProperty, voltageRange, {
      trackSize: new Dimension2( trackLength, 8 ),
      thumbSize: new Dimension2( 20, 35 ),
      thumbTouchAreaXDilation: 11,
      thumbTouchAreaYDilation: 11,
      majorTickLength: 18,
      thumbFill: 'rgb(255,237,53)',
      thumbFillHighlighted: 'rgb(71,207,255)', // same as default
      thumbStroke: 'rgb(191,191,191)',
      thumbLineWidth: 2,
      thumbCenterLineStroke: 'black',
      constrainValue: function( value ) {
        // Round to nearest 0.05, see https://github.com/phetsims/capacitor-lab-basics/issues/227
        return Util.roundSymmetric( value * 20 ) / 20;
      },
      endDrag: function() {
        if ( Math.abs( battery.voltageProperty.value ) < CLBConstants.BATTERY_VOLTAGE_SNAP_TO_ZERO_THRESHOLD ) {
          battery.voltageProperty.value = 0;
        }
      },
      tandem: tandem.createTandem( 'sliderNode' )
    } );

    // function to create the tick mark labels using a string pattern.
    var createTickLabel = function( value, textFill, tandem ) {
      var labelText = new Text( StringUtils.fillIn( voltsPatternString, { value: value } ), {
        font: LABEL_FONT,
        fill: textFill,
        cursor: 'arrow',
        maxWidth: graphicNode.width * 0.3,
        tandem: tandem
      } );
      return labelText;
    };
    // add the tick marks
    var maximumTickLabel = createTickLabel( voltageRange.max, 'black', tandem.createTandem( 'maximumTickLabel' ) );
    var defaultTickLabel = createTickLabel( voltageRange.defaultValue, 'white', tandem.createTandem( 'defaultTickLabel' ) );
    var minimumTickLabel = createTickLabel( voltageRange.min, 'white', tandem.createTandem( 'minimumTickLabel' ) );
    sliderNode.addMajorTick( voltageRange.max, maximumTickLabel );
    sliderNode.addMajorTick( voltageRange.defaultValue, defaultTickLabel );
    sliderNode.addMajorTick( voltageRange.min, minimumTickLabel );

    this.addChild( sliderNode );

    // layout, set by visual inspection, depends on battery image.
    sliderNode.center = new Vector2( graphicNode.center.x + 5, graphicNode.center.y + 12 ); // sort of centered.

    // when battery polarity changes, change the battery image
    battery.polarityProperty.link( function( polarity ) {
      if ( polarity === CLBConstants.POLARITY.POSITIVE ) {
        graphicNode.children = [ BatteryGraphicNode.POSITIVE_UP ];
        minimumTickLabel.fill = 'white';
        maximumTickLabel.fill = 'black';
      }
      else {
        graphicNode.children = [ BatteryGraphicNode.POSITIVE_DOWN ];
        minimumTickLabel.fill = 'black';
        maximumTickLabel.fill = 'white';
      }
    } );
  }

  capacitorLabBasics.register( 'BatteryNode', BatteryNode );

  return inherit( Node, BatteryNode, {} );
} );