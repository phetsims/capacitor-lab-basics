// Copyright 2016, University of Colorado Boulder

/**
 * Capacitance model for Capacitor Lab: Basics.  This model has a battery connected in parallel to a capacitor, and
 * allows the user to modify capacitor plate geometry to illustrate relationships with capacitance.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 * @author Andrew Adare
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var CircuitConfig = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitConfig' );
  var CapacitanceCircuit = require( 'CAPACITOR_LAB_BASICS/capacitance/model/CapacitanceCircuit' );
  var BarMeter = require( 'CAPACITOR_LAB_BASICS/common/model/meter/BarMeter' );
  var CLBModel = require( 'CAPACITOR_LAB_BASICS/common/model/CLBModel' );
  var CircuitConnectionEnum = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitConnectionEnum' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  /**
   * Constructor for the CapacitanceModel.
   * @param {Property.<boolean>} switchUsedProperty - whether switch has been changed by user. Affects both screens.
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Tandem} tandem
   */
  function CapacitanceModel( switchUsedProperty, modelViewTransform, tandem ) {

    var self = this;

    var circuitConfig = new CircuitConfig( {
      circuitConnections: [ CircuitConnectionEnum.BATTERY_CONNECTED, CircuitConnectionEnum.OPEN_CIRCUIT ]
    } );
    this.circuit = new CapacitanceCircuit( circuitConfig, tandem.createTandem( 'circuit' ) ); // @public

    CLBModel.call( this, switchUsedProperty, modelViewTransform, tandem );

    // @public
    this.capacitanceMeter = new BarMeter( this.circuit, this.capacitanceMeterVisibleProperty,
      function() {
        return self.circuit.getTotalCapacitance();
      },
      tandem.createTandem( 'capacitanceMeter' ) );
  }

  capacitorLabBasics.register( 'CapacitanceModel', CapacitanceModel );

  return inherit( CLBModel, CapacitanceModel, {

    /**
     * Reset function for this model.
     * REVIEW: visibility doc
     */
    reset: function() {
      CLBModel.prototype.reset.call( this );
      this.capacitanceMeter.reset();
      this.voltmeter.reset();
      this.circuit.reset();
    },

    /**
     * Step function for the CLBModel.
     * REVIEW: visibility doc
     *
     * REVIEW: This is the same as in CLBLightBulbModel, and should be shared in the supertype.
     *
     * @param {number} dt
     */
    step: function( dt ) {
      this.circuit.step( dt );
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
      //REVIEW: a good amount of shared logic with CLBLightBulbModel's version of this. Can common logic be factored out?
      var circuitConfig = new CircuitConfig( {
        plateWidth: CLBConstants.PLATE_WIDTH_RANGE.min,
        plateSeparation: CLBConstants.PLATE_SEPARATION_RANGE.min,
        //REVIEW: Wire thickness never varies from CLBConstants.WIRE_THICKNESS. Don't need to pass this around
        wireThickness: CLBConstants.WIRE_THICKNESS
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
      circuit.disconnectedPlateChargeProperty.set( this.getMaxPlateCharge() );

      return circuit.capacitor.getEffectiveEField();
    }

  } );
} );
