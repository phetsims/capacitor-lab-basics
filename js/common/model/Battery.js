// Copyright 2002-2015, University of Colorado Boulder

/**
 * Simple model of a DC battery.  Origin is at the geometric center of the battery's body.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var BatteryShapeCreator = require( 'CAPACITOR_LAB/common/model/shapes/BatteryShapeCreator' );
  var CLConstants = require( 'CAPACITOR_LAB/common/CLConstants' );

  // constants
  // size of the associated image file, determined by visual inspection
  var BODY_SIZE = new Dimension2( 0.0065, 0.01425 ); // dimensions of the rectangle that bounds the battery image

  /*
   * Positive terminal is part of the image file.
   * The terminal is a cylinder, whose dimensions were determined by visual inspection.
   * The origin of the terminal is at the center of the cylinder's top.
   */
  var POSITIVE_TERMINAL_ELLIPSE_SIZE = new Dimension2( 0.0025, 0.0005 );
  var POSITIVE_TERMINAL_CYLINDER_HEIGHT = 0.0009;
  var POSITIVE_TERMINAL_Y_OFFSET = -( BODY_SIZE.height / 2 ) + 0.000505;

  /*
   * Negative terminal is part of the image file.
   * The terminal is an ellipse, whose dimension were determined by visual inspection.
   * The origin of the terminal is at the center of the ellipse.
   */
  var NEGATIVE_TERMINAL_ELLIPSE_SIZE = new Dimension2( 0.0035, 0.0009 ); // dimension of the ellipse that defines the negative terminal
  var NEGATIVE_TERMINAL_Y_OFFSET = -( BODY_SIZE.height / 2 ) + 0.00105; // center of the negative terminal, when it's the top terminal

  // Object literal holding possible battery polarities.
  //var POLARITY = {
  //  POSITIVE: 'POSITIVE',
  //  NEGATIVE: 'NEGATIVE'
  //};

  /**
   * Constructor for a Battery.
   *
   * @param {Vector3} location
   * @param {number} voltage
   * @param {CLModelViewTransform3D} modelViewTransform
   * @constructor
   */
  function Battery( location, voltage, modelViewTransform ) {

    PropertySet.call( this, {
      voltage: voltage,
      polarity: CLConstants.POLARITY.POSITIVE
    } );

    var thisBattery = this;

    this.location = location; // immutable.
    this.shapeCreator = new BatteryShapeCreator( this, modelViewTransform );

    this.voltageProperty.link( function() {
      thisBattery.polarity = thisBattery.getPolarity( thisBattery.voltage );
    } );

  }

  return inherit( PropertySet, Battery, {

    /**
     * Reset function for this model element.
     */
    reset: function() {
      this.voltageProperty.reset();
    },

    /**
     * Convenience function to get the polarity from the object literal based on the voltage.
     *
     * @param {number} voltage
     * @returns {string}
     * @private
     */
    getPolarity: function( voltage ) {
      return ( voltage >= 0 ) ? CLConstants.POLARITY.POSITIVE : CLConstants.POLARITY.NEGATIVE;
    },

    /**
     * Return false if testing intersection with bottom terminal.  This terminal is not visible.
     *
     * @param {Shape} shape
     * @returns {boolean}
     */
    intersectsBottomTerminal: function( shape ) {
      return false; // bottom terminal is not visible
    },

    /**
     * Determine if the shape intersects with the top battery terminal.
     *
     * @param shape
     * @returns {boolean}
     */
    intersectsTopTerminal: function( shape ) {
      return shape.intersectsBounds( this.shapeCreator.createTopTerminalShape() );
    },

    /**
     * Gets the offset of the bottom terminal from the battery's origin, in model coordinates (meters).
     * We don't need to account for the polarity since the bottom terminal is never visible.
     */
    getBottomTerminalYOffset: function() {
      return BODY_SIZE.height / 2;
    },

    /*
     * Gets the offset of the top terminal from the battery's origin, in model coordinates (meters).
     * This offset depends on the polarity.
     */
    getTopTerminalYOffset: function() {
      if ( this.polarity === CLConstants.POLARITY.POSITIVE ) {
        return POSITIVE_TERMINAL_Y_OFFSET;
      }
      else {
        return NEGATIVE_TERMINAL_Y_OFFSET;
      }
    },

    // TODO: remove the following if possible.  Static functions will not work because these values are
    // required in BatteryShapeCreator, and battery is already dependent on this.
    getPositiveTerminalEllipseSize: function() {
      return  POSITIVE_TERMINAL_ELLIPSE_SIZE;
    },

    getNegativeTerminalEllipseSize: function() {
      return NEGATIVE_TERMINAL_ELLIPSE_SIZE;
    },

    getPositiveTerminalCylinderHeight: function() {
      return NEGATIVE_TERMINAL_ELLIPSE_SIZE;
    }

  }, {

    // Static values for public access.
    BODY_SIZE: BODY_SIZE,
    POSITIVE_TERMINAL_CYLINDER_HEIGHT: POSITIVE_TERMINAL_CYLINDER_HEIGHT,
    POSITIVE_TERMINAL_ELLIPSE_SIZE: POSITIVE_TERMINAL_ELLIPSE_SIZE,
    NEGATIVE_TERMINAL_ELLIPSE_SIZE: NEGATIVE_TERMINAL_ELLIPSE_SIZE

  } );

} );