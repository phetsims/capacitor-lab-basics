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
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector2 = require( 'DOT/Vector2' );

  // phet-io modules
  var TVector2 = require( 'ifphetio!PHET_IO/types/dot/TVector2' );

  /**
   * @param {Vector2} startPoint
   * @param {Vector2|Vector3} endPoint TODO: This is sometimes Vector2 and sometimes Vector3.  Why?  It should probably
   *                                   TODO: just be one or the other.
   * @param {Tandem} tandem
   * @constructor
   */
  function WireSegment( startPoint, endPoint, tandem ) {
    assert&&assert(tandem);
    var properties = {
      startPoint: {
        value: startPoint,
        tandem: tandem.createTandem( 'startPointProperty' ),
        phetioValueType: TVector2,
      },
      endPoint: {
        value: endPoint,
        tandem: tandem.createTandem( 'endPointProperty' ),
        phetioValueType: TVector2
      }
    };

    // @public
    PropertySet.call( this, null, properties );
  }

  capacitorLabBasics.register( 'WireSegment', WireSegment );

  inherit( PropertySet, WireSegment, {}, {

    // Factory methods to construct various wire segments for the different

    /**
     * Factory for a WireSegment that attaches to the top of a battery
     * @param {Battery} battery
     * @param {Vector2} endPoint
     * @param {Tandem} tandem - end point for the wire segment
     */
    createBatteryTopWireSegment: function( battery, endPoint, tandem ) {
      return new BatteryTopWireSegment( battery, endPoint, tandem );
    },

    /**
     * Factory for a WireSegment that attaches to the bottom of a battery
     * @param {Battery} battery
     * @param {Vector2} endPoint
     * @param {Tandem} tandem - end point for the wire segment
     */
    createBatteryBottomWireSegment: function( battery, endPoint, tandem ) {
      return new BatteryBottomWireSegment( battery, endPoint, tandem );
    },

    /**
     * Factory for a ComponentWireSegment that attaches to the top of a circuit component
     * @param {Capacitor || LightBulb} component
     * @param {Vector2} endPoint
     * @param {Tandem} tandem - end point for the wire segment
     */
    createComponentTopWireSegment: function( component, endPoint, tandem ) {
      return new ComponentTopWireSegment( component, endPoint, tandem );
    },

    /**
     * Factory for a ComponentWireSegment that attaches to the bottom of a circuit component
     * @param {Capacitor | LightBulb} component
     * @param {Vector2} endPoint - end point for the wire segment
     * @param {Tandem} tandem
     */
    createComponentBottomWireSegment: function( component, endPoint, tandem ) {
      return new ComponentBottomWireSegment( component, endPoint, tandem );
    },

    /**
     * Factory for a SwitchSegment that acts as a switch between two connection points
     * @param {Vector2} startPoint - start point for the switch segment
     * @param {Object} activeConnection
     * @param {Tandem} tandem
     */
    createSwitchSegment: function( startPoint, activeConnection, tandem ) {
      return new SwitchSegment( startPoint, activeConnection, tandem );
    },

    /**
     * Factory for a WireSegment that attaches a battery top to a switch segment
     * @param {Vector2} startPoint
     * @param {Vector2} endPoint
     * @param {Tandem} tandem
     */
    createBatteryTopToSwitchSegment: function( startPoint, endPoint, tandem ) {
      return new WireSegment( startPoint, endPoint, tandem );
    },

    /**
     * Factory for a WireSegment that attaches a battery bottom to a switch segment
     * @param {Vector2} startPoint
     * @param {Vector2} endPoint
     * @param {Tandem} tandem
     */
    createBatteryBottomToSwitchSegment: function( startPoint, endPoint, tandem ) {
      return new WireSegment( startPoint, endPoint, tandem );
    }
  } );

  /**
   * Constructor for a ComponentWireSegment.  This is any wire segment that is connected to one circuit component.
   *
   * @param {Capacitor || LightBulb} component
   * @param {Vector2} startPoint
   * @param {Vector2} endPoint
   * @param {Tandem} tandem
   */
  function ComponentWireSegment( component, startPoint, endPoint, tandem ) {
    WireSegment.call( this, startPoint, endPoint, tandem );
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
   * @param {Tandem} tandem
   */
  function ComponentTopWireSegment( component, endPoint, tandem ) {
    ComponentWireSegment.call( this, component, component.getTopConnectionPoint().toVector2(), endPoint, tandem );
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
   * @param {Tandem} tandem
   */
  function ComponentBottomWireSegment( component, endPoint, tandem ) {
    ComponentWireSegment.call( this, component, component.getBottomConnectionPoint().toVector2(), endPoint, tandem );
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
   *  @param {Tandem} tandem
   */
  function BatteryWireSegment( battery, startPoint, endPoint, tandem ) {
    WireSegment.call( this, startPoint, endPoint, tandem );
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
   * @param {Tandem} tandem
   */
  function BatteryTopWireSegment( battery, endPoint, tandem ) {
    BatteryWireSegment.call( this, battery, new Vector2( battery.location.x, battery.location.y + battery.getTopTerminalYOffset() ), endPoint, tandem );
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
   * @param {Tandem} tandem
   */
  function BatteryBottomWireSegment( battery, endPoint, tandem ) {
    BatteryWireSegment.call( this, battery, new Vector2( battery.location.x, battery.location.y + battery.getBottomTerminalYOffset() ), endPoint, tandem );
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
   * @param {Tandem} tandem
   * @constructor
   */
  function SwitchSegment( hingePoint, activeConnection, tandem ) {
    this.activeConnection = activeConnection;
    this.hingePoint = hingePoint;
    WireSegment.call( this, hingePoint, activeConnection.location, tandem );
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

