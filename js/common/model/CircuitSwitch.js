// Copyright 2002-2015, University of Colorado Boulder

/**
 * Circuit switch.  The circuit switch has a start point and an end point.  The start point acts as a hinge, and the end
 * point can switch to new connection points.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Wire = require( 'CAPACITOR_LAB_BASICS/common/model/wire/Wire' );
  var WireSegment = require( 'CAPACITOR_LAB_BASICS/common/model/wire/WireSegment' );
  var CLConstants = require( 'CAPACITOR_LAB_BASICS/common/CLConstants' );
  var CircuitConnectionEnum = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitConnectionEnum' );
  var PropertySet = require( 'AXON/PropertySet' );

  // constants
  var SWITCH_ANGLE = Math.PI / 4;

  /**
   * Constructor for a CircuitSwitch.
   *
   * @param {Vector3} hingePoint
   * @param {object} connections
   * @param {CLModelViewTransform3D} modelViewTransform
   * @param {Property} circuitConnectionProperty
   */
  function CircuitSwitch( hingePoint, connections, modelViewTransform, circuitConnectionProperty ) {

    this.initialAngle = 0; // with respect to the vertical ( open switch )

    this.hingePoint = hingePoint;
    this.connections = connections;
    this.modelViewTransform = modelViewTransform;
    this.circuitConnectionProperty = circuitConnectionProperty;

    this.activeConnection = this.getConnection( CircuitConnectionEnum.BATTERY_CONNECTED );
    var thisSwitch = this;

    PropertySet.call( this, {
      angle: this.initialAngle
    } );

    // add the switch wire that spans two connection points. Default connection is battery.
    this.switchSegment = WireSegment.SwitchSegment( hingePoint, this.activeConnection );
    this.switchWire = new Wire( modelViewTransform, CLConstants.WIRE_THICKNESS, [ this.switchSegment ] );

    // set active connection whenever circuit connection type changes.
    circuitConnectionProperty.link( function( circuitConnection ) {
      thisSwitch.activeConnection = thisSwitch.getConnection( circuitConnection );
      thisSwitch.switchSegment.update( thisSwitch.activeConnection );
    } );

  }

  return inherit( PropertySet, CircuitSwitch, {

    /**
     * Get the disired connection from the connection type.
     * @param connectionType
     * @returns {object}
     */
    getConnection: function( connectionType ) {
      var returnConnection;
      this.connections.forEach( function( connection ) {
        if ( connection.connectionType === connectionType ) {
          returnConnection = connection;
        }
      } );
      if( returnConnection === 'undefined' ) {
        console.error( 'Requested connection type that does not exist for this circuit' );
      }
      return returnConnection;

    },


    // TODO: All of these functions should be removed and replaced throughout with calls to getConnection() above.
    getBatteryConnectionPoint: function() {
      var connectionPoint;
      this.connections.forEach( function( connection ) {
        if ( connection.connectionType === CircuitConnectionEnum.BATTERY_CONNECTED ) {
          connectionPoint = connection.location;
        }
      } );
      return connectionPoint.toVector2();
    },

    getLightBulbConnectionPoint: function() {
      var connectionPoint;
      this.connections.forEach( function( connection ) {
        if ( connection.connectionType === CircuitConnectionEnum.LIGHT_BULB_CONNECTED ) {
          connectionPoint = connection.location;
        }
      } );
      return connectionPoint;
    },

    getOpenConnectionPoint: function() {
      var connectionPoint;
      this.connections.forEach( function( connection ) {
        if ( connection.connectionType === CircuitConnectionEnum.OPEN_CIRCUIT ) {
          connectionPoint = connection.location;
        }
      } );
      return connectionPoint;
    },

    getSwitchEndPoint: function() {
      return this.switchSegment.endPoint;
    },


    getCapacitorConnectionPoint: function() {
      return this.hingePoint;
    }
  }, {

    CircuitTopSwitch: function( hingePoint, modelViewTransform, circuitConnectionProperty ) {

      var topPoint = hingePoint.toVector2().minusXY( 0, CLConstants.SWITCH_WIRE_LENGTH );
      var leftPoint = hingePoint.toVector2().minusXY(
        CLConstants.SWITCH_WIRE_LENGTH * Math.sin( SWITCH_ANGLE  ),
        CLConstants.SWITCH_WIRE_LENGTH * Math.cos( SWITCH_ANGLE  )
      );
      var rightPoint = hingePoint.toVector2().minusXY(
        -CLConstants.SWITCH_WIRE_LENGTH * Math.sin( SWITCH_ANGLE  ),
        CLConstants.SWITCH_WIRE_LENGTH * Math.cos( SWITCH_ANGLE  )
      );
      var connections = [
        {
          location: topPoint.toVector3(),
          connectionType: CircuitConnectionEnum.OPEN_CIRCUIT
        },
        {
          location: leftPoint.toVector3(),
          connectionType: CircuitConnectionEnum.BATTERY_CONNECTED
        },
        {
          location: rightPoint.toVector3(),
          connectionType: CircuitConnectionEnum.LIGHT_BULB_CONNECTED
        }
      ];

      return new CircuitSwitch( hingePoint, connections, modelViewTransform, circuitConnectionProperty );
    },

    CircuitBottomSwitch: function( hingePoint, modelViewTransform, circuitConnectionProperty ) {

      var topPoint = hingePoint.toVector2().plusXY( 0, CLConstants.SWITCH_WIRE_LENGTH );
      var rightPoint = hingePoint.toVector2().plusXY(
        CLConstants.SWITCH_WIRE_LENGTH * Math.sin( SWITCH_ANGLE  ),
        CLConstants.SWITCH_WIRE_LENGTH * Math.cos( SWITCH_ANGLE  )
      );
      var leftPoint = hingePoint.toVector2().plusXY(
        -CLConstants.SWITCH_WIRE_LENGTH * Math.sin( SWITCH_ANGLE  ),
        CLConstants.SWITCH_WIRE_LENGTH * Math.cos( SWITCH_ANGLE  )
      );
      var connections = [
        {
          location: topPoint.toVector3(),
          connectionType: CircuitConnectionEnum.OPEN_CIRCUIT
        },
        {
          location: leftPoint.toVector3(),
          connectionType: CircuitConnectionEnum.BATTERY_CONNECTED
        },
        {
          location: rightPoint.toVector3(),
          connectionType: CircuitConnectionEnum.LIGHT_BULB_CONNECTED
        }
      ];

      return new CircuitSwitch( hingePoint, connections, modelViewTransform, circuitConnectionProperty );
    }
  } );
} );