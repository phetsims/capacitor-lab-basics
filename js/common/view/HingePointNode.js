// Copyright 2015-2021, University of Colorado Boulder

/**
 * Visual representation of a hinge point for the switch.  This is a black circle with an inner black circle that
 * represents the ability to the user that the switch can be rotated about the hinge point.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import { Circle } from '../../../../scenery/js/imports.js';
import capacitorLabBasics from '../../capacitorLabBasics.js';
import CLBConstants from '../CLBConstants.js';

// constants
const HINGE_POINT_RADIUS = 8;
const PIN_RADIUS = 5;

class HingePointNode extends Circle {
  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      fill: CLBConstants.CONNECTION_POINT_COLOR,
      lineWidth: 3,
      stroke: CLBConstants.CONNECTION_POINT_COLOR,
      innerPinRadius: PIN_RADIUS,
      pinFillColor: CLBConstants.PIN_COLOR
    }, options );
    super( HINGE_POINT_RADIUS, options );

    // Inner circle of hings
    this.addChild( new Circle( options.innerPinRadius, {
      fill: options.pinFillColor,
      center: this.center
    } ) );
  }
}

capacitorLabBasics.register( 'HingePointNode', HingePointNode );

export default HingePointNode;