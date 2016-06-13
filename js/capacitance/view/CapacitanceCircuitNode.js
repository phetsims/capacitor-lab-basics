// Copyright 2015, University of Colorado Boulder

/**
 * Node for the capacitance circuit.
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
   * @param {CapacitanceModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function CapacitanceCircuitNode( model, tandem ) {

    CLBCircuitNode.call( this, model, tandem );
    var thisNode = this;

    // current indicator observers
    model.circuit.circuitConnectionProperty.link( function( circuitConnection ) {
      thisNode.updateCurrentVisibility( circuitConnection, model.currentVisibleProperty.value );
    } );

    model.currentVisibleProperty.link( function( currentIndicatorsVisible ) {
      thisNode.updateCurrentVisibility( model.circuit.circuitConnectionProperty.value, currentIndicatorsVisible );
    } );
  }

  capacitorLabBasics.register( 'CapacitanceCircuitNode', CapacitanceCircuitNode );

  return inherit( CLBCircuitNode, CapacitanceCircuitNode, {

    /**
     * Updates the visibility of the current indicators.
     *
     * @param  {string} circuitConnection - OPEN_CIRCUIT || BATTERY_CONNECTED
     * @param  {boolean} currentIndicatorsVisible
     */
    updateCurrentVisibility: function( circuitConnection, currentIndicatorsVisible ) {

      var isBatteryConnected = ( circuitConnection === CircuitConnectionEnum.BATTERY_CONNECTED );

      this.batteryTopCurrentIndicatorNode.setVisible( isBatteryConnected && currentIndicatorsVisible );
      this.batteryBottomCurrentIndicatorNode.setVisible( isBatteryConnected && currentIndicatorsVisible );
    }

  } );
} );

