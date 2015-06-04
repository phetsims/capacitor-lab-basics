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
    }
  }, {

    // Factory methods to publicly construct various segments.
    BatteryTopWireSegment: function( battery, startYOffset, endPoint ) { return new BatteryTopWireSegment( battery, startYOffset, endPoint ); },
    BatteryBottomWireSegment: function( battery, startYOffset, endPoint ) { return new BatteryBottomWireSegment( battery, startYOffset, endPoint ); },
    CapacitorTopWireSegment: function( capacitor, endPoint ) { return new CapacitorTopWireSegment( capacitor, endPoint ); },
    CapacitorBottomWireSegment: function( capacitor, endPoint ) { return new CapacitorBottomWireSegment( capacitor, endPoint ); }

  } );

  /**
   * Constructor for a CapacitorWireSegment.  This is any wire segment that is connected to one capacitor.
   *
   * @param {Capacitor} capacitor
   * @param {Vector2} startPoint
   * @param {Vector2} endPoint
   */
  function CapacitorWireSegment( capacitor, startPoint, endPoint ) {
    WireSegment.call( this, startPoint, endPoint );
    this.capacitor = capacitor;
    //capacitor.addPlateSeparationObserver(); TODO
  }

  inherit( WireSegment, CapacitorWireSegment, {
    cleanUp: function() {
      //capacitor.removePlateSeparationObserver(); TODO
    }
  } );


  /**
   * Constructor for CapacitorTopWireSegment.  This is a wire segment whose start point is connected to the top plate
   * of a capacitor.  Adjusts the start point when the plate separation changes.
   *
   * @param {Capacitor} capacitor
   * @param {Vector2} endPoint
   */
  function CapacitorTopWireSegment( capacitor, endPoint ) {
    CapacitorWireSegment.call( capacitor, capacitor.getTopPlateCenter(), endPoint );
  }

  inherit( CapacitorWireSegment, CapacitorTopWireSegment, {
    update: function() {
      this.startPoint = this.capacitor.getTopPlateCenter();
    }
  } );

  /**
   * Constructor for CapacitorBottomWireSegment.  Wire segment whose start point is connected to the bottom plate of a
   * capacitor.  Adjusts the start point when the plate separation changes.
   *
   * @param {Capacitor} capacitor
   * @param {Vector2} endPoint
   */
  function CapacitorBottomWireSegment( capacitor, endPoint ) {
    CapacitorWireSegment.call( this, capacitor, capacitor.getBottomPlateCenter(), endPoint );
  }

  inherit( CapacitorWireSegment, CapacitorBottomWireSegment, {
    update: function() {
      this.startPoint = this.capacitor.getBottomPlateCenter();
    }
  } );

  /**
   * Constructor for a wire segment that connects the bottom plate of one capacitor to the top plate of another
   * capacitor. Adjusts the start and end points when the plate separations change.
   */
  function CapacitorToCapacitorWireSegment( topCapacitor, bottomCapacitor ) {
    WireSegment.call( this, topCapacitor.getBottomPlateCenter, bottomCapacitor.getTopPlateCenter() );

    this.topCapacitor = topCapacitor;
    this.bottomCapacitor = bottomCapacitor;

    //topCapacitor.addPlateSeparationObserver( this ); TODO
    //bottomCapacitor.addPlateSeparationObserver( this ); TODO

  }

  inherit( WireSegment, CapacitorToCapacitorWireSegment, {
    cleanUp: function() {
      //topCapacitor.removePlateSeparationObserver( this );
      //bottomCapacitor.removePlateSeparationObserver( this );
    },

    update: function() {
      this.startPoint = this.topCapacitor.getBottomPlateCenter();
      this.endPoint = this.bottomCapacitor.getTopPlateCenter();
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
    BatteryWireSegment.call( this, battery, startYOffset, new Vector2( battery.location.x, battery.location.y + battery.getTopTerminalYOffset(), endPoint ) );
  }

  inherit( BatteryWireSegment, BatteryTopWireSegment, {
    update: function() {
      var battery = this.battery;
      this.startPoint = new Vector2( battery.location.x, battery.location.y + battery.location.y + battery.location.getTopTerminalYOffset() - this.startYOffset );
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
    BatteryWireSegment.call( battery, startYOffset, new Vector2( battery.x, battery.y + battery.getBottomTerminalYOffset() ), endPoint );
  }

  inherit( BatteryWireSegment, BatteryBottomWireSegment, {
    update: function() {
      var battery = this.battery;
      this.startPoint = new Vector2( this.battery.location.x, this.battery.location.y + battery.getBottomTerminalYOffset() + this.startYOffset );
    }
  } );

  return WireSegment;

} );
