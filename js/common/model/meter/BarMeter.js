// Copyright 2015-2022, University of Colorado Boulder

/**
 * Stores properties for showing a bar meter.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import Property from '../../../../../axon/js/Property.js';
import ReadOnlyProperty from '../../../../../axon/js/ReadOnlyProperty.js';
import capacitorLabBasics from '../../../capacitorLabBasics.js';

class BarMeter {
  /**
   * @param {Property.<boolean>} visibleProperty - model property that determines if the entire meter is visible.
   * @param {Property.<number>} valueProperty - property containing model quantity to display
   */
  constructor( visibleProperty, valueProperty ) {
    assert && assert( visibleProperty instanceof Property );
    assert && assert( valueProperty instanceof ReadOnlyProperty );

    // @public {Property.<number>}
    this.valueProperty = valueProperty;

    // @public {Property.<boolean>}
    this.visibleProperty = visibleProperty;
  }

  /**
   * Reset the BarMeter
   * @public
   */
  reset() {
    this.visibleProperty.reset();
  }
}

capacitorLabBasics.register( 'BarMeter', BarMeter );

export default BarMeter;