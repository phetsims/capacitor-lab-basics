// Copyright 2015, University of Colorado Boulder

/**
 * The main model for the "Light Bulb" screen of Capacitor Lab: Basics.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var Vector3 = require( 'DOT/Vector3' );
  var CircuitConfig = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitConfig' );
  var LightBulbCircuit = require( 'CAPACITOR_LAB_BASICS/light-bulb/model/LightBulbCircuit' );
  var BarMeter = require( 'CAPACITOR_LAB_BASICS/common/model/meter/BarMeter' );
  var Voltmeter = require( 'CAPACITOR_LAB_BASICS/common/model/meter/Voltmeter' );
  var CircuitConnectionEnum = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitConnectionEnum' );
  var CLBModel = require( 'CAPACITOR_LAB_BASICS/common/model/CLBModel' );
  var DielectricMaterial = require( 'CAPACITOR_LAB_BASICS/common/model/DielectricMaterial' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  // constants
  var BATTERY_LOCATION = new Vector3( 0.0065, 0.030, 0 ); // meters
  var CAPACITOR_X_SPACING = 0.0180; // meters
  var LIGHT_BULB_X_SPACING = 0.023; // meters
  var CAPACITOR_Y_SPACING = 0.0010; // meters
  var PLATE_WIDTH = CLBConstants.PLATE_WIDTH_RANGE.defaultValue;
  var PLATE_SEPARATION = CLBConstants.PLATE_SEPARATION_RANGE.defaultValue;
  var WIRE_THICKNESS = CLBConstants.WIRE_THICKNESS;
  var WIRE_EXTENT = 0.017; // how far the wire extends above or below the capacitor (meters)

  /**
   * @param {Property.<boolean>} switchUsedProperty - whether switch has been changed by user. Affects both screens.
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Tandem} tandem
   * @constructor
   */
  function CLBLightBulbModel( switchUsedProperty, modelViewTransform, tandem ) {

    CLBModel.call( this, tandem );

    this.switchUsedProperty = switchUsedProperty; // @public
    this.modelViewTransform = modelViewTransform; // @private

    // A requested PhET-iO customization is to simplify the switch into a 
    // single-pole double-throw switch for the light-bulb circuit instead of 
    // the default three-position version (phet-io/569). 
    // Enable with the switch=twoState query parameter.
    var useTwoStateSwitch = false;
    if ( phet.chipper.getQueryParameter( 'switch' ) === 'twoState' ) {
      useTwoStateSwitch = true;
    }

    var twoState = [
      CircuitConnectionEnum.BATTERY_CONNECTED,
      CircuitConnectionEnum.LIGHT_BULB_CONNECTED
    ];
    var threeState = [
      CircuitConnectionEnum.BATTERY_CONNECTED,
      CircuitConnectionEnum.OPEN_CIRCUIT,
      CircuitConnectionEnum.LIGHT_BULB_CONNECTED
    ];

    // configuration info for the circuit
    var circuitConfig = new CircuitConfig( {
      circuitConnections: useTwoStateSwitch ? twoState : threeState,
      modelViewTransform: modelViewTransform,
      batteryLocation: BATTERY_LOCATION,
      lightBulbXSpacing: LIGHT_BULB_X_SPACING,
      capacitorXSpacing: CAPACITOR_X_SPACING,
      capacitorYSpacing: CAPACITOR_Y_SPACING,
      plateWidth: PLATE_WIDTH,
      plateSeparation: PLATE_SEPARATION,
      wireExtent: WIRE_EXTENT,
      wireThickness: WIRE_THICKNESS,
      numberOfCapacitors: 1,
      numberOfLightBulbs: 1
    } );

    this.dielectricMaterial = DielectricMaterial.AIR; // @public (read-only)

    this.circuit = new LightBulbCircuit( circuitConfig, tandem.createTandem( 'circuit' ) ); // @public
    this.worldBounds = CLBConstants.CANVAS_RENDERING_SIZE.toBounds(); // private

    var circuit = this.circuit;

    // @public
    this.capacitanceMeter = new BarMeter( this.circuit, this.capacitanceMeterVisibleProperty,
      function() {
        return circuit.getTotalCapacitance();
      },
      tandem ? tandem.createTandem( 'capacitanceMeter' ) : null );
    this.plateChargeMeter = new BarMeter( this.circuit, this.plateChargeMeterVisibleProperty,
      function() {
        return circuit.getTotalCharge();
      },
      tandem ? tandem.createTandem( 'plateChargeMeter' ) : null );
    this.storedEnergyMeter = new BarMeter( this.circuit, this.storedEnergyMeterVisibleProperty,
      function() {
        return circuit.getStoredEnergy();
      },
      tandem ? tandem.createTandem( 'storedEnergyMeter' ) : null );

    this.voltmeter = new Voltmeter( this.circuit, this.worldBounds, modelViewTransform, tandem.createTandem( 'voltmeter' ) );

    this.circuit.maxPlateCharge = this.getMaxPlateCharge();
    this.circuit.maxEffectiveEField = this.getMaxEffectiveEField();
  }

  capacitorLabBasics.register( 'CLBLightBulbModel', CLBLightBulbModel );

  return inherit( CLBModel, CLBLightBulbModel, {

    /**
     * Reset function for this model.
     */
    reset: function() {
      CLBModel.prototype.reset.call( this );
      this.capacitanceMeter.reset();
      this.plateChargeMeter.reset();
      this.storedEnergyMeter.reset();
      this.voltmeter.reset();
      this.circuit.reset();
      this.switchUsedProperty.reset();
    },

    /**
     * Step function for the CLBModel.
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
        plateWidth: CLBConstants.PLATE_WIDTH_RANGE.min,
        plateSeparation: CLBConstants.PLATE_SEPARATION_RANGE.min,
        wireThickness: CLBConstants.WIRE_THICKNESS,
        wireExtent: WIRE_EXTENT,
        dielectricMaterial: DielectricMaterial.createCustomDielectricMaterial( CLBConstants.DIELECTRIC_CONSTANT_RANGE.min ),
        dielectricOffset: CLBConstants.DIELECTRIC_OFFSET_RANGE.min,
        numberOfCapacitors: 1,
        numberOfLightBulbs: 1
      } );

      // No tandem here - this is for internal implementation.
      var circuit = new LightBulbCircuit( circuitConfig, null );

      // disconnect the battery and set the max plate charge
      circuit.circuitConnection = CircuitConnectionEnum.OPEN_CIRCUIT;
      circuit.setDisconnectedPlateCharge( this.getMaxPlateCharge() );

      return circuit.capacitor.getEffectiveEField();
    }

  } );
} );
