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
 * @author Andrew Adare
 */

define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CircuitConnectionEnum = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitConnectionEnum' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LightBulb = require( 'CAPACITOR_LAB_BASICS/common/model/LightBulb' );
  var ParallelCircuit = require( 'CAPACITOR_LAB_BASICS/common/model/circuit/ParallelCircuit' );
  var Vector3 = require( 'DOT/Vector3' );

  // During exponential voltage drop, circuit voltage crosses this threshold,
  // below which we no longer call discharge() so I and V don't tail off forever.
  var MIN_VOLTAGE = 1e-3; // Volts. Minimum readable value on voltmeter.

  /**
   * Constructor for the Single Capacitor Circuit.
   *
   * @param {CircuitConfig} config
   * @param {Tandem} tandem
   * @constructor
   */
  function LightBulbCircuit( config, tandem ) {

    var self = this;

    var bulbLocation = new Vector3(
      CLBConstants.BATTERY_LOCATION.x + config.capacitorXSpacing + CLBConstants.LIGHT_BULB_X_SPACING,
      CLBConstants.BATTERY_LOCATION.y + config.capacitorYSpacing,
      CLBConstants.BATTERY_LOCATION.z
    );

    // @public
    this.lightBulb = new LightBulb( bulbLocation, config.modelViewTransform );

    ParallelCircuit.call( this, config, tandem );

    // Make sure that the charges are correct when the battery is reconnected to the circuit.
    this.circuitConnectionProperty.link( function( circuitConnection ) {
      /*
       * When disconnecting the battery, set the disconnected plate charge to whatever the total plate charge was with
       * the battery connected.  Need to do this before changing the plate voltages property.
       */
      if ( circuitConnection !== CircuitConnectionEnum.BATTERY_CONNECTED ) {
        self.disconnectedPlateChargeProperty.set( self.getTotalCharge() );
      }
      self.updatePlateVoltages();

      // if light bulb connected, reset values for transient calculations
      if ( circuitConnection === CircuitConnectionEnum.LIGHT_BULB_CONNECTED ) {
        self.capacitor.transientTime = 0;
        self.capacitor.voltageAtSwitchClose = self.capacitor.platesVoltageProperty.value;
      }

    } );
  }

  capacitorLabBasics.register( 'LightBulbCircuit', LightBulbCircuit );

  return inherit( ParallelCircuit, LightBulbCircuit, {

    /**
     * LightBulbCircuit model update function
     * @public
     *
     * @param  {number} dt time step in seconds
     */
    step: function( dt ) {

      // Step through common circuit components
      ParallelCircuit.prototype.step.call( this, dt );

      // Discharge the capacitor when it is in parallel with the light bulb,
      // but don't allow the voltage to taper to zero forever.
      // This is both for performance, and for better timing control.
      // The current arrows should start fading when the voltmeter reading drops
      // below MIN_VOLTAGE.
      if ( this.circuitConnectionProperty.value === CircuitConnectionEnum.LIGHT_BULB_CONNECTED ) {
        if ( Math.abs( this.capacitor.platesVoltageProperty.value ) > MIN_VOLTAGE ) {
          this.capacitor.discharge( this.lightBulb.resistance, dt );
        }

        else {
          this.capacitor.platesVoltageProperty.set( 0 );
          this.currentAmplitudeProperty.set( 0 );
          this.previousTotalCharge = 0; // This fixes #130
        }
      }

    },

    /**
     * Updates the plate voltage, depending on whether the battery is connected.
     * Null check required because superclass calls this method from its constructor.
     * Remember to call this method at the end of this class' constructor.
     * @public
     */
    updatePlateVoltages: function() {
      // If the battery is connected, the voltage is equal to the battery voltage
      if ( this.circuitConnectionProperty !== undefined ) {
        if ( this.circuitConnectionProperty.value === CircuitConnectionEnum.BATTERY_CONNECTED ) {
          this.capacitor.platesVoltageProperty.value = this.battery.voltageProperty.value;
        }
        // If circuit is open, use V = Q/C
        else if ( this.circuitConnectionProperty.value === CircuitConnectionEnum.OPEN_CIRCUIT ) {
          this.capacitor.platesVoltageProperty.value =
            this.disconnectedPlateChargeProperty.value / this.capacitor.getCapacitance();
        }
        // the capacitor is discharging, but plate geometry is changing at the same time so we need
        // to update the parameters of the transient discharge equation parameters
        else if ( this.circuitConnectionProperty.value === CircuitConnectionEnum.LIGHT_BULB_CONNECTED ) {
          this.capacitor.updateDischargeParameters();
        }
      }
    },

    /**
     * Gets the voltage at a shape, with respect to ground. Returns null if the
     * Shape is not connected to the circuit.
     * @public
     *
     * @param {Shape} shape
     * @returns {number}
     * @override
     */
    getVoltageAt: function( shape ) {
      var voltage = null;

      if ( this.connectedToLightBulbTop( shape ) ) {
        voltage = this.getCapacitorPlateVoltage();
      }
      else if ( this.connectedToLightBulbBottom( shape ) ) {
        voltage = 0;
      }
      else if ( this.connectedToBatteryTop( shape ) ) {
        voltage = this.getTotalVoltage();
      }
      else if ( this.connectedToBatteryBottom( shape ) ) {
        voltage = 0;
      }

      return voltage;
    },

    /**
     * True if shape is touching top of capacitor-to-light bulb circuit
     * @public
     *
     * @param {Shape} shape
     * @returns {boolean}
     */
    connectedToLightBulbTop: function( shape ) {
      var touchesWires = this.shapeTouchesWireGroup( shape, this.topLightBulbWires );
      var touchesPlate = this.capacitor.intersectsTopPlate( shape );
      var touchesBulbBase = this.lightBulb.intersectsBulbBase( shape );

      return touchesBulbBase || touchesPlate || touchesWires;
    },

    /**
     * True if shape is touching bottom of capacitor-to-light bulb circuit
     * @public
     *
     * @param {Shape} shape
     * @returns {boolean}
     */
    connectedToLightBulbBottom: function( shape ) {
      var touchesWires = this.shapeTouchesWireGroup( shape, this.bottomLightBulbWires );
      var touchesPlate = this.capacitor.intersectsBottomPlate( shape );
      var touchesBulbBase = this.lightBulb.intersectsBulbBase( shape );

      return touchesBulbBase || touchesPlate || touchesWires;
    },

    /**
     * Determine if the shape is connected to the top of the lightbulb when it
     * is disconnected from the circuit.
     * @public
     *
     * @param  {Shape} shape - shape of the element connected to the light bulb
     * @returns {boolean}
     */
    connectedToDisconnectedLightBulbTop: function( shape ) {

      // Light bulb must be disconnected
      if ( this.circuitConnectionProperty.value === CircuitConnectionEnum.LIGHT_BULB_CONNECTED ) {
        return false;
      }

      return ( this.shapeTouchesWireGroup( shape, this.topLightBulbWires ) ||
        this.lightBulb.intersectsBulbBase( shape ) );
    },

    /**
     * Determine if the shape is connected to the top of the lightbulb when it
     * is disconnected from the circuit.
     * @public
     *
     * @param  {Shape} shape - shape of the element connected to the light bulb
     * @returns {boolean}
     */
    connectedToDisconnectedLightBulbBottom: function( shape ) {

      // Light bulb must be disconnected
      if ( this.circuitConnectionProperty.value === CircuitConnectionEnum.LIGHT_BULB_CONNECTED ) {
        return false;
      }

      return ( this.shapeTouchesWireGroup( shape, this.bottomLightBulbWires ) ||
        this.lightBulb.intersectsBulbBase( shape ) );
    },

    /**
     * Sets the value used for plate charge when the battery is disconnected.
     * (design doc symbol: Q_total)
     * @public
     *
     * @param {number} disconnectedPlateCharge Coulombs
     */
    setDisconnectedPlateCharge: function( disconnectedPlateCharge ) {
      if ( disconnectedPlateCharge !== this.disconnectedPlateChargeProperty.value ) {
        this.disconnectedPlateChargeProperty.value = disconnectedPlateCharge;
        if ( this.circuitConnectionProperty.value !== CircuitConnectionEnum.BATTERY_CONNECTED ) {
          this.updatePlateVoltages();
        }
      }
    },

    /**
     * Sets the plate voltages, but checks to make sure that th ebattery is disconnected from the circuit.
     * @public
     * REVIEW: Usually setters take a value, would updateDisconnectedPlateVoltage be a more appropriate name?
     */
    setDisconnectedPlateVoltage: function() {
      if ( this.circuitConnectionProperty.value === CircuitConnectionEnum.OPEN_CIRCUIT ) {
        this.updatePlateVoltages();
      }
    },

    /**
     * Update the current amplitude depending on the circuit connection.  If the capacitor is connected to the light
     * bulb, find the current by I = V / R.  Otherwise, current is found by dQ/dT.
     * REVIEW: visibility doc
     *
     * @param {number} dt
     */
    updateCurrentAmplitude: function( dt ) {

      // if the circuit is connected to the light bulb, I = V / R
      if ( this.circuitConnectionProperty.value === CircuitConnectionEnum.LIGHT_BULB_CONNECTED ) {
        var current = this.capacitor.platesVoltageProperty.value / this.lightBulb.resistance;

        // The cutoff is doubled here for #58
        if ( Math.abs( current ) < 2 * MIN_VOLTAGE / this.lightBulb.resistance ) {
          current = 0;
        }

        this.currentAmplitudeProperty.set( current );
      }

      // otherise, I = dQ/dT
      else {
        ParallelCircuit.prototype.updateCurrentAmplitude.call( this, dt );
      }
    }

  } );

} );
