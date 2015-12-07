// Copyright 2015, University of Colorado Boulder

/**
 * Creates 2D projections of shapes that are related to the 3D boxes.
 * Shapes are in the view coordinate frame, everything else is in model coordinates.
 * Shapes for all faces corresponds to a box with its origin in the center of the top face.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Shape = require( 'KITE/Shape' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  /**
   * Constructor for a BoxShapeCreator.
   *
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function BoxShapeCreator( modelViewTransform ) {
    this.modelViewTransform = modelViewTransform; // @public
  }

  capacitorLabBasics.register( 'BoxShapeCreator', BoxShapeCreator );
  
  return inherit( Object, BoxShapeCreator, {

    /**
     * Top faces is a parallelogram.
     *
     *    p0 -------------- p1
     *   /                /
     *  /                /
     * p3 --------------p2
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @param {number} width
     * @param {number} height
     * @param {number} depth
     *
     */
    createTopFace: function( x, y, z, width, height, depth ) {
      // points
      var p0 = this.modelViewTransform.modelToViewXYZ( x - ( width / 2 ), y, z + ( depth / 2 ) );
      var p1 = this.modelViewTransform.modelToViewXYZ( x + ( width / 2 ), y, z + ( depth / 2 ) );
      var p2 = this.modelViewTransform.modelToViewXYZ( x + ( width / 2 ), y, z - ( depth / 2 ) );
      var p3 = this.modelViewTransform.modelToViewXYZ( x - ( width / 2 ), y, z - ( depth / 2 ) );

      // shape
      return this.createFace( p0, p1, p2, p3 );
    },

    /**
     * Create the top face of the Box with a Bounds3 object.
     *
     * @param {Bounds3} size
     */
    createTopFaceBounds3: function( size ) {
      return this.createTopFace( size.minX, size.minY, size.minZ, size.width, size.height, size.depth );
    },

    /**
     * Front face is a rectangle.
     * <code>
     * p0 --------------- p1
     * |                 |
     * |                 |
     * p3 --------------- p2
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @param {number} width
     * @param {number} height
     * @param {number} depth
     */
    createFrontFace: function( x, y, z, width, height, depth ) {
      // points
      var p0 = this.modelViewTransform.modelToViewXYZ( x - ( width / 2 ), y, z - ( depth / 2 ) );
      var p1 = this.modelViewTransform.modelToViewXYZ( x + ( width / 2 ), y, z - ( depth / 2 ) );
      var p2 = this.modelViewTransform.modelToViewXYZ( x + ( width / 2 ), y + height, z - ( depth / 2 ) );
      var p3 = this.modelViewTransform.modelToViewXYZ( x - ( width / 2 ), y + height, z - ( depth / 2 ) );
      // shape
      return this.createFace( p0, p1, p2, p3 );
    },

    /**
     * Create the front face of the box with a Bounds3 object.
     *
     * @param {Bounds3} size
     */
    createFrontFaceBounds3: function( size ) {
      return this.createFrontFace( size.minX, size.minY, size.minZ, size.width, size.height, size.depth );
    },

    /**
     * Right-side face is a parallelogram.
     *
     *     p1
     *   /  |
     *  /   |
     * /    |
     * /    p2
     * p0   /
     * |   /
     * |  /
     * | /
     * p3
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @param {number} width
     * @param {number} height
     * @param {number} depth
     */
    createRightSideFace: function( x, y, z, width, height, depth ) {
      // points
      var p0 = this.modelViewTransform.modelToViewXYZ( x + ( width / 2 ), y, z - ( depth / 2 ) );
      var p1 = this.modelViewTransform.modelToViewXYZ( x + ( width / 2 ), y, z + ( depth / 2 ) );
      var p2 = this.modelViewTransform.modelToViewXYZ( x + ( width / 2 ), y + height, z + ( depth / 2 ) );
      var p3 = this.modelViewTransform.modelToViewXYZ( x + ( width / 2 ), y + height, z - ( depth / 2 ) );
      // path
      return this.createFace( p0, p1, p2, p3 );
    },

    /**
     * Create the right face of the box with a Bounds3 object.
     *
     * @param {Bounds3} size
     */
    createRightSideFaceBounds3: function( size ) {
      return this.createRightSideFace( size.minX, size.minY, size.minZ, size.width, size.height, size.depth );
    },

    /**
     * A complete box, relative to a specific origin.
     *
     * TODO: Previously, this was built up using constructional area geometry.  For now, I will return an array that
     * can be added to the scene in parts.
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @param {number} width
     * @param {number} height
     * @param {number} depth
     */
    createBoxShape: function( x, y, z, width, height, depth ) {
      var topShape = this.createTopFace( x, y, z, width, height, depth );
      var frontShape = this.createFrontFace( x, y, z, width, height, depth );
      var sideShape = this.createRightSideFace( x, y, z, width, height, depth );
      return [ topShape, frontShape, sideShape ];
    },

    /*
     * A face is defined by 4 points, specified in view coordinates.
     */
    createFace: function( p0, p1, p2, p3 ) {
      return new Shape()
        .moveToPoint( p0 )
        .lineToPoint( p1 )
        .lineToPoint( p2 )
        .lineToPoint( p3 )
        .close();
    }
  } );
} );