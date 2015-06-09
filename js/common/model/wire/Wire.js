// Copyright 2002-2015, University of Colorado Boulder

/**
 * A wire is a collection of connected wire segments. It contains a creator object that creates the wire shape. The
 * shape is used to display the wire, and to check continuity when measuring voltage.
 *
 * Note that strict connectivity of the wire segments is not required. In fact, you'll notice that segment endpoints
 * are often adjusted to accommodate the creation of wire shapes that look convincing in the view.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var WireShapeCreator = require( 'CAPACITOR_LAB/common/model/shapes/WireShapeCreator' );

  /**
   * Constructor for a Wire.
   */
  function Wire( modelViewTransform, thickness, segments ) {

    //assert && assert( segments !== undefined, 'Wire segments undefined for wire.' );
    assert && assert( thickness > 0 );

    this.segments = segments;
    this.thickness = thickness;
    this.shapeCreator = new WireShapeCreator( this, modelViewTransform );

    //this.shape = this.shapeCreator.createWireShape();
    PropertySet.call( this, {
      //shape: this.shapeCreator.createWireShape()
    } );

    this.segments.forEach( function( segment ) {
      // Some kind of linking function that adjusts the shape of each wiire.
    } );
  }

  return inherit( PropertySet, Wire, {

    /**
     * Cleanup function to avoid memory leaks.
     */
    cleanUp: function() {
      this.segments.forEach( function( segment ) {
        segment.cleanUp();
      } );
    },

    /**
     * Function that creates the shape of this wire directly.
     */
    createShapes: function() {
      return this.shapeCreator.createWireShapes();
    },

    /**
     * Get the corner offset of the wire.
     *
     * @returns {number}
     */
    getCornerOffset: function() {
      return this.shapeCreator.getCornerOffset();
    },

    /**
     * Get the end offset of the wire.
     * @returns {number}
     */
    getEndOffset: function() {
      return this.shapeCreator.getEndOffset();
    }
  } );
} );