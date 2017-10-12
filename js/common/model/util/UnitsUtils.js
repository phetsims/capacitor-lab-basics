// Copyright 2015-2017, University of Colorado Boulder

/**
 * Utilities for converting between different units.  These are the common conversions required when going between model
 * and view.
 *
 * NOTE: The design of this sim chose to specify the model in units that aren't really appropriate for the scale of this
 * topic.  But we thought it best to keep those units when implementing the model, so that the implementation matches
 * the specification.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  // constants
  var MILLIMETERS_PER_METER = 1000;

  var UnitsUtils = {
    /**
     * Utility function to convert from meters to millimeters.
     * @public
     *
     * @param {number} d
     * @returns {number}
     */
    metersToMillimeters: function( d ) {
      return d * MILLIMETERS_PER_METER;
    },

    /**
     * Utility function to convert meters squared to millimeters squared.
     * @public
     *
     * @param {number} d
     * @returns {number}
     */
    metersSquaredToMillimetersSquared: function( d ) {
      return d * ( MILLIMETERS_PER_METER * MILLIMETERS_PER_METER );
    }
  };

  capacitorLabBasics.register( 'UnitsUtils', UnitsUtils );

  return UnitsUtils;
} );
