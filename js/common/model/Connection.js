// Copyright 2017-2021, University of Colorado Boulder

/**
 * A connection with a switch
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import capacitorLabBasics from '../../capacitorLabBasics.js';

class Connection {
  /**
   * @param {Vector3} position
   * @param {CircuitState} type
   */
  constructor( position, type ) {
    // @public {Vector3}
    this.position = position;

    // @public {CircuitState}
    this.type = type;
  }
}

capacitorLabBasics.register( 'Connection', Connection );

export default Connection;
