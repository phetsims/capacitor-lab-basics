// Copyright 2015, University of Colorado Boulder

/**
 * Model of a circuit with a battery (B) and N circuit components (Z1...Zn) in parallel.  Switches exist between
 * circuit connections so that elements.  The layout of the circuit assumes that the battery is on the left
 * hand side of the circuit, while the circuit components are to the right
 * REVIEW: Sentence structure "so that elements"
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

    /**
     * Get the total capacitance of all parallel capacitors in this circuit using C_total = C1 + C2 + ... + Cn
     * REVIEW: visibility doc
     *
     * @returns {number}
     */
    getTotalCapacitance: function() {
      //REVIEW: return _.sumBy( this.capacitors, function( capacitor ) { return capacitor.getTotalCapacitance(); } );
      var sum = 0;
      this.capacitors.forEach( function( capacitor ) {
        sum += capacitor.getTotalCapacitance();
      } );
      return sum;
    },

    /**
     * Gets the voltage at a shape, with respect to ground. Returns null if the
     * Shape is not connected to the circuit.
     * REVIEW: visibility doc
     *
     * @param {Shape} shape - object whose bounds are checked for contact/intersection with the thing being measured
     * @return {number} voltage
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
      var intersectsBottomTerminal = this.battery.intersectsBottomTerminal( shape );
      var intersectsBottomWires = false;
      var bottomBatteryWires = this.getBottomBatteryWires();

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
     *
     * @param {Shape} shape
     * @returns {boolean}
     */
    connectedToBatteryBottom: function( shape ) {
      var intersectsBottomTerminal = this.battery.intersectsBottomTerminal( shape );
      var intersectsBottomWires = false;
      var bottomBatteryWires = this.getBottomBatteryWires();
      bottomBatteryWires = bottomBatteryWires.concat( this.getBottomCapacitorWires() );
      bottomBatteryWires = bottomBatteryWires.concat( this.getBottomSwitchWires() );
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
     *
     * @param {Shape} shape
     * @returns {boolean}
     */
    intersectsSomeTopPlate: function( shape ) {
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
     *
     * @param {Shape} shape
     * @returns {boolean}
     */
    intersectsSomeBottomPlate: function( shape ) {
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
   *
   * @param {CircuitConfig} config - object defining the circuit
   * @param {Property.<string>} circuitConnectionProperty -
   * @param {Tandem} tandem
   * @returns {Array} circuitComponents
   */
  var createCircuitComponents = function( config, circuitConnectionProperty, tandem ) {

    assert && assert( config.numberOfCapacitors === 1,
      'Capacitor Lab: Basics is designed to use exactly one capacitor' );

    var x = config.batteryLocation.x + config.capacitorXSpacing;
    var y = config.batteryLocation.y + config.capacitorYSpacing;
    var z = config.batteryLocation.z;
    var location = new Vector3( x, y, z );

    var circuitComponents = [];

    var capacitor = new SwitchedCapacitor( config, circuitConnectionProperty,
      tandem.createTandem( 'switchedCapacitor' ) );

    circuitComponents.push( capacitor );

    // create the light bulbs
    var i;
    for ( i = 0; i < config.numberOfLightBulbs; i++ ) {
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
   *
   * @param {CircuitConfig} config
   * @param {Battery} battery
   * @param {LightBulb[]} lightBulbs
   * @param {Capacitor[]} capacitors
   * @param {CircuitSwitch[]} circuitSwitches
   * @param {Property.<string>} circuitConnectionProperty
   * @returns {Array}
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

      // now connect the rest of the light bulbs in the circuit
      for ( var i = 1; i < lightBulbs.length; i++ ) {
        // NOTE: This is not needed in the Basics version of the sim, but is left here to jump start
        // multiple light bulbs if needed by Capacitor Lab.
        assert && assert( 'There should only be one light bulb in Capacitor Lab: Basics' );
      }
    }

    return wires;
  };

  return ParallelCircuit;

} );
