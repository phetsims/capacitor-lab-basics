// Copyright 2016, University of Colorado Boulder

/**
 * Creates a wire that connects a capacitor to a circuit switch.
 *
 * @author  Jesse Greenberg
 * @author Andrew Adare
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

    // add the vertical segment.
    var switchConnectionPoint = circuitSwitch.hingePoint;
    var segment;
    if ( connectionPoint === CLBConstants.WIRE_CONNECTIONS.CAPACITOR_TOP ) {
      segment = WireSegment.createComponentTopWireSegment( capacitor, switchConnectionPoint,
        tandem.createTandem( 'capacitorComponentTopWireSegment' ) );
    }
    else {
      segment = WireSegment.createComponentBottomWireSegment( capacitor, switchConnectionPoint,
        tandem.createTandem( 'capacitorComponentBottomWireSegment' ) );
    }

    Wire.call( this, config.modelViewTransform, [ segment ], connectionPoint );
  }

  capacitorLabBasics.register( 'CapacitorToSwitchWire', CapacitorToSwitchWire );

  return inherit( Wire, CapacitorToSwitchWire, {}, {

    /**
     * Factory method for top CapacitorToSwitchWire instance
     * @public
     *
     * @param {CircuitConfig} config
     * @param {Capacitor} capacitor
     * @param {CircuitSwitch} circuitSwitch
     * @param {Tandem} tandem
     * @returns CapacitorToSwitchWire
     */
    createCapacitorToSwitchWireTop: function( config, capacitor, circuitSwitch, tandem ) {
      return new CapacitorToSwitchWire( CLBConstants.WIRE_CONNECTIONS.CAPACITOR_TOP,
        config, capacitor, circuitSwitch, tandem );
    },

    /**
     * Factory method for bottom CapacitorToSwitchWire instance
     * @public
     *
     * @param {CircuitConfig} config
     * @param {Capacitor} capacitor
     * @param {CircuitSwitch} circuitSwitch
     * @param {Tandem} tandem
     * @returns CapacitorToSwitchWire
     */
    createCapacitorToSwitchWireBottom: function( config, capacitor, circuitSwitch, tandem ) {
      return new CapacitorToSwitchWire( CLBConstants.WIRE_CONNECTIONS.CAPACITOR_BOTTOM,
        config, capacitor, circuitSwitch, tandem );
    }
  } );
} );
