// Copyright 2015, University of Colorado Boulder

/**
 * Model of a circuit with a battery (B) connected to a single capacitor (C1).  This is treated as a special case of a
 * parallel circuit, with some added features.  The capacitor also has a switch attached to it so that it can be
 * disconnected from the battery.
 *
 * |-----|
 * |      /
 * B     C
 * |      \
 * |-----|
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ParallelCircuit = require( 'CAPACITOR_LAB_BASICS/common/model/circuit/ParallelCircuit' );
  var CircuitConnectionEnum = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitConnectionEnum' );
  var CircuitSwitch = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitSwitch' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var Vector3 = require( 'DOT/Vector3' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  // Create the single circuit switch for single circuit
  function createCircuitSwitch( config, numberOfCapacitors, circuitConnectionProperty ) {

    // switch location
    var x = config.batteryLocation.x + config.capacitorXSpacing;
    var topY = config.batteryLocation.y - CLBConstants.PLATE_SEPARATION_RANGE.max - CLBConstants.SWITCH_Y_SPACING;
    var bottomY = config.batteryLocation.y + CLBConstants.PLATE_SEPARATION_RANGE.max + CLBConstants.SWITCH_Y_SPACING;
    var z = config.batteryLocation.z;

    var circuitSwitches = []; // wrapped for format of AbstractCircuit

    // create the circuit switches
    var topStartPoint = new Vector3( x, topY, z );
    var bottomStartPoint = new Vector3( x, bottomY, z );

    // possible circuit connection types for the Capacitance Circuit 
    var capacitanceConnections = [ CircuitConnectionEnum.BATTERY_CONNECTED, CircuitConnectionEnum.OPEN_CIRCUIT ];

    var topCircuitSwitch = CircuitSwitch.CircuitTopSwitch( topStartPoint, config.modelViewTransform, capacitanceConnections, circuitConnectionProperty );
    var bottomCircuitSwitch = CircuitSwitch.CircuitBottomSwitch( bottomStartPoint, config.modelViewTransform, capacitanceConnections, circuitConnectionProperty );

    // link the top and bottom circuit switches together so that they rotate together
    topCircuitSwitch.angleProperty.link( function( angle ) {
      bottomCircuitSwitch.angle = -angle;
    } );
    bottomCircuitSwitch.angleProperty.link( function( angle ) {
      topCircuitSwitch.angle = -angle;
    } );

    circuitSwitches.push( topCircuitSwitch, bottomCircuitSwitch );

    return circuitSwitches;
  }

  /**
   * Constructor for the Single Capacitor Circuit.
   *
   * @param {CircuitConfig} config
   * @constructor
   */
  function CapacitanceCircuit( config ) {

    ParallelCircuit.call( this, config, 1 /* numberOfCapacitors */, 0 /* numberOfLightBulbs */, {
      circuitSwitchFactory: createCircuitSwitch
    } );

    this.capacitor = this.capacitors[ 0 ]; // @public
  }

  capacitorLabBasics.register( 'CapacitanceCircuit', CapacitanceCircuit );
  
  return inherit( ParallelCircuit, CapacitanceCircuit, {

    /**
     * Updates the plate voltage, depending on whether the battery is connected. Null check required because superclass
     * calls this method from its constructor.
     */
    updatePlateVoltages: function() {
      if ( this.circuitConnectionProperty !== undefined ) {
        if ( this.circuitConnection === CircuitConnectionEnum.BATTERY_CONNECTED ) {
          this.capacitor.platesVoltage = this.battery.voltage;
        }
        else {
          this.capacitor.platesVoltage = this.disconnectedPlateCharge / this.capacitor.getTotalCapacitance();
        }
      }
    },

    getCapacitorPlateVoltage: function() {
      return this.capacitor.platesVoltage;
    },

    /**
     * Normally the total voltage is equivalent to the battery voltage. But disconnecting the battery changes how we
     * compute total voltage, so override this method.
     *
     * @return {number}
     */
    getTotalVoltage: function() {
      //if ( this.circuitConnection === CircuitConnectionEnum.BATTERY_CONNECTED ) {
      return ParallelCircuit.prototype.getTotalVoltage.call( this );
      //}
    },

    /**
     * Gets the total charge in the circuit.(design doc symbol: Q_total)
     *
     * @return {number}
     */
    getTotalCharge: function() {
      return this.capacitor.getTotalPlateCharge();
    }
  } );

} );