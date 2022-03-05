// Copyright 2015-2022, University of Colorado Boulder

/**
 * Creates the 2D shape for a wire. Shapes are in the global view coordinate frame.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import { LineStyles, Shape } from '../../../../../kite/js/imports.js';
import capacitorLabBasics from '../../../capacitorLabBasics.js';

class WireShapeCreator {
  /**
   * @param {Wire} wire
   * @param {YawPitchModelViewTransform3} modelViewTransform
   */
  constructor( wire, modelViewTransform ) {
    // @private {Wire}
    this.wire = wire;

    // @private {YawPitchModelViewTransform3}
    this.modelViewTransform = modelViewTransform;
  }

  /**
   * Create a wire shape.  Shape is generated from the stroked shape of the line segments which are added together
   * tip-to-tail.  This assumes that segments are added pieced together in the correct order.
   * @public
   *
   * @returns {Shape}
   */
  createWireShape() {
    // stroke styles for the wire shapes.
    const strokeStyles = new LineStyles( {
      lineWidth: 7,
      lineCap: 'round',
      lineJoin: 'round'
    } );

    const shapes = this.wire.segments.map( segment => {
      const shape = Shape.lineSegment( segment.startPointProperty.value.toVector2(), segment.endPointProperty.value.toVector2() );
      return this.modelViewTransform.modelToViewShape( shape ).getStrokedShape( strokeStyles );
    } );
    return Shape.union( shapes );
  }
}

capacitorLabBasics.register( 'WireShapeCreator', WireShapeCreator );

export default WireShapeCreator;