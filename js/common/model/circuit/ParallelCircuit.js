// Copyright 2015, University of Colorado Boulder

/**
 * Model of a circuit with a battery (B) and N circuitComponents (Z1...Zn) in parallel.  Switches exist between
 * circuit connections so that elements can be added or removed from the circuit as desired.
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
  var Capacitor = require( 'CAPACITOR_LAB_BASICS/common/model/Capacitor' );
  var LightBulb = require( 'CAPACITOR_LAB_BASICS/common/model/LightBulb' );
  var CircuitSwitch = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitSwitch' );
  var CLConstants = require( 'CAPACITOR_LAB_BASICS/common/CLConstants' );
  var BatteryToSwitchWire = require( 'CAPACITOR_LAB_BASICS/common/model/wire/BatteryToSwitchWire' );
  var LightBulbToSwitchWire = require( 'CAPACITOR_LAB_BASICS/common/model/wire/LightBulbToSwitchWire' );
  var CapacitorToSwitchWire = require( 'CAPACITOR_LAB_BASICS/common/model/wire/CapacitorToSwitchWire' );
  var CircuitConnectionEnum = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitConnectionEnum' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  /**
   * Function which creates circuit components for the parallel circuit.  The function is constructed so that
   * capacitors are before light bulbs in left to right order.  If order of circuit components matters, this is the
   * function to change.
   *
   * @param {CircuitConfig} config - object defining the circuit
   * @param {number} numberOfCapacitors
   * @param {number} numberOfLightBulbs
   * @returns {Array} circuitComponents
   */
  function createCircuitComponents( config, numberOfCapacitors, numberOfLightBulbs ) {

    var x = config.batteryLocation.x + config.capacitorXSpacing;
    var y = config.batteryLocation.y + config.capacitorYSpacing;
    var z = config.batteryLocation.z;

    var circuitComponents = [];

    // create the capacitors
    var location;
    for ( var i = 0; i < numberOfCapacitors; i++ ) {
      location = new Vector3( x, y, z );
      var capacitor = new Capacitor(
        location, config.plateWidth,
        config.plateSeparation,
        config.dielectricMaterial,
        config.dielectricOffset,
        config.modelViewTransform
      );

      circuitComponents.push( capacitor );
      x += config.lightBulbXSpacing;
    }

    // create the light bulbs
    for ( i = 0; i < numberOfLightBulbs; i++ ) {
      location = new Vector3( x, y, z );
      var lightBulb = new LightBulb( location, config.lightBulbResistance );
      circuitComponents.push( lightBulb );
      x += config.lightBulbXSpacing;
    }

    return circuitComponents;
  }

  /**
   * Function that creates all wires of the circuit.  Right now, the function only works for a circuit with 2 switches,
   * one above and one below the circuit.  If more switches or circuit components are required, this is the function
   * that needs to be fixed.
   *
   * @param config
   * @param battery
   * @param lightBulb
   * @param capacitor
   * @param circuitSwitches
   * @param circuitConnectionProperty
   * @returns {Array}
   */
  function createWires( config, battery, lightBulb, capacitor, circuitSwitches, circuitConnectionProperty ) {
    var wires = [];
    // wire battery to switch
    wires.push( BatteryToSwitchWire.BatteryToSwitchWireTop(
      config.modelViewTransform,
      config.wireThickness,
      battery,
      circuitSwitches[ 0 ], // TODO: get the single switch.
      circuitConnectionProperty
    ) );
    wires.push( BatteryToSwitchWire.BatteryToSwitchWireBottom(
      config.modelViewTransform,
      config.wireThickness,
      battery,
      circuitSwitches[ 1 ], // TODO: get the single switch.
      circuitConnectionProperty
    ) );

    // wire capacitor to the switches
    wires.push( CapacitorToSwitchWire.CapacitorToSwitchWireTop(
      config.modelViewTransform,
      config.wireThickness,
      capacitor,
      circuitSwitches[ 0 ], // TODO: get the single switch.
      circuitConnectionProperty
    ) );
    wires.push( CapacitorToSwitchWire.CapacitorToSwitchWireBottom(
      config.modelViewTransform,
      config.wireThickness,
      capacitor,
      circuitSwitches[ 1 ], // TODO: get the single switch.
      circuitConnectionProperty
    ) );

    if ( lightBulb !== undefined ) {
      //  // wire light bulb to switch
      wires.push( LightBulbToSwitchWire.LightBulbToSwitchWireTop(
        config.modelViewTransform,
        config.wireThickness,
        lightBulb,
        circuitSwitches[ 0 ], // TODO: get the single switch.
        circuitConnectionProperty
      ) );
      wires.push( new LightBulbToSwitchWire.LightBulbToSwitchWireBottom(
        config.modelViewTransform,
        config.wireThickness,
        lightBulb,
        circuitSwitches[ 1 ], // TODO: get the single switch.
        circuitConnectionProperty
      ) );
    }
    return wires;
  }

  // function for creating circuit switches.
  function createCircuitSwitches( config, numberOfCapacitors, circuitConnectionProperty ) {

    // a switch exists for every capacitor.
    var numComponentsWithSwitches = numberOfCapacitors;

    var x = config.batteryLocation.x + config.capacitorXSpacing;
    var topY = config.batteryLocation.y - CLConstants.PLATE_SEPARATION_RANGE.max - CLConstants.SWITCH_Y_SPACING;
    var bottomY = config.batteryLocation.y + CLConstants.PLATE_SEPARATION_RANGE.max + CLConstants.SWITCH_Y_SPACING;
    var z = config.batteryLocation.z;

    var circuitSwitches = [];

    // create the top circuit switches.
    for ( var i = 0; i < numComponentsWithSwitches; i++ ) {
      var topStartPoint = new Vector3( x, topY, z );
      var bottomStartPoint = new Vector3( x, bottomY, z );
      var topCircuitSwitch = CircuitSwitch.CircuitTopSwitch( topStartPoint, config.modelViewTransform, circuitConnectionProperty );
      var bottomCircuitSwitch = CircuitSwitch.CircuitBottomSwitch( bottomStartPoint, config.modelViewTransform, circuitConnectionProperty );

      // link the top and bottom circuit switches together so that they rotate together
      topCircuitSwitch.angleProperty.link( function( angle ) {
        bottomCircuitSwitch.angle = -angle;
      } );
      bottomCircuitSwitch.angleProperty.link( function( angle ) {
        topCircuitSwitch.angle = -angle;
      } );


      circuitSwitches.push( topCircuitSwitch, bottomCircuitSwitch );
      x += config.capacitorXSpacing;
    }
    return circuitSwitches;
  }

  /**
   * Constructor for a Parallel Circuit.
   *
   * @param {CircuitConfig} config
   * @param {number} numberOfCapacitors
   * @param {number} numberOfLightBulbs
   * @param {Object} options
   */
  function ParallelCircuit( config, numberOfCapacitors, numberOfLightBulbs, options ) {

    options = _.extend( {
      circuitSwitchFactory: createCircuitSwitches
    }, options );

    AbstractCircuit.call( this, config, numberOfCapacitors, numberOfLightBulbs, createCircuitComponents, createWires, options.circuitSwitchFactory );

  }

  capacitorLabBasics.register( 'ParallelCircuit', ParallelCircuit );

  return inherit( AbstractCircuit, ParallelCircuit, {

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
        }
        else if ( this.connectedToBatteryBottom( shape ) ) {
          voltage = 0;
        }
      }
      else if ( this.circuitConnectionProperty.value === CircuitConnectionEnum.OPEN_CIRCUIT ) {
        if ( this.connectedToDisconnectedCapacitorTop( shape ) ) {
          voltage = this.getCapacitorPlateVoltage();
        }
        else if ( this.connectedToDisconnectedCapacitorBottom( shape ) ) {
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
} );