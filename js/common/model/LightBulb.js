// Copyright 2002-2015, University of Colorado Boulder

/**
 * Model of a lightBulb, used in the Capacitor Lab: Basics sim.
 *
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector3 = require( 'DOT/Vector3' );
  var CLConstants = require( 'CAPACITOR_LAB_BASICS/common/CLConstants' );

  /**
   * Constructor for the Capacitor.
   * @param {Vector3} location
   * @constructor
   */
  function LightBulb( location ) {

    // immutable variables.
    this.location = location;

    PropertySet.call( this, {
      /* Populate with required properties */
    } );
  }
  return inherit( PropertySet, LightBulb, {

    /**
     *
     */
    getTopConnectionPoint: function() {
      return new Vector3( this.location.x, this.location.y - CLConstants.PLATE_SEPARATION_RANGE.max / 2, this.location.z );
    },

    getBottomConnectionPoint: function() {
      return new Vector3( this.location.x, this.location.y + CLConstants.PLATE_SEPARATION_RANGE.max / 2, this.location.z );
    }
  } );
} );