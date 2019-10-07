// Copyright 2015-2019, University of Colorado Boulder

/**
 * Base type for the circuit nodes in Capacitor Lab: Basics.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BatteryNode = require( 'CAPACITOR_LAB_BASICS/common/view/BatteryNode' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const CapacitorConstants = require( 'SCENERY_PHET/capacitor/CapacitorConstants' );
  const capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  const CapacitorNode = require( 'SCENERY_PHET/capacitor/CapacitorNode' );
  const CircuitState = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitState' );
  const CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  const CurrentIndicatorNode = require( 'CAPACITOR_LAB_BASICS/common/view/CurrentIndicatorNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PlateAreaDragHandleNode = require( 'CAPACITOR_LAB_BASICS/common/view/drag/PlateAreaDragHandleNode' );
  const PlateSeparationDragHandleNode = require( 'CAPACITOR_LAB_BASICS/common/view/drag/PlateSeparationDragHandleNode' );
  const SwitchNode = require( 'CAPACITOR_LAB_BASICS/common/view/SwitchNode' );
  const Vector2 = require( 'DOT/Vector2' );
  const WireNode = require( 'CAPACITOR_LAB_BASICS/common/view/WireNode' );

  /**
   * @constructor
   *
   * @param {CLBModel} model
   * @param {Tandem} tandem
   */

  function CLBCircuitNode( model, tandem ) {

    // Validate number of switches in model
    assert && assert( model.circuit.circuitSwitches.length === 2,
      'This circuit should have two switches: top and bottom.' );

    Node.call( this );
    const self = this;

    // @public {Circuit}
    this.circuit = model.circuit;

    // circuit components

    // @private {BatteryNode}
    this.batteryNode = new BatteryNode( this.circuit.battery, CLBConstants.BATTERY_VOLTAGE_RANGE, tandem.createTandem( 'batteryNode' ) );

    const capacitorNode = new CapacitorNode(
      this.circuit,
      model.modelViewTransform,
      model.plateChargesVisibleProperty,
      model.electricFieldVisibleProperty,
      tandem.createTandem( 'capacitorNode' )
    );

    // @public {Node}
    this.topWireNode = new Node();
    this.bottomWireNode = new Node();

    this.circuit.topWires.forEach( function( topWire ) {
      self.topWireNode.addChild( new WireNode( topWire ) );
    } );
    this.circuit.bottomWires.forEach( function( bottomWire ) {
      self.bottomWireNode.addChild( new WireNode( bottomWire ) );
    } );

    // Don't allow both switches to be controlled at once
    const switchControlledProperty = new BooleanProperty( false );

    // @private {Array.<SwitchNode>}
    this.circuitSwitchNodes = [];
    self.circuitSwitchNodes.push( new SwitchNode(
      this.circuit.circuitSwitches[ 0 ],
      model.modelViewTransform,
      switchControlledProperty,
      tandem.createTandem( 'topSwitchNode' )
    ) );
    self.circuitSwitchNodes.push( new SwitchNode(
      this.circuit.circuitSwitches[ 1 ],
      model.modelViewTransform,
      switchControlledProperty,
      tandem.createTandem( 'bottomSwitchNode' )
    ) );

    // Once the circuit has been built, if the circuit connection has changed, the switch has been used.
    this.circuitSwitchNodes.forEach( function( switchNode ) {
      switchNode.circuitSwitch.circuitConnectionProperty.lazyLink( function( connection ) {
        if ( connection !== switchNode.circuitSwitch.circuitConnectionProperty.initialValue &&
             connection !== CircuitState.SWITCH_IN_TRANSIT ) {
          model.switchUsedProperty.set( true );
        }
      } );
    } );

    // Make the switch "hint" arrows disappear after first use of the switch (#94). This affects both screens
    // because a common reference to the switchUsedProperty is shared between the models.
    model.switchUsedProperty.link( function( switchUsed ) {
      self.circuitSwitchNodes.forEach( function( switchNode ) {
        switchNode.switchCueArrow.setVisible( !switchUsed );
      } );
    } );

    // drag handles
    const plateSeparationDragHandleNode = new PlateSeparationDragHandleNode( this.circuit.capacitor, model.modelViewTransform,
      CapacitorConstants.PLATE_SEPARATION_RANGE, tandem.createTandem( 'plateSeparationDragHandleNode' ) );
    const plateAreaDragHandleNode = new PlateAreaDragHandleNode( this.circuit.capacitor, model.modelViewTransform,
      CapacitorConstants.PLATE_WIDTH_RANGE, tandem.createTandem( 'plateAreaDragHandleNode' ) );

    // current indicators
    this.batteryTopCurrentIndicatorNode = new CurrentIndicatorNode(
      this.circuit.currentAmplitudeProperty,
      0,
      model.currentOrientationProperty,
      model.arrowColorProperty,
      model.stepEmitter,
      tandem.createTandem( 'batteryTopCurrentIndicatorNode' ) );
    this.batteryBottomCurrentIndicatorNode = new CurrentIndicatorNode(
      this.circuit.currentAmplitudeProperty,
      Math.PI,
      model.currentOrientationProperty,
      model.arrowColorProperty,
      model.stepEmitter,
      tandem.createTandem( 'batteryBottomCurrentIndicatorNode' ) );

    // rendering order
    this.circuitSwitchNodes.forEach( function( switchNode ) {
      switchNode.connectionAreaNodes.forEach( function( connectionAreaNode ) {
        self.addChild( connectionAreaNode );
      } );
    } );
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

    // battery
    this.batteryNode.center = model.modelViewTransform.modelToViewPosition( this.circuit.battery.location );

    // capacitor
    capacitorNode.center = model.modelViewTransform.modelToViewPosition( this.circuit.capacitor.location );

    // top current indicator
    const x = this.batteryNode.right + ( this.circuitSwitchNodes[ 0 ].left - this.batteryNode.right ) / 2;

    // current indicator offset
    const indicatorOffset = 7 / 2;
    let y = this.topWireNode.bounds.minY + indicatorOffset;
    this.batteryTopCurrentIndicatorNode.translate( x, y );

    // bottom current indicator
    y = this.bottomWireNode.bounds.getMaxY() - indicatorOffset;
    this.batteryBottomCurrentIndicatorNode.translate( x, y );

    // wires shapes are in model coordinate frame, so the nodes live at (0,0) the following does nothing but it
    // explicitly defines the layout.
    this.topWireNode.translation = new Vector2( 0, 0 );
    this.bottomWireNode.translation = new Vector2( 0, 0 );

    // observer for visibility of the current indicators
    model.currentVisibleProperty.link( function( currentIndicatorsVisible ) {
      self.batteryTopCurrentIndicatorNode.setVisible( currentIndicatorsVisible );
      self.batteryBottomCurrentIndicatorNode.setVisible( currentIndicatorsVisible );
    } );
  }

  capacitorLabBasics.register( 'CLBCircuitNode', CLBCircuitNode );

  return inherit( Node, CLBCircuitNode );
} );
