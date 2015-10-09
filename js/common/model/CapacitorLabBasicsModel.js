// Copyright 2002-2015, University of Colorado Boulder

/**
 * Base model for Capacitor Lab: Basics.  This gets extended by CapacitorLabBasicsLightBulbModel and CapacitanceModel.
 * This base model holds high level view properties that are shared by both screens.
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
   * Constructor for the CapacitorLabBasicsModel.
   *
   * @constructor
   */
  function CapacitorLabBasicsModel() {

    // public
    PropertySet.call( this, {
      plateChargesVisible: CLConstants.PLATE_CHARGES_VISIBLE,
      eFieldVisible: CLConstants.EFIELD_VISIBLE,
      capacitanceMeterVisible: true,
      plateChargeMeterVisible: false,
      storedEnergyMeterVisible: false,
      barGraphsPanelVisible: true,
      voltmeterVisible: false,
      eFieldDetectorVisible: false,
      currentIndicatorsVisible: true,
    } );
  }

  return inherit( PropertySet, CapacitorLabBasicsModel, {

    /**
     * Step function for this sim.
     *
     * @param {number} dt
     */
    step: function( dt ) {
      if ( this.playing ) {
        // TODO: Something should maybe be here?
      }
    }

  } );
} );