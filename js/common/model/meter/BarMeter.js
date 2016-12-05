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
   * @param {ParallelCircuit} circuit
   * @param {Property.<boolean>} visibleProperty - model property that determines if the entire meter is visible.
   * @param {Function} valueFunction
   * @param {Tandem} tandem
   * @constructor
   */
  function BarMeter( circuit, visibleProperty, valueFunction, tandem ) {

    //REVIEW: Use NumberProperty
    var meterValue = valueFunction( circuit );
    assert && assert( !_.isNaN( meterValue ), 'meterValue is ' + meterValue );

    this.valueProperty = new Property( meterValue, {
      tandem: tandem.createTandem( 'valueProperty' ),
      phetioValueType: TNumber()
    } );

    // @public
    this.visibleProperty = visibleProperty;
    var self = this;

    this.circuit = circuit; // @private
    this.valueFunction = valueFunction; // @private

    //REVIEW: Disposal not implemented.
    //REVIEW: ParallelCircuit does not declare circuit.capacitor. What subtype dependencies does this actually have?
    //        Update documentation to note the dependency.
    // TODO implement disposal
    Property.multilink( [
      circuit.capacitor.plateSizeProperty,
      circuit.capacitor.plateSeparationProperty,
      circuit.capacitor.platesVoltageProperty
    ], function() {
      self.updateValue();
    } );
  }

  capacitorLabBasics.register( 'BarMeter', BarMeter );

  return inherit( Object, BarMeter, {
    //REVIEW: doc
    updateValue: function() {
      this.valueProperty.set( this.valueFunction( this.circuit ) );
    },

    //REVIEW: doc
    reset: function() {
      this.visibleProperty.reset();
    }

  } );
} );
