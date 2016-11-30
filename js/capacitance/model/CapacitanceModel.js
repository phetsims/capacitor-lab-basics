// Copyright 2015, University of Colorado Boulder

/**
 * Capacitance model for Capacitor Lab: Basics.  This model has a battery connected in parallel to a capacitor, and
 * allows the user to modify capacitor plate geometry to illustrate relationships with capacitance.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var CircuitConfig = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitConfig' );
  var CapacitanceCircuit = require( 'CAPACITOR_LAB_BASICS/capacitance/model/CapacitanceCircuit' );
  var BarMeter = require( 'CAPACITOR_LAB_BASICS/common/model/meter/BarMeter' );
  var Voltmeter = require( 'CAPACITOR_LAB_BASICS/common/model/meter/Voltmeter' );
  var CLBModel = require( 'CAPACITOR_LAB_BASICS/common/model/CLBModel' );
  var DielectricMaterial = require( 'CAPACITOR_LAB_BASICS/common/model/DielectricMaterial' );
  var CircuitConnectionEnum = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitConnectionEnum' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  /**
   * Constructor for the CapacitanceModel.
   * @param {Property.<boolean>} switchUsedProperty - whether switch has been changed by user. Affects both screens.
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Tandem} tandem
   */
  function CapacitanceModel( switchUsedProperty, modelViewTransform, tandem ) {

    CLBModel.call( this, tandem );

    this.switchUsedProperty = switchUsedProperty; // @public
    this.modelViewTransform = modelViewTransform; // @public (read-only)

    //REVIEW: CLBModel (supertype) does this, why is this also done here?
    this.tandem = tandem; // @private

    // Configuration info for the circuit.
    // Default number of capacitors is 1, default number of lightbulbs is 0.
    //REVIEW: Not just the default, but always what it has?
    var circuitConfig = new CircuitConfig( {
      circuitConnections: [ CircuitConnectionEnum.BATTERY_CONNECTED, CircuitConnectionEnum.OPEN_CIRCUIT ]
    } );

    //REVIEW: Only used dielectric material is air, so this ability should be removed, see https://github.com/phetsims/capacitor-lab-basics/issues/117
    this.dielectricMaterial = DielectricMaterial.AIR; // @public (read-only)

    this.circuit = new CapacitanceCircuit( circuitConfig, tandem.createTandem( 'circuit' ) ); // @public
    this.worldBounds = CLBConstants.CANVAS_RENDERING_SIZE.toBounds(); // @private

    // Allow null instead of tandem if this component is part of a temporary circuit used for calculations
    var circuit = this.circuit;
    this.capacitanceMeter = new BarMeter( this.circuit, this.capacitanceMeterVisibleProperty,
      function() {
        return circuit.getTotalCapacitance();
      },
      tandem.createTandem( 'capacitanceMeter' ) );

    // @public
    this.voltmeter = new Voltmeter( this.circuit, this.worldBounds, modelViewTransform, tandem.createTandem( 'voltmeter' ) );

    this.circuit.maxPlateCharge = this.getMaxPlateCharge();
    this.circuit.maxEffectiveEField = this.getMaxEffectiveEField();
  }

  capacitorLabBasics.register( 'CapacitanceModel', CapacitanceModel );

  return inherit( CLBModel, CapacitanceModel, {

    /**
     * Reset function for this model.
     */
    reset: function() {
      CLBModel.prototype.reset.call( this );
      this.capacitanceMeter.reset();
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
     *
     * REVIEW: function not used, remove it (dead code)
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
        plateWidth: CLBConstants.PLATE_WIDTH_RANGE.min,
        plateSeparation: CLBConstants.PLATE_SEPARATION_RANGE.min,
        //REVIEW: Wire thickness never varies from CLBConstants.WIRE_THICKNESS. Don't need to pass this around
        wireThickness: CLBConstants.WIRE_THICKNESS,
        //REVIEW: Only used dielectric material is air, so this ability should be removed, see https://github.com/phetsims/capacitor-lab-basics/issues/117
        dielectricMaterial: DielectricMaterial.createCustomDielectricMaterial( CLBConstants.DIELECTRIC_CONSTANT_RANGE.min ),
        dielectricOffset: CLBConstants.DIELECTRIC_OFFSET_RANGE.min
      } );

      // This circuit is constructed as part of an implementation and should not be instrumented.
      // A null value could be passed in here, but then all children would need null checks.
      // Instead, pass in a disabled tandem instance. All children will inherit the `enabled` value
      // unless specifically overridden.
      //REVIEW: Why are we creating a tandem (and then not disposing) for this temporary object, in a function getMaxEffectiveEField?
      //REVIEW: Does phet-io behave badly with duplicated tandems?
      //REVIEW: If this is needed, please document the reason tandem is provided.
      var circuit = new CapacitanceCircuit( circuitConfig,
        this.tandem.createTandem( 'tempLightBulbCircuit', { enabled: false } ) );

      // disconnect the battery and set the max plate charge
      circuit.circuitConnectionProperty.set( CircuitConnectionEnum.OPEN_CIRCUIT );
      circuit.setDisconnectedPlateCharge( this.getMaxPlateCharge() );

      return circuit.capacitor.getEffectiveEField();
    }

  } );
} );
