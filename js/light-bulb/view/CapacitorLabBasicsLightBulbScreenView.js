// Copyright 2002-2015, University of Colorado Boulder5

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
  var CapacitorLabBasicsViewControl = require( 'CAPACITOR_LAB_BASICS/common/view/control/CapacitorLabBasicsViewControl' );
  var HSlider = require( 'SUN/HSlider' );
  var Property = require( 'AXON/Property' );
  var Image = require( 'SCENERY/nodes/Image' );

  // images
  var mockupImage = require( 'image!CAPACITOR_LAB_BASICS/Light_Bulb_Screen_Graphs.png' );

  /**
   * @param {CapacitorLabBasicsModel} model
   * @constructor
   */
  function CapacitorLabBasicsLightBulbScreenView( model ) {

    ScreenView.call( this );

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
    var voltmeterNode = new VoltmeterNode( model.voltmeter, this.modelViewTransform );

    // control
    // TODO: Layout calculations are messy, come back soon to clean up.
    var capacitorLabBasicsLightBulbViewControl = new CapacitorLabBasicsViewControl( model );
    capacitorLabBasicsLightBulbViewControl.translation = this.layoutBounds.rightTop.minusXY( capacitorLabBasicsLightBulbViewControl.width + 15, -20 );

    barMeterPanel.leftBottom = lightBulbCircuitNode.topWireNode.leftTop.minusXY( 0, 30 );

    var resetAllButton = new ResetAllButton( {
      listener: function() { model.reset(); },
      bottom: this.layoutBounds.bottom - 20,
      right: this.layoutBounds.right - 30,
      radius: 25
    } );

    // rendering order
    this.addChild( lightBulbCircuitNode );
    this.addChild( barMeterPanel );
    this.addChild( voltmeterNode );
    this.addChild( capacitorLabBasicsLightBulbViewControl );
    this.addChild( resetAllButton );

    // TODO: For development only: -------------------------------------------------------------------------------
    //Show the mock-up and a slider to change its transparency
    var mockupOpacityProperty = new Property( 0.0001 );
    var image = new Image( mockupImage, { pickable: false } );
    image.scale( this.layoutBounds.width / image.width, this.layoutBounds.height / image.height );
    mockupOpacityProperty.linkAttribute( image, 'opacity' );
    this.addChild( image );
    this.addChild( new HSlider( mockupOpacityProperty, { min: 0.001, max: 1 }, { top: 10, left: this.layoutBounds.width - 350 } ) );
    // TODO: -----------------------------------------------------------------------------------------------------
  }

  return inherit( ScreenView, CapacitorLabBasicsLightBulbScreenView );
} );