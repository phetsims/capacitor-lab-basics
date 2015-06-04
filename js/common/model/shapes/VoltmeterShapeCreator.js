// Copyright 2002-2015, University of Colorado Boulder

/**
 * Creates 2D projections of shapes that are related to the 3D voltmeter model.
 * Shapes are in the global view coordinate frame.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'DOT/Rectangle' );
  var Matrix3 = require( 'DOT/Matrix3' );

  /**
   * Constructor for a VoltmeterShapeCreator.
   *
   * @param {Voltmeter} voltmeter
   * @param {CLModelViewTransform} modelViewTransform
   * @constructor
   */
  function VoltmeterShapeCreator( voltmeter, modelViewTransform ) {

    this.voltmeter = voltmeter;
    this.modelViewTransform = modelViewTransform;

  }

  return inherit( Object, VoltmeterShapeCreator, {

    /**
     * Gets the shape of the positive probe's tip in the world coordinate frame.
     *
     * @return {Shape}
     */
    getPositiveProbeTipShape: function() {
      return this.getProbeTipShape( this.voltmeter.positiveProbeLocation, -this.modelViewTransform.MVT_YAW );
    },

    /**
     * Gets the shape of the negative probe's tip in the world coordinate frame.
     *
     * @return {Shape}
     */
    getNegativeProbeTipShape: function() {
      return this.getProbeTipShape( this.voltmeter.negativeProbeLocation, -this.modelViewTransform.MVT_YAW );
    },

    // Gets the shape of a probe tip relative to some specified origin.
    getProbeTipShape: function( origin, theta ) {
      var width = this.voltmeter.getProbeTipSizeReference().width;
      var height = this.voltmeter.getProbeTopSizeReference().height;
      var x = origin.x - ( width / 2 );
      var y = origin.y;
      var r = new Rectangle( x, y, width, height );
      var t = Matrix3.rotationAround( theta, origin.x, origin.y );
      var s = r.transformed( t );
      return this.modelViewTransform.modelToViewShape( s );

  }
  } );
} );