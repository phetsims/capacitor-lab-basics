// Copyright 2015-2019, University of Colorado Boulder

/**
 * Configuration information for a circuit. This is purely a data structure, whose purpose is to reduce the number of
 * parameters required in constructors and creation methods.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  const CircuitState = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitState' );
  const CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  const CLBModelViewTransform3D = require( 'CAPACITOR_LAB_BASICS/common/model/CLBModelViewTransform3D' );

  // Constants with default assignments
  const CAPACITOR_X_SPACING = 0.024; // meters
  const CAPACITOR_Y_SPACING = 0; // meters
  const PLATE_WIDTH = CLBConstants.PLATE_WIDTH_RANGE.defaultValue;
  const PLATE_SEPARATION = CLBConstants.PLATE_SEPARATION_RANGE.defaultValue;
  const WIRE_EXTENT = 0.016; // how far the wire extends above or below the capacitor (meters)

  const CircuitConfig = {

    /**
     * Returns the default circuit config, overridden with any options.
     * @public
     *
     * @param {Object} [options]
     * @returns {Object}
     */
    create: function( options ) {

      return _.extend( {
        modelViewTransform: new CLBModelViewTransform3D(),
        capacitorXSpacing: CAPACITOR_X_SPACING,
        capacitorYSpacing: CAPACITOR_Y_SPACING,
        plateWidth: PLATE_WIDTH,
        plateSeparation: PLATE_SEPARATION,
        wireExtent: WIRE_EXTENT,

        // Type: {Array.<CircuitState>})
        circuitConnections: [
          CircuitState.BATTERY_CONNECTED,
          CircuitState.OPEN_CIRCUIT,
          CircuitState.LIGHT_BULB_CONNECTED
        ]
      }, options );

    }
  };

  capacitorLabBasics.register( 'CircuitConfig', CircuitConfig );

  return CircuitConfig;
} );
