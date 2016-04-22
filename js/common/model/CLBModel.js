// Copyright 2015, University of Colorado Boulder

/**
 * Base model for Capacitor Lab: Basics.  This gets extended by CLBLightBulbModel and CapacitanceModel.
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
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  /**
   * Constructor for the CLBModel.
   *
   * @constructor
   */
  function CLBModel() {

    // public
    PropertySet.call( this, {
      plateChargesVisible: CLConstants.PLATE_CHARGES_VISIBLE,
      eFieldVisible: CLConstants.EFIELD_VISIBLE,
      capacitanceMeterVisible: true,
      plateChargeMeterVisible: false,
      storedEnergyMeterVisible: false,
      barGraphsPanelVisible: true,
      voltmeterVisible: false,
      currentIndicatorsVisible: true
    } );
  }

  capacitorLabBasics.register( 'CLBModel', CLBModel );

  return inherit( PropertySet, CLBModel );
} );