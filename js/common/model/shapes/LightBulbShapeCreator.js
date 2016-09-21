// Copyright 2015, University of Colorado Boulder

/**
 * Creates 2D projections of shapes that are related to the light bulb. Shapes are in the global view coordinate
 * frame.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Shape = require( 'KITE/Shape' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var Vector2 = require( 'DOT/Vector2' );
  // var Matrix3 = require( 'DOT/Matrix3' );

  /**
   * Constructor.
   *
   * @param {LightBulb} lightBulb
   * @param {CLModelViewTransform3D} modelViewTransform
   */
  function LightBulbShapeCreator( lightBulb, modelViewTransform ) {
    this.lightBulb = lightBulb; // @public
    this.modelViewTransform = modelViewTransform; // @private
  }

  capacitorLabBasics.register( 'LightBulbShapeCreator', LightBulbShapeCreator );

  return inherit( Object, LightBulbShapeCreator, {


    /**
     * Gets the shape of the light bulb base in the world coordinate frame.  Origin at the top center.
     * The base shape is composed of a rectangle, half circle, and custom shape to mimic the image representing
     * the base.
     *
     * @return {Shape}
     */
    createBaseShape: function() {

      // origin is at (0, 0) - this is the 'top' of the bulb base
      var origin = new Vector2( 0, 0 );

      // shape of the bulb base, initially at the origin
      var baseShape = new Shape();
      baseShape.moveToPoint( origin );

      var height = this.lightBulb.getBaseSize().height;
      var topConductorWidth = this.lightBulb.getTopBaseConductorWidth();
      var bottomInsulatorWidth = this.lightBulb.getBottomBaseInsulatorWidth();
      var bottomConductorHeight = this.lightBulb.getBottomBaseConductorHeight();

      // parameters for the arc that defines the bottom of the conductor shape
      var startAngle = 1.5 * Math.PI;
      var endAngle = Math.PI / 2;
      var counterClockwise = true;

      // draw the entire shape of the light bulb base
      baseShape.lineTo( 0, -height / 2 );
      baseShape.lineTo( -topConductorWidth, -height / 2 );
      baseShape.lineTo( -bottomInsulatorWidth, -bottomConductorHeight );
      baseShape.arc( -bottomInsulatorWidth, 0, bottomConductorHeight, startAngle, endAngle, counterClockwise );
      baseShape.lineTo( -topConductorWidth, height / 2 );
      baseShape.lineTo( 0, height / 2 );
      baseShape.close();

      // transform to the location of the bulb
      // baseShape = baseShape.transformed( new Matrix3.translation(
      //   this.lightBulb.location.x + topConductorWidth / 2,
      //   this.lightBulb.location.y
      // ) );

      return this.modelViewTransform.modelToViewShape( baseShape );

    }

  } );

} );
