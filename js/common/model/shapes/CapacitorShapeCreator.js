// Copyright 2002-2015, University of Colorado Boulder

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

  /**
   * Constructor for a CapacitorShapeCreator.
   *
   * @param {Capacitor} capacitor
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function CapacitorShapeCreator( capacitor, modelViewTransform ) {
    this.capacitor = capacitor;
    this.boxShapeCreator = new BoxShapeCreator( modelViewTransform );
  }


  return inherit( Object, CapacitorShapeCreator, {

    //----------------------------------------------------------------------------------------
    // unoccluded shapes
    //----------------------------------------------------------------------------------------
    /**
     * Top plate, unoccluded.
     *
     * @return {Shape}
     */
    createTopPlateShape: function() {
      return this.createBoxShape( this.capacitor.location.x, this.capacitor.getTopPlateCenter().y, this.capacitor.location.z, this.capacitor.plateSize );
    },

    /**
     * Bottom plate, unoccluded.
     *
     * @return {Shape}
     */
    createBottomPlateShape: function() {
      return this.createBoxShape( this.capacitor.location.x, this.capacitor.location.y + ( this.capacitor.plateSeparation / 2 ), this.capacitor.location.z, this.capacitor.plateSize );
    },

    /**
     * Volume between the capacitor plates.
     * TODO: I assume that this is specific to the dielectric portion.  Skipping for noow.
     */
    //createBetweenPlatesShape: function() {
    //  return createBoxShape( capacitor.getX(), capacitor.getY() - ( capacitor.getPlateSeparation() / 2 ), capacitor.getZ(), capacitor.getDielectricSize() );
    //}

    /**
     * Air that is between the capacitor plates.
     *
     * @return {Shape}
     */
    createAirBetweenPlateShape: function() {
      if ( this.capacitor.dielectricOffset === 0 ) {
        return this.createEmptyShape();
      }
      else {
        // Dielectrics are not being ported yet. we should never reach this!
        //return ShapeUtils.subtract( createBetweenPlatesShape(), createDielectricBetweenPlatesShape() );
      }
    },

    //----------------------------------------------------------------------------------------
    // occluded shapes
    // TODO: Occlusion is done with constructive area geometry.  See if we can find another way to do this without that
    //  option.
    //  It seems that the best way to do this for capacitors is to handle entirely with layering.  The top capacitor
    //  will always be above the bottom capacitor.
    //----------------------------------------------------------------------------------------
    /**
     * Visible portion of the top plate. Nothing occludes the top plate.
     *
     * @return
     */
    createTopPlateShapeOccluded: function() {
      return this.createTopPlateShape();
    },

    /**
     * Visible portion of the bottom plate. May be partially occluded by the top plate.
     *
     * @return {Shape}
     */
    createBottomPlateShapeOccluded: function() {
      // TODO: This will need an alternative solution without CAG
      //return ShapeUtils.subtract( createBottomPlateShape(), createTopPlateShape() );
    },

    /**
     * Visible portion of the dielectric between the plates. May be partially occluded by the top plate.
     *
     * @return
     */
    createDielectricBetweenPlatesShapeOccluded: function() {
      console.log( 'Dielectrics have not been ported yet!' );
      //return ShapeUtils.subtract( createDielectricBetweenPlatesShape(), createTopPlateShape() );
    },

    /**
     * Visible portion of air between the plates. May be partially occluded by the top plate.
     *
     * @return {shape}
     */
    createAirBetweenPlatesShapeOccluded: function() {
      // TODO: Without dielectrics, createAirBetweenPlateShape will produce nothing.  This function should never be called.
      console.log( 'Dielectrics have not been ported yet, this function should not be in use.' );
      //return ShapeUtils.subtract( createAirBetweenPlateShape(), createTopPlateShape() );
    },

    //----------------------------------------------------------------------------------------
    // general shapes
    //----------------------------------------------------------------------------------------

    // A box, relative to a specific origin.
    createBoxShape: function( x, y, z, size ) {
      return this.boxShapeCreator.createBoxShape( x, y, z, size.width, size.height, size.deptb );
    },

    // Encapsulation of empty shape.
    createEmptyShape: function() {
      return new Rectangle( 0, 0, 0, 0 );
    }

  } );
} );