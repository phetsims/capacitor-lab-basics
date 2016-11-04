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
  var Property = require( 'AXON/Property' );

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

    this.valueProperty = new Property( valueFunction( circuit ), {
      tandem: tandem.createTandem( 'valueProperty' ),
      phetioValueType: TNumber()
    } );

    // @public
    this.visibleProperty = visibleProperty;
    var self = this;

    this.circuit = circuit; // @private
    this.valueFunction = valueFunction; // @private

    // TODO implement disposal
    circuit.capacitor.multilink( [ 'plateSize', 'plateSeparation', 'platesVoltage' ], function() {
      self.updateValue();
    } );
  }

  capacitorLabBasics.register( 'BarMeter', BarMeter );
  return inherit( Object, BarMeter, {

    updateValue: function() {
      this.valueProperty.set( this.valueFunction( this.circuit ) );
    },

    reset: function() {
      this.visibleProperty.reset();
    }

  } );
} );

