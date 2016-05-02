// Copyright 2015, University of Colorado Boulder

/**
 * Base type for the circuit nodes in Capacitor Lab: Basics.
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
  var SwitchNode = require( 'CAPACITOR_LAB_BASICS/common/view/SwitchNode' );
  var CurrentIndicatorNode = require( 'CAPACITOR_LAB_BASICS/common/view/CurrentIndicatorNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var Vector2 = require( 'DOT/Vector2' );
  var PlateSeparationDragHandleNode = require( 'CAPACITOR_LAB_BASICS/common/view/drag/PlateSeparationDragHandleNode' );
  var PlateAreaDragHandleNode = require( 'CAPACITOR_LAB_BASICS/common/view/drag/PlateAreaDragHandleNode' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  /**
   * Constructor for a CLBCircuitNode.
   *
   * @param {CapacitanceCircuit} circuit
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Property} plateChargeVisibleProperty
   * @param {Property} eFieldVisibleProperty
   * @param {Property.<boolean>} currentIndicatorsVisibleProeprty
   * @param {number} maxPlateCharge
   * @param {number} maxEffectiveEField
   * @constructor
   */
  // function CLBCircuitNode( circuit, modelViewTransform, plateChargeVisibleProperty, eFieldVisibleProperty,
  //   currentIndicatorsVisibleProperty, maxPlateCharge, maxEffectiveEField, tandem ) {

  function CLBCircuitNode(
    circuit,
    modelViewTransform,
    plateChargeVisibleProperty,
    eFieldVisibleProperty,
    currentIndicatorsVisibleProperty,
    maxPlateCharge,
    maxEffectiveEField,
    tandem ) {

    Node.call( this );
    var thisNode = this;

    this.circuit = circuit; // @public

    // circuit components
    this.batteryNode = new BatteryNode( circuit.battery, CLBConstants.BATTERY_VOLTAGE_RANGE, tandem );

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

    // switches
    this.circuitSwitchNodes = [];
    circuit.circuitSwitches.forEach( function( circuitSwitch ) {
      thisNode.circuitSwitchNodes.push( new SwitchNode( circuitSwitch, modelViewTransform ) );
    } );

    // drag handles
    var plateSeparationDragHandleNode = new PlateSeparationDragHandleNode( circuit.capacitor, modelViewTransform,
      CLBConstants.PLATE_SEPARATION_RANGE, tandem.createTandem( 'plateSeparationDragHandleNode' ) );
    var plateAreaDragHandleNode = new PlateAreaDragHandleNode( circuit.capacitor, modelViewTransform,
      CLBConstants.PLATE_WIDTH_RANGE, tandem.createTandem( 'plateAreaDragHandleNode' ) );

    // current indicators
    this.batteryTopCurrentIndicatorNode = new CurrentIndicatorNode( circuit.currentAmplitudeProperty, 0 );
    this.batteryBottomCurrentIndicatorNode = new CurrentIndicatorNode( circuit.currentAmplitudeProperty, Math.PI );

    // rendering order
    this.addChild( this.bottomWireNode );
    this.addChild( this.batteryNode );
    this.addChild( capacitorNode );
    this.addChild( this.topWireNode );
    this.addChild( this.circuitSwitchNodes[ 0 ] );
    this.addChild( this.batteryTopCurrentIndicatorNode );
    this.addChild( this.batteryBottomCurrentIndicatorNode );
    this.addChild( plateSeparationDragHandleNode );
    this.addChild( plateAreaDragHandleNode );
    this.addChild( this.circuitSwitchNodes[ 1 ] );

    // layout
    // TODO: There are still layout design descisions to be made by the designers, revisit this
    var x = 0;
    var y = 0;

    // battery
    this.batteryNode.center = modelViewTransform.modelToViewPosition( circuit.battery.location );

    // capacitor
    capacitorNode.center = modelViewTransform.modelToViewPosition( circuit.capacitor.location );

    // top current indicator
    x = this.batteryNode.right + ( this.circuitSwitchNodes[ 0 ].left - this.batteryNode.right ) / 2;
    y = this.topWireNode.bounds.minY + ( 7 / 2 ); // TODO clean up after discussion of feature.
    this.batteryTopCurrentIndicatorNode.translate( x, y );

    // bottom current indicator
    y = this.bottomWireNode.bounds.getMaxY() - ( 7 / 2 );
    this.batteryBottomCurrentIndicatorNode.translate( x, y );

    // wires shapes are in model coordinate frame, so the nodes live at (0,0) the following does nothing but it
    // explicitly defines the layout.
    this.topWireNode.translation = new Vector2( 0, 0 );
    this.bottomWireNode.translation = new Vector2( 0, 0 );

    // observer for visibility of the current indicators
    currentIndicatorsVisibleProperty.link( function( currentIndicatorsVisible ) {
      thisNode.batteryTopCurrentIndicatorNode.setVisible( currentIndicatorsVisible );
      thisNode.batteryBottomCurrentIndicatorNode.setVisible( currentIndicatorsVisible );
    } );

  }

  capacitorLabBasics.register( 'CLBCircuitNode', CLBCircuitNode );

  return inherit( Node, CLBCircuitNode, {

    /**
     * Update the visibility of the current indicator nodes, implemented in
     * each of the circuit sub types.
     *
     * @param  {object} circuitConnection
     * @param  {Property<boolean>} currentIndicatorsVisible
     */
    updateCurrentVisibility: function( circuitConnection, currentIndicatorsVisible ) {
      console.error( 'updateCurrentVisibility should be implemented in descendant types' );
    }

  } );
} );

