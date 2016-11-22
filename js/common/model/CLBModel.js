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
  var Capacitor = require( 'CAPACITOR_LAB_BASICS/common/model/Capacitor' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var CLBModelViewTransform3D = require( 'CAPACITOR_LAB_BASICS/common/model/CLBModelViewTransform3D' );
  var DielectricMaterial = require( 'CAPACITOR_LAB_BASICS/common/model/DielectricMaterial' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Vector3 = require( 'DOT/Vector3' );

  // phet-io modules
  var TBoolean = require( 'ifphetio!PHET_IO/types/TBoolean' );

  /**
   * Constructor for the CLBModel.
   * @param {Tandem|null} tandem - null if this is part of a temporary circuit used for calculations
   *
   * @constructor
   */
  function CLBModel( tandem ) {

    this.plateChargesVisibleProperty = new Property( CLBConstants.PLATE_CHARGES_VISIBLE, {
      tandem: tandem.createTandem( 'plateChargesVisibleProperty' ),
      phetioValueType: TBoolean
    } );
    this.eFieldVisibleProperty = new Property( CLBConstants.EFIELD_VISIBLE, {
      tandem: tandem.createTandem( 'eFieldVisibleProperty' ),
      phetioValueType: TBoolean
    } );
    this.capacitanceMeterVisibleProperty = new Property( true, {
      tandem: tandem.createTandem( 'capacitanceMeterVisibleProperty' ),
      phetioValueType: TBoolean
    } );
    this.plateChargeMeterVisibleProperty = new Property( false, {
      tandem: tandem.createTandem( 'plateChargeMeterVisibleProperty' ),
      phetioValueType: TBoolean
    } );
    this.storedEnergyMeterVisibleProperty = new Property( false, {
      tandem: tandem.createTandem( 'storedEnergyMeterVisibleProperty' ),
      phetioValueType: TBoolean
    } );
    this.barGraphsVisibleProperty = new Property( true, {
      tandem: tandem.createTandem( 'barGraphsVisibleProperty' ),
      phetioValueType: TBoolean
    } );
    this.voltmeterVisibleProperty = new Property( false, {
      tandem: tandem.createTandem( 'voltmeterVisibleProperty' ),
      phetioValueType: TBoolean
    } );
    this.currentVisibleProperty = new Property( true, {
      tandem: tandem.createTandem( 'currentVisibleProperty' ),
      phetioValueType: TBoolean
    } );

    this.tandem = tandem; // @private
  }

  capacitorLabBasics.register( 'CLBModel', CLBModel );

  return inherit( Object, CLBModel, {

    /**
     * Return a capacitor with the maximum amount of charge allowed by the model.
     *
     * @return {Capacitor}
     */
    getCapacitorWithMaxCharge: function() {
      // arbitrary model view transform
      var modelViewTransform = new CLBModelViewTransform3D();

      // This component is constructed as part of an implementation and gets a
      // disabled tandem instance. All children will inherit the `enabled` value
      // unless specifically overridden.
      var disabledTandem = this.tandem.createTandem( 'tempCapacitor', {
        enabled: false
      } );

      // Construct Capacitor without a Tandem instance (null), since this is an intermediate object
      // used only in calculations.
      var capacitor = new Capacitor( new Vector3( 0, 0, 0 ), modelViewTransform, disabledTandem, {
        plateWidth: CLBConstants.PLATE_WIDTH_RANGE.max,
        plateSeparation: CLBConstants.PLATE_SEPARATION_RANGE.min,
        dielectricMaterial: DielectricMaterial.createCustomDielectricMaterial( CLBConstants.DIELECTRIC_CONSTANT_RANGE.max ),
        dielectricOffset: CLBConstants.DIELECTRIC_OFFSET_RANGE.min
      } );

      capacitor.platesVoltageProperty.set( CLBConstants.BATTERY_VOLTAGE_RANGE.max );
      return capacitor;
    },

    reset: function() {
      this.plateChargesVisibleProperty.reset();
      this.eFieldVisibleProperty.reset();
      this.capacitanceMeterVisibleProperty.reset();
      this.plateChargeMeterVisibleProperty.reset();
      this.storedEnergyMeterVisibleProperty.reset();
      this.barGraphsVisibleProperty.reset();
      this.voltmeterVisibleProperty.reset();
      this.currentVisibleProperty.reset();
    }
  } );
} );
