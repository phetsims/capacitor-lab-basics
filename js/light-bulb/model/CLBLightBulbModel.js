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
  var CLBQueryParameters = require( 'CAPACITOR_LAB_BASICS/common/CLBQueryParameters' );
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
  //REVIEW: LIGHT_BULB_X_SPACING is always 0.023, consider factoring out into a common location and not passing around
  var LIGHT_BULB_X_SPACING = 0.023; // meters
  var CAPACITOR_Y_SPACING = 0.0010; // meters
  var PLATE_WIDTH = CLBConstants.PLATE_WIDTH_RANGE.defaultValue;
  var PLATE_SEPARATION = CLBConstants.PLATE_SEPARATION_RANGE.defaultValue;
  //REVIEW: Wire thickness never varies from CLBConstants.WIRE_THICKNESS. Don't need to pass this around
  var WIRE_THICKNESS = CLBConstants.WIRE_THICKNESS;
  //REVIEW: What visual difference does sharing wire-extent with the other screen make? The values are very similar
  var WIRE_EXTENT = 0.017; // how far the wire extends above or below the capacitor (meters)

  /**
   * @param {Property.<boolean>} switchUsedProperty - whether switch has been changed by user. Affects both screens.
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Tandem} tandem
   * @constructor
   */
  function CLBLightBulbModel( switchUsedProperty, modelViewTransform, tandem ) {

    CLBModel.call( this, tandem );

    //REVIEW: CLBModel (supertype) does this, why is this also done here?
    this.tandem = tandem; // @private

    //REVIEW: All screens use this property, so we shouldn't define it here (do that in CLBModel)
    this.switchUsedProperty = switchUsedProperty; // @public

    //REVIEW: All screens use this property, so we shouldn't define it here (do that in CLBModel)
    this.modelViewTransform = modelViewTransform; // @private

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
      batteryLocation: BATTERY_LOCATION,
      //REVIEW: LIGHT_BULB_X_SPACING is always 0.023, consider factoring out into a common location and not passing around
      lightBulbXSpacing: LIGHT_BULB_X_SPACING,
      capacitorXSpacing: CAPACITOR_X_SPACING,
      capacitorYSpacing: CAPACITOR_Y_SPACING,
      plateWidth: PLATE_WIDTH,
      plateSeparation: PLATE_SEPARATION,
      wireExtent: WIRE_EXTENT,
      //REVIEW: Wire thickness never varies from CLBConstants.WIRE_THICKNESS. Don't need to pass this around
      wireThickness: WIRE_THICKNESS,
      //REVIEW: number of capacitors is always 1, presumably factor this out so that circuits just have one.
      numberOfCapacitors: 1,
      numberOfLightBulbs: 1
    } );

    //REVIEW: Only used dielectric material is air, so this ability should be removed, see https://github.com/phetsims/capacitor-lab-basics/issues/117
    this.dielectricMaterial = DielectricMaterial.AIR; // @public (read-only)

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
     * REVIEW: visibility doc
     */
    reset: function() {
      CLBModel.prototype.reset.call( this );
      this.capacitanceMeter.reset();
      this.plateChargeMeter.reset();
      this.storedEnergyMeter.reset();
      this.voltmeter.reset();
      this.circuit.reset();

      //REVIEW: This is a global property that affects both screens. Presumably it shouldn't be reset by one screen?
      this.switchUsedProperty.reset();
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
     * Gets the maximum excess charge for the dielectric area (Q_excess_dielectric).
     * REVIEW: visibility doc
     *
     * REVIEW: function not used, remove it (dead code)
     *
     * REVIEW: returns?
     */
    getMaxExcessDielectricPlateCharge: function() {
      return this.getCapacitorWithMaxCharge().getExcessDielectricPlateCharge();
    },

    /**
     * Gets the maximum effective E-field between the plates (E_effective).
     * The maximum occurs when the battery is disconnected, the Plate Charge control is set to its maximum,
     * the plate area is set to its minimum, and the dielectric constant is min, and the dielectric is fully inserted.
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
        //REVIEW: Wire thickness never varies from CLBConstants.WIRE_THICKNESS. Don't need to pass this around
        wireThickness: CLBConstants.WIRE_THICKNESS,
        wireExtent: WIRE_EXTENT,
        //REVIEW: Only used dielectric material is air, so this ability should be removed, see https://github.com/phetsims/capacitor-lab-basics/issues/117
        dielectricMaterial: DielectricMaterial.createCustomDielectricMaterial( CLBConstants.DIELECTRIC_CONSTANT_RANGE.min ),
        dielectricOffset: CLBConstants.DIELECTRIC_OFFSET_RANGE.min,
        //REVIEW: number of capacitors is always 1, presumably factor this out so that circuits just have one.
        numberOfCapacitors: 1,
        numberOfLightBulbs: 1
      } );

      // This circuit is constructed as part of an implementation and should not be instrumented.
      // A null value could be passed in here, but then all children would need null checks.
      // Instead, pass in a disabled tandem instance. All children will inherit the `enabled` value
      // unless specifically overridden.
      // var circuit = new LightBulbCircuit( circuitConfig, null );
      //REVIEW: Why are we creating a tandem (and then not disposing) for this temporary object, in a function getMaxEffectiveEField?
      //REVIEW: Does phet-io behave badly with duplicated tandems?
      //REVIEW: If this is needed, please document the reason tandem is provided.
      var circuit = new LightBulbCircuit( circuitConfig,
        this.tandem.createTandem( 'tempLightBulbCircuit', {
          enabled: false
        } ) );

      // disconnect the battery and set the max plate charge
      circuit.circuitConnectionProperty.set( CircuitConnectionEnum.OPEN_CIRCUIT );
      circuit.setDisconnectedPlateCharge( this.getMaxPlateCharge() );

      return circuit.capacitor.getEffectiveEField();
    }

  } );
} );
