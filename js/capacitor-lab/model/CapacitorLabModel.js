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
  var Bounds2 = require( 'DOT/Bounds2' );

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
      // capacitance meter position
      capacitanceMeterPosition: new Bounds2( 0, 0 ),
      // plate charge meter visible?
      plateChargeMeter: false,
      // plateCharge meter position
      plateChargeMeterPosition: new Bounds2( 0, 0 ),
      // stored energy meter visible?
      energyMeter: false,
      // energy meter position
      energyMeterPosition: new Bounds2( 500, 30 ),
      // voltmeter visible?
      voltMeter: false,
      // electric field meter visible?
      eFieldMeter: false,
      // battery connected?
      batteryConnected: true,
      // amount of charge on the upper plate
      upperPlateCharge: 0.13E-12,
      // capacitance of the plates
      capacitance: .89E-13,
      // stored energy in the capacitor
      energy: 0,
      // area of the capacitor plates (mm^2)
      capacitorPlateArea: 100,
      // distance between the capacitor plates (mm)
      plateSeparation: 10,
      } );
  }

  return inherit( PropertySet, CapacitorLabModel, {

    // Called by the animation loop. Optional, so if your model has no animation, you can omit this.
    step: function( dt ) {
      // Handle model animation here.
    },
    
    moveMeterToPosition: function( position, node ) {
      node.centerX = position.x;
      node.centerY = position.y;
    },
    
    updateCapacitanceAndCharge: function() {
      this.capacitanceProperty.value = 8.854E-12 * this.capacitorPlateAreaProperty.value * 1E-6 / (this.plateSeparationProperty.value * 1E-3);
      if (this.batteryConnectedProperty.value) {
        this.upperPlateChargeProperty.value = this.voltageProperty.value * this.capacitanceProperty.value;
      }
      this.energyProperty.value = Math.pow(this.upperPlateChargeProperty.value, 2) / this.capacitanceProperty.value / 2;
    }
  } );
} );