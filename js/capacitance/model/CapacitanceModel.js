// Copyright 2015-2017, University of Colorado Boulder

/**
 * Capacitance model for Capacitor Lab: Basics.  This model has a battery connected in parallel to a capacitor, and
 * allows the user to modify capacitor plate geometry to illustrate relationships with capacitance.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var BarMeter = require( 'CAPACITOR_LAB_BASICS/common/model/meter/BarMeter' );
  var CapacitanceCircuit = require( 'CAPACITOR_LAB_BASICS/capacitance/model/CapacitanceCircuit' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CircuitConfig = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitConfig' );
  var CircuitState = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitState' );
  var CLBModel = require( 'CAPACITOR_LAB_BASICS/common/model/CLBModel' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @constructor
   *
   * @param {Property.<boolean>} switchUsedProperty - whether switch has been changed by user. Affects both screens.
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Tandem} tandem
   */
  function CapacitanceModel( switchUsedProperty, modelViewTransform, tandem ) {

    var circuitConfig = CircuitConfig.create( {
      circuitConnections: [ CircuitState.BATTERY_CONNECTED, CircuitState.OPEN_CIRCUIT ]
    } );

    // @public {CapacitanceCircuit}
    this.circuit = new CapacitanceCircuit( circuitConfig, tandem.createTandem( 'circuit' ) ); // @public

    CLBModel.call( this, switchUsedProperty, modelViewTransform, tandem );

    // @public {BarMeter}
    this.capacitanceMeter = new BarMeter(
      this.circuit,
      this.capacitanceMeterVisibleProperty,
      this.circuit.capacitor.capacitanceProperty,
      tandem.createTandem( 'capacitanceMeter' )
    );
  }

  capacitorLabBasics.register( 'CapacitanceModel', CapacitanceModel );

  return inherit( CLBModel, CapacitanceModel, {

    /**
     * Reset function for this model.
     * @public
     * @override
     */
    reset: function() {
      this.capacitanceMeter.reset();
      this.voltmeter.reset();
      this.circuit.reset();
      CLBModel.prototype.reset.call( this );
    }
  } );
} );
