// Copyright 2015, University of Colorado Boulder

/**
 * ScreenView for "Light Bulb" screen of Capacitor Lab: Basics.
 *
 * This this extension of ScreenView is a direct port of DielectricCanvas of Capacitor Lab without dielectrics.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var BarMeterPanel = require( 'CAPACITOR_LAB_BASICS/light-bulb/view/BarMeterPanel' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CLBViewControl = require( 'CAPACITOR_LAB_BASICS/common/view/control/CLBViewControl' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LightBulbCircuitNode = require( 'CAPACITOR_LAB_BASICS/light-bulb/view/LightBulbCircuitNode' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Vector2 = require( 'DOT/Vector2' );
  var VoltmeterNode = require( 'CAPACITOR_LAB_BASICS/common/view/meters/VoltmeterNode' );
  var VoltmeterToolBoxPanel = require( 'CAPACITOR_LAB_BASICS/common/view/control/VoltmeterToolBoxPanel' );

  // Panel offsets (wrt various references) in model coordinates.
  var VIEW_PANEL_OFFSET = new Vector2( -20, 20 );
  var BAR_METER_PANEL_OFFSET = new Vector2( 0, 30 );
  var VOLTMETER_PANEL_OFFSET = new Vector2( 0, 20 );

  /**
   * @param {CapacitorLabBasicsLightBulbModel} model
   * @constructor
   */
  function CLBLightBulbScreenView( model ) {

    ScreenView.call( this );

    this.modelViewTransform = model.modelViewTransform; // @private
    this.model = model; // @private

    // Maximums, for calibrating various view representations.
    var maxPlateCharge = model.getMaxPlateCharge();
    var maxEffectiveEField = model.getMaxEffectiveEField();

    // Circuit
    var lightBulbCircuitNode = new LightBulbCircuitNode( model.circuit, this.modelViewTransform, model.plateChargesVisibleProperty,
      model.eFieldVisibleProperty, model.currentIndicatorsVisibleProperty, maxPlateCharge, maxEffectiveEField );

    // meters
    var barMeterPanel = new BarMeterPanel( model, lightBulbCircuitNode.topWireNode.width );
    var voltmeterNode = new VoltmeterNode( model.voltmeter, this.modelViewTransform, model.voltmeterVisibleProperty );
    var voltmeterToolbox = new VoltmeterToolBoxPanel( voltmeterNode, this.modelViewTransform,
      model.voltmeter.inUserControlProperty, model.voltmeterVisibleProperty );

    // View control panel and voltmeter panel
    var viewControlPanel = new CLBViewControl( model );
    viewControlPanel.rightTop = this.layoutBounds.rightTop.plus( VIEW_PANEL_OFFSET );
    voltmeterToolbox.rightTop = viewControlPanel.rightBottom.plus( VOLTMETER_PANEL_OFFSET );

    // Circuit bar meter panel
    barMeterPanel.leftBottom = lightBulbCircuitNode.topWireNode.leftTop.minus( BAR_METER_PANEL_OFFSET );

    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      bottom: this.layoutBounds.bottom - 20,
      right: this.layoutBounds.right - 30,
      radius: 25
    } );

    // track user control of the voltmeter and place the voltmeter back in the tool box if bounds collide.
    model.voltmeter.inUserControlProperty.link( function( inUserControl ) {
      if ( !inUserControl && voltmeterToolbox.bounds.intersectsBounds( voltmeterNode.bodyNode.bounds.eroded( 40 ) ) ) {
        model.voltmeterVisibleProperty.set( false );
      }
    } );

    // rendering order
    this.addChild( lightBulbCircuitNode );
    this.addChild( barMeterPanel );
    this.addChild( viewControlPanel );
    this.addChild( voltmeterToolbox );
    this.addChild( voltmeterNode );
    this.addChild( resetAllButton );

  }

  capacitorLabBasics.register( 'CLBLightBulbScreenView', CLBLightBulbScreenView );

  return inherit( ScreenView, CLBLightBulbScreenView );
} );

