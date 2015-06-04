// Copyright 2002-2015, University of Colorado Boulder

/**
 * The "Intro" model for Capacitor Lab.
 *
 * This model is identical to the "Dielectric" model of the sim.  If the entire Capacitor Lab is ported at a later
 * date, this file should be renamed to CapacitorLabDielectricModel, moved to /dielectric/model and
 * CapacitorLabIntroScreen should call CapacitorLabDielectricModel.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */

define( function( require ) {
 'use strict';

 // modules
 var inherit = require( 'PHET_CORE/inherit' );
 var CLConstants = require( 'CAPACITOR_LAB/common/CLConstants' );
 var Vector3 = require( 'DOT/Vector3' );
 var CircuitConfig = require( 'CAPACITOR_LAB/common/model/CircuitConfig' );
 var SingleCircuit = require( 'CAPACITOR_LAB/common/model/circuit/SingleCircuit' );
 var BarMeter = require( 'CAPACITOR_LAB/common/model/meter/BarMeter' );
 var EFieldDetector = require( 'CAPACITOR_LAB/common/model/meter/EFieldDetector' );
 var Voltmeter = require( 'CAPACITOR_LAB/common/model/meter/Voltmeter' );
 var Capacitor = require( 'CAPACITOR_LAB/common/model/Capacitor' );
 var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
 var CapacitorLabModel = require( 'CAPACITOR_LAB/common/model/CapacitorLabModel' );

 // constants
 // Circuit
 var BATTERY_LOCATION = new Vector3( 0.005, 0.034, 0 ); // meters
 var BATTERY_CONNECTED = true;
 var CAPACITOR_X_SPACING = 0.025; // meters
 var CAPACITOR_Y_SPACING = 0; // meters
 var PLATE_WIDTH = CLConstants.PLATE_WIDTH_RANGE.defaultValue;
 var PLATE_SEPARATION = CLConstants.PLATE_SEPARATION_RANGE.defaultValue;
 var WIRE_THICKNESS = CLConstants.WIRE_THICKNESS;
 var WIRE_EXTENT = 0.016; // how far the wire extends above or below the capacitor (meters)

 // Capacitance meter
 var CAPACITANCE_METER_LOCATION = new Vector3( 0.038, 0.0017, 0 );
 var CAPACITANCE_METER_VISIBLE = false;

 // Plate Charge meter
 var PLATE_CHARGE_METER_LOCATION = new Vector3( 0.049, 0.0017, 0 );
 var PLATE_CHARGE_METER_VISIBLE = false;

 // Stored Energy meter
 var STORED_ENERGY_METER_LOCATION = new Vector3( 0.06, 0.0017, 0 );
 var STORED_ENERGY_METER_VISIBLE = false;

 // E-Field Detector
 var EFIELD_DETECTOR_BODY_LOCATION = new Vector3( 0.043, 0.041, 0 );
 var EFIELD_DETECTOR_PROBE_LOCATION = BATTERY_LOCATION;
 var EFIELD_DETECTOR_VISIBLE = false;
 var EFIELD_PLATE_VECTOR_VISIBLE = true;
 var EFIELD_DIELECTRIC_VECTOR_VISIBLE = true;
 var EFIELD_SUM_VECTOR_VISIBLE = true;
 var EFIELD_VALUES_VISIBLE = true;

 // Voltmeter
 var VOLTMETER_BODY_LOCATION = new Vector3( 0.057, 0.023, 0 );
 var VOLTMETER_POSITIVE_PROBE_LOCATION = new Vector3( BATTERY_LOCATION.x + 0.015, BATTERY_LOCATION.y, 0 );
 var VOLTMETER_NEGATIVE_PROBE_LOCATION = new Vector3( VOLTMETER_POSITIVE_PROBE_LOCATION.x + 0.005, VOLTMETER_POSITIVE_PROBE_LOCATION.y, 0 );
 var VOLTMETER_VISIBLE = false;

 /**
  * Constructor for the Dielectric Model.
  *
  * @param {Bounds2} worldBounds
  * @param {ModelViewTransform2} modelViewTransform
  * @param {Vector3} dielectricOffset
  * @param {array.<DielectricMaterial>} dielectricMaterials
  */
 function CapacitorLabIntroModel( worldBounds, modelViewTransform, dielectricOffset, dielectricMaterials ) {

  CapacitorLabModel.call( this );
  // configuration info for the circuit
  var circuitConfig = new CircuitConfig( {
   modelViewTransform: modelViewTransform,
   batteryLocation: BATTERY_LOCATION,
   capacitorXSpacing: CAPACITOR_X_SPACING,
   capacitorYSpacing: CAPACITOR_Y_SPACING,
   plateWidth: PLATE_WIDTH,
   plateSeparation: PLATE_SEPARATION,
   wireExtent: WIRE_EXTENT,
   wireThickness: WIRE_THICKNESS
  } );

  this.dielectricMaterials = dielectricMaterials;

  this.circuit = new SingleCircuit( circuitConfig, BATTERY_CONNECTED );
  this.worldBounds = worldBounds;

  this.capacitanceMeter = BarMeter.CapacitanceMeter( this.circuit, worldBounds, CAPACITANCE_METER_LOCATION, CAPACITANCE_METER_VISIBLE );
  this.plateChargeMeter = BarMeter.PlateChargeMeter( this.circuit, worldBounds, PLATE_CHARGE_METER_LOCATION, PLATE_CHARGE_METER_VISIBLE );
  this.storedEnergyMeter = BarMeter.StoredEnergyMeter( this.circuit, worldBounds, STORED_ENERGY_METER_LOCATION, STORED_ENERGY_METER_VISIBLE );

  this.eFieldDetector = new EFieldDetector( this.circuit, this.worldBounds, modelViewTransform, EFIELD_DETECTOR_BODY_LOCATION, EFIELD_DETECTOR_PROBE_LOCATION,
    EFIELD_DETECTOR_VISIBLE, EFIELD_PLATE_VECTOR_VISIBLE, EFIELD_DIELECTRIC_VECTOR_VISIBLE,
    EFIELD_SUM_VECTOR_VISIBLE, EFIELD_VALUES_VISIBLE );

  this.voltmeter = new Voltmeter( this.circuit, this.worldBounds, modelViewTransform,
    VOLTMETER_BODY_LOCATION, VOLTMETER_POSITIVE_PROBE_LOCATION, VOLTMETER_NEGATIVE_PROBE_LOCATION,
    VOLTMETER_VISIBLE );

 }

 return inherit( CapacitorLabModel, CapacitorLabIntroModel, {

  /**
   * Reset function for this model.
   */
  reset: function() {
   this.capacitanceMeter.reset();
   this.plateChargeMeter.reset();
   this.storedEnergyMeter.reset();
   this.eFieldDetector.reset();
   this.voltmeter.reset();
   this.circuit.reset();
  },

  /**
   * Gets the maximum charge on the top plate (Q_total).
   * We compute this with the battery connected because this is used to determine the range of the Plate Charge
   * slider.
   */
  getMaxPlateCharge: function() {
   return this.getCapacitorWithMaxCharge().getTotalPlateCharge();
  },

  /**
   * Gets the maximum excess charge for the dielectric area (Q_excess_dielectric).
   */
  getMaxExcessDielectricPlateCharge: function() {
   return this.getCapacitorWithMaxCharge().getExcessDielectricPlateCharge();
  },

  // Gets a capacitor with maximum charge.
  getCapacitorWithMaxCharge: function() {
   var mvt = ModelViewTransform2.createIdentity();
   //var mvt = new CLModelViewTransform3D();
   var capacitor = new Capacitor( new Vector3( 0, 0, 0 ),
     CLConstants.PLATE_WIDTH_RANGE.maxX,
     CLConstants.PLATE_SEPARATION_RANGE.minX,
     mvt );
   capacitor.platesVoltage = CLConstants.BATTERY_VOLTAGE_RANGE.max;
   return capacitor;
  },

  /**
   * Gets the maximum effective E-field between the plates (E_effective).
   * The maximum occurs when the battery is disconnected, the Plate Charge control is set to its maximum,
   * the plate area is set to its minimum, and the dielectric constant is min, and the dielectric is fully inserted.
   * And in this situation, plate separation is irrelevant.
   *
   * return {number}
   */
  getMaxEffectiveEField: function() {
   var circuitConfig = new CircuitConfig( {
    capacitorXSpacing: CAPACITOR_X_SPACING,
    capacitorYSpacing: CAPACITOR_Y_SPACING,
    plateWidth: CLConstants.PLATE_WIDTH_RANGE.min,
    plateSeparation: CLConstants.PLATE_SEPARATION_RANGE.min,
    wireThickness: CLConstants.WIRE_THICKNESS,
    wireExtent: WIRE_EXTENT
   } );

   var circuit = new SingleCircuit( circuitConfig, false /* batteryConnected */ );
   circuit.setDisconnectedPlateCharge( this.getMaxPlateCharge() );
   return circuit.capacitor.getEffectiveEField();
  },

  /**
   * Gets the E-field reference magnitude, used to determine the initial scale of the E-Field Detector.
   * This is based on the default capacitor configuration, with maximum battery voltage.
   *
   * @return {number}
   */
  getEFieldReferenceMagnitude: function() {
   var capacitor = new Capacitor( {
    plateWidth: CLConstants.PLATE_WIDTH_RANGE.defaultValue,
    plateSeparation: CLConstants.PLATE_SEPARATION_RANGE.defaultValue
   } );
   capacitor.platesVoltage = CLConstants.BATTERY_VOLTAGE_RANGE.max;
   return capacitor.getEffectiveEField();
  }

 } );
} );

