// Copyright 2015, University of Colorado Boulder

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
  var BatteryShapeCreator = require( 'CAPACITOR_LAB_BASICS/common/model/shapes/BatteryShapeCreator' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  // phet-io modules
  var TNumber = require( 'ifphetio!PHET_IO/types/TNumber' );
  var TString = require( 'ifphetio!PHET_IO/types/TString' );

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
  var POSITIVE_TERMINAL_Y_OFFSET = -( BODY_SIZE.height / 2 ) - 0.0002;

  /*
   * Negative terminal is part of the image file.
   * The terminal is an ellipse, whose dimension were determined by visual inspection.
   * The origin of the terminal is at the center of the ellipse.
   */
  var NEGATIVE_TERMINAL_ELLIPSE_SIZE = new Dimension2( 0.0035, 0.0009 ); // dimension of the ellipse that defines the negative terminal
  var NEGATIVE_TERMINAL_Y_OFFSET = -( BODY_SIZE.height / 2 ) + 0.0005; // center of the negative terminal, when it's the top terminal

  /**
   * Constructor for a Battery.
   *
   * @param {Vector3} location
   * @param {number} voltage
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Tandem} [tandem]
   * @constructor
   */
  function Battery( location, voltage, modelViewTransform, tandem ) {

    // @public
    PropertySet.call( this, {
      voltage: voltage,
      polarity: CLBConstants.POLARITY.POSITIVE
    }, {

      // Sometimes Battery is used as part of a temporary circuit for a calculation.
      // In those cases, a null tandem is passed to the constructor. So allow either
      // tandem or null here.
      tandemSet: tandem ? {
        voltage: tandem.createTandem( 'voltageProperty' ),
        polarity: tandem.createTandem( 'polarityProperty' )
      } : {},
      typeSet: {
        voltage: TNumber( 'volts' ),
        polarity: TString
      }
    } );

    var thisBattery = this;

    this.location = location; // @public (read-only)
    this.shapeCreator = new BatteryShapeCreator( this, modelViewTransform ); // @private

    this.voltageProperty.link( function() {
      thisBattery.polarity = thisBattery.getPolarity( thisBattery.voltage );
    } );

  }

  capacitorLabBasics.register( 'Battery', Battery );

  return inherit( PropertySet, Battery, {

    /**
     * Convenience function to get the polarity from the object literal based on the voltage.
     *
     * @param {number} voltage
     * @returns {string}
     * @private
     */
    getPolarity: function( voltage ) {
      return ( voltage >= 0 ) ? CLBConstants.POLARITY.POSITIVE : CLBConstants.POLARITY.NEGATIVE;
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

    /**
     * Gets the offset of the top terminal from the battery's origin, in model coordinates (meters).
     * This offset depends on the polarity.
     */
    getTopTerminalYOffset: function() {
      if ( this.polarity === CLBConstants.POLARITY.POSITIVE ) {
        return POSITIVE_TERMINAL_Y_OFFSET;
      } else {
        return NEGATIVE_TERMINAL_Y_OFFSET;
      }
    },

    getPositiveTerminalEllipseSize: function() {
      return POSITIVE_TERMINAL_ELLIPSE_SIZE;
    },

    getNegativeTerminalEllipseSize: function() {
      return NEGATIVE_TERMINAL_ELLIPSE_SIZE;
    },

    getPositiveTerminalCylinderHeight: function() {
      return POSITIVE_TERMINAL_CYLINDER_HEIGHT;
    }
  } );
} );

