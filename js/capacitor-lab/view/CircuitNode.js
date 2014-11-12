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
   * @constructor
   */
  function CircuitNode( capacitorLabModel, options ) {

    Node.call( this, options );
    
    // Add the battery
    var batteryNode = new BatteryNode( capacitorLabModel, {
      x: -384,
      y: -84,
    } );
    this.addChild( batteryNode );
    
    // Add the capacitor plates
    var capacitor = new CapacitorNode( capacitorLabModel, {x: 240, y: 250, scale: .8} );
    this.addChild( capacitor );
    
    // Add the wire connecting the plates to the battery
    var wireNode = new WireNode(capacitorLabModel, {x: 8, y: 122});
    this.addChild( wireNode );
    
    var plateChargeSlider = new PlateChargeSlider(capacitorLabModel, {x: 350, y: 10});
    this.addChild( plateChargeSlider );
  }

  return inherit( Node, CircuitNode);
} );