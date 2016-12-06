// Copyright 2016, University of Colorado Boulder

/**
 * The main model for the "Light Bulb" screen of Capacitor Lab: Basics.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
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
  var CircuitConnectionEnum = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitConnectionEnum' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var CLBModel = require( 'CAPACITOR_LAB_BASICS/common/model/CLBModel' );
  var CLBQueryParameters = require( 'CAPACITOR_LAB_BASICS/common/CLBQueryParameters' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LightBulbCircuit = require( 'CAPACITOR_LAB_BASICS/light-bulb/model/LightBulbCircuit' );
  var Voltmeter = require( 'CAPACITOR_LAB_BASICS/common/model/meter/Voltmeter' );

  // phet-io modules
  var TBoolean = require( 'ifphetio!PHET_IO/types/TBoolean' );

  // constants
  var CAPACITOR_X_SPACING = 0.0180; // meters
  var CAPACITOR_Y_SPACING = 0.0010; // meters
  var PLATE_WIDTH = CLBConstants.PLATE_WIDTH_RANGE.defaultValue;
  var PLATE_SEPARATION = CLBConstants.PLATE_SEPARATION_RANGE.defaultValue;
  //REVIEW: What visual difference does sharing wire-extent with the other screen make? The values are very similar
  var WIRE_EXTENT = 0.017; // how far the wire extends above or below the capacitor (meters)

  /**
   * @param {Property.<boolean>} switchUsedProperty - whether switch has been changed by user. Affects both screens.
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Tandem} tandem
   * @constructor
   */
  function CLBLightBulbModel( switchUsedProperty, modelViewTransform, tandem ) {

    CLBModel.call( this, switchUsedProperty, modelViewTransform, tandem );

    this.plateChargeMeterVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'plateChargeMeterVisibleProperty' ),
      phetioValueType: TBoolean
    } );

    this.storedEnergyMeterVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'storedEnergyMeterVisibleProperty' ),
      phetioValueType: TBoolean
    } );

    // A requested PhET-iO customization is to simplify the switch into a
    // single-pole double-throw switch for the light-bulb circuit instead of
    // the default three-position version (phet-io/569).
    // Enable with the switch=twoState query parameter.
    var useTwoStateSwitch = CLBQueryParameters.switch === 'twoState' ? true : false;

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
      capacitorXSpacing: CAPACITOR_X_SPACING,
      capacitorYSpacing: CAPACITOR_Y_SPACING,
      plateWidth: PLATE_WIDTH,
      plateSeparation: PLATE_SEPARATION,
      wireExtent: WIRE_EXTENT
    } );

    this.circuit = new LightBulbCircuit( circuitConfig, tandem.createTandem( 'circuit' ) ); // @public

    //REVIEW: This is the same for both models, pull it down into CLBModel?
    this.worldBounds = CLBConstants.CANVAS_RENDERING_SIZE.toBounds(); // private

    var circuit = this.circuit;

    // @public
    this.capacitanceMeter = new BarMeter( this.circuit, this.capacitanceMeterVisibleProperty,
      //REVIEW: circuit.getTotalCapacitance.bind( circuit )?
      //REVIEW: Does a property make sense here, since presumably we want to listen to it?
      function() {
        return circuit.getTotalCapacitance();
      },
      tandem.createTandem( 'capacitanceMeter' ) );
    this.plateChargeMeter = new BarMeter( this.circuit, this.plateChargeMeterVisibleProperty,
      //REVIEW: circuit.getTotalCharge.bind( circuit )?
      //REVIEW: Does a property make sense here, since presumably we want to listen to it?
      function() {
        return circuit.getTotalCharge();
      },
      tandem.createTandem( 'plateChargeMeter' ) );
    this.storedEnergyMeter = new BarMeter( this.circuit, this.storedEnergyMeterVisibleProperty,
      //REVIEW: circuit.getStoredEnergy.bind( circuit )?
      //REVIEW: Does a property make sense here, since presumably we want to listen to it?
      function() {
        return circuit.getStoredEnergy();
      },
      tandem.createTandem( 'storedEnergyMeter' ) );

    //REVIEW: visibility doc
    //REVIEW: This is the same code as used by CapacitanceModel. Since it is used in both screens, it should presumably be on the supertype?
    this.voltmeter = new Voltmeter( this.circuit, this.worldBounds, modelViewTransform, tandem.createTandem( 'voltmeter' ) );

    //REVIEW: This is done in all other concrete models (CapacitanceModel), and should be factored out to the supertype
    this.circuit.maxPlateCharge = this.getMaxPlateCharge();
    this.circuit.maxEffectiveEField = this.getMaxEffectiveEField();
  }

  capacitorLabBasics.register( 'CLBLightBulbModel', CLBLightBulbModel );

  return inherit( CLBModel, CLBLightBulbModel, {

    /**
     * Reset function for this model.
     * @public
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
    },

    /**
     * Step function for the CLBModel.
     * REVIEW: visibility doc
     *
     * REVIEW: This is the same as in CapacitanceModel, and should be shared in the supertype.
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
     * REVIEW: visibility doc
     *
     * REVIEW: This is the same as in CapacitanceModel, and should be shared in the supertype.
     *
     * REVIEW: returns?
     */
    getMaxPlateCharge: function() {
      return this.getCapacitorWithMaxCharge().getPlateCharge();
    },

    /**
     * Gets the maximum effective E-field between the plates (E_effective).
     * The maximum occurs when the battery is disconnected, the Plate Charge
     * control is set to its maximum, and the plate area is set to its minimum.
     * And in this situation, plate separation is irrelevant.
     * REVIEW: visibility doc
     *
     * return {number}
     */
    getMaxEffectiveEField: function() {
      //REVIEW: a good amount of shared logic with CapacitanceModel's version of this. Can common logic be factored out?
      var circuitConfig = new CircuitConfig( {
        capacitorXSpacing: CAPACITOR_X_SPACING,
        capacitorYSpacing: CAPACITOR_Y_SPACING,
        plateWidth: CLBConstants.PLATE_WIDTH_RANGE.min,
        plateSeparation: CLBConstants.PLATE_SEPARATION_RANGE.min,
        wireExtent: WIRE_EXTENT
      } );

      // This circuit is constructed as part of an implementation and should not be instrumented.
      // A null value could be passed in here, but then all children would need null checks.
      // Instead, pass in a disabled tandem instance. All children will inherit the `enabled` value
      // unless specifically overridden.
      //REVIEW: Why are we creating a tandem (and then not disposing) for this temporary object, in a function getMaxEffectiveEField?
      //REVIEW: Does phet-io behave badly with duplicated tandems?
      //REVIEW: If this is needed, please document the reason tandem is provided.
      var circuit = new LightBulbCircuit( circuitConfig,
        this.tandem.createTandem( 'tempLightBulbCircuit', {
          enabled: false
        } ) );

      // disconnect the battery and set the max plate charge
      circuit.circuitConnectionProperty.set( CircuitConnectionEnum.OPEN_CIRCUIT );
      circuit.disconnectedPlateChargeProperty.set( this.getMaxPlateCharge() );

      return circuit.capacitor.getEffectiveEField();
    }

  } );
} );
