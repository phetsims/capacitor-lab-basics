// Copyright 2015-2017, University of Colorado Boulder

/**
 * Creates a wire that connects a capacitor to a circuit switch.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CircuitLocation = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitLocation' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Wire = require( 'CAPACITOR_LAB_BASICS/common/model/wire/Wire' );
  var WireSegment = require( 'CAPACITOR_LAB_BASICS/common/model/wire/WireSegment' );

  /**
   * @constructor
   *
   * @param {CircuitLocation} connectionPoint
   * @param {CircuitConfig} config
   * @param {Capacitor} capacitor
   * @param {CircuitSwitch} circuitSwitch
   * @param {Tandem} tandem
   */
  function CapacitorToSwitchWire( connectionPoint, config, capacitor, circuitSwitch, tandem ) {

    // add the vertical segment.
    var switchConnectionPoint = circuitSwitch.hingePoint;
    var segment;
    if ( connectionPoint === CircuitLocation.CAPACITOR_TOP ) {
      segment = WireSegment.createComponentTopWireSegment(
        capacitor,
        switchConnectionPoint,
        tandem.createTandem( 'capacitorComponentTopWireSegment' )
      );
    }
    else {
      segment = WireSegment.createComponentBottomWireSegment(
        capacitor,
        switchConnectionPoint,
        tandem.createTandem( 'capacitorComponentBottomWireSegment' )
      );
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
      return new CapacitorToSwitchWire( CircuitLocation.CAPACITOR_TOP, config, capacitor, circuitSwitch, tandem );
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
      return new CapacitorToSwitchWire( CircuitLocation.CAPACITOR_BOTTOM, config, capacitor, circuitSwitch, tandem );
    }
  } );
} );
