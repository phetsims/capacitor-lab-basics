// Copyright 2002-2015, University of Colorado Boulder

/**
 * Circuit for the for the "Dielectric" module.  Contains the circuit components and controls for manipulating the
 * circuit.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var BatteryNode = require( 'CAPACITOR_LAB/common/view/BatteryNode' );
  var CapacitorNode = require( 'CAPACITOR_LAB/common/view/CapacitorNode' );
  var WireNode = require( 'CAPACITOR_LAB/common/view/WireNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var CLConstants = require( 'CAPACITOR_LAB/common/CLConstants' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * Constructor for a CircuitNode.
   *
   * @param {SingleCircuit} circuit
   * @param {CLModelViewTransform3D} modelViewTransform
   * @param {Property} plateChargeVisibleProperty
   * @param {Property} eFieldVisibleProperty
   * @param {number} maxPlateCharge
   * @param {number} maxEffectiveEField
   * @constructor
   */
  function CircuitNode( circuit, modelViewTransform, plateChargeVisibleProperty, eFieldVisibleProperty, maxPlateCharge,
                        maxEffectiveEField ) {

    Node.call( this ); // supertype constructor
    this.circuit = circuit;

    // circuit components
    var batteryNode = new BatteryNode( circuit.battery, CLConstants.BATTERY_VOLTAGE_RANGE );

    var capacitorNode = new CapacitorNode( circuit.capacitor, modelViewTransform, plateChargeVisibleProperty,
      eFieldVisibleProperty, maxPlateCharge, maxEffectiveEField );

    var topWireNode = new WireNode( circuit.getTopWire() );
    var bottomWireNode = new WireNode( circuit.getBottomWire() );

    // rendering order
    this.addChild( bottomWireNode );
    this.addChild( batteryNode );
    this.addChild( capacitorNode );
    this.addChild( topWireNode );
    //addChild( topCurrentIndicatorNode );
    //addChild( bottomCurrentIndicatorNode );
    //if ( dielectricVisible ) {
    //  addChild( dielectricOffsetDragHandleNode );
    //}
    //addChild( plateSeparationDragHandleNode );
    //addChild( plateAreaDragHandleNode );
    //addChild( batteryConnectionButtonNode );
    //addChild( plateChargeControlNode );

    // layout
    // battery
    batteryNode.center = modelViewTransform.modelToViewPosition( circuit.battery.location );

    // capacitor
    capacitorNode.center = modelViewTransform.modelToViewPosition( circuit.capacitor.location );

    // wires shapes are in model coordinate frame, so the nodes live at (0,0)
    // the following does nothing but it explicitly defines the layout.
    topWireNode.translation = new Vector2( 0, 0 );
    bottomWireNode.translation = new Vector2( 0, 0 );

  }

  return inherit( Node, CircuitNode );

} );