// Copyright 2015-2022, University of Colorado Boulder

/**
 * Creates 2D projections of shapes that are related to the 3D voltmeter model.
 * Shapes are in the global view coordinate frame.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import Matrix3 from '../../../../../dot/js/Matrix3.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import Vector3 from '../../../../../dot/js/Vector3.js';
import { Shape } from '../../../../../kite/js/imports.js';
import capacitorLabBasics from '../../../capacitorLabBasics.js';

// var PROBE_TIP_OFFSET = new Vector3( 0.00045, 0, 0 );
const PROBE_TIP_OFFSET = new Vector3( 0.00018, 0.00025, 0 );

class VoltmeterShapeCreator {
  /**
   * @param {Voltmeter} voltmeter
   * @param {YawPitchModelViewTransform3} modelViewTransform
   */
  constructor( voltmeter, modelViewTransform ) {

    // @private {Voltmeter}
    this.voltmeter = voltmeter;

    // @private {YawPitchModelViewTransform3}
    this.modelViewTransform = modelViewTransform;
  }

  /**
   * Gets the shape of the positive probe's tip in the world coordinate frame.
   * @public
   *
   * @returns {Shape}
   */
  getPositiveProbeTipShape() {
    const origin = this.voltmeter.positiveProbePositionProperty.value.plus( PROBE_TIP_OFFSET );
    return this.getProbeTipShape( origin, -this.modelViewTransform.yaw );
  }

  /**
   * Gets the shape of the negative probe's tip in the world coordinate frame.
   * @public
   *
   * @returns {Shape}
   */
  getNegativeProbeTipShape() {
    const origin = this.voltmeter.negativeProbePositionProperty.value.plus( PROBE_TIP_OFFSET );
    return this.getProbeTipShape( origin, -this.modelViewTransform.yaw );
  }

  /**
   * Get the shape of a probe tip relative to some specified origin.
   * @public
   *
   * @param {Vector2|Vector3} origin
   * @param {number} theta - rotation of modelViewTransform for 3D perspective
   * @returns {Shape}
   */
  getProbeTipShape( origin, theta ) {
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
}

capacitorLabBasics.register( 'VoltmeterShapeCreator', VoltmeterShapeCreator );

export default VoltmeterShapeCreator;
