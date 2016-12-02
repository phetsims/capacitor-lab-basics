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
  var AbstractCircuit = require( 'CAPACITOR_LAB_BASICS/common/model/circuit/AbstractCircuit' );
  var BatteryToSwitchWire = require( 'CAPACITOR_LAB_BASICS/common/model/wire/BatteryToSwitchWire' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CapacitorToSwitchWire = require( 'CAPACITOR_LAB_BASICS/common/model/wire/CapacitorToSwitchWire' );
  var CircuitConnectionEnum = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitConnectionEnum' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LightBulb = require( 'CAPACITOR_LAB_BASICS/common/model/LightBulb' );
  var LightBulbToSwitchWire = require( 'CAPACITOR_LAB_BASICS/common/model/wire/LightBulbToSwitchWire' );
  var SwitchedCapacitor = require( 'CAPACITOR_LAB_BASICS/common/model/SwitchedCapacitor' );
  var Vector3 = require( 'DOT/Vector3' );

  /**
   * Constructor for a Parallel Circuit.
   *
   * @param {CircuitConfig} config
   * @param {Tandem|null} tandem - null if this is a temporary circuit used for calculations
   *
   * @constructor
   */
  function ParallelCircuit( config, tandem ) {
    AbstractCircuit.call( this, config, createCircuitComponents, createWires, tandem );
  }

  capacitorLabBasics.register( 'ParallelCircuit', ParallelCircuit );

  inherit( AbstractCircuit, ParallelCircuit, {

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
     * Step function for the AbstractCircuit.  Updates current amplitude and current indicators.
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
          this.shapeTouchesWireGroup( shape, this.getTopLightBulbWires() ) ||
          this.shapeTouchesWireGroup( shape, this.getBottomLightBulbWires() ) ) {
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
          this.shapeTouchesWireGroup( shape, this.getTopLightBulbWires() ) ||
          this.shapeTouchesWireGroup( shape, this.getBottomLightBulbWires() ) ) {
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
      var bottomCapacitorWires = this.getBottomCapacitorWires();
      var bottomSwitchWires = this.getBottomSwitchWires();
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
      var topCapacitorWires = this.getTopCapacitorWires();
      var topCircuitSwitchWires = this.getTopSwitchWires();
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
      var topBatteryWires = this.getTopBatteryWires();
      //REVIEW: var intersectsTopWire = this.shapeTouchesWireGroup( shape, this.getTopBatteryWires() );
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
      var bottomBatteryWires = this.getBottomBatteryWires();
      //REVIEW: simplification:
      // intersectsBottomWires = this.shapeTouchesWireGroup( shape, this.getBottomBatteryWires() )
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
      var topBatteryWires = this.getTopBatteryWires();
      topBatteryWires = topBatteryWires.concat( this.getTopCapacitorWires() );
      topBatteryWires = topBatteryWires.concat( this.getTopSwitchWires() );
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
      var bottomBatteryWires = this.getBottomBatteryWires();
      bottomBatteryWires = bottomBatteryWires.concat( this.getBottomCapacitorWires() );
      bottomBatteryWires = bottomBatteryWires.concat( this.getBottomSwitchWires() );
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
