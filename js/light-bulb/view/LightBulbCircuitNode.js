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
   * @param {LightBulbCircuit} circuit
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Property} plateChargeVisibleProperty
   * @param {Property} eFieldVisibleProperty
   * @param {Property.<boolean>} currentIndicatorsVisibleProperty
   * @param {number} maxPlateCharge
   * @param {number} maxEffectiveEField
   * @constructor
   */
  function LightBulbCircuitNode( circuit, modelViewTransform, plateChargeVisibleProperty, eFieldVisibleProperty,
                                 currentIndicatorsVisibleProperty, maxPlateCharge, maxEffectiveEField ) {

    CLBCircuitNode.call( this, circuit, modelViewTransform, plateChargeVisibleProperty, eFieldVisibleProperty, currentIndicatorsVisibleProperty, maxPlateCharge, maxEffectiveEField ); // supertype constructor

    var thisNode = this;
    this.circuit = circuit; // @private

    // circuit components
    var lightBulbNode = new BulbNode( circuit.lightBulb, circuit.capacitor.platesVoltageProperty, circuit.circuitConnectionProperty, modelViewTransform );

    // @private current indicators
    this.bulbTopCurrentIndicatorNode = new CurrentIndicatorNode( circuit.currentAmplitudeProperty, 0 );
    this.bulbBottomCurrentIndicatorNode = new CurrentIndicatorNode( circuit.currentAmplitudeProperty, Math.PI );

    // rendering order
    this.addChild( lightBulbNode );
    this.addChild( this.bulbTopCurrentIndicatorNode );
    this.addChild( this.bulbBottomCurrentIndicatorNode );
    this.addChild( this.circuitSwitchNodes[ 1 ] );

    // layout TODO: Much of the layout will need to be fixed or tidied.  Many design decisions to be made.
    var x = 0;
    var y = 0;

    // LightBulb - translate so that center is the center of the base.
    lightBulbNode.center = modelViewTransform.modelToViewPosition( circuit.lightBulb.location.plus( new Vector3( 0.0020, 0, 0 ) ) );

    // top right current indicator
    x = this.circuitSwitchNodes[ 0 ].right + ( lightBulbNode.left - this.circuitSwitchNodes[ 0 ].right ) / 2;
    y = this.topWireNode.bounds.minY + ( 7 / 2 );
    this.bulbTopCurrentIndicatorNode.translate( x, y );

    // bottom right current indicator
    y = this.bottomWireNode.bounds.maxY - ( 7 / 2 );
    this.bulbBottomCurrentIndicatorNode.translate( x, y );

    // current indicator observers
    circuit.circuitConnectionProperty.link( function( circuitConnection ) {
      thisNode.updateCurrentVisibility( circuitConnection, currentIndicatorsVisibleProperty.value );
    } );

    currentIndicatorsVisibleProperty.link( function( currentIndicatorsVisible ) {
      thisNode.updateCurrentVisibility( circuit.circuitConnectionProperty.value, currentIndicatorsVisible );
    } );
    
  }

  capacitorLabBasics.register( 'LightBulbCircuitNode', LightBulbCircuitNode );
  
  return inherit( CLBCircuitNode, LightBulbCircuitNode, {

    // Updates the circuit components and controls to match the state of the battery connection.
    updateCurrentVisibility: function( circuitConnection, currentIndicatorsVisible ) {

      // As long as the circuit is not open, the circuit is considered connected.
      var isBatteryConnected = ( circuitConnection === CircuitConnectionEnum.BATTERY_CONNECTED );
      var isLightBulbConnected = ( circuitConnection === CircuitConnectionEnum.LIGHT_BULB_CONNECTED );

      this.batteryTopCurrentIndicatorNode.setVisible( isBatteryConnected && currentIndicatorsVisible );
      this.batteryBottomCurrentIndicatorNode.setVisible( isBatteryConnected && currentIndicatorsVisible );

      this.bulbTopCurrentIndicatorNode.setVisible( isLightBulbConnected && currentIndicatorsVisible );
      this.bulbBottomCurrentIndicatorNode.setVisible( isLightBulbConnected && currentIndicatorsVisible );
    }
  } );

} );