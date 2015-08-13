// Copyright 2002-2015, University of Colorado Boulder

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

  // constants
  var HINGE_POINT_RADIUS= 8;
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
      stroke: CONNECTION_POINT_COLOR
    } );
    Circle.call( this, HINGE_POINT_RADIUS, options );

    this.addChild( new Circle( PIN_RADIUS, { fill: PIN_COLOR, center: this.center } ) );
  }

  return inherit( Circle, HingePointNode );

} );