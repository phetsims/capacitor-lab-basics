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
  var BarMeterNode = require( 'CAPACITOR_LAB_BASICS/common/view/meters/BarMeterNode' );
  var CapacitorLabBasicsLightBulbControl = require( 'CAPACITOR_LAB_BASICS/light-bulb/view/control/CapacitorLabBasicsLightBulbControl' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ResistanceSlider = require( 'CAPACITOR_LAB_BASICS/light-bulb/view/control/ResistanceSlider' );

  // Strings
  var capacitanceString = require( 'string!CAPACITOR_LAB_BASICS/capacitance' );
  var plateChargeString = require( 'string!CAPACITOR_LAB_BASICS/plateCharge' );
  var storedEnergyString = require( 'string!CAPACITOR_LAB_BASICS/storedEnergy' );

  /**
   * @param {CapacitorLabBasicsModel} model
   * @constructor
   */
  function CapacitorLabBasicsLightBulbScreenView( model ) {

    ScreenView.call( this );

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

    // control
    // TODO: Layout calculations are messy, come back soon to clean up.
    //var minWidth = storedEnergyMeterNode.right - plateChargeMeterNode.left * 2;
    var capacitorLabBasicsLightBulbControl = new CapacitorLabBasicsLightBulbControl( model );
    capacitorLabBasicsLightBulbControl.translation = this.layoutBounds.rightTop.minusXY( capacitorLabBasicsLightBulbControl.width + 15, -20 );

    // TODO: Resistance slider to play with the internal resistance of the lightbulb. Remove after testing.
    var title = 'Resistance: ';
    var numberProperty = model.circuit.lightBulb.resistanceProperty;
    var numberRange = model.circuit.lightBulb.resistanceRange;

    var resistanceSlider = new ResistanceSlider( title, numberProperty, numberRange );
    storedEnergyMeterNode.rightTop = capacitorLabBasicsLightBulbControl.leftTop.minusXY( 15, 10 );
    plateChargeMeterNode.rightCenter = storedEnergyMeterNode.leftCenter.minusXY( 15, 0 );
    capacitanceMeterNode.rightCenter = plateChargeMeterNode.leftCenter;
    resistanceSlider.rightTop = capacitorLabBasicsLightBulbControl.centerBottom.plusXY( 0, 60 );

    // reset button
    this.resetAllButton = new ResetAllButton( {
      listener: function() { model.reset(); },
      bottom: this.layoutBounds.bottom - 20,
      right: this.layoutBounds.right - 30,
      radius: 25
    } );

    // rendering order
    this.addChild( lightBulbCircuitNode );
    this.addChild( capacitanceMeterNode );
    this.addChild( plateChargeMeterNode );
    this.addChild( storedEnergyMeterNode );
    //addChild( voltmeterNode );
    this.addChild( capacitorLabBasicsLightBulbControl );
    this.addChild( this.resetAllButton );
    this.addChild( resistanceSlider );
  }

  return inherit( ScreenView, CapacitorLabBasicsLightBulbScreenView );
} );