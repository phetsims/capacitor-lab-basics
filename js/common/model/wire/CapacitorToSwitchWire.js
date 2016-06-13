// Copyright 2015, University of Colorado Boulder

/**
 * Creates a wire that connects a capacitor to a circuit switch.
 *
 * @author  Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Wire = require( 'CAPACITOR_LAB_BASICS/common/model/wire/Wire' );
  var WireSegment = require( 'CAPACITOR_LAB_BASICS/common/model/wire/WireSegment' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  /**
   * Constructor.
   *
   * @param {string} connectionPoint
   * @param {CircuitConfig} config
   * @param {Capacitor} capacitor
   * @param {CircuitSwitch} circuitSwitch
   * @param {Tandem} tandem
   * @constructor
   */
  function CapacitorToSwitchWire( connectionPoint, config, capacitor, circuitSwitch, tandem ) {
    var segments = [];

    // add the vertical segment.
    var switchConnectionPoint = circuitSwitch.getCapacitorConnectionPoint();
    var segment;
    if ( connectionPoint === CLBConstants.WIRE_CONNECTIONS.CAPACITOR_TOP ) {
      segment = WireSegment.ComponentTopWireSegment( capacitor, switchConnectionPoint,
        tandem ? tandem.createTandem( 'capacitorComponentTopWireSegment' ) : null );
    } else {
      segment = WireSegment.ComponentBottomWireSegment( capacitor, switchConnectionPoint,
        tandem ? tandem.createTandem( 'capacitorComponentBottomWireSegment' ) : null );
    }
    segments.push( segment );

    Wire.call( this, config.modelViewTransform, config.wireThickness, segments, connectionPoint );
  }

  capacitorLabBasics.register( 'CapacitorToSwitchWire', CapacitorToSwitchWire );

  return inherit( Wire, CapacitorToSwitchWire, {}, {

    /**
     * Factory functions for public access to specific constructors.
     */
    CapacitorToSwitchWireTop: function( config, capacitor, circuitSwitch, tandem ) {
      return new CapacitorToSwitchWire( CLBConstants.WIRE_CONNECTIONS.CAPACITOR_TOP, config, capacitor, circuitSwitch, tandem );
    },

    CapacitorToSwitchWireBottom: function( config, capacitor, circuitSwitch, tandem ) {
      return new CapacitorToSwitchWire( CLBConstants.WIRE_CONNECTIONS.CAPACITOR_BOTTOM, config, capacitor, circuitSwitch, tandem );
    }

  } );

} );

