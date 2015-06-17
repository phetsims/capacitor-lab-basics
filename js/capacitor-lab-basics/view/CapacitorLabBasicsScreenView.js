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
  var CircuitNode = require( 'CAPACITOR_LAB_BASICS/capacitor-lab-basics/view/CircuitNode' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var BarMeterNode = require( 'CAPACITOR_LAB_BASICS/common/view/meters/BarMeterNode' );

  // Strings
  var capacitanceString = require( 'string!CAPACITOR_LAB_BASICS/capacitance' );
  var plateChargeTopString = require( 'string!CAPACITOR_LAB_BASICS/plateCharge.top' );
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
    var circuitNode = new CircuitNode( model.circuit, this.modelViewTransform, model.plateChargesVisible,
      model.eFieldVisible, maxPlateCharge, maxEffectiveEField );

    // meters
    var capacitanceMeterNode = new BarMeterNode.CapacitanceMeterNode( model.capacitanceMeter, this.modelViewTransform, capacitanceString );
    var plateChargeMeterNode = new BarMeterNode.PlateChargeMeterNode( model.plateChargeMeter, this.modelViewTransform, plateChargeTopString );
    var storedEnergyMeterNode = new BarMeterNode.StoredEnergyMeterNode( model.storedEnergyMeter, this.modelViewTransform, storedEnergyString );
    //VoltmeterNode voltmeterNode = new VoltmeterNode( model.voltmeter, mvt );
    //EFieldDetectorNode eFieldDetectorNode = new EFieldDetectorNode( model.eFieldDetector, mvt, eFieldReferenceMagnitude, globalProperties.dev, eFieldDetectorSimplified );

    // rendering order
    this.addChild( circuitNode );
    this.addChild( capacitanceMeterNode );
    this.addChild( plateChargeMeterNode );
    this.addChild( storedEnergyMeterNode );
    //addChild( eFieldDetectorNode );
    //addChild( voltmeterNode );
    //addChild( shapesDebugParentNode );
  }

  return inherit( ScreenView, CapacitorLabBasicsScreenView );
} );