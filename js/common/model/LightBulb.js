// Copyright 2015-2021, University of Colorado Boulder

/**
 * Model of a lightBulb, used in the Capacitor Lab: Basics sim. In order for the current to decay at a rate slow
 * enough for visibility, the internal resistance of the light bulb must be extremely large.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector3 from '../../../../dot/js/Vector3.js';
import capacitorLabBasics from '../../capacitorLabBasics.js';
import CLBConstants from '../CLBConstants.js';
import LightBulbShapeCreator from './shapes/LightBulbShapeCreator.js';

// constants
const BULB_BASE_SIZE = new Dimension2( 0.0050, 0.0035 );

class LightBulb {
  /**
   * @param {Vector3} position
   * @param {CLModelViewTransform3D} modelViewTransform
   */
  constructor( position, modelViewTransform ) {

    // @public {Vector3} (read-only)
    this.position = position;

    // @public {number} (read-only)
    this.resistance = CLBConstants.LIGHT_BULB_RESISTANCE;

    // @public {LightBulbShapeCreator}
    this.shapeCreator = new LightBulbShapeCreator( this, modelViewTransform );
  }


  /**
   * Does the base shape intersect the top shape of the bulb base?
   * @public
   *
   * @param {Shape} shape
   * @returns {boolean}
   */
  intersectsBulbTopBase( shape ) {
    const bulbBaseShape = this.shapeCreator.createTopBaseShape();
    return shape.bounds.intersectsBounds( bulbBaseShape.bounds ) &&
           shape.shapeIntersection( bulbBaseShape ).getNonoverlappingArea() > 0;
  }

  /**
   * Does the base shape intersect the bottom shape of the bulb base?
   * @public
   *
   * @param {Shape} shape
   * @returns {boolean}
   */
  intersectsBulbBottomBase( shape ) {
    const bulbBaseShape = this.shapeCreator.createBottomBaseShape();
    return shape.bounds.intersectsBounds( bulbBaseShape.bounds ) &&
           shape.shapeIntersection( bulbBaseShape ).getNonoverlappingArea() > 0;
  }

  /**
   * The top connection point is the top center of light bulb
   * @public
   *
   * @returns {Vector3}
   */
  getTopConnectionPoint() {
    return this.position.copy();
  }

  /**
   * The bottom tip of the light bulb base is its leftmost point, since the bulb
   * is rotated 90 degrees clockwise from vertical.
   * @public
   *
   * @returns {Vector3}
   */
  getBottomConnectionPoint() {
    return new Vector3( this.position.x - BULB_BASE_SIZE.width * 3 / 5, this.position.y, this.position.z );
  }

  /**
   * Calculate the current flowing through this lightbulb using Ohm's Law, V = I R
   * @public
   *
   * @param {number} voltage - voltage across the resistor
   * @returns {number}
   */
  getCurrent( voltage ) {
    return voltage / this.resistance;
  }
}

capacitorLabBasics.register( 'LightBulb', LightBulb );

export default LightBulb;
