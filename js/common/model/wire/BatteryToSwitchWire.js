// Copyright 2015-2019, University of Colorado Boulder

/**
 * Creates a wire that connects a battery to a circuit switch.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CircuitLocation = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitLocation' );
  var CircuitState = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitState' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector3 = require( 'DOT/Vector3' );
  var Wire = require( 'CAPACITOR_LAB_BASICS/common/model/wire/Wire' );
  var WireSegment = require( 'CAPACITOR_LAB_BASICS/common/model/wire/WireSegment' );

  /**
   * @constructor
   *
   * @param {CircuitLocation} connectionPoint
   * @param {CircuitConfig} config
   * @param {Battery} battery
   * @param {CircuitSwitch} circuitSwitch
   * @param {Tandem} tandem
   */
  function BatteryToSwitchWire( connectionPoint, config, battery, circuitSwitch, tandem ) {
    assert && assert( _.includes( CircuitLocation.VALUES, connectionPoint ) );

    var segments = [];

    // y coordinate of the horizontal wire
    var horizontalY = circuitSwitch.getConnectionPoint( CircuitState.BATTERY_CONNECTED ).y;
    var leftCorner = new Vector3( battery.location.x, horizontalY, 0 );

    // add the vertical segment.
    var verticalSegment;
    var startPoint;
    if ( connectionPoint === CircuitLocation.BATTERY_TOP ) {
      startPoint = new Vector3( battery.location.x, battery.location.y + battery.getTopTerminalYOffset(), 0 );
      verticalSegment = new WireSegment( startPoint, leftCorner );
      verticalSegment.update = function() {
        var point = new Vector3( battery.location.x, battery.location.y + battery.getTopTerminalYOffset(), 0 );
        if ( !this.startPointProperty.value.equals( point ) ) {
          this.startPointProperty.set( point );
        }
      };
    }
    else {

      // Slightly lower the bottom wire start point so we can't probe into the battery.
      // See https://github.com/phetsims/capacitor-lab-basics/issues/197
      var bottomOffset = 0.00065;
      startPoint = new Vector3( battery.location.x, battery.location.y + battery.getBottomTerminalYOffset() + bottomOffset, 0 );
      verticalSegment = new WireSegment( startPoint, leftCorner );
      verticalSegment.update = function() {
        var point = new Vector3( battery.location.x, battery.location.y + battery.getBottomTerminalYOffset() + bottomOffset, 0 );
        if ( !this.startPointProperty.value.equals( point ) ) {
          this.startPointProperty.set( point );
        }
      };
    }

    segments.push( verticalSegment );

    // connect battery to switch connection point.
    var switchSegment;
    var switchConnectionPoint;
    var separationOffset = new Vector3( -0.0006, 0, 0 );

    if ( connectionPoint === CircuitLocation.BATTERY_TOP ) {
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
    Wire.call( this, config.modelViewTransform, segments, connectionPoint );
  }

  capacitorLabBasics.register( 'BatteryToSwitchWire', BatteryToSwitchWire );

  return inherit( Wire, BatteryToSwitchWire, {}, {

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
    createBatteryToSwitchWireBottom: function( config, battery, circuitSwitch, tandem ) {
      return new BatteryToSwitchWire( CircuitLocation.BATTERY_BOTTOM, config, battery, circuitSwitch, tandem );
    },

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
    createBatteryToSwitchWireTop: function( config, battery, circuitSwitch ) {
      return new BatteryToSwitchWire( CircuitLocation.BATTERY_TOP, config, battery, circuitSwitch );
    }
  } );
} );
