// Copyright 2015, University of Colorado Boulder

/**
 * Model of a circuit with a battery (B) connected to a single capacitor (C1).  This is treated as a special case of a
 * parallel circuit, with some added features.  The capacitor also has a switch attached to it so that it can be
 * disconnected from the battery.
 *
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

    assert && assert( config.numberOfCapacitors === 1,
      'LightBulbCircuit should have 1 Capacitor in CL:B. config.numberOfCapacitors: ' + config.numberOfCapacitors );
    assert && assert( config.numberOfLightBulbs === 0,
      'LightBulbCircuit should have 0 LightBulbs in CL:B. config.numberOfLightBulbs: ' + config.numberOfLightBulbs );

    ParallelCircuit.call( this, config, tandem, {} );

    this.capacitor = this.capacitors[ 0 ]; // @public
  }

  capacitorLabBasics.register( 'CapacitanceCircuit', CapacitanceCircuit );

  return inherit( ParallelCircuit, CapacitanceCircuit, {

    /**
     * Updates the plate voltage, depending on whether the battery is connected. Null check required because superclass
     * calls this method from its constructor.
     */
    updatePlateVoltages: function() {
      if ( this.circuitConnectionProperty !== undefined ) {
        if ( this.circuitConnection === CircuitConnectionEnum.BATTERY_CONNECTED ) {
          // if the battery is connected, the voltage is equal to the battery voltage
          this.capacitor.platesVoltage = this.battery.voltage;
        }
        else {
          // otherwise, the voltage can be found by V=Q/C
          this.capacitor.platesVoltage = this.disconnectedPlateCharge / this.capacitor.getTotalCapacitance();
        }
      }
    },

    getCapacitorPlateVoltage: function() {
      return this.capacitor.platesVoltage;
    },

    /**
     * Gets the total charge in the circuit.(design doc symbol: Q_total)
     *
     * @return {number}
     */
    getTotalCharge: function() {
      return this.capacitor.getTotalPlateCharge();
    }
  } );

} );