// Copyright 2016, University of Colorado Boulder

/**
 * Base class for all bar meter model elements.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 * @author Andrew Adare
 */
define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * Constructor for a BarMeter.
   *
   * @param {ParallelCircuit} circuit
   * @param {Property.<boolean>} visibleProperty - model property that determines if the entire meter is visible.
   * @param {DerivedProperty.<number>} valueProperty - property containing model quantity to display
   * @param {Tandem} tandem
   * @constructor
   */
  function BarMeter( circuit, visibleProperty, valueProperty, tandem ) {

    // @public
    this.valueProperty = valueProperty;

    // @public
    this.visibleProperty = visibleProperty;
  }

  capacitorLabBasics.register( 'BarMeter', BarMeter );

  return inherit( Object, BarMeter, {

    /**
     * Reset the BarMeter
     * @public
     */
    reset: function() {
      this.visibleProperty.reset();
    }

  } );
} );
