// Copyright 2015-2017, University of Colorado Boulder

/**
 * Triangular area that extends from the switch hinge point to a connection point.  The user can click anywhere in this
 * area to set the circuit connection.
 *
 * @author Jesse Greenberg
 * @author Andrew Adare
 */
define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Property = require( 'AXON/Property' );
  var Shape = require( 'KITE/Shape' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  var BOUNDING_ANGLE = Math.PI / 8;

  /**
   * Constructor for the ConnectionNode.
   *
   * @param {Object} connection TODO: Just an Object???
   * @param {CircuitSwitch} circuitSwitch
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Tandem} tandem
   * @param {CircuitSwitchDragHandler} dragHandler
   * @param {Property.<boolean>}
   * @constructor
   */
  function ConnectionNode( connection, circuitSwitch, modelViewTransform, tandem, dragHandler, userControlledProperty ) {

    var self = this;

    // @public {Circle}
    this.highlightNode = new Circle( {
      radius: CLBConstants.CONNECTION_POINT_RADIUS,
      lineWidth: 2,
      lineDash: [ 3, 3 ],
      pickable: false,
      fill: CLBConstants.CONNECTION_POINT_HIGHLIGHTED,
      stroke: 'black',
      translation: modelViewTransform.modelToViewPosition( connection.location )
    } );

    var pointNode = new Circle( {
      radius: CLBConstants.CONNECTION_POINT_RADIUS,
      lineWidth: 2,
      lineDash: [ 3, 3 ],
      fill: CLBConstants.DISCONNECTED_POINT_COLOR,
      stroke: CLBConstants.DISCONNECTED_POINT_STROKE,
      translation: modelViewTransform.modelToViewPosition( connection.location )
    } );

    var hingePoint = circuitSwitch.hingePoint.toVector2();
    var connectionAngle = connection.location.toVector2().minus( hingePoint ).angle();
    var triangleShape = new Shape().moveToPoint( hingePoint );
    triangleShape.arcPoint( hingePoint, CLBConstants.SWITCH_WIRE_LENGTH * 1.4, connectionAngle - BOUNDING_ANGLE, connectionAngle + BOUNDING_ANGLE, false );
    triangleShape.close();

    // transform the shape
    triangleShape = modelViewTransform.modelToViewShape( triangleShape );

    var connectionType = connection.connectionType; // for readability

    Node.call( this, {
      cursor: 'pointer',
      mouseArea: triangleShape,
      touchArea: triangleShape,
      children: [
        pointNode
      ]
    } );

    this.addInputListener( SimpleDragHandler.createForwardingListener( function( event ) {
      if ( circuitSwitch.circuitConnectionProperty.value === connectionType ) {
        dragHandler.startDrag( event );
      }
      else {
        circuitSwitch.circuitConnectionProperty.set( connectionType );
      }
    } ) );

    var overCountProperty = new NumberProperty( 0 );
    Property.multilink( [ overCountProperty, userControlledProperty ], function( over, userControlled ) {
      self.highlightNode.visible = over > 0 && !userControlled;
    } );

    // Add input listener to set circuit state.
    this.addInputListener( {
      enter: function( event ) {
        overCountProperty.value++;
      },
      exit: function( event ) {
        overCountProperty.value--;
      }
    } );
  }

  capacitorLabBasics.register( 'ConnectionNode', ConnectionNode );

  return inherit( Node, ConnectionNode );
} );
