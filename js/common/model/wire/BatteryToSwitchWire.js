// Copyright 2015-2016, University of Colorado Boulder

/**
 * Creates a wire that connects a battery to a circuit switch.
 *
 * @author Jesse Greenberg
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
   * @param {string} connectionPoint - enumeration constant from CircuitLocation
   * @param {CircuitConfig} config
   * @param {Battery} battery
   * @param {CircuitSwitch} circuitSwitch
   * @param {Tandem|null} tandem - null if this is part of a temporary circuit used for calculations
   * @constructor
   */
  function BatteryToSwitchWire( connectionPoint, config, battery, circuitSwitch, tandem ) {

    var segments = [];

    // y coordinate of the horizontal wire
    var horizontalY = circuitSwitch.getConnectionPoint( CircuitState.BATTERY_CONNECTED ).y;
    var leftCorner = new Vector3( battery.location.x, horizontalY );

    // add the vertical segment.
    var verticalSegment;
    var startPoint;
    if ( connectionPoint === CircuitLocation.BATTERY_TOP ) {

      startPoint = new Vector3( battery.location.x, battery.location.y + battery.getTopTerminalYOffset(), 0 );

      verticalSegment = new WireSegment( startPoint, leftCorner, tandem.createTandem( 'batteryTopWireSegment' ) );

      verticalSegment.update = function() {
        var point = new Vector3( battery.location.x, battery.location.y + battery.getTopTerminalYOffset(), 0 );
        this.startPointProperty.set( point );
      };

    }
    else {

      startPoint = new Vector3( battery.location.x, battery.location.y + battery.getBottomTerminalYOffset(), 0 );

      verticalSegment = new WireSegment( startPoint, leftCorner, tandem.createTandem( 'batteryBottomWireSegment' ) );

      verticalSegment.update = function() {
        var point = new Vector3( battery.location.x, battery.location.y + battery.getBottomTerminalYOffset(), 0 );
        this.startPointProperty.set( point );
      };
    }

    segments.push( verticalSegment );

    // connect battery to switch connection point.
    var switchSegment;
    var switchConnectionPoint;

    if ( connectionPoint === CircuitLocation.BATTERY_TOP ) {
      switchConnectionPoint = circuitSwitch.getConnectionPoint( CircuitState.BATTERY_CONNECTED );
      switchSegment = new WireSegment( leftCorner, switchConnectionPoint,
        tandem.createTandem( 'batteryTopToSwitchSegment' ) );
    }
    else {
      switchConnectionPoint = circuitSwitch.getConnectionPoint( CircuitState.BATTERY_CONNECTED );
      switchSegment = new WireSegment( leftCorner, switchConnectionPoint,
        tandem.createTandem( 'batteryBottomToSwitchSegment' ) );
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
     * @returns {Wire}
     */
    createBatteryToSwitchWireBottom: function( config, battery, circuitSwitch, tandem ) {
      return new BatteryToSwitchWire( CircuitLocation.BATTERY_BOTTOM, config, battery, circuitSwitch,
        tandem );
    },

    /**
     * Factory function for BatteryToSwitchWire (top side)
     * @public
     *
     * @param {CircuitConfig} config
     * @param {Battery} battery
     * @param {CircuitSwitch} circuitSwitch
     * @param {Tandem} tandem
     * @returns {Wire}
     */
    createBatteryToSwitchWireTop: function( config, battery, circuitSwitch, tandem ) {
      return new BatteryToSwitchWire( CircuitLocation.BATTERY_TOP, config, battery, circuitSwitch,
        tandem );
    }
  } );
} );
