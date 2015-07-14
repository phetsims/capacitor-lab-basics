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
  var PlateSeparationDragHandleNode = require( 'CAPACITOR_LAB_BASICS/common/view/drag/PlateSeparationDragHandleNode' );
  var PlateAreaDragHandleNode = require( 'CAPACITOR_LAB_BASICS/common/view/drag/PlateAreaDragHandleNode' );

  /**
   * Constructor for a CircuitNode.
   *
   * @param {SingleCircuit} circuit
   * @param {CLModelViewTransform3D} modelViewTransform
   * @param {Property} plateChargeVisibleProperty
   * @param {Property} eFieldVisibleProperty
   * @param {Property.<boolean>} valuesVisibleProperty
   * @param {number} maxPlateCharge
   * @param {number} maxEffectiveEField
   * @constructor
   */
  function IntroCircuitNode( circuit, modelViewTransform, plateChargeVisibleProperty, eFieldVisibleProperty, valuesVisibleProperty, maxPlateCharge,
                             maxEffectiveEField ) {

    Node.call( this );

    this.circuit = circuit;

    // circuit components
    var batteryNode = new BatteryNode( circuit.battery, CLConstants.BATTERY_VOLTAGE_RANGE );

    var capacitorNode = new CapacitorNode( circuit.capacitor, modelViewTransform, plateChargeVisibleProperty,
      eFieldVisibleProperty, maxPlateCharge, maxEffectiveEField );

    this.topWireNode = new WireNode( circuit.getTopWire() ); // @private
    this.bottomWireNode = new WireNode( circuit.getBottomWire() ); // @private

    // drag handles
    var plateSeparationDragHandleNode = new PlateSeparationDragHandleNode( circuit.capacitor, modelViewTransform, CLConstants.PLATE_SEPARATION_RANGE, valuesVisibleProperty );
    var plateAreaDragHandleNode = new PlateAreaDragHandleNode( circuit.capacitor, modelViewTransform, CLConstants.PLATE_WIDTH_RANGE, valuesVisibleProperty );

    // current indicators
    this.topCurrentIndicatorNode = new CurrentIndicatorNode( circuit, 0 );
    this.bottomCurrentIndicatorNode = new CurrentIndicatorNode( circuit, Math.PI );

    // rendering order
    this.addChild( this.bottomWireNode );
    this.addChild( batteryNode );
    this.addChild( capacitorNode );
    this.addChild( this.topWireNode );
    this.addChild( this.topCurrentIndicatorNode );
    this.addChild( this.bottomCurrentIndicatorNode );
    this.addChild( plateSeparationDragHandleNode );
    this.addChild( plateAreaDragHandleNode );

    // layout TODO: Much of the layout will need to be fixed or tidied.  Many design decisions to be made.
    var x = 0;
    var y = 0;

    // battery
    batteryNode.center = modelViewTransform.modelToViewPosition( circuit.battery.location );

    // capacitor
    capacitorNode.center = modelViewTransform.modelToViewPosition( circuit.capacitor.location );

    // top current indicator
    var topWireThickness = modelViewTransform.modelToViewDeltaXYZ( circuit.getTopWire().thickness, 0, 0 ).x;
    x = batteryNode.centerX + ( capacitorNode.centerX - batteryNode.centerX ) / 2;
    //x = this.topWireNode.bounds.centerX;
    y = this.topWireNode.bounds.minY + ( topWireThickness / 2 ) + 70; // TODO clean up after discussion of feature.
    this.topCurrentIndicatorNode.translate( x, y );

    // bottom current indicator
    var bottomWireThickness = modelViewTransform.modelToViewDeltaXYZ( circuit.getBottomWire.thickness, 0, 0 ).x;
    x = batteryNode.centerX + ( capacitorNode.centerX - batteryNode.centerX ) / 2;
    //x = this.bottomWireNode.bounds.getCenterX();
    y = this.bottomWireNode.bounds.getMaxY() - ( bottomWireThickness / 2 );
    this.bottomCurrentIndicatorNode.translate( x, y );

    // wires shapes are in model coordinate frame, so the nodes live at (0,0) the following does nothing but it
    // explicitly defines the layout.
    this.topWireNode.translation = new Vector2( 0, 0 );
    this.bottomWireNode.translation = new Vector2( 0, 0 );

  }

  return inherit( Node, IntroCircuitNode );

} );