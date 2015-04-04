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
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * Main constructor for CapacitorLabModel, which contains all of the model logic for the entire sim screen.
   * @constructor
   */
  function CapacitorLabModel() {
    PropertySet.call( this, {
      /* Measurable quantities */
      // voltage of the battery (V)
      voltage: 0,
      // amount of charge on the upper plate (C)
      upperPlateCharge: 0,
      // capacitance of the plates (F)
      capacitance: 0.89E-13,
      // stored energy in the capacitor (J)
      energy: 0,
      // electric field
      eField: 0,
      // area of the capacitor plates (mm^2)
      capacitorPlateArea: 100,
      // distance between the capacitor plates (mm)
      plateSeparation: 10,
      
      /* Meter visibility */
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
      
      /* Meter and probe positions */
      // capacitance meter position
      capacitanceMeterPosition: new Vector2( 335, 100 ),
      // plate charge meter position
      plateChargeMeterPosition: new Vector2( 435, 100 ),
      // energy meter position
      energyMeterPosition: new Vector2( 535, 100 ),
      // voltmeter position
      voltMeterPosition: new Vector2( 100, 100 ),
      // electric field meter position
      eFieldMeterPosition: new Vector2( 0, 50 ),
      
      // position of the red probe
      redProbePosition: new Vector2( -355, 100 ),
      // position of the black probe
      blackProbePosition: new Vector2( -315, 100 ),
      // position of the electric field probe
      eFieldProbePosition: new Vector2( -213, 10 ),
      
      /* Other */
      // charges on plates visible?
      plateChargeVisible: true,
      // electric field lines visible?
      eFieldVisible: false,
      // battery connected?
      batteryConnected: true,
      // show the value of the electric field on the meter?
      eFieldValueVisible: true,
      } );
  }

  return inherit( PropertySet, CapacitorLabModel, {

    // Called by the animation loop. Optional, so if your model has no animation, you can omit this.
    step: function( dt ) {
      // Handle model animation here.
    },
    
    // Move the bar meters, the body of the voltmeter, and the body of the electric field meter
    moveMeterToPosition: function( position, positionProperty ) {
      positionProperty.value = position;
    },
    
    // Move the red and black voltage probes
    moveProbeToPosition: function( position, isRedProbe ) {
      if (isRedProbe) {
        this.redProbePositionProperty.value = position;
      }
      else {
        this.blackProbePositionProperty.value = position;
      }
    },
    
    // Move the grey electric field probe
    moveEFieldProbeToPosition: function ( position ) {
      this.eFieldProbePositionProperty.value = position;
    },
    
    // Whenever the voltage, plate area, or plate separation change, this is called
    // Updates the capacitance, charge, energy, and electric field properties
    updateCapacitanceAndCharge: function() {
      this.capacitanceProperty.value = 8.854E-12 * this.capacitorPlateAreaProperty.value * 1E-6 / (this.plateSeparationProperty.value * 1E-3);
      if (this.batteryConnectedProperty.value) {
        this.upperPlateChargeProperty.value = this.voltageProperty.value * this.capacitanceProperty.value;
      }
      this.energyProperty.value = Math.pow(this.upperPlateChargeProperty.value, 2) / this.capacitanceProperty.value / 2;
      this.eFieldProperty.value = this.upperPlateChargeProperty.value / (8.854E-12 * this.capacitorPlateAreaProperty.value * 1E-6);
    }
  } );
} );