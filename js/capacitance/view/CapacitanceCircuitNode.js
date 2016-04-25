// Copyright 2015, University of Colorado Boulder

/**
 * Circuit for the for the "Dielectric" module.  Contains the circuit components and controls for manipulating the
 * circuit.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var CircuitConnectionEnum = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitConnectionEnum' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CLBCircuitNode = require( 'CAPACITOR_LAB_BASICS/common/view/CLBCircuitNode' );

  /**
   * Constructor for a CircuitNode.
   *
   * @param {CapacitanceCircuit} circuit
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Property} plateChargeVisibleProperty
   * @param {Property} eFieldVisibleProperty
   * @param {Property.<boolean>} currentIndicatorsVisibleProeprty
   * @param {number} maxPlateCharge
   * @param {number} maxEffectiveEField
   * @constructor
   */
  function CapacitanceCircuitNode( circuit, modelViewTransform, plateChargeVisibleProperty, eFieldVisibleProperty,
                                   currentIndicatorsVisibleProperty, maxPlateCharge, maxEffectiveEField ) {

    // this circuit
    CLBCircuitNode.call( this, circuit, modelViewTransform, plateChargeVisibleProperty, eFieldVisibleProperty, currentIndicatorsVisibleProperty, maxPlateCharge, maxEffectiveEField );

  }

  capacitorLabBasics.register( 'CapacitanceCircuitNode', CapacitanceCircuitNode );
  
  return inherit( CLBCircuitNode, CapacitanceCircuitNode, {

    // Updates the circuit components and controls to match the state of the battery connection.
    updateCurrentVisibility: function( circuitConnection, currentIndicatorsVisible ) {

      var isBatteryConnected = ( circuitConnection === CircuitConnectionEnum.BATTERY_CONNECTED );

      this.batteryTopCurrentIndicatorNode.setVisible( isBatteryConnected && currentIndicatorsVisible );
      this.batteryBottomCurrentIndicatorNode.setVisible( isBatteryConnected && currentIndicatorsVisible );
    }

  } );
} );