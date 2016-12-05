// Copyright 2015, University of Colorado Boulder

/**
 * Base model for all circuits.
 *
 * REVIEW: There is only one direct subtype: ParallelCircuit. Is future work planned to use this, or should they be
 *         collapsed together?
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  // var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * Constructor for the AbstractCircuit.
   *
   * @param {CircuitConfig} config circuit configuration values
   * @param {function} createCircuitComponents   function for creating cirucit components
   * @param {function} createWires function for creating wires
   * @param {function} createCircuitSwitches function for creating wires
   * @param {Tandem} tandem
   */
  function AbstractCircuit( config, createCircuitComponents, createWires, tandem ) {
  }

  capacitorLabBasics.register( 'AbstractCircuit', AbstractCircuit );

  return inherit( Object, AbstractCircuit, {

    /**
     * Gets the wires connected to the top of circuit components.
     * @public
     *
     * @returns {Wire[]} topWires
     */
    // getTopWires: function() {
    //   return this.getTopBatteryWires()
    //     .concat( this.getTopLightBulbWires() )
    //     .concat( this.getTopCapacitorWires() );
    // },

    /**
     * Get all top wires that are connected to the battery.
     * REVIEW: visibility doc
     * REVIEW: Once the circuit is being constructed, the wires won't change. Compute this on startup, so usages can
     *         get circuit.topBatteryWires
     */
    // getTopBatteryWires: function() {
    //   return this.wires.filter( function( wire ) {
    //     return wire.connectionPoint === CLBConstants.WIRE_CONNECTIONS.BATTERY_TOP;
    //   } );
    // },

    /**
     * Get all top wires that are connected to the battery.
     * REVIEW: visibility doc
     * REVIEW: Once the circuit is being constructed, the wires won't change. Compute this on startup, so usages can
     *         get circuit.bottomBatteryWires
     */
    // getBottomBatteryWires: function() {
    //   return this.wires.filter( function( wire ) {
    //     return wire.connectionPoint === CLBConstants.WIRE_CONNECTIONS.BATTERY_BOTTOM;
    //   } );
    // },

    /**
     * Get all top wires that are connected to the light bulb.
     * REVIEW: visibility doc
     * REVIEW: Once the circuit is being constructed, the wires won't change. Compute this on startup, so usages can
     *         get circuit.topLightBulbWires
     */
    // getTopLightBulbWires: function() {
    //   return this.wires.filter( function( wire ) {
    //     return wire.connectionPoint === CLBConstants.WIRE_CONNECTIONS.LIGHT_BULB_TOP;
    //   } );
    // },

    /**
     * Get all bottom wires that are connected to the light bulb.
     * REVIEW: visibility doc
     * REVIEW: Once the circuit is being constructed, the wires won't change. Compute this on startup, so usages can
     *         get circuit.bottomLightBulbWires
     */
    // getBottomLightBulbWires: function() {
    //   return this.wires.filter( function( wire ) {
    //     return wire.connectionPoint === CLBConstants.WIRE_CONNECTIONS.LIGHT_BULB_BOTTOM;
    //   } );
    // },

    /**
     * Get all the top wires that connect the circuit switch.
     * REVIEW: visibility doc
     * REVIEW: Once the circuit is being constructed, the switches won't change. Compute on startup, so usages can get
     *         circuit.topSwitchWires
     * REVIEW: Doc return type
     */
    // getTopSwitchWires: function() {
    //   var topCircuitSwitchWires = [];
    //   this.circuitSwitches.forEach( function( circuitSwitch ) {
    //     var switchWire = circuitSwitch.switchWire;
    //     if ( switchWire.connectionPoint === CLBConstants.WIRE_CONNECTIONS.CIRCUIT_SWITCH_TOP ) {
    //       topCircuitSwitchWires.push( switchWire );
    //     }
    //   } );
    //   return topCircuitSwitchWires;
    // },

    /**
     * Get all the bottom wires that connect the circuit switch.
     * REVIEW: visibility doc
     * REVIEW: Once the circuit is being constructed, the wires won't change. Compute on startup, so usages can get
     *         circuit.bottomSwitchWires
     *
     * @returns {Wire[]}
     */
    // getBottomSwitchWires: function() {
    //   var bottomCircuitSwitchWires = [];
    //   this.circuitSwitches.forEach( function( circuitSwitch ) {
    //     var switchWire = circuitSwitch.switchWire;
    //     if ( switchWire.connectionPoint === CLBConstants.WIRE_CONNECTIONS.CIRCUIT_SWITCH_BOTTOM ) {
    //       bottomCircuitSwitchWires.push( switchWire );
    //     }
    //   } );
    //   return bottomCircuitSwitchWires;
    // },

    /**
     * Get all the top wires that are connected to the capacitor.
     * REVIEW: visibility doc
     * REVIEW: Once the circuit is being constructed, the wires won't change. Compute on startup, so usages can get
     *         circuit.topSwitchWires
     *
     * @returns {Wire[]}
     */
    // getTopCapacitorWires: function() {
    //   return this.wires.filter( function( wire ) {
    //     return wire.connectionPoint === CLBConstants.WIRE_CONNECTIONS.CAPACITOR_TOP;
    //   } );
    // },

    /**
     * Get all the bottom wires that are connected to the capacitor.
     * REVIEW: visibility doc
     * REVIEW: Once the circuit is being constructed, the wires won't change. Compute on startup, so usages can get
     *         circuit.topSwitchWires
     *
     * @returns {Wire[]}
     */
    // getBottomCapacitorWires: function() {
    //   return this.wires.filter( function( wire ) {
    //     return wire.connectionPoint === CLBConstants.WIRE_CONNECTIONS.CAPACITOR_BOTTOM;
    //   } );
    // },

    /**
     * Gets the wire connected to the battery's bottom terminal.
     * REVIEW: visibility doc
     *
     * @returns {Wire[]} bottomWires
     */
    // getBottomWires: function() {
    //   return this.getBottomBatteryWires()
    //     .concat( this.getBottomLightBulbWires() )
    //     .concat( this.getBottomCapacitorWires() );
    // }
  } );
} );
