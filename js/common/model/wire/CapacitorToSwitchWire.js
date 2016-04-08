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
    segments.push( this.getCapacitorToSwitchSegment( connectionPoint, circuitSwitch, capacitor ) );

    Wire.call( this, modelViewTransform, thickness, segments, connectionPoint );
  }

  capacitorLabBasics.register( 'CapacitorToSwitchWire', CapacitorToSwitchWire );

  return inherit( Wire, CapacitorToSwitchWire, {

    getCapacitorToSwitchSegment: function( connectionPoint, circuitSwitch, capacitor ) {
      var switchConnectionPoint = circuitSwitch.getCapacitorConnectionPoint();
      if ( connectionPoint === CLConstants.WIRE_CONNECTIONS.CAPACITOR_TOP ) {
        return WireSegment.ComponentTopWireSegment( capacitor, switchConnectionPoint );
      } else {
        return WireSegment.ComponentBottomWireSegment( capacitor, switchConnectionPoint );
      }
    }

  }, {

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

