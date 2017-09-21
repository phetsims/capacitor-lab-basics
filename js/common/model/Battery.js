// Copyright 2015-2017, University of Colorado Boulder

/**
 * Simple model of a DC battery.  Origin is at the geometric center of the battery's body.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg
 * @author Andrew Adare
 */

define( function( require ) {
  'use strict';

  // modules
  var BatteryShapeCreator = require( 'CAPACITOR_LAB_BASICS/common/model/shapes/BatteryShapeCreator' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Property = require( 'AXON/Property' );

  // phet-io modules
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
  var NEGATIVE_TERMINAL_ELLIPSE_SIZE = new Dimension2( 0.0035, 0.0009 ); // Ellipse axes defining the negative terminal
  var NEGATIVE_TERMINAL_Y_OFFSET = -( BODY_SIZE.height / 2 ) + 0.0005; // center of negative terminal when at the top

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
    this.voltageProperty = new NumberProperty( voltage, {
      tandem: tandem.createTandem( 'voltageProperty' ),
      units: 'volts'
    } );

    // Value type: enumeration (string)
    // @public
    this.polarityProperty = new Property( CLBConstants.POLARITY.POSITIVE, {
      tandem: tandem.createTandem( 'polarityProperty' ),
      phetioValueType: TString
    } );

    var self = this;

    // @public
    this.positiveTerminalEllipseSize = POSITIVE_TERMINAL_ELLIPSE_SIZE;
    // @public
    this.negativeTerminalEllipseSize = NEGATIVE_TERMINAL_ELLIPSE_SIZE;
    // @public
    this.positiveTerminalCylinderHeight = POSITIVE_TERMINAL_CYLINDER_HEIGHT;

    this.location = location; // @public (read-only)
    this.shapeCreator = new BatteryShapeCreator( this, modelViewTransform ); // @private

    // @private
    this.topTerminalShape = this.shapeCreator.createTopTerminalShape();

    this.voltageProperty.link( function() {
      self.polarityProperty.set( self.getPolarity( self.voltageProperty.value ) );
    } );

  }

  capacitorLabBasics.register( 'Battery', Battery );

  return inherit( Object, Battery, {

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
     * Determine if the probe tip shape contacts a battery terminal.
     * Since the bottom terminal is hidden in the 3D perspective, there is only
     * one contact region to check, which is the top terminal.
     * @public
     *
     * @param {Shape} probe - voltmeter probe tip shape
     * @returns {boolean}
     */
    contacts: function( probe ) {
      return probe.intersectsBounds( this.topTerminalShape );
    },

    /**
     * Gets the offset of the bottom terminal from the battery's origin, in model coordinates (meters).
     * We don't need to account for the polarity since the bottom terminal is never visible.
     * @public
     */
    getBottomTerminalYOffset: function() {
      return BODY_SIZE.height / 2;
    },

    /**
     * Gets the offset of the top terminal from the battery's origin, in model coordinates (meters).
     * This offset depends on the polarity.
     * @public
     */
    getTopTerminalYOffset: function() {
      if ( this.polarityProperty.value === CLBConstants.POLARITY.POSITIVE ) {
        return POSITIVE_TERMINAL_Y_OFFSET;
      }
      else {
        return NEGATIVE_TERMINAL_Y_OFFSET;
      }
    },

    // @public
    reset: function() {
      this.voltageProperty.reset();
      this.polarityProperty.reset();
    }
  } );
} );
