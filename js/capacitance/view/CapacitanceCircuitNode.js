// Copyright 2015-2019, University of Colorado Boulder

/**
 * Node for the capacitance circuit.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  const CircuitState = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitState' );
  const CLBCircuitNode = require( 'CAPACITOR_LAB_BASICS/common/view/CLBCircuitNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Property = require( 'AXON/Property' );

  /**
   * @constructor
   *
   * @param {CapacitanceModel} model
   * @param {Tandem} tandem
   */
  function CapacitanceCircuitNode( model, tandem ) {

    CLBCircuitNode.call( this, model, tandem );
    var self = this;

    Property.multilink( [ model.circuit.circuitConnectionProperty, model.currentVisibleProperty ],
      function( circuitConnection, currentIndicatorsVisible ) {
        self.updateCurrentVisibility( circuitConnection, currentIndicatorsVisible );
      } );
  }

  capacitorLabBasics.register( 'CapacitanceCircuitNode', CapacitanceCircuitNode );

  return inherit( CLBCircuitNode, CapacitanceCircuitNode, {

    /**
     * Updates the visibility of the current indicators.
     * @public
     *
     * @param {CircuitState} circuitConnection - OPEN_CIRCUIT | BATTERY_CONNECTED
     * @param {boolean} currentIndicatorsVisible
     */
    updateCurrentVisibility: function( circuitConnection, currentIndicatorsVisible ) {
      var isBatteryConnected = ( circuitConnection === CircuitState.BATTERY_CONNECTED );

      this.batteryTopCurrentIndicatorNode.setVisible( isBatteryConnected && currentIndicatorsVisible );
      this.batteryBottomCurrentIndicatorNode.setVisible( isBatteryConnected && currentIndicatorsVisible );
    }
  } );
} );
