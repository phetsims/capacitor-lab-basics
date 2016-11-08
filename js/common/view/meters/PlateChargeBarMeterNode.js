// Copyright 2016, University of Colorado Boulder

/**
 *
 * BarMeterNode subclass that implements a custom setValue method
 * @author Jesse Greenberg
 * @author Andrew Adare
 */
define( function( require ) {
  'use strict';

  // modules
  var BarMeterNode = require( 'CAPACITOR_LAB_BASICS/common/view/meters/BarMeterNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  /**
   *
   * @param {BarMeter} meter
   * @param {string} barColor - fill color of the BarMeter
   * @param {number} maxValue - model value at which the bar has max length
   * @param {string} unitsString - string representing units
   * @param {string} titleString - title string for the bar graph
   * @constructor
   */
  function PlateChargeBarMeterNode( meter, barColor, maxValue, unitsString, titleString, tandem ) {
    BarMeterNode.call( this, meter, barColor, maxValue, unitsString, titleString, tandem );
  }

  capacitorLabBasics.register( 'PlateChargeBarMeterNode', PlateChargeBarMeterNode );

  return inherit( BarMeterNode, PlateChargeBarMeterNode, {

    // This meter displays absolute value, and changes color to indicate positive or negative charge.
    setValue: function( value ) {
      BarMeterNode.prototype.setValue.call( this, Math.abs( value ) );
      this.setBarColor( ( value >= 0 ) ? CLBConstants.POSITIVE_CHARGE_COLOR : CLBConstants.NEGATIVE_CHARGE_COLOR );
    }
  } );
} );