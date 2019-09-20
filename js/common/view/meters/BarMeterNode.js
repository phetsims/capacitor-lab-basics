// Copyright 2014-2019, University of Colorado Boulder

/**
 * Abstract base class for all bar meter nodes.
 * Origin is at the center-left of the vertical track at the base of the bar.
 *
 * The bar meter node is composed of a rectangular bar graph and a value node.
 * The composite parts are added to layout boxes in the BarMeterPanel so that
 * alignment can be perfectly set.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const BarNode = require( 'CAPACITOR_LAB_BASICS/common/view/meters/BarNode' );
  const capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );

  // constants
  const BASE_LINE_LENGTH = 25; // Length of vertical line at the origin (left end) of the bar
  const BAR_STROKE_COLOR = 'black';
  const BAR_LINE_WIDTH = 1;
  const VALUE_METER_SPACING = 7; // between right side of value text and left side of bar
  const VALUE_MAX_WIDTH = 67; // max width of value string for i18n

  // value display
  const VALUE_FONT = new PhetFont( 16 );
  const VALUE_COLOR = 'black';

  /**
   * @constructor
   *
   * @param {BarMeter} meter
   * @param {string} barColor - fill color of the BarMeter
   * @param {number} maxValue - model value at which the bar has max length
   * @param {string} unitsPattern - string representing units
   * @param {string} titleString - title string for the bar graph
   * @param {Tandem} tandem
   */
  function BarMeterNode( meter, barColor, maxValue, unitsPattern, titleString, tandem ) {

    const self = this;

    // @public {number}
    this.maxValue = maxValue;

    // @private {BarMeter}
    this.meter = meter;

    // @private {string}
    this.unitsPattern = unitsPattern;

    // @public {string}
    this.titleString = titleString;

    // @private {Line} - vertical line that represents the base of this bar meter
    this.axisLine = new Line( 0, -BASE_LINE_LENGTH / 2, 0, BASE_LINE_LENGTH / 2, {
      stroke: BAR_STROKE_COLOR,
      lineWidth: BAR_LINE_WIDTH
    } );

    // @private {BarNode} - bar node which represents the magnitude of the meter
    this.barNode = new BarNode( barColor, meter.valueProperty.get(), this.maxValue );

    // @public {Text} - value with hundredths precision and units, set in setValue()
    this.valueTextNode = new Text( '', {
      font: VALUE_FONT,
      fill: VALUE_COLOR,
      maxWidth: VALUE_MAX_WIDTH,
      tandem: tandem.createTandem( 'valueTextNode' )
    } );

    // @public {ArrowNode} - arrow node used to indicate when the value has gone beyond the scale of this meter
    this.arrowNode = new ArrowNode( 0, 0, this.barNode.barSize.height + 2, 0, {
      fill: barColor,
      headWidth: this.barNode.barSize.height + 5,
      tailWidth: 12,
      stroke: 'black',
      tandem: tandem.createTandem( 'arrowNode' )
    } );

    Node.call( this, { tandem: tandem } );
    this.axisLine.children = [ this.valueTextNode, this.barNode, this.arrowNode ];
    this.addChild( this.axisLine );

    // observers
    meter.valueProperty.link( function( value ) {
      self.setValue( value );
      self.updateArrow();
    } );

    // visibility
    meter.visibleProperty.link( function( visible ) {
      self.visible = visible;
    } );

    this.updateLayout();
  }

  capacitorLabBasics.register( 'BarMeterNode', BarMeterNode );

  return inherit( Node, BarMeterNode, {

    /**
     * Sets the color used to fill the bar and the overload indicator arrow.
     * @public
     *
     * @param {string} color
     */
    setBarColor: function( color ) {
      this.barNode.fill = color;
      this.arrowNode.fill = color;
    },

    /**
     * Sets the value displayed by the meter.
     * Updates the bar and the value below the meter.
     * @public
     *
     * @param {number} value
     */
    setValue: function( value ) {

      assert && assert( value >= 0, 'value must be >= 0 : ' + value );

      if ( value !== this.value ) {

        this.value = value;

        // update components
        this.barNode.setValue( value );

        // all meters read in pico units, compensate by multiplying by 10^12
        const meterValue = Util.toFixed( Math.pow( 10, 12 ) * value, 2 );
        const unitsFormatString = StringUtils.fillIn( this.unitsPattern, { value: meterValue } );
        this.valueTextNode.setText( unitsFormatString );
      }
    },

    /**
     * Update the overload indicator arrow visibility and position.
     * @private
     */
    updateArrow: function() {
      // update position
      this.arrowNode.left = this.barNode.right + VALUE_METER_SPACING;

      // update visibility
      this.arrowNode.visible = Math.abs( this.meter.valueProperty.get() ) > this.maxValue;
    },

    /**
     * Update the layout
     * @private
     */
    updateLayout: function() {
      this.barNode.leftCenter = this.axisLine.leftCenter;
      this.valueTextNode.leftCenter = this.axisLine.leftCenter.minusXY( VALUE_MAX_WIDTH, 0 );
    }

  } );
} );
