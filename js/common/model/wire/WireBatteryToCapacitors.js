// Copyright 2002-2015, University of Colorado Boulder

/**
 * Base class for any wire that connects a battery (B) to one of more capacitors (C1...Cn).
 *
 * For the "top" subclass, the wire looks like this:
 * <code>
 * |-----|------|--...--|
 * |     |      |       |
 * B     C1    C2       Cn
 *
 *
 * For the "bottom" subclass, the wire looks like this:
 *
 * B     C1    C2       Cn
 * |     |      |       |
 * |-----|------|--...--|
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var Vector2 = require( 'DOT/Vector2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Wire = require( 'CAPACITOR_LAB/common/model/wire/Wire' );
  var WireSegment = require( 'CAPACITOR_LAB/common/model/wire/WireSegment' );

  // constants
  var ConnectionPoint = {
    TOP: 'TOP',
    BOTTOM: 'BOTTOM'
  };

  /**
   * Constructor.
   *
   * @param {string} connectionPoint
   * @param {ModelViewTransform2} modelViewTransform
   * @param {number} thickness
   * @param {number} wireExtent how far the wire extends beyond the capacitor, in meters
   * @param {Battery} battery
   * @param {array.<Capacitor>} capacitors
   * @constructor
   */
  function WireBatteryToCapacitors( connectionPoint, modelViewTransform, thickness, wireExtent, battery, capacitors ) {
    Wire.call( this, modelViewTransform, thickness, [] /* segments added via addSegment() */ );

    // y coordinate of the horizontal wire
    var horizontalY = this.getHorizontalY( connectionPoint, capacitors, wireExtent );

    // horizontal segment connecting battery (B) to the rightmost capacitor (Cn)
    var rightmostCapacitor = capacitors[ capacitors.length - 1 ];
    var leftCorner = new Vector2( battery.location.x, horizontalY );
    var rightCorner = new Vector2( rightmostCapacitor.location.x, horizontalY );
    var t = this.getCornerOffset(); // for proper connection at corners with wire stroke end style

    this.segments.push( this.getBatteryWireSegment( connectionPoint, battery, this.getEndOffset(), leftCorner ) );
    this.segments.push( new WireSegment( new Vector2( leftCorner.x - t, leftCorner.y + t ), new Vector2( rightCorner.x + t, rightCorner.y + t ) ) );
    this.segments.push( this.getCapacitorWireSegment( connectionPoint, rightmostCapacitor, rightCorner ) );

    // add vertical segments for all capacitors (C1...Cn-1) in between the battery (B) and rightmost capacitor (Cn)
    for ( var i = 0; i < capacitors.length - 1; i++ ) {
      var capacitor = capacitors[ i ];
      var startPoint = new Vector2( capacitor.location.x, horizontalY );
      this.segments.push( this.getCapacitorWireSegment( connectionPoint, capacitor, startPoint ) );
    }
  }

  /**
   * Constructor for object that connects the top of the battery (B) to the tops of N capacitors (C1...Cn).
   * Constructor args are described in superclass constructor.
   *
   * @param {ModelViewTransform2} modelViewTransform
   * @param {number} thickness
   * @param {number} wireExtent
   * @param {Battery} battery
   * @param {array.<Capacitor>} capacitors
   */
  function WireBatteryToCapacitorsTop( modelViewTransform, thickness, wireExtent, battery, capacitors ) {
    WireBatteryToCapacitors.call( this, ConnectionPoint.TOP, modelViewTransform, thickness, wireExtent, battery, capacitors );
  }

  inherit( WireBatteryToCapacitors, WireBatteryToCapacitorsTop );

  /**
   * Constructor for object that connects the bottom of the battery (B) to the bottoms of N capacitors (C1...Cn).
   *
   * @param {ModelViewTransform2} modelViewTransform
   * @param {number} thickness
   * @param {number} wireExtent
   * @param {Battery} battery
   * @param {array.<Capacitor>} capacitors
   */
  function WireBatteryToCapacitorsBottom( modelViewTransform, thickness, wireExtent, battery, capacitors ) {
    WireBatteryToCapacitors.call( this, ConnectionPoint.BOTTOM, modelViewTransform, thickness, wireExtent, battery, capacitors );

    this.battery = battery;
    this.capacitors = capacitors;

    // TODO
    // Add plate size observers to all capacitors, so we can handle wire occlusion.
    //SimpleObserver plateSizeObserver = new SimpleObserver() {
    //  public void update() {
    //    setShape( createShape() );
    //  }
    //};
    //for ( Capacitor capacitor : capacitors ) {
    //  capacitor.addPlateSizeObserver( plateSizeObserver, false /* notifyOnAdd */ );
    //}
    //setShape( createShape() ); // call explicitly because notifyOnAdd was false

  }

  inherit( WireBatteryToCapacitors, WireBatteryToCapacitorsBottom, {
    // TODO: The following function exists in the Java as documentation.  Decide whether or not to implement.
    //super.cleanup();
    //FUTURE removePlateSizeObserver for all capacitors

    // Subtract any part of the wire that is occluded by the battery or one of the bottom plates.
    createShape: function() {
      WireBatteryToCapacitors.prototype.createShape.call();
      // Null checks required because createShape is called in the superclass constructor.
      // TODO: See if this can be done by simple Z layering in screenView.  Subtraction is difficult now.
      if ( this.battery !== undefined && this.capacitors !== undefined ) {
        //wireShape = ShapeUtils.subtract( wireShape, battery.getShapeCreator().createBodyShape() );
        //for ( Capacitor capacitor : capacitors ) {
        //  wireShape = ShapeUtils.subtract( wireShape, capacitor.getShapeCreator().createBottomPlateShape() );
        //}
      }
      //return wireShape;
    }
  } );

  return inherit( Wire, WireBatteryToCapacitors, {
    /**
     * Gets the Y coordinate of the horizontal wire. It extends wireExtent distance above/below the capacitor that is
     * closest to the wire.
     *
     * @param {string} connectionPoint, one of 'TOP', 'BOTTOM'
     * @param {array.<Capacitor>} capacitors
     * @param {number} wireExtent
     * @return {number}
     */
    getHorizontalY: function( connectionPoint, capacitors, wireExtent ) {
      var y = capacitors[ 0 ].location.y;
      if ( connectionPoint === ConnectionPoint.TOP ) {
        capacitors.forEach( function( capacitor ) {
          y = Math.min( y, capacitor.location.y - wireExtent );
        } );
      }
      else {
        capacitors.forEach( function( capacitor ) {
          y = Math.max( y, capacitor.location.y + wireExtent );
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

    // Gets a wire segment that attaches to the specified plate (top or bottom) of a capacitor.
    /**
     * Gets a wire segment that attaches to the specified plate (top or bottom) of a capacitor.
     *
     * @param connectionPoint
     * @param capacitor
     * @param endPoint
     * @returns {WireSegment}
     */
    getCapacitorWireSegment: function( connectionPoint, capacitor, endPoint ) {
      if ( connectionPoint === ConnectionPoint.TOP ) {
        return WireSegment.CapacitorTopWireSegment( capacitor, endPoint );
      }
      else {
        return WireSegment.CapacitorBottomWireSegment( capacitor, endPoint );
      }
    }

  }, {

    /**
     * Factory functions for public access to specific constructors.
     */
    WireBatteryToCapacitorsBottom: function( modelViewTransform, thickness, wireExtent, battery, capacitors ) {
      return new WireBatteryToCapacitors( ConnectionPoint.BOTTOM, modelViewTransform, thickness, wireExtent, battery, capacitors );
    },

    WireBatteryToCapacitorsTop: function( modelViewTransform, thickness, wireExtent, battery, capacitors ) {
      return new WireBatteryToCapacitors( ConnectionPoint.TOP, modelViewTransform, thickness, wireExtent, battery, capacitors );
    }

  } );

} );