// Copyright 2015, University of Colorado Boulder

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
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );

  /**
   * Constructor for the ConnectionPointNode.
   *
   * @param {string} connectionType
   * @param {Property} circuitConnectionProperty
   * @param {Tandem} tandem
   * @param {Object} options
   * @constructor
   */
  function ConnectionPointNode( connectionType, circuitConnectionProperty, tandem, options ) {

    options = _.extend( {
      fill: CLBConstants.DISCONNECTED_POINT_COLOR,
      lineWidth: 2,
      lineDash: [ 3, 3 ],
      stroke: CLBConstants.DISCONNECTED_POINT_STROKE
    } );
    Circle.call( this, CLBConstants.CONNECTION_POINT_RADIUS, options );
    var self = this;
    this.cursor = 'pointer';

    function resetPinColors() {
      self.fill = CLBConstants.DISCONNECTED_POINT_COLOR;
      self.stroke = CLBConstants.DISCONNECTED_POINT_STROKE;
    }

    // link pin style properties to the circuit connection. Needs to be done in addition to the button listener so that
    // all connection points update when a single connection point is interacted with.
    circuitConnectionProperty.link( function( circuitConnection ) {
      resetPinColors();
    } );

    // Add input listener to set circuit state.
    this.addInputListener( new ButtonListener( {

      tandem: tandem.createTandem( 'inputListener' ),

      over: function( event ) {
        self.fill = CLBConstants.CONNECTION_POINT_HIGHLIGHTED;
      },
      up: function( event ) {
        resetPinColors();
      },
      down: function( event ) {
        circuitConnectionProperty.set( connectionType );
      }
    } ) );
  }

  capacitorLabBasics.register( 'ConnectionPointNode', ConnectionPointNode );

  return inherit( Circle, ConnectionPointNode, {} );

} );

