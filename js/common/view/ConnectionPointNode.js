// Copyright 2002-2015, University of Colorado Boulder

/**
 * Visual representation of a connection point on the circuit.  This is a black circle with input handling.  Clicking
 * on a connection point will set the circuit connection.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );

  // constants
  var CONNECTION_POINT_RADIUS = 8;

  // colors
  var CONNECTION_POINT_COLOR = 'black';
  var CONNECTION_POINT_HIGHLIGHTED = 'yellow';

  /**
   * Constructor for the ConnectionPointNode.
   *
   * @param {string} connectionType
   * @param {Property} circuitConnectionProperty
   * @param {object} options
   * @constructor
   */
  function ConnectionPointNode( connectionType, circuitConnectionProperty, options ) {

    options = _.extend( {
      fill: CONNECTION_POINT_COLOR,
      lineWidth: 3,
      stroke: CONNECTION_POINT_COLOR
    } );
    Circle.call( this, CONNECTION_POINT_RADIUS, options );
    var thisNode = this;

    // Add input listener to set circuit state.
    this.addInputListener( new ButtonListener( {
      over: function( event ) {
        thisNode.fill = CONNECTION_POINT_HIGHLIGHTED;
      },
      up: function( event ) {
        thisNode.fill = CONNECTION_POINT_COLOR;
      },
      down: function( event ) {
        circuitConnectionProperty.set( connectionType );
      }
    } ) );
  }

  return inherit( Circle, ConnectionPointNode, {} );

} );