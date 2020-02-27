// Copyright 2017-2019, University of Colorado Boulder

/**
 * A connection with a switch
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import inherit from '../../../../phet-core/js/inherit.js';
import capacitorLabBasics from '../../capacitorLabBasics.js';

/**
 * @constructor
 *
 * @param {Vector3} location
 * @param {CircuitState} type
 */
function Connection( location, type ) {
  // @public {Vector3}
  this.location = location;

  // @public {CircuitState}
  this.type = type;
}

capacitorLabBasics.register( 'Connection', Connection );

inherit( Object, Connection );
export default Connection;