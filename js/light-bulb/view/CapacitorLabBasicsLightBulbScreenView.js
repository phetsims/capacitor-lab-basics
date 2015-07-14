// Copyright 2002-2015, University of Colorado Boulder5

/**
 * ScreenView for Capacitor Lab Basics.
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
  var Bounds2 = require( 'DOT/Bounds2' );
  var BarMeterNode = require( 'CAPACITOR_LAB_BASICS/common/view/meters/BarMeterNode' );
  var CapacitorLabBasicsLightBulbControl = require( 'CAPACITOR_LAB_BASICS/light-bulb/view/control/CapacitorLabBasicsLightBulbControl' );
  var CircuitControlPanel = require( 'CAPACITOR_LAB_BASICS/common/view/control/CircuitControlPanel' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  var StepButton = require( 'SCENERY_PHET/buttons/StepButton' );

  // Strings
  var capacitanceString = require( 'string!CAPACITOR_LAB_BASICS/capacitance' );
  var plateChargeString = require( 'string!CAPACITOR_LAB_BASICS/plateCharge' );
  var storedEnergyString = require( 'string!CAPACITOR_LAB_BASICS/storedEnergy' );
  //var connectBatteryString = require( 'string!CAPACITOR_LAB/connectBattery' );
  //var disconnectBatteryString = require( 'string!CAPACITOR_LAB/disconnectBattery' );
  // checkbox panel strings
  //var viewTitleString = require( 'string!CAPACITOR_LAB/view' );
  //var plateChargeString = require( 'string!CAPACITOR_LAB/plateCharges' );
  //var eFieldLinesString = require( 'string!CAPACITOR_LAB/eFieldLines' );
  //var metersTitleString = require( 'string!CAPACITOR_LAB/meters' );
  //var chargeMeterString = require( 'string!CAPACITOR_LAB/plateCharge' );
  //var eMeterString = require( 'string!CAPACITOR_LAB/storedEnergy' );
  //var voltMeterString = require( 'string!CAPACITOR_LAB/voltmeter' );
  //var eFieldMeterString = require( 'string!CAPACITOR_LAB/eFieldDetector' );
  // meter title strings
  //var capMeterTitle = require( 'string!CAPACITOR_LAB/capMeterTitle' );
  //var chargeMeterTitle = require( 'string!CAPACITOR_LAB/chargeMeterTitle' );
  //var energyMeterTitle = require( 'string!CAPACITOR_LAB/energyMeterTitle' );

  /**
   * @param {CapacitorLabBasicsModel} model
   * @constructor
   */
  function CapacitorLabBasicsScreenView( model ) {

    ScreenView.call( this, { layoutBounds: new Bounds2( 0, 0, 1024, 864 ) } );

    this.modelViewTransform = model.modelViewTransform;

    this.model = model;

    // Maximums, for calibrating various view representations.
    var maxPlateCharge = model.getMaxPlateCharge();
    //var maxExcessDielectricPlateCharge = model.getMaxExcessDielectricPlateCharge();
    var maxEffectiveEField = model.getMaxEffectiveEField();
    //var eFieldReferenceMagnitude = model.getEFieldReferenceMagnitude();

    // circuit
    var lightBulbCircuitNode = new LightBulbCircuitNode( model.circuit, this.modelViewTransform, model.plateChargesVisibleProperty,
      model.eFieldVisibleProperty, model.valuesVisibleProperty, maxPlateCharge, maxEffectiveEField );

    // meters
    var capacitanceMeterNode = new BarMeterNode.CapacitanceMeterNode( model.capacitanceMeter, this.modelViewTransform, capacitanceString );
    var plateChargeMeterNode = new BarMeterNode.PlateChargeMeterNode( model.plateChargeMeter, this.modelViewTransform, plateChargeString );
    var storedEnergyMeterNode = new BarMeterNode.StoredEnergyMeterNode( model.storedEnergyMeter, this.modelViewTransform, storedEnergyString );
    //VoltmeterNode voltmeterNode = new VoltmeterNode( model.voltmeter, mvt );
    //EFieldDetectorNode eFieldDetectorNode = new EFieldDetectorNode( model.eFieldDetector, mvt, eFieldReferenceMagnitude, globalProperties.dev, eFieldDetectorSimplified );

    // control
    // TODO: Layout calculations are messy, come back soon to clean up.
    var minWidth = storedEnergyMeterNode.right - plateChargeMeterNode.left * 2;
    var capacitorLabBasicsLightBulbControl = new CapacitorLabBasicsLightBulbControl( model, minWidth );
    capacitorLabBasicsLightBulbControl.translation = this.layoutBounds.rightCenter.minusXY( capacitorLabBasicsLightBulbControl.width + 10, 50 );

    var circuitControlPanel = new CircuitControlPanel( model.circuit );
    circuitControlPanel.translation = this.layoutBounds.leftBottom.minusXY( -10, circuitControlPanel.height + 5 );

    // play/pause button
    this.playPauseButton = new PlayPauseButton( model.playingProperty,
      {
        bottom:  this.layoutBounds.bottom - 20,
        centerX: this.layoutBounds.centerX - 25,
        radius: 25
      } );

    // step button
    this.stepButton = new StepButton(
      function() {
        model.manualStep();
      },
      model.playingProperty,
      {
        centerY: this.playPauseButton.centerY,
        centerX: this.layoutBounds.centerX + 25,
        radius: 19
      }
    );

    // reset buton
    this.resetAllButton = new ResetAllButton( {
      listener: function() { model.reset(); },
      bottom: this.layoutBounds.bottom - 20,
      right:  this.layoutBounds.right - 30,
      radius: 25
    } );

    // rendering order
    this.addChild( lightBulbCircuitNode);
    this.addChild( capacitanceMeterNode );
    this.addChild( plateChargeMeterNode );
    this.addChild( storedEnergyMeterNode );
    //addChild( eFieldDetectorNode );
    //addChild( voltmeterNode );
    //addChild( shapesDebugParentNode );
    this.addChild( capacitorLabBasicsLightBulbControl );
    this.addChild( circuitControlPanel );
    this.addChild( this.playPauseButton );
    this.addChild( this.stepButton );
    this.addChild( this.resetAllButton );
  }

  return inherit( ScreenView, CapacitorLabBasicsScreenView );
} );