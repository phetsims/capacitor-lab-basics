// Copyright 2015-2017, University of Colorado Boulder

/**
 * Creates 2D projections of shapes that are related to the 3D voltmeter model.
 * Shapes are in the global view coordinate frame.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg
 * @author Andrew Adare
 */
define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );
  var Vector3 = require( 'DOT/Vector3' );

  var PROBE_TIP_OFFSET = new Vector3( 0.0003, 0, 0 );

  /**
   * @constructor
   *
   * @param {Voltmeter} voltmeter
   * @param {CLBModelViewTransform3D} modelViewTransform
   */
  function VoltmeterShapeCreator( voltmeter, modelViewTransform ) {

    // @private {Voltmeter}
    this.voltmeter = voltmeter;

    // @private {CLBModelViewTransform3D}
    this.modelViewTransform = modelViewTransform;
  }

  capacitorLabBasics.register( 'VoltmeterShapeCreator', VoltmeterShapeCreator );

  return inherit( Object, VoltmeterShapeCreator, {

    /**
     * Gets the shape of the positive probe's tip in the world coordinate frame.
     * @public
     *
     * @returns {Shape}
     */
    getPositiveProbeTipShape: function() {
      var origin = this.voltmeter.positiveProbeLocationProperty.value.plus( PROBE_TIP_OFFSET );
      return this.getProbeTipShape( origin, -this.modelViewTransform.yaw );
    },

    /**
     * Gets the shape of the negative probe's tip in the world coordinate frame.
     * @public
     *
     * @returns {Shape}
     */
    getNegativeProbeTipShape: function() {
      var origin = this.voltmeter.negativeProbeLocationProperty.value.plus( PROBE_TIP_OFFSET );
      return this.getProbeTipShape( origin, -this.modelViewTransform.yaw );
    },

    /**
     * Get the shape of a probe tip relative to some specified origin.
     * @public
     *
     * @param {Vector2|Vector3} origin
     * @param {number} theta - rotation of modelViewTransform for 3D perspective
     * @returns {Shape}
     */
    getProbeTipShape: function( origin, theta ) {
      assert && assert( typeof theta === 'number' );

      var size = this.voltmeter.probeTipSizeReference;
      var width = size.width;
      var height = size.height;
      var x = origin.x;
      var y = origin.y;
      var t = Matrix3.rotationAround( theta, x, y );

      return Shape.polygon( [
        this.modelViewTransform.modelToViewPosition( t.timesVector2( new Vector2( x, y ) ).toVector3() ),
        this.modelViewTransform.modelToViewPosition( t.timesVector2( new Vector2( x + width, y ) ).toVector3() ),
        this.modelViewTransform.modelToViewPosition( t.timesVector2( new Vector2( x + width, y + height ) ).toVector3() ),
        this.modelViewTransform.modelToViewPosition( t.timesVector2( new Vector2( x, y + height ) ).toVector3() )
      ] );
    }
  } );
} );