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
  var CLConstants = require( 'CAPACITOR_LAB_BASICS/common/CLConstants' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  /**
   * Constructor.
   *
   * @param {string} connectionPoint - string indicating object which is connected to the capacitor
   * @param {ModelViewTransform2} modelViewTransform
   * @param {number} thickness
   * @param {Battery} battery
   * @param {CircuitSwitch} circuitSwitch
   * @param {Property.<string>} circuitConnectionProperty
   * @constructor
   */
  function BatteryToSwitchWire( connectionPoint, modelViewTransform, thickness, battery, circuitSwitch ) {

    var segments = [];

    // y coordinate of the horizontal wire
    var horizontalY = circuitSwitch.getConnectionPoint( CircuitConnectionEnum.BATTERY_CONNECTED ).y;
    var leftCorner = new Vector2( battery.location.x, horizontalY );

    // add the vertical segment.
    var verticalSegment;
    if ( connectionPoint === CLConstants.WIRE_CONNECTIONS.BATTERY_TOP ) {
      verticalSegment = WireSegment.BatteryTopWireSegment( battery, leftCorner );
    } else {
      verticalSegment = WireSegment.BatteryBottomWireSegment( battery, leftCorner );
    }

    segments.push( verticalSegment );

    // connect battery to switch connection point.
    var switchSegment;
    var switchConnectionPoint;

    if ( connectionPoint === CLConstants.WIRE_CONNECTIONS.BATTERY_TOP ) {
      switchConnectionPoint = circuitSwitch.getConnectionPoint( CircuitConnectionEnum.BATTERY_CONNECTED );
      switchSegment = WireSegment.BatteryTopToSwitchSegment( leftCorner, switchConnectionPoint );
    } else {
      switchConnectionPoint = circuitSwitch.getConnectionPoint( CircuitConnectionEnum.BATTERY_CONNECTED );
      switchSegment = WireSegment.BatteryBottomToSwitchSegment( leftCorner, switchConnectionPoint );
    }

    segments.push( switchSegment );
    Wire.call( this, modelViewTransform, thickness, segments, connectionPoint );
  }

  capacitorLabBasics.register( 'BatteryToSwitchWire', BatteryToSwitchWire );

  return inherit( Wire, BatteryToSwitchWire, {}, {

    /**
     * Factory functions for public access to specific constructors.
     */
    BatteryToSwitchWireBottom: function( modelViewTransform, thickness, battery, circuitSwitch ) {
      return new BatteryToSwitchWire( CLConstants.WIRE_CONNECTIONS.BATTERY_BOTTOM, modelViewTransform, thickness, battery, circuitSwitch );
    },

    BatteryToSwitchWireTop: function( modelViewTransform, thickness, battery, circuitSwitch ) {
      return new BatteryToSwitchWire( CLConstants.WIRE_CONNECTIONS.BATTERY_TOP, modelViewTransform, thickness, battery, circuitSwitch );
    }

  } );

} );

