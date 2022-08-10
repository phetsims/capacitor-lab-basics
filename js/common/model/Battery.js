// Copyright 2015-2022, University of Colorado Boulder

/**
 * Simple model of a DC battery.  Origin is at the geometric center of the battery's body.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector3 from '../../../../dot/js/Vector3.js';
import CapacitorConstants from '../../../../scenery-phet/js/capacitor/CapacitorConstants.js';
import EnumerationIO from '../../../../tandem/js/types/EnumerationIO.js';
import capacitorLabBasics from '../../capacitorLabBasics.js';
import CLBConstants from '../CLBConstants.js';
import BatteryShapeCreator from './shapes/BatteryShapeCreator.js';

// constants
// size of the associated image file, determined by visual inspection
const BODY_SIZE = new Dimension2( 0.0065, 0.01425 ); // dimensions of the rectangle that bounds the battery image

/*
 * Positive terminal is part of the image file.
 * The terminal is a cylinder, whose dimensions were determined by visual inspection.
 * The origin of the terminal is at the center of the cylinder's top.
 */
const POSITIVE_TERMINAL_ELLIPSE_SIZE = new Dimension2( 0.0025, 0.0005 );
const POSITIVE_TERMINAL_CYLINDER_HEIGHT = 0.0009;
const POSITIVE_TERMINAL_Y_OFFSET = -( BODY_SIZE.height / 2 ) - 0.00012;

/*
 * Negative terminal is part of the image file.
 * The terminal is an ellipse, whose dimension were determined by visual inspection.
 * The origin of the terminal is at the center of the ellipse.
 */
const NEGATIVE_TERMINAL_ELLIPSE_SIZE = new Dimension2( 0.0035, 0.0009 ); // Ellipse axes defining the negative terminal
const NEGATIVE_TERMINAL_Y_OFFSET = -( BODY_SIZE.height / 2 ) + 0.0006; // center of negative terminal when at the top

class Battery {
  /**
   * @param {Vector3} position
   * @param {number} voltage
   * @param {YawPitchModelViewTransform3} modelViewTransform
   * @param {Tandem} tandem
   */
  constructor( position, voltage, modelViewTransform, tandem ) {
    assert && assert( position instanceof Vector3 );

    // @public {Property.<number>}
    this.voltageProperty = new NumberProperty( voltage, {
      tandem: tandem.createTandem( 'voltageProperty' ),
      units: 'V',
      range: CLBConstants.BATTERY_VOLTAGE_RANGE
    } );

    // Value type: enumeration (string)
    // @public {Property.<string>} - 'POSITIVE' or 'NEGATIVE'
    // TODO: use EnumerationDeprecatedProperty
    this.polarityProperty = new Property( CapacitorConstants.POLARITY.POSITIVE, {
      validValues: CapacitorConstants.POLARITY.VALUES,
      tandem: tandem.createTandem( 'polarityProperty' ),
      phetioValueType: EnumerationIO( CapacitorConstants.POLARITY )
    } );


    // @public {Dimension2}
    this.positiveTerminalEllipseSize = POSITIVE_TERMINAL_ELLIPSE_SIZE;
    this.negativeTerminalEllipseSize = NEGATIVE_TERMINAL_ELLIPSE_SIZE;

    // @public {number}
    this.positiveTerminalCylinderHeight = POSITIVE_TERMINAL_CYLINDER_HEIGHT;

    // @public {Vector3}
    this.position = position; // @public (read-only)
    this.shapeCreator = new BatteryShapeCreator( this, modelViewTransform ); // @private

    // @private {Shape}
    this.positiveTerminalShape = this.shapeCreator.createPositiveTerminalShape();
    this.negativeTerminalShape = this.shapeCreator.createNegativeTerminalShape();

    this.voltageProperty.link( () => {
      this.polarityProperty.set( this.getPolarity( this.voltageProperty.value ) );
    } );
  }


  /**
   * Convenience function to get the polarity from the object literal based on the voltage.
   * @private
   *
   * @param {number} voltage
   * @returns {string}
   */
  getPolarity( voltage ) {
    return ( voltage >= 0 ) ? CapacitorConstants.POLARITY.POSITIVE : CapacitorConstants.POLARITY.NEGATIVE;
  }

  /**
   * Determine if the probe tip shape contacts a battery terminal.
   * Since the bottom terminal is hidden in the 3D perspective, there is only
   * one contact region to check, which is the top terminal.
   * @public
   *
   * @param {Shape} probe - voltmeter probe tip shape
   * @returns {boolean}
   */
  contacts( probe ) {
    let shape;
    if ( this.polarityProperty.value === CapacitorConstants.POLARITY.POSITIVE ) {
      shape = this.positiveTerminalShape;
    }
    else {
      shape = this.negativeTerminalShape;
    }
    return probe.bounds.intersectsBounds( shape.bounds ) &&
           probe.shapeIntersection( shape ).getNonoverlappingArea() > 0;
  }

  /**
   * Gets the offset of the bottom terminal from the battery's origin, in model coordinates (meters).
   * We don't need to account for the polarity since the bottom terminal is never visible.
   * @public
   *
   * @returns {number}
   */
  getBottomTerminalYOffset() {
    return BODY_SIZE.height / 2;
  }

  /**
   * Gets the offset of the top terminal from the battery's origin, in model coordinates (meters).
   * This offset depends on the polarity.
   * @public
   *
   * @returns {number}
   */
  getTopTerminalYOffset() {
    if ( this.polarityProperty.value === CapacitorConstants.POLARITY.POSITIVE ) {
      return POSITIVE_TERMINAL_Y_OFFSET;
    }
    else {
      return NEGATIVE_TERMINAL_Y_OFFSET;
    }
  }

  // @public
  reset() {
    this.voltageProperty.reset();
    this.polarityProperty.reset();
  }
}

capacitorLabBasics.register( 'Battery', Battery );

export default Battery;
