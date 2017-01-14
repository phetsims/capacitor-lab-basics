// Copyright 2016, University of Colorado Boulder

/**
 * Creates 2D projections of shapes that are related to the 3D capacitor model. All of these shapes are 2D projections
 * of pseudo-3D boxes. These shapes are subtracted using constructive area geometry to account for occlusion that
 * occurs in our pseudo-3D view. Shapes are in the global view coordinate frame.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg
 * @author Andrew Adare
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var BoxShapeCreator = require( 'CAPACITOR_LAB_BASICS/common/model/shapes/BoxShapeCreator' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  /**
   * Constructor for a CapacitorShapeCreator.
   *
   * @param {Capacitor} capacitor
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @constructor
   */
  function CapacitorShapeCreator( capacitor, modelViewTransform ) {
    // @private
    this.capacitor = capacitor;
    this.boxShapeCreator = new BoxShapeCreator( modelViewTransform );
  }

  capacitorLabBasics.register( 'CapacitorShapeCreator', CapacitorShapeCreator );

  return inherit( Object, CapacitorShapeCreator, {

    //----------------------------------------------------------------------------------------
    // unoccluded shapes
    //----------------------------------------------------------------------------------------
    /**
     * Top plate, unoccluded.
     * @public
     *
     * @returns {createBoxShape()}
     */
    createTopPlateShape: function() {
      var x = this.capacitor.location.x;
      var y = this.capacitor.getTopConnectionPoint().y;
      var z = this.capacitor.location.z;
      var size = this.capacitor.plateSizeProperty.value;

      return this.createBoxShape( x, y, z, size );
    },

    /**
     * Bottom plate, unoccluded.
     * @public
     *
     * @returns {createBoxShape()}
     */
    createBottomPlateShape: function() {
      var x = this.capacitor.location.x;
      var y = this.capacitor.location.y;
      var z = this.capacitor.location.z;
      var d = this.capacitor.plateSeparationProperty.value;
      var size = this.capacitor.plateSizeProperty.value;

      return this.createBoxShape( x, y + ( d / 2 ), z, size );
    },

    //----------------------------------------------------------------------------------------
    // general shapes
    //----------------------------------------------------------------------------------------
    /**
     * Create an array of planar shapes that form a box.
     * @public
     * @param x
     * @param y
     * @param z
     * @param size
     *
     * @returns {BoxShapeCreator.createBoxShape()}
     */
    createBoxShape: function( x, y, z, size ) {
      return this.boxShapeCreator.createBoxShape( x, y, z, size.width, size.height, size.depth );
    }
  } );
} );
