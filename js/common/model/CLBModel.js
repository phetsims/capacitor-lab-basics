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
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
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
     * Compute maximum possible charge on the top plate as
     *
     * Q_max = (epsilon_0 * A_max / d_min) * V_max
     *
     * where A is the plate area, d is the plate separation, and V is the battery voltage.
     * @public
     *
     * @returns {number} charge in Coulombs
     */
    getMaxPlateCharge: function() {

      var maxArea = CLBConstants.PLATE_WIDTH_RANGE.max * CLBConstants.PLATE_WIDTH_RANGE.max;
      var maxVoltage = CLBConstants.BATTERY_VOLTAGE_RANGE.max;

      return CLBConstants.EPSILON_0 * maxArea * maxVoltage / CLBConstants.PLATE_SEPARATION_RANGE.min;
    },

    /**
     * Compute maximum possible E-field in the capacitor as
     *
     * E_max = Q_max / (epsilon_0 * A_min)
     *       = (A_max / A_min) * V_max / d_min
     *
     * where A is the plate area, d is the plate separation, and V is the battery voltage.
     * @public
     *
     * @return {number} E-field in V/m
     */
    getMaxEffectiveEField: function() {

      var maxArea = CLBConstants.PLATE_WIDTH_RANGE.max * CLBConstants.PLATE_WIDTH_RANGE.max;
      var minArea = CLBConstants.PLATE_WIDTH_RANGE.min * CLBConstants.PLATE_WIDTH_RANGE.min;

      return maxArea / minArea * CLBConstants.BATTERY_VOLTAGE_RANGE.max / CLBConstants.PLATE_SEPARATION_RANGE.min;
    },

    /**
     * Step function for the CLBModel.
     * @public
     *
     * @param {number} dt
     */
    step: function( dt ) {
      this.circuit.step( dt );
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
