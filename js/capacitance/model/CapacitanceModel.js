// Copyright 2015, University of Colorado Boulder

/**
 * The "Intro" model for Capacitor Lab: Basics.  The intro model has a battery connected in parallel to a capacitor, and
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
   *
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Tandem} tandem
   */
  function CapacitanceModel( modelViewTransform, tandem ) {

    CLBModel.call( this, tandem );

    this.modelViewTransform = modelViewTransform; // @ public (read-only)

    // configuration info for the circuit
    var circuitConfig = new CircuitConfig( {
      circuitConnections: [ CircuitConnectionEnum.BATTERY_CONNECTED, CircuitConnectionEnum.OPEN_CIRCUIT ]
    } );

    this.dielectricMaterial = DielectricMaterial.Air(); // @public (read-only)

    this.circuit = new CapacitanceCircuit( circuitConfig, tandem ); // @public
    this.worldBounds = CLBConstants.CANVAS_RENDERING_SIZE.toBounds(); // @private

    this.capacitanceMeter = BarMeter.CapacitanceMeter( this.circuit, this.capacitanceMeterVisibleProperty );

    // @public
    this.voltmeter = new Voltmeter( this.circuit, this.worldBounds, modelViewTransform, {} );

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
        wireThickness: CLBConstants.WIRE_THICKNESS,
        dielectricMaterial: DielectricMaterial.CustomDielectricMaterial( CLBConstants.DIELECTRIC_CONSTANT_RANGE.min ),
        dielectricOffset: CLBConstants.DIELECTRIC_OFFSET_RANGE.min
      } );

      // Don't want to pass in tandem here. This is a temporary circuit used to calculate the return value.
      var circuit = new CapacitanceCircuit( circuitConfig, null );

      // disconnect the battery and set the max plate charge
      circuit.circuitConnection = CircuitConnectionEnum.OPEN_CIRCUIT;
      circuit.setDisconnectedPlateCharge( this.getMaxPlateCharge() );

      return circuit.capacitor.getEffectiveEField();
    }

  } );
} );

