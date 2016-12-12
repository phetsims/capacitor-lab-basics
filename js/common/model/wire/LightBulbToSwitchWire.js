// Copyright 2015, University of Colorado Boulder

/**
 * Creates a wire that connects a light bulb to a circuit switch.
 *
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CircuitPlaces = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitPlaces' );
  var CircuitStateTypes = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitStateTypes' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector3 = require( 'DOT/Vector3' );
  var Wire = require( 'CAPACITOR_LAB_BASICS/common/model/wire/Wire' );
  var WireSegment = require( 'CAPACITOR_LAB_BASICS/common/model/wire/WireSegment' );

  var COUNTER = 0;

  /**
   * REVIEW: enumeration for connectionPoint?
   * @param {string} connectionPoint one of 'TOP' or 'BOTTOM'
   * @param {CircuitConfig} config
   * @param {LightBulb} lightBulb
   * @param {CircuitSwitch} circuitSwitch
   * @param {Tandem|null} tandem - null if this is a temporary circuit used for calculations
   * @constructor
   */
  function LightBulbToSwitchWire( connectionPoint, config, lightBulb, circuitSwitch, tandem ) {
    var segments = [];

    // Get y coordinate of the horizontal wire
    var horizontalY = circuitSwitch.getConnectionPoint( CircuitStateTypes.BATTERY_CONNECTED ).y;

    // Get x coordinate of the connection point
    var isTop = connectionPoint === CircuitPlaces.LIGHT_BULB_TOP;
    var connectionPointX = isTop ? lightBulb.getTopConnectionPoint().x : lightBulb.getBottomConnectionPoint().x;

    // This is the (x,y) position of the upper right corner
    var rightCorner = new Vector3( connectionPointX, horizontalY, 0 );

    // add the vertical segment.
    var verticalSegment;
    if ( isTop ) {
      verticalSegment = WireSegment.createComponentTopWireSegment( lightBulb, rightCorner,
        tandem.createTandem( 'lightBulbComponentTopWireSegment' ) );
    } else {
      verticalSegment = WireSegment.createComponentBottomWireSegment( lightBulb, rightCorner,
        tandem.createTandem( 'lightBulbComponentBottomWireSegment' ) );
    }
    segments.push( verticalSegment );

    // connect lightbulb to switch connection point.
    var switchConnectionPoint = circuitSwitch.getConnectionPoint( CircuitStateTypes.LIGHT_BULB_CONNECTED );

    // Tandem IDs must be unique, so append a counter index
    segments.push( new WireSegment( rightCorner, switchConnectionPoint,
      tandem.createTandem( 'lightBulbSwitchWireSegment' + COUNTER ) ) );
    COUNTER++;

    Wire.call( this, config.modelViewTransform, segments, connectionPoint );
  }

  capacitorLabBasics.register( 'LightBulbToSwitchWire', LightBulbToSwitchWire );

  return inherit( Wire, LightBulbToSwitchWire, {}, {

    /**
     * Factory methods for top LightBulbToSwitchWire instance
     * @public
     *
     * @param {CircuitConfig} config
     * @param {LightBulb} lightBulb
     * @param {CircuitSwitch} circuitSwitch
     * @param {Tandem} tandem
     * @returns {Wire}
     */
    createLightBulbToSwitchWireBottom: function( config, lightBulb, circuitSwitch, tandem ) {
      return new LightBulbToSwitchWire( CircuitPlaces.LIGHT_BULB_BOTTOM, config, lightBulb, circuitSwitch, tandem );
    },

    /**
     * Factory methods for bottom LightBulbToSwitchWire instance
     * @public
     *
     * @param {CircuitConfig} config
     * @param {LightBulb} lightBulb
     * @param {CircuitSwitch} circuitSwitch
     * @param {Tandem} tandem
     * @returns {Wire}
     */
    createLightBulbToSwitchWireTop: function( config, lightBulb, circuitSwitch, tandem ) {
      return new LightBulbToSwitchWire( CircuitPlaces.LIGHT_BULB_TOP, config, lightBulb, circuitSwitch, tandem );
    }

  } );

} );

