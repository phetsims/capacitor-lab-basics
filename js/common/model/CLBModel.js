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
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var Capacitor = require( 'CAPACITOR_LAB_BASICS/common/model/Capacitor' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var CLBModelViewTransform3D = require( 'CAPACITOR_LAB_BASICS/common/model/CLBModelViewTransform3D' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector3 = require( 'DOT/Vector3' );
  var Voltmeter = require( 'CAPACITOR_LAB_BASICS/common/model/meter/Voltmeter' );

  // phet-io modules
  var TBoolean = require( 'ifphetio!PHET_IO/types/TBoolean' );

  /**
   * @param {Property.<boolean>} switchUsedProperty - whether switch has been changed by user. Affects both screens.
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Tandem} tandem
   * @constructor
   */
  function CLBModel( switchUsedProperty, modelViewTransform, tandem ) {

    this.switchUsedProperty = switchUsedProperty; // @public
    this.modelViewTransform = modelViewTransform; // @public (read-only)

    this.plateChargesVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'plateChargesVisibleProperty' ),
      phetioValueType: TBoolean
    } );

    this.eFieldVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'eFieldVisibleProperty' ),
      phetioValueType: TBoolean
    } );

    this.capacitanceMeterVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'capacitanceMeterVisibleProperty' ),
      phetioValueType: TBoolean
    } );

    this.barGraphsVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'barGraphsVisibleProperty' ),
      phetioValueType: TBoolean
    } );

    this.voltmeterVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'voltmeterVisibleProperty' ),
      phetioValueType: TBoolean
    } );

    this.currentVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'currentVisibleProperty' ),
      phetioValueType: TBoolean
    } );

    this.worldBounds = CLBConstants.CANVAS_RENDERING_SIZE.toBounds(); // @private

    // @public
    this.voltmeter = new Voltmeter( this.circuit, this.worldBounds, modelViewTransform, tandem.createTandem( 'voltmeter' ) );

    this.tandem = tandem; // @protected

    this.circuit.maxPlateCharge = this.getMaxPlateCharge();
    this.circuit.maxEffectiveEField = this.getMaxEffectiveEField();
  }

  capacitorLabBasics.register( 'CLBModel', CLBModel );

  return inherit( Object, CLBModel, {

    /**
     * Return a capacitor with the maximum amount of charge allowed by the model.
     * @public
     *
     * @returns {Capacitor}
     */
    getCapacitorWithMaxCharge: function() {
      // arbitrary model view transform
      var modelViewTransform = new CLBModelViewTransform3D();

      // The capacitor below is constructed to implement a calculation and should
      // not be instrumented, but null/undefined tandem instances cause problems.
      // So it is given a Tandem instance with `enabled: false`.
      // All its children inherit this `enabled` setting unless overridden.
      var disabledTandem = this.tandem.createTandem( 'tempCapacitor', { enabled: false } );

      //REVIEW: This is the only usage of a raw Capacitor. Can we get rid of this, so we can only have SwitchedCapacitor?
      var capacitor = new Capacitor( new Vector3(), modelViewTransform, disabledTandem, {
        plateWidth: CLBConstants.PLATE_WIDTH_RANGE.max,
        plateSeparation: CLBConstants.PLATE_SEPARATION_RANGE.min
      } );

      capacitor.platesVoltageProperty.set( CLBConstants.BATTERY_VOLTAGE_RANGE.max );
      return capacitor;
    },

    /**
     * Gets the maximum charge on the top plate (Q_total).
     * We compute this with the battery connected because this is used to
     * determine the range of the Plate Charge slider.
     * @public
     *
     * @returns {number} max plate charge
     */
    getMaxPlateCharge: function() {
      return this.getCapacitorWithMaxCharge().getPlateCharge();
    },

    // @public
    reset: function() {
      this.plateChargesVisibleProperty.reset();
      this.eFieldVisibleProperty.reset();
      this.capacitanceMeterVisibleProperty.reset();
      this.barGraphsVisibleProperty.reset();
      this.voltmeterVisibleProperty.reset();
      this.currentVisibleProperty.reset();
      this.switchUsedProperty.reset();
    }
  } );
} );
