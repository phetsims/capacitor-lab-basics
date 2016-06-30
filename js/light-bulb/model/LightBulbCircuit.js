// Copyright 2015, University of Colorado Boulder

/**
 * Model for the "Light Bulb" circuit, which extends ParallelCircuit.  This circuit is composed of a battery, capacitor
 * and a light bulb.  The capacitor is connected to a switch so that it can be connected to either the light bulb OR
 * the battery, but not both at the same time.  The capacitor can also be entirely disconnected from the circuit. This
 * is illustrated in the following diagram:
 *
 * |-----|------|
 * |      /     |
 * |     |      |
 * B     C      Z
 * |     |      |
 * |      \     |
 * |-----|------|
 *
 * B = Battery
 * C = Capacitor, connected in parallel through switches
 * Z = Light Bulb
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

  // During exponential voltage drop, circuit voltage crosses this threshold,
  // below which we no longer call discharge() for efficiency.
  var MIN_VOLTAGE = 1e-3; // Volts. Minimum readable value on voltmeter.

  /**
   * Constructor for the Single Capacitor Circuit.
   *
   * @param {CircuitConfig} config
   * @param {Tandem} tandem
   * @constructor
   */
  function LightBulbCircuit( config, tandem ) {

    assert && assert( config.numberOfCapacitors === 1,
      'LightBulbCircuit should have 1 Capacitor in CL:B. config.numberOfCapacitors: ' + config.numberOfCapacitors );
    assert && assert( config.numberOfLightBulbs === 1,
      'LightBulbCircuit should have 1 LightBulb in CL:B. config.numberOfLightBulbs: ' + config.numberOfLightBulbs );

    ParallelCircuit.call( this, config, tandem );
    var thisCircuit = this;

    // @public
    this.capacitor = this.capacitors[ 0 ];
    this.lightBulb = this.lightBulbs[ 0 ];

    // Make sure that the charges are correct when the battery is reconnected to the circuit.
    this.circuitConnectionProperty.link( function( circuitConnection ) {
      /*
       * When disconnecting the battery, set the disconnected plate charge to whatever the total plate charge was with
       * the battery connected.  Need to do this before changing the plate voltages property.
       */
      if ( circuitConnection !== CircuitConnectionEnum.BATTERY_CONNECTED ) {
        thisCircuit.setDisconnectedPlateCharge( thisCircuit.getTotalCharge() );
      }
      thisCircuit.updatePlateVoltages();

      // if light bulb connected, reset values for transient calculations
      if ( circuitConnection === CircuitConnectionEnum.LIGHT_BULB_CONNECTED ) {
        thisCircuit.capacitor.transientTime = 0;
        thisCircuit.capacitor.voltageAtSwitchClose = thisCircuit.capacitor.platesVoltage;
      }

    } );
  }

  capacitorLabBasics.register( 'LightBulbCircuit', LightBulbCircuit );

  return inherit( ParallelCircuit, LightBulbCircuit, {

    step: function( dt ) {

      // Step through common circuit components
      ParallelCircuit.prototype.step.call( this, dt );

      // Discharge the capacitor when it is in parallel with the light bulb,
      // but don't allow the voltage to taper to zero forever.
      // This is both for performance, and for better timing control.
      // The current arrows should start fading when the voltmeter reading drops
      // below MIN_VOLTAGE.
      if ( this.circuitConnection === CircuitConnectionEnum.LIGHT_BULB_CONNECTED ) {
        if ( Math.abs( this.capacitor.platesVoltage ) > MIN_VOLTAGE ) {
          this.capacitor.discharge( this.lightBulb.resistance, dt );
        } else {
          this.capacitor.platesVoltage = 0;
        }
      }

    },

    /**
     * Updates the plate voltage, depending on whether the battery is connected. Null check required because superclass
     * calls this method from its constructor. Remember to call this method at the end of this class' constructor.
     */
    updatePlateVoltages: function() {
      if ( this.circuitConnectionProperty !== undefined ) {
        if ( this.circuitConnection === CircuitConnectionEnum.BATTERY_CONNECTED ) {
          // if the battery is connected, the voltage is equal to the battery voltage
          this.capacitor.platesVoltage = this.battery.voltage;
        } else if ( this.circuitConnection === CircuitConnectionEnum.OPEN_CIRCUIT ) {
          // otherwise, the voltage can be found by V=Q/C
          this.capacitor.platesVoltage = this.disconnectedPlateCharge / this.capacitor.getTotalCapacitance();
        } else if ( this.circuitConnection === CircuitConnectionEnum.LIGHT_BULB_CONNECTED ) {
          // the capacitor is discharging, but plate geometry is changing at the same time so we need
          // to update the parameters of the transient discharge equation parameters
          this.capacitor.updateDischargeParameters();
        }
      }
    },

    getCapacitorPlateVoltage: function() {
      return this.capacitor.platesVoltage;
    },

    /**
     * Gets the voltage at a shape, with respect to ground. Returns null if the
     * Shape is not connected to the circuit.
     *
     * @param {Shape} shape
     * @return {number}
     * @override
     */
    getVoltageAt: function( shape ) {
      var voltage = null;

      if ( this.connectedToLightBulbTop( shape ) ) {
        voltage = this.getCapacitorPlateVoltage();
      } else if ( this.connectedToLightBulbBottom( shape ) ) {
        voltage = 0;
      } else if ( this.connectedToBatteryTop( shape ) ) {
        voltage = this.getTotalVoltage();
      } else if ( this.connectedToBatteryBottom( shape ) ) {
        voltage = 0;
      }

      return voltage;
    },

    connectedToLightBulbTop: function( shape ) {

      var intersectsTopWires = false;
      var topLightBulbWires = this.getTopLightBulbWires();
      var topCapacitorWires = this.getTopCapacitorWires();
      var topSwitchWires = this.getTopSwitchWires();

      var topWires = [];
      topWires = topWires.concat( topLightBulbWires );
      topWires = topWires.concat( topCapacitorWires );
      topWires = topWires.concat( topSwitchWires );

      topWires.forEach( function( topWire ) {
        if ( topWire.shape.intersectsBounds( shape.bounds ) ) {
          intersectsTopWires = true;
        }
      } );

      // does the shape intersect a top plate?
      var intersectsSomeTopPlate = this.intersectsSomeTopPlate( shape );

      // does the shape intersect the light bulb base?
      var intersectsBulbBase = this.lightBulb.intersectsBulbBase( shape );

      return intersectsBulbBase || intersectsSomeTopPlate || intersectsTopWires;

    },

    /**
     * Determine if the shape is connected to the top of the lightbulb when it
     * is disconnected from the circuit.
     * @param  {Shape} shape - shape of the element connected to the light bulb
     * @return {boolean}
     */
    connectedToDisconnectedLightBulbTop: function( shape ) {

      var intersectsTopWires = false;
      var topLightBulbWires = this.getTopLightBulbWires();

      var intersectsBulbBase = this.lightBulb.intersectsBulbBase( shape );

      topLightBulbWires.forEach( function( bottomWire ) {
        if ( bottomWire.shape.intersectsBounds( shape.bounds ) ) {
          intersectsTopWires = true;
        }
      } );

      var disconnected = !( this.circuitConnectionProperty.value === CircuitConnectionEnum.LIGHT_BULB_CONNECTED );
      return ( intersectsBulbBase || intersectsTopWires  ) && disconnected;
    },

    /**
     * Determine if the shape is connected to the bottom of the lightbulb when it
     * is disconnected from the circuit.
     * @param  {Shape} shape - shape of the element connected to the light bulb
     * @return {boolean}
     */
    connectedToDisconnectedLightBulbBottom: function( shape ) {

      var intersectsBottomWires = false;
      var bottomLightBulbWires = this.getBottomLightBulbWires();

      bottomLightBulbWires.forEach( function( bottomWire ) {
        if ( bottomWire.shape.intersectsBounds( shape.bounds ) ) {
          intersectsBottomWires = true;
        }
      } );

      var disconnected = !( this.circuitConnectionProperty.value === CircuitConnectionEnum.LIGHT_BULB_CONNECTED );
      return intersectsBottomWires && disconnected;
    },

    connectedToLightBulbBottom: function( shape ) {

      var intersectsBottomWires = false;
      var bottomLightBulbWires = this.getBottomLightBulbWires();
      var bottomCapacitorWires = this.getBottomCapacitorWires();
      var bottomSwitchWires = this.getBottomSwitchWires();

      var bottomWires = [];
      bottomWires = bottomWires.concat( bottomLightBulbWires );
      bottomWires = bottomWires.concat( bottomCapacitorWires );
      bottomWires = bottomWires.concat( bottomSwitchWires );

      // does the shape intersect the light bulb base?
      var intersectsBulbBase = this.lightBulb.intersectsBulbBase( shape );

      bottomWires.forEach( function( bottomWire ) {
        if ( bottomWire.shape.intersectsBounds( shape.bounds ) ) {
          intersectsBottomWires = true;
        }
      } );

      var intersectsSomeBottomPlate = this.intersectsSomeBottomPlate( shape );

      return intersectsBottomWires || intersectsSomeBottomPlate || intersectsBulbBase;

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
        if ( this.circuitConnection !== CircuitConnectionEnum.BATTERY_CONNECTED ) {
          this.updatePlateVoltages();
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
    },

    /**
     * Update the current amplitude depending on the circuit connection.  If the capacitor is connected to the light
     * bulb, find the current by I = V / R.  Otherwise, current is found by dQ/dT.
     *
     * @param  {number} dt
     */
    updateCurrentAmplitude: function( dt ) {

      // if the circuit is connected to the light bulb, I = V / R
      if ( this.circuitConnectionProperty.value === CircuitConnectionEnum.LIGHT_BULB_CONNECTED ) {
        var current = this.capacitor.platesVoltage / this.lightBulb.resistance;
        if ( Math.abs( current ) < 2 * MIN_VOLTAGE / this.lightBulb.resistance ) {
          current = 0;
        }
        this.currentAmplitudeProperty.set( current );
      } else {
        // otherise, I = dQ/dT
        ParallelCircuit.prototype.updateCurrentAmplitude.call( this, dt );
      }
    }

  } );

} );
