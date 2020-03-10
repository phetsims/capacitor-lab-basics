// Copyright 2015-2020, University of Colorado Boulder

/**
 * Creates a wire that connects a light bulb to a circuit switch.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Vector3 from '../../../../../dot/js/Vector3.js';
import inherit from '../../../../../phet-core/js/inherit.js';
import capacitorLabBasics from '../../../capacitorLabBasics.js';
import CircuitPosition from '../CircuitPosition.js';
import CircuitState from '../CircuitState.js';
import Wire from './Wire.js';
import WireSegment from './WireSegment.js';

/**
 * @constructor
 *
 * @param {CircuitPosition} connectionPoint
 * @param {CircuitConfig} config
 * @param {LightBulb} lightBulb
 * @param {CircuitSwitch} circuitSwitch
 */
function LightBulbToSwitchWire( connectionPoint, config, lightBulb, circuitSwitch ) {
  const segments = [];

  // Get y coordinate of the horizontal wire
  const horizontalY = circuitSwitch.getConnectionPoint( CircuitState.BATTERY_CONNECTED ).y;

  // Get x coordinate of the connection point
  const isTop = connectionPoint === CircuitPosition.LIGHT_BULB_TOP;
  const connectionPointX = isTop ? lightBulb.getTopConnectionPoint().x : lightBulb.getBottomConnectionPoint().x;

  // This is the (x,y) position of the upper right corner
  const rightCorner = new Vector3( connectionPointX, horizontalY, 0 );

  // add the vertical segment.
  let verticalSegment;
  if ( isTop ) {
    verticalSegment = WireSegment.createComponentTopWireSegment(
      lightBulb,
      rightCorner
    );
  }
  else {
    verticalSegment = WireSegment.createComponentBottomWireSegment(
      lightBulb,
      rightCorner
    );
  }
  segments.push( verticalSegment );

  // connect light bulb to switch connection point.
  const switchConnectionPoint = circuitSwitch.getConnectionPoint( CircuitState.LIGHT_BULB_CONNECTED );

  const separationOffset = new Vector3( 0.0006, 0, 0 );

  const wireSegment = new WireSegment(
    rightCorner,
    switchConnectionPoint.plus( separationOffset )
  );
  segments.push( wireSegment );

  Wire.call( this, config.modelViewTransform, segments, connectionPoint );
}

capacitorLabBasics.register( 'LightBulbToSwitchWire', LightBulbToSwitchWire );

export default inherit( Wire, LightBulbToSwitchWire, {}, {

  /**
   * Factory methods for top LightBulbToSwitchWire instance
   * @public
   *
   * @param {CircuitConfig} config
   * @param {LightBulb} lightBulb
   * @param {CircuitSwitch} circuitSwitch
   * @returns {LightBulbToSwitchWire}
   */
  createLightBulbToSwitchWireBottom: function( config, lightBulb, circuitSwitch ) {
    return new LightBulbToSwitchWire( CircuitPosition.LIGHT_BULB_BOTTOM, config, lightBulb, circuitSwitch );
  },

  /**
   * Factory methods for bottom LightBulbToSwitchWire instance
   * @public
   *
   * @param {CircuitConfig} config
   * @param {LightBulb} lightBulb
   * @param {CircuitSwitch} circuitSwitch
   * @returns {LightBulbToSwitchWire}
   */
  createLightBulbToSwitchWireTop: function( config, lightBulb, circuitSwitch ) {
    return new LightBulbToSwitchWire( CircuitPosition.LIGHT_BULB_TOP, config, lightBulb, circuitSwitch );
  }

} );
