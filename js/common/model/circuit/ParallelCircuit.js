// Copyright 2002-2015, University of Colorado Boulder

/**
 * Model of a circuit with a battery (B) and N capacitors (C1...Cn) in parallel.
 *
 * |-----|------|------|
 * |     |      |      |
 * B     C1     C2    C3
 * |     |      |      |
 * |-----|------|------|
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var Vector3 = require( 'DOT/Vector3' );
  var inherit = require( 'PHET_CORE/inherit' );
  var AbstractCircuit = require( 'CAPACITOR_LAB/common/model/circuit/AbstractCircuit' );
  var Capacitor = require( 'CAPACITOR_LAB/common/model/Capacitor' );
  var WireBatteryToCapacitors = require( 'CAPACITOR_LAB/common/model/wire/WireBatteryToCapacitors' );

  // Function for creating capacitors.
  function createCapacitors( config, numberOfCapacitors ) {

    var x = config.batteryLocation.x + config.capacitorXSpacing;
    var y = config.batteryLocation.y;
    var z = config.batteryLocation.z;

    var capacitors = [];
    for ( var i = 0; i < numberOfCapacitors; i++ ) {
      var location = new Vector3( x, y, z );
      var capacitor = new Capacitor( location, config.plateWidth, config.plateSeparation, config.modelViewTransform );
      capacitors.push( capacitor );
      x += config.capacitorXSpacing;
    }
    return capacitors;
  }

  // Function for creating wires.
  function createWires( config, battery, capacitors ) {
    var wires = [];
    wires.push( WireBatteryToCapacitors.WireBatteryToCapacitorsTop( config.modelViewTransform, config.wireThickness, config.wireExtent, battery, capacitors ) );
    wires.push( WireBatteryToCapacitors.WireBatteryToCapacitorsBottom( config.modelViewTransform, config.wireThickness, config.wireExtent, battery, capacitors ) );
    return wires;
  }

  /**
   * Constructor for a Parallel Circuit.
   *
   * @param {CircuitConfig} config
   * @param {number} numberOfCapacitors
   */
  function ParallelCircuit( config, numberOfCapacitors ) {

    AbstractCircuit.call( this, config, numberOfCapacitors, createCapacitors, createWires );

    this.updatePlateVoltages();
  }

  return inherit( AbstractCircuit, ParallelCircuit, {

    /**
     * Update the plate voltages.  This must be called at the end of the constructor.  See documentation in
     * AbstractCircuit.
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
        if( capacitor.intersectsBottomPlate( shape ) ) {
          intersects = true;
          //return; //break
        }
      } );
      return intersects;
    }
  } );
} );