//  Copyright 2002-2014, University of Colorado Boulder

/**
 *
 * @author Emily Randall
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );

  /**
   * Main constructor for CapacitorLabModel, which contains all of the model logic for the entire sim screen.
   * @constructor
   */
  function CapacitorLabModel() {

    PropertySet.call( this, {
      // voltage on the battery
      voltage: 0,
      // charges on plates visible?
      plateChargeVisible: true,
      // electric field lines visible?
      eFieldVisible: false,
      // capacitance meter visible?
      capacitanceMeter: false,
      // plate charge meter visible?
      plateChargeMeter: false,
      // stored energy meter visible?
      energyMeter: false,
      // voltmeter visible?
      voltMeter: false,
      // electric field meter visible?
      eFieldMeter: false,
      // battery connected?
      batteryConnected: true,
      // amount of charge on the upper plate
      upperPlateCharge: 0,
      // capacitance of the plates
      capacitance: 5
      } );
  }

  return inherit( PropertySet, CapacitorLabModel, {

    // Called by the animation loop. Optional, so if your model has no animation, you can omit this.
    step: function( dt ) {
      // Handle model animation here.
    }
  } );
} );