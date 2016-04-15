// Copyright 2015, University of Colorado Boulder

/**
 * A straight segment of wire. One or more segments are joined to create a Wire.  Contains factory functions to
 * construct wire segments for each of the circuit components, since segments will need unique functions to update
 * their geometry depending on the components they connect.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var Vector2 = require( 'DOT/Vector2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  /**
   * Constructor for a WireSegment.
   */
  function WireSegment( startPoint, endPoint ) {
    // @public
    PropertySet.call( this, {
      startPoint: startPoint,
      endPoint: endPoint
    } );
  }

  capacitorLabBasics.register( 'WireSegment', WireSegment );
  
  inherit( PropertySet, WireSegment, {}, {

    // Factory methods to construct various wire segments for the different
    
    /**
     * Return a WireSegment that attaches to the top of a battery
     * @param {Battery} battery
     * @param {Vector2} endPoint - end point for the wire segment
     * @constructor
     */
    BatteryTopWireSegment: function( battery, endPoint ) {
      return new BatteryTopWireSegment( battery, endPoint );
    },

    /**
     * Return a WireSegment that attaches to the bottom of a battery
     * @param {Battery} battery
     * @param {Vector2} endPoint - end point for the wire segment
     * @constructor
     */
    BatteryBottomWireSegment: function( battery, endPoint ) {
      return new BatteryBottomWireSegment( battery, endPoint );
    },

    /**
     * Return a WireSegment that attaches to the top of a circuit component
     * @param {Capacitor || LightBulb} component
     * @param {Vector2} endPoint - end point for the wire segment
     * @constructor
     */
    ComponentTopWireSegment: function( component, endPoint ) {
      return new ComponentTopWireSegment( component, endPoint );
    },

    /**
     * Return a WireSegment that attaches to the bottom of a circuit component
     * @param {Capacitor || Lightbulb} component
     * @param {Vector2} endPoint - end point for the wire segment
     * @constructor
     */
    ComponentBottomWireSegment: function( component, endPoint ) { 
      return new ComponentBottomWireSegment( component, endPoint );
    },

    /**
     * Return a WireSegment acts as a switch between two connection points
     * @param {Vector2} startPoint - start point for the switch segment
     * @param {Vector2} endPoint - end point for the wire segment
     * @constructor
     */
    SwitchSegment: function( startPoint, endPoint ) {
      return new SwitchSegment( startPoint, endPoint );
    },

    /**
     * Return a WireSegment that attaches a battery top to a switch segment 
     * @param {Vector2} startPoint
     * @param {Vector2} endPoint
     * @constructor
     */
    BatteryTopToSwitchSegment: function( startPoint, endPoint ) {
      return new WireSegment( startPoint, endPoint );
    },

    /**
     * Return a WireSegment that attaches a battery bottom to a switch segment
     * @param {Vector2} startPoint
     * @param {Vector2} endPoint
     * @constructor
     */
    BatteryBottomToSwitchSegment: function( startPoint, endPoint ) {
      return new WireSegment( startPoint, endPoint );
    }
  } );

  /**
   * Constructor for a ComponentWireSegment.  This is any wire segment that is connected to one circuit component.
   *
   * @param {Capacitor || LightBulb} component
   * @param {Vector2} startPoint
   * @param {Vector2} endPoint
   */
  function ComponentWireSegment( component, startPoint, endPoint ) {
    WireSegment.call( this, startPoint, endPoint );
    this.component = component;
  }

  capacitorLabBasics.register( 'ComponentWireSegment', ComponentWireSegment );

  inherit( WireSegment, ComponentWireSegment );

  /**
   * Constructor for ComponentTopWireSegment.  This is a wire segment whose start point is connected to the top 
   * connection point of a component.  Adjusts the wire geometry when the component changes geometry or orientation.
   *
   * @param {Capacitor || LightBulb} component
   * @param {Vector2} endPoint
   */
  function ComponentTopWireSegment( component, endPoint ) {
    ComponentWireSegment.call( this, component, component.getTopConnectionPoint().toVector2(), endPoint );
  }

  capacitorLabBasics.register( 'ComponentTopWireSegment', ComponentWireSegment );

  inherit( ComponentWireSegment, ComponentTopWireSegment, {
    // update the start point of the segment, called when the component geometry changes
    update: function() {
      this.startPoint = this.component.getTopConnectionPoint().toVector2();
    }
  } );

  /**
   * Constructor for ComponentBottomWireSegment.  Wire segment whose start point is connected to the bottom connection 
   * point of a component.  Adjusts the start point when the component geometry changes.
   *
   * @param {Capacitor || LightBulb} component
   * @param {Vector2} endPoint
   */
  function ComponentBottomWireSegment( component, endPoint ) {
    ComponentWireSegment.call( this, component, component.getBottomConnectionPoint().toVector2(), endPoint );
  }

  capacitorLabBasics.register( 'ComponentBottomWireSegment', ComponentBottomWireSegment );

  inherit( ComponentWireSegment, ComponentBottomWireSegment, {
    // update the start point of the segment, called when the component geometry changes
    update: function() {
      this.startPoint = this.component.getBottomConnectionPoint().toVector2();
    }
  } );

  /**
   *  Constructor for a BatteryWireSegment.  This includes any wire segment that is connected to a battery.
   *
   *  @param {Battery} battery
   *  @param {Vector2} startPoint
   *  @param {Vector2} endPoint
   */
  function BatteryWireSegment( battery, startPoint, endPoint ) {
    WireSegment.call( this, startPoint, endPoint );
    this.battery = battery;
  }

  capacitorLabBasics.register( 'BatteryWireSegment', BatteryWireSegment );

  inherit( WireSegment, BatteryWireSegment );

  /**
   * Constructor for a BatteryTopWireSegment.  This is a wire segment whose start point is connected to the top terminal
   * of a battery.  Adjusts the start point when the battery's polarity changes.
   *
   * @param {Battery} battery
   * @param {Vector2} endPoint
   */
  function BatteryTopWireSegment( battery, endPoint ) {
    BatteryWireSegment.call( this, battery, new Vector2( battery.location.x, battery.location.y + battery.getTopTerminalYOffset() ), endPoint );
  }

  capacitorLabBasics.register( 'BatteryTopWireSegment', BatteryTopWireSegment );

  inherit( BatteryWireSegment, BatteryTopWireSegment, {
    // update the start point of the battery top segment, called when the battery changes polarity
    update: function() {
      var battery = this.battery;
      this.startPoint = new Vector2( battery.location.x, battery.location.y + battery.getTopTerminalYOffset() );
    }
  } );

  /**
   * Constructor for a BatteryBottomWireSegment.  This is a wire segment whose start point is connected to the bottom
   * terminal of a battery.  Adjusts the start point when the battery's polarity changes.
   *
   * @param {Battery} battery
   * @param {Vector2} endPoint
   */
  function BatteryBottomWireSegment( battery, endPoint ) {
    BatteryWireSegment.call( this, battery, new Vector2( battery.location.x, battery.location.y + battery.getBottomTerminalYOffset() ), endPoint );
  }

  capacitorLabBasics.register( 'BatteryBottomWireSegment', BatteryBottomWireSegment );

  inherit( BatteryWireSegment, BatteryBottomWireSegment, {
    // update the start point of teh battery bottom segment, called when battery changes polarity
    update: function() {
      var battery = this.battery;
      this.startPoint = new Vector2( this.battery.location.x, this.battery.location.y + battery.getBottomTerminalYOffset() );
    }
  } );

  /**
   * Constructor for a switch segment.  End point of the switch segment will change depending on the connection
   * state of the circutit.
   *
   * @param {Vector2} hingePoint
   * @param {Object} activeConnection
   * @constructor
   */
  function SwitchSegment( hingePoint, activeConnection ) {
    this.activeConnection = activeConnection;
    this.hingePoint = hingePoint;
    WireSegment.call( this, hingePoint, activeConnection.location );
  }

  capacitorLabBasics.register( 'SwitchSegment', SwitchSegment );

  inherit( WireSegment, SwitchSegment, {

    // update the endpoint for the switch segment, called when the connection point of the circuit changes
    update: function( activeConnection, angle ) {
      // set the new active connection point
      this.endPoint = activeConnection.location;
    }
  } );

  return WireSegment;

} );
