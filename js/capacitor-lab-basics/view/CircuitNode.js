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
  var PlateChargeControlNode = require( 'CAPACITOR_LAB_BASICS/capacitor-lab-basics/view/control/PlateChargeControlNode' );
  var CircuitConnectionEnum = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitConnectionEnum' );
  var Range = require( 'DOT/Range' );
  var BulbNode = require( 'CAPACITOR_LAB_BASICS/common/view/BulbNode' );

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
  function CircuitNode( circuit, modelViewTransform, plateChargeVisibleProperty, eFieldVisibleProperty, valuesVisibleProperty, maxPlateCharge,
                        maxEffectiveEField ) {

    Node.call( this ); // supertype constructor

    var thisNode = this;

    this.circuit = circuit;

    // circuit components
    var batteryNode = new BatteryNode( circuit.battery, CLConstants.BATTERY_VOLTAGE_RANGE );

    var capacitorNode = new CapacitorNode( circuit.capacitor, modelViewTransform, plateChargeVisibleProperty,
      eFieldVisibleProperty, maxPlateCharge, maxEffectiveEField );

    this.topWireNode = new WireNode( circuit.getTopWire() ); // @private
    this.bottomWireNode = new WireNode( circuit.getBottomWire() ); // @private

    var lightBulbNode = new BulbNode( circuit.currentAmplitudeProperty, circuit.lightBulb, modelViewTransform );

    // drag handles
    var plateSeparationDragHandleNode = new PlateSeparationDragHandleNode( circuit.capacitor, modelViewTransform, CLConstants.PLATE_SEPARATION_RANGE, valuesVisibleProperty );
    var plateAreaDragHandleNode = new PlateAreaDragHandleNode( circuit.capacitor, modelViewTransform, CLConstants.PLATE_WIDTH_RANGE, valuesVisibleProperty  );

    // current indicators
    this.topCurrentIndicatorNode = new CurrentIndicatorNode( circuit.topCurrentIndicator );
    this.bottomCurrentIndicatorNode = new CurrentIndicatorNode( circuit.bottomCurrentIndicator );

    // controls
    this.plateChargeControlNode = new PlateChargeControlNode( circuit, new Range( -maxPlateCharge, maxPlateCharge ) );

    // rendering order
    this.addChild( lightBulbNode );
    this.addChild( this.bottomWireNode );
    this.addChild( batteryNode );
    this.addChild( capacitorNode );
    this.addChild( this.topWireNode );
    this.addChild( this.topCurrentIndicatorNode );
    this.addChild( this.bottomCurrentIndicatorNode );
    this.addChild( plateSeparationDragHandleNode );
    this.addChild( plateAreaDragHandleNode );
    this.addChild( this.plateChargeControlNode );

    // layout TODO: Much of the layout will need to be fixed or tidied.  Many design decisions to be made.
    var x = 0;
    var y = 0;

    // battery
    batteryNode.center = modelViewTransform.modelToViewPosition( circuit.battery.location );

    // capacitor
    capacitorNode.center = modelViewTransform.modelToViewPosition( circuit.capacitor.location );

    // LightBulb - translate so that center is the center of the base.
    lightBulbNode.center = modelViewTransform.modelToViewPosition( circuit.lightBulb.location.plus( new Vector3( 0.0020, 0, 0 ) ) );

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

    // Plate Charge control
    this.plateChargeControlNode.center = batteryNode.center;
    //this.plateChargeControlNode.translation = ( modelViewTransform.modelToViewPosition( new Vector3( circuit.capacitor.location.x - 0.030, 0.001, 0 ) ) );

    // observers
    circuit.circuitConnectionProperty.link( function( circuitConnection ) {
      thisNode.updateConnectivity( circuitConnection );
    } );

  }

  return inherit( Node, CircuitNode, {

    // Updates the circuit components and controls to match the state of the battery connection.
    updateConnectivity: function( circuitConnection ) {

      // As long as the circuit is not open, the circuit is considered connected.
      var isBatteryConnected = ( circuitConnection === CircuitConnectionEnum.BATTERY_CONNECTED );
      var isCapacitorConnected = ( circuitConnection !== CircuitConnectionEnum.OPEN_CIRCUIT );

      // visible when battery is connected
      //this.topWireNode.visible = isConnected;
      //this.bottomWireNode.visible = isConnected;

      this.topCurrentIndicatorNode.setVisible( isBatteryConnected );
      this.bottomCurrentIndicatorNode.setVisible( isBatteryConnected );

      // plate charge control
      this.plateChargeControlNode.visible = !isCapacitorConnected;

    }
  } );

} );