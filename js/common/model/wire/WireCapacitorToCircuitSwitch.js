// Copyright 2002-2015, University of Colorado Boulder

/**
 * Creates a wire that connects a capacitor to a circuit switch.
 */
define( function( require ) {
  'use strict';

  // modules
  var Vector2 = require( 'DOT/Vector2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Wire = require( 'CAPACITOR_LAB_BASICS/common/model/wire/Wire' );
  var WireSegment = require( 'CAPACITOR_LAB_BASICS/common/model/wire/WireSegment' );

  // constants
  var ConnectionPoint = {
    TOP: 'TOP',
    BOTTOM: 'BOTTOM'
  };

  /**
   * Constructor.
   *
   * @param {string} connectionPoint one of 'TOP' or 'BOTTOM'
   * @param {ModelViewTransform2} modelViewTransform
   * @param {number} thickness
   * @param {Capacitor} capacitor
   * @param {CircuitSwitch} circuitSwitch
   * @constructor
   */
  function WireCapacitorToCircuitSwitch( connectionPoint, modelViewTransform, thickness, capacitor, circuitSwitch ) {
    var segments = [];

    // add the vertical segment.
    segments.push( this.getCapacitorToSwitchSegment( connectionPoint, circuitSwitch, capacitor ) );

    Wire.call( this, modelViewTransform, thickness, segments, connectionPoint );

  }


  return inherit( Wire, WireCapacitorToCircuitSwitch, {
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
      if ( connectionPoint === ConnectionPoint.TOP ) {
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
      if ( connectionPoint === ConnectionPoint.TOP ) {
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

      if ( connectionPoint === ConnectionPoint.TOP ) {
        return WireSegment.BatteryTopWireSegment( battery, endPoint );
      }
      else {
        return WireSegment.BatteryBottomWireSegment( battery, endPoint );
      }
    },

    getLightBulbWireSegment: function( connectionPoint, lightBulb, endPoint ) {
      if ( connectionPoint === ConnectionPoint.TOP ) {
        return WireSegment.ComponentTopWireSegment( lightBulb, endPoint );
      }
      else {
        return WireSegment.ComponentBottomWireSegment( lightBulb, endPoint );
      }
    },

    getBatteryToSwitchSegment: function( connectionPoint, circuitSwitch, endPoint ) {
      var switchConnectionPoint;
      if ( connectionPoint === ConnectionPoint.TOP ) {
        switchConnectionPoint = circuitSwitch.getBatteryConnectionPoint();
        return WireSegment.BatteryTopToSwitchSegment( endPoint, switchConnectionPoint );
      }
      else {
        switchConnectionPoint = circuitSwitch.getBatteryConnectionPoint();
        return WireSegment.BatteryBottomToSwitchSegment( endPoint, switchConnectionPoint );
      }
    },

    getLightBulbToSwitchSegment: function( connectionPoint, circuitSwitch, endPoint ) {
      var switchConnectionPoint;
      if ( connectionPoint === ConnectionPoint.TOP ) {
        switchConnectionPoint = circuitSwitch.getLightBulbConnectionPoint();
        return new WireSegment( endPoint, switchConnectionPoint );
      }
      else {
        switchConnectionPoint = circuitSwitch.getLightBulbConnectionPoint();
        return new WireSegment( endPoint, switchConnectionPoint );
      }
    },

    getCapacitorToSwitchSegment: function( connectionPoint, circuitSwitch, capacitor ) {
      var switchConnectionPoint = circuitSwitch.getCapacitorConnectionPoint();
      if ( connectionPoint === ConnectionPoint.TOP ) {
        return WireSegment.ComponentTopWireSegment( capacitor, switchConnectionPoint );
      }
      else {
        return WireSegment.ComponentBottomWireSegment( capacitor, switchConnectionPoint );
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
      if ( connectionPoint === ConnectionPoint.TOP ) {
        return WireSegment.VerticalTopWireSegment( battery, startPoint );
      }
      else if ( connectionPoint === ConnectionPoint.BOTTOM ) {
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
      if ( connectionPoint === ConnectionPoint.TOP ) {
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
    WireCapacitorToCircuitSwitchTop: function( modelViewTransform, thickness, capacitor, circuitSwitch ) {
      return new WireCapacitorToCircuitSwitch( ConnectionPoint.TOP, modelViewTransform, thickness, capacitor, circuitSwitch );
    },

    WireCapacitorToCircuitSwitchBottom: function( modelViewTransform, thickness, capacitor, circuitSwitch ) {
      return new WireCapacitorToCircuitSwitch( ConnectionPoint.BOTTOM, modelViewTransform, thickness, capacitor, circuitSwitch);
    }

  } );

} );