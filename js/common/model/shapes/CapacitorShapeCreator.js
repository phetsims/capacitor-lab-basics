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
   * @param {ModelViewTransform2} modelViewTransform REVIEW: nope, see below
   * @constructor
   */
  function CapacitorShapeCreator( capacitor, modelViewTransform ) {
    if ( assert ) {
      if ( modelViewTransform.constructor.name !== 'ModelViewTransform2' ) {
        console.log( 'REVIEW (CapacitorShapeCreator): Probably not a ModelViewTransform2: ' + modelViewTransform.constructor.name );
      }
    }
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
     * REVIEW: visibility doc
     *
     * @returns {Shape[]} REVIEW: createBoxShapes() instead?
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
     * REVIEW: visibility doc
     *
     * @returns {Shape[]} REVIEW: createBoxShapes() instead?
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
     * Visible portion of the top plate. Nothing occludes the top plate.
     * REVIEW: visibility doc
     *
     * @returns {Shape[]} REVIEW: createBoxShapes() instead?
     */
    createTopPlateShapeOccluded: function() {
      //REVIEW: one usage, no overrides. Just use createTopPlateShape() instead?
      return this.createTopPlateShape();
    },

    /**
     * Visible portion of the bottom plate. May be partially occluded by the top plate.
     * REVIEW: visibility doc
     *
     * @returns {Shape[]} REVIEW: createBoxShapes() instead?
     */
    createBottomPlateShapeOccluded: function() {
      //REVIEW: one usage, no overrides. Just use createTopPlateShape() instead?
      return this.createBottomPlateShape();
    },

    //----------------------------------------------------------------------------------------
    // general shapes
    //----------------------------------------------------------------------------------------
    /**
     * Create an array of planar shapes that form a box.
     * REVIEW: visibility doc
     * @param x
     * @param y
     * @param z
     * @param size
     *
     * @returns {Shape[]} REVIEW: createBoxShapes() instead? REVIEW: createBoxShapes() instead?
     */
    createBoxShape: function( x, y, z, size ) {
      return this.boxShapeCreator.createBoxShape( x, y, z, size.width, size.height, size.depth );
    },

    // Encapsulation of empty shape.
    createEmptyShape: function() {
      //REVIEW: that's not a Shape!
      return new Rectangle( 0, 0, 0, 0 );
    }

  } );
} );
