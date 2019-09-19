// Copyright 2017-2018, University of Colorado Boulder

/**
 * A connection with a switch
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  const inherit = require( 'PHET_CORE/inherit' );

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

  return inherit( Object, Connection );
} );
