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
     * @public
     */
    reset: function() {
      CLBModel.prototype.reset.call( this );
      this.capacitanceMeter.reset();
      this.voltmeter.reset();
      this.circuit.reset();
    }

  } );
} );
