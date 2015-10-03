// Copyright 2002-2015, University of Colorado Boulder

/**
 * The "Intro" model for Capacitor Lab: Basics.  The intro model has a battery connected in parallel to a capacitor, and
 * allows the user to modify capacitor plate geometry to illustrate relationships with capacitance.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var CLConstants = require( 'CAPACITOR_LAB_BASICS/common/CLConstants' );
  var Vector3 = require( 'DOT/Vector3' );
  var CircuitConfig = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitConfig' );
  var CapacitanceCircuit = require( 'CAPACITOR_LAB_BASICS/capacitance/model/CapacitanceCircuit' );
  var BarMeter = require( 'CAPACITOR_LAB_BASICS/common/model/meter/BarMeter' );
  var Voltmeter = require( 'CAPACITOR_LAB_BASICS/common/model/meter/Voltmeter' );
  var Capacitor = require( 'CAPACITOR_LAB_BASICS/common/model/Capacitor' );
  var CLModelViewTransform3D = require( 'CAPACITOR_LAB_BASICS/common/model/CLModelViewTransform3D' );
  var CapacitorLabBasicsModel = require( 'CAPACITOR_LAB_BASICS/common/model/CapacitorLabBasicsModel' );
  var DielectricMaterial = require( 'CAPACITOR_LAB_BASICS/common/model/DielectricMaterial' );

  // constants
  // Circuit
  var BATTERY_LOCATION = new Vector3( 0.0065, 0.030, 0 ); // meters
  var CAPACITOR_X_SPACING = 0.024; // meters
  var CAPACITOR_Y_SPACING = 0; // meters
  var PLATE_WIDTH = CLConstants.PLATE_WIDTH_RANGE.defaultValue;
  var PLATE_SEPARATION = CLConstants.PLATE_SEPARATION_RANGE.defaultValue;
  var WIRE_THICKNESS = CLConstants.WIRE_THICKNESS;
  var WIRE_EXTENT = 0.016; // how far the wire extends above or below the capacitor (meters)

  // Capacitance meter
  var CAPACITANCE_METER_LOCATION = new Vector3( 0.0475, 0.0017, 0 );

  // Voltmeter
  var VOLTMETER_BODY_LOCATION = new Vector3( 0.071, 0.026, 0 );
  var VOLTMETER_POSITIVE_PROBE_LOCATION = new Vector3( BATTERY_LOCATION.x + 0.015, BATTERY_LOCATION.y, 0 );
  var VOLTMETER_NEGATIVE_PROBE_LOCATION = new Vector3( VOLTMETER_POSITIVE_PROBE_LOCATION.x + 0.005, VOLTMETER_POSITIVE_PROBE_LOCATION.y, 0 );
  var VOLTMETER_VISIBLE = false;

  /**
   * Constructor for the CapacitanceModel.
   *
   * @param {CLModelViewTransform3D} modelViewTransform
   */
  function CapacitanceModel( modelViewTransform ) {

    CapacitorLabBasicsModel.call( this );

    this.modelViewTransform = modelViewTransform; // @ public (read-only)

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

    this.dielectricMaterial = DielectricMaterial.Air(); // @public (read-only)

    this.circuit = new CapacitanceCircuit( circuitConfig ); // @public
    this.worldBounds = CLConstants.CANVAS_RENDERING_SIZE.toBounds(); // @private

    this.capacitanceMeter = BarMeter.CapacitanceMeter( this.circuit, this.worldBounds, CAPACITANCE_METER_LOCATION, this.capacitanceMeterVisibleProperty );

    // @public
    this.voltmeter = new Voltmeter( this.circuit, this.worldBounds, modelViewTransform,
      VOLTMETER_BODY_LOCATION, VOLTMETER_POSITIVE_PROBE_LOCATION, VOLTMETER_NEGATIVE_PROBE_LOCATION,
      VOLTMETER_VISIBLE );

  }

  return inherit( CapacitorLabBasicsModel, CapacitanceModel, {

    /**
     * Reset function for this model.
     */
    reset: function() {
      this.capacitanceMeter.reset();
      this.voltmeter.reset();
      this.circuit.reset();
    },

    /**
     * Step function for the CapacitorLabBasicsModel.
     *
     * @param {number} dt
     */
    step: function( dt ) {
      this.circuit.step( dt );
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
      var modelViewTransform = new CLModelViewTransform3D();
      var capacitor = new Capacitor( new Vector3( 0, 0, 0 ),
        CLConstants.PLATE_WIDTH_RANGE.max,
        CLConstants.PLATE_SEPARATION_RANGE.min,
        DielectricMaterial.CustomDielectricMaterial( CLConstants.DIELECTRIC_CONSTANT_RANGE.max ),
        CLConstants.DIELECTRIC_OFFSET_RANGE.min,
        modelViewTransform );
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
        wireExtent: WIRE_EXTENT,
        dielectricMaterial: DielectricMaterial.CustomDielectricMaterial( CLConstants.DIELECTRIC_CONSTANT_RANGE.min ),
        dielectricOffset: CLConstants.DIELECTRIC_OFFSET_RANGE.min
      } );

      var circuit = new CapacitanceCircuit( circuitConfig );

      // disconnect the battery and set the max plate charge
      //circuit.circuitConnection = CircuitConnectionEnum.OPEN_CIRCUIT;
      //circuit.setDisconnectedPlateCharge( this.getMaxPlateCharge() );

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

