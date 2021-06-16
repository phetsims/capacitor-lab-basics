// Copyright 2015-2021, University of Colorado Boulder

/**
 * Configuration information for a circuit. This is purely a data structure, whose purpose is to reduce the number of
 * parameters required in constructors and creation methods.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import CapacitorConstants from '../../../../scenery-phet/js/capacitor/CapacitorConstants.js';
import YawPitchModelViewTransform3 from '../../../../scenery-phet/js/capacitor/YawPitchModelViewTransform3.js';
import capacitorLabBasics from '../../capacitorLabBasics.js';
import CircuitState from './CircuitState.js';

// Constants with default assignments
const CAPACITOR_X_SPACING = 0.024; // meters
const CAPACITOR_Y_SPACING = 0; // meters
const PLATE_WIDTH = CapacitorConstants.PLATE_WIDTH_RANGE.defaultValue;
const PLATE_SEPARATION = CapacitorConstants.PLATE_SEPARATION_RANGE.defaultValue;
const WIRE_EXTENT = 0.016; // how far the wire extends above or below the capacitor (meters)

const CircuitConfig = {

  /**
   * Returns the default circuit config, overridden with any options.
   * @public
   *
   * @param {Object} [options]
   * @returns {Object}
   */
  create( options ) {

    return merge( {
      modelViewTransform: new YawPitchModelViewTransform3(),
      capacitorXSpacing: CAPACITOR_X_SPACING,
      capacitorYSpacing: CAPACITOR_Y_SPACING,
      plateWidth: PLATE_WIDTH,
      plateSeparation: PLATE_SEPARATION,
      wireExtent: WIRE_EXTENT,
      lightBulb: null,

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

export default CircuitConfig;