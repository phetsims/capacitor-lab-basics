// Copyright 2002-2015, University of Colorado Boulder

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
  var ConnectionAreaInputListener = require( 'CAPACITOR_LAB_BASICS/common/view/ConnectionAreaInputListener' );

  // TODO: TEMPORARY! remove soon.
  // add query parameter harness to play with the two different drag styles.
  var CircuitSwitchDragHandler;
  var getQueryParameter = phet.chipper.getQueryParameter;
  var snapDrag = getQueryParameter( 'snapDrag' ) || false;
  if ( snapDrag) {
    CircuitSwitchDragHandler = require( 'CAPACITOR_LAB_BASICS/common/view/drag/CircuitSwitchSnapDragHandler' );
  }
  else{
    CircuitSwitchDragHandler = require( 'CAPACITOR_LAB_BASICS/common/view/drag/CircuitSwitchDragHandler' );
  }

  /**
   * Constructor for a SwitchNode.
   *
   * @param {CircuitSwitch} circuitSwitch
   * @param {CLModelViewTransform3D} modelViewTransform
   * @constructor
   */
  function SwitchNode( circuitSwitch, modelViewTransform ) {

    Node.call( this );
    var thisNode = this;
    this.circuitSwitch = circuitSwitch;
    this.modelViewTransform = modelViewTransform;

    // add the switch as a wire node
    this.wireSwitchNode = new WireNode( circuitSwitch.switchWire );
    this.wireSwitchNode.cursor = 'pointer';

    // add the the hinge
    var hingeNode = new HingePointNode();
    hingeNode.translation = modelViewTransform.modelToViewPosition( circuitSwitch.hingePoint );

    // create connection points and clickable areas
    var connectionPointNodes = [];
    var connectionListeners = [];
    circuitSwitch.connections.forEach( function( connection ) {
      // add the connection point node
      var connectionPointNode = new ConnectionPointNode( connection.connectionType, circuitSwitch.circuitConnectionProperty );
      connectionPointNode.translation = modelViewTransform.modelToViewPosition( connection.location );

      // add the clickable area for the connection point
      var connectionAreaInputListener = new ConnectionAreaInputListener( connection, circuitSwitch.hingePoint.toVector2(),
        connectionPointNode, modelViewTransform, circuitSwitch.circuitConnectionProperty );

      connectionPointNodes.push( connectionPointNode );
      connectionListeners.push( connectionAreaInputListener );
    } );

    // add the drag handler
    this.wireSwitchNode.addInputListener( new CircuitSwitchDragHandler( thisNode ) );

    // changes visual position
    circuitSwitch.angleProperty.link( function( angle ) {
      thisNode.wireSwitchNode.resetTransform();
      thisNode.wireSwitchNode.translate( circuitSwitch.hingePoint.x, circuitSwitch.hingePoint.y );
      thisNode.wireSwitchNode.rotateAround( modelViewTransform.modelToViewPosition( circuitSwitch.hingePoint ), angle );
    } );

    // rendering order
    _.each( connectionListeners, function( connectionListener ) { thisNode.addChild( connectionListener ); } );
    this.addChild( this.wireSwitchNode );
    _.each( connectionPointNodes, function( connectionPointNode ) { thisNode.addChild( connectionPointNode ); } );
    this.addChild( hingeNode );


  }

  return inherit( Node, SwitchNode );

} );