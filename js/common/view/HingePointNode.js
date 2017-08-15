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
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var inherit = require( 'PHET_CORE/inherit' );

  // constants
  var HINGE_POINT_RADIUS = 8;
  var PIN_RADIUS = 5;

  /**
   * Constructor for the HingePointNode.
   *
   * @param {Object} options
   * @constructor
   */
  function HingePointNode( options ) {

    options = _.extend( {
      fill: CLBConstants.CONNECTION_POINT_COLOR,
      lineWidth: 3,
      stroke: CLBConstants.CONNECTION_POINT_COLOR,
      innerPinRadius: PIN_RADIUS,
      pinFillColor: CLBConstants.PIN_COLOR
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
