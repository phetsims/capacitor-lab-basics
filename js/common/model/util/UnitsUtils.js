// Copyright 2015-2021, University of Colorado Boulder

/**
 * Utilities for converting between different units.  These are the common conversions required when going between model
 * and view.
 *
 * NOTE: The design of this sim chose to specify the model in units that aren't really appropriate for the scale of this
 * topic.  But we thought it best to keep those units when implementing the model, so that the implementation matches
 * the specification.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import capacitorLabBasics from '../../../capacitorLabBasics.js';

// constants
const MILLIMETERS_PER_METER = 1000;

const UnitsUtils = {
  /**
   * Utility function to convert from meters to millimeters.
   * @public
   *
   * @param {number} d
   * @returns {number}
   */
  metersToMillimeters( d ) {
    return d * MILLIMETERS_PER_METER;
  },

  /**
   * Utility function to convert meters squared to millimeters squared.
   * @public
   *
   * @param {number} d
   * @returns {number}
   */
  metersSquaredToMillimetersSquared( d ) {
    return d * ( MILLIMETERS_PER_METER * MILLIMETERS_PER_METER );
  }
};

capacitorLabBasics.register( 'UnitsUtils', UnitsUtils );

export default UnitsUtils;