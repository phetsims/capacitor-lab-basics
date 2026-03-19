// Copyright 2017-2026, University of Colorado Boulder

/**
 * A connection with a switch
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 */

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

export default Connection;
