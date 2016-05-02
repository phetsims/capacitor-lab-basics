// Copyright 2015, University of Colorado Boulder

/**
 * Model of a circuit with a battery (B) and N circuitComponents (Z1...Zn) in parallel.  Switches exist between
 * circuit connections so that elements.  The layout of the circuit assumes that the battery is on the left
 * hand side of the circuit, while the circuit components are to the right
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
  var Vector3 = require( 'DOT/Vector3' );
  var inherit = require( 'PHET_CORE/inherit' );
  var AbstractCircuit = require( 'CAPACITOR_LAB_BASICS/common/model/circuit/AbstractCircuit' );
  var LightBulb = require( 'CAPACITOR_LAB_BASICS/common/model/LightBulb' );
  var BatteryToSwitchWire = require( 'CAPACITOR_LAB_BASICS/common/model/wire/BatteryToSwitchWire' );
  var LightBulbToSwitchWire = require( 'CAPACITOR_LAB_BASICS/common/model/wire/LightBulbToSwitchWire' );
  var CapacitorToSwitchWire = require( 'CAPACITOR_LAB_BASICS/common/model/wire/CapacitorToSwitchWire' );
  var CircuitConnectionEnum = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitConnectionEnum' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var SwitchedCapacitor = require( 'CAPACITOR_LAB_BASICS/common/model/SwitchedCapacitor' );

  /**
   * Constructor for a Parallel Circuit.
   *
   * @param {CircuitConfig} config
   * @param {Tandem} tandem
   * @param {Object} options
   * @constructor
   */
  function ParallelCircuit( config, tandem, options ) {
    AbstractCircuit.call( this, config, createCircuitComponents, createWires, tandem );
  }

  capacitorLabBasics.register( 'ParallelCircuit', ParallelCircuit );

  inherit( AbstractCircuit, ParallelCircuit, {

    /**
     * Get the total capacitance of all parallel capacitors in this circuit using C_total = C1 + C2 + ... + Cn
     *
     * @returns {number}
     */
    getTotalCapacitance: function() {
      var sum = 0;
      this.capacitors.forEach( function( capacitor ) {
        sum += capacitor.getTotalCapacitance();
      } );
      return sum;
    },

    /**
     * Gets the voltage at a shape, with respect to ground. Returns Double.NaN if the Shape is not connected to the
     * circuit.
     *
     * @return {number} voltage
     */
    getVoltageAt: function( shape ) {
      var voltage = Number.NaN;
      if ( this.circuitConnectionProperty.value === CircuitConnectionEnum.BATTERY_CONNECTED ) {
        if ( this.connectedToBatteryTop( shape ) ) {
          voltage = this.getTotalVoltage();
        } else if ( this.connectedToBatteryBottom( shape ) ) {
          voltage = 0;
        }
      } else if ( this.circuitConnectionProperty.value === CircuitConnectionEnum.OPEN_CIRCUIT ) {
        if ( this.connectedToDisconnectedCapacitorTop( shape ) ) {
          voltage = this.getCapacitorPlateVoltage();
        } else if ( this.connectedToDisconnectedCapacitorBottom( shape ) ) {
          voltage = 0;
        }
      }
      return voltage;
    },

    connectedToDisconnectedCapacitorBottom: function( shape ) {

      var intersectsBottomWires = false;
      var bottomCapacitorWires = this.getBottomCapacitorWires();
      var bottomSwitchWires = this.getBottomSwitchWires();
      var bottomWires = bottomCapacitorWires.concat( bottomSwitchWires );

      bottomWires.forEach( function( bottomWire ) {
        if ( bottomWire.shape.intersectsBounds( shape.bounds ) ) {
          intersectsBottomWires = true;
        }
      } );

      var intersectsSomeBottomPlate = this.intersectsSomeBottomPlate( shape );
      return intersectsBottomWires || intersectsSomeBottomPlate;
    },

    connectedToDisconnectedCapacitorTop: function( shape ) {
      var intersectsTopWire = false;

      // only the wires that are connected to the battery
      var topCapacitorWires = this.getTopCapacitorWires();
      var topCircuitSwitchWires = this.getTopSwitchWires();
      var topWires = topCapacitorWires.concat( topCircuitSwitchWires );
      topWires.forEach( function( topWire ) {
        if ( topWire.shape.intersectsBounds( shape.bounds ) ) {
          intersectsTopWire = true;
        }
      } );

      var intersectsSomeTopPlate = this.intersectsSomeTopPlate( shape );
      return intersectsTopWire || intersectsSomeTopPlate;
    },

    /**
     * Check to see if shape connects any wires that are connected to the battery top when the batteyr is disconnected.
     * @param shape
     * @returns {*|boolean}
     */
    connectedToDisconnectedBatteryTop: function( shape ) {
      var intersectsTopTerminal = this.battery.intersectsTopTerminal( shape );
      var intersectsTopWire = false;

      // only the wires that are connected to the battery
      var topBatteryWires = this.getTopBatteryWires();
      topBatteryWires.forEach( function( topWire ) {
        if ( topWire.shape.intersectsBounds( shape.bounds ) ) {
          intersectsTopWire = true;
        }
      } );

      return intersectsTopTerminal || intersectsTopWire;
    },

    /**
     * True if shape is touching part of the circuit that is connected to the battery's bottom terminal when the battery
     * is disconnected.
     *
     * @param {Shape} shape
     * @returns {boolean}
     */
    connectedToDisconnectedBatteryBottom: function( shape ) {
      var intersectsBottomTerminal = this.battery.intersectsBottomTerminal( shape );
      var intersectsBottomWires = false;
      var bottomBatteryWires = this.getBottomBatteryWires();

      bottomBatteryWires.forEach( function( bottomWire ) {
        if ( bottomWire.shape.intersectsBounds( shape.bounds ) ) {
          intersectsBottomWires = true;
        }
      } );

      return intersectsBottomTerminal || intersectsBottomWires;
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
        if ( topWire.shape.intersectsBounds( shape.bounds ) ) {
          intersectsTopWire = true;
        }
      } );
      var intersectsSomeTopPlate = this.intersectsSomeTopPlate( shape );
      return intersectsTopTerminal || intersectsTopWire || intersectsSomeTopPlate;
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
        if ( bottomWire.shape.intersectsBounds( shape.bounds ) ) {
          intersectsBottomWires = true;
        }
      } );
      var intersectsSomeBottomPlate = this.intersectsSomeBottomPlate( shape );
      return intersectsBottomTerminal || intersectsBottomWires || intersectsSomeBottomPlate;
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
   * @param {Tandem} tandem
   * @returns {Array} circuitComponents
   */
  var createCircuitComponents = function( config, circuitConnectionProperty, tandem ) {

    var x = config.batteryLocation.x + config.capacitorXSpacing;
    var y = config.batteryLocation.y + config.capacitorYSpacing;
    var z = config.batteryLocation.z;

    var circuitComponents = [];

    // create the capacitors
    var location;
    for ( var i = 0; i < config.numberOfCapacitors; i++ ) {
      location = new Vector3( x, y, z );
      var capacitor = new SwitchedCapacitor( location, config, config.circuitConnections, circuitConnectionProperty,
        tandem, {
          plateWidth: config.plateWidth,
          plateSeparation: config.plateSeparation,
          dielectricMaterial: config.dielectricMaterial,
          dielectricOffset: config.dielectricOffset
        } );

      circuitComponents.push( capacitor );
      x += config.lightBulbXSpacing;
    }

    // create the light bulbs
    for ( i = 0; i < config.numberOfLightBulbs; i++ ) {
      location = new Vector3( x, y, z );
      var lightBulb = new LightBulb( location, config.lightBulbResistance );
      circuitComponents.push( lightBulb );
      x += config.lightBulbXSpacing;
    }

    return circuitComponents;
  };

  /**
   * Function that creates all wires of the circuit.  Function assumes that capacitors are to the left of the
   * lightbulb.
   *
   * @param {CircuitConfig} config
   * @param {Battery} battery
   * @param {Array<LightBulb>} lightBulb
   * @param {Array<Capacitor>} capacitor
   * @param {Array<CircuitSwitch>} circuitSwitches
   * @param {Property.<Enum>} circuitConnectionProperty
   * @returns {Array}
   */
  var createWires = function( config, battery, lightBulbs, capacitors, circuitSwitches, circuitConnectionProperty ) {

    var wires = [];

    // wire battery to first capacitor, there must be at least one capacitor in the circuit
    assert && assert( capacitors.length > 0, 'There must be at least one capacitor in the circuit' );
    wires.push( BatteryToSwitchWire.BatteryToSwitchWireTop(
      config.modelViewTransform,
      config.wireThickness,
      battery,
      capacitors[ 0 ].topCircuitSwitch,
      circuitConnectionProperty
    ) );
    wires.push( BatteryToSwitchWire.BatteryToSwitchWireBottom(
      config.modelViewTransform,
      config.wireThickness,
      battery,
      capacitors[ 0 ].bottomCircuitSwitch,
      circuitConnectionProperty
    ) );

    // wire capacitors to the switches
    capacitors.forEach( function( capacitor ) {
      wires.push( CapacitorToSwitchWire.CapacitorToSwitchWireTop(
        config.modelViewTransform,
        config.wireThickness,
        capacitor,
        capacitor.topCircuitSwitch,
        circuitConnectionProperty
      ) );
      wires.push( CapacitorToSwitchWire.CapacitorToSwitchWireBottom(
        config.modelViewTransform,
        config.wireThickness,
        capacitor,
        capacitor.bottomCircuitSwitch,
        circuitConnectionProperty
      ) );
    } );

    // if there are any light bulbs in the circuit, add them here
    if ( lightBulbs.length > 0 ) {
      // the first light bulb must be connected to the last capacitor switch
      wires.push( LightBulbToSwitchWire.LightBulbToSwitchWireTop(
        config.modelViewTransform,
        config.wireThickness,
        lightBulbs[ 0 ],
        capacitors[ capacitors.length - 1 ].topCircuitSwitch,
        circuitConnectionProperty
      ) );
      wires.push( LightBulbToSwitchWire.LightBulbToSwitchWireBottom(
        config.modelViewTransform,
        config.wireThickness,
        lightBulbs[ 0 ],
        capacitors[ capacitors.length - 1 ].bottomCircuitSwitch,
        circuitConnectionProperty
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

