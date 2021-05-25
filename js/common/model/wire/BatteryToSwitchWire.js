// Copyright 2015-2021, University of Colorado Boulder

/**
 * Creates a wire that connects a battery to a circuit switch.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Vector3 from '../../../../../dot/js/Vector3.js';
import capacitorLabBasics from '../../../capacitorLabBasics.js';
import CircuitPosition from '../CircuitPosition.js';
import CircuitState from '../CircuitState.js';
import Wire from './Wire.js';
import WireSegment from './WireSegment.js';

class BatteryToSwitchWire extends Wire {
  /**
   * @param {CircuitPosition} connectionPoint
   * @param {CircuitConfig} config
   * @param {Battery} battery
   * @param {CircuitSwitch} circuitSwitch
   * @param {Tandem} tandem
   */
  constructor( connectionPoint, config, battery, circuitSwitch, tandem ) {
    assert && assert( _.includes( CircuitPosition.VALUES, connectionPoint ) );

    const segments = [];

    // y coordinate of the horizontal wire
    const horizontalY = circuitSwitch.getConnectionPoint( CircuitState.BATTERY_CONNECTED ).y;
    const leftCorner = new Vector3( battery.position.x, horizontalY, 0 );

    // add the vertical segment.
    let verticalSegment;
    let startPoint;
    if ( connectionPoint === CircuitPosition.BATTERY_TOP ) {
      startPoint = new Vector3( battery.position.x, battery.position.y + battery.getTopTerminalYOffset(), 0 );
      verticalSegment = new WireSegment( startPoint, leftCorner );
      verticalSegment.update = function() {
        const point = new Vector3( battery.position.x, battery.position.y + battery.getTopTerminalYOffset(), 0 );
        if ( !this.startPointProperty.value.equals( point ) ) {
          this.startPointProperty.set( point );
        }
      };
    }
    else {

      // Slightly lower the bottom wire start point so we can't probe into the battery.
      // See https://github.com/phetsims/capacitor-lab-basics/issues/197
      const bottomOffset = 0.00065;
      startPoint = new Vector3( battery.position.x, battery.position.y + battery.getBottomTerminalYOffset() + bottomOffset, 0 );
      verticalSegment = new WireSegment( startPoint, leftCorner );
      verticalSegment.update = function() {
        const point = new Vector3( battery.position.x, battery.position.y + battery.getBottomTerminalYOffset() + bottomOffset, 0 );
        if ( !this.startPointProperty.value.equals( point ) ) {
          this.startPointProperty.set( point );
        }
      };
    }

    segments.push( verticalSegment );

    // connect battery to switch connection point.
    let switchSegment;
    let switchConnectionPoint;
    const separationOffset = new Vector3( -0.0006, 0, 0 );

    if ( connectionPoint === CircuitPosition.BATTERY_TOP ) {
      switchConnectionPoint = circuitSwitch.getConnectionPoint( CircuitState.BATTERY_CONNECTED );
      switchSegment = new WireSegment(
        leftCorner,
        switchConnectionPoint.plus( separationOffset )
      );
    }
    else {
      switchConnectionPoint = circuitSwitch.getConnectionPoint( CircuitState.BATTERY_CONNECTED );
      switchSegment = new WireSegment(
        leftCorner,
        switchConnectionPoint.plus( separationOffset )
      );
    }

    segments.push( switchSegment );
    super( config.modelViewTransform, segments, connectionPoint );
  }


  /**
   * Factory function for BatteryToSwitchWire (bottom side)
   * @public
   *
   * @param {CircuitConfig} config
   * @param {Battery} battery
   * @param {CircuitSwitch} circuitSwitch
   * @param {Tandem} tandem
   * @returns {BatteryToSwitchWire}
   */
  static createBatteryToSwitchWireBottom( config, battery, circuitSwitch, tandem ) {
    return new BatteryToSwitchWire( CircuitPosition.BATTERY_BOTTOM, config, battery, circuitSwitch, tandem );
  }

  /**
   * Factory function for BatteryToSwitchWire (top side)
   * @public
   *
   * @param {CircuitConfig} config
   * @param {Battery} battery
   * @param {CircuitSwitch} circuitSwitch
   * @param {Tandem} tandem
   * @returns {BatteryToSwitchWire}
   */
  static createBatteryToSwitchWireTop( config, battery, circuitSwitch ) {
    return new BatteryToSwitchWire( CircuitPosition.BATTERY_TOP, config, battery, circuitSwitch );
  }
}

capacitorLabBasics.register( 'BatteryToSwitchWire', BatteryToSwitchWire );

export default BatteryToSwitchWire;
