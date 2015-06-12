// Copyright 2002-2015, University of Colorado Boulder

/**
 * Utilities for converting between different units.  These are the common conversions required when going between model
 * and view.
 *
 * NOTE: The design of this sim chose to specify the model in units that aren't really appropriate for the scale of this
 * topic.  But we thought it best to keep those units when implementing the model, so that the implementation matches
 * the specification.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );

  // constants
  var MILLIMETERS_PER_METER = 1000;

  /**
   * Constructor for UnitsUtils.
   * @constructor
   */
  function UnitsUtils() {}

  return inherit( Object, UnitsUtils, {}, {

    /**
     * Utility function to convert from meters to millimeters.
     *
     * @param {number} d
     * @returns {number}
     */
    metersToMillimeters: function( d ) {
      return d * MILLIMETERS_PER_METER;
    },

    /**
     * Utility function to convert meters squared to millimeters squared.
     *
     * @param {number} d
     * @returns {number}
     */
    metersSquaredToMillimetersSquared: function( d ) {
      return d * ( MILLIMETERS_PER_METER * MILLIMETERS_PER_METER );
    }

  } );
} );
