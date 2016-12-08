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
   * REVIEW: for connectionPoint, use an enumeration, and doc the enumeration here.
   * @param {string} connectionPoint
   * @param {CircuitConfig} config
   * @param {Capacitor} capacitor
   * @param {CircuitSwitch} circuitSwitch
   * @param {Tandem} tandem
   * @constructor
   */
  function CapacitorToSwitchWire( connectionPoint, config, capacitor, circuitSwitch, tandem ) {
    //REVIEW: adding one thing, do we really need the segments array here? Use [ segment ] later?
    var segments = [];

    // add the vertical segment.
    var switchConnectionPoint = circuitSwitch.hingePoint;
    var segment;
    if ( connectionPoint === CLBConstants.WIRE_CONNECTIONS.CAPACITOR_TOP ) {
      segment = WireSegment.createComponentTopWireSegment( capacitor, switchConnectionPoint,
        tandem.createTandem( 'capacitorComponentTopWireSegment' ) );
    } else {
      segment = WireSegment.createComponentBottomWireSegment( capacitor, switchConnectionPoint,
        tandem.createTandem( 'capacitorComponentBottomWireSegment' ) );
    }
    segments.push( segment );

    Wire.call( this, config.modelViewTransform, segments, connectionPoint );
  }

  capacitorLabBasics.register( 'CapacitorToSwitchWire', CapacitorToSwitchWire );

  return inherit( Wire, CapacitorToSwitchWire, {}, {
    /**
     * Factory methods for top and bottom CapacitorToSwitchWire instances
     * REVIEW: visibility doc
     *
     * @param {CircuitConfig} config
     * @param {Capacitor} capacitor
     * @param {CircuitSwitch} circuitSwitch
     * @param {Tandem} tandem
     * REVIEW: returns?
     */
    createCapacitorToSwitchWireTop: function( config, capacitor, circuitSwitch, tandem ) {
      return new CapacitorToSwitchWire( CLBConstants.WIRE_CONNECTIONS.CAPACITOR_TOP, config, capacitor, circuitSwitch, tandem );
    },

    //REVIEW: doc?
    createCapacitorToSwitchWireBottom: function( config, capacitor, circuitSwitch, tandem ) {
      return new CapacitorToSwitchWire( CLBConstants.WIRE_CONNECTIONS.CAPACITOR_BOTTOM, config, capacitor, circuitSwitch, tandem );
    }

  } );

} );

