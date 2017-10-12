// Copyright 2015-2016, University of Colorado Boulder

/**
 * Base class for all bar meter model elements.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg
 * @author Andrew Adare
 */
define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ParallelCircuit = require( 'CAPACITOR_LAB_BASICS/common/model/circuit/ParallelCircuit' );
  var Property = require( 'AXON/Property' );

  /**
   * @constructor
   *
   * @param {ParallelCircuit} circuit
   * @param {Property.<boolean>} visibleProperty - model property that determines if the entire meter is visible.
   * @param {Property.<number>} valueProperty - property containing model quantity to display
   * @param {Tandem} tandem
   */
  function BarMeter( circuit, visibleProperty, valueProperty, tandem ) {
    assert && assert( circuit instanceof ParallelCircuit );
    assert && assert( visibleProperty instanceof Property );
    assert && assert( valueProperty instanceof Property );

    // @public {Property.<number>}
    this.valueProperty = valueProperty;

    // @public {Property.<boolean>}
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
