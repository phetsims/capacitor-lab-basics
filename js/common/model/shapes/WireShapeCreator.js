// Copyright 2015-2020, University of Colorado Boulder

/**
 * Creates the 2D shape for a wire. Shapes are in the global view coordinate frame.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import Shape from '../../../../../kite/js/Shape.js';
import LineStyles from '../../../../../kite/js/util/LineStyles.js';
import inherit from '../../../../../phet-core/js/inherit.js';
import capacitorLabBasics from '../../../capacitorLabBasics.js';

/**
 * @constructor
 *
 * @param {Wire} wire
 * @param {YawPitchModelViewTransform3} modelViewTransform
 */
function WireShapeCreator( wire, modelViewTransform ) {
  // @private {Wire}
  this.wire = wire;

  // @private {YawPitchModelViewTransform3}
  this.modelViewTransform = modelViewTransform;
}

capacitorLabBasics.register( 'WireShapeCreator', WireShapeCreator );

export default inherit( Object, WireShapeCreator, {

  /**
   * Create a wire shape.  Shape is generated from the stroked shape of the line segments which are added together
   * tip-to-tail.  This assumes that segments are added pieced together in the correct order.
   * @public
   *
   * @returns {Shape}
   */
  createWireShape: function() {
    const self = this;

    // stroke styles for the wire shapes.
    const strokeStyles = new LineStyles( {
      lineWidth: 7,
      lineCap: 'round',
      lineJoin: 'round'
    } );

    const shapes = this.wire.segments.map( function( segment ) {
      const shape = Shape.lineSegment( segment.startPointProperty.value.toVector2(), segment.endPointProperty.value.toVector2() );
      return self.modelViewTransform.modelToViewShape( shape ).getStrokedShape( strokeStyles );
    } );
    return Shape.union( shapes );
  }
} );