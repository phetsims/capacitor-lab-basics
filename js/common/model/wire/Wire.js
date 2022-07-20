// Copyright 2015-2022, University of Colorado Boulder

/**
 * A wire is a collection of connected wire segments. It contains a creator object that creates the wire shape. The
 * shape is used to display the wire, and to check continuity when measuring voltage.
 *
 * Note that strict connectivity of the wire segments is not required. In fact, you'll notice that segment endpoints
 * are often adjusted to accommodate the creation of wire shapes that look convincing in the view.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import Multilink from '../../../../../axon/js/Multilink.js';
import Property from '../../../../../axon/js/Property.js';
import capacitorLabBasics from '../../../capacitorLabBasics.js';
import WireShapeCreator from '../shapes/WireShapeCreator.js';

class Wire {
  /**
   * @param {YawPitchModelViewTransform3} modelViewTransform
   * @param {WireSegment[]} segments
   * @param {CircuitPosition} connectionPoint
   *
   */
  constructor( modelViewTransform, segments, connectionPoint ) {

    this.segments = segments; // @public
    this.connectionPoint = connectionPoint; // @public
    this.shapeCreator = new WireShapeCreator( this, modelViewTransform ); // @private

    // @public
    this.shapeProperty = new Property( this.shapeCreator.createWireShape() );

    // Whenever a segment changes, update the shape.
    this.segments.forEach( segment => {
      Multilink.multilink( [ segment.startPointProperty, segment.endPointProperty ], () => {
        this.shapeProperty.set( this.shapeCreator.createWireShape() );
      } );
    } );
  }

  /**
   * Update all segments of the wire
   * @public
   */
  update() {
    this.segments.forEach( segment => {
      segment.update();
    } );
  }

  /**
   * Whether the given shape intersects with the wire.
   * @public
   *
   * @param {Shape} shape
   */
  contacts( shape ) {
    return shape.bounds.intersectsBounds( this.shapeProperty.value.bounds ) &&
           shape.shapeIntersection( this.shapeProperty.value ).getNonoverlappingArea() > 0;
  }
}

capacitorLabBasics.register( 'Wire', Wire );

export default Wire;
