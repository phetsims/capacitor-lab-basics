// Copyright 2015, University of Colorado Boulder

/**
 * A straight segment of wire. One or more segments are joined to create a wire.
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

  inherit( PropertySet, WireSegment, {
    cleanUp: function() {
      console.log( 'cleanUp must be implemented in subclasses.' );
    },

    update: function() {
      // TODO: Catch updates for segments that do not need this function.
      //console.log( ' this segment does not have an update function.' );
    }
  }, {

    // Factory methods to construct various wire segments.
    BatteryTopWireSegment: function( battery, endPoint ) { return new BatteryTopWireSegment( battery, endPoint ); },
    BatteryBottomWireSegment: function( battery, endPoint ) { return new BatteryBottomWireSegment( battery, endPoint ); },
    ComponentTopWireSegment: function( component, endPoint ) { return new ComponentTopWireSegment( component, endPoint ); },
    ComponentBottomWireSegment: function( component, endPoint ) { return new ComponentBottomWireSegment( component, endPoint ); },
    SwitchSegment: function( startPoint, endPoint ) { return new SwitchSegment( startPoint, endPoint ); },

    BatteryTopToSwitchSegment: function( startPoint, endPoint ) {
      return new WireSegment( startPoint, endPoint );
    },
    BatteryBottomToSwitchSegment: function( startPoint, endPoint ) {
      return new WireSegment( startPoint, endPoint );
    }
  } );

  /**
   * Constructor for a ComponentWireSegment.  This is any wire segment that is connected to one component.
   *
   * @param {Capacitor || LightBulb} component
   * @param {Vector2} startPoint
   * @param {Vector2} endPoint
   */
  function ComponentWireSegment( component, startPoint, endPoint ) {
    WireSegment.call( this, startPoint, endPoint );
    this.component = component;
  }

  inherit( WireSegment, ComponentWireSegment, {
    cleanUp: function() {
      //component.removePlateSeparationObserver(); TODO
    }
  } );

  /**
   * Constructor for ComponentTopWireSegment.  This is a wire segment whose start point is connected to the top plate
   * of a component.  Adjusts the start point when the plate separation changes.
   *
   * @param {Capacitor || LightBulb} component
   * @param {Vector2} endPoint
   */
  function ComponentTopWireSegment( component, endPoint ) {
    ComponentWireSegment.call( this, component, component.getTopConnectionPoint().toVector2(), endPoint );
  }

  inherit( ComponentWireSegment, ComponentTopWireSegment, {
    update: function() {
      this.startPoint = this.component.getTopConnectionPoint().toVector2();
    }
  } );

  /**
   * Constructor for ComponentBottomWireSegment.  Wire segment whose start point is connected to the bottom plate of a
   * component.  Adjusts the start point when the plate separation changes.
   *
   * @param {Capacitor || LightBulb} component
   * @param {Vector2} endPoint
   */
  function ComponentBottomWireSegment( component, endPoint ) {
    ComponentWireSegment.call( this, component, component.getBottomConnectionPoint().toVector2(), endPoint );
  }

  inherit( ComponentWireSegment, ComponentBottomWireSegment, {
    update: function() {
      this.startPoint = this.component.getBottomConnectionPoint().toVector2();
    }
  } );

  /**
   * Constructor for a wire segment that connects the bottom plate of one component to the top plate of another
   * component. Adjusts the start and end points when the plate separations change.
   */
  function ComponentToComponentWireSegment( topComponent, bottomComponent ) {
    WireSegment.call( this, topComponent.getBottomConnectionPoint().toVector2(), bottomComponent.getTopConnectionPoint().toVector2() );

    this.topComponent = topComponent;
    this.bottomComponent = bottomComponent;

  }

  inherit( WireSegment, ComponentToComponentWireSegment, {
    cleanUp: function() {
      //topCapacitor.removePlateSeparationObserver( this );
      //bottomCapacitor.removePlateSeparationObserver( this );
    },

    update: function() {
      this.startPoint = this.topComponent.getBottomConnectionPoint().toVector2();
      this.endPoint = this.bottomComponent.getTopConnectionPoint().toVector2();
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
    //battery.addPolarityObserver( this ); TODO
  }

  inherit( WireSegment, BatteryWireSegment, {
    cleanup: function() {
      //battery.removePolarityObserver( this ); TODO
    }
  } );

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

  inherit( BatteryWireSegment, BatteryTopWireSegment, {
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

  inherit( BatteryWireSegment, BatteryBottomWireSegment, {
    update: function() {
      var battery = this.battery;
      this.startPoint = new Vector2( this.battery.location.x, this.battery.location.y + battery.getBottomTerminalYOffset() );
    }
  } );

  /**
   * Constructor for a switch segment.
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

  inherit( WireSegment, SwitchSegment, {

    update: function( activeConnection, angle ) {
      // set the new active connection.
      this.endPoint = activeConnection.location;
      //else if( angle ){
      //   TODO: Replace 0.0064 with clconstant.
      //var newX = this.hingePoint.x + 0.0064 * Math.cos( angle );
      //var newY = this.hingePoint.y + 0.0064 * Math.sin( angle );
      //this.endPoint = new Vector2( newX, newY );
      //}
    }
  } );

  return WireSegment;

} );
