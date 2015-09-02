// Copyright 2002-2015, University of Colorado Boulder

/**
 *
 * @author Emily Randall
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var BatteryNode = require( 'CAPACITOR_LAB_BASICS/capacitor-lab/view/BatteryNode' );
  var CapacitorNode = require( 'CAPACITOR_LAB_BASICS/capacitor-lab/view/CapacitorNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var WireNode = require( 'CAPACITOR_LAB_BASICS/capacitor-lab/view/WireNode' );
  var PlateChargeSlider = require( 'CAPACITOR_LAB_BASICS/capacitor-lab/view/PlateChargeSlider' );

  /**
   * Constructor for the circuit
   * Contains the battery, the capacitor, the wires, and the slider to control plate charge
   * @param {CapacitorLabBasicsModel} capacitorLabBasicsModel
   */
  function CircuitNode( capacitorLabBasicsModel, options ) {

    Node.call( this, options );

    // Add the battery
    this.batteryNode = new BatteryNode( capacitorLabBasicsModel, {
      x: -384,
      y: -84,
    } );
    this.addChild( this.batteryNode );

    // Add the capacitor plates
    this.capacitor = new CapacitorNode( capacitorLabBasicsModel, {
      x: 255,
      y: 250,
      scale: 0.8
    } );
    this.addChild( this.capacitor );

    // Add the wire connecting the plates to the battery
    this.wireNode = new WireNode( capacitorLabBasicsModel, this.capacitor.topPlate, this.capacitor.bottomPlate, {
      x: 8,
      y: 122
    } );
    this.addChild( this.wireNode );

    // Add the slider that controls plate charge when the battery is disconnected
    this.plateChargeSlider = new PlateChargeSlider( capacitorLabBasicsModel, {
      x: 320,
      y: -15
    } );
    this.addChild( this.plateChargeSlider );
  }

  return inherit( Node, CircuitNode );
} );