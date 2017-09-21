// Copyright 2015-2017, University of Colorado Boulder

/**
 * Model for the "Light Bulb" circuit, which extends ParallelCircuit.  This circuit is composed of a battery, capacitor
 * and a light bulb.  The capacitor is connected to a switch so that it can be connected to either the light bulb OR
 * the battery, but not both at the same time.  The capacitor can also be entirely disconnected from the circuit. This
 * is illustrated in the following diagram:
 *
 * +---+ + +----+
 * |      /     |
 * |     |      |
 * B     C      Z
 * |     |      |
 * |      \     |
 * +---+ + +----+
 *
 * B = Battery
 * C = Capacitor, connected in parallel through switches
 * Z = Light Bulb
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg
 * @author Andrew Adare
 */

define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CircuitLocation = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitLocation' );
  var CircuitState = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitState' );
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
      if ( circuitConnection !== CircuitState.BATTERY_CONNECTED ) {
        self.disconnectedPlateChargeProperty.set( self.getTotalCharge() );
      }
      self.updatePlateVoltages();

      // if light bulb connected, reset values for transient calculations
      if ( circuitConnection === CircuitState.LIGHT_BULB_CONNECTED ) {
        self.capacitor.transientTime = 0;
        self.capacitor.voltageAtSwitchClose = self.capacitor.plateVoltageProperty.value;
      }

    } );
  }

  capacitorLabBasics.register( 'LightBulbCircuit', LightBulbCircuit );

  return inherit( ParallelCircuit, LightBulbCircuit, {

    /**
     * LightBulbCircuit model update function
     * @public
     * @override
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
      if ( this.circuitConnectionProperty.value === CircuitState.LIGHT_BULB_CONNECTED ) {
        if ( Math.abs( this.capacitor.plateVoltageProperty.value ) > MIN_VOLTAGE ) {
          this.capacitor.discharge( this.lightBulb.resistance, dt );
        }

        else {
          this.capacitor.plateVoltageProperty.set( 0 );
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
        if ( this.circuitConnectionProperty.value === CircuitState.BATTERY_CONNECTED ) {
          this.capacitor.plateVoltageProperty.value = this.battery.voltageProperty.value;
        }
        // If circuit is open, use V = Q/C
        else if ( this.circuitConnectionProperty.value === CircuitState.OPEN_CIRCUIT ) {
          this.capacitor.plateVoltageProperty.value =
            this.disconnectedPlateChargeProperty.value / this.capacitor.capacitanceProperty.value;
        }
        // the capacitor is discharging, but plate geometry is changing at the same time so we need
        // to update the parameters of the transient discharge equation parameters
        else if ( this.circuitConnectionProperty.value === CircuitState.LIGHT_BULB_CONNECTED ) {
          this.capacitor.updateDischargeParameters();
        }
      }
    },

    /**
     * Assert that location is either CircuitLocation.LIGHT_BULB_TOP or BOTTOM.
     * @private
     *
     * @param  {CircuitLocation} location
     */
    validateLocation: function( location ) {

      assert && assert( location === CircuitLocation.LIGHT_BULB_TOP || location === CircuitLocation.LIGHT_BULB_BOTTOM,
        'location should be LIGHT_BULB_TOP or LIGHT_BULB_BOTTOM, received ' + location );
    },

    /**
     * True if light bulb is connected to circuit and the probe is electrically
     * contacting the light bulb at the top or bottom, as specified by the
     * location parameter.
     * @public
     *
     * @param {Shape} shape
     * @param {CircuitLocation} location - light bulb top or bottom only
     * @returns {boolean}
     */
    connectedLightBulbContacts: function( probe, location ) {

      this.validateLocation( location );

      // Light bulb must be connected
      if ( this.circuitConnectionProperty.value !== CircuitState.LIGHT_BULB_CONNECTED ) {
        return false;
      }

      var capacitorSide = location === CircuitLocation.LIGHT_BULB_TOP ?
        CircuitLocation.CAPACITOR_TOP : CircuitLocation.CAPACITOR_BOTTOM;

      return (
        this.shapeTouchesWireGroup( probe, location ) ||
        this.shapeTouchesWireGroup( probe, capacitorSide ) ||
        this.capacitor.contacts( probe, capacitorSide ) ||
        this.lightBulb.intersectsBulbBase( probe )
      );
    },

    /**
     * True if light bulb is disconnected from circuit and the probe is electrically
     * contacting the light bulb at the top or bottom, as specified by the
     * location parameter.
     * @public
     *
     * @param {Shape} shape
     * @param {CircuitLocation} location - light bulb top or bottom only
     * @returns {boolean}
     */
    disconnectedLightBulbContacts: function( probe, location ) {

      this.validateLocation( location );

      // Light bulb must be disconnected
      if ( this.circuitConnectionProperty.value === CircuitState.LIGHT_BULB_CONNECTED ) {
        return false;
      }

      return (
        this.shapeTouchesWireGroup( probe, location ) ||
        this.lightBulb.intersectsBulbBase( probe )
      );
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
        if ( this.circuitConnectionProperty.value !== CircuitState.BATTERY_CONNECTED ) {
          this.updatePlateVoltages();
        }
      }
    },

    /**
     * Update the current amplitude depending on the circuit connection.  If the capacitor is connected to the light
     * bulb, find the current by I = V / R.  Otherwise, current is found by dQ/dT.
     * @public
     *
     * @param {number} dt
     */
    updateCurrentAmplitude: function( dt ) {

      // if the circuit is connected to the light bulb, I = V / R
      if ( this.circuitConnectionProperty.value === CircuitState.LIGHT_BULB_CONNECTED ) {
        var current = this.capacitor.plateVoltageProperty.value / this.lightBulb.resistance;

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
