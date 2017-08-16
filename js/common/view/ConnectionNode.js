// Copyright 2016, University of Colorado Boulder

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
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

  // constants
  //TODO: remove or figure out a better way before production? (e.g. look for query parameter)
  var DEBUG = false; // shows the triangular bounding areas

  var BOUNDING_ANGLE = Math.PI / 8;
  var AREA_FILL = DEBUG ? 'rgba( 1, 1, 1, 0.65 )' : null;

  /**
   * Constructor for the ConnectionNode.
   *
   * @param {Object} connection TODO: Just an Object???
   * @param {CircuitSwitch} circuitSwitch
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Tandem} tandem
   * @constructor
   */
  function ConnectionNode( connection, circuitSwitch, modelViewTransform, tandem ) {

    var self = this;

    // @public {Circle}
    this.highlightNode = new Circle( {
      radius: CLBConstants.CONNECTION_POINT_RADIUS,
      lineWidth: 2,
      lineDash: [ 3, 3 ],
      pickable: false,
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

    var connectionVector = connection.location.toVector2().minus( hingePoint )
      .withMagnitude( CLBConstants.SWITCH_WIRE_LENGTH * 3 / 2 );
    var triangleShape = new Shape().moveToPoint( hingePoint );
    triangleShape.lineToPoint( hingePoint.plus( connectionVector.rotated( BOUNDING_ANGLE ) ) );
    triangleShape.lineToPoint( hingePoint.plus( connectionVector.rotated( -BOUNDING_ANGLE ) ) );
    triangleShape.close();

    // transform the shape
    triangleShape = modelViewTransform.modelToViewShape( triangleShape );

    var triangleNode = new Path( triangleShape, { fill: AREA_FILL } );

    // TODO: Do visibility instead?
    function resetPinColors() {
      self.highlightNode.fill = null;
      self.highlightNode.stroke = null;
    }

    var connectionType = connection.connectionType; // for readability
    circuitSwitch.circuitConnectionProperty.link( function( circuitConnection ) {
      resetPinColors();
    } );

    Node.call( this, {
      cursor: 'pointer',
      children: [
        triangleNode,
        pointNode
      ]
    } );

    // Add input listener to set circuit state.
    this.addInputListener( new ButtonListener( {
      tandem: tandem.createTandem( 'buttonListener' ),

      over: function( event ) {
        self.highlightNode.fill = CLBConstants.CONNECTION_POINT_HIGHLIGHTED;
        self.highlightNode.stroke = 'black';
      },
      up: function( event ) {
        resetPinColors();
      },
      down: function( event ) {
        circuitSwitch.circuitConnectionProperty.set( connectionType );
      }
    } ) );
  }

  capacitorLabBasics.register( 'ConnectionNode', ConnectionNode );

  return inherit( Node, ConnectionNode );
} );
