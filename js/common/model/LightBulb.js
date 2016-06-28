// Copyright 2015, University of Colorado Boulder

/**
 * Model of a lightBulb, used in the Capacitor Lab: Basics sim. In order for the current to decay at a rate slow enough
 * for visibility, the internal resistance of the light bulb must be extremely large.
 *
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector3 = require( 'DOT/Vector3' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var LightBulbShapeCreator = require( 'CAPACITOR_LAB_BASICS/common/model/shapes/LightBulbShapeCreator' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  // constants
  var BULB_BASE_SIZE = new Dimension2( 0.0050, 0.0035 );

  /**
   * Constructor for the light bulb.
   *
   * @param {Vector3} location
   * @param {number} resistance - internal resistance of the bulb
   * @param {CLModelViewTransform3D} modelViewTransform
   * @constructor
   */
  function LightBulb( location, resistance, modelViewTransform ) {

    // @public (read-only)
    this.location = location;
    this.resistance = resistance;
    this.shapeCreator = new LightBulbShapeCreator( this, modelViewTransform );

  }

  capacitorLabBasics.register( 'LightBulb', LightBulb );

  return inherit( Object, LightBulb, {

    /**
     * Does the base shape intersect the shape of the bulb base?
     *
     * @param  {Vector3} point
     * @return {boolean}
     */
    intersectsBulbBase: function( shape ) {
      return this.shapeCreator.createBaseShape().bounds.intersectsBounds( shape.bounds );
    },

    /**
     * The top connection point is the top center of light bulb, which is the center of the
     */
    getTopConnectionPoint: function() {
      return new Vector3( this.location.x, this.location.y, this.location.z );
    },

    getBottomConnectionPoint: function() {
      return new Vector3( this.location.x - BULB_BASE_SIZE.width * 3 / 5, this.location.y, this.location.z );
    },

    /**
     * Calculate the current flowing through this lightbulb using Ohm's Law, V = I R
     *
     * @param {number} voltage voltage accrose the resistor
     * @return {number}
     */
    getCurrent: function( voltage ) {
      return voltage / this.resistance;
    },

    /**
     * Get the size the base in model coordinates
     *
     * @return {type}  description
     */
    getBaseSize: function() {
      return BULB_BASE_SIZE;
    },


    /**
     * Get the width of the top of the conductor which is part of the light bulb base
     *
     * @return {number}
     */
    getTopBaseConductorWidth: function() {
      return BULB_BASE_SIZE.width * 3 / 7;
    },

    /**
     * Get the width of the top of the insulator which is part of the light bulb base
     *
     * @return {number}
     */
    getTopBaseInsulatorWidth: function() {
      return BULB_BASE_SIZE.width * 3 / 7;
    },

    /**
     * Get the width of the bottom of the insulator which is part of the light bulb base
     *
     * @return {number}
     */
    getBottomBaseInsulatorWidth: function() {
      return BULB_BASE_SIZE.width * 5 / 7;
    },

    /**
     * Get the width of the bottom of the conductor which is part of the light bulb base
     *
     * @return {number}
     */
    getBottomBaseConductorHeight: function() {
      return BULB_BASE_SIZE.height / 3;
    }
  }, {

    // Get the size of the bulb base.
    BULB_BASE_SIZE: BULB_BASE_SIZE

  } );
} );
