// Copyright 2002-2015, University of Colorado Boulder

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

    // Factory methods to publicly construct various segments. TODO: Flesh out with update functions.
    BatteryTopWireSegment: function( battery, startYOffset, endPoint ) { return new BatteryTopWireSegment( battery, startYOffset, endPoint ); },
    BatteryBottomWireSegment: function( battery, startYOffset, endPoint ) { return new BatteryBottomWireSegment( battery, startYOffset, endPoint ); },
    ComponentTopWireSegment: function( component, endPoint ) { return new ComponentTopWireSegment( component, endPoint ); },
    ComponentBottomWireSegment: function( component, endPoint ) { return new ComponentBottomWireSegment( component, endPoint ); },
    VerticalTopWireSegment: function( battery, startPoint ) {
      return new WireSegment( startPoint, new Vector2( startPoint.x, battery.location.y + battery.getTopTerminalYOffset() ) );
    },
    VerticalBottomWireSegment: function( battery, startPoint ) {
      return new WireSegment( startPoint, new Vector2( startPoint.x, battery.location.y + battery.getBottomTerminalYOffset() ) );
    },
    // TODO: Update functions for the following will need to be specified, this will justify factory functions.
    BatteryTopToSwitchSegment: function( startPoint, endPoint ) {
      return new WireSegment( startPoint, endPoint );
    },
    BatteryBottomToSwitchSegment: function( startPoint, endPoint ) {
      return new WireSegment( startPoint, endPoint );
    },
    LightBulbTopWireSegment: function( startPoint, endPoint ) {
      return new WireSegment( startPoint, endPoint );
    },
    LightBulbBottomWireSegment: function( startPoint, endPoint ) {
      return new WireSegment( startPoint, endPoint );
    },
    BulbTopToSwitchSegment: function( startPoint, endPoint ) {
      return new WireSegment( startPoint, endPoint );
    },
    BulbBottomToSwitchSegment: function( startPoint, endPoint ) {
      return new WireSegment( startPoint, endPoint );
    },
    CapacitorTopToSwitchSegment: function( startPoint, endPoint ) {
      return new WireSegment( startPoint, endPoint );
    },
    CapacitorBottomToSwitchSegment: function( startPoint, endPoint ) {
      return new WireSegment( startPoint, endPoint );
    },
    SwitchSegment: function( startPoint, endPoint ) {
      return new SwitchSegment( startPoint, endPoint );
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
    //component.addPlateSeparationObserver(); TODO
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
  function ComponentTopWireSegment( component, startPoint ) {
    ComponentWireSegment.call( this, component, startPoint, component.getTopConnectionPoint().toVector2() );
  }

  inherit( ComponentWireSegment, ComponentTopWireSegment, {
    update: function() {
      this.endPoint = this.component.getTopConnectionPoint().toVector2();
    }
  } );

  /**
   * Constructor for ComponentBottomWireSegment.  Wire segment whose start point is connected to the bottom plate of a
   * component.  Adjusts the start point when the plate separation changes.
   *
   * @param {Capacitor || LightBulb} component
   * @param {Vector2} endPoint
   */
  function ComponentBottomWireSegment( component, startPoint ) {
    ComponentWireSegment.call( this, component, startPoint, component.getBottomConnectionPoint().toVector2() );
  }

  inherit( ComponentWireSegment, ComponentBottomWireSegment, {
    update: function() {
      this.endPoint = this.component.getBottomConnectionPoint().toVector2();
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

    //topCapacitor.addPlateSeparationObserver( this ); TODO
    //bottomCapacitor.addPlateSeparationObserver( this ); TODO

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
   *  @param {number} startYOffset
   *  @param {Vector2} startPoint
   *  @param {Vector2} endPoint
   */
  function BatteryWireSegment( battery, startYOffset, startPoint, endPoint ) {
    WireSegment.call( this, startPoint, endPoint );
    this.battery = battery;
    this.startYOffset = startYOffset;
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
   * @param {number} startYOffset
   * @param {Vector2} endPoint
   */
  function BatteryTopWireSegment( battery, startYOffset, endPoint ) {
    BatteryWireSegment.call( this, battery, startYOffset, new Vector2( battery.location.x, battery.location.y + battery.getTopTerminalYOffset() ), endPoint );
  }

  inherit( BatteryWireSegment, BatteryTopWireSegment, {
    update: function() {
      var battery = this.battery;
      this.startPoint = new Vector2( battery.location.x, battery.location.y + battery.getTopTerminalYOffset() - this.startYOffset );
    }
  } );

  /**
   * Constructor for a BatteryBottomWireSegment.  This is a wire segment whose start point is connected to the bottom
   * terminal of a battery.  Adjusts the start point when the battery's polarity changes.
   *
   * @param {Battery} battery
   * @param {number} startYOffset
   * @param {Vector2} endPoint
   */
  function BatteryBottomWireSegment( battery, startYOffset, endPoint ) {
    BatteryWireSegment.call( this, battery, startYOffset, new Vector2( battery.location.x, battery.location.y + battery.getBottomTerminalYOffset() ), endPoint );
  }

  inherit( BatteryWireSegment, BatteryBottomWireSegment, {
    update: function() {
      var battery = this.battery;
      this.startPoint = new Vector2( this.battery.location.x, this.battery.location.y + battery.getBottomTerminalYOffset() + this.startYOffset );
    }
  } );

  /**
   *
   * @param hingePoint
   * @param connectionPoint
   * @constructor
   */
  function SwitchSegment( hingePoint, activeConnection ) {
    WireSegment.call( this, hingePoint, activeConnection.location );
  }

  inherit( WireSegment, SwitchSegment, {

    update: function( activeConnection ) {
      this.endPoint = activeConnection.location;
    }
  } );

  return WireSegment;

} );
