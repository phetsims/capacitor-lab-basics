// Copyright 2002-2015, University of Colorado Boulder

/**
 * Visual representation of a switch.  A switch consists of a line that connects a hinge point and at least one other
 * connection point.
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
  //var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * Constructor for a BatteryNode.
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

    //var angle = 0;
    this.clickOffset = new Vector2( 0, 0 );

    // add the switch as a wire node.
    this.wireSwitchNode = new WireNode( circuitSwitch.switchWire );
    this.addChild( this.wireSwitchNode );

    // Add the the hinge and all connection points.
    var hingeNode = new HingePointNode();
    hingeNode.translation = modelViewTransform.modelToViewPosition( circuitSwitch.hingePoint );
    this.addChild( hingeNode );
    circuitSwitch.connections.forEach( function( connection ) {
      var connectionPointNode = new ConnectionPointNode( connection.connectionType, circuitSwitch.circuitConnectionProperty );
      connectionPointNode.translation = modelViewTransform.modelToViewPosition( connection.location );
      thisNode.addChild( connectionPointNode );
    } );

    // add a rectangle child to the wireSwitchNode is draggable.
    // TODO: Temporary solution, eventually wires will be full shapes, not just lines.
    this.wireSwitchNode.addChild( new Rectangle( this.wireSwitchNode.bounds.dilated( 10 ) ) );

    // TODO For now, the switch state can only be changed by clicking on the desired connection point.
    // Still working on the drag handler.
    // drag handler
    //var lastAngle = circuitSwitch.angle;
    //var currentAngle = circuitSwitch.angle;
    //this.wireSwitchNode.addInputListener( new SimpleDragHandler( {
    //  start: function( event ) {
    //    var pMouse = event.pointer.point;
    //    var endPoint = thisNode.circuitSwitch.getSwitchEndPoint();
    //    var pOrigin = modelViewTransform.modelToViewDeltaXYZ( endPoint.x, endPoint.y, 0 );
    //    thisNode.clickOffset = pMouse.minus( pOrigin );
    //  },
    //  drag: function( event ) {
    //    var pMouse = event.pointer.point;
    //    var angle = pMouse.minus( thisNode.clickOffset ).angle();
    //    circuitSwitch.angle = angle;
    //  },
    //  end: function( event ) {
    //    thisNode.dragging = false;
    //  }
    //} ) );
    //
    // changes visual position
    //circuitSwitch.angleProperty.link( function( angle ) {
    //  thisNode.wireSwitchNode.resetTransform();
    //  thisNode.wireSwitchNode.translate( circuitSwitch.position.x, circuitSwitch.position.y );
    //  thisNode.wireSwitchNode.rotateAround( modelViewTransform.modelToViewPosition( circuitSwitch.hingePoint ), angle );
    //} );

  }

  return inherit( Node, SwitchNode, {

    /**
     * Determines how far the mouse is from where we grabbed the switch.
     *
     * @param {Vector2} pMouse
     * @param {number} samplePlateWidth
     * @return {number}
     */
    getModelPoint: function( pMouse, samplePlateWidth ) {
      var switchCenter = this.circuitSwitch.getCenterPoint();
      return this.modelViewTransform.modelToViewXYZ( switchCenter.x, switchCenter.y, 0 );
      //var pBackRightCorner = this.modelViewTransform.modelToViewXYZ( samplePlateWidth / 2, 0, samplePlateWidth / 2 );
      //return pMouse.x - pBackRightCorner.x - this.clickOffset;
    }
  } );

} );