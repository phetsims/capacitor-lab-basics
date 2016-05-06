// Copyright 2015, University of Colorado Boulder

/**
 * Creates a wire that connects a battery to a circuit switch.
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
   * @param {Tandem} tandem
   * @constructor
   */
  function BatteryToSwitchWire( connectionPoint, config, battery, circuitSwitch, tandem ) {

    var segments = [];

    // y coordinate of the horizontal wire
    var horizontalY = circuitSwitch.getConnectionPoint( CircuitConnectionEnum.BATTERY_CONNECTED ).y;
    var leftCorner = new Vector2( battery.location.x, horizontalY );

    // add the vertical segment.
    var verticalSegment;
    if ( connectionPoint === CLBConstants.WIRE_CONNECTIONS.BATTERY_TOP ) {
      verticalSegment = WireSegment.BatteryTopWireSegment( battery, leftCorner,
        tandem ? tandem.createTandem( 'batteryTopWireSegment' ) : null );
    } else {
      verticalSegment = WireSegment.BatteryBottomWireSegment( battery, leftCorner,
        tandem ? tandem.createTandem( 'batteryBottomWireSegment' ) : null );
    }

    segments.push( verticalSegment );

    // connect battery to switch connection point.
    var switchSegment;
    var switchConnectionPoint;

    if ( connectionPoint === CLBConstants.WIRE_CONNECTIONS.BATTERY_TOP ) {
      switchConnectionPoint = circuitSwitch.getConnectionPoint( CircuitConnectionEnum.BATTERY_CONNECTED );
      switchSegment = WireSegment.BatteryTopToSwitchSegment( leftCorner, switchConnectionPoint,
        tandem ? tandem.createTandem( 'batteryTopToSwitchSegment' ) : null );
    } else {
      switchConnectionPoint = circuitSwitch.getConnectionPoint( CircuitConnectionEnum.BATTERY_CONNECTED );
      switchSegment = WireSegment.BatteryBottomToSwitchSegment( leftCorner, switchConnectionPoint,
        tandem ? tandem.createTandem( 'batteryBottomToSwitchSegment' ) : null );
    }

    segments.push( switchSegment );
    Wire.call( this, config.modelViewTransform, config.wireThickness, segments, connectionPoint );
  }

  capacitorLabBasics.register( 'BatteryToSwitchWire', BatteryToSwitchWire );

  return inherit( Wire, BatteryToSwitchWire, {}, {

    /**
     * Factory functions for public access to specific constructors.
     */
    BatteryToSwitchWireBottom: function( config, battery, circuitSwitch, tandem ) {
      return new BatteryToSwitchWire( CLBConstants.WIRE_CONNECTIONS.BATTERY_BOTTOM, config, battery, circuitSwitch,
        tandem ? tandem.createTandem( 'batteryToSwitchWireBottom' ) : null );
    },

    BatteryToSwitchWireTop: function( config, battery, circuitSwitch, tandem ) {
      return new BatteryToSwitchWire( CLBConstants.WIRE_CONNECTIONS.BATTERY_TOP, config, battery, circuitSwitch,
        tandem ? tandem.createTandem( 'batteryToSwitchWireTop' ) : null );
    }

  } );

} );

