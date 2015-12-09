// Copyright 2015, University of Colorado Boulder

/**
 * Creates a wire that connects a light bulb to a circuit switch.
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
   * @param {string} connectionPoint one of 'TOP' or 'BOTTOM'
   * @param {ModelViewTransform2} modelViewTransform
   * @param {number} thickness
   * @param {LightBulb} lightBulb
   * @param {CircuitSwitch} circuitSwitch
   * @constructor
   */
  function WireLightBulbToCircuitSwitch( connectionPoint, modelViewTransform, thickness, lightBulb, circuitSwitch ) {
    var segments = [];

    // y coordinate of the horizontal wire
    var horizontalY = circuitSwitch.getConnectionPoint( CircuitConnectionEnum.BATTERY_CONNECTED ).y;
    var rightCorner = this.getRightCorner( connectionPoint, lightBulb, horizontalY );

    // add the vertical segment.
    segments.push( this.getLightBulbWireSegment( connectionPoint, lightBulb, rightCorner ) );

    // connect lightbulb to switch connection point.
    segments.push( this.getLightBulbToSwitchSegment( connectionPoint, circuitSwitch, rightCorner ) );

    Wire.call( this, modelViewTransform, thickness, segments, connectionPoint );

  }

  capacitorLabBasics.register( 'WireLightBulbToCircuitSwitch', WireLightBulbToCircuitSwitch );

  return inherit( Wire, WireLightBulbToCircuitSwitch, {
    /**
     * Gets the Y coordinate of the horizontal wire. It extends wireExtent distance above/below the component that is
     * closest to the wire.
     *
     * @param {string} connectionPoint, one of 'TOP', 'BOTTOM'
     * @param {array} circuitComponents
     * @param {number} wireExtent
     * @return {number}
     */
    getHorizontalY: function( connectionPoint, circuitComponents, wireExtent ) {
      var y = circuitComponents[ 0 ].location.y;
      if ( connectionPoint === CLConstants.WIRE_CONNECTIONS.LIGHT_BULB_TOP ) {
        circuitComponents.forEach( function( component ) {
          y = Math.min( y, component.location.y - wireExtent );
        } );
      }
      else {
        circuitComponents.forEach( function( component ) {
          y = Math.max( y, component.location.y + wireExtent );
        } );
      }
      return y;
    },

    getRightCorner: function( connectionPoint, lightBulb, horizontalY ) {
      if ( connectionPoint === CLConstants.WIRE_CONNECTIONS.LIGHT_BULB_TOP ) {
        return new Vector2( lightBulb.getTopConnectionPoint().x, horizontalY );
      }
      else {
        return new Vector2( lightBulb.getBottomConnectionPoint().x, horizontalY );
      }
    },

    /**
     * Gets a wire segment that attaches to the specified terminal (top or bottom) of a battery.
     *
     * @param connectionPoint
     * @param battery
     * @param endPoint
     * @returns {WireSegment}
     */
    getBatteryVerticalSegment: function( connectionPoint, battery, endPoint ) {

      if ( connectionPoint === CLConstants.WIRE_CONNECTIONS.LIGHT_BULB_TOP ) {
        return WireSegment.BatteryTopWireSegment( battery, endPoint );
      }
      else {
        return WireSegment.BatteryBottomWireSegment( battery, endPoint );
      }
    },

    getLightBulbWireSegment: function( connectionPoint, lightBulb, endPoint ) {
      if ( connectionPoint === CLConstants.WIRE_CONNECTIONS.LIGHT_BULB_TOP ) {
        return WireSegment.ComponentTopWireSegment( lightBulb, endPoint );
      }
      else {
        return WireSegment.ComponentBottomWireSegment( lightBulb, endPoint );
      }
    },

    getBatteryToSwitchSegment: function( connectionPoint, circuitSwitch, endPoint ) {
      var switchConnectionPoint;
      if ( connectionPoint === CLConstants.WIRE_CONNECTIONS.LIGHT_BULB_TOP ) {
        switchConnectionPoint = circuitSwitch.getConnectionPoint( CircuitConnectionEnum.BATTERY_CONNECTED );
        return WireSegment.BatteryTopToSwitchSegment( endPoint, switchConnectionPoint );
      }
      else {
        switchConnectionPoint = circuitSwitch.getConnectionPoint( CircuitConnectionEnum.BATTERY_CONNECTED );
        return WireSegment.BatteryBottomToSwitchSegment( endPoint, switchConnectionPoint );
      }
    },

    getLightBulbToSwitchSegment: function( connectionPoint, circuitSwitch, endPoint ) {
      var switchConnectionPoint = circuitSwitch.getConnectionPoint( CircuitConnectionEnum.LIGHT_BULB_CONNECTED );
      return new WireSegment( endPoint, switchConnectionPoint );
    },

    getCapacitorToSwitchSegment: function( connectionPoint, sortedSwitches, capacitor ) {
      var topSwitch = sortedSwitches[ 0 ];
      var bottomSwitch = sortedSwitches[ 1 ];
      var switchConnectionPoint;
      if ( connectionPoint === CLConstants.WIRE_CONNECTIONS.LIGHT_BULB_TOP ) {
        switchConnectionPoint = topSwitch.getCapacitorConnectionPoint();
        return WireSegment.CapacitorTopToSwitchSegment( capacitor.getTopConnectionPoint(), switchConnectionPoint );
      }
      else {
        switchConnectionPoint = bottomSwitch.getCapacitorConnectionPoint();
        return WireSegment.CapacitorTopToSwitchSegment( capacitor.getBottomConnectionPoint(), switchConnectionPoint );
      }
    },

    /**
     * Return a vertical wire segment from the battery connection point to the horizontal wires in the parallel circuit.
     *
     * @param {string} connectionPoint The connection type for the component, one of TOP or BOTTOM
     * @param {Battery} battery
     * @param {Vector2} startPoint
     */
    getVerticalWireSegment: function( connectionPoint, battery, startPoint ) {
      if ( connectionPoint === CLConstants.WIRE_CONNECTIONS.LIGHT_BULB_TOP ) {
        return WireSegment.VerticalTopWireSegment( battery, startPoint );
      }
      else if ( connectionPoint === CLConstants.WIRE_CONNECTIONS.LIGHT_BULB_BOTTOM ) {
        return WireSegment.VerticalBottomWireSegment( battery, startPoint );
      }
      else {
        assert && assert( 'Connection point must be one of "TOP" or "BOTTOM" ' );
      }
    },

    /**
     * Gets a wire segment that attaches to the specified circuit component.
     *
     * @param connectionPoint
     * @param component
     * @param endPoint
     * @returns {WireSegment}
     */
    getComponentWireSegment: function( connectionPoint, component, startPoint ) {
      if ( connectionPoint === CLConstants.WIRE_CONNECTIONS.LIGHT_BULB_TOP ) {
        return WireSegment.ComponentTopWireSegment( component, startPoint );
      }
      else {
        return WireSegment.ComponentBottomWireSegment( component, startPoint );
      }
    }

  }, {

    /**
     * Factory functions for public access to specific constructors.
     */
    WireLightBulbToCircuitSwitchBottom: function( modelViewTransform, thickness, lightBulb, circuitSwitch ) {
      return new WireLightBulbToCircuitSwitch( CLConstants.WIRE_CONNECTIONS.LIGHT_BULB_BOTTOM, modelViewTransform, thickness, lightBulb, circuitSwitch );
    },

    WireLightBulbToCircuitSwitchTop: function( modelViewTransform, thickness, lightBulb, circuitSwitch ) {
      return new WireLightBulbToCircuitSwitch( CLConstants.WIRE_CONNECTIONS.LIGHT_BULB_TOP, modelViewTransform, thickness, lightBulb, circuitSwitch );
    }

  } );

} );