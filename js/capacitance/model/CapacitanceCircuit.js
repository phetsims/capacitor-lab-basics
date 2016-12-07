// Copyright 2016, University of Colorado Boulder

/**
 * Model of a circuit with a battery (B) connected to a single capacitor (C1).  This is treated as a special case of a
 * parallel circuit, with some added features.  The capacitor also has a switch attached to it so that it can be
 * disconnected from the battery.
 *
 * |-----+
 * |        /
 * B       C
 * |        \
 * |-----+
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 * @author Andrew Adare
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
     * @public
     */
    updatePlateVoltages: function() {
      if ( this.circuitConnectionProperty !== undefined ) {
        // if the battery is connected, the voltage is equal to the battery voltage
        if ( this.circuitConnectionProperty.value === CircuitConnectionEnum.BATTERY_CONNECTED ) {
          this.capacitor.platesVoltageProperty.value = this.battery.voltageProperty.value;
        }
        // otherwise, the voltage can be found by V=Q/C
        else {
          this.capacitor.platesVoltageProperty.value =
            this.disconnectedPlateChargeProperty.value / this.capacitor.getCapacitance();
        }
      }
    }

  } );
} );
