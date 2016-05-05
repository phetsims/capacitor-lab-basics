// Copyright 2016, University of Colorado Boulder

/**
 * @author Jesse Greenberg
 * @author Andrew Adare
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var Capacitor = require( 'CAPACITOR_LAB_BASICS/common/model/Capacitor' );
  var Vector3 = require( 'DOT/Vector3' );
  var CircuitSwitch = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitSwitch' );

  /**
   * @param {CircuitConfig} config
   * @param {Property.<string>} circuitConnectionProperty
   * @param {Tandem} tandem
   */
  function SwitchedCapacitor( config, circuitConnectionProperty, tandem ) {

    var location = new Vector3(
      config.batteryLocation.x + config.capacitorXSpacing,
      config.batteryLocation.y + config.capacitorYSpacing,
      config.batteryLocation.z );

    var options = {
      plateWidth: config.plateWidth,
      plateSeparation: config.plateSeparation,
      dielectricMaterial: config.dielectricMaterial,
      dielectricOffset: config.dielectricOffset
    };
    Capacitor.call( this, location, config.modelViewTransform, tandem, options );

    this.topCircuitSwitch = new CircuitSwitch( 'top', config, circuitConnectionProperty,
      tandem ? tandem.createTandem( 'topCircuitSwitch' ) : null );
    this.bottomCircuitSwitch = new CircuitSwitch( 'bottom', config, circuitConnectionProperty,
      tandem ? tandem.createTandem( 'bottomCircuitSwitch' ) : null );
  }

  capacitorLabBasics.register( 'SwitchedCapacitor', SwitchedCapacitor );

  return inherit( Capacitor, SwitchedCapacitor );
} );

