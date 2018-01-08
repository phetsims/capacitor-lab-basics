// Copyright 2015-2017, University of Colorado Boulder

/**
 * The circuit switch has a hinge point and an end point that can switch to new
 * connection points.  It is assumed that the circuit switch is connected to
 * a capacitor in this simulation.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CircuitLocation = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitLocation' );
  var CircuitState = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitState' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var CLBQueryParameters = require( 'CAPACITOR_LAB_BASICS/common/CLBQueryParameters' );
  var Connection = require( 'CAPACITOR_LAB_BASICS/common/model/Connection' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );
  var Vector3 = require( 'DOT/Vector3' );
  var Wire = require( 'CAPACITOR_LAB_BASICS/common/model/wire/Wire' );
  var WireSegment = require( 'CAPACITOR_LAB_BASICS/common/model/wire/WireSegment' );

  // constants
  var SWITCH_ANGLE = Math.PI / 4; // angle from the vertical of each connection point

  /**
   * @constructor
   *
   * @param {string} positionLabel - 'top' or 'bottom'
   * @param {CircuitConfig} config
   * @param {Property.<CircuitState>} circuitConnectionProperty
   * @param {Tandem} tandem
   */
  function CircuitSwitch( positionLabel, config, circuitConnectionProperty, tandem ) {

    var self = this;

    // Validate positionLabel string
    assert && assert( positionLabel === 'top' || positionLabel === 'bottom',
      'Unsupported positionLabel: ' + positionLabel );

    // @private {boolean} - Removes the 'open circuit' option when a capacitor and light bulb exist
    this.twoStateSwitch = CLBQueryParameters.switch === 'twoState' ? true : false;

    // @public {Vector3}
    this.hingePoint = this.getSwitchHingePoint( positionLabel, config );

    // @private {CLBModelViewTransform3D}
    this.modelViewTransform = config.modelViewTransform;

    // @public {Property.<CircuitState>}
    this.circuitConnectionProperty = circuitConnectionProperty;

    // @private {Array.<Connection>}
    this.connections = this.getSwitchConnections( positionLabel, this.hingePoint.toVector2(), config.circuitConnections );

    // @public {Property.<number>} - Angle of the switch
    this.angleProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'angleProperty' ),
      units: 'radians'
    } );

    // Assign string identifying connection point
    var connectionName = ( positionLabel === 'top' ) ?
                         CircuitLocation.CIRCUIT_SWITCH_TOP :
                         CircuitLocation.CIRCUIT_SWITCH_BOTTOM;

    // @public {WireSegment} Add the switch wire that spans two connection points. Default connection is to the battery.
    this.switchSegment = new WireSegment( this.hingePoint,
      this.getConnection( circuitConnectionProperty.value ).location,
      tandem.createTandem( 'switchSegment' ) );
    this.switchSegment.hingePoint = this.hingePoint;

    // @public {Wire} - Wire between the hinge point and end point
    this.switchWire = new Wire( config.modelViewTransform, [ this.switchSegment ], connectionName );

    this.angleProperty.link( function( angle ) {
      var hingePoint = self.switchSegment.hingePoint;

      // Shorten the switch wire (requested in #140)
      self.switchSegment.endPointProperty.value = hingePoint.plus( Vector2.createPolar( 0.9 * CLBConstants.SWITCH_WIRE_LENGTH, angle ).toVector3() );
    } );

    // set active connection whenever circuit connection type changes.
    circuitConnectionProperty.link( function( circuitConnection ) {

      // If the switch is being dragged, it is in transit and there is no active connection.
      if ( circuitConnection === CircuitState.SWITCH_IN_TRANSIT ) {
        return;
      }

      var wireDelta = self.getConnection( circuitConnection ).location.minus( self.switchSegment.hingePoint );
      self.angleProperty.value = wireDelta.toVector2().angle();
    } );
  }

  capacitorLabBasics.register( 'CircuitSwitch', CircuitSwitch );

  return inherit( Object, CircuitSwitch, {

    /**
     * Get (x,y,z) position of switch pivot point
     * @private
     *
     * @param {string} positionLabel - 'top' or 'bottom'
     * @param {CircuitConfig} config - Class containing circuit geometry and properties
     *
     * @returns {Vector3}
     */
    getSwitchHingePoint: function( positionLabel, config ) {

      // Validate positionLabel string
      assert && assert( positionLabel === 'top' || positionLabel === 'bottom',
        'Unsupported positionLabel: ' + positionLabel );

      // create the circuit switches that connect the capacitor to the circuit
      var x = CLBConstants.BATTERY_LOCATION.x + config.capacitorXSpacing;
      var z = CLBConstants.BATTERY_LOCATION.z;

      var yOffset = CLBConstants.PLATE_SEPARATION_RANGE.max + CLBConstants.SWITCH_Y_SPACING;
      var y = CLBConstants.BATTERY_LOCATION.y;

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
     * of the switch connection points
     * @private
     *
     * @param  {string} positionLabel - 'top' or 'bottom'
     * @param  {Vector2} hingeXY - Location of switch hinge
     * @param  {Array.<CircuitState>} circuitStates
     * @returns {Array.<Connection>}
     */
    getSwitchConnections: function( positionLabel, hingeXY, circuitStates ) {
      // Projection of switch wire vector to its components (angle is from a vertical wire)
      var length = CLBConstants.SWITCH_WIRE_LENGTH;
      var dx = length * Math.sin( SWITCH_ANGLE );
      var dy = length * Math.cos( SWITCH_ANGLE );

      // Top point of hinge from pivot point
      var topOffset = new Vector2( 0, length );

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
      circuitStates.forEach( function( circuitState ) {
        if ( circuitState === CircuitState.OPEN_CIRCUIT ) {
          connections.push( new Connection( topPoint.toVector3(), circuitState ) );
        }
        else if ( circuitState === CircuitState.BATTERY_CONNECTED ) {
          connections.push( new Connection( leftPoint.toVector3(), circuitState ) );
        }
        else if ( circuitState === CircuitState.LIGHT_BULB_CONNECTED ) {
          connections.push( new Connection( rightPoint.toVector3(), circuitState ) );
        }
        else {
          assert && assert( false, 'attempting to create switch conection which is not supported' );
        }
      } );

      return connections;
    },

    /**
     * Get the desired connection from the connection type.
     * @public
     *
     * @param {CircuitState} connectionType
     * @returns {Connection}
     */
    getConnection: function( connectionType ) {

      var returnConnection = _.find( this.connections, function( connection ) {
        return connection.type === connectionType;
      } );

      assert && assert( returnConnection, 'No connection type for this circuit named ' + connectionType );

      return returnConnection;
    },

    /**
     * Convenience method for getting the connection locations. Similar to getConnection above, but directly returns
     * the location.
     * @public
     *
     * @param {CircuitState} connectionType - BATTERY_CONNECTED || OPEN_CIRCUIT || LIGHT_BULB_CONNECTED
     * @returns {Vector3}
     */
    getConnectionPoint: function( connectionType ) {
      assert && assert( connectionType !== CircuitState.SWITCH_IN_TRANSIT,
        'Cannot call getConnectionPoint while SWITCH_IN_TRANSIT' );

      return this.getConnection( connectionType ).location;
    },

    /**
     * Get the location of the endpoint for the circuit switch segment.
     * @public
     *
     * @returns {Vector3}
     */
    getSwitchEndPoint: function() {

      var endPoint = this.switchSegment.endPointProperty.value;

      assert && assert( endPoint instanceof Vector3 );

      return endPoint;
    },

    /**
     * Get the limiting angle of the circuit switch to the right.
     * The limiting angle is dependent on wheter a light bulb is connected to the circuit.
     * @public
     *
     * @returns {number}
     */
    getRightLimitAngle: function() {

      // Get the right-most connection.
      // Would prefer to use _.maxBy, but not available in lodash 2.4.1
      var rightMost = _.last( _.sortBy( this.connections, [ function( connection ) {
        return connection.location.x;
      } ] ) );

      return rightMost.location.minus( this.hingePoint ).toVector2().angle();
    },

    /**
     * Get the limiting angle of the circuit switch to the left.
     * @public
     *
     * @returns {number}
     */
    getLeftLimitAngle: function() {

      // Get the left-most connection.
      // Would prefer to use _.minBy, but not available in lodash 2.4.1
      var leftMost = _.first( _.sortBy( this.connections, [ function( connection ) {
        return connection.location.x;
      } ] ) );

      return leftMost.location.minus( this.hingePoint ).toVector2().angle();
    },

    contacts: function( probe ) {
      var connection = this.circuitConnectionProperty.value;

      // No connection point if it isn't connected
      if ( connection === CircuitState.SWITCH_IN_TRANSIT || connection === CircuitState.OPEN_CIRCUIT ) {
        return false;
      }

      var endPoint = this.switchSegment.endPointProperty.value;
      var hingePoint = this.switchSegment.hingePoint;
      var delta = endPoint.minus( hingePoint ).setMagnitude( CLBConstants.SWITCH_WIRE_LENGTH );
      var point = this.modelViewTransform.modelToViewPosition( hingePoint.plus( delta ) );
      var circle = Shape.circle( point.x, point.y, CLBConstants.CONNECTION_POINT_RADIUS );

      return probe.bounds.intersectsBounds( circle.bounds ) &&
             probe.shapeIntersection( circle ).getNonoverlappingArea() > 0;

    }
  }, {

    /**
     * Factory method for a top CircuitSwitch
     * @public
     *
     * @param {CircuitConfig} config
     * @param {Property.<CircuitState>} circuitConnectionProperty
     * @param {Tandem} tandem
     * @returns {CircuitSwitch}
     */
    TOP: function( config, circuitConnectionProperty, tandem ) {
      return new CircuitSwitch( 'top', config, circuitConnectionProperty, tandem );
    },

    /**
     * Factory method for a bottom CircuitSwitch
     * @public
     *
     * @param {CircuitConfig} config
     * @param {Property.<CircuitState>} circuitConnectionProperty
     * @param {Tandem} tandem
     * @returns {CircuitSwitch}
     */
    BOTTOM: function( config, circuitConnectionProperty, tandem ) {
      return new CircuitSwitch( 'bottom', config, circuitConnectionProperty, tandem );
    }
  } );
} );
