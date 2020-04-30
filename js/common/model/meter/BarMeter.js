// Copyright 2015-2020, University of Colorado Boulder

/**
 * Stores properties for showing a bar meter.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import Property from '../../../../../axon/js/Property.js';
import inherit from '../../../../../phet-core/js/inherit.js';
import capacitorLabBasics from '../../../capacitorLabBasics.js';

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

inherit( Object, BarMeter, {

  /**
   * Reset the BarMeter
   * @public
   */
  reset: function() {
    this.visibleProperty.reset();
  }
} );

export default BarMeter;