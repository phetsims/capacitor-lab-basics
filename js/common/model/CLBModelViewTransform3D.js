// Copyright 2016, University of Colorado Boulder

/**
 * Provides the transforms between model and view 3D-coordinate systems. In both coordinate systems, +x is to the right,
 * +y is down, +z is away from the viewer. Sign of rotation angles is specified using the right-hand rule.
 *
 * +y
 * ^    +z
 * |   /
 * |  /
 * | /
 * +-------> +x
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 * @author Andrew Adare
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Transform3 = require( 'DOT/Transform3' );
  var Vector2 = require( 'DOT/Vector2' );
  var Vector3 = require( 'DOT/Vector3' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );


  // Scratch variable for performance
  // @private
  var scratchVector2 = new Vector2();
  var scratchVector3 = new Vector3();

  /**
   * Constructor for the CLBModelViewTransform3D.
   *
   * @param {Object} [options]
   * @constructor
   */
  function CLBModelViewTransform3D( options ) {

    options = _.extend( {
      scale: CLBConstants.MVT_SCALE, // scale for mapping from model to view (x and y scale are identical)
      pitch: CLBConstants.MVT_PITCH, // rotation about the horizontal (x) axis, sign determined using the right-hand rule (radians)
      yaw: CLBConstants.MVT_YAW // rotation about the vertical (y) axis, sign determined using the right-hand rule (radians)
    }, options );

    // @private
    this.modelToViewTransform2D = new Transform3( Matrix3.scaling( options.scale ) );

    //REVIEW: Transform3 has built in inverse functions, use those instead
    //REVIEW: Matrix.scaling( options.scale ) will work, applies it to both X and Y
    this.viewToModelTransform2D = new Transform3( Matrix3.scaling( 1 / options.scale, 1 / options.scale ) );

    // @private
    this.pitch = options.pitch;

    // @public (read-only)
    this.yaw = options.yaw;
  }

  capacitorLabBasics.register( 'CLBModelViewTransform3D', CLBModelViewTransform3D );

  return inherit( Object, CLBModelViewTransform3D, {

    //----------------------------------------------------------------------------
    // Model-to-view transforms
    //----------------------------------------------------------------------------

    /**
     * Maps a point from 3D model coordinates to 2D view coordinates.
     * @public
     *
     * @param {Vector3} modelPoint
     * @return {Vector3}
     */
    modelToViewPosition: function( modelPoint ) {

      assert && assert( modelPoint instanceof Vector3,
        'modelPoint must be of type Vector3. Received ' + modelPoint );

      scratchVector2.setPolar( modelPoint.z * Math.sin( this.pitch ), this.yaw ).add( modelPoint );
      return this.modelToViewTransform2D.transformPosition2( scratchVector2 );
    },

    /**
     * Maps a point from 3D model coordinates to 2D view coordinates.
     * @public
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {Vector2}
     */
    modelToViewXYZ: function( x, y, z ) {
      return this.modelToViewPosition( scratchVector3.setXYZ( x, y, z ) );
    },

    /**
     * Maps a delta from 3D model coordinates to 2D view coordinates.
     * @public
     *
     * @param {Vector3} delta
     * @returns {Vector2}
     */
    modelToViewDelta: function( delta ) {
      var origin = this.modelToViewPosition( scratchVector3.setXYZ( 0, 0, 0 ) );
      return this.modelToViewPosition( delta ).minus( origin );
    },

    /**
     * Maps a delta from 3D model coordinates to 2D view coordinates.
     * @public
     *
     * @param {number} xDelta
     * @param {number} yDelta
     * @param {number} zDelta
     * @returns {Vector2}
     */
    modelToViewDeltaXYZ: function( xDelta, yDelta, zDelta ) {
      return this.modelToViewDelta( scratchVector3.setXYZ( xDelta, yDelta, zDelta ) );
    },

    /**
     * Model shapes are all in the 2D xy plane, and have no depth.
     * @public
     *
     * @param {Shape} modelShape
     * @return REVIEW: {Shape}?
     */
    modelToViewShape: function( modelShape ) {
      return this.modelToViewTransform2D.transformShape( modelShape );
    },

    /**
     * Bounds are all in the 2D xy plane, and have no depth.
     * @public
     *
     * @param  {Bounds2} modelBounds
     * @returns {Bounds2}
     */
    modelToViewBounds: function( modelBounds ) {
      return this.modelToViewTransform2D.transformBounds2( modelBounds );
    },

    //----------------------------------------------------------------------------
    // View-to-model transforms
    //----------------------------------------------------------------------------

    /**
     * Maps a point from 2D view coordinates to 3D model coordinates. The z coordinate will be zero.
     * This is different than the inverse of modelToViewPosition.
     * @public
     *
     * @param {Vector2} pView
     * @return {Vector3}
     */
    viewToModelPosition: function( pView ) {
      //REVIEW: Transform3 has built in inverse functions, use that here instead
      return this.viewToModelTransform2D.transformPosition2( pView ).toVector3();
    },

    /**
     * Maps a point from 2D view coordinates to 3D model coordinates. The z coordinate will be zero.
     * @public
     *
     * @param {number} x
     * @param {number} y
     * @return {Vector3}
     */
    viewToModelXY: function( x, y ) {
      return this.viewToModelPosition( scratchVector2.setXY( x, y ) );
    },

    /**
     * Maps a delta from 2D view coordinates to 3D model coordinates. The z coordinate will be zero.
     * @public
     *
     * @param {Vector2} delta
     * @return {Vector3}
     */
    viewToModelDelta: function( delta ) {
      var origin = this.viewToModelPosition( scratchVector2.setXY( 0, 0 ) );

      return this.viewToModelPosition( delta ).minus( origin );
    },

    /**
     * Maps a delta from 2D view coordinates to 3D model coordinates. The z coordinate will be zero.
     * @public
     *
     * @param {number} xDelta
     * @param {number} yDelta
     * @return {Vector3}
     */
    viewToModelDeltaXY: function( xDelta, yDelta ) {
      return this.viewToModelDelta( scratchVector2.setXY( xDelta, yDelta ) );
    },

    /**
     * Transforms 2D view bounds to 2D model bounds since bounds have no depth.
     * @public
     *
     * @param {Bounds2} viewBounds
     * @returns {Bounds2}
     */
    viewToModelBounds: function( viewBounds ) {
      //REVIEW: Transform3 has built in inverse functions, use that here instead
      return this.viewToModelTransform2D.transformBounds2( viewBounds );
    }
  } );
} );
