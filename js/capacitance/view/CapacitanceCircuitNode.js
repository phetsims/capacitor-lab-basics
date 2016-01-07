// Copyright 2015, University of Colorado Boulder

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
  var SwitchNode = require( 'CAPACITOR_LAB_BASICS/common/view/SwitchNode' );
  var CurrentIndicatorNode = require( 'CAPACITOR_LAB_BASICS/common/view/CurrentIndicatorNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var CLConstants = require( 'CAPACITOR_LAB_BASICS/common/CLConstants' );
  var Vector2 = require( 'DOT/Vector2' );
  var PlateSeparationDragHandleNode = require( 'CAPACITOR_LAB_BASICS/common/view/drag/PlateSeparationDragHandleNode' );
  var PlateAreaDragHandleNode = require( 'CAPACITOR_LAB_BASICS/common/view/drag/PlateAreaDragHandleNode' );
  var AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );
  var Input = require( 'SCENERY/input/Input' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  // strings
  var accessibleCapacitanceCircuitString = require( 'string!CAPACITOR_LAB_BASICS/accessible.capacitanceCircuit' );
  var accessibleCircuitString = require( 'string!CAPACITOR_LAB_BASICS/accessible.circuit' );

  /**
   * Constructor for a CircuitNode.
   *
   * @param {CapacitanceCircuit} circuit
   * @param {CLModelViewTransform3D} modelViewTransform
   * @param {Property} plateChargeVisibleProperty
   * @param {Property} eFieldVisibleProperty
   * @param {Property.<boolean>} currentIndicatorsVisibleProeprty
   * @param {number} maxPlateCharge
   * @param {number} maxEffectiveEField
   * @constructor
   */
  function CapacitanceCircuitNode( circuit, modelViewTransform, plateChargeVisibleProperty, eFieldVisibleProperty,
                                   currentIndicatorsVisibleProperty, maxPlateCharge, maxEffectiveEField ) {

    Node.call( this );
    var thisNode = this;

    this.circuit = circuit; // @public

    // circuit components
    this.batteryNode = new BatteryNode( circuit.battery, CLConstants.BATTERY_VOLTAGE_RANGE, 'capacitance' );

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

    // switches
    this.circuitSwitchNodes = [];
    var isLive = true;
    circuit.circuitSwitches.forEach( function( circuitSwitch ) {
      thisNode.circuitSwitchNodes.push( new SwitchNode( circuitSwitch, isLive, modelViewTransform ) );
      isLive = false;
    } );

    // drag handles
    var plateSeparationDragHandleNode = new PlateSeparationDragHandleNode( circuit.capacitor, modelViewTransform, CLConstants.PLATE_SEPARATION_RANGE );
    var plateAreaDragHandleNode = new PlateAreaDragHandleNode( circuit.capacitor, modelViewTransform, CLConstants.PLATE_WIDTH_RANGE );

    // current indicators
    this.batteryTopCurrentIndicatorNode = new CurrentIndicatorNode( circuit.batteryTopCurrentIndicator, 0 );
    this.batteryBottomCurrentIndicatorNode = new CurrentIndicatorNode( circuit.batteryBottomCurrentIndicator, Math.PI );

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

    // layout TODO: Much of the layout will need to be fixed or tidied.  Many design decisions to be made.
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

    // observers
    currentIndicatorsVisibleProperty.link( function( currentIndicatorsVisible ) {
      thisNode.batteryTopCurrentIndicatorNode.setVisible( currentIndicatorsVisible );
      thisNode.batteryBottomCurrentIndicatorNode.setVisible( currentIndicatorsVisible );
    } );
    
    // return array of all accessible content in circuit
    var getAccessibleIds = function() {
      var accessibleIds = [];
      accessibleIds.push( thisNode.batteryNode.accessibleId );
      thisNode.circuitSwitchNodes.forEach( function( switchNode ) {
        switchNode.getAccessibleIds().forEach( function( id ) {
          accessibleIds.push( id );
        } );
      } );
      accessibleIds.push( plateSeparationDragHandleNode.accessibleId );
      accessibleIds.push( plateAreaDragHandleNode.accessibleId );
      return accessibleIds;
    };
    
    var setTabIndex = function( tabIndex ) {
      getAccessibleIds().forEach( function( id ) {
        var domElement = document.getElementById( id );
        if ( domElement !== null ) {
          domElement.tabIndex = tabIndex;
        }
      } );
    };
    
    // add the accessible content
    this.accessibleContent = {
      createPeer: function( accessibleInstance ) {
        var trail = accessibleInstance.trail;
        // circuit-widget
        var domElement = document.createElement( 'div' );
        
        var label = document.createElement( 'h3' );
        label.textContent = accessibleCircuitString;
        label.id = 'capacitance-circuit-label';
        domElement.appendChild( label );
        
        var description = document.createElement( 'p' );
        description.textContent = accessibleCapacitanceCircuitString;
        description.id = 'capacitance-circuit-description';
        domElement.appendChild( description );
        
        domElement.setAttribute( 'aria-describedby', description.id );
        domElement.setAttribute( 'aria-labeledby', label.id );
        domElement.setAttribute( 'aria-live', 'polite' );

        domElement.tabIndex = '0';
        
        domElement.addEventListener( 'keydown', function( event ) {
          var keyCode = event.keyCode;
          var firstElem;
          if ( keyCode === Input.KEY_ENTER ) {
            setTabIndex( '0' );
            firstElem = document.getElementById( thisNode.batteryNode.accessibleId );
            firstElem.focus();
          }
          else if ( keyCode === Input.KEY_ESCAPE ) {
            domElement.focus();
            setTabIndex( '-1' );
          }
          else if ( keyCode === Input.KEY_TAB ) {
            var switchIds = thisNode.circuitSwitchNodes[ 1 ].getAccessibleIds();
            var lastElem = document.getElementById( switchIds[ switchIds.length - 1 ] );
            firstElem = document.getElementById( thisNode.batteryNode.accessibleId );
            if ( document.activeElement === lastElem && !event.shiftKey ) {
              event.preventDefault();
              firstElem.focus();
            }
            if ( document.activeElement === firstElem && event.shiftKey ) {
              event.preventDefault();
              lastElem.focus();
            }
          }
        } );

        var accessiblePeer = new AccessiblePeer( accessibleInstance, domElement );
        domElement.id = 'capacitanceCircuit-' + trail.getUniqueId();
        thisNode.accessibleId = domElement.id;
        return accessiblePeer;

      }
    };

  }

  capacitorLabBasics.register( 'CapacitanceCircuitNode', CapacitanceCircuitNode );
  
  return inherit( Node, CapacitanceCircuitNode );

} );