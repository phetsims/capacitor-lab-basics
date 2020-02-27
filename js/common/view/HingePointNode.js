// Copyright 2015-2019, University of Colorado Boulder

/**
 * Visual representation of a hinge point for the switch.  This is a black circle with an inner black circle that
 * represents the ability to the user that the switch can be rotated about the hinge point.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import capacitorLabBasics from '../../capacitorLabBasics.js';
import CLBConstants from '../CLBConstants.js';

// constants
const HINGE_POINT_RADIUS = 8;
const PIN_RADIUS = 5;

/**
 * @constructor
 *
 * @param {Object} [options]
 */
function HingePointNode( options ) {

  options = merge( {
    fill: CLBConstants.CONNECTION_POINT_COLOR,
    lineWidth: 3,
    stroke: CLBConstants.CONNECTION_POINT_COLOR,
    innerPinRadius: PIN_RADIUS,
    pinFillColor: CLBConstants.PIN_COLOR
  }, options );
  Circle.call( this, HINGE_POINT_RADIUS, options );

  // Inner circle of hings
  this.addChild( new Circle( options.innerPinRadius, {
    fill: options.pinFillColor,
    center: this.center
  } ) );
}

capacitorLabBasics.register( 'HingePointNode', HingePointNode );

inherit( Circle, HingePointNode );
export default HingePointNode;