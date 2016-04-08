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
    // TODO: 0 should be getEndOffset
    segments.push( this.getBatteryVerticalSegment( connectionPoint, battery, leftCorner ) );

    // connect battery to switch connection point.
    segments.push( this.getBatteryToSwitchSegment( connectionPoint, circuitSwitch, leftCorner ) );
    Wire.call( this, modelViewTransform, thickness, segments, connectionPoint );

  }

  capacitorLabBasics.register( 'BatteryToSwitchWire', BatteryToSwitchWire );

  return inherit( Wire, BatteryToSwitchWire, {
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

      if ( connectionPoint === CLConstants.WIRE_CONNECTIONS.BATTERY_TOP ) {
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
      if ( connectionPoint === CLConstants.WIRE_CONNECTIONS.BATTERY_TOP ) {
        return new Vector2( lightBulb.location.x, horizontalY );
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

      if ( connectionPoint === CLConstants.WIRE_CONNECTIONS.BATTERY_TOP ) {
        return WireSegment.BatteryTopWireSegment( battery, endPoint );
      }
      else {
        return WireSegment.BatteryBottomWireSegment( battery, endPoint );
      }
    },
    //getBatteryWireSegment: function( connectionPoint, battery, endOffset, endPoint ) {
    //  if ( connectionPoint === ConnectionPoint.TOP ) {
    //    return WireSegment.BatteryTopWireSegment( battery, endOffset, endPoint );
    //  }
    //  else {
    //    return WireSegment.BatteryBottomWireSegment( battery, endOffset, endPoint );
    //  }
    //},

    getLightBulbWireSegment: function( connectionPoint, lightBulb, endPoint ) {
      if ( connectionPoint === CLConstants.WIRE_CONNECTIONS.BATTERY_TOP ) {
        return WireSegment.LightBulbTopWireSegment( lightBulb.getTopConnectionPoint(), endPoint );
      }
      else {
        return WireSegment.LightBulbBottomWireSegment( lightBulb.getBottomConnectionPoint(), endPoint );
      }
    },

    getBatteryToSwitchSegment: function( connectionPoint, circuitSwitch, endPoint ) {
      var switchConnectionPoint;
      if ( connectionPoint === CLConstants.WIRE_CONNECTIONS.BATTERY_TOP ) {
        switchConnectionPoint = circuitSwitch.getConnectionPoint( CircuitConnectionEnum.BATTERY_CONNECTED );
        return WireSegment.BatteryTopToSwitchSegment( endPoint, switchConnectionPoint );
      }
      else {
        switchConnectionPoint = circuitSwitch.getConnectionPoint( CircuitConnectionEnum.BATTERY_CONNECTED );
        return WireSegment.BatteryBottomToSwitchSegment( endPoint, switchConnectionPoint );
      }
    },

    getBulbToSwitchSegment: function( connectionPoint, sortedSwiches, endPoint ) {
      var topSwitch = sortedSwiches[ 0 ];
      var bottomSwitch = sortedSwiches[ 1 ];
      var switchConnectionPoint;
      if ( connectionPoint === CLConstants.WIRE_CONNECTIONS.BATTERY_TOP ) {
        switchConnectionPoint = topSwitch.getConnectionPoint( CircuitConnectionEnum.LIGHT_BULB_CONNECTED );
        return WireSegment.BulbTopToSwitchSegment( switchConnectionPoint, endPoint );
      }
      else {
        switchConnectionPoint = bottomSwitch.getConnectionPoint( CircuitConnectionEnum.LIGHT_BULB_CONNECTED );
        return WireSegment.BulbBottomToSwitchSegment( switchConnectionPoint, endPoint );
      }
    },

    getCapacitorToSwitchSegment: function( connectionPoint, sortedSwitches, capacitor ) {
      var topSwitch = sortedSwitches[ 0 ];
      var bottomSwitch = sortedSwitches[ 1 ];
      var switchConnectionPoint;
      if ( connectionPoint === CLConstants.WIRE_CONNECTIONS.BATTERY_TOP ) {
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
      if ( connectionPoint === CLConstants.WIRE_CONNECTIONS.BATTERY_TOP ) {
        return WireSegment.VerticalTopWireSegment( battery, startPoint );
      }
      else if ( connectionPoint === CLConstants.WIRE_CONNECTIONS.BATTERY_BOTTOM ) {
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
      if ( connectionPoint === CLConstants.WIRE_CONNECTIONS.BATTERY_TOP ) {
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
    BatteryToSwitchWireBottom: function( modelViewTransform, thickness, battery, circuitSwitch ) {
      return new BatteryToSwitchWire( CLConstants.WIRE_CONNECTIONS.BATTERY_BOTTOM, modelViewTransform, thickness, battery, circuitSwitch );
    },

    BatteryToSwitchWireTop: function( modelViewTransform, thickness, battery, circuitSwitch ) {
      return new BatteryToSwitchWire( CLConstants.WIRE_CONNECTIONS.BATTERY_TOP, modelViewTransform, thickness, battery, circuitSwitch );
    }

  } );

} );