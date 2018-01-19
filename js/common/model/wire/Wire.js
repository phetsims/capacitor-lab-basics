// Copyright 2015-2017, University of Colorado Boulder

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
define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var WireShapeCreator = require( 'CAPACITOR_LAB_BASICS/common/model/shapes/WireShapeCreator' );

  /**
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {WireSegment[]} segments
   * @param {CircuitLocation} connectionPoint
   *
   * @constructor
   */
  function Wire( modelViewTransform, segments, connectionPoint ) {

    this.segments = segments; // @public
    this.connectionPoint = connectionPoint; // @public
    this.shapeCreator = new WireShapeCreator( this, modelViewTransform ); // @private

    // @public
    this.shapeProperty = new Property( this.shapeCreator.createWireShape() );

    var self = this;

    // Whenever a segment changes, update the shape.
    this.segments.forEach( function( segment ) {
      Property.multilink( [ segment.startPointProperty, segment.endPointProperty ], function() {
        self.shapeProperty.set( self.shapeCreator.createWireShape() );
      } );
    } );
  }

  capacitorLabBasics.register( 'Wire', Wire );

  return inherit( Object, Wire, {

    /**
     * Update all segments of the wire
     * @public
     */
    update: function() {
      this.segments.forEach( function( segment ) {
        segment.update();
      } );
    },

    /**
     * Whether the given shape intersects with the wire.
     * @public
     *
     * @param {Shape} shape
     */
    contacts: function( shape ) {
      return shape.bounds.intersectsBounds( this.shapeProperty.value.bounds ) &&
             shape.shapeIntersection( this.shapeProperty.value ).getNonoverlappingArea() > 0;
    }
  } );
} );
