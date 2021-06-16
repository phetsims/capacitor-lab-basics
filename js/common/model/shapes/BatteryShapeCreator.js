// Copyright 2015-2021, University of Colorado Boulder

/**
 * Creates 2D projections of shapes that are related to the 3D battery model. Shapes are in the global view coordinate
 * frame.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */


// modules
// TODO: Reverse the shapes so they are in the model?
// TODO: Did you mean invert the shapes?
import Matrix3 from '../../../../../dot/js/Matrix3.js';
import YawPitchModelViewTransform3 from '../../../../../scenery-phet/js/capacitor/YawPitchModelViewTransform3.js';
import capacitorLabBasics from '../../../capacitorLabBasics.js';
import BatteryGraphicNode from '../../view/BatteryGraphicNode.js';

class BatteryShapeCreator {
  /**
   * @param {Battery} battery
   * @param {YawPitchModelViewTransform3} modelViewTransform
   */
  constructor( battery, modelViewTransform ) {
    assert && assert( modelViewTransform instanceof YawPitchModelViewTransform3 );

    // @public {Battery}
    this.battery = battery;

    // @public {YawPitchModelViewTransform3}
    this.modelViewTransform = modelViewTransform;
  }


  /**
   * Creates the shape of the top positive terminal in the world coordinate frame.
   * @public
   *
   * TODO: Battery position doesn't change? Doesn't require recreation every time?
   *
   * @returns {Shape}
   */
  createPositiveTerminalShape() {
    let shape = BatteryGraphicNode.POSITIVE_UP.terminalShape;
    shape = shape.transformed( Matrix3.scaling( 0.3 ) );
    const batteryPosition = this.modelViewTransform.modelToViewPosition( this.battery.position );
    shape = shape.transformed( Matrix3.translation( batteryPosition.x - BatteryGraphicNode.POSITIVE_UP.bounds.centerX * 0.3,
      batteryPosition.y - BatteryGraphicNode.POSITIVE_UP.bounds.centerY * 0.3 ) );
    return shape;
  }

  /**
   * Creates the shape of the top negative terminal in the world coordinate frame.
   * @public
   *
   * TODO: Battery position doesn't change? Doesn't require recreation every time?
   *
   * @returns {Shape}
   */
  createNegativeTerminalShape() {
    let shape = BatteryGraphicNode.POSITIVE_DOWN.terminalShape;
    shape = shape.transformed( Matrix3.scaling( 0.3 ) );
    const batteryPosition = this.modelViewTransform.modelToViewPosition( this.battery.position );
    shape = shape.transformed( Matrix3.translation( batteryPosition.x - BatteryGraphicNode.POSITIVE_DOWN.bounds.centerX * 0.3,
      batteryPosition.y - BatteryGraphicNode.POSITIVE_DOWN.bounds.centerY * 0.3 ) );
    return shape;
  }
}

capacitorLabBasics.register( 'BatteryShapeCreator', BatteryShapeCreator );

export default BatteryShapeCreator;
