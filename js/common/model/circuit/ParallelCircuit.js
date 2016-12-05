// Copyright 2016, University of Colorado Boulder

/**
 * Model of a circuit with a battery (B) and N circuit components (Z1...Zn) in parallel.  Switches exist between
 * circuit connections so that elements.  The layout of the circuit assumes that the battery is on the left
 * hand side of the circuit, while the circuit components are to the right
 * REVIEW: Sentence structure "so that elements"
 *
 * REVIEW: Lots of similar code structures in this file, ripe for simplification. Separate out "is it connected / does
 *         it overlap with any wires" code.
 *         See https://github.com/phetsims/capacitor-lab-basics/issues/174
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
  var CircuitConnectionEnum = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitConnectionEnum' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LightBulbToSwitchWire = require( 'CAPACITOR_LAB_BASICS/common/model/wire/LightBulbToSwitchWire' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var SwitchedCapacitor = require( 'CAPACITOR_LAB_BASICS/common/model/SwitchedCapacitor' );

  // phet-io modules
  var TNumber = require( 'ifphetio!PHET_IO/types/TNumber' );
  var TString = require( 'ifphetio!PHET_IO/types/TString' );

  /**
   * Constructor for a Parallel Circuit.
   *
   * @param {CircuitConfig} config
   * @param {Tandem|null} tandem - null if this is a temporary circuit used for calculations
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
      documentation: 'currentAmplitudeProperty is updated by the model and should not be set by users'
    } );

    /**
     * Property tracking the state of the switch
     *
     * @type {Property.<CircuitConnectionEnum>}
     * @public
     */
    this.circuitConnectionProperty = new Property( CircuitConnectionEnum.BATTERY_CONNECTED, {
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
    this.battery = new Battery( config.batteryLocation, CLBConstants.BATTERY_VOLTAGE_RANGE.defaultValue,
      config.modelViewTransform, tandem.createTandem( 'battery' ) );

    // @public
    this.capacitor = new SwitchedCapacitor( config, this.circuitConnectionProperty,
      tandem.createTandem( 'switchedCapacitor' ) );

    // Array of CircuitSwitch instances
    // @public
    this.circuitSwitches = [ this.capacitor.topCircuitSwitch, this.capacitor.bottomCircuitSwitch ];

    // Create array of Wire instances. Assumes the capacitor is to the left of the lightbulb.
    // @public
    this.wires = createWires(
      config,
      this.battery,
      this.lightBulb,
      this.capacitor,
      this.circuitSwitches,
      this.circuitConnectionProperty,
      tandem );

    // Return the subset of wires in the provided zone
    // @private
    function selectWires( zone ) {
      return self.wires.filter( function( wire ) {
        return wire.connectionPoint === zone;
      } );
    }

    this.topBatteryWires = selectWires( CLBConstants.WIRE_CONNECTIONS.BATTERY_TOP );
    this.bottomBatteryWires = selectWires( CLBConstants.WIRE_CONNECTIONS.BATTERY_BOTTOM );
    this.topLightBulbWires = selectWires( CLBConstants.WIRE_CONNECTIONS.LIGHT_BULB_TOP );
    this.bottomLightBulbWires = selectWires( CLBConstants.WIRE_CONNECTIONS.LIGHT_BULB_BOTTOM );
    this.topCapacitorWires = selectWires( CLBConstants.WIRE_CONNECTIONS.CAPACITOR_TOP );
    this.bottomCapacitorWires = selectWires( CLBConstants.WIRE_CONNECTIONS.CAPACITOR_BOTTOM );

    this.topWires = this.topBatteryWires.concat( this.topLightBulbWires ).concat( this.topCapacitorWires );
    this.bottomWires = this.bottomBatteryWires.concat( this.bottomLightBulbWires ).concat( this.bottomCapacitorWires );

    this.topSwitchWires = [];
    this.circuitSwitches.forEach( function( circuitSwitch ) {
      var wire = circuitSwitch.switchWire;
      if ( wire.connectionPoint === CLBConstants.WIRE_CONNECTIONS.CIRCUIT_SWITCH_TOP ) {
        self.topSwitchWires.push( wire );
      }
    } );

    this.bottomSwitchWires = [];
    this.circuitSwitches.forEach( function( circuitSwitch ) {
      var wire = circuitSwitch.switchWire;
      if ( wire.connectionPoint === CLBConstants.WIRE_CONNECTIONS.CIRCUIT_SWITCH_BOTTOM ) {
        self.bottomSwitchWires.push( wire );
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
      if ( circuitConnection !== CircuitConnectionEnum.BATTERY_CONNECTED ) {
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
      if ( self.circuitConnectionProperty.value === CircuitConnectionEnum.OPEN_CIRCUIT ) {
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
      if ( self.circuitConnectionProperty.value === CircuitConnectionEnum.BATTERY_CONNECTED ) {
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
     * Get the total capacitance the circuit
     * @public
     *
     * @returns {number}
     */
    getTotalCapacitance: function() {
      return this.capacitor.getCapacitance();
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
     * Gets the energy stored in the circuit. (design doc symbol: U)
     * @public
     *
     * @returns {number}
     */
    getStoredEnergy: function() {
      var C = this.getTotalCapacitance(); // F
      var V = this.getCapacitorPlateVoltage(); // V
      return 0.5 * C * V * V; // Joules (J)
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

    //REVIEW: doc
    shapeTouchesWireGroup: function( shape, wires ) {
      //REVIEW:
      // return _.some( wires, function( wire ) {
      //   return wire.shapeProperty.value.intersectsBounds( shape.bounds );
      // } );
      var intersectsWires = false;

      wires.forEach( function( wire ) {
        if ( wire.shapeProperty.value.intersectsBounds( shape.bounds ) ) {
          intersectsWires = true;
        }
      } );

      return intersectsWires;
    },

    //REVIEW: doc
    //REVIEW: This function and the others below share a lot of code that could potentially be factored out.
    connectedToDisconnectedCapacitorBottom: function( shape ) {
      var intersectsBottomWires = false;
      var bottomCapacitorWires = this.bottomCapacitorWires;
      var bottomSwitchWires = this.bottomSwitchWires;
      var bottomWires = bottomCapacitorWires.concat( bottomSwitchWires );

      //REVIEW: simplification:
      // var bottomWires = this.getBottomCapacitorWires().concat( this.getBottomSwitchWires() );
      // var intersectsBottomWires = this.shapeTouchesWireGroup( shape, bottomWires );
      //REVIEW: Also, easier to check for whether disconnected is false before we need to compute this. Recommend top:
      // if ( !disconnected ) { return false; } // skips a lot
      bottomWires.forEach( function( bottomWire ) {
        if ( bottomWire.shapeProperty.value.intersectsBounds( shape.bounds ) ) {
          intersectsBottomWires = true;
        }
      } );

      var intersectsBottomPlate = this.capacitor.intersectsBottomPlate( shape );
      var disconnected =
        this.circuitConnectionProperty.value === CircuitConnectionEnum.OPEN_CIRCUIT ||
        this.circuitConnectionProperty.value === CircuitConnectionEnum.IN_TRANSIT;
      return ( intersectsBottomWires || intersectsBottomPlate ) && disconnected;
    },

    //REVIEW: doc
    connectedToDisconnectedCapacitorTop: function( shape ) {
      //REVIEW: See the 'bottom' case simplifications above, everything from connectedToDisconnectedCapacitorBottom applies.
      var intersectsTopWire = false;

      // only the wires that are connected to the battery
      var topCapacitorWires = this.topCapacitorWires;
      var topCircuitSwitchWires = this.topSwitchWires;
      var topWires = topCapacitorWires.concat( topCircuitSwitchWires );
      topWires.forEach( function( topWire ) {
        if ( topWire.shapeProperty.value.intersectsBounds( shape.bounds ) ) {
          intersectsTopWire = true;
        }
      } );

      var intersectsTopPlate = this.capacitor.intersectsTopPlate( shape );
      var disconnected =
        this.circuitConnectionProperty.value === CircuitConnectionEnum.OPEN_CIRCUIT ||
        this.circuitConnectionProperty.value === CircuitConnectionEnum.IN_TRANSIT;
      return ( intersectsTopWire || intersectsTopPlate ) && disconnected;
    },

    /**
     * Check to see if shape connects any wires that are connected to the battery top when the battery is disconnected.
     * REVIEW: visibility doc
     *
     * @param shape  REVIEW: {Shape}?
     * @returns {*|boolean}   REVIEW: Just {boolean}?
     */
    connectedToDisconnectedBatteryTop: function( shape ) {
      var intersectsTopTerminal = this.battery.intersectsTopTerminal( shape );
      var intersectsTopWire = false;

      // only the wires that are connected to the battery
      var topBatteryWires = this.topBatteryWires;
      //REVIEW: var intersectsTopWire = this.shapeTouchesWireGroup( shape, this.topBatteryWires );
      topBatteryWires.forEach( function( topWire ) {
        if ( topWire.shapeProperty.value.intersectsBounds( shape.bounds ) ) {
          intersectsTopWire = true;
        }
      } );

      var disconnected = !( this.circuitConnectionProperty.value === CircuitConnectionEnum.BATTERY_CONNECTED );
      return ( intersectsTopTerminal || intersectsTopWire ) && disconnected;
    },

    /**
     * True if shape is touching part of the circuit that is connected to the battery's bottom terminal when the battery
     * is disconnected.
     * REVIEW: visibility doc
     *
     * @param {Shape} shape
     * @returns {boolean}
     */
    connectedToDisconnectedBatteryBottom: function( shape ) {
      //REVIEW: intersectsBottomTerminal returns the constant false, so this should be able to be simplified
      var intersectsBottomTerminal = this.battery.intersectsBottomTerminal( shape );
      var intersectsBottomWires = false;
      var bottomBatteryWires = this.bottomBatteryWires;
      //REVIEW: simplification:
      // intersectsBottomWires = this.shapeTouchesWireGroup( shape, this.bottomBatteryWires )
      bottomBatteryWires.forEach( function( bottomWire ) {
        if ( bottomWire.shapeProperty.value.intersectsBounds( shape.bounds ) ) {
          intersectsBottomWires = true;
        }
      } );

      var disconnected = !( this.circuitConnectionProperty.value === CircuitConnectionEnum.BATTERY_CONNECTED );
      return ( intersectsBottomTerminal || intersectsBottomWires ) && disconnected;
    },

    /**
     * True if shape is touching part of the circuit that is connected to the battery's top terminal.
     * REVIEW: visibility doc
     *
     * @param {Shape} shape
     * @returns {boolean}
     */
    connectedToBatteryTop: function( shape ) {
      var intersectsTopTerminal = this.battery.intersectsTopTerminal( shape );
      var intersectsTopWire = false;
      var topBatteryWires = this.topBatteryWires;
      topBatteryWires = topBatteryWires.concat( this.topCapacitorWires );
      topBatteryWires = topBatteryWires.concat( this.topSwitchWires );
      //REVIEW: See above simplifications, use this.shapeTouchesWireGroup
      topBatteryWires.forEach( function( topWire ) {
        if ( topWire.shapeProperty.value.intersectsBounds( shape.bounds ) ) {
          intersectsTopWire = true;
        }
      } );
      var intersectsTopPlate = this.capacitor.intersectsTopPlate( shape );
      var batteryConnected = this.circuitConnectionProperty.value === CircuitConnectionEnum.BATTERY_CONNECTED;

      return intersectsTopTerminal || intersectsTopWire || ( intersectsTopPlate && batteryConnected );
    },

    /**
     * True if shape is touching part of the circuit that is connected to the battery's bottom terminal.
     * REVIEW: visibility doc
     *
     * @param {Shape} shape
     * @returns {boolean}
     */
    connectedToBatteryBottom: function( shape ) {
      //REVIEW: intersectsBottomTerminal returns the constant false, so this should be able to be simplified
      var intersectsBottomTerminal = this.battery.intersectsBottomTerminal( shape );
      var intersectsBottomWires = false;
      var bottomBatteryWires = this.bottomBatteryWires;
      bottomBatteryWires = bottomBatteryWires.concat( this.bottomCapacitorWires );
      bottomBatteryWires = bottomBatteryWires.concat( this.bottomSwitchWires );
      //REVIEW: See above simplifications, use this.shapeTouchesWireGroup
      bottomBatteryWires.forEach( function( bottomWire ) {
        if ( bottomWire.shapeProperty.value.intersectsBounds( shape.bounds ) ) {
          intersectsBottomWires = true;
        }
      } );
      var intersectsBottomPlate = this.capacitor.intersectsBottomPlate( shape );
      var batteryConnected = this.circuitConnectionProperty.value === CircuitConnectionEnum.BATTERY_CONNECTED;

      return intersectsBottomTerminal || intersectsBottomWires || ( intersectsBottomPlate && batteryConnected );
    }
  } );

  /**
   * Function that creates all wires of the circuit.
   * Assumes the capacitor is to the left of the lightbulb.
   * @private
   *
   * @param {CircuitConfig} config
   * @param {Battery} battery
   * @param {LightBulb | null} lightBulb
   * @param {Capacitor} capacitor
   * @param {CircuitSwitch[]} circuitSwitches
   * @param {Property.<CircuitConnectionEnum>} circuitConnectionProperty
   * @returns {Wire[]}
   */
  var createWires = function( config, battery, lightBulb, capacitor,
    circuitSwitches, circuitConnectionProperty, tandem ) {

    var wires = [
      BatteryToSwitchWire.createBatteryToSwitchWireTop(
        config,
        battery,
        capacitor.topCircuitSwitch,
        tandem.createTandem( 'batteryToSwitchWireTop' ) ),
      BatteryToSwitchWire.createBatteryToSwitchWireBottom(
        config,
        battery,
        capacitor.bottomCircuitSwitch,
        tandem.createTandem( 'batteryToSwitchWireBottom' ) ),
      CapacitorToSwitchWire.createCapacitorToSwitchWireTop(
        config,
        capacitor,
        capacitor.topCircuitSwitch,
        tandem ),
      CapacitorToSwitchWire.createCapacitorToSwitchWireBottom(
        config,
        capacitor,
        capacitor.bottomCircuitSwitch,
        tandem )
    ];

    // If there is a light bulb in the circuit, wire it up
    if ( lightBulb ) {
      wires.push( LightBulbToSwitchWire.createLightBulbToSwitchWireTop(
        config,
        lightBulb,
        capacitor.topCircuitSwitch,
        tandem
      ) );
      wires.push( LightBulbToSwitchWire.createLightBulbToSwitchWireBottom(
        config,
        lightBulb,
        capacitor.bottomCircuitSwitch,
        tandem
      ) );
    }

    return wires;
  };

  return ParallelCircuit;
} );
