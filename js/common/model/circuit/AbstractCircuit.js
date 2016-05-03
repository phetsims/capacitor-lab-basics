// Copyright 2015, University of Colorado Boulder

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
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var CircuitConnectionEnum = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitConnectionEnum' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  /**
   * Constructor for the AbstractCircuit.
   *
   * @param {CircuitConfig} config circuit configuration values
   * @param {function} createCircuitComponents   function for creating cirucit components
   * @param {function} createWires function for creating wires
   * @param {function} createCircuitSwitches function for creating wires
   * @param {Tandem} tandem
   */
  function AbstractCircuit( config, createCircuitComponents, createWires, tandem ) {

    PropertySet.call( this, {
      currentAmplitude: 0,
      circuitConnection: CircuitConnectionEnum.BATTERY_CONNECTED,
      disconnectedPlateCharge: 0
    } );
    var thisCircuit = this;

    this.previousTotalCharge = -1; // no value, @private

    this.config = config;

    // Overwrite in concrete instances
    this.maxPlateCharge = Infinity;
    this.maxEffectiveEField = Infinity;

    // create basic circuit components
    // @public
    this.battery = new Battery( config.batteryLocation, CLBConstants.BATTERY_VOLTAGE_RANGE.defaultValue, config.modelViewTransform, tandem );
    this.circuitComponents = createCircuitComponents( config, this.circuitConnectionProperty, tandem );

    // capture the circuit components into individual arrays.  Note that using slice assumes order of capacitors and
    // then lightbulbs. If new order is important, new method is necessary.
    // @public
    this.capacitors = this.circuitComponents.slice( 0, config.numberOfCapacitors );
    this.lightBulbs = this.circuitComponents.slice( config.numberOfCapacitors, config.numberOfLightBulbs + 1 );
    this.circuitSwitches = [];
    this.capacitors.forEach( function( capacitor ) {
      thisCircuit.circuitSwitches.push( capacitor.topCircuitSwitch );
      thisCircuit.circuitSwitches.push( capacitor.bottomCircuitSwitch );
    } );

    this.wires = createWires( config, this.battery, this.lightBulbs, this.capacitors, this.circuitSwitches, this.circuitConnectionProperty );

    // Make sure all is well with circuit components.  Circuit must include at least one circuit component and two wires.
    assert && assert( this.circuitComponents.length >= 1 );
    assert && assert( this.wires.length >= 2 );

    function updateSegments( circuitConnection ) {
      // update start and end points of each wire segment
      thisCircuit.wires.forEach( function( wire ) {
        wire.segments.forEach( function( segment ) {
          // not all segments need to be updated
          segment.update && segment.update( circuitConnection );
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
      if ( thisCircuit.circuitConnectionProperty.value === CircuitConnectionEnum.BATTERY_CONNECTED ) {
        thisCircuit.updatePlateVoltages();
      }
    } );

  }

  capacitorLabBasics.register( 'AbstractCircuit', AbstractCircuit );

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
      this.circuitConnectionProperty.reset();
    },

    /**
     * Step function for the AbstractCircuit.  Updates current amplitude and current indicators.
     *
     * @param {number} dt
     */
    step: function( dt ) {
      this.updateCurrentAmplitude( dt );
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
      var topBatteryWires = this.getTopBatteryWires();
      var topLightBulbWires = this.getTopLightBulbWires();
      var topCapacitorWires = this.getTopCapacitorWires();

      var topWires = [];
      topWires = topWires.concat( topBatteryWires );
      topWires = topWires.concat( topLightBulbWires );
      topWires = topWires.concat( topCapacitorWires );
      return topWires;
    },

    /**
     * Get all top wires that are connected to the battery.
     */
    getTopBatteryWires: function() {
      var topBatteryWires = [];
      this.wires.forEach( function( wire ) {
        if ( wire.connectionPoint === CLBConstants.WIRE_CONNECTIONS.BATTERY_TOP ) {
          topBatteryWires.push( wire );
        }
      } );
      return topBatteryWires;
    },

    /**
     * Get all top wires that are connected to the battery.
     */
    getBottomBatteryWires: function() {
      var bottomBatteryWires = [];
      this.wires.forEach( function( wire ) {
        if ( wire.connectionPoint === CLBConstants.WIRE_CONNECTIONS.BATTERY_BOTTOM ) {
          bottomBatteryWires.push( wire );
        }
      } );
      return bottomBatteryWires;
    },

    /**
     * Get all top wires that are connected to the light bulb.
     */
    getTopLightBulbWires: function() {
      var topLightBulbWires = [];
      this.wires.forEach( function( wire ) {
        if ( wire.connectionPoint === CLBConstants.WIRE_CONNECTIONS.LIGHT_BULB_TOP ) {
          topLightBulbWires.push( wire );
        }
      } );
      return topLightBulbWires;
    },

    /**
     * Get all top wires that are connected to the light bulb.
     */
    getBottomLightBulbWires: function() {
      var bottomLightBulbWires = [];
      this.wires.forEach( function( wire ) {
        if ( wire.connectionPoint === CLBConstants.WIRE_CONNECTIONS.LIGHT_BULB_BOTTOM ) {
          bottomLightBulbWires.push( wire );
        }
      } );
      return bottomLightBulbWires;
    },

    /**
     * Get all the top wires that connect the circuit switch.
     */
    getTopSwitchWires: function() {
      var topCircuitSwitchWires = [];
      this.circuitSwitches.forEach( function( circuitSwitch ) {
        var switchWire = circuitSwitch.switchWire;
        if ( switchWire.connectionPoint === CLBConstants.WIRE_CONNECTIONS.CIRCUIT_SWITCH_TOP ) {
          topCircuitSwitchWires.push( switchWire );
        }
      } );
      return topCircuitSwitchWires;
    },

    /**
     * Get all the bottom wires that connect the circuit switch.
     *
     * @returns {array.<Wire>}
     */
    getBottomSwitchWires: function() {
      var bottomCircuitSwitchWires = [];
      this.circuitSwitches.forEach( function( circuitSwitch ) {
        var switchWire = circuitSwitch.switchWire;
        if ( switchWire.connectionPoint === CLBConstants.WIRE_CONNECTIONS.CIRCUIT_SWITCH_BOTTOM ) {
          bottomCircuitSwitchWires.push( switchWire );
        }
      } );
      return bottomCircuitSwitchWires;
    },

    /**
     * Get all the top wires that are connected to the capacitor.
     *
     * @returns {array.<Wire>}
     */
    getTopCapacitorWires: function() {
      var topCapacitorWires = [];
      this.wires.forEach( function( wire ) {
        if ( wire.connectionPoint === CLBConstants.WIRE_CONNECTIONS.CAPACITOR_TOP ) {
          topCapacitorWires.push( wire );
        }
      } );
      return topCapacitorWires;
    },

    /**
     * Get all the bottom wires that are connected to the capacitor.
     *
     * @returns {array.<Wire>}
     */
    getBottomCapacitorWires: function() {
      var bottomCapacitorWires = [];
      this.wires.forEach( function( wire ) {
        if ( wire.connectionPoint === CLBConstants.WIRE_CONNECTIONS.CAPACITOR_BOTTOM ) {
          bottomCapacitorWires.push( wire );
        }
      } );
      return bottomCapacitorWires;
    },

    /**
     * Gets the wire connected to the battery's bottom terminal.
     *
     * @return {array.<Wire>} bottomWires
     */
    getBottomWires: function() {
      var bottomBatteryWires = this.getBottomBatteryWires();
      var bottomLightBulbWires = this.getBottomLightBulbWires();
      var bottomCapacitorWires = this.getBottomCapacitorWires();

      var bottomWires = [];
      bottomWires = bottomWires.concat( bottomBatteryWires );
      bottomWires = bottomWires.concat( bottomLightBulbWires );
      bottomWires = bottomWires.concat( bottomCapacitorWires );

      return bottomWires;
    },

    /**
     * Get the total charge with Q_total = V_total * C_total
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
      var V_total = this.getCapacitorPlateVoltage(); // V
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

