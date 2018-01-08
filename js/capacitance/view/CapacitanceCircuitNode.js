// Copyright 2015-2017, University of Colorado Boulder

/**
 * Node for the capacitance circuit.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CircuitState = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitState' );
  var CLBCircuitNode = require( 'CAPACITOR_LAB_BASICS/common/view/CLBCircuitNode' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @constructor
   *
   * @param {CapacitanceModel} model
   * @param {Tandem} tandem
   */
  function CapacitanceCircuitNode( model, tandem ) {

    CLBCircuitNode.call( this, model, tandem );
    var self = this;

    // current indicator observers
    model.circuit.circuitConnectionProperty.link( function( circuitConnection ) {
      self.updateCurrentVisibility( circuitConnection, model.currentVisibleProperty.value );
    } );

    model.currentVisibleProperty.link( function( currentIndicatorsVisible ) {
      self.updateCurrentVisibility( model.circuit.circuitConnectionProperty.value, currentIndicatorsVisible );
    } );
  }

  capacitorLabBasics.register( 'CapacitanceCircuitNode', CapacitanceCircuitNode );

  return inherit( CLBCircuitNode, CapacitanceCircuitNode, {

    /**
     * Updates the visibility of the current indicators.
     * @public
     *
     * @param {CircuitState} circuitConnection - OPEN_CIRCUIT || BATTERY_CONNECTED
     * @param {boolean} currentIndicatorsVisible
     */
    updateCurrentVisibility: function( circuitConnection, currentIndicatorsVisible ) {
      var isBatteryConnected = ( circuitConnection === CircuitState.BATTERY_CONNECTED );

      this.batteryTopCurrentIndicatorNode.setVisible( isBatteryConnected && currentIndicatorsVisible );
      this.batteryBottomCurrentIndicatorNode.setVisible( isBatteryConnected && currentIndicatorsVisible );
    }

  } );
} );

