// Copyright 2015, University of Colorado Boulder

/**
 * A wire is a collection of connected wire segments. It contains a creator object that creates the wire shape. The
 * shape is used to display the wire, and to check continuity when measuring voltage.
 *
 * Note that strict connectivity of the wire segments is not required. In fact, you'll notice that segment endpoints
 * are often adjusted to accommodate the creation of wire shapes that look convincing in the view.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 * @author Andrew Adare
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var WireShapeCreator = require( 'CAPACITOR_LAB_BASICS/common/model/shapes/WireShapeCreator' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  /**
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {number} thickness
   * @param {WireSegment[]} segments
   * @param {string} connectionPoint
   *
   * @constructor
   */
  function Wire( modelViewTransform, thickness, segments, connectionPoint ) {

    assert && assert( thickness > 0 );

    this.segments = segments; // @public
    this.connectionPoint = connectionPoint; // @public
    this.thickness = thickness; // @public REVIEW: never used outside constructor, why is this a property?
    this.shapeCreator = new WireShapeCreator( this, modelViewTransform ); // @private
    //REVIEW: shapeCreator not used by functions outside constructor that are actually called, recommend it be left as local variable

    //REVIEW: visibility doc (public presumably)
    this.shapeProperty = new Property( this.shapeCreator.createWireShape(), {
      // Wire is not currently instrumented
    } );

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
     * Cleanup function to avoid memory leaks.
     * REVIEW: visibility doc
     */
    cleanUp: function() {
      //REVIEW: Why isn't this getting called?
      this.segments.forEach( function( segment ) {
        //REVIEW: WireSegment.cleanUp doesn't exist.
        segment.cleanUp();
      } );
    },

    /**
     * Function that creates the shape of this wire through the shape creator.
     * REVIEW: visibility doc
     * REVIEW: returns?
     * REVIEW: This is not called, dead code? Should be removed or called.
     */
    createShapes: function() {
      //REVIEW: createWireShapes() doesn't exist on anything else
      return this.shapeCreator.createWireShapes();
    },

    /**
     * Get the corner offset of the wire.
     * REVIEW: visibility doc
     * REVIEW: This is not called, dead code? Should be removed or called.
     *
     * @returns {number}
     */
    getCornerOffset: function() {
      //REVIEW: getCornerOffset() doesn't exist on anything else
      return this.shapeCreator.getCornerOffset();
    },

    /**
     * Get the end offset of the wire.
     * REVIEW: visibility doc
     * REVIEW: This is not called, dead code? Should be removed or called.
     *
     * @returns {number}
     */
    getEndOffset: function() {
      //REVIEW: getEndOffset() doesn't exist on anything else
      return this.shapeCreator.getEndOffset();
    },

    update: function() {
      this.segments.forEach( function( segment ) {
        // not all segments need to be updated
        //REVIEW: Any advantage of this over having a no-op update() on WireSegment itself?
        segment.update && segment.update();
      } );
    },

    //REVIEW: doc
    //REVIEW: Why is this not being called?
    reset: function() {
      //REVIEW: Why would it not reset its segments?
      this.shapeProperty.reset();
    }
  } );
} );
