// Copyright 2015, University of Colorado Boulder

/**
 * Creates 2D projections of shapes that are related to the 3D voltmeter model.
 * Shapes are in the global view coordinate frame.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Shape = require( 'KITE/Shape' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var Vector3 = require( 'DOT/Vector3' );

  var PROBE_TIP_OFFSET = new Vector3( 0.0003, 0, 0 );

  /**
   * Constructor for a VoltmeterShapeCreator.
   *
   * @param {Voltmeter} voltmeter
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @constructor
   */
  function VoltmeterShapeCreator( voltmeter, modelViewTransform ) {

    // @private
    this.voltmeter = voltmeter;
    this.modelViewTransform = modelViewTransform;
  }

  capacitorLabBasics.register( 'VoltmeterShapeCreator', VoltmeterShapeCreator );

  return inherit( Object, VoltmeterShapeCreator, {

    /**
     * Gets the shape of the positive probe's tip in the world coordinate frame.
     * REVIEW: visibility doc
     *
     * @returns {Shape}
     */
    getPositiveProbeTipShape: function() {
      var origin = this.voltmeter.positiveProbeLocationProperty.value.plus( PROBE_TIP_OFFSET );
      return this.getProbeTipShape( origin, -this.modelViewTransform.yaw );
    },

    /**
     * Gets the shape of the negative probe's tip in the world coordinate frame.
     * REVIEW: visibility doc
     *
     * @returns {Shape}
     */
    getNegativeProbeTipShape: function() {
      var origin = this.voltmeter.negativeProbeLocationProperty.value.plus( PROBE_TIP_OFFSET );
      return this.getProbeTipShape( origin, -this.modelViewTransform.yaw );
    },

    /**
     * Get the shape of a probe tip relative to some specified origin.
     * REVIEW: visibility doc
     *
     * @param {Vector3} origin
     * @param {number} theta - rotation of modelViewTransform for 3D perspective
     * @returns {Shape}
     */
    getProbeTipShape: function( origin, theta ) {
      //REVIEW Just get the size once?
      var width = this.voltmeter.getProbeTipSizeReference().width;
      var height = this.voltmeter.getProbeTipSizeReference().height;
      var x = origin.x;
      var y = origin.y;
      var rec = Shape.rectangle( x, y, width, height );
      var t = Matrix3.rotationAround( theta, x, y );
      return this.modelViewTransform.modelToViewShape( rec.transformed( t ) );
    }
  } );
} );