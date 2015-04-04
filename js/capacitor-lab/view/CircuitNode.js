//  Copyright 2002-2014, University of Colorado Boulder

/**
 *
 * @author Emily Randall
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var BatteryNode = require( 'CAPACITOR_LAB/capacitor-lab/view/BatteryNode' );
  var CapacitorNode = require( 'CAPACITOR_LAB/capacitor-lab/view/CapacitorNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var WireNode = require( 'CAPACITOR_LAB/capacitor-lab/view/WireNode' );
  var PlateChargeSlider = require( 'CAPACITOR_LAB/capacitor-lab/view/PlateChargeSlider' );

  /**
   * Constructor for the circuit
   * Contains the battery, the capacitor, the wires, and the slider to control plate charge
   */
  function CircuitNode( capacitorLabModel, options ) {

    Node.call( this, options );
    
    // Add the battery
    this.batteryNode = new BatteryNode( capacitorLabModel, {
      x: -384,
      y: -84,
    } );
    this.addChild( this.batteryNode );
    
    // Add the capacitor plates
    this.capacitor = new CapacitorNode( capacitorLabModel, {x: 255, y: 250, scale: 0.8} );
    this.addChild( this.capacitor );
    
    // Add the wire connecting the plates to the battery
    this.wireNode = new WireNode(capacitorLabModel, this.capacitor.topPlate, this.capacitor.bottomPlate, {x: 8, y: 122});
    this.addChild( this.wireNode );
    
    // Add the slider that controls plate charge when the battery is disconnected
    this.plateChargeSlider = new PlateChargeSlider(capacitorLabModel, {x: 320, y: -15});
    this.addChild( this.plateChargeSlider );
  }

  return inherit( Node, CircuitNode);
} );