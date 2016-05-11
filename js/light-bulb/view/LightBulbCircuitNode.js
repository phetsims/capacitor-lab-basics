// Copyright 2015, University of Colorado Boulder

/**
 * Circuit node for the "Light Bulb" screen.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var CurrentIndicatorNode = require( 'CAPACITOR_LAB_BASICS/common/view/CurrentIndicatorNode' );
  var Vector3 = require( 'DOT/Vector3' );
  var CircuitConnectionEnum = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitConnectionEnum' );
  var BulbNode = require( 'CAPACITOR_LAB_BASICS/common/view/BulbNode' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CLBCircuitNode = require( 'CAPACITOR_LAB_BASICS/common/view/CLBCircuitNode' );

  /**
   * Constructor for a CircuitNode.
   *
   * @param {CLBLightBulbModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function LightBulbCircuitNode( model, tandem ) {

    CLBCircuitNode.call( this, model, tandem );

    var thisNode = this;

    var circuit = model.circuit;

    // circuit components
    var lightBulbNode = new BulbNode( circuit.lightBulb, circuit.capacitor.platesVoltageProperty, circuit.circuitConnectionProperty, model.modelViewTransform );

    // @private current indicators
    this.bulbTopCurrentIndicatorNode = new CurrentIndicatorNode( circuit.currentAmplitudeProperty, 0 );
    this.bulbBottomCurrentIndicatorNode = new CurrentIndicatorNode( circuit.currentAmplitudeProperty, Math.PI );

    // rendering order
    this.addChild( lightBulbNode );
    this.addChild( this.bulbTopCurrentIndicatorNode );
    this.addChild( this.bulbBottomCurrentIndicatorNode );

    // layout TODO: Much of the layout will need to be fixed or tidied.  Many design decisions to be made.
    var x = 0;
    var y = 0;

    // LightBulb - translate so that center is the center of the base.
    lightBulbNode.center = model.modelViewTransform.modelToViewPosition(
      circuit.lightBulb.location.plus( new Vector3( 0.0020, 0, 0 ) ) );

    // top right current indicator
    x = this.circuitSwitchNodes[ 0 ].right + ( lightBulbNode.left - this.circuitSwitchNodes[ 0 ].right ) / 2;
    y = this.topWireNode.bounds.minY + ( 7 / 2 );
    this.bulbTopCurrentIndicatorNode.translate( x, y );

    // bottom right current indicator
    y = this.bottomWireNode.bounds.maxY - ( 7 / 2 );
    this.bulbBottomCurrentIndicatorNode.translate( x, y );

    // current indicator observers, no need for disposal since they persist for the lifetime of the sim
    circuit.circuitConnectionProperty.link( function( circuitConnection ) {
      thisNode.updateCurrentVisibility( circuitConnection, model.currentVisibleProperty.value );
    } );

    model.currentVisibleProperty.link( function( currentIndicatorsVisible ) {
      thisNode.updateCurrentVisibility( circuit.circuitConnectionProperty.value, currentIndicatorsVisible );
    } );

  }

  capacitorLabBasics.register( 'LightBulbCircuitNode', LightBulbCircuitNode );

  return inherit( CLBCircuitNode, LightBulbCircuitNode, {

    /**
     * Updates the visibility of the current indicators.
     *
     * @param  {string} circuitConnection - LIGHT_BULB_CONNECTED || OPEN_CIRCUIT || BATTERY_CONNECTED
     * @param  {boolean} currentIndicatorsVisible
     */
    updateCurrentVisibility: function( circuitConnection, currentIndicatorsVisible ) {
      var isBatteryConnected = ( circuitConnection === CircuitConnectionEnum.BATTERY_CONNECTED );
      var isLightBulbConnected = ( circuitConnection === CircuitConnectionEnum.LIGHT_BULB_CONNECTED );

      this.batteryTopCurrentIndicatorNode.setVisible( isBatteryConnected && currentIndicatorsVisible );
      this.batteryBottomCurrentIndicatorNode.setVisible( isBatteryConnected && currentIndicatorsVisible );

      this.bulbTopCurrentIndicatorNode.setVisible( isLightBulbConnected && currentIndicatorsVisible );
      this.bulbBottomCurrentIndicatorNode.setVisible( isLightBulbConnected && currentIndicatorsVisible );
    }
  } );

} );

