// Copyright 2015-2019, University of Colorado Boulder

/**
 * Node for the capacitance circuit.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import inherit from '../../../../phet-core/js/inherit.js';
import capacitorLabBasics from '../../capacitorLabBasics.js';
import CircuitState from '../../common/model/CircuitState.js';
import CLBCircuitNode from '../../common/view/CLBCircuitNode.js';

/**
 * @constructor
 *
 * @param {CapacitanceModel} model
 * @param {Tandem} tandem
 */
function CapacitanceCircuitNode( model, tandem ) {

  CLBCircuitNode.call( this, model, tandem );
  const self = this;

  Property.multilink( [ model.circuit.circuitConnectionProperty, model.currentVisibleProperty ],
    function( circuitConnection, currentIndicatorsVisible ) {
      self.updateCurrentVisibility( circuitConnection, currentIndicatorsVisible );
    } );
}

capacitorLabBasics.register( 'CapacitanceCircuitNode', CapacitanceCircuitNode );

export default inherit( CLBCircuitNode, CapacitanceCircuitNode, {

  /**
   * Updates the visibility of the current indicators.
   * @public
   *
   * @param {CircuitState} circuitConnection - OPEN_CIRCUIT | BATTERY_CONNECTED
   * @param {boolean} currentIndicatorsVisible
   */
  updateCurrentVisibility: function( circuitConnection, currentIndicatorsVisible ) {
    const isBatteryConnected = ( circuitConnection === CircuitState.BATTERY_CONNECTED );

    this.batteryTopCurrentIndicatorNode.setVisible( isBatteryConnected && currentIndicatorsVisible );
    this.batteryBottomCurrentIndicatorNode.setVisible( isBatteryConnected && currentIndicatorsVisible );
  }
} );