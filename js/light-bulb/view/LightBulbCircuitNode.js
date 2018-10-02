// Copyright 2015-2017, University of Colorado Boulder

/**
 * Circuit node for the "Light Bulb" screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
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
  var Property = require( 'AXON/Property' );
  var Vector3 = require( 'DOT/Vector3' );

  /**
   * @constructor
   *
   * @param {CLBLightBulbModel} model
   * @param {Tandem} tandem
   */
  function LightBulbCircuitNode( model, tandem ) {

    CLBCircuitNode.call( this, model, tandem );

    var self = this;

    var circuit = model.circuit;

    // circuit components
    var lightBulbNode = new BulbNode( circuit.lightBulb, circuit.capacitor.plateVoltageProperty,
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
    lightBulbNode.center = model.modelViewTransform.modelToViewPosition( circuit.lightBulb.location.plus( new Vector3( 0.0020, 0, 0 ) ) );

    // top right current indicator
    var x = this.circuitSwitchNodes[ 0 ].right + ( lightBulbNode.left - this.circuitSwitchNodes[ 0 ].right ) / 2;
    var y = this.topWireNode.bounds.minY + ( 7 / 2 );
    this.bulbTopCurrentIndicatorNode.translate( x, y );

    // bottom right current indicator
    y = this.bottomWireNode.bounds.maxY - ( 7 / 2 );
    this.bulbBottomCurrentIndicatorNode.translate( x, y );

    // current indicator observer, no need for disposal since they persist for the lifetime of the sim
    Property.multilink( [ circuit.circuitConnectionProperty, model.currentVisibleProperty, model.isPlayingProperty ],
      function( circuitConnection, currentVisible, isPlaying ) {
        var isBatteryConnected = ( circuitConnection === CircuitState.BATTERY_CONNECTED );
        var isLightBulbConnected = ( circuitConnection === CircuitState.LIGHT_BULB_CONNECTED );

        self.batteryTopCurrentIndicatorNode.adjustVisibility( isBatteryConnected && currentVisible );
        self.batteryBottomCurrentIndicatorNode.adjustVisibility( isBatteryConnected && currentVisible );

        self.bulbTopCurrentIndicatorNode.adjustVisibility( isLightBulbConnected && currentVisible );
        self.bulbBottomCurrentIndicatorNode.adjustVisibility( isLightBulbConnected && currentVisible );
      } );
  }

  capacitorLabBasics.register( 'LightBulbCircuitNode', LightBulbCircuitNode );

  return inherit( CLBCircuitNode, LightBulbCircuitNode );
} );
