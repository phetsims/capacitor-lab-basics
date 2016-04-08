// Copyright 2015, University of Colorado Boulder

/**
 * Visual representation of a hinge point for the switch.  This is a black circle with an inner black circle that
 * represents the ability to the user that the switch can be rotated about the hinge point.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  // constants
  var HINGE_POINT_RADIUS = 8;
  var PIN_RADIUS = 5;

  // TODO: Move to constants.
  var CONNECTION_POINT_COLOR = 'black';
  var PIN_COLOR = 'lightgray';

  /**
   * Constructor for the ConnectionPointNode.
   *
   * @param {Object} options
   * @constructor
   */
  function HingePointNode( options ) {

    options = _.extend( {
      fill: CONNECTION_POINT_COLOR,
      lineWidth: 3,
      stroke: CONNECTION_POINT_COLOR,
      innerPinRadius: PIN_RADIUS,
      pinFillColor: PIN_COLOR
    } );
    Circle.call( this, HINGE_POINT_RADIUS, options );

    // Inner circle of hings
    this.addChild( new Circle( options.innerPinRadius, {
      fill: options.pinFillColor,
      center: this.center
    } ) );
  }

  capacitorLabBasics.register( 'HingePointNode', HingePointNode );

  return inherit( Circle, HingePointNode );

} );
