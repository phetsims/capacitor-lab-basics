// Copyright 2015, University of Colorado Boulder

/**
 * Model of a circuit with a battery (B) and N circuit components (Z1...Zn) in parallel.  Switches exist between
 * circuit connections so that elements.  The layout of the circuit assumes that the battery is on the left
 * hand side of the circuit, while the circuit components are to the right
 * REVIEW: Sentence structure "so that elements"
 *
 * REVIEW: Lots of similar code structures in this file, ripe for simplification. Separate out "is it connected / does
 *         it overlap with any wires" code.
 *         See https://github.com/phetsims/capacitor-lab-basics/issues/174
 * REVIEW: Since this codebase won't support extensions, presumably these should be combined, see
 *         https://github.com/phetsims/capacitor-lab-basics/issues/117
 *
 *  |-----|------|------|
 *  |      /      /      /
 *  |     |      |      |
 *  B     Z1     Z2    Z3
 *  |     |      |      |
 *  |     |      |      |
 *   \     \      \      \
 *  |-----|------|------|
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
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
  var LightBulb = require( 'CAPACITOR_LAB_BASICS/common/model/LightBulb' );
  var LightBulbToSwitchWire = require( 'CAPACITOR_LAB_BASICS/common/model/wire/LightBulbToSwitchWire' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var SwitchedCapacitor = require( 'CAPACITOR_LAB_BASICS/common/model/SwitchedCapacitor' );
  var Vector3 = require( 'DOT/Vector3' );

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

    //REVIEW: documentation - Type important here!
    //REVIEW: Why does a callback need to be passed? It would be ideal to create these in the subtype.
    this.circuitComponents = createCircuitComponents( config, this.circuitConnectionProperty, tandem );
    var self = this;

    // Utility variable for current calculation
    // @protected
    this.previousTotalCharge = 0;

    // Overwrite in concrete instances
    // @protected
    this.maxPlateCharge = Infinity;
    this.maxEffectiveEField = Infinity;

    // create basic circuit components
    // @public
    this.battery = new Battery( config.batteryLocation, CLBConstants.BATTERY_VOLTAGE_RANGE.defaultValue,
      config.modelViewTransform, tandem.createTandem( 'battery' ) );

    //REVIEW: documentation - Type important here!
    //REVIEW: Why does a callback need to be passed? It would be ideal to create these in the subtype.
    this.circuitComponents = createCircuitComponents( config, this.circuitConnectionProperty, tandem );

    // capture the circuit components into individual arrays.  Note that using slice assumes order of capacitors and
    // then lightbulbs. If new order is important, new method is necessary.
    // @public
    //REVIEW: type documentation is important here.
    //REVIEW: Information about order of components is needed, OR a better method that doesn't rely on that should be
    //        used.
    //REVIEW: number of capacitors is always 1, presumably factor this out so that circuits just have one.
    this.capacitors = this.circuitComponents.slice( 0, 1 );
    this.lightBulbs = this.circuitComponents.slice( 1, config.numberOfLightBulbs + 1 );

    //REVIEW: type documentation would be helpful
    this.circuitSwitches = [];
    //REVIEW: to avoid 'self' reference, could do:
    // this.circuitSwitches = _.flatten( this.capacitors.map( function( capacitor ) {
    //   return [ capacitor.topCircuitSwitch, capacitor.bottomCircuitSwitch ];
    // } ) );
    this.capacitors.forEach( function( capacitor ) {
      self.circuitSwitches.push( capacitor.topCircuitSwitch );
      self.circuitSwitches.push( capacitor.bottomCircuitSwitch );
    } );

    //REVIEW: type documentation important here
    //REVIEW: Why does a callback need to be passed? It would be ideal to create these in the subtype.
    this.wires = createWires(
      config,
      this.battery,
      this.lightBulbs,
      this.capacitors,
      this.circuitSwitches,
      this.circuitConnectionProperty,
      tandem );

    function getWireSubset( zone ) {
      return self.wires.filter( function( wire ) {
        return wire.connectionPoint === zone;
      } );
    }

    this.topBatteryWires = getWireSubset( CLBConstants.WIRE_CONNECTIONS.BATTERY_TOP );
    this.bottomBatteryWires = getWireSubset( CLBConstants.WIRE_CONNECTIONS.BATTERY_BOTTOM );
    this.topLightBulbWires = getWireSubset( CLBConstants.WIRE_CONNECTIONS.LIGHT_BULB_TOP );
    this.bottomLightBulbWires = getWireSubset( CLBConstants.WIRE_CONNECTIONS.LIGHT_BULB_BOTTOM );
    this.topCapacitorWires = getWireSubset( CLBConstants.WIRE_CONNECTIONS.CAPACITOR_TOP );
    this.bottomCapacitorWires = getWireSubset( CLBConstants.WIRE_CONNECTIONS.CAPACITOR_BOTTOM );

    // this.topBatteryWires = this.wires.filter( function( wire ) {return wire.connectionPoint === CLBConstants.WIRE_CONNECTIONS.BATTERY_TOP; } );
    // this.bottomBatteryWires = this.wires.filter( function( wire ) {return wire.connectionPoint === CLBConstants.WIRE_CONNECTIONS.BATTERY_BOTTOM; } );
    // this.topLightBulbWires = this.wires.filter( function( wire ) {return wire.connectionPoint === CLBConstants.WIRE_CONNECTIONS.LIGHT_BULB_TOP; } );
    // this.bottomLightBulbWires = this.wires.filter( function( wire ) {return wire.connectionPoint === CLBConstants.WIRE_CONNECTIONS.LIGHT_BULB_BOTTOM; } );
    // this.topCapacitorWires = this.wires.filter( function( wire ) {return wire.connectionPoint === CLBConstants.WIRE_CONNECTIONS.CAPACITOR_TOP; } );
    // this.bottomCapacitorWires = this.wires.filter( function( wire ) {return wire.connectionPoint === CLBConstants.WIRE_CONNECTIONS.CAPACITOR_BOTTOM; } );

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














    //REVIEW: Recommend passing reason for assertion as the second parameter, e.g.:
    // assert && assert( this.wires.length >= 2, 'Valid circuits must include at least two wires' );
    // Make sure all is well with circuit components.  Circuit must include at least one circuit component and two wires.
    assert && assert( this.circuitComponents.length >= 1 );
    assert && assert( this.wires.length >= 2 );

    function updateSegments( circuitConnection ) {
      //REVIEW: circuitConnection is always self.circuitConnectionProperty.value
      // update start and end points of each wire segment
      self.wires.forEach( function( wire ) {
        //REVIEW: We are digging into Wire a lot here. wire.update() could do this?
        wire.segments.forEach( function( segment ) {
          // not all segments need to be updated
          //REVIEW: Any advantage of this over having a no-op update() on WireSegment itself?
          segment.update && segment.update();
        } );
      } );
    }

    // Whenever a circuit property changes, all segments are updated. This works, but is excessive.  If there are
    // performance issues, these links would be a great place to start.
    // udpate all segments, disconnected plate charge, and plate voltages when the connection property changes
    this.circuitConnectionProperty.lazyLink( function( circuitConnection ) {
      // When disconnecting the battery, set the disconnected plate charge to whatever the total plate charge was with
      // the battery connected.  Need to do this before changing the plate voltages property.
      if ( circuitConnection !== CircuitConnectionEnum.BATTERY_CONNECTED ) {
        self.disconnectedPlateChargeProperty.set( self.getTotalCharge() );
      }
      self.updatePlateVoltages();

      updateSegments( circuitConnection );
    } );

    // update all segments and the plate voltages when capacitor plate geometry changes.  Lazy link because there is
    // no guarantee that capacitors have been constructed.
    this.capacitors.forEach( function( capacitor ) {
      capacitor.plateSeparationProperty.lazyLink( function() {
        updateSegments( self.circuitConnectionProperty.value );
        self.updatePlateVoltages();
      } );
    } );

    // update the plate voltages when the capacitor plate size changes.  Lazy link because there is no guarantee that
    // capacitors have been constructed.
    this.capacitors.forEach( function( capacitor ) {
      capacitor.plateSizeProperty.lazyLink( function() {
        self.updatePlateVoltages();
      } );
    } );

    // update all segments when battery polarity changes.
    this.battery.polarityProperty.link( function( polarity ) {
      updateSegments( self.circuitConnectionProperty.value );
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
      this.capacitors.forEach( function( capacitor ) {
        capacitor.reset();
      } );
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
     * Get the total capacitance of all parallel capacitors in this circuit using C_total = C1 + C2 + ... + Cn
     * REVIEW: visibility doc
     *
     * @returns {number}
     */
    getTotalCapacitance: function() {
      //REVIEW: return _.sumBy( this.capacitors, function( capacitor ) { return capacitor.getCapacitance(); } );
      var sum = 0;
      this.capacitors.forEach( function( capacitor ) {
        assert && assert( !_.isNaN( capacitor.getCapacitance() ), 'capacitance is NaN' );
        sum += capacitor.getCapacitance();
      } );
      return sum;
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
     * REVIEW: visibility doc
     *
     * @returns {number}
     */
    getStoredEnergy: function() {
      var C = this.getTotalCapacitance(); // F
      var V = this.getCapacitorPlateVoltage(); // V
      return 0.5 * C * V * V; // Joules (J)
    },

    /**
     * Gets the voltage at a shape, with respect to ground. Returns null if the
     * Shape is not connected to the circuit.
     * REVIEW: visibility doc
     *
     * @param {Shape} shape - object whose bounds are checked for contact/intersection with the thing being measured
     * @returns {number} voltage
     * @override
     */
    getVoltageAt: function( shape ) {
      var voltage = null;

      //REVIEW: this implementation appears to be specific to the CapacitanceCircuit. Should it live there?

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

      var intersectsSomeBottomPlate = this.intersectsSomeBottomPlate( shape );
      var disconnected =
        this.circuitConnectionProperty.value === CircuitConnectionEnum.OPEN_CIRCUIT ||
        this.circuitConnectionProperty.value === CircuitConnectionEnum.IN_TRANSIT;
      return ( intersectsBottomWires || intersectsSomeBottomPlate ) && disconnected;
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

      var intersectsSomeTopPlate = this.intersectsSomeTopPlate( shape );
      var disconnected =
        this.circuitConnectionProperty.value === CircuitConnectionEnum.OPEN_CIRCUIT ||
        this.circuitConnectionProperty.value === CircuitConnectionEnum.IN_TRANSIT;
      return ( intersectsTopWire || intersectsSomeTopPlate ) && disconnected;
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
      var intersectsSomeTopPlate = this.intersectsSomeTopPlate( shape );
      var batteryConnected = this.circuitConnectionProperty.value === CircuitConnectionEnum.BATTERY_CONNECTED;

      return intersectsTopTerminal || intersectsTopWire || ( intersectsSomeTopPlate && batteryConnected );
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
      var intersectsSomeBottomPlate = this.intersectsSomeBottomPlate( shape );
      var batteryConnected = this.circuitConnectionProperty.value === CircuitConnectionEnum.BATTERY_CONNECTED;

      return intersectsBottomTerminal || intersectsBottomWires || ( intersectsSomeBottomPlate && batteryConnected );
    },

    /**
     * True if the shape intersects any capacitor's top plate.
     * REVIEW: visibility doc
     *
     * @param {Shape} shape
     * @returns {boolean}
     */
    intersectsSomeTopPlate: function( shape ) {
      //REVIEW: return _.some( this.capacitors, function( capacitor ) { return capacitor.intersectsTopPlate( shape ) } );
      var intersects = false;
      this.capacitors.forEach( function( capacitor ) {
        if ( capacitor.intersectsTopPlate( shape ) ) {
          intersects = true;
          //return; //break
        }
      } );
      return intersects;
    },

    /**
     * True if the shape intersects any capacitor's bottom plate.
     * REVIEW: visibility doc
     *
     * @param {Shape} shape
     * @returns {boolean}
     */
    intersectsSomeBottomPlate: function( shape ) {
      //REVIEW: return _.some( this.capacitors, function( capacitor ) { return capacitor.intersectsBottomPlate( shape ) } );
      var intersects = false;
      this.capacitors.forEach( function( capacitor ) {
        if ( capacitor.intersectsBottomPlate( shape ) ) {
          intersects = true;
          //return; //break
        }
      } );
      return intersects;
    }
  } );

  /**
   * Function which creates circuit components for the parallel circuit.  The function is constructed so that
   * capacitors are before light bulbs in left to right order.  If order of circuit components matters, this is the
   * function to change.
   * REVIEW: visibility doc
   *
   * @param {CircuitConfig} config - object defining the circuit
   * @param {Property.<string>} circuitConnectionProperty - REVIEW: Property.<CircuitConnectionEnum> recommended
   * @param {Tandem} tandem
   * @returns {Array} circuitComponents REVIEW: Array of what?
   */
  var createCircuitComponents = function( config, circuitConnectionProperty, tandem ) {

    var x = config.batteryLocation.x + config.capacitorXSpacing;
    var y = config.batteryLocation.y + config.capacitorYSpacing;
    var z = config.batteryLocation.z;
    var location = new Vector3( x, y, z );

    //REVIEW: initialize with first element, since it is unused (instead of init, declare, push):
    // var circuitComponents = [ new SwitchedCapacitor( ... ) ];
    var circuitComponents = [];

    var capacitor = new SwitchedCapacitor( config, circuitConnectionProperty,
      tandem.createTandem( 'switchedCapacitor' ) );

    circuitComponents.push( capacitor );

    // create the light bulbs
    //REVIEW: better to inline var in loop, e.g.  `for( var i ... )`
    var i;
    for ( i = 0; i < config.numberOfLightBulbs; i++ ) {
      //REVIEW: LIGHT_BULB_X_SPACING is always 0.023, presumably hard-code here or have a separate constant somewhere
      x += config.lightBulbXSpacing;
      location = new Vector3( x, y, z );
      var lightBulb = new LightBulb( location, config.lightBulbResistance, config.modelViewTransform );
      circuitComponents.push( lightBulb );
    }

    return circuitComponents;
  };

  /**
   * Function that creates all wires of the circuit.  Function assumes that capacitors are to the left of the
   * lightbulb.
   * REVIEW: Note the above constraint in the function where they are created.
   * REVIEW: visibility doc
   *
   * @param {CircuitConfig} config
   * @param {Battery} battery
   * @param {LightBulb[]} lightBulbs
   * @param {Capacitor[]} capacitors
   * @param {CircuitSwitch[]} circuitSwitches
   * @param {Property.<string>} circuitConnectionProperty REVIEW: Property.<CircuitConnectionEnum> recommended
   * @returns {Array} REVIEW: Array of what?
   */
  var createWires = function( config, battery, lightBulbs, capacitors,
    circuitSwitches, circuitConnectionProperty, tandem ) {

    // wire battery to first capacitor, there must be at least one capacitor in the circuit
    assert && assert( capacitors.length > 0, 'There must be at least one capacitor in the circuit' );

    var wires = [];

    wires.push( BatteryToSwitchWire.createBatteryToSwitchWireTop(
      config,
      battery,
      capacitors[ 0 ].topCircuitSwitch,
      tandem.createTandem( 'batteryToSwitchWireTop' ) ) );

    wires.push( BatteryToSwitchWire.createBatteryToSwitchWireBottom(
      config,
      battery,
      capacitors[ 0 ].bottomCircuitSwitch,
      tandem.createTandem( 'batteryToSwitchWireBottom' ) ) );

    // wire capacitors to the switches
    capacitors.forEach( function( capacitor ) {
      wires.push( CapacitorToSwitchWire.createCapacitorToSwitchWireTop(
        config,
        capacitor,
        capacitor.topCircuitSwitch,
        tandem
      ) );
      wires.push( CapacitorToSwitchWire.createCapacitorToSwitchWireBottom(
        config,
        capacitor,
        capacitor.bottomCircuitSwitch,
        tandem
      ) );
    } );

    // if there are any light bulbs in the circuit, add them here
    if ( lightBulbs.length > 0 ) {
      // the first light bulb must be connected to the last capacitor switch
      wires.push( LightBulbToSwitchWire.createLightBulbToSwitchWireTop(
        config,
        lightBulbs[ 0 ],
        capacitors[ capacitors.length - 1 ].topCircuitSwitch,
        tandem
      ) );
      wires.push( LightBulbToSwitchWire.createLightBulbToSwitchWireBottom(
        config,
        lightBulbs[ 0 ],
        capacitors[ capacitors.length - 1 ].bottomCircuitSwitch,
        tandem
      ) );

      //REVIEW: I usually wrap loops like this with `if( assert ) { ... }`, so the loop is guaranteed to not make it to
      //        production
      // now connect the rest of the light bulbs in the circuit
      for ( var i = 1; i < lightBulbs.length; i++ ) {
        // NOTE: This is not needed in the Basics version of the sim, but is left here to jump start
        // multiple light bulbs if needed by Capacitor Lab.
        //REVIEW: This is asserting that this string is truthy, which is true here. assert( false, ... ) to fail out.
        assert && assert( 'There should only be one light bulb in Capacitor Lab: Basics' );
      }
    }

    return wires;
  };

  return ParallelCircuit;
} );
