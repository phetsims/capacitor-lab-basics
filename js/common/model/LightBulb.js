// Copyright 2015, University of Colorado Boulder

/**
 * Model of a lightBulb, used in the Capacitor Lab: Basics sim. In order for the current to decay at a rate slow
 * enough for visibility, the internal resistance of the light bulb must be extremely large.
 *
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LightBulbShapeCreator = require( 'CAPACITOR_LAB_BASICS/common/model/shapes/LightBulbShapeCreator' );
  var Vector3 = require( 'DOT/Vector3' );

  // constants
  var BULB_BASE_SIZE = new Dimension2( 0.0050, 0.0035 );

  /**
   * Constructor for the light bulb.
   *
   * @param {Vector3} location
   * @param {CLModelViewTransform3D} modelViewTransform
   * @constructor
   */
  function LightBulb( location, modelViewTransform ) {

    // @public (read-only)
    this.location = location;
    this.resistance = CLBConstants.LIGHT_BULB_RESISTANCE;
    this.shapeCreator = new LightBulbShapeCreator( this, modelViewTransform );
  }

  capacitorLabBasics.register( 'LightBulb', LightBulb );

  return inherit( Object, LightBulb, {

    /**
     * Does the base shape intersect the shape of the bulb base?
     * REVIEW: visibility doc
     *
     * @param  {Vector3} point
     * @returns {boolean}
     */
    intersectsBulbBase: function( shape ) {
      return this.shapeCreator.createBaseShape().bounds.intersectsBounds( shape.bounds );
    },

    /**
     * The top connection point is the top center of light bulb, which is the center of the
     * REVIEW: visibility doc
     * REVIEW: returns?
     */
    getTopConnectionPoint: function() {
      //REVIEW: return this.location.copy(); // if you need a defensive copy
      return new Vector3( this.location.x, this.location.y, this.location.z );
    },

    //REVIEW: doc
    getBottomConnectionPoint: function() {
      return new Vector3( this.location.x - BULB_BASE_SIZE.width * 3 / 5, this.location.y, this.location.z );
    },

    /**
     * Calculate the current flowing through this lightbulb using Ohm's Law, V = I R
     * REVIEW: visibility doc
     *
     * @param {number} voltage voltage accrose the resistor
     * @returns {number}
     */
    getCurrent: function( voltage ) {
      return voltage / this.resistance;
    },

    /**
     * Get the size the base in model coordinates
     * REVIEW: visibility doc
     *
     * @returns {type}  description REVIEW: doc?
     */
    getBaseSize: function() {
      //REVIEW: this constant is already exposed as LightBulb.BULB_BASE_SIZE, can we just use that?
      return BULB_BASE_SIZE;
    },


    /**
     * Get the width of the top of the conductor which is part of the light bulb base
     * REVIEW: visibility doc
     *
     * @returns {number}
     */
    getTopBaseConductorWidth: function() {
      //REVIEW: This is constant, can we expose this as LightBulb.TOP_BASE_CONDUCTOR_WIDTH?
      return BULB_BASE_SIZE.width * 3 / 7;
    },

    /**
     * Get the width of the top of the insulator which is part of the light bulb base
     * REVIEW: visibility doc
     *
     * REVIEW: This functions seems to be unused, recommend removal!
     *
     * @returns {number}
     */
    getTopBaseInsulatorWidth: function() {
      return BULB_BASE_SIZE.width * 3 / 7;
    },

    /**
     * Get the width of the bottom of the insulator which is part of the light bulb base
     * REVIEW: visibility doc
     *
     * REVIEW: This functions seems to be unused, recommend removal!
     *
     * @returns {number}
     */
    getBottomBaseInsulatorWidth: function() {
      return BULB_BASE_SIZE.width * 5 / 7;
    },

    /**
     * Get the width of the bottom of the conductor which is part of the light bulb base
     * REVIEW: visibility doc
     *
     * REVIEW: This functions seems to be unused, recommend removal!
     *
     * @returns {number}
     */
    getBottomBaseConductorHeight: function() {
      return BULB_BASE_SIZE.height / 3;
    }
  }, {

    // Get the size of the bulb base.
    BULB_BASE_SIZE: BULB_BASE_SIZE

  } );
} );
