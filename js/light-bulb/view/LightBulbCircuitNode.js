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
  var BulbNode = require( 'CAPACITOR_LAB_BASICS/common/view/BulbNode' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CircuitState = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitState' );
  var CLBCircuitNode = require( 'CAPACITOR_LAB_BASICS/common/view/CLBCircuitNode' );
  var CurrentIndicatorNode = require( 'CAPACITOR_LAB_BASICS/common/view/CurrentIndicatorNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector3 = require( 'DOT/Vector3' );

  /**
   * Constructor for a CircuitNode.
   *
   * @param {CLBLightBulbModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function LightBulbCircuitNode( model, tandem ) {

    CLBCircuitNode.call( this, model, tandem );

    var self = this;

    var circuit = model.circuit;

    // circuit components
    var lightBulbNode = new BulbNode( circuit.lightBulb, circuit.capacitor.plateVoltageProperty,
      circuit.circuitConnectionProperty, tandem.createTandem( 'lightBulbNode' ), {} );

    // @private current indicators
    this.bulbTopCurrentIndicatorNode = new CurrentIndicatorNode( circuit.currentAmplitudeProperty, 0,
    tandem.createTandem( 'bulbTopCurrentIndicatorNode' ) );
    this.bulbBottomCurrentIndicatorNode = new CurrentIndicatorNode( circuit.currentAmplitudeProperty, Math.PI,
    tandem.createTandem( 'bulbBottomCurrentIndicatorNode' ) );

    // rendering order
    this.addChild( lightBulbNode );
    this.addChild( this.bulbTopCurrentIndicatorNode );
    this.addChild( this.bulbBottomCurrentIndicatorNode );

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
      self.updateCurrentVisibility( circuitConnection, model.currentVisibleProperty.value );
    } );

    model.currentVisibleProperty.link( function( currentIndicatorsVisible ) {
      self.updateCurrentVisibility( circuit.circuitConnectionProperty.value, currentIndicatorsVisible );
    } );

  }

  capacitorLabBasics.register( 'LightBulbCircuitNode', LightBulbCircuitNode );

  return inherit( CLBCircuitNode, LightBulbCircuitNode, {

    /**
     * Updates the visibility of the current indicators.
     *
     * @param  {string} circuitConnection - LIGHT_BULB_CONNECTED || OPEN_CIRCUIT || BATTERY_CONNECTED
     * @param  {boolean} currentIndicatorsVisible
     * @public
     */
    updateCurrentVisibility: function( circuitConnection, currentIndicatorsVisible ) {
      var isBatteryConnected = ( circuitConnection === CircuitState.BATTERY_CONNECTED );
      var isLightBulbConnected = ( circuitConnection === CircuitState.LIGHT_BULB_CONNECTED );

      this.batteryTopCurrentIndicatorNode.setVisible( isBatteryConnected && currentIndicatorsVisible );
      this.batteryBottomCurrentIndicatorNode.setVisible( isBatteryConnected && currentIndicatorsVisible );

      this.bulbTopCurrentIndicatorNode.setVisible( isLightBulbConnected && currentIndicatorsVisible );
      this.bulbBottomCurrentIndicatorNode.setVisible( isLightBulbConnected && currentIndicatorsVisible );
    }
  } );

} );
