// Copyright 2002-2015, University of Colorado Boulder

/**
 * Base model for all circuits.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Battery = require( 'CAPACITOR_LAB_BASICS/common/model/Battery' );
  var CurrentIndicator = require( 'CAPACITOR_LAB_BASICS/common/model/CurrentIndicator' );
  var CLConstants = require( 'CAPACITOR_LAB_BASICS/common/CLConstants' );
  var CircuitConnectionEnum = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitConnectionEnum' );

  /**
   * Constructor for the AbstractCircuit.
   *
   * @param {CircuitConfig} config circuit configuration values
   * @param {number} numberOfCapacitors number of capacitors in the circuit
   * @param {number} numberOfLightBulbs number of lightBulbs in the circuit
   * @param {function} createCircuitComponents   function for creating cirucit components
   * @param {function} createWires function for creating wires
   * @param {function} createCircuitSwitches function for creating wires
   */
  function AbstractCircuit( config, numberOfCapacitors, numberOfLightBulbs, createCircuitComponents, createWires, createCircuitSwitches ) {

    PropertySet.call( this, {
      currentAmplitude: 0,
      circuitConnection: CircuitConnectionEnum.BATTERY_CONNECTED,
      disconnectedPlateCharge: 0
    } );
    var thisCircuit = this;

    this.previousTotalCharge = -1; // no value, @private

    // create basic circuit components
    // @public
    this.battery = new Battery( config.batteryLocation, CLConstants.BATTERY_VOLTAGE_RANGE.defaultValue, config.modelViewTransform );
    this.circuitComponents = createCircuitComponents( config, numberOfCapacitors, numberOfLightBulbs );
    this.circuitSwitches = createCircuitSwitches( config, numberOfCapacitors, this.circuitConnectionProperty );

    // capture the circuit components into individual arrays.  Note that using slice assumes order of capacitors and
    // then lightbulbs. If new order is important, new method is necessary.
    // @public
    this.capacitors = this.circuitComponents.slice( 0, numberOfCapacitors );
    this.lightBulbs = this.circuitComponents.slice( numberOfCapacitors, numberOfLightBulbs + 1 );

    // TODO: Replace this.lightBulbs[0] with the single lightBulb.
    // TODO: Replace this.capacitors[0] with the single capacitor.
    this.wires = createWires( config, this.battery, this.lightBulbs[ 0 ], this.capacitors[ 0 ], this.circuitSwitches, this.circuitConnectionProperty );

    // create the current indicators
    // @public
    this.batteryTopCurrentIndicator = new CurrentIndicator( this.currentAmplitudeProperty, 0 /* initial rotation*/ );
    this.batteryBottomCurrentIndicator = new CurrentIndicator( this.currentAmplitudeProperty, Math.PI /* initial rotation*/ );

    // Make sure all is well with circuit components.  Circuit must include at least one circuit component and two wires.
    assert && assert( this.circuitComponents.length >= 1 );
    assert && assert( this.wires.length >= 2 );

    function updateSegments( circuitConnection ) {
      // update start and end points of each wire segment
      thisCircuit.wires.forEach( function( wire ) {
        wire.segments.forEach( function( segment ) {
          segment.update( circuitConnection );
        } );
      } );
    }

    // Whenever a circuit property changes, all segments are updated. This works, but is excessive.  If there are
    // performance issues, these links would be a great place to start.
    // udpate all segments, disconnected plate charge, and plate voltages when the connection property changes
    this.circuitConnectionProperty.lazyLink( function( circuitConnection ) {
      /*
       * When disconnecting the battery, set the disconnected plate charge to whatever the total plate charge was with
       * the battery connected.  Need to do this before changing the plate voltages property.
       */
      if ( circuitConnection !== CircuitConnectionEnum.BATTERY_CONNECTED ) {
        thisCircuit.setDisconnectedPlateCharge( thisCircuit.getTotalCharge() );
      }
      thisCircuit.updatePlateVoltages();

      updateSegments( circuitConnection );
    } );

    // update all segments and the plate voltages when capacitor plate geometry changes.  Lazy link because there is
    // no guarantee that capacitors have been constructed.
    this.capacitors.forEach( function( capacitor ) {
      capacitor.plateSeparationProperty.lazyLink( function() {
        updateSegments( thisCircuit.circuitConnection );
        thisCircuit.updatePlateVoltages();
      } );
    } );

    // update the plate voltages when the capacitor plate size changes.  Lazy link because there is no guarantee that
    // capacators have been constructed.
    this.capacitors.forEach( function( capacitor ) {
      capacitor.plateSizeProperty.lazyLink( function() {
        thisCircuit.updatePlateVoltages();
      } );
    } );

    // update all segments when battery polarity changes.
    this.battery.polarityProperty.link( function( polarity ) {
      updateSegments( thisCircuit.circuitConnection );
    } );

    // when the disconnected plate charge property changes, set the disconnected plate voltage.
    this.disconnectedPlateChargeProperty.lazyLink( function() {
      thisCircuit.setDisconnectedPlateVoltage();
    } );

    /*
     * When the battery voltage changes and the battery is connected, update the plate voltages.
     * Do NOT automatically do this when adding the observer because
     * updatePlateVoltages is implemented by the subclass, and all
     * necessary fields in the subclass may not be initialized.
     */
    this.battery.voltageProperty.lazyLink( function() {
      thisCircuit.updatePlateVoltages();
    } );

  }

  return inherit( PropertySet, AbstractCircuit, {

    /**
     * Updates the plate voltages.
     * Subclasses must call this at the end of their constructor, see note in constructor.
     */
    updatePlateVoltages: function() {
      console.log( 'updatePlateVoltages should be implemented in descendant classes.' );
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
     * Sets the value used for plate charge when the battery is disconnected.
     * (design doc symbol: Q_total)
     *
     * @param {number} disconnectedPlateCharge Coulombs
     */
    setDisconnectedPlateCharge: function( disconnectedPlateCharge ) {
      if ( disconnectedPlateCharge !== this.disconnectedPlateCharge ) {
        this.disconnectedPlateCharge = disconnectedPlateCharge;
      }
    },

    reset: function() {
      this.battery.reset();
      this.capacitors.forEach( function( capacitor ) {
        capacitor.reset();
      } );
    },

    /**
     * Step function for the AbstractCircuit.  Updates current amplitude and current indicators.
     *
     * @param {number} dt
     */
    step: function( dt ) {
      this.updateCurrentAmplitude( dt );
      this.batteryTopCurrentIndicator.step( dt );
      this.batteryBottomCurrentIndicator.step( dt );
    },

    /**
     * Default implementation has a connected battery.
     * In some other circuits, we'll override this and add a setter, so that the battery can be dynamically
     * connected and disconnected.
     */
    isBatteryConnected: function() {
      return true;
    },

    /**
     * Gets the wires connected to the top of circuit components.
     *
     * @return {array.<Wire>} topWires
     */
    getTopWires: function() {
      var topWires = [];
      this.wires.forEach( function( wire ) {
        if ( wire.connectionPoint === CLConstants.CONNECTION_POINTS.TOP ) {
          topWires.push( wire );
        }

      } );
      return topWires;
    },

    /**
     * Gets the wire connected to the battery's bottom terminal.
     *
     * @return {array.<Wire>} bottomWires
     */
    getBottomWires: function() {
      var bottomWires = [];
      this.wires.forEach( function( wire ) {
        if ( wire.connectionPoint === CLConstants.CONNECTION_POINTS.BOTTOM ) {
          bottomWires.push( wire );
        }

      } );
      return bottomWires;
    },

    /**
     * Get the total capacitance with Q_total = V_total * C_total
     *
     * @return {number}
     */
    getTotalCharge: function() {
      return this.getTotalVoltage() * this.getTotalCapacitance();
    },

    /**
     * Since the default is a connected battery, the total voltage is the battery voltage.
     * @returns {number}
     */
    getTotalVoltage: function() {
      return this.battery.voltage;
    },

    /**
     * Gets the voltage between 2 Shapes. The shapes are in world coordinates. Returns Double.NaN if the 2 Shapes are
     * not both connected to the circuit
     *
     * @param {Shape} positiveShape
     * @param {Shape} negativeShape
     * return {number}
     */
    getVoltageBetween: function( positiveShape, negativeShape ) {
      return this.getVoltageAt( positiveShape ) - this.getVoltageAt( negativeShape );
    },

    /**
     * Gets the voltage at a shape, with respect to ground. Returns NaN if the Shape is not connected to the circuit.
     *
     * @param {Shape} shape
     * @return {number}
     */
    getVoltageAt: function( shape ) {
      console.log( 'getVoltageAt() should be implemented in descendant classes of AbstractCircuit' );
    },

    /**
     * Gets the energy stored in the circuit. (design doc symbol: U)
     *
     * @return {number}
     */
    getStoredEnergy: function() {
      var C_total = this.getTotalCapacitance(); // F
      var V_total = this.getTotalVoltage(); // V
      return 0.5 * C_total * V_total * V_total; // Joules (J)
    },

    /**
     * Gets the effective E-field at a specified location. Inside the plates, this is E_effective. Outside the plates,
     * it is zero.
     *
     * @param {Vector3} location
     * @return {number} eField
     */
    getEffectiveEFieldAt: function( location ) {
      var eField = 0;
      this.capacitors.forEach( function( capacitor ) {
        if ( capacitor.isBetweenPlates( location ) ) {
          eField = capacitor.getEffectiveEField();
          //return; //break
        }
      } );
      return eField;
    },

    /**
     * Field due to the plate, at a specific location. Between the plates, the field is either E_plate_dielectric or
     * E_plate_air, depending on whether the probe intersects the dielectric.  Outside the plates, the field is zero.
     *
     * Note that as of 5/29/2015 without Dielectrics, the only possible value is E_plate_air.
     *
     * @param {Vector3} location
     * @return {number} eField
     */
    getPlatesDielectricEFieldAt: function( location ) {
      var eField = 0;
      this.capacitors.forEach( function( capacitor ) {
        if ( capacitor.isInsideAirBetweenPlates( location ) ) {
          eField = capacitor.getPlatesAirEField();
        }
      } );
      return eField;
    },

    /**
     * Update the Current amplitude. Current amplitude is proportional to dQ/dt, the change in charge (Q_total) over
     * time.
     *
     * @param {number} dt
     */
    updateCurrentAmplitude: function( dt ) {
      var Q = this.getTotalCharge();
      if ( this.previousTotalCharge !== -1 ) {
        var dQ = Q - this.previousTotalCharge;
        this.currentAmplitude = dQ / dt;
      }
      this.previousTotalCharge = Q;
    }
  } );
} );
