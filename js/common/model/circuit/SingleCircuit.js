// Copyright 2002-2015, University of Colorado Boulder

/**
 * Model of a circuit with a battery (B) connected to a single capacitor (C1).  This is treated as a special case of a
 * parallel circuit, with some added features.
 *
 * |-----|
 * |     |
 * B    C1
 * |     |
 * |-----|
 *
 * Variable names used in this implementation where chosen to match the specification in the design document, and
 * therefore violate Java naming conventions.
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

  /**
   * Constructor for the Single Capacitor Circuit.
   *
   * @param {CircuitConfig} config
   * @constructor
   */
  function SingleCircuit( config ) {

    ParallelCircuit.call( this, config, 1 /* numberOfCapacitors */, 0 /* numberOfLightBulbs */ );

    this.capacitor = this.capacitors[ 0 ];
  }

  return inherit( ParallelCircuit, SingleCircuit, {

    /**
     * Updates the plate voltage, depending on whether the battery is connected. Null check required because superclass
     * calls this method from its constructor. Remember to call this method at the end of this class' constructor.
     *
     * TODO: Edit the documentation here, call at end of constructor is probably unnecessary.
     */
    updatePlateVoltages: function() {
      if ( this.circuitConnectionProperty !== undefined ) {
        if ( this.circuitConnection === CircuitConnectionEnum.BATTERY_CONNECTED ) {
          this.capacitor.platesVoltage = this.battery.voltage;
        }
      }
    },

    /**
     * Normally the total voltage is equivalent to the battery voltage. But disconnecting the battery changes how we
     * compute total voltage, so override this method.
     *
     * @return {number}
     */
    getTotalVoltage: function() {
      if ( this.circuitConnection === CircuitConnectionEnum.BATTERY_CONNECTED ) {
        return ParallelCircuit.prototype.getTotalVoltage.call( this );
      }
    },

    /**
     * Gets the voltage at a shape, with respect to ground. Returns Number.NaN if the Shape is not connected to the
     * circuit.
     *
     * @param {Shape} shape
     * @return {number}
     */
    getVoltageAt: function( shape ) {
      var voltage = Number.NaN;
      if ( this.circuitConnection !== CircuitConnectionEnum.OPEN_CIRCUIT ) {
        voltage = ParallelCircuit.prototype.getVoltageAt.call( this, shape );
      }
      else {
        if ( this.intersectsSomeTopPlate( shape ) ) {
          voltage = this.getTotalVoltage();
        }
        else if ( this.intersectsSomeBottomPlate( shape ) ) {
          voltage = 0;
        }
      }
      return voltage;
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