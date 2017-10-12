// Copyright 2016, University of Colorado Boulder

/**
 * Creates 2D projections of shapes that are related to the light bulb.
 * Shapes are in the global view coordinate frame.
 *
 * @author Jesse Greenberg
 * @author Andrew Adare
 */
define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CLBModelViewTransform3D = require( 'CAPACITOR_LAB_BASICS/common/model/CLBModelViewTransform3D' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Shape = require( 'KITE/Shape' );

  /**
   * @constructor
   *
   * @param {LightBulb} lightBulb
   * @param {CLModelViewTransform3D} modelViewTransform
   */
  function LightBulbShapeCreator( lightBulb, modelViewTransform ) {
    assert && assert( modelViewTransform instanceof CLBModelViewTransform3D );

    // @public {LightBulb} lightBulb
    this.lightBulb = lightBulb;

    // @private {CLBModelViewTransform3D}
    this.modelViewTransform = modelViewTransform;
  }

  capacitorLabBasics.register( 'LightBulbShapeCreator', LightBulbShapeCreator );

  return inherit( Object, LightBulbShapeCreator, {

    /**
     * Gets the shape of the light bulb base in the world coordinate frame.  Origin at the top center.
     * The base shape is composed of a rectangle, half circle, and custom shape to mimic the image representing
     * the base.
     * @public
     *
     * @returns {Shape}
     */
    createBaseShape: function() {

      var height = this.lightBulb.bulbBaseSize.height;
      var topConductorWidth = this.lightBulb.topBaseConductorWidth;

      var baseShape = Shape.rect( -height / 2, -topConductorWidth / 2, 3 * topConductorWidth / 4, 3 * height / 4 );

      // transform to the location of the bulb
      baseShape = baseShape.transformed( new Matrix3.translation(
        this.lightBulb.location.x + topConductorWidth / 2,
        this.lightBulb.location.y
      ) );

      return this.modelViewTransform.modelToViewShape( baseShape );
    }
  } );

} );
