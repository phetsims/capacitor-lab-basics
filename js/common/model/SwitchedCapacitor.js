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
   * @param {Property.<string>} circuitConnectionProperty REVIEW: Property.<CircuitConnectionEnum>
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
    };
    Capacitor.call( this, location, config.modelViewTransform, tandem, options );

    // Allow null instead of tandem if this component is part of a temporary circuit used for calculations
    //REVIEW: Recommended CircuitSwitch.TOP and CircuitSwitch.BOTTOM in CircuitSwitch's review
    this.topCircuitSwitch = new CircuitSwitch( 'top', config, circuitConnectionProperty,
      tandem.createTandem( 'topCircuitSwitch' ) );
    this.bottomCircuitSwitch = new CircuitSwitch( 'bottom', config, circuitConnectionProperty,
      tandem.createTandem( 'bottomCircuitSwitch' ) );

    // link the top and bottom circuit switches together so that they rotate together
    // as the user drags
    var self = this;
    //REVIEW: note about JS's handling of negating numbers not causing infinite loops here might be good. This would
    //        otherwise be a semi-dangerous pattern.
    this.topCircuitSwitch.angleProperty.link( function( angle ) {
      self.bottomCircuitSwitch.angleProperty.set( -angle );
    } );
    this.bottomCircuitSwitch.angleProperty.link( function( angle ) {
      self.topCircuitSwitch.angleProperty.set( -angle );
    } );
  }

  capacitorLabBasics.register( 'SwitchedCapacitor', SwitchedCapacitor );

  return inherit( Capacitor, SwitchedCapacitor );
} );
