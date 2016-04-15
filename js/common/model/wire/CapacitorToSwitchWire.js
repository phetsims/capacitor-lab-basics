// Copyright 2015, University of Colorado Boulder

/**
 * Creates a wire that connects a capacitor to a circuit switch.
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Wire = require( 'CAPACITOR_LAB_BASICS/common/model/wire/Wire' );
  var WireSegment = require( 'CAPACITOR_LAB_BASICS/common/model/wire/WireSegment' );
  var CLConstants = require( 'CAPACITOR_LAB_BASICS/common/CLConstants' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  /**
   * Constructor.
   *
   * @param {string} connectionPoint one of 'TOP' or 'BOTTOM'
   * @param {ModelViewTransform2} modelViewTransform
   * @param {number} thickness
   * @param {Capacitor} capacitor
   * @param {CircuitSwitch} circuitSwitch
   * @constructor
   */
  function CapacitorToSwitchWire( connectionPoint, modelViewTransform, thickness, capacitor, circuitSwitch ) {
    var segments = [];

    // add the vertical segment.
    var switchConnectionPoint = circuitSwitch.getCapacitorConnectionPoint();
    var segment;
    if ( connectionPoint === CLConstants.WIRE_CONNECTIONS.CAPACITOR_TOP ) {
      segment = WireSegment.LightBulbTopWireSegment( capacitor, switchConnectionPoint );
    } else {
      segment = WireSegment.LightBulbBottomWireSegment( capacitor, switchConnectionPoint );
    }
    segments.push( segment );

    Wire.call( this, modelViewTransform, thickness, segments, connectionPoint );
  }

  capacitorLabBasics.register( 'CapacitorToSwitchWire', CapacitorToSwitchWire );

  return inherit( Wire, CapacitorToSwitchWire, {}, {

    /**
     * Factory functions for public access to specific constructors.
     */
    CapacitorToSwitchWireTop: function( modelViewTransform, thickness, capacitor, circuitSwitch ) {
      return new CapacitorToSwitchWire( CLConstants.WIRE_CONNECTIONS.CAPACITOR_TOP, modelViewTransform, thickness, capacitor, circuitSwitch );
    },

    CapacitorToSwitchWireBottom: function( modelViewTransform, thickness, capacitor, circuitSwitch ) {
      return new CapacitorToSwitchWire( CLConstants.WIRE_CONNECTIONS.CAPACITOR_BOTTOM, modelViewTransform, thickness, capacitor, circuitSwitch );
    }

  } );

} );

