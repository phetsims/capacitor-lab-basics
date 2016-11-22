// Copyright 2015, University of Colorado Boulder

/**
 * Creates 2D projections of shapes that are related to the 3D capacitor model. All of these shapes are 2D projections
 * of pseudo-3D boxes. These shapes are subtracted using constructive area geometry to account for occlusion that
 * occurs in our pseudo-3D view. Shapes are in the global view coordinate frame.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var BoxShapeCreator = require( 'CAPACITOR_LAB_BASICS/common/model/shapes/BoxShapeCreator' );
  var Rectangle = require( 'DOT/Rectangle' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  /**
   * Constructor for a CapacitorShapeCreator.
   *
   * @param {Capacitor} capacitor
   * @param {ModelViewTransform2} modelViewTransform
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
     *
     * @return {Shape[]}
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
     *
     * @return {Shape[]}
     */
    createBottomPlateShape: function() {
      var x = this.capacitor.location.x;
      var y = this.capacitor.location.y;
      var z = this.capacitor.location.z;
      var d = this.capacitor.plateSeparationProperty.value;
      var size = this.capacitor.plateSizeProperty.value;

      return this.createBoxShape( x, y + ( d / 2 ), z, size );
    },

    /**
     * Air that is between the capacitor plates.
     *
     * @return {Shape}
     */
    createAirBetweenPlateShape: function() {
      if ( this.capacitor.dielectricOffsetProperty.value === 0 ) {
        return this.createEmptyShape();
      }
      else {
        // Dielectrics are not being ported yet. we should never reach this!
        assert && assert( 'Dielectrics have not yet been ported, dielectric offset should always be zero.' );
      }
    },

    /**
     * Visible portion of the top plate. Nothing occludes the top plate.
     *
     * @return {Shape[]}
     */
    createTopPlateShapeOccluded: function() {
      return this.createTopPlateShape();
    },

    /**
     * Visible portion of the bottom plate. May be partially occluded by the top plate.
     *
     * @return {Shape[]}
     */
    createBottomPlateShapeOccluded: function() {
      return this.createBottomPlateShape();
    },

    /**
     * Visible portion of the dielectric between the plates. May be partially occluded by the top plate.
     *
     * @return
     */
    createDielectricBetweenPlatesShapeOccluded: function() {
      console.error( 'Dielectrics have not been ported yet!' );
    },

    /**
     * Visible portion of air between the plates. May be partially occluded by the top plate.
     *
     * @return {shape}
     */
    createAirBetweenPlatesShapeOccluded: function() {
      // NOTE: Without dielectrics, createAirBetweenPlateShape will produce nothing.
      // This function should never be called.
      console.error( 'Dielectrics have not been ported yet, this function should not be in use.' );
    },

    //----------------------------------------------------------------------------------------
    // general shapes
    //----------------------------------------------------------------------------------------
    /**
     * Create an array of planar shapes that form a box.
     * @param x
     * @param y
     * @param z
     * @param size
     *
     * @returns {Shape[]}
     */
    createBoxShape: function( x, y, z, size ) {
      return this.boxShapeCreator.createBoxShape( x, y, z, size.width, size.height, size.depth );
    },

    // Encapsulation of empty shape.
    createEmptyShape: function() {
      return new Rectangle( 0, 0, 0, 0 );
    }

  } );
} );
