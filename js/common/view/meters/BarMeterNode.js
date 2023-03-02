// Copyright 2014-2023, University of Colorado Boulder

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

import Utils from '../../../../../dot/js/Utils.js';
import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import ArrowNode from '../../../../../scenery-phet/js/ArrowNode.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import { Line, Node, Text } from '../../../../../scenery/js/imports.js';
import capacitorLabBasics from '../../../capacitorLabBasics.js';
import BarNode from './BarNode.js';

// constants
const BASE_LINE_LENGTH = 25; // Length of vertical line at the origin (left end) of the bar
const BAR_STROKE_COLOR = 'black';
const BAR_LINE_WIDTH = 1;
const VALUE_METER_SPACING = 7; // between right side of value text and left side of bar
const VALUE_MAX_WIDTH = 67; // max width of value string for i18n

// value display
const VALUE_FONT = new PhetFont( 16 );
const VALUE_COLOR = 'black';

class BarMeterNode extends Node {
  /**
   * @param {BarMeter} meter
   * @param {string} barColor - fill color of the BarMeter
   * @param {number} maxValue - model value at which the bar has max length
   * @param {string} unitsPattern - string representing units
   * @param {string} titleString - title string for the bar graph
   * @param {Tandem} tandem
   */
  constructor( meter, barColor, maxValue, unitsPattern, titleString, tandem ) {
    super( { tandem: tandem } );

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
    this.valueText = new Text( '', {
      font: VALUE_FONT,
      fill: VALUE_COLOR,
      maxWidth: VALUE_MAX_WIDTH,
      tandem: tandem.createTandem( 'valueText' )
    } );

    // @public {ArrowNode} - arrow node used to indicate when the value has gone beyond the scale of this meter
    this.arrowNode = new ArrowNode( 0, 0, this.barNode.barSize.height + 2, 0, {
      fill: barColor,
      headWidth: this.barNode.barSize.height + 5,
      tailWidth: 12,
      stroke: 'black',
      tandem: tandem.createTandem( 'arrowNode' )
    } );

    this.axisLine.children = [ this.valueText, this.barNode, this.arrowNode ];
    this.addChild( this.axisLine );

    // observers
    meter.valueProperty.link( value => {
      this.setValue( value );
      this.updateArrow();
    } );

    // visibility
    meter.visibleProperty.link( visible => {
      this.visible = visible;
    } );

    this.updateLayout();
  }


  /**
   * Sets the color used to fill the bar and the overload indicator arrow.
   * @public
   *
   * @param {string} color
   */
  setBarColor( color ) {
    this.barNode.fill = color;
    this.arrowNode.fill = color;
  }

  /**
   * Sets the value displayed by the meter.
   * Updates the bar and the value below the meter.
   * @public
   *
   * @param {number} value
   */
  setValue( value ) {

    assert && assert( value >= 0, `value must be >= 0 : ${value}` );

    if ( value !== this.value ) {

      this.value = value;

      // update components
      this.barNode.setValue( value );

      // all meters read in pico units, compensate by multiplying by 10^12
      const meterValue = Utils.toFixed( Math.pow( 10, 12 ) * value, 2 );
      const unitsFormatString = StringUtils.fillIn( this.unitsPattern, { value: meterValue } );
      this.valueText.setString( unitsFormatString );
    }
  }

  /**
   * Update the overload indicator arrow visibility and position.
   * @private
   */
  updateArrow() {
    // update position
    this.arrowNode.left = this.barNode.right + VALUE_METER_SPACING;

    // update visibility
    this.arrowNode.visible = Math.abs( this.meter.valueProperty.get() ) > this.maxValue;
  }

  /**
   * Update the layout
   * @private
   */
  updateLayout() {
    this.barNode.leftCenter = this.axisLine.leftCenter;
    this.valueText.leftCenter = this.axisLine.leftCenter.minusXY( VALUE_MAX_WIDTH, 0 );
  }
}

capacitorLabBasics.register( 'BarMeterNode', BarMeterNode );

export default BarMeterNode;