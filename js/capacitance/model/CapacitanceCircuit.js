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
     * Gets the voltage at a shape, with respect to ground. Returns null if the
     * Shape is not connected to the circuit.
     * @public
     *
     * @param {Shape} shape - object whose bounds are checked for contact/intersection with the thing being measured
     * @returns {number} voltage
     * @override
     */
    getVoltageAt: function( shape ) {
      var voltage = null;

      // Closed circuit (battery to capacitor)
      if ( this.circuitConnectionProperty.value === CircuitConnectionEnum.BATTERY_CONNECTED ) {
        if ( this.connectedToBatteryTop( shape ) ) {
          voltage = this.getTotalVoltage();
        }
        else if ( this.connectedToBatteryBottom( shape ) ) {
          voltage = 0;
        }
        else if (
          this.shapeTouchesWireGroup( shape, this.topLightBulbWires ) ||
          this.shapeTouchesWireGroup( shape, this.bottomLightBulbWires ) ) {
          voltage = 0;
        }
      }

      // Open Circuit
      else if ( this.circuitConnectionProperty.value === CircuitConnectionEnum.OPEN_CIRCUIT ) {
        if ( this.connectedToDisconnectedCapacitorTop( shape ) ) {
          voltage = this.getCapacitorPlateVoltage();
        }
        else if ( this.connectedToDisconnectedCapacitorBottom( shape ) ) {
          voltage = 0;
        }
        else if ( this.connectedToBatteryTop( shape ) ) {
          voltage = this.getTotalVoltage();
        }
        else if ( this.connectedToBatteryBottom( shape ) ) {
          voltage = 0;
        }
        else if (
          this.shapeTouchesWireGroup( shape, this.topLightBulbWires ) ||
          this.shapeTouchesWireGroup( shape, this.bottomLightBulbWires ) ) {
          voltage = 0;
        }
      }

      // On switch drag, provide a voltage readout if probes are connected to the battery
      else if ( this.circuitConnectionProperty.value === CircuitConnectionEnum.IN_TRANSIT ) {
        if ( this.connectedToBatteryTop( shape ) ) {
          voltage = this.getTotalVoltage();
        }
        else if ( this.connectedToBatteryBottom( shape ) ) {
          voltage = 0;
        }
        else if ( this.connectedToDisconnectedCapacitorTop( shape ) ) {
          voltage = this.getCapacitorPlateVoltage();
        }
        else if ( this.connectedToDisconnectedCapacitorBottom( shape ) ) {
          voltage = 0;
        }
      }

      // Error case
      else {
        assert && assert( false,
          'Unsupported circuit connection property value: ' + this.circuitConnectionProperty.get() );
      }

      return voltage;
    }
  } );
} );
