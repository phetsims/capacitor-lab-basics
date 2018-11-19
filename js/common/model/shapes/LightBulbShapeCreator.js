// Copyright 2016-2018, University of Colorado Boulder

/**
 * Creates 2D projections of shapes that are related to the light bulb.
 * Shapes are in the global view coordinate frame.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CLBModelViewTransform3D = require( 'CAPACITOR_LAB_BASICS/common/model/CLBModelViewTransform3D' );
  var inherit = require( 'PHET_CORE/inherit' );
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
    createTopBaseShape: function() {
      var location = this.lightBulb.location;
      var shape = new Shape().rect( location.x - 0.0013, location.y - 0.00175, 0.00225, 0.0035 );
      return this.modelViewTransform.modelToViewShape( shape );
    },

    /**
     * Gets the shape of the light bulb base in the world coordinate frame.  Origin at the top center.
     * The base shape is composed of a rectangle, half circle, and custom shape to mimic the image representing
     * the base.
     * @public
     *
     * @returns {Shape}
     */
    createBottomBaseShape: function() {
      var location = this.lightBulb.location;
      var smallLeft = location.x - 0.00343;
      var smallRight = smallLeft + 0.00063;
      var smallTop = location.y - 0.00113;
      var smallBottom = smallTop + 0.00228;
      var shape = new Shape().moveTo( smallLeft, ( smallTop + smallBottom ) / 2 )
                             .cubicCurveTo( smallLeft, smallTop * 0.8 + smallBottom * 0.2,
                                            smallLeft * 0.6 + smallRight * 0.4, smallTop * 0.85 + smallBottom * 0.15,
                                            smallRight, smallTop )
                             .lineTo( smallRight, smallBottom )
                             .cubicCurveTo( smallLeft * 0.6 + smallRight * 0.4, smallBottom * 0.85 + smallTop * 0.15,
                                            smallLeft, smallBottom * 0.8 + smallTop * 0.2,
                                            smallLeft, ( smallTop + smallBottom ) / 2 )
                             .close();
      return this.modelViewTransform.modelToViewShape( shape );
    }
  } );

} );
