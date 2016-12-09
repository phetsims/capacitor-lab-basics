// Copyright 2016, University of Colorado Boulder

/**
 * Model of a lightBulb, used in the Capacitor Lab: Basics sim. In order for the current to decay at a rate slow
 * enough for visibility, the internal resistance of the light bulb must be extremely large.
 *
 * @author Jesse Greenberg
 * @author Andrew Adare
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

    // Size of the bulb base.
    // Type: Dimension2
    // @public (read-only)
    this.bulbBaseSize = BULB_BASE_SIZE;

    // Width of the top of the conductor which is part of the light bulb base
    // Type: number
    // @public (read-only)
    this.topBaseConductorWidth = BULB_BASE_SIZE.width * 3 / 7;

    this.shapeCreator = new LightBulbShapeCreator( this, modelViewTransform );
  }

  capacitorLabBasics.register( 'LightBulb', LightBulb );

  return inherit( Object, LightBulb, {

    /**
     * Does the base shape intersect the shape of the bulb base?
     * @public
     *
     * @param  {Vector3} point
     * @returns {boolean}
     */
    intersectsBulbBase: function( shape ) {
      return this.shapeCreator.createBaseShape().bounds.intersectsBounds( shape.bounds );
    },

    /**
     * The top connection point is the top center of light bulb
     * @public
     * @returns {Vector3}
     */
    getTopConnectionPoint: function() {
      return this.location.copy();
    },

    /**
     * The bottom tip of the light bulb base is its leftmost point, since the bulb
     * is rotated 90 degrees clockwise from vertical.
     * @public
     * @returns {Vector3}
     */
    getBottomConnectionPoint: function() {
      return new Vector3( this.location.x - BULB_BASE_SIZE.width * 3 / 5, this.location.y, this.location.z );
    },

    /**
     * Calculate the current flowing through this lightbulb using Ohm's Law, V = I R
     * @public
     *
     * @param {number} voltage voltage accrose the resistor
     * @returns {number}
     */
    getCurrent: function( voltage ) {
      return voltage / this.resistance;
    }
  } );
} );
