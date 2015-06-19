// Copyright 2002-2015, University of Colorado Boulder

/**
 * Base Model for CapacitorLab.  As of 5/28/15, CapacitorLab includes a simplified version of the Introduction screen of the
 * original Java sim with a few added features.  Specifically, the port of Capacitor Lab will not include Dielectrics
 * and it is likely to include a light bulb. This is to be determined soon (5/28/15).
 *
 * @author Chris Malley
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var CLConstants = require( 'CAPACITOR_LAB_BASICS/common/CLConstants' );

  /**
   * Constructor for the CapacitorLabModel.
   *
   * @constructor
   */
  function CapacitorLabModel() {

    PropertySet.call( this, {
      plateChargesVisible: CLConstants.PLATE_CHARGES_VISIBLE,
      eFieldVisible: CLConstants.EFIELD_VISIBLE,
      capacitanceMeterVisible: false,
      plateChargeMeterVisible: false,
      storedEnergyMeterVisible: false,
      voltmeterVisible: false,
      eFieldDetectorVisible: false,
      valuesVisible: true,
      playing: true // is the sim running or paused?
    } );

  }

  return inherit( PropertySet, CapacitorLabModel, {

    /**
     * Step function for this sim.
     *
     * @param {number} dt
     */
    step: function( dt ) {
      if ( this.playing ) {
        // TODO
      }
    },

    /**
     * Manually step one frame, assuming 60fps.
     */
    manualStep: function() {
      // TODO
    }

  } );
} );