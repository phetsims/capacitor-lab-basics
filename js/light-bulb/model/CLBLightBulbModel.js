// Copyright 2015-2019, University of Colorado Boulder

/**
 * The main model for the "Light Bulb" screen of Capacitor Lab: Basics.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BarMeter = require( 'CAPACITOR_LAB_BASICS/common/model/meter/BarMeter' );
  const CapacitorConstants = require( 'SCENERY_PHET/capacitor/CapacitorConstants' );
  const capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  const CircuitConfig = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitConfig' );
  const CircuitState = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitState' );
  const CLBModel = require( 'CAPACITOR_LAB_BASICS/common/model/CLBModel' );
  const CLBQueryParameters = require( 'CAPACITOR_LAB_BASICS/common/CLBQueryParameters' );
  const inherit = require( 'PHET_CORE/inherit' );
  const LightBulbCircuit = require( 'CAPACITOR_LAB_BASICS/light-bulb/model/LightBulbCircuit' );

  // constants
  const CAPACITOR_X_SPACING = 0.0180; // meters
  const CAPACITOR_Y_SPACING = 0.0010; // meters
  const PLATE_WIDTH = CapacitorConstants.PLATE_WIDTH_RANGE.defaultValue;
  const PLATE_SEPARATION = CapacitorConstants.PLATE_SEPARATION_RANGE.defaultValue;

  /**
   * @constructor
   *
   * @param {Property.<boolean>} switchUsedProperty - whether switch has been changed by user. Affects both screens.
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Tandem} tandem
   */
  function CLBLightBulbModel( switchUsedProperty, modelViewTransform, tandem ) {

    // A requested PhET-iO customization is to simplify the switch into a
    // single-pole double-throw switch for the light-bulb circuit instead of
    // the default three-position version (phet-io/569).
    // Enable with the switch=twoState query parameter.
    const useTwoStateSwitch = CLBQueryParameters.switch === 'twoState';

    const twoState = [
      CircuitState.BATTERY_CONNECTED,
      CircuitState.LIGHT_BULB_CONNECTED
    ];
    const threeState = [
      CircuitState.BATTERY_CONNECTED,
      CircuitState.OPEN_CIRCUIT,
      CircuitState.LIGHT_BULB_CONNECTED
    ];

    // configuration info for the circuit
    const circuitConfig = CircuitConfig.create( {
      circuitConnections: useTwoStateSwitch ? twoState : threeState,
      modelViewTransform: modelViewTransform,
      capacitorXSpacing: CAPACITOR_X_SPACING,
      capacitorYSpacing: CAPACITOR_Y_SPACING,
      plateWidth: PLATE_WIDTH,
      plateSeparation: PLATE_SEPARATION
    } );

    // @public {LightBulbCircuit}
    this.circuit = new LightBulbCircuit( circuitConfig, tandem.createTandem( 'circuit' ) ); // @public

    CLBModel.call( this, switchUsedProperty, modelViewTransform, tandem );

    // @public {BarMeter}
    this.capacitanceMeter = new BarMeter( this.capacitanceMeterVisibleProperty, this.circuit.capacitor.capacitanceProperty );

    // @public {BarMeter}
    this.plateChargeMeter = new BarMeter( this.topPlateChargeMeterVisibleProperty, this.circuit.capacitor.plateChargeProperty );

    // @public {BarMeter}
    this.storedEnergyMeter = new BarMeter( this.storedEnergyMeterVisibleProperty, this.circuit.capacitor.storedEnergyProperty );
  }

  capacitorLabBasics.register( 'CLBLightBulbModel', CLBLightBulbModel );

  return inherit( CLBModel, CLBLightBulbModel, {
    /**
     * Reset function for this model.
     * @public
     * @override
     */
    reset: function() {
      this.plateChargesVisibleProperty.reset();
      this.topPlateChargeMeterVisibleProperty.reset();
      this.storedEnergyMeterVisibleProperty.reset();
      this.capacitanceMeter.reset();
      this.plateChargeMeter.reset();
      this.storedEnergyMeter.reset();
      this.voltmeter.reset();
      this.circuit.reset();
      CLBModel.prototype.reset.call( this );
    },
    step: function( dt, isManual ) {
      CLBModel.prototype.step.call( this, dt, isManual );
      this.circuit.updateCurrentAmplitude( dt );
    },
    manualStep: function() {
      CLBModel.prototype.step.call( this, 0.2, true );
    }
  } );
} );
