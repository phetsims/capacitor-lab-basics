// Copyright 2015-2019, University of Colorado Boulder

/**
 * Stores properties for showing a bar meter.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Property = require( 'AXON/Property' );

  /**
   * @constructor
   *
   * @param {Property.<boolean>} visibleProperty - model property that determines if the entire meter is visible.
   * @param {Property.<number>} valueProperty - property containing model quantity to display
   */
  function BarMeter( visibleProperty, valueProperty ) {
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
