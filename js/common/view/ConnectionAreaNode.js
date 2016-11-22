// Copyright 2015, University of Colorado Boulder

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
  var TandemButtonListener = require( 'TANDEM/scenery/input/TandemButtonListener' );
  var Node = require( 'SCENERY/nodes/Node' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  // constants
  var DEBUG = false; // shows the triangular bounding areas

  var BOUNDING_ANGLE = Math.PI / 8;
  var AREA_FILL = DEBUG ? 'rgba( 1, 1, 1, 0.65 )' : null;

  /**
   * Constructor for the ConnectionAreaNode.
   *
   * @param {Object} connection
   * @param {CircuitSwitch} circuitSwitch
   * @param {ConnectionPointNode} connectionPointNode
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Tandem} tandem
   * @constructor
   */
  function ConnectionAreaNode( connection, circuitSwitch, connectionPointNode, modelViewTransform, tandem ) {
    var hingePoint = circuitSwitch.hingePoint.toVector2();

    Node.call( this );
    var connectionVector = connection.location.toVector2().minus( hingePoint ).withMagnitude( CLBConstants.SWITCH_WIRE_LENGTH * 3 / 2 );
    var triangleShape = new Shape().moveToPoint( hingePoint );
    triangleShape.lineToPoint( hingePoint.plus( connectionVector.rotated( BOUNDING_ANGLE ) ) );
    triangleShape.lineToPoint( hingePoint.plus( connectionVector.rotated( -BOUNDING_ANGLE ) ) );
    triangleShape.close();

    // transform the shape
    triangleShape = modelViewTransform.modelToViewShape( triangleShape );

    var triangleNode = new Path( triangleShape, { fill: AREA_FILL } );
    triangleNode.touchArea = triangleShape;
    triangleNode.cursor = 'pointer';

    function resetPinColors() {
      connectionPointNode.fill = CLBConstants.DISCONNECTED_POINT_COLOR;
      connectionPointNode.stroke = CLBConstants.DISCONNECTED_POINT_STROKE;
    }

    var connectionType = connection.connectionType; // for readability
    circuitSwitch.circuitConnectionProperty.link( function( circuitConnection ) {
      resetPinColors();
    } );

    // Add input listener to set circuit state.
    this.addInputListener( new TandemButtonListener( {

      tandem: tandem.createTandem( 'buttonListener' ),

      over: function( event ) {
        connectionPointNode.fill = CLBConstants.CONNECTION_POINT_HIGHLIGHTED;
      },
      up: function( event ) {
        resetPinColors();
      },
      down: function( event ) {
        circuitSwitch.circuitConnectionProperty.set( connectionType );
      }
    } ) );

    this.addChild( triangleNode );

  }

  capacitorLabBasics.register( 'ConnectionAreaNode', ConnectionAreaNode );

  return inherit( Node, ConnectionAreaNode );

} );

