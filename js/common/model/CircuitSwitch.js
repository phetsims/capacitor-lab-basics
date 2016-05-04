// Copyright 2016, University of Colorado Boulder

/**
 * Circuit switch.  The circuit switch has a start point and an end point.  The start point acts as a hinge, and
 * the end point can switch to new connection points.  It is assumed that the circuit switch is connected to
 * a capacitor in this simulation.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Wire = require( 'CAPACITOR_LAB_BASICS/common/model/wire/Wire' );
  var WireSegment = require( 'CAPACITOR_LAB_BASICS/common/model/wire/WireSegment' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var CircuitConnectionEnum = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitConnectionEnum' );
  var PropertySet = require( 'AXON/PropertySet' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  /**
   * Constructor for a CircuitSwitch.
   *
   * @param {Vector3} hingePoint
   * @param {Array<Object>} connections - array of objects that look like { location: Vector3, connectionType: string }
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Property} circuitConnectionProperty,
   * @param {string} connectionLocation
   */
  function CircuitSwitch( hingePoint, connections, modelViewTransform,
    circuitConnectionProperty, connectionLocation, tandem ) {

    // @private
    this.initialAngle = 0; // with respect to the vertical ( open switch )
    this.modelViewTransform = modelViewTransform;
    this.connections = connections;

    // @public
    this.hingePoint = hingePoint;
    this.circuitConnectionProperty = circuitConnectionProperty;

    this.activeConnection = this.getConnection( circuitConnectionProperty.value );
    var thisSwitch = this;

    PropertySet.call( this, {
      angle: this.initialAngle
    }, {
      tandemSet: {
        angle: tandem ? tandem.createTandem( 'angleProperty' ) : null
      }
    } );

    // add the switch wire that spans two connection points. Default connection is to the battery.
    this.switchSegment = WireSegment.SwitchSegment( hingePoint, this.activeConnection );
    this.switchWire = new Wire( modelViewTransform, CLBConstants.WIRE_THICKNESS, [ this.switchSegment ], connectionLocation );

    // set active connection whenever circuit connection type changes.
    circuitConnectionProperty.link( function( circuitConnection ) {
      thisSwitch.activeConnection = thisSwitch.getConnection( circuitConnection );
      thisSwitch.switchSegment.update( thisSwitch.activeConnection );
    } );

  }

  capacitorLabBasics.register( 'CircuitSwitch', CircuitSwitch );

  return inherit( PropertySet, CircuitSwitch, {

    /**
     * Get the desired connection from the connection type.
     *
     * @param connectionType
     * @returns {object} returnConnection - object of the format { location: Vector3, connectionType: string }
     */
    getConnection: function( connectionType ) {
      var returnConnection;
      this.connections.forEach( function( connection ) {
        if ( connection.connectionType === connectionType ) {
          returnConnection = connection;
        }
      } );
      if ( returnConnection === 'undefined' ) {
        console.error( 'Requested connection type that does not exist for this circuit' );
      }
      return returnConnection;
    },

    /**
     * Convenience method for getting the connection locations. Similar to getConnection above, but directly returns
     * the location.
     *
     * @param {string} connectionType - BATTERY_CONNECTED || OPEN_CIRCUIT || LIGHT_BULB_CONNECTED
     */
    getConnectionPoint: function( connectionType ) {

      var connection = this.getConnection( connectionType );
      return connection.location.toVector2();
    },

    /**
     * Get the location of the endpoint for the circuit switch segment.
     *
     * @return {Vector2} [description]
     */
    getSwitchEndPoint: function() {
      return this.switchSegment.endPoint.toVector2();
    },

    /**
     * Get the connection point that will be nearest the connecting capacitor.
     *
     * @return {Vector2}
     */
    getCapacitorConnectionPoint: function() {
      return this.hingePoint.toVector2();
    },

    /**
     * Get the limiting angle of the circuit switch to the right.
     * The limiting angle is dependent on wheter a light bulb is connected to the circuit.
     *
     * @return {number}
     */
    getRightLimitAngle: function() {

      var thisSwitch = this;

      var rightConnectionPoint = thisSwitch.getConnectionPoint( CircuitConnectionEnum.OPEN_CIRCUIT );

      this.connections.forEach( function( connection ) {
        if ( connection.connectionType === 'LIGHT_BULB_CONNECTED' ) {
          rightConnectionPoint = thisSwitch.getConnectionPoint( CircuitConnectionEnum.LIGHT_BULB_CONNECTED );
        }
      } );

      return rightConnectionPoint.minus( thisSwitch.hingePoint.toVector2() ).angle();
    },

    /**
     * Get the limiting angle of the circuit switch to the left.
     * @return {[type]} [description]
     */
    getLeftLimitAngle: function() {
      return this.getConnectionPoint( CircuitConnectionEnum.BATTERY_CONNECTED ).minus( this.hingePoint.toVector2() ).angle();
    }
  } );
} );

