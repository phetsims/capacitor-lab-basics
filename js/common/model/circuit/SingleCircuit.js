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
 * Unlike other circuits in this simulation, the battery can be disconnected.  When the battery is disconnected, plate
 * charge can be controlled directly.
 *
 * This circuit is used in all 3 modules.  In version 1.00, it was the sole circuit in the simulation. It was heavily
 * refactored to support the Multiple Capacitors module introduced in version 2.00.
 *
 * Variable names used in this implementation where chosen to match the specification in the design document, and
 * therefore violate Java naming conventions.
 *
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
   * @param {string} circuitConnection
   * @constructor
   */
  function SingleCircuit( config, circuitConnection ) {

    ParallelCircuit.call( this, config, 1 /* numberOfCapacitors */ );
    var thisCircuit = this;

    this.capacitor = this.capacitors[ 0 ];
    this.addProperty( 'circuitConnection', circuitConnection );
    this.addProperty( 'disconnectedPlateCharge', this.getTotalCharge() );

    // Set the plate voltages only when the connected circuit item changes.
    this.disconnectedPlateChargeProperty.link( function() {
      thisCircuit.setDisconnectedPlateVoltage();
    } );

    // Make sure that the charges are correct when the battery is reconnected to the circuit.
    this.circuitConnectionProperty.link( function( circuitConnection ) {
      /*
       * When disconnecting the circuit, set the disconnected plate charge to whatever the total plate charge was with
       * the battery connected.  Need to do this before changing the plate voltages property.
       */
      if ( circuitConnection === CircuitConnectionEnum.OPEN_CIRCUIT ) {
        thisCircuit.setDisconnectedPlateCharge( thisCircuit.getTotalCharge() );
      }
      thisCircuit.updatePlateVoltages();
    } );

    // TODO: Not sure this needs to be called at end of constructor.
    //updatePlateVoltages(); // Must call this at end of constructor!

  }

  return inherit( ParallelCircuit, SingleCircuit, {

    reset: function() {
      //super.reset()
      ParallelCircuit.prototype.reset.call( this ); // TODO: Make sure this is correct and goes all the way to AbstractCircuit.
      this.circuitConnectionProperty.reset();
    },

    /**
     * Updates the plate voltage, depending on whether the battery is connected. Null check required because superclass
     * calls this method from its constructor. Remember to call this method at the end of this class' constructor.
     *
     * TODO: Edit the documentation here, call at end of constructor is probably unnecessary.
     */
    updatePlateVoltages: function() {
      if ( this.circuitConnectionProperty !== undefined ) {
        var V = this.battery.voltage;
        if ( this.circuitConnection === CircuitConnectionEnum.OPEN_CIRCUIT ) {
          V = this.disconnectedPlateCharge / this.capacitor.getTotalCapacitance(); // V = Q/C
        }
        this.capacitor.platesVoltage = V;
      }
    },

    /**
     * Normally the total voltage is equivalent to the battery voltage. But disconnecting the battery changes how we
     * compute total voltage, so override this method.
     *
     * @return {number}
     */
    getTotalVoltage: function() {
      if ( this.circuitConnection !== CircuitConnectionEnum.OPEN_CIRCUIT ) {
        return ParallelCircuit.prototype.getTotalVoltage.call( this );
      }
      else {
        return this.capacitor.platesVoltage;
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
     * Sets the value used for plate charge when the battery is disconnected.
     * (design doc symbol: Q_total)
     *
     * @param {number} disconnectedPlateCharge Coulombs
     */
    setDisconnectedPlateCharge: function( disconnectedPlateCharge ) {
      if ( disconnectedPlateCharge !== this.disconnectedPlateCharge ) {
        this.disconnectedPlateCharge = disconnectedPlateCharge;
        if ( this.circuitConnection === CircuitConnectionEnum.OPEN_CIRCUIT ) {
          this.updatePlateVoltages();
          //this.trigger( 'circuitChanged' );
          //this.fireCircuitChanged(); TODO
        }
      }
    },

    /**
     * Sets the plate voltages, but checks to make sure that th ebattery is disconnected from the circuit.
     */
    setDisconnectedPlateVoltage: function() {
      if ( this.circuitConnection === CircuitConnectionEnum.OPEN_CIRCUIT ) {
        this.updatePlateVoltages();
      }
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