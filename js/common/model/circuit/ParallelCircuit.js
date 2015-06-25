// Copyright 2002-2015, University of Colorado Boulder

/**
 * Model of a circuit with a battery (B) and N circuitComponents (Z1...Zn) in parallel.  Switches exist between
 * circuit connections so that elements can be added or removed from the circuit as desired.
 *
 *  |--`--|--`---|--`---|
 *  |     |      |      |
 *  |     |      |      |
 *  B     Z1     Z2    Z3
 *  |     |      |      |
 *  |     |      |      |
 *  |--`--|--`---|--`---|
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
  var LightBulbModel = require( 'CAPACITOR_LAB_BASICS/common/model/LightBulbModel' );
  var WireBatteryToCircuitComponents = require( 'CAPACITOR_LAB_BASICS/common/model/wire/WireBatteryToCircuitComponents' );

  // Function for creating all circuit components. Assumes that the desired order is capcaitors and then lightbulbs.
  function createCircuitComponents( config, numberOfCapacitors, numberOfLightBulbs ) {

    var x = config.batteryLocation.x + config.capacitorXSpacing;
    var y = config.batteryLocation.y;
    var z = config.batteryLocation.z;

    var circuitComponents = [];

    var location;
    // create the capacitors.
    for ( var i = 0; i < numberOfCapacitors; i++ ) {
      location = new Vector3( x, y, z );
      var capacitor = new Capacitor( location, config.plateWidth, config.plateSeparation, config.modelViewTransform );
      circuitComponents.push( capacitor );
      x += config.capacitorXSpacing;
    }

    // create the lightBulbs.
    for ( i = 0; i < numberOfLightBulbs; i++ ) {
      location = new Vector3( x, y, z );
      var lightBulb = new LightBulbModel( location );
      circuitComponents.push( lightBulb );
      x += config.capacitorXSpacing;
    }

    return circuitComponents;
  }

  // Function for creating wires.
  function createWires( config, battery, circuitComponents, circuitConnectionProperty ) {
    var wires = [];
    wires.push( WireBatteryToCircuitComponents.WireBatteryToCircuitComponentsTop(
      config.modelViewTransform,
      config.wireThickness,
      config.wireExtent,
      config.capacitorXSpacing,
      battery,
      circuitComponents,
      circuitConnectionProperty ) );
    wires.push( WireBatteryToCircuitComponents.WireBatteryToCircuitComponentsBottom(
      config.modelViewTransform,
      config.wireThickness,
      config.wireExtent,
      config.capacitorXSpacing,
      battery,
      circuitComponents,
      circuitConnectionProperty ) );
    return wires;
  }

  /**
   * Constructor for a Parallel Circuit.
   *
   * @param {CircuitConfig} config
   * @param {number} numberOfCapacitors
   * @param {number} numberOfLightBulbs
   */
  function ParallelCircuit( config, numberOfCapacitors, numberOfLightBulbs ) {

    AbstractCircuit.call( this, config, numberOfCapacitors, numberOfLightBulbs, createCircuitComponents, createWires );

  }

  return inherit( AbstractCircuit, ParallelCircuit, {

    /**
     * Update the plate voltages.  This must be called at the end of the constructor.  See documentation in
     * AbstractCircuit.
     *
     * TODO: Not so sure about this anymore.
     */
    updatePlateVoltages: function() {
      this.capacitors.forEach( function( capacitor ) {
        capacitor.platesVoltage = this.getTotalVoltage(); // voltage across all capacitors is the same
      } );
    },

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
      if ( this.connectedToBatteryTop( shape ) ) {
        voltage = this.getTotalVoltage();
      }
      else if ( this.connectedToBatteryBottom( shape ) ) {
        voltage = 0;
      }
      return voltage;
    },

    /**
     * True if shape is touching part of the circuit that is connected to the battery's top terminal.
     *
     * @param {Shape} shape
     * @returns {boolean}
     */
    connectedToBatteryTop: function( shape ) {
      return this.battery.intersectsTopTerminal( shape ) || this.getTopWire().shape.intersectsBounds( shape ) || this.intersectsSomeTopPlate( shape );
    },

    /**
     * True if shape is touching part of the circuit that is connected to the battery's bottom terminal.
     *
     * @param {Shape} shape
     * @returns {boolean}
     */
    connectedToBatteryBottom: function( shape ) {
      return this.battery.intersectsBottomTerminal( shape ) || this.getBottomWire().shape.intersectsBounds( shape ) || this.intersectsSomeBottomPlate( shape );
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