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
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Vector3 = require( 'DOT/Vector3' );

  // phet-io modules
  var TBoolean = require( 'ifphetio!PHET_IO/types/TBoolean' );

  /**
   * Constructor for the CLBModel.
   * REVIEW: Both subtypes of this have tandem required, so can null ever be passed here?
   * @param {Tandem|null} tandem - null if this is part of a temporary circuit used for calculations
   *
   * @constructor
   */
  function CLBModel( tandem ) {

    //REVIEW: Use BooleanProperty instead
    //REVIEW: initial value presumably doesn't need to be refactored out here? This is the only usage.
    this.plateChargesVisibleProperty = new Property( CLBConstants.PLATE_CHARGES_VISIBLE, {
      tandem: tandem.createTandem( 'plateChargesVisibleProperty' ),
      phetioValueType: TBoolean
    } );
    //REVIEW: Use BooleanProperty instead
    //REVIEW: initial value presumably doesn't need to be refactored out here? This is the only usage.
    this.eFieldVisibleProperty = new Property( CLBConstants.EFIELD_VISIBLE, {
      tandem: tandem.createTandem( 'eFieldVisibleProperty' ),
      phetioValueType: TBoolean
    } );
    //REVIEW: Use BooleanProperty instead
    //REVIEW: This appears only relevant to the light-bulb screen, move to CLBLightBulbModel? (Can't toggle on first screen)
    this.capacitanceMeterVisibleProperty = new Property( true, {
      tandem: tandem.createTandem( 'capacitanceMeterVisibleProperty' ),
      phetioValueType: TBoolean
    } );
    //REVIEW: Use BooleanProperty instead
    //REVIEW: This is only relevant to the light-bulb screen, move to CLBLightBulbModel
    this.plateChargeMeterVisibleProperty = new Property( false, {
      tandem: tandem.createTandem( 'plateChargeMeterVisibleProperty' ),
      phetioValueType: TBoolean
    } );
    //REVIEW: Use BooleanProperty instead
    //REVIEW: This is only relevant to the light-bulb screen, move to CLBLightBulbModel
    this.storedEnergyMeterVisibleProperty = new Property( false, {
      tandem: tandem.createTandem( 'storedEnergyMeterVisibleProperty' ),
      phetioValueType: TBoolean
    } );
    //REVIEW: Use BooleanProperty instead
    this.barGraphsVisibleProperty = new Property( true, {
      tandem: tandem.createTandem( 'barGraphsVisibleProperty' ),
      phetioValueType: TBoolean
    } );
    //REVIEW: Use BooleanProperty instead
    this.voltmeterVisibleProperty = new Property( false, {
      tandem: tandem.createTandem( 'voltmeterVisibleProperty' ),
      phetioValueType: TBoolean
    } );
    //REVIEW: Use BooleanProperty instead
    this.currentVisibleProperty = new Property( true, {
      tandem: tandem.createTandem( 'currentVisibleProperty' ),
      phetioValueType: TBoolean
    } );

    //REVIEW: Note that subtypes are setting this also. Recommend to only set it here.
    this.tandem = tandem; // @private
  }

  capacitorLabBasics.register( 'CLBModel', CLBModel );

  return inherit( Object, CLBModel, {

    /**
     * Return a capacitor with the maximum amount of charge allowed by the model.
     * REVIEW: visibility doc
     *
     * @returns {Capacitor}
     */
    getCapacitorWithMaxCharge: function() {
      // arbitrary model view transform
      var modelViewTransform = new CLBModelViewTransform3D();

      // This component is constructed as part of an implementation and gets a
      // disabled tandem instance. All children will inherit the `enabled` value
      // unless specifically overridden.
      //REVIEW: Why do we even pass a disabled tandem in here? Would be cleaner to not provide it.
      var disabledTandem = this.tandem.createTandem( 'tempCapacitor', {
        enabled: false
      } );

      // Construct Capacitor without a Tandem instance (null), since this is an intermediate object
      // used only in calculations.
      //REVIEW tip: new Vector3() is a (0,0,0)
      //REVIEW: This is the only usage of a raw Capacitor. Can we get rid of this, so we can only have SwitchedCapacitor?
      var capacitor = new Capacitor( new Vector3( 0, 0, 0 ), modelViewTransform, disabledTandem, {
        plateWidth: CLBConstants.PLATE_WIDTH_RANGE.max,
        plateSeparation: CLBConstants.PLATE_SEPARATION_RANGE.min
      } );

      capacitor.platesVoltageProperty.set( CLBConstants.BATTERY_VOLTAGE_RANGE.max );
      return capacitor;
    },

    //REVIEW: doc
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
