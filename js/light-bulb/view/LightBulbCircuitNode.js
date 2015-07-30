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
  var BatteryNode = require( 'CAPACITOR_LAB_BASICS/common/view/BatteryNode' );
  var CapacitorNode = require( 'CAPACITOR_LAB_BASICS/common/view/CapacitorNode' );
  var WireNode = require( 'CAPACITOR_LAB_BASICS/common/view/WireNode' );
  var CurrentIndicatorNode = require( 'CAPACITOR_LAB_BASICS/common/view/CurrentIndicatorNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var CLConstants = require( 'CAPACITOR_LAB_BASICS/common/CLConstants' );
  var Vector2 = require( 'DOT/Vector2' );
  var Vector3 = require( 'DOT/Vector3' );
  var PlateSeparationDragHandleNode = require( 'CAPACITOR_LAB_BASICS/common/view/drag/PlateSeparationDragHandleNode' );
  var PlateAreaDragHandleNode = require( 'CAPACITOR_LAB_BASICS/common/view/drag/PlateAreaDragHandleNode' );
  var CircuitConnectionEnum = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitConnectionEnum' );
  var BulbNode = require( 'CAPACITOR_LAB_BASICS/common/view/BulbNode' );
  var SwitchNode = require( 'CAPACITOR_LAB_BASICS/common/view/SwitchNode' );

  /**
   * Constructor for a CircuitNode.
   *
   * @param {LightBulbCircuit} circuit
   * @param {CLModelViewTransform3D} modelViewTransform
   * @param {Property} plateChargeVisibleProperty
   * @param {Property} eFieldVisibleProperty
   * @param {Property.<boolean>} valuesVisibleProperty
   * @param {number} maxPlateCharge
   * @param {number} maxEffectiveEField
   * @constructor
   */
  function LightBulbCircuitNode( circuit, modelViewTransform, plateChargeVisibleProperty, eFieldVisibleProperty, valuesVisibleProperty, maxPlateCharge,
                                 maxEffectiveEField ) {

    Node.call( this ); // supertype constructor

    var thisNode = this;

    this.circuit = circuit;

    // circuit components
    var batteryNode = new BatteryNode( circuit.battery, CLConstants.BATTERY_VOLTAGE_RANGE );

    var capacitorNode = new CapacitorNode( circuit.capacitor, modelViewTransform, plateChargeVisibleProperty,
      eFieldVisibleProperty, maxPlateCharge, maxEffectiveEField );

    this.topWireNode = new Node();
    this.bottomWireNode = new Node();
    this.circuit.getTopWires().forEach( function( topWire ) {
      thisNode.topWireNode.addChild( new WireNode( topWire ) );
    } );
    this.circuit.getBottomWires().forEach( function( bottomWire ) {
      thisNode.bottomWireNode.addChild( new WireNode( bottomWire ) );
    } );
    //this.topWireNode = new WireNode( circuit.getTopWire() ); // @private
    //this.bottomWireNode = new WireNode( circuit.getBottomWire() ); // @private

    var lightBulbNode = new BulbNode( circuit.lightBulb, circuit.capacitor.platesVoltageProperty, circuit.circuitConnectionProperty, modelViewTransform );

    // switches
    this.circuitSwitchNodes = [];
    circuit.circuitSwitches.forEach( function( circuitSwitch ) {
      thisNode.circuitSwitchNodes.push( new SwitchNode( circuitSwitch, modelViewTransform ) );
    } );

    // drag handles
    var plateSeparationDragHandleNode = new PlateSeparationDragHandleNode( circuit.capacitor, modelViewTransform, CLConstants.PLATE_SEPARATION_RANGE, valuesVisibleProperty );
    var plateAreaDragHandleNode = new PlateAreaDragHandleNode( circuit.capacitor, modelViewTransform, CLConstants.PLATE_WIDTH_RANGE, valuesVisibleProperty );

    // current indicators
    this.batteryTopCurrentIndicatorNode = new CurrentIndicatorNode( circuit.batteryTopCurrentIndicator, 0 );
    this.batteryBottomCurrentIndicatorNode = new CurrentIndicatorNode( circuit.batteryBottomCurrentIndicator, Math.PI );

    this.bulbTopCurrentIndicatorNode = new CurrentIndicatorNode( circuit.bulbTopCurrentIndicator, 0 );
    this.bulbBottomCurrentIndicatorNode = new CurrentIndicatorNode( circuit.bulbBottomCurrentIndicator, Math.PI );

    // rendering order
    this.addChild( this.bottomWireNode );
    this.addChild( batteryNode );
    this.addChild( capacitorNode );
    this.addChild( this.topWireNode );
    this.addChild( lightBulbNode );
    this.circuitSwitchNodes.forEach( function( circuitSwitchNode ) {
      thisNode.addChild( circuitSwitchNode );
    } );
    this.addChild( this.batteryTopCurrentIndicatorNode );
    this.addChild( this.batteryBottomCurrentIndicatorNode );
    this.addChild( this.bulbTopCurrentIndicatorNode );
    this.addChild( this.bulbBottomCurrentIndicatorNode );
    this.addChild( plateSeparationDragHandleNode );
    this.addChild( plateAreaDragHandleNode );

    // layout TODO: Much of the layout will need to be fixed or tidied.  Many design decisions to be made.
    var x = 0;
    var y = 0;

    // battery
    batteryNode.center = modelViewTransform.modelToViewPosition( circuit.battery.location );

    // capacitor
    capacitorNode.center = modelViewTransform.modelToViewPosition( circuit.capacitor.location );

    // LightBulb - translate so that center is the center of the base.
    lightBulbNode.center = modelViewTransform.modelToViewPosition( circuit.lightBulb.location.plus( new Vector3( 0.0020, 0, 0 ) ) );

    // top left current indicator
    x = batteryNode.centerX + ( this.circuitSwitchNodes[ 0 ].left - batteryNode.centerX ) / 2 + this.batteryTopCurrentIndicatorNode.width / 2;
    y = this.topWireNode.bounds.minY + ( 7 / 2 ); // TODO clean up after discussion of feature.
    this.batteryTopCurrentIndicatorNode.translate( x, y );

    // bottom left current indicator
    x = batteryNode.centerX + ( this.circuitSwitchNodes[ 0 ].left - batteryNode.centerX ) / 2 + this.batteryBottomCurrentIndicatorNode.width / 2;
    y = this.bottomWireNode.bounds.getMaxY() - ( 7 / 2 );
    this.batteryBottomCurrentIndicatorNode.translate( x, y );

    // top right current indicator
    x = this.circuitSwitchNodes[ 0 ].right + ( lightBulbNode.left - this.circuitSwitchNodes[ 0 ].right ) / 2;
    y = this.topWireNode.bounds.minY + ( 7 / 2 );
    this.bulbTopCurrentIndicatorNode.translate( x, y );

    // bottom right current indicator
    x = this.circuitSwitchNodes[ 0 ].right + ( lightBulbNode.left - this.circuitSwitchNodes[ 0 ].right ) / 2;
    //x = ( lightBulbNode.left - this.circuitSwitchNodes[ 0 ].centerX ) / 2;
    y = this.bottomWireNode.bounds.maxY - ( 7 / 2 );
    this.bulbBottomCurrentIndicatorNode.translate( x, y );

    // wires shapes are in model coordinate frame, so the nodes live at (0,0) the following does nothing
    this.topWireNode.translation = new Vector2( 0, 0 );
    this.bottomWireNode.translation = new Vector2( 0, 0 );

    // observers
    circuit.circuitConnectionProperty.link( function( circuitConnection ) {
      thisNode.updateConnectivity( circuitConnection );
    } );

  }

  return inherit( Node, LightBulbCircuitNode, {

    // Updates the circuit components and controls to match the state of the battery connection.
    updateConnectivity: function( circuitConnection ) {

      // As long as the circuit is not open, the circuit is considered connected.
      var isBatteryConnected = ( circuitConnection === CircuitConnectionEnum.BATTERY_CONNECTED );
      var isLightBulbConnected = ( circuitConnection === CircuitConnectionEnum.LIGHT_BULB_CONNECTED );

      this.batteryTopCurrentIndicatorNode.setVisible( isBatteryConnected );
      this.batteryBottomCurrentIndicatorNode.setVisible( isBatteryConnected );

      this.bulbTopCurrentIndicatorNode.setVisible( isLightBulbConnected );
      this.bulbBottomCurrentIndicatorNode.setVisible( isLightBulbConnected );
    }
  } );

} );