// Copyright 2016-2021, University of Colorado Boulder

/**
 * BarMeterNode subclass that implements a custom setValue method
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import capacitorLabBasics from '../../../capacitorLabBasics.js';
import CLBConstants from '../../CLBConstants.js';
import BarMeterNode from './BarMeterNode.js';

class PlateChargeBarMeterNode extends BarMeterNode {
  /**
   * @param {BarMeter} meter
   * @param {string} barColor - fill color of the BarMeter
   * @param {number} maxValue - model value at which the bar has max length
   * @param {string} unitsString - string representing units
   * @param {string} titleString - title string for the bar graph
   * @param {Tandem} tandem
   */
  constructor( meter, barColor, maxValue, unitsString, titleString, tandem ) {
    super( meter, barColor, maxValue, unitsString, titleString, tandem );
  }


  /**
   * This meter displays absolute value, and changes color to indicate positive or negative charge.
   *
   * @param {number} value
   * @public
   * @override
   */
  setValue( value ) {
    super.setValue( Math.abs( value ) );
    this.setBarColor( ( value >= 0 ) ? CLBConstants.POSITIVE_CHARGE_COLOR : CLBConstants.NEGATIVE_CHARGE_COLOR );
  }
}

capacitorLabBasics.register( 'PlateChargeBarMeterNode', PlateChargeBarMeterNode );

export default PlateChargeBarMeterNode;