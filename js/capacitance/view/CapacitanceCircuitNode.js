// Copyright 2015-2022, University of Colorado Boulder

/**
 * Node for the capacitance circuit.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import capacitorLabBasics from '../../capacitorLabBasics.js';
import CircuitState from '../../common/model/CircuitState.js';
import CLBCircuitNode from '../../common/view/CLBCircuitNode.js';

class CapacitanceCircuitNode extends CLBCircuitNode {
  /**
   * @param {CapacitanceModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {

    super( model, tandem );

    Multilink.multilink( [ model.circuit.circuitConnectionProperty, model.currentVisibleProperty ],
      ( circuitConnection, currentIndicatorsVisible ) => {
        this.updateCurrentVisibility( circuitConnection, currentIndicatorsVisible );
      } );
  }

  /**
   * Updates the visibility of the current indicators.
   * @public
   *
   * @param {CircuitState} circuitConnection - OPEN_CIRCUIT | BATTERY_CONNECTED
   * @param {boolean} currentIndicatorsVisible
   */
  updateCurrentVisibility( circuitConnection, currentIndicatorsVisible ) {
    const isBatteryConnected = ( circuitConnection === CircuitState.BATTERY_CONNECTED );

    this.batteryTopCurrentIndicatorNode.setVisible( isBatteryConnected && currentIndicatorsVisible );
    this.batteryBottomCurrentIndicatorNode.setVisible( isBatteryConnected && currentIndicatorsVisible );
  }
}

capacitorLabBasics.register( 'CapacitanceCircuitNode', CapacitanceCircuitNode );

export default CapacitanceCircuitNode;