// Copyright 2015-2022, University of Colorado Boulder

/**
 * Circuit node for the "Light Bulb" screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import Vector3 from '../../../../dot/js/Vector3.js';
import capacitorLabBasics from '../../capacitorLabBasics.js';
import CircuitState from '../../common/model/CircuitState.js';
import BulbNode from '../../common/view/BulbNode.js';
import CLBCircuitNode from '../../common/view/CLBCircuitNode.js';
import CurrentIndicatorNode from '../../common/view/CurrentIndicatorNode.js';

class LightBulbCircuitNode extends CLBCircuitNode {
  /**
   * @param {CLBLightBulbModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {
    super( model, tandem );

    const circuit = model.circuit;

    // circuit components
    const lightBulbNode = new BulbNode( circuit.lightBulb, circuit.capacitor.plateVoltageProperty,
      circuit.circuitConnectionProperty, tandem.createTandem( 'lightBulbNode' ), {} );

    // @private current indicators
    this.bulbTopCurrentIndicatorNode = new CurrentIndicatorNode(
      circuit.currentAmplitudeProperty,
      0,
      model.currentOrientationProperty,
      model.arrowColorProperty,
      model.stepEmitter,
      tandem.createTandem( 'bulbTopCurrentIndicatorNode' ) );
    this.bulbBottomCurrentIndicatorNode = new CurrentIndicatorNode(
      circuit.currentAmplitudeProperty,
      Math.PI,
      model.currentOrientationProperty,
      model.arrowColorProperty,
      model.stepEmitter,
      tandem.createTandem( 'bulbBottomCurrentIndicatorNode' ) );

    // rendering order
    this.addChild( lightBulbNode );
    this.addChild( this.bulbTopCurrentIndicatorNode );
    this.addChild( this.bulbBottomCurrentIndicatorNode );

    // LightBulb - translate so that center is the center of the base.
    lightBulbNode.center = model.modelViewTransform.modelToViewPosition( circuit.lightBulb.position.plus( new Vector3( 0.0020, 0, 0 ) ) );

    // top right current indicator
    const x = this.circuitSwitchNodes[ 0 ].right + ( lightBulbNode.left - this.circuitSwitchNodes[ 0 ].right ) / 2;
    let y = this.topWireNode.bounds.minY + ( 7 / 2 );
    this.bulbTopCurrentIndicatorNode.translate( x, y );

    // bottom right current indicator
    y = this.bottomWireNode.bounds.maxY - ( 7 / 2 );
    this.bulbBottomCurrentIndicatorNode.translate( x, y );

    // current indicator observer, no need for disposal since they persist for the lifetime of the sim
    Multilink.multilink( [ circuit.circuitConnectionProperty, model.currentVisibleProperty, model.isPlayingProperty ],
      ( circuitConnection, currentVisible, isPlaying ) => {
        const isBatteryConnected = ( circuitConnection === CircuitState.BATTERY_CONNECTED );
        const isLightBulbConnected = ( circuitConnection === CircuitState.LIGHT_BULB_CONNECTED );

        this.batteryTopCurrentIndicatorNode.adjustVisibility( isBatteryConnected && currentVisible );
        this.batteryBottomCurrentIndicatorNode.adjustVisibility( isBatteryConnected && currentVisible );

        this.bulbTopCurrentIndicatorNode.adjustVisibility( isLightBulbConnected && currentVisible );
        this.bulbBottomCurrentIndicatorNode.adjustVisibility( isLightBulbConnected && currentVisible );
      } );
  }
}

capacitorLabBasics.register( 'LightBulbCircuitNode', LightBulbCircuitNode );

export default LightBulbCircuitNode;
