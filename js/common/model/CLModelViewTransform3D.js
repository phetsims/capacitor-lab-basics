// Copyright 2002-2015, University of Colorado Boulder

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
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Transform3 = require( 'DOT/Transform3' );
  var Vector2 = require( 'DOT/Vector2' );
  var Vector3 = require( 'DOT/Vector3' );
  var CLConstants = require( 'CAPACITOR_LAB_BASICS/common/CLConstants' );

  /**
   * Constructor for the CLModelViewTransform.
   *
   * @param {Object} [options]
   * @constructor
   */
  function CLModelViewTransform3D( options ) {

    options = _.extend( {
      scale: CLConstants.MVT_SCALE, // scale for mapping from model to view (x and y scale are identical)
      pitch: CLConstants.MVT_PITCH, // rotation about the horizontal (x) axis, sign determined using the right-hand rule (radians)
      yaw: CLConstants.MVT_YAW // rotation about the vertical (y) axis, sign determined using the right-hand rule (radians)
    }, options );

    this.modelToViewTransform2D = new Transform3( new Matrix3.scaling( options.scale, options.scale ) ); // @private
    this.viewToModelTransform2D = new Transform3( new Matrix3.scaling( 1 / options.scale, 1 / options.scale ) ); //@private

    this.pitch = options.pitch;
    this.yaw = options.yaw;

  }

  return inherit( Object, CLModelViewTransform3D, {

    //----------------------------------------------------------------------------
    // Model-to-view transforms
    //----------------------------------------------------------------------------

    /**
     * Maps a point from 3D model coordinates to 2D view coordinates.
     *
     * @param {Vector3} modelPoint
     * @return
     */
    modelToViewPosition: function( modelPoint ) {

      var xModel = modelPoint.x + ( modelPoint.z * Math.sin( this.pitch ) * Math.cos( this.yaw ) );
      var yModel = modelPoint.y + ( modelPoint.z * Math.sin( this.pitch ) * Math.sin( this.yaw ) );
      return this.modelToViewTransform2D.transformPosition2( new Vector2( xModel, yModel ) );

    },

    /**
     * Maps a point from 3D model coordinates to 2D view coordinates.
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @return {Vector2}
     */
    modelToViewXYZ: function( x, y, z ) {
      return this.modelToViewPosition( new Vector3( x, y, z ) );
    },

    /**
     * Maps a delta from 3D model coordinates to 2D view coordinates.
     *
     * @param {Vector3} delta
     * @return {Vector2}
     */
    modelToViewDelta: function( delta ) {

      var origin = this.modelToViewPosition( new Vector3( 0, 0, 0 ) );
      var p = this.modelToViewPosition( delta );
      return new Vector2( p.x - origin.x, p.y - origin.y );

    },

    /**
     * Maps a delta from 3D model coordinates to 2D view coordinates.
     *
     * @param {number} xDelta
     * @param {number} yDelta
     * @param {number} zDelta
     * @return {Vector2}
     */
    modelToViewDeltaXYZ: function( xDelta, yDelta, zDelta ) {
      return this.modelToViewDelta( new Vector3( xDelta, yDelta, zDelta ) );
    },

    /**
     * Model shapes are all in the 2D xy plane, and have no depth.
     *
     * @param {Shape} modelShape
     * @return
     */
    modelToViewShape: function( modelShape ) {
      return this.modelToViewTransform2D.transformShape( modelShape );
    },

    //----------------------------------------------------------------------------
    // View-to-model transforms
    //----------------------------------------------------------------------------

    /**
     * Maps a point from 2D view coordinates to 3D model coordinates. The z coordinate will be zero.
     *
     * @param {Vector2} pView
     * @return
     */
    viewToModelPosition: function( pView ) {
      var p = this.viewToModelTransform2D.transformPosition2( pView );
      return new Vector3( p.x, p.y, 0 );
    },

    /**
     * Maps a point from 2D view coordinates to 3D model coordinates. The z coordinate will be zero.
     *
     * @param {number} x
     * @param {number} y
     * @return
     */
    viewToModelXY: function( x, y ) {
      return this.viewToModelPosition( new Vector2( x, y ) );
    },

    /**
     * Maps a delta from 2D view coordinates to 3D model coordinates. The z coordinate will be zero.
     *
     * @param {Vector2} delta
     * @return
     */
    viewToModelDelta: function( delta ) {
      var origin = this.viewToModelPosition( new Vector2( 0, 0 ) );
      var p = this.viewToModelPosition( delta );
      return new Vector3( p.x - origin.x, p.y - origin.y, p.z - origin.z );
    },

    /**
     * Maps a delta from 2D view coordinates to 3D model coordinates. The z coordinate will be zero.
     *
     * @param {number} xDelta
     * @param {number} yDelta
     * @return
     */
    viewToModelDeltaXY: function( xDelta, yDelta ) {
      return this.viewToModelDelta( new Vector2( xDelta, yDelta ) );
    }

  } );
} );