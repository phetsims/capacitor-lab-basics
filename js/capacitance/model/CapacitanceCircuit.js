// Copyright 2015, University of Colorado Boulder

/**
 * Model of a circuit with a battery (B) connected to a single capacitor (C1).  This is treated as a special case of a
 * parallel circuit, with some added features.  The capacitor also has a switch attached to it so that it can be
 * disconnected from the battery.
 *
 * REVIEW: This diagram shows a circuit that is unobtainable in the sim? Switch can't go right if there is no bulb.
 * |-----|
 * |      /
 * B     C
 * |      \
 * |-----|
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ParallelCircuit = require( 'CAPACITOR_LAB_BASICS/common/model/circuit/ParallelCircuit' );
  var CircuitConnectionEnum = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitConnectionEnum' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  /**
   * Constructor for the Single Capacitor Circuit.
   *
   * @param {CircuitConfig} config
   * @param {Tandem} tandem
   * @constructor
   */
  function CapacitanceCircuit( config, tandem ) {

    this.lightBulb = null; // There is no light bulb in the first screen

    ParallelCircuit.call( this, config, tandem );
  }

  capacitorLabBasics.register( 'CapacitanceCircuit', CapacitanceCircuit );

  return inherit( ParallelCircuit, CapacitanceCircuit, {

    /**
     * Updates the plate voltage, depending on whether the battery is connected. Null check required because superclass
     * calls this method from its constructor.
     * REVIEW: visibility doc
     */
    updatePlateVoltages: function() {
      if ( this.circuitConnectionProperty !== undefined ) {
        //REVIEW: These cases are shared with LightBulbCircuit. Can this be factored out?
        if ( this.circuitConnectionProperty.value === CircuitConnectionEnum.BATTERY_CONNECTED ) {
          // if the battery is connected, the voltage is equal to the battery voltage
          this.capacitor.platesVoltageProperty.value = this.battery.voltageProperty.value;
        }
        else {
          // otherwise, the voltage can be found by V=Q/C
          this.capacitor.platesVoltageProperty.value =
            this.disconnectedPlateChargeProperty.value / this.capacitor.getCapacitance();
        }
      }
    },

    /**
     * Get the voltage across the capacitor plates.
     * REVIEW: visibility doc
     *
     * REVIEW: same as LightBulbCircuit's implementation, can we share code?
     *
     * @returns {number}
     */
    getCapacitorPlateVoltage: function() {
      return this.capacitor.platesVoltageProperty.value;
    },

    /**
     * Gets the total charge in the circuit.(design doc symbol: Q_total)
     * REVIEW: visibility doc
     *
     * REVIEW: Same as LightBulbCircuit's getTotalCharge(), should be factored out to a parent type (since all
     * circuits in this sim have one capacitor)
     *
     * @returns {number}
     */
    getTotalCharge: function() {
      return this.capacitor.getPlateCharge();
    }
  } );
} );
