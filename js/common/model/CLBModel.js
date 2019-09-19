// Copyright 2015-2019, University of Colorado Boulder

/**
 * Base model for Capacitor Lab: Basics.  This gets extended by CLBLightBulbModel and CapacitanceModel.
 * This base model holds high level view properties that are shared by both screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  const CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  const Color = require( 'SCENERY/util/Color' );
  const ColorIO = require( 'SCENERY/util/ColorIO' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const Emitter = require( 'AXON/Emitter' );
  const inherit = require( 'PHET_CORE/inherit' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Property = require( 'AXON/Property' );
  const PropertyIO = require( 'AXON/PropertyIO' );
  const Voltmeter = require( 'CAPACITOR_LAB_BASICS/common/model/meter/Voltmeter' );

  // constants
  // reference coordinate frame size for world nodes
  const CANVAS_RENDERING_SIZE = new Dimension2( 1024, 618 );

  /**
   * @constructor
   *
   * @param {Property.<boolean>} switchUsedProperty - whether switch has been changed by user. Affects both screens.
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Tandem} tandem
   */
  function CLBModel( switchUsedProperty, modelViewTransform, tandem ) {

    // @public {Property.<boolean>}
    this.switchUsedProperty = switchUsedProperty;

    // @public {CLBModelViewTransform3D} (read-only)
    this.modelViewTransform = modelViewTransform;

    // @public {Property.<boolean>}
    this.plateChargesVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'plateChargesVisibleProperty' )
    } );

    // @public {Property.<boolean>}
    this.electricFieldVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'electricFieldVisibleProperty' )
    } );

    // @public {Property.<boolean>}
    this.capacitanceMeterVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'capacitanceMeterVisibleProperty' )
    } );

    // @public {Property.<boolean>}
    this.topPlateChargeMeterVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'topPlateChargeMeterVisibleProperty' )
    } );

    // @public {Property.<boolean>}
    this.storedEnergyMeterVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'storedEnergyMeterVisibleProperty' )
    } );

    // @public {Property.<boolean>}
    this.barGraphsVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'barGraphsVisibleProperty' )
    } );

    // @public {Property.<boolean>}
    this.voltmeterVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'voltmeterVisibleProperty' )
    } );

    // @public {Property.<boolean>}
    this.currentVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'currentVisibleProperty' )
    } );

    // @public {Property.<boolean>}
    this.currentOrientationProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'currentOrientationProperty' )
    } );

    // @public {Property.<Color>}
    this.arrowColorProperty = new Property( new Color( 83, 200, 236 ), {
      tandem: tandem.createTandem( 'arrowColorProperty' ),
      phetioType: PropertyIO( ColorIO )
    } );

    // @public {Property.<boolean>}
    this.timerVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'timerVisibleProperty' )
    } );

    // @public {Property.<boolean>} Whether the sim is paused
    this.isPlayingProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'isPlayingProperty' )
    } );

    // @public {Property.<boolean>}
    this.secondsProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'secondsProperty' )
    } );

    // Create timer to be turned into icon
    this.isRunningProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isRunningProperty' )
    } );

    // @public {Property.<boolean>}
    this.isSlowMotionProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isSlowMotionProperty' )
    } );

    // @public {Emitter}
    this.stepEmitter = new Emitter( { parameters: [ { valueType: 'number' } ] } );

    // @private {Bounds2}
    this.worldBounds = CANVAS_RENDERING_SIZE.toBounds();

    // @public {Voltmeter}
    this.voltmeter = new Voltmeter( this.circuit, this.worldBounds, modelViewTransform, this.voltmeterVisibleProperty, tandem.createTandem( 'voltmeter' ) );

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

      const maxArea = CLBConstants.PLATE_WIDTH_RANGE.max * CLBConstants.PLATE_WIDTH_RANGE.max;
      const maxVoltage = CLBConstants.BATTERY_VOLTAGE_RANGE.max;

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
     * @returns {number} E-field in V/m
     */
    getMaxEffectiveEField: function() {

      const maxArea = CLBConstants.PLATE_WIDTH_RANGE.max * CLBConstants.PLATE_WIDTH_RANGE.max;
      const minArea = CLBConstants.PLATE_WIDTH_RANGE.min * CLBConstants.PLATE_WIDTH_RANGE.min;

      return maxArea / minArea * CLBConstants.BATTERY_VOLTAGE_RANGE.max / CLBConstants.PLATE_SEPARATION_RANGE.min;
    },

    /**
     * Step function for the CLBModel.
     * @public
     *
     * @param {number} dt
     * @param {boolean} isManual
     */
    step: function( dt, isManual ) {
      if ( this.isPlayingProperty.value || isManual ) {

        // If a manual step is called the dt should be the same a normal dt value.
        const adjustedDt = isManual ? dt : dt * ( this.isSlowMotionProperty.value ? 0.125 : 1 );
        this.circuit.step( adjustedDt );
        this.stepEmitter.emit( adjustedDt );
        if ( this.isRunningProperty.value ) {
          this.secondsProperty.set( this.secondsProperty.value + adjustedDt );
        }
      }
    },

    /**
     * Manually steps forward in time.
     * @public
     */
    manualStep: function() {
      this.step( 0.2, true );
    },

    // @public
    reset: function() {
      this.plateChargesVisibleProperty.reset();
      this.electricFieldVisibleProperty.reset();
      this.capacitanceMeterVisibleProperty.reset();
      this.barGraphsVisibleProperty.reset();
      this.voltmeterVisibleProperty.reset();
      this.currentVisibleProperty.reset();
      this.currentOrientationProperty.reset();
      this.switchUsedProperty.reset();
      this.isPlayingProperty.reset();
      this.isSlowMotionProperty.reset();
      this.timerVisibleProperty.reset();
      this.secondsProperty.reset();
      this.isRunningProperty.reset();
    }
  } );
} );
