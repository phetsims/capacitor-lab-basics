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
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var LightBulbCircuitNode = require( 'CAPACITOR_LAB_BASICS/light-bulb/view/LightBulbCircuitNode' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var VoltmeterNode = require( 'CAPACITOR_LAB_BASICS/common/view/meters/VoltmeterNode' );
  var BarMeterPanel = require( 'CAPACITOR_LAB_BASICS/light-bulb/view/BarMeterPanel' );
  var VoltmeterToolBoxPanel = require( 'CAPACITOR_LAB_BASICS/common/view/control/VoltmeterToolBoxPanel' );
  var KeyboardHelpPanel = require( 'CAPACITOR_LAB_BASICS/common/view/KeyboardHelpPanel' );
  var CapacitorLabBasicsViewControl = require( 'CAPACITOR_LAB_BASICS/common/view/control/CapacitorLabBasicsViewControl' );
  var Input = require( 'SCENERY/input/Input' );
  
  // strings
  var lightBulbDescriptionString = require( 'string!CAPACITOR_LAB_BASICS/lightBulb.description' );

  /**
   * @param {CapacitorLabBasicsLightBulbModel} model
   * @constructor
   */
  function CapacitorLabBasicsLightBulbScreenView( model ) {

    ScreenView.call( this, {
      screenDescription: lightBulbDescriptionString
    } );

    this.modelViewTransform = model.modelViewTransform; // @private
    this.model = model; // @private

    // Maximums, for calibrating various view representations.
    var maxPlateCharge = model.getMaxPlateCharge();
    var maxEffectiveEField = model.getMaxEffectiveEField();

    // circuit
    var lightBulbCircuitNode = new LightBulbCircuitNode( model.circuit, this.modelViewTransform, model.plateChargesVisibleProperty,
      model.eFieldVisibleProperty, model.currentIndicatorsVisibleProperty, maxPlateCharge, maxEffectiveEField );

    // meters
    var barMeterPanel = new BarMeterPanel( model, lightBulbCircuitNode.topWireNode.width );
    var voltmeterNode = new VoltmeterNode( model.voltmeter, this.modelViewTransform, model.voltmeterVisibleProperty );
    var voltmeterToolbox = new VoltmeterToolBoxPanel( voltmeterNode, this.modelViewTransform,
      model.voltmeter.inUserControlProperty, model.voltmeterVisibleProperty );

    // control
    // TODO: Layout calculations are messy, come back soon to clean up.
    var capacitorLabBasicsLightBulbViewControl = new CapacitorLabBasicsViewControl( model );
    capacitorLabBasicsLightBulbViewControl.translation = this.layoutBounds.rightTop.minusXY( capacitorLabBasicsLightBulbViewControl.width + 15, -20 );

    barMeterPanel.leftBottom = lightBulbCircuitNode.topWireNode.leftTop.minusXY( 0, 30 );
    voltmeterToolbox.rightTop = capacitorLabBasicsLightBulbViewControl.rightBottom.plusXY( 0, 20 );

    var resetAllButton = new ResetAllButton( {
      listener: function() { model.reset(); },
      bottom: this.layoutBounds.bottom - 20,
      right: this.layoutBounds.right - 30,
      radius: 25
    } );
    
    var keyboardHelpPanel = new KeyboardHelpPanel( model );
    keyboardHelpPanel.centerX = ( this.layoutBounds.right + this.layoutBounds.left ) / 2;
    keyboardHelpPanel.centerY = ( this.layoutBounds.top + this.layoutBounds.bottom ) / 2;

    // track user control of the voltmeter and place the voltmeter back in the tool box if bounds collide.
    model.voltmeter.inUserControlProperty.link( function( inUserControl ) {
      if ( !inUserControl && voltmeterToolbox.bounds.intersectsBounds( voltmeterNode.bodyNode.bounds.eroded( 40 ) ) ) {
        model.voltmeterVisibleProperty.set( false );
      }
    } );

    // rendering order
    this.addChild( lightBulbCircuitNode );
    this.addChild( barMeterPanel );
    this.addChild( capacitorLabBasicsLightBulbViewControl );
    this.addChild( voltmeterToolbox );
    this.addChild( voltmeterNode );
    this.addChild( resetAllButton );
    this.addChild( keyboardHelpPanel );

    // accessible content
    var activeElement = document.activeElement;
    this.accessibleContent = {
      createPeer: function( accessibleInstance ) {

        // generate the 'supertype peer' for the ScreenView in the parallel DOM.
        var accessiblePeer = ScreenView.ScreenViewAccessiblePeer( accessibleInstance );

        // add a global event listener to all children of this screen view, bubbles through all children
        accessiblePeer.domElement.addEventListener( 'keydown', function( event ) {
          // 'global' event behavior in here...
          // keycode = 'h'
          if ( event.keyCode === 72 ) {
            model.keyboardHelpVisibleProperty.set( true );
            var panel = document.getElementById( keyboardHelpPanel.accessibleId );
            panel.focus();
          }
          else if ( event.keyCode === Input.KEY_TAB || event.keyCode === Input.KEY_ESCAPE ) {
            if ( model.keyboardHelpVisibleProperty.get() ) {
              var batteryElem = document.getElementById( lightBulbCircuitNode.batteryNode.accessibleId );
              activeElement = activeElement === document.body ? batteryElem : activeElement;
              activeElement.focus();
              model.keyboardHelpVisibleProperty.set( false );
            }
            activeElement = document.activeElement;
          }
        } );

        return accessiblePeer;
      }
    };
  }

  return inherit( ScreenView, CapacitorLabBasicsLightBulbScreenView );
} );