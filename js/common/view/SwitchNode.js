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
  var CircuitSwitchDragHandler = require( 'CAPACITOR_LAB_BASICS/common/view/drag/CircuitSwitchDragHandler' );
  var HingePointNode = require( 'CAPACITOR_LAB_BASICS/common/view/HingePointNode' );

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
    this.addChild( this.wireSwitchNode );
    this.wireSwitchNode.touchArea = this.wireSwitchNode.bounds;
    this.wireSwitchNode.cursor = 'pointer';

    // add the the hinge and all connection points
    var hingeNode = new HingePointNode();
    hingeNode.translation = modelViewTransform.modelToViewPosition( circuitSwitch.hingePoint );
    this.addChild( hingeNode );
    circuitSwitch.connections.forEach( function( connection ) {
      var connectionPointNode = new ConnectionPointNode( connection.connectionType, circuitSwitch.circuitConnectionProperty );
      connectionPointNode.translation = modelViewTransform.modelToViewPosition( connection.location );
      thisNode.addChild( connectionPointNode );
    } );

    // add the drag handler
    this.wireSwitchNode.addInputListener( new CircuitSwitchDragHandler( thisNode ) );

    // changes visual position
    circuitSwitch.angleProperty.link( function( angle ) {
      thisNode.wireSwitchNode.resetTransform();
      thisNode.wireSwitchNode.translate( circuitSwitch.hingePoint.x, circuitSwitch.hingePoint.y );
      thisNode.wireSwitchNode.rotateAround( modelViewTransform.modelToViewPosition( circuitSwitch.hingePoint ), angle );
    } );

  }

  return inherit( Node, SwitchNode );

} );