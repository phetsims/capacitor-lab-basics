// Copyright 2002-2015, University of Colorado Boulder

/**
 * Triangular area that extends from the switch hinge point to a connection point.  The user can click anywhere in this
 * area to set the circuit connection.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var Node = require( 'SCENERY/nodes/Node' );
  var CLConstants = require( 'CAPACITOR_LAB_BASICS/common/CLConstants' );

  // constants
  var DEBUG = false; // shows the rectangular bounding area

  var BOUNDING_ANGLE = Math.PI / 8;
  var AREA_FILL = DEBUG ? 'rgba( 1, 1, 1, 0.65 )' : null;

  var CONNECTED_POINT_COLOR = 'black';
  var CONNECTED_POINT_STROKE = 'rgb( 170, 170, 170 )';
  var DISCONNECTED_POINT_COLOR = 'rgb( 151, 208, 255 )';
  var DISCONNECTED_POINT_STROKE = 'rgb( 235, 190, 185 )';
  var CONNECTION_POINT_HIGHLIGHTED = 'yellow';

  /**
   * Constructor for the ConnectionAreaInputListener.
   *
   * @param {object} connection
   * @param {Vector2} hingePoint
   * @param {ConnectionPointNode} connectionPointNode
   * @param {CLModelViewTransform3D} modelViewTransform
   * @param {Property} circuitConnectionProperty
   * @constructor
   */
  function ConnectionAreaInputListener( connection, hingePoint, connectionPointNode, modelViewTransform, circuitConnectionProperty ) {

    Node.call( this );
    var connectionVector = connection.location.toVector2().minus( hingePoint ).withMagnitude( CLConstants.SWITCH_WIRE_LENGTH * 3 / 2 );
    var triangleShape = new Shape().moveToPoint( hingePoint );
    triangleShape.lineToPoint( hingePoint.plus( connectionVector.rotated( BOUNDING_ANGLE ) ) );
    triangleShape.lineToPoint( hingePoint.plus( connectionVector.rotated( -BOUNDING_ANGLE ) ) );
    triangleShape.close();

    // transform the shape
    triangleShape = modelViewTransform.modelToViewShape( triangleShape );

    var triangleNode = new Path( triangleShape, { fill: AREA_FILL } );
    triangleNode.touchArea = triangleShape;
    triangleNode.cursor = 'pointer';

    function setPinConnected() {
      connectionPointNode.fill = CONNECTED_POINT_COLOR;
      connectionPointNode.stroke = CONNECTED_POINT_STROKE;
    }
    function setPinDisconnected() {
      connectionPointNode.fill = DISCONNECTED_POINT_COLOR;
      connectionPointNode.stroke = DISCONNECTED_POINT_STROKE;
    }

    var connectionType = connection.connectionType; // for readability
    circuitConnectionProperty.link( function( circuitConnection ) {
      if( connectionType === circuitConnection ) {
        setPinConnected();
      }
      else {
        setPinDisconnected();
      }
    } );

    if( connectionType === circuitConnectionProperty.value ) {
      setPinConnected();
    }

    // Add input listener to set circuit state.
    this.addInputListener( new ButtonListener( {
      over: function( event ) {
        connectionPointNode.fill = CONNECTION_POINT_HIGHLIGHTED;
      },
      up: function( event ) {
        if( connectionType === circuitConnectionProperty.value ) {
          setPinConnected();
        }
        else {
          setPinDisconnected();
        }
      },
      down: function( event ) {
        circuitConnectionProperty.set( connectionType );
      }
    } ) );

    this.addChild( triangleNode );

  }

  return inherit( Node, ConnectionAreaInputListener );

} );