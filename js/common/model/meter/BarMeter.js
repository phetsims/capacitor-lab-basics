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
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );

  // phet-io modules
  var TNumber = require( 'ifphetio!PHET_IO/types/TNumber' );

  /**
   * Constructor for a BarMeter.
   *
   * @param {AbstractCircuit} circuit
   * @param {Property.<boolean>} visibleProperty - model property that determines if the entire meter is visible.
   * @param {Function} valueFunction
   * @param {Tandem} tandem
   * @constructor
   */
  function BarMeter( circuit, visibleProperty, valueFunction, tandem ) {

    // @public
    PropertySet.call( this, {
      value: valueFunction( circuit )
    }, tandem ? {
      tandemSet: {
        value: tandem.createTandem( 'valueProperty' )
      },
      typeSet: {
        value: TNumber( 'unitless' ) // Should be overridden by descendants
      }
    } : {} );
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
  } );
} );

