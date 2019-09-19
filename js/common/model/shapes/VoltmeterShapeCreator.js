// Copyright 2015-2018, University of Colorado Boulder

/**
 * Creates 2D projections of shapes that are related to the 3D voltmeter model.
 * Shapes are in the global view coordinate frame.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Matrix3 = require( 'DOT/Matrix3' );
  const Shape = require( 'KITE/Shape' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector3 = require( 'DOT/Vector3' );

  // var PROBE_TIP_OFFSET = new Vector3( 0.00045, 0, 0 );
  const PROBE_TIP_OFFSET = new Vector3( 0.00018, 0.00025, 0 );

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
      const origin = this.voltmeter.positiveProbeLocationProperty.value.plus( PROBE_TIP_OFFSET );
      return this.getProbeTipShape( origin, -this.modelViewTransform.yaw );
    },

    /**
     * Gets the shape of the negative probe's tip in the world coordinate frame.
     * @public
     *
     * @returns {Shape}
     */
    getNegativeProbeTipShape: function() {
      const origin = this.voltmeter.negativeProbeLocationProperty.value.plus( PROBE_TIP_OFFSET );
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

      const size = this.voltmeter.probeTipSizeReference;
      const width = size.width;
      const height = size.height;
      const x = origin.x;
      const y = origin.y;
      const t = Matrix3.rotationAround( theta, x, y );
      const midRatio = 0.5;

      return Shape.polygon( [
        this.modelViewTransform.modelToViewPosition( t.timesVector2( new Vector2( x + width / 2, y ) ).toVector3() ),
        this.modelViewTransform.modelToViewPosition( t.timesVector2( new Vector2( x + width, y + height * midRatio ) ).toVector3() ),
        this.modelViewTransform.modelToViewPosition( t.timesVector2( new Vector2( x + width, y + height ) ).toVector3() ),
        this.modelViewTransform.modelToViewPosition( t.timesVector2( new Vector2( x, y + height ) ).toVector3() ),
        this.modelViewTransform.modelToViewPosition( t.timesVector2( new Vector2( x, y + height * midRatio ) ).toVector3() )
      ] );
    }
  } );
} );