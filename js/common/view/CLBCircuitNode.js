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
  var TNode = require('ifphetio!PHET_IO/types/scenery/nodes/TNode');

  /**
   * Constructor for a CLBCircuitNode.
   *
   * @param {CLBModel} model
   * @param {Tandem} tandem
   * @constructor
   */

  function CLBCircuitNode( model, tandem ) {

    // Validate number of switches in model
    assert && assert( model.circuit.circuitSwitches.length === 2,
      'This circuit should have two switches: top and bottom.' );

    Node.call( this );
    var thisNode = this;

    this.circuit = model.circuit; // @public

    // circuit components
    this.batteryNode = new BatteryNode( this.circuit.battery, CLBConstants.BATTERY_VOLTAGE_RANGE,
      tandem.createTandem( 'batteryNode' ) );
    var capacitorNode = new CapacitorNode( this.circuit, model.modelViewTransform, model.plateChargesVisibleProperty,
      model.eFieldVisibleProperty, tandem.createTandem( 'capacitorNode' ) );

    this.topWireNode = new Node();
    this.bottomWireNode = new Node();
    this.circuit.getTopWires().forEach( function( topWire ) {
      thisNode.topWireNode.addChild( new WireNode( topWire ) );
    } );
    this.circuit.getBottomWires().forEach( function( bottomWire ) {
      thisNode.bottomWireNode.addChild( new WireNode( bottomWire ) );
    } );

    tandem.createTandem( 'topWireNode' ).addInstance( this.topWireNode, TNode );
    tandem.createTandem( 'bottomWireNode' ).addInstance( this.bottomWireNode, TNode );

    this.circuitSwitchNodes = [];
    thisNode.circuitSwitchNodes.push( new SwitchNode( this.circuit.circuitSwitches[ 0 ], model.modelViewTransform,
      tandem.createTandem( 'topSwitchNode' ) ) );
    thisNode.circuitSwitchNodes.push( new SwitchNode( this.circuit.circuitSwitches[ 1 ], model.modelViewTransform,
      tandem.createTandem( 'bottomSwitchNode' ) ) );

    // Once the circuit has been built, if the circuit connection has changed, the switch has been used.
    this.circuitSwitchNodes.forEach( function( switchNode ) {
      switchNode.circuitSwitch.circuitConnectionProperty.lazyLink( function( connection ) {
        model.switchUsedProperty.set( true );
      } );
    } );

    // Make the switch "hint" arrows disappear after first use of the switch (#94). This affects both screens
    // because a common reference to the switchUsedProperty is shared between the models.
    model.switchUsedProperty.link( function( switchUsed ) {
      thisNode.circuitSwitchNodes.forEach( function( switchNode ) {
        switchNode.switchCueArrow.setVisible( !switchUsed );
      } );
    } );

    // drag handles
    var plateSeparationDragHandleNode = new PlateSeparationDragHandleNode( this.circuit.capacitor, model.modelViewTransform,
      CLBConstants.PLATE_SEPARATION_RANGE, tandem.createTandem( 'plateSeparationDragHandleNode' ) );
    var plateAreaDragHandleNode = new PlateAreaDragHandleNode( this.circuit.capacitor, model.modelViewTransform,
      CLBConstants.PLATE_WIDTH_RANGE, tandem.createTandem( 'plateAreaDragHandleNode' ) );

    // current indicators
    this.batteryTopCurrentIndicatorNode = new CurrentIndicatorNode( this.circuit.currentAmplitudeProperty, 0 );
    this.batteryBottomCurrentIndicatorNode = new CurrentIndicatorNode( this.circuit.currentAmplitudeProperty, Math.PI );

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
    var x = 0;
    var y = 0;

    // battery
    this.batteryNode.center = model.modelViewTransform.modelToViewPosition( this.circuit.battery.location );

    // capacitor
    capacitorNode.center = model.modelViewTransform.modelToViewPosition( this.circuit.capacitor.location );

    // top current indicator
    x = this.batteryNode.right + ( this.circuitSwitchNodes[ 0 ].left - this.batteryNode.right ) / 2;

    // current indicator offset
    var indicatorOffset = 7 / 2;
    y = this.topWireNode.bounds.minY + indicatorOffset;
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
     * @param  {Property.<boolean>} currentIndicatorsVisible
     */
    updateCurrentVisibility: function( circuitConnection, currentIndicatorsVisible ) {
      console.error( 'updateCurrentVisibility should be implemented in descendant types' );
    }

  } );
} );

