// Copyright 2002-2015, University of Colorado Boulder

/**
 * Base class for any wire that connects a battery (B) to one or more circuit components (Z1...Zn).  For Capacitor Lab:
 * Basics, circuit comoponents include a capacitor and a lightBulb.  Circuit components are also connected via
 * switches so that the circuit components can be added and disconnected from the circuit (marked with a (`) in the
 * diagram below).
 *
 * For the "top" subclass, the wire looks like this:
 *
 *
 * |--`--|--`---|--...--|
 * |     |      |       |
 * |     |      |       |
 * B     Z1    Z2       Zn
 *
 * For the "bottom" subclass, the wire looks like this:
 *
 * B     Z1    Z2       Zn
 * |     |      |       |
 * |     |      |       |
 * |--`--|--`---|--...--|
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
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
  //var WireSwitch = require( 'CAPACITOR_LAB_BASICS/common/model/wire/WireSwitch' );

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
   * @param {number} wireExtent how far the wire extends beyond the capacitor, in meters
   * @param {Battery} battery
   * @param {array.<Capacitor>} circuitComponents
   * @param {Property.<string>} circuitConnectionProperty
   * @constructor
   */
  function WireBatteryToCircuitComponents( connectionPoint, modelViewTransform, thickness, wireExtent, componentSpacing, battery, circuitComponents, circuitConnectionProperty ) {

    var segments = [];

    // y coordinate of the horizontal wire
    var horizontalY = this.getHorizontalY( connectionPoint, circuitComponents, wireExtent );
    var leftCorner = new Vector2( battery.location.x, horizontalY );

    // x offset for horizontal wire segments to compensate for the switch
    var xOffset = componentSpacing / 3;

    // add the battery segment
    // TODO: 0 should be getEndOffset
    segments.push( this.getBatteryWireSegment( connectionPoint, battery, 0, leftCorner ) );

    // add the battery switch
    segments.push( WireSegment.SwitchSegment(
      leftCorner.plusXY( 2 * xOffset, 0 ),
      leftCorner.plusXY( xOffset, 0 ),
      xOffset,
      CircuitConnectionEnum.BATTERY_CONNECTED ) );

    // add vertical and horizontal segments for all circuit components (Z1...Zn)
    var startPoint;
    var component;
    for ( var i = 0; i < circuitComponents.length; i++ ) {
      // vertical segments
      component = circuitComponents[ i ];
      startPoint = new Vector2( component.location.x, horizontalY );
      segments.push( this.getComponentWireSegment( connectionPoint, component, startPoint ) );

      // horizontal segments
      segments.push( new WireSegment( startPoint.minusXY( 3 * xOffset, 0 ), startPoint.minusXY( 2 * xOffset, 0 ) ) );
      segments.push( new WireSegment( startPoint.minusXY( xOffset, 0 ), startPoint ) );

      // switches
      //this.segments.push( WireSegment.SwitchSegment( startPoint.minusXY( 2 * xOffset, 0 ), startPoint ) );

    }

    // add the switches for the light bulbs.  At this time, all light bulbs have to be connected at once.
    for ( i = 0; i < circuitComponents.length - 1; i++ ) {
      component = circuitComponents[ i ];
      startPoint = new Vector2( component.location.x, horizontalY );

      segments.push( WireSegment.SwitchSegment(
        startPoint.plusXY( 2 * xOffset, 0 ),
        startPoint.plusXY( xOffset, 0 ),
        xOffset,
        CircuitConnectionEnum.LIGHT_BULB_CONNECTED
      ) );
    }

    Wire.call( this, modelViewTransform, thickness, segments, circuitConnectionProperty );

    // add connecting horizontal segments and switches for all inner components (Z1...Zn-1)
    //for ( i = 0; i < circuitComponents.length - 1; i++ ) {
    //  component = circuitComponents[ i ];
    //  startPoint = new Vector2( component.location.x, horizontalY );

    // horizontal segments
    //this.segments.push( new WireSegment( startPoint.minusXY( 3 * xOffset, 0 ), startPoint.minusXY( 2 * xOffset, 0 ) ) );
    //this.segments.push( new WireSegment( startPoint.minusXY( xOffset, 0 ), startPoint ) );

    //var componentSwitch = new WireSwitch( modelViewTransform, thickness, startPoint, componentSpacing );
    //this.segments = this.segments.concat( componentSwitch.segments );
  }

  //}

  return inherit( Wire, WireBatteryToCircuitComponents, {
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

    /**
     * Gets a wire segment that attaches to the specified terminal (top or bottom) of a battery.
     *
     * @param connectionPoint
     * @param battery
     * @param endOffset
     * @param endPoint
     * @returns {WireSegment}
     */
    getBatteryWireSegment: function( connectionPoint, battery, endOffset, endPoint ) {
      if ( connectionPoint === ConnectionPoint.TOP ) {
        return WireSegment.BatteryTopWireSegment( battery, endOffset, endPoint );
      }
      else {
        return WireSegment.BatteryBottomWireSegment( battery, endOffset, endPoint );
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
    getComponentWireSegment: function( connectionPoint, component, endPoint ) {
      if ( connectionPoint === ConnectionPoint.TOP ) {
        return WireSegment.ComponentTopWireSegment( component, endPoint );
      }
      else {
        return WireSegment.ComponentBottomWireSegment( component, endPoint );
      }
    }

  }, {

    /**
     * Factory functions for public access to specific constructors.
     */
    WireBatteryToCircuitComponentsBottom: function( modelViewTransform, thickness, wireExtent, componentSpacing, battery, circuitComponents, circuitConnectionProperty ) {
      return new WireBatteryToCircuitComponents( ConnectionPoint.BOTTOM, modelViewTransform, thickness, wireExtent, componentSpacing, battery, circuitComponents, circuitConnectionProperty );
    },

    WireBatteryToCircuitComponentsTop: function( modelViewTransform, thickness, wireExtent, componentSpacing, battery, circuitComponents, circuitConnectionProperty ) {
      return new WireBatteryToCircuitComponents( ConnectionPoint.TOP, modelViewTransform, thickness, wireExtent, componentSpacing, battery, circuitComponents, circuitConnectionProperty );
    }

  } );

} );