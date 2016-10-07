// Copyright 2016, University of Colorado Boulder

/**
 * Circuit switch.  The circuit switch has a start point and an end point.  The start point acts as a hinge, and
 * the end point can switch to new connection points.  It is assumed that the circuit switch is connected to
 * a capacitor in this simulation.
 *
 * @author Jesse Greenberg
 * @author Andrew Adare
 */
define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CircuitConnectionEnum = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitConnectionEnum' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector2 = require( 'DOT/Vector2' );
  var Vector3 = require( 'DOT/Vector3' );
  var Wire = require( 'CAPACITOR_LAB_BASICS/common/model/wire/Wire' );
  var WireSegment = require( 'CAPACITOR_LAB_BASICS/common/model/wire/WireSegment' );

  // phet-io modules
  var TNumber = require( 'ifphetio!PHET_IO/types/TNumber' );

  // constants
  var SWITCH_ANGLE = Math.PI / 4; // angle from the vertical of each connection point

  /**
   * Constructor for a CircuitSwitch.
   *
   * @param {string} positionLabel - 'top' or 'bottom'
   * @param {CircuitConfig} config
   * @param {Property.<string>} circuitConnectionProperty
   * @param {Tandem} tandem
   */
  function CircuitSwitch( positionLabel, config, circuitConnectionProperty, tandem ) {

    // Validate positionLabel string
    assert && assert( positionLabel === 'top' || positionLabel === 'bottom',
      'Unsupported positionLabel: ' + positionLabel );

    // @public
    this.hingePoint = this.getSwitchHingePoint( positionLabel, config );
    this.circuitConnectionProperty = circuitConnectionProperty;

    // @private
    this.initialAngle = 0; // with respect to the vertical ( open switch )
    this.modelViewTransform = config.modelViewTransform;
    this.connections = this.getSwitchConnections( positionLabel, this.hingePoint.toVector2(), config.circuitConnections );
    this.activeConnection = this.getConnection( circuitConnectionProperty.value );
    var self = this;

    var properties = {
      angle: {
        tandem: tandem && tandem.createTandem( 'angleProperty' ),
        phetioValueType: TNumber( { units: 'radians' } )
      }
    };

    PropertySet.call( this, { angle: this.initialAngle }, properties );

    // Assign string identifying connection point
    var connectionName = ( positionLabel === 'top' ) ?
                         CLBConstants.WIRE_CONNECTIONS.CIRCUIT_SWITCH_TOP :
                         CLBConstants.WIRE_CONNECTIONS.CIRCUIT_SWITCH_BOTTOM;

    // Add the switch wire that spans two connection points. Default connection is to the battery.
    // Allow null instead of tandem if this component is part of a temporary circuit used for calculations.
    this.switchSegment = WireSegment.createSwitchSegment( this.hingePoint, this.activeConnection,
      tandem ? tandem.createTandem( 'switchSegment' ) : null );

    this.switchWire = new Wire( this.modelViewTransform, CLBConstants.WIRE_THICKNESS, [ this.switchSegment ],
      connectionName /*, tandem.createTandem( 'switchWire' )*/ );

    // set active connection whenever circuit connection type changes.
    circuitConnectionProperty.link( function( circuitConnection ) {
      // if the switch is being dragged, it is in transit and there is no active connection yet
      if ( circuitConnection === CircuitConnectionEnum.IN_TRANSIT ) {
        return;
      }
      self.activeConnection = self.getConnection( circuitConnection );
      self.switchSegment.update( self.activeConnection );
    } );

  }

  capacitorLabBasics.register( 'CircuitSwitch', CircuitSwitch );

  return inherit( PropertySet, CircuitSwitch, {

    /**
     * Get (x,y,z) position of switch pivot point
     *
     * @param  {string} positionLabel - 'top' or 'bottom'
     * @param  {CircuitConfig} config - Class containing circuit geometry and properties
     *
     * @return {Vector3}
     * @private
     */
    getSwitchHingePoint: function( positionLabel, config ) {

      // Validate positionLabel string
      assert && assert( positionLabel === 'top' || positionLabel === 'bottom',
        'Unsupported positionLabel: ' + positionLabel );

      // create the circuit switches that connect the capacitor to the circuit
      var x = config.batteryLocation.x + config.capacitorXSpacing;
      var z = config.batteryLocation.z;

      var yOffset = CLBConstants.PLATE_SEPARATION_RANGE.max + CLBConstants.SWITCH_Y_SPACING;
      var y = config.batteryLocation.y;

      if ( positionLabel === 'top' ) {
        y -= yOffset;
      }
      else if ( positionLabel === 'bottom' ) {
        y += yOffset;
      }

      return new Vector3( x, y, z );
    },

    /**
     * Get an array of objects containing locations (as Vector3) and connection types (as strings)
     * of the bottom switch connection points
     *
     * @param  {string} positionLabel - 'top' or 'bottom'
     * @param  {Vector2} hingeXY - Location of switch hinge
     * @param  {CircuitConfig} config - Class containing circuit geometry and properties
     *
     * @return {Object[]} - Array of Objects containing connection points and types
     * @private
     */
    getSwitchConnections: function( positionLabel, hingeXY, circuitConnections ) {

      // Projection of switch wire vector to its components (angle is from a vertical wire)
      var l = CLBConstants.SWITCH_WIRE_LENGTH;
      var dx = l * Math.sin( SWITCH_ANGLE );
      var dy = l * Math.cos( SWITCH_ANGLE );

      // Top point of hinge from pivot point
      var topOffset = new Vector2( 0, l );

      // Compute 2D switch contact points
      var topPoint;
      var leftPoint;
      var rightPoint;

      if ( positionLabel === 'top' ) {
        topPoint = hingeXY.minus( topOffset );
        leftPoint = hingeXY.minusXY( dx, dy );
        rightPoint = hingeXY.minusXY( -dx, dy );
      }
      else {
        topPoint = hingeXY.plus( topOffset );
        leftPoint = hingeXY.plusXY( -dx, dy );
        rightPoint = hingeXY.plusXY( dx, dy );
      }

      var connections = [];
      circuitConnections.forEach( function( circuitSwitchConnection ) {
        if ( circuitSwitchConnection === CircuitConnectionEnum.OPEN_CIRCUIT ) {
          connections.push( {
            location: topPoint.toVector3(),
            connectionType: circuitSwitchConnection
          } );
        }
        else if ( circuitSwitchConnection === CircuitConnectionEnum.BATTERY_CONNECTED ) {
          connections.push( {
            location: leftPoint.toVector3(),
            connectionType: circuitSwitchConnection
          } );
        }
        else if ( circuitSwitchConnection === CircuitConnectionEnum.LIGHT_BULB_CONNECTED ) {
          connections.push( {
            location: rightPoint.toVector3(),
            connectionType: circuitSwitchConnection
          } );
        }
        else {
          assert && assert( 'attempting to create switch conection which is not supported' );
        }
      } );

      return connections;
    },

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

      var self = this;

      var rightConnectionPoint = self.getConnectionPoint( CircuitConnectionEnum.OPEN_CIRCUIT );

      this.connections.forEach( function( connection ) {
        if ( connection.connectionType === 'LIGHT_BULB_CONNECTED' ) {
          rightConnectionPoint = self.getConnectionPoint( CircuitConnectionEnum.LIGHT_BULB_CONNECTED );
        }
      } );

      return rightConnectionPoint.minus( self.hingePoint.toVector2() ).angle();
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

