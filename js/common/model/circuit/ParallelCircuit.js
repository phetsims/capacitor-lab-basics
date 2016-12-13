// Copyright 2016, University of Colorado Boulder

/**
 * Model of a circuit with a battery, switches, and possibly a light bulb.
 * The layout of the circuit assumes that the battery is on the left
 * hand side of the circuit, while the circuit components are to the right.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 * @author Andrew Adare
 */

define( function( require ) {
  'use strict';

  // modules
  var Battery = require( 'CAPACITOR_LAB_BASICS/common/model/Battery' );
  var BatteryToSwitchWire = require( 'CAPACITOR_LAB_BASICS/common/model/wire/BatteryToSwitchWire' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CapacitorToSwitchWire = require( 'CAPACITOR_LAB_BASICS/common/model/wire/CapacitorToSwitchWire' );
  var CircuitState = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitState' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LightBulbToSwitchWire = require( 'CAPACITOR_LAB_BASICS/common/model/wire/LightBulbToSwitchWire' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var Capacitor = require( 'CAPACITOR_LAB_BASICS/common/model/Capacitor' );
  var CircuitLocation = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitLocation' );

  // phet-io modules
  var TNumber = require( 'ifphetio!PHET_IO/types/TNumber' );
  var TString = require( 'ifphetio!PHET_IO/types/TString' );

  /**
   * Constructor for a Parallel Circuit.
   *
   * @param {CircuitConfig} config
   * @param {Tandem} tandem
   *
   * @constructor
   */
  function ParallelCircuit( config, tandem ) {

    var self = this;

    /**
     * Signed current through circuit. Used to update arrows
     *
     * @type {NumberProperty}
     * @public
     */
    this.currentAmplitudeProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'currentAmplitudeProperty' ),
      phetioValueType: TNumber( {
        units: 'amperes'
      } ),
      phetioInstanceDocumentation: 'currentAmplitudeProperty is updated by the model and should not be set by users'
    } );

    /**
     * Property tracking the state of the switch
     *
     * @type {Property.<CircuitState>}
     * @public
     */
    this.circuitConnectionProperty = new Property( CircuitState.BATTERY_CONNECTED, {
      tandem: tandem.createTandem( 'circuitConnectionProperty' ),
      phetioValueType: TString
    } );

    /**
     * Property tracking the signed charge value on the upper plate
     *
     * @type {NumberProperty}
     * @public
     */
    this.disconnectedPlateChargeProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'disconnectedPlateChargeProperty' ),
      phetioValueType: TNumber( {
        units: 'coulombs',
        range: new Range( -CLBConstants.PLATE_CHARGE_METER_MAX_VALUE, CLBConstants.PLATE_CHARGE_METER_MAX_VALUE )
      } )
    } );

    // Utility variable for current calculation
    // @protected
    this.previousTotalCharge = 0;

    // Overwrite in concrete instances
    // @protected
    this.maxPlateCharge = Infinity;
    this.maxEffectiveEField = Infinity;

    // @public
    this.battery = new Battery( CLBConstants.BATTERY_LOCATION, CLBConstants.BATTERY_VOLTAGE_RANGE.defaultValue,
      config.modelViewTransform, tandem.createTandem( 'battery' ) );

    // @public
    this.capacitor = new Capacitor( config, this.circuitConnectionProperty, tandem.createTandem( 'capacitor' ) );

    // Array of CircuitSwitch instances
    // @public
    this.circuitSwitches = [ this.capacitor.topCircuitSwitch, this.capacitor.bottomCircuitSwitch ];

    // Create array of Wire instances. Assumes the capacitor is to the left of the lightbulb.
    // @public
    this.wires = [
      BatteryToSwitchWire.createBatteryToSwitchWireTop(
        config,
        this.battery,
        this.capacitor.topCircuitSwitch,
        tandem.createTandem( 'batteryToSwitchWireTop' ) ),
      BatteryToSwitchWire.createBatteryToSwitchWireBottom(
        config,
        this.battery,
        this.capacitor.bottomCircuitSwitch,
        tandem.createTandem( 'batteryToSwitchWireBottom' ) ),
      CapacitorToSwitchWire.createCapacitorToSwitchWireTop(
        config,
        this.capacitor,
        this.capacitor.topCircuitSwitch,
        tandem ),
      CapacitorToSwitchWire.createCapacitorToSwitchWireBottom(
        config,
        this.capacitor,
        this.capacitor.bottomCircuitSwitch,
        tandem )
    ];

    // If there is a light bulb in the circuit, wire it up
    if ( this.lightBulb ) {
      this.wires.push( LightBulbToSwitchWire.createLightBulbToSwitchWireTop(
        config,
        this.lightBulb,
        this.capacitor.topCircuitSwitch,
        tandem
      ) );
      this.wires.push( LightBulbToSwitchWire.createLightBulbToSwitchWireBottom(
        config,
        this.lightBulb,
        this.capacitor.bottomCircuitSwitch,
        tandem
      ) );
    }

    /**
     * Return the subset of wires connected to the provided location
     * @private
     * @param  {string} location - One of the constants in CircuitLocation
     * @return {Wire[]}
     */
    function selectWires( location ) {
      return self.wires.filter( function( wire ) {
        return wire.connectionPoint === location;
      } );
    }

    // Get collections of wires electrically connected to various parts of the circuit
    // @public
    this.topBatteryWires = selectWires( CircuitLocation.BATTERY_TOP );
    this.bottomBatteryWires = selectWires( CircuitLocation.BATTERY_BOTTOM );
    this.topLightBulbWires = selectWires( CircuitLocation.LIGHT_BULB_TOP );
    this.bottomLightBulbWires = selectWires( CircuitLocation.LIGHT_BULB_BOTTOM );
    this.topCapacitorWires = selectWires( CircuitLocation.CAPACITOR_TOP );
    this.bottomCapacitorWires = selectWires( CircuitLocation.CAPACITOR_BOTTOM );

    // @public
    this.topWires = this.topBatteryWires.concat( this.topLightBulbWires ).concat( this.topCapacitorWires );
    this.bottomWires = this.bottomBatteryWires.concat( this.bottomLightBulbWires ).concat( this.bottomCapacitorWires );

    // Add the switch wires to the capacitor wires arrays
    this.circuitSwitches.forEach( function( circuitSwitch ) {
      var wire = circuitSwitch.switchWire;
      if ( wire.connectionPoint === CircuitLocation.CIRCUIT_SWITCH_TOP ) {
        self.topCapacitorWires.push( wire );
      }
    } );
    this.circuitSwitches.forEach( function( circuitSwitch ) {
      var wire = circuitSwitch.switchWire;
      if ( wire.connectionPoint === CircuitLocation.CIRCUIT_SWITCH_BOTTOM ) {
        self.bottomCapacitorWires.push( wire );
      }
    } );

    // Make sure all is well with circuit components.
    // Circuit must include at least one circuit component and two wires.
    assert && assert( this.wires.length >= 2, 'Valid circuits must include at least two wires' );

    // Update start and end points of each wire segment
    function updateSegments() {
      self.wires.forEach( function( wire ) {
        wire.update();
      } );
    }

    // Update all segments, disconnected plate charge, and plate voltages when the connection property changes
    this.circuitConnectionProperty.lazyLink( function( circuitConnection ) {
      // When disconnecting the battery, set the disconnected plate charge to whatever the total plate charge was with
      // the battery connected.  Need to do this before changing the plate voltages property.
      if ( circuitConnection !== CircuitState.BATTERY_CONNECTED ) {
        self.disconnectedPlateChargeProperty.set( self.getTotalCharge() );
      }
      self.updatePlateVoltages();

      updateSegments();
    } );

    // Update all segments and the plate voltages when capacitor plate geometry changes.
    this.capacitor.plateSeparationProperty.lazyLink( function() {
      updateSegments();
      self.updatePlateVoltages();
    } );

    // update the plate voltages when the capacitor plate size changes.
    this.capacitor.plateSizeProperty.lazyLink( function() {
      self.updatePlateVoltages();
    } );

    // update all segments when battery polarity changes.
    this.battery.polarityProperty.link( function( polarity ) {
      updateSegments();
    } );

    // when the disconnected plate charge property changes, set the disconnected plate voltage.
    this.disconnectedPlateChargeProperty.lazyLink( function() {
      if ( self.circuitConnectionProperty.value === CircuitState.OPEN_CIRCUIT ) {
        self.updatePlateVoltages();
      }
    } );

    /*
     * When the battery voltage changes and the battery is connected, update the plate voltages.
     * Do NOT automatically do this when adding the observer because
     * updatePlateVoltages is implemented by the subclass, and all
     * necessary fields in the subclass may not be initialized.
     */
    this.battery.voltageProperty.lazyLink( function() {
      if ( self.circuitConnectionProperty.value === CircuitState.BATTERY_CONNECTED ) {
        self.updatePlateVoltages();
      }
    } );
  }

  capacitorLabBasics.register( 'ParallelCircuit', ParallelCircuit );

  inherit( Object, ParallelCircuit, {

    // @public
    reset: function() {
      this.battery.reset();
      this.capacitor.reset();
      this.currentAmplitudeProperty.reset();
      this.circuitConnectionProperty.reset();
      this.disconnectedPlateChargeProperty.reset();
      this.previousTotalCharge = 0;
    },

    /**
     * Updates current amplitude and current indicators.
     * @public
     *
     * @param {number} dt
     */
    step: function( dt ) {
      this.updateCurrentAmplitude( dt );
    },

    /**
     * Update the Current amplitude. Current amplitude is proportional to dQ/dt,
     * the change in charge (Q_total) over time.
     * @public
     *
     * @param {number} dt
     */
    updateCurrentAmplitude: function( dt ) {
      var Q = this.getTotalCharge();
      if ( this.previousTotalCharge !== -1 ) {
        var dQ = Q - this.previousTotalCharge;
        this.currentAmplitudeProperty.set( dQ / dt );
      }
      this.previousTotalCharge = Q;
    },

    /**
     * Get the total capacitance in the circuit
     * @public
     *
     * @returns {number}
     */
    getTotalCapacitance: function() {
      return this.capacitor.capacitanceProperty.value;
    },

    /**
     * Since the default is a connected battery, the total voltage is the battery voltage.
     * @public
     *
     * @returns {number}
     */
    getTotalVoltage: function() {
      return this.battery.voltageProperty.value;
    },

    /**
     * Gets the total charge in the circuit.
     * Design doc symbol: Q_total
     * @public
     *
     * @returns {number}
     */
    getTotalCharge: function() {
      return this.capacitor.plateChargeProperty.value;
    },

    /**
     * Get the voltage across the capacitor plates.
     * @public
     *
     * @returns {number}
     */
    getCapacitorPlateVoltage: function() {
      return this.capacitor.plateVoltageProperty.value;
    },

    /**
     * Gets the energy stored in the circuit. (design doc symbol: U)
     * @public
     *
     * @returns {number}
     */
    getStoredEnergy: function() {
      return this.capacitor.storedEnergyProperty.value;
    },

    /**
     * Gets the voltage between 2 Shapes. The shapes are in world coordinates.
     * Returns null if the 2 Shapes are not both connected to the circuit.
     * @public
     *
     * @param {Shape} positiveShape
     * @param {Shape} negativeShape
     * return {number}
     */
    getVoltageBetween: function( positiveShape, negativeShape ) {
      var vPlus = this.getVoltageAt( positiveShape );
      var vMinus = this.getVoltageAt( negativeShape );

      return ( vPlus === null || vMinus === null ) ? null : vPlus - vMinus;
    },

    /**
     * Check if shape intersects any wire in the array, stopping to return if true.
     * @public
     *
     * @param  {Shape} shape
     * @param  {Wire[]} wires
     *
     * @return {boolean}
     */
    shapeTouchesWireGroup: function( shape, wires ) {
      return _.some( wires, function( wire ) {
        return wire.shapeProperty.value.intersectsBounds( shape.bounds );
      } );
    },

    /**
     * Returns true if the switch is open or in transit
     * @public
     *
     * @return {boolean}
     */
    isOpen: function() {
      var connection = this.circuitConnectionProperty.value;
      return connection === CircuitState.OPEN_CIRCUIT || connection === CircuitState.SWITCH_IN_TRANSIT;
    },

    /**
     * Retuns true if the switch is contacting the battery branch of the circuit
     * @public
     *
     * @return {boolean}
     */
    batteryConnected: function() {
      return this.circuitConnectionProperty.value === CircuitState.BATTERY_CONNECTED;
    },

    /**
     * Check to see if shape connects any wires that are connected to the capacitor
     * top when the circuit is open.
     * @public
     *
     * @param {shape}
     * @returns {boolean}
     */
    connectedToDisconnectedCapacitorTop: function( shape ) {

      if ( !this.isOpen() ) {
        return false;
      }

      return (
        this.shapeTouchesWireGroup( shape, this.topCapacitorWires ) ||
        this.capacitor.intersectsTopPlate( shape )
      );
    },

    /**
     * Check to see if shape connects any wires that are connected to the capacitor
     * bottom when the circuit is open.
     * @public
     *
     * @param {shape}
     * @returns {boolean}
     */
    connectedToDisconnectedCapacitorBottom: function( shape ) {

      if ( !this.isOpen() ) {
        return false;
      }

      return (
        this.shapeTouchesWireGroup( shape, this.bottomCapacitorWires ) ||
        this.capacitor.intersectsBottomPlate( shape )
      );
    },


    /**
     * Check to see if shape connects any wires that are connected to the battery
     * top when the battery is disconnected.
     * @public
     *
     * @param {shape}
     * @returns {boolean}
     */
    connectedToDisconnectedBatteryTop: function( shape ) {

      if ( this.circuitConnectionProperty.value === CircuitState.BATTERY_CONNECTED ) {
        return false;
      }

      return (
        this.battery.intersectsTopTerminal( shape ) ||
        this.shapeTouchesWireGroup( shape, this.topBatteryWires )
      );
    },

    /**
     * Check to see if shape connects any wires that are connected to the battery
     * bottom when the battery is disconnected.
     *
     * There is no check for direct contact with the bottom terminal, since it's not exposed in the 3D view.
     * @public
     *
     * @param {shape}
     * @returns {boolean}
     */
    connectedToDisconnectedBatteryBottom: function( shape ) {

      if ( this.circuitConnectionProperty.value === CircuitState.BATTERY_CONNECTED ) {
        return false;
      }

      return this.shapeTouchesWireGroup( shape, this.bottomBatteryWires );
    },

    /**
     * True if shape is touching part of the circuit that is connected to the
     * battery's top terminal.
     * @public
     *
     * @param {Shape} shape
     * @returns {boolean}
     */
    connectedToBatteryTop: function( shape ) {
      return (
        this.shapeTouchesWireGroup( shape, this.topBatteryWires ) ||
        this.battery.intersectsTopTerminal( shape ) ||
        (
          this.batteryConnected() &&
          (
            this.capacitor.intersectsTopPlate( shape ) ||
            this.shapeTouchesWireGroup( shape, this.topCapacitorWires )
          )
        )
      );
    },

    /**
     * True if shape is touching part of the circuit that is connected to the
     * battery's bottom terminal.
     *
     * There is no check for direct contact with the bottom terminal, since it's not exposed in the 3D view.
     * @public
     *
     * @param {Shape} shape
     * @returns {boolean}
     */
    connectedToBatteryBottom: function( shape ) {
      return (
        this.shapeTouchesWireGroup( shape, this.bottomBatteryWires ) ||
        (
          this.batteryConnected() &&
          (
            this.capacitor.intersectsBottomPlate( shape ) ||
            this.shapeTouchesWireGroup( shape, this.bottomCapacitorWires )
          )
        )
      );
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

      // Closed circuit between battery and capacitor
      if ( this.circuitConnectionProperty.value === CircuitState.BATTERY_CONNECTED ) {
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

      // Closed circuit between light bulb and capacitor
      else if ( this.circuitConnectionProperty.value === CircuitState.LIGHT_BULB_CONNECTED ) {
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
      }

      // Open Circuit
      else if ( this.circuitConnectionProperty.value === CircuitState.OPEN_CIRCUIT ) {
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
      else if ( this.circuitConnectionProperty.value === CircuitState.SWITCH_IN_TRANSIT ) {
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

  return ParallelCircuit;
} );
