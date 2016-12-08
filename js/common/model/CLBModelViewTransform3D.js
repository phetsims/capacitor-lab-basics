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
     * @return REVIEW: {Vector2}?
     */
    modelToViewPosition: function( modelPoint ) {
      assert && assert( modelPoint instanceof Vector3,
        'modelPoint must be of type Vector3. Received ' + modelPoint );

      /* REVIEW: avoid component-wise math, use mutable methods if performance is a bottleneck
      var offsetModelPoint = modelPoint.plus( Vector2.createPolar( modelPoint.z * Math.sin( this.pitch ), this.yaw ) );
      return this.modelToViewTransform2D.transformPosition2( offsetModelPoint )
      // or for the mutable option, at the top of the file declare:
      var scratchVectorA = new Vector2();
      // later (consider a second scratch vector for the 2d modelPoint?)
      scratchVectorA.setPolar( modelPoint.z * Math.sin( this.pitch ), this.yaw ).add( modelPoint );
      */
      var xModel = modelPoint.x + ( modelPoint.z * Math.sin( this.pitch ) * Math.cos( this.yaw ) );
      var yModel = modelPoint.y + ( modelPoint.z * Math.sin( this.pitch ) * Math.sin( this.yaw ) );
      return this.modelToViewTransform2D.transformPosition2( new Vector2( xModel, yModel ) );
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
      //REVIEW (performance): If it's a bottleneck, use a scratch Vector3 here.
      return this.modelToViewPosition( new Vector3( x, y, z ) );
    },

    /**
     * Maps a delta from 3D model coordinates to 2D view coordinates.
     * @public
     *
     * @param {Vector3} delta
     * @returns {Vector2}
     */
    modelToViewDelta: function( delta ) {
      //REVIEW (performance): If it's a bottleneck, use a scratch Vector3 here.
      //REVIEW: new Vector3() is at (0,0,0)
      var origin = this.modelToViewPosition( new Vector3( 0, 0, 0 ) );
      //REVIEW: generally 'position' is a better name than 'p'
      var p = this.modelToViewPosition( delta );
      //REVIEW: return p.minus( origin );
      return new Vector2( p.x - origin.x, p.y - origin.y );
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
      //REVIEW (performance): If it's a bottleneck, use a scratch Vector3 here.
      return this.modelToViewDelta( new Vector3( xDelta, yDelta, zDelta ) );
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
     * @public
     *
     * REVIEW: Note about how this isn't the inverse of modelToViewPosition might be good (with the note about z=0)
     *
     * @param {Vector2} pView
     * @return REVIEW: {Vector3}?
     */
    viewToModelPosition: function( pView ) {
      //REVIEW: Transform3 has built in inverse functions, use that here instead
      //REVIEW: generally 'position' is a better name than 'p'
      var p = this.viewToModelTransform2D.transformPosition2( pView );
      //REVIEW: return p.toVector3();
      return new Vector3( p.x, p.y, 0 );
    },

    /**
     * Maps a point from 2D view coordinates to 3D model coordinates. The z coordinate will be zero.
     * @public
     *
     * @param {number} x
     * @param {number} y
     * @return REVIEW: {Vector3}?
     */
    viewToModelXY: function( x, y ) {
      //REVIEW (performance): If it's a bottleneck, use a scratch Vector2 here.
      return this.viewToModelPosition( new Vector2( x, y ) );
    },

    /**
     * Maps a delta from 2D view coordinates to 3D model coordinates. The z coordinate will be zero.
     * @public
     *
     * @param {Vector2} delta
     * @return REVIEW: {Vector3}?
     */
    viewToModelDelta: function( delta ) {
      //REVIEW (performance): If it's a bottleneck, use a scratch Vector2 here.
      //REVIEW: new Vector2() is at (0,0)
      var origin = this.viewToModelPosition( new Vector2( 0, 0 ) );
      //REVIEW: generally 'position' is a better name than 'p'
      var p = this.viewToModelPosition( delta );
      //REVIEW: return p.minus( origin );
      return new Vector3( p.x - origin.x, p.y - origin.y, p.z - origin.z );
    },

    /**
     * Maps a delta from 2D view coordinates to 3D model coordinates. The z coordinate will be zero.
     * @public
     *
     * @param {number} xDelta
     * @param {number} yDelta
     * @return REVIEW: {Vector3}?
     */
    viewToModelDeltaXY: function( xDelta, yDelta ) {
      //REVIEW (performance): If it's a bottleneck, use a scratch Vector2 here.
      return this.viewToModelDelta( new Vector2( xDelta, yDelta ) );
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
