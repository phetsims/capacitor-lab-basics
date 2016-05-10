// Copyright 2015, University of Colorado Boulder

/**
 * Visual representation of a switch.  A switch consists of a line that connects a hinge point and at least two other
 * connection points.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var WireNode = require( 'CAPACITOR_LAB_BASICS/common/view/WireNode' );
  var ConnectionPointNode = require( 'CAPACITOR_LAB_BASICS/common/view/ConnectionPointNode' );
  var HingePointNode = require( 'CAPACITOR_LAB_BASICS/common/view/HingePointNode' );
  var ConnectionAreaNode = require( 'CAPACITOR_LAB_BASICS/common/view/ConnectionAreaNode' );
  var ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );
  var CircuitSwitchDragHandler = require( 'CAPACITOR_LAB_BASICS/common/view/drag/CircuitSwitchDragHandler' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  /**
   * Constructor for a SwitchNode.
   *
   * @param {CircuitSwitch} circuitSwitch
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Tandem} tandem
   * @constructor
   */
  function SwitchNode( circuitSwitch, modelViewTransform, tandem ) {

    Node.call( this );
    var thisNode = this;
    this.circuitSwitch = circuitSwitch;
    this.modelViewTransform = modelViewTransform;

    // add the switch as a wire node
    this.wireSwitchNode = new WireNode( circuitSwitch.switchWire );
    this.wireSwitchNode.cursor = 'pointer';

    // add a shaded sphere to the end of the wire node to represent a connection point at the end of the switch.
    var shadedSphereNode = new ShadedSphereNode( 16 );
    shadedSphereNode.translation = modelViewTransform.modelToViewPosition( circuitSwitch.switchSegment.endPoint );
    this.wireSwitchNode.addChild( shadedSphereNode );

    // add the the hinge
    var hingeNode = new HingePointNode();
    hingeNode.translation = modelViewTransform.modelToViewPosition( circuitSwitch.hingePoint );

    // create connection points and clickable areas
    this.connectionPointNodes = [];
    var connectionListeners = [];
    circuitSwitch.connections.forEach( function( connection ) {
      // add the connection point node
      var connectionPointNode = new ConnectionPointNode( connection.connectionType, circuitSwitch.circuitConnectionProperty );
      connectionPointNode.translation = modelViewTransform.modelToViewPosition( connection.location );

      // add the clickable area for the connection point
      var connectionAreaNode = new ConnectionAreaNode( connection, circuitSwitch,
        connectionPointNode, modelViewTransform, tandem.createTandem( 'connectionAreaNode' ) );

      thisNode.connectionPointNodes.push( connectionPointNode );
      connectionListeners.push( connectionAreaNode );
    } );

    // add the drag handler
    this.wireSwitchNode.addInputListener(
      new CircuitSwitchDragHandler( thisNode, tandem.createTandem( 'inputListener' ) ) );

    // changes visual position as the user drags the switch.
    circuitSwitch.angleProperty.link( function( angle ) {
      thisNode.wireSwitchNode.resetTransform();
      thisNode.wireSwitchNode.translate( circuitSwitch.hingePoint.x, circuitSwitch.hingePoint.y );
      thisNode.wireSwitchNode.rotateAround( modelViewTransform.modelToViewPosition( circuitSwitch.hingePoint ), angle );
    } );

    // Make sure that the shaded sphere snaps to the correct position when connection property changes.
    circuitSwitch.circuitConnectionProperty.link( function( circuitConnection ) {
      shadedSphereNode.translation = modelViewTransform.modelToViewPosition( circuitSwitch.switchSegment.endPoint );
    } );

    // rendering order, important for behavior of click areas and drag handlers
    _.each( connectionListeners, function( connectionListener ) {
      thisNode.addChild( connectionListener );
    } );
    _.each( thisNode.connectionPointNodes, function( connectionPointNode ) {
      thisNode.addChild( connectionPointNode );
    } );
    this.addChild( this.wireSwitchNode );
    this.addChild( hingeNode );

  }

  capacitorLabBasics.register( 'SwitchNode', SwitchNode );

  return inherit( Node, SwitchNode );

} );

