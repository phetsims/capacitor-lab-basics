// Copyright 2015-2022, University of Colorado Boulder

/**
 * Triangular area that extends from the switch hinge point to a connection point.  The user can click anywhere in this
 * area to set the circuit connection.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import { Shape } from '../../../../kite/js/imports.js';
import { Circle, Node, PressListener } from '../../../../scenery/js/imports.js';
import capacitorLabBasics from '../../capacitorLabBasics.js';
import CLBConstants from '../CLBConstants.js';

const BOUNDING_ANGLE = Math.PI / 8;

class ConnectionNode extends Node {
  /**
   * @param {Connection} connection
   * @param {CircuitSwitch} circuitSwitch
   * @param {YawPitchModelViewTransform3} modelViewTransform
   * @param {Tandem} tandem
   * @param {CircuitSwitchDragHandler} dragHandler
   * @param {Property.<boolean>} userControlledProperty
   */
  constructor( connection, circuitSwitch, modelViewTransform, tandem, dragHandler, userControlledProperty ) {

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

    super( {
      cursor: 'pointer',
      mouseArea: triangleShape,
      touchArea: triangleShape,
      children: [
        pointNode
      ]
    } );

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

    const pressListener = new PressListener( {
      tandem: tandem.createTandem( 'pressListener' ),
      phetioDocumentation: 'Connects and disconnects the circuit',
      attach: false,
      press: event => {
        if ( circuitSwitch.circuitConnectionProperty.value === connectionType ) {
          dragHandler.press( event );
        }
        else {
          circuitSwitch.circuitConnectionProperty.set( connectionType );
        }
      }
    } );
    this.addInputListener( pressListener );

    Multilink.multilink( [ pressListener.isHoveringProperty, userControlledProperty ], ( hovering, userControlled ) => {
      this.highlightNode.visible = hovering && !userControlled;
    } );
  }
}

capacitorLabBasics.register( 'ConnectionNode', ConnectionNode );

export default ConnectionNode;
