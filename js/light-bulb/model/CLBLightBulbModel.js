// Copyright 2015-2017, University of Colorado Boulder

/**
 * The main model for the "Light Bulb" screen of Capacitor Lab: Basics.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg
 * @author Andrew Adare
 */

define( function( require ) {
  'use strict';

  // modules
  var BarMeter = require( 'CAPACITOR_LAB_BASICS/common/model/meter/BarMeter' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CircuitConfig = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitConfig' );
  var CircuitState = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitState' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var CLBModel = require( 'CAPACITOR_LAB_BASICS/common/model/CLBModel' );
  var CLBQueryParameters = require( 'CAPACITOR_LAB_BASICS/common/CLBQueryParameters' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LightBulbCircuit = require( 'CAPACITOR_LAB_BASICS/light-bulb/model/LightBulbCircuit' );

  // constants
  var CAPACITOR_X_SPACING = 0.0180; // meters
  var CAPACITOR_Y_SPACING = 0.0010; // meters
  var PLATE_WIDTH = CLBConstants.PLATE_WIDTH_RANGE.defaultValue;
  var PLATE_SEPARATION = CLBConstants.PLATE_SEPARATION_RANGE.defaultValue;

  /**
   * @param {Property.<boolean>} switchUsedProperty - whether switch has been changed by user. Affects both screens.
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Tandem} tandem
   * @constructor
   */
  function CLBLightBulbModel( switchUsedProperty, modelViewTransform, tandem ) {

    // A requested PhET-iO customization is to simplify the switch into a
    // single-pole double-throw switch for the light-bulb circuit instead of
    // the default three-position version (phet-io/569).
    // Enable with the switch=twoState query parameter.
    //REVIEW simplify to ( CLBQueryParameters.switch === 'twoState' )
    var useTwoStateSwitch = CLBQueryParameters.switch === 'twoState' ? true : false;

    var twoState = [
      CircuitState.BATTERY_CONNECTED,
      CircuitState.LIGHT_BULB_CONNECTED
    ];
    var threeState = [
      CircuitState.BATTERY_CONNECTED,
      CircuitState.OPEN_CIRCUIT,
      CircuitState.LIGHT_BULB_CONNECTED
    ];

    // configuration info for the circuit
    var circuitConfig = CircuitConfig.create( {
      circuitConnections: useTwoStateSwitch ? twoState : threeState,
      modelViewTransform: modelViewTransform,
      capacitorXSpacing: CAPACITOR_X_SPACING,
      capacitorYSpacing: CAPACITOR_Y_SPACING,
      plateWidth: PLATE_WIDTH,
      plateSeparation: PLATE_SEPARATION
    } );

    this.circuit = new LightBulbCircuit( circuitConfig, tandem.createTandem( 'circuit' ) ); // @public

    CLBModel.call( this, switchUsedProperty, modelViewTransform, tandem );

    this.plateChargeMeterVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'plateChargeMeterVisibleProperty' )
    } );

    this.storedEnergyMeterVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'storedEnergyMeterVisibleProperty' )
    } );

    var circuit = this.circuit;

    // @public
    this.capacitanceMeter = new BarMeter( this.circuit, this.capacitanceMeterVisibleProperty,
      circuit.capacitor.capacitanceProperty,
      tandem.createTandem( 'capacitanceMeter' ) );

    // @public
    this.plateChargeMeter = new BarMeter( this.circuit, this.plateChargeMeterVisibleProperty,
      circuit.capacitor.plateChargeProperty,
      tandem.createTandem( 'plateChargeMeter' ) );

    // @public
    this.storedEnergyMeter = new BarMeter( this.circuit, this.storedEnergyMeterVisibleProperty,
      circuit.capacitor.storedEnergyProperty,
      tandem.createTandem( 'storedEnergyMeter' ) );
  }

  capacitorLabBasics.register( 'CLBLightBulbModel', CLBLightBulbModel );

  return inherit( CLBModel, CLBLightBulbModel, {

    /**
     * Reset function for this model.
     * @public
     * @override
     */
    reset: function() {
      CLBModel.prototype.reset.call( this );
      this.plateChargesVisibleProperty.reset();
      this.plateChargeMeterVisibleProperty.reset();
      this.storedEnergyMeterVisibleProperty.reset();
      this.capacitanceMeter.reset();
      this.plateChargeMeter.reset();
      this.storedEnergyMeter.reset();
      this.voltmeter.reset();
      this.circuit.reset();
    }

  } );
} );
