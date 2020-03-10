// Copyright 2015-2020, University of Colorado Boulder

/**
 * Triangular area that extends from the switch hinge point to a connection point.  The user can click anywhere in this
 * area to set the circuit connection.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import Shape from '../../../../kite/js/Shape.js';
import inherit from '../../../../phet-core/js/inherit.js';
import PressListener from '../../../../scenery/js/listeners/PressListener.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import capacitorLabBasics from '../../capacitorLabBasics.js';
import CLBConstants from '../CLBConstants.js';

const BOUNDING_ANGLE = Math.PI / 8;

/**
 * @constructor
 *
 * @param {Connection} connection
 * @param {CircuitSwitch} circuitSwitch
 * @param {YawPitchModelViewTransform3} modelViewTransform
 * @param {Tandem} tandem
 * @param {CircuitSwitchDragHandler} dragHandler
 * @param {Property.<boolean>} userControlledProperty
 */
function ConnectionNode( connection, circuitSwitch, modelViewTransform, tandem, dragHandler, userControlledProperty ) {

  const self = this;

  // @public {Circle}
  this.highlightNode = new Circle( {
    radius: CLBConstants.CONNECTION_POINT_RADIUS,
    lineWidth: 2,
    lineDash: [ 3, 3 ],
    pickable: false,
    fill: CLBConstants.CONNECTION_POINT_HIGHLIGHTED,
    stroke: 'black',
    translation: modelViewTransform.modelToViewPosition( connection.position )
  } );

  // @public {Circle}
  this.backStrokeNode = new Circle( {
    radius: CLBConstants.CONNECTION_POINT_RADIUS,
    lineWidth: 2,
    lineDash: [ 3, 3 ],
    stroke: CLBConstants.DISCONNECTED_POINT_STROKE,
    translation: modelViewTransform.modelToViewPosition( connection.position )
  } );

  const pointNode = new Circle( {
    radius: CLBConstants.CONNECTION_POINT_RADIUS,
    fill: CLBConstants.DISCONNECTED_POINT_COLOR,
    translation: modelViewTransform.modelToViewPosition( connection.position )
  } );

  const hingePoint = circuitSwitch.hingePoint.toVector2();
  const connectionAngle = connection.position.toVector2().minus( hingePoint ).angle;
  let triangleShape = new Shape().moveToPoint( hingePoint );
  triangleShape.arcPoint( hingePoint, CLBConstants.SWITCH_WIRE_LENGTH * 1.4, connectionAngle - BOUNDING_ANGLE, connectionAngle + BOUNDING_ANGLE, false );
  triangleShape.close();

  // transform the shape
  triangleShape = modelViewTransform.modelToViewShape( triangleShape );

  const connectionType = connection.type; // for readability

  Node.call( this, {
    cursor: 'pointer',
    mouseArea: triangleShape,
    touchArea: triangleShape,
    children: [
      pointNode
    ]
  } );

  const pressListener = new PressListener( {
    tandem: tandem.createTandem( 'pressListener' ),
    phetioDocumentation: 'Connects and disconnects the circuit',
    attach: false,
    press: function( event ) {
      if ( circuitSwitch.circuitConnectionProperty.value === connectionType ) {
        dragHandler.press( event );
      }
      else {
        circuitSwitch.circuitConnectionProperty.set( connectionType );
      }
    }
  } );
  this.addInputListener( pressListener );

  Property.multilink( [ pressListener.isHoveringProperty, userControlledProperty ], function( hovering, userControlled ) {
    self.highlightNode.visible = hovering && !userControlled;
  } );
}

capacitorLabBasics.register( 'ConnectionNode', ConnectionNode );

inherit( Node, ConnectionNode );
export default ConnectionNode;
