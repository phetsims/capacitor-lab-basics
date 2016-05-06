// Copyright 2015, University of Colorado Boulder

/**
 * Base class for all bar meter model elements.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  /**
   * Constructor for a BarMeter.
   *
   * @param {AbstractCircuit} circuit
   * @param {Property.<boolean>} visibleProperty - model property that determines if the entire meter is visible.
   * @param {Function} valueFunction
   * @constructor
   */
  function BarMeter( circuit, visibleProperty, valueFunction, tandem ) {

    // @public
    PropertySet.call( this, {
      value: valueFunction( circuit )
    }, {
      tandemSet: tandem ? {
        value: tandem.createTandem( 'valueProperty' )
      } : {}
    } );
    this.visibleProperty = visibleProperty;
    var thisMeter = this;

    this.circuit = circuit; // @private
    this.valueFunction = valueFunction; // @private

    circuit.capacitor.multilink( [ 'plateSize', 'plateSeparation', 'platesVoltage' ], function() {
      thisMeter.updateValue();
    } );
  }

  capacitorLabBasics.register( 'BarMeter', BarMeter );
  return inherit( PropertySet, BarMeter, {

    updateValue: function() {
      this.value = this.valueFunction( this.circuit );
    }

  }, {

    /**
     * Factory functions create specific meters.
     */
    CapacitanceMeter: function( circuit, visibleProperty, tandem ) {
      return new BarMeter( circuit, visibleProperty,
        function() {
          return circuit.getTotalCapacitance();
        },
        tandem ? tandem.createTandem( 'capacitanceMeter' ) : null );
    },

    PlateChargeMeter: function( circuit, visibleProperty, tandem ) {
      return new BarMeter( circuit, visibleProperty,
        function() {
          return circuit.getTotalCharge();
        },
        tandem ? tandem.createTandem( 'plateChargeMeter' ) : null );
    },

    StoredEnergyMeter: function( circuit, visibleProperty, tandem ) {
      return new BarMeter( circuit, visibleProperty,
        function() {
          return circuit.getStoredEnergy();
        },
        tandem ? tandem.createTandem( 'storedEnergyMeter' ) : null );
    }

  } );
} );

