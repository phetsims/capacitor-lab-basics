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
  var CONNECTION_POINT_RADIUS = 6;

  // colors
  var CONNECTED_POINT_COLOR = 'black';
  var CONNECTED_POINT_STROKE = 'rgb( 170, 170, 170 )';
  var DISCONNECTED_POINT_COLOR = 'rgb( 151, 208, 255 )';
  var DISCONNECTED_POINT_STROKE = 'rgb( 235, 190, 185 )';
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
      fill: DISCONNECTED_POINT_COLOR,
      lineWidth: 2,
      stroke: DISCONNECTED_POINT_STROKE
    } );
    Circle.call( this, CONNECTION_POINT_RADIUS, options );
    var thisNode = this;

    function setPinConnected() {
      thisNode.fill = CONNECTED_POINT_COLOR;
      thisNode.stroke = CONNECTED_POINT_STROKE;
    }
    function setPinDisconnected() {
      thisNode.fill = DISCONNECTED_POINT_COLOR;
      thisNode.stroke = DISCONNECTED_POINT_STROKE;
    }

    // link pin style properties to the circuit connection. Needs to be done in addition to the button listener so that
    // all connection points update when a single connection point is interacted with.
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
        thisNode.fill = CONNECTION_POINT_HIGHLIGHTED;
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
  }

  return inherit( Circle, ConnectionPointNode, {} );

} );