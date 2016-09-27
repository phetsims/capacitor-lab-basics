// Copyright 2016, University of Colorado Boulder

/**
 * A capacitor with one switch attached to each plate.  The capacitor is connected to the circuit with
 * these switches, and can be disconnected from the circuit with them as well.
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

    // Allow null instead of tandem if this component is part of a temporary circuit used for calculations
    this.topCircuitSwitch = new CircuitSwitch( 'top', config, circuitConnectionProperty,
      tandem ? tandem.createTandem( 'topCircuitSwitch' ) : null );
    this.bottomCircuitSwitch = new CircuitSwitch( 'bottom', config, circuitConnectionProperty,
      tandem ? tandem.createTandem( 'bottomCircuitSwitch' ) : null );

    // link the top and bottom circuit switches together so that they rotate together
    // as the user drags
    var self = this;
    this.topCircuitSwitch.angleProperty.link( function( angle ) {
      self.bottomCircuitSwitch.angle = -angle;
    } );
    this.bottomCircuitSwitch.angleProperty.link( function( angle ) {
      self.topCircuitSwitch.angle = -angle;
    } );
  }

  capacitorLabBasics.register( 'SwitchedCapacitor', SwitchedCapacitor );

  return inherit( Capacitor, SwitchedCapacitor );
} );

