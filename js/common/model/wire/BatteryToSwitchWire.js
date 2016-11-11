// Copyright 2015, University of Colorado Boulder

/**
 * Creates a wire that connects a battery to a circuit switch.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var Vector2 = require( 'DOT/Vector2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Wire = require( 'CAPACITOR_LAB_BASICS/common/model/wire/Wire' );
  var WireSegment = require( 'CAPACITOR_LAB_BASICS/common/model/wire/WireSegment' );
  var CircuitConnectionEnum = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitConnectionEnum' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  /**
   * Constructor.
   *
   * @param {string} connectionPoint - string indicating object which is connected to the capacitor
   * @param {CircuitConfig} config
   * @param {Battery} battery
   * @param {CircuitSwitch} circuitSwitch
   * @param {Tandem|null} tandem - null if this is part of a temporary circuit used for calculations
   * @constructor
   */
  function BatteryToSwitchWire( connectionPoint, config, battery, circuitSwitch, tandem ) {

    var segments = [];

    // y coordinate of the horizontal wire
    var horizontalY = circuitSwitch.getConnectionPoint( CircuitConnectionEnum.BATTERY_CONNECTED ).y;
    var leftCorner = new Vector2( battery.location.x, horizontalY );

    // add the vertical segment.
    var verticalSegment;
    var startPoint;
    if ( connectionPoint === CLBConstants.WIRE_CONNECTIONS.BATTERY_TOP ) {

      startPoint = new Vector2( battery.location.x, battery.location.y + battery.getTopTerminalYOffset() );

      verticalSegment = new WireSegment( startPoint, leftCorner, tandem.createTandem( 'batteryTopWireSegment' ) );

      verticalSegment.update = function() {
        var point = new Vector2( battery.location.x, battery.location.y + battery.getTopTerminalYOffset() );
        this.startPointProperty.set( point );
      };

    }
    else {

      startPoint = new Vector2( battery.location.x, battery.location.y + battery.getBottomTerminalYOffset() );

      verticalSegment = new WireSegment( startPoint, leftCorner, tandem.createTandem( 'batteryBottomWireSegment' ) );

      verticalSegment.update = function() {
        var point = new Vector2( battery.location.x, battery.location.y + battery.getBottomTerminalYOffset() );
        this.startPointProperty.set( point );
      };
    }

    segments.push( verticalSegment );

    // connect battery to switch connection point.
    var switchSegment;
    var switchConnectionPoint;

    if ( connectionPoint === CLBConstants.WIRE_CONNECTIONS.BATTERY_TOP ) {
      switchConnectionPoint = circuitSwitch.getConnectionPoint( CircuitConnectionEnum.BATTERY_CONNECTED );
      switchSegment = WireSegment.createBatteryTopToSwitchSegment( leftCorner, switchConnectionPoint,
        tandem.createTandem( 'batteryTopToSwitchSegment' ) );
    }
    else {
      switchConnectionPoint = circuitSwitch.getConnectionPoint( CircuitConnectionEnum.BATTERY_CONNECTED );
      switchSegment = WireSegment.createBatteryBottomToSwitchSegment( leftCorner, switchConnectionPoint,
        tandem.createTandem( 'batteryBottomToSwitchSegment' ) );
    }

    segments.push( switchSegment );
    Wire.call( this, config.modelViewTransform, config.wireThickness, segments, connectionPoint );
  }

  capacitorLabBasics.register( 'BatteryToSwitchWire', BatteryToSwitchWire );

  return inherit( Wire, BatteryToSwitchWire, {}, {

    /**
     * Factory function for BatteryToSwitchWire (bottom side)
     * @param {CircuitConfig} config
     * @param {Battery} battery
     * @param {CircuitSwitch} circuitSwitch
     * @param {Tandem} tandem
     */
    createBatteryToSwitchWireBottom: function( config, battery, circuitSwitch, tandem ) {
      return new BatteryToSwitchWire( CLBConstants.WIRE_CONNECTIONS.BATTERY_BOTTOM, config, battery, circuitSwitch,
        tandem );
    },

    /**
     * Factory function for BatteryToSwitchWire (top side)
     * @param {CircuitConfig} config
     * @param {Battery} battery
     * @param {CircuitSwitch} circuitSwitch
     * @param {Tandem} tandem
     */
    createBatteryToSwitchWireTop: function( config, battery, circuitSwitch, tandem ) {
      return new BatteryToSwitchWire( CLBConstants.WIRE_CONNECTIONS.BATTERY_TOP, config, battery, circuitSwitch,
        tandem );
    }

  } );

} );
