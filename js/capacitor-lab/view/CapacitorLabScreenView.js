//  Copyright 2002-2014, University of Colorado Boulder

/**
 *
 * @author Emily Randall
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var BarMeterNode = require( 'CAPACITOR_LAB/capacitor-lab/view/meters/BarMeterNode' );
  var CircuitNode = require( 'CAPACITOR_LAB/capacitor-lab/view/CircuitNode' );
  var EFieldMeterNode = require( 'CAPACITOR_LAB/capacitor-lab/view/meters/EFieldMeterNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SUN/HStrut' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Text = require( 'SCENERY/nodes/Text' );
  var ToggleNode = require( 'SUN/ToggleNode' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var VerticalCheckBoxGroup = require( 'SUN/VerticalCheckBoxGroup' );
  var VoltmeterNode = require( 'CAPACITOR_LAB/capacitor-lab/view/meters/VoltmeterNode' );
  var VStrut = require( 'SUN/VStrut' );

  /**
   * @param {CapacitorLabModel} capacitorLabModel
   * @constructor
   */
  function CapacitorLabScreenView( capacitorLabModel ) {
    
    ScreenView.call( this, { layoutBounds: new Bounds2( 0, 0, 768, 504 ) } );
    
    // Strings
    var connectBatteryString = require( 'string!CAPACITOR_LAB/connectBattery' );
    var disconnectBatteryString = require( 'string!CAPACITOR_LAB/disconnectBattery' );
    // checkbox panel strings
    var viewTitleString = require( 'string!CAPACITOR_LAB/view' );
    var plateChargeString = require( 'string!CAPACITOR_LAB/plateCharges' );
    var eFieldLinesString = require( 'string!CAPACITOR_LAB/eFieldLines' );
    var metersTitleString = require( 'string!CAPACITOR_LAB/meters' );
    var capMeterString = require( 'string!CAPACITOR_LAB/capacitance' );
    var chargeMeterString = require( 'string!CAPACITOR_LAB/plateCharge' );
    var eMeterString = require( 'string!CAPACITOR_LAB/storedEnergy' );
    var voltMeterString = require( 'string!CAPACITOR_LAB/voltmeter' );
    var eFieldMeterString = require( 'string!CAPACITOR_LAB/eFieldDetector' );
    // meter title strings
    var capMeterTitle = require( 'string!CAPACITOR_LAB/capMeterTitle' );
    var chargeMeterTitle = require( 'string!CAPACITOR_LAB/chargeMeterTitle' );
    var energyMeterTitle = require( 'string!CAPACITOR_LAB/energyMeterTitle' );
    
    var labelOptionFont = {font: new PhetFont( 12 )};
    var titleFont = new PhetFont( 14 );

    // Create and add the Reset All Button in the bottom right, which resets the model
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        capacitorLabModel.reset();
      },
      right: this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );
    this.addChild( resetAllButton );
    
    // Add the circuit
    var circuitNode = new CircuitNode( capacitorLabModel, {
      x: 35,
      y: 150,
      scale: .7}
    );
    this.addChild( circuitNode );
    
    // Add the button to connect or disconnect the battery from the plates
    var connectBatteryText = new Text( connectBatteryString, labelOptionFont );
    var disconnectBatteryText = new Text( disconnectBatteryString, labelOptionFont );
    var batteryToggleNode = new ToggleNode( disconnectBatteryText, connectBatteryText, capacitorLabModel.batteryConnectedProperty );
    var connectBatteryButton = new RectangularPushButton({
      content: batteryToggleNode,
      baseColor: "white",
      x: 35,
      y: circuitNode.top + 95,
      listener: function () {
        capacitorLabModel.batteryConnectedProperty.value = !capacitorLabModel.batteryConnectedProperty.value;
        }
      });
    this.addChild( connectBatteryButton );
    
    // add the capacitance meter
    var capacitanceMeter = new BarMeterNode(capacitorLabModel,
                                    capMeterTitle,
                                    capacitorLabModel.capacitanceMeterProperty,
                                    capacitorLabModel.capacitanceProperty,
                                    capacitorLabModel.capacitanceMeterPositionProperty,
                                    {x: 335, y: 30});
    this.addChild( capacitanceMeter );
    
    // add the plate charge meter
    var plateChargeMeter = new BarMeterNode(capacitorLabModel,
                                    chargeMeterTitle,
                                    capacitorLabModel.plateChargeMeterProperty,
                                    capacitorLabModel.upperPlateChargeProperty,
                                    capacitorLabModel.plateChargeMeterPositionProperty,
                                    {x: 435, y: 30});
    this.addChild( plateChargeMeter );
    
    // add the energy meter
    var energyMeter = new BarMeterNode(capacitorLabModel,
                                    energyMeterTitle,
                                    capacitorLabModel.energyMeterProperty,
                                    capacitorLabModel.energyProperty,
                                    capacitorLabModel.energyMeterPositionProperty,
                                    {x: 535, y: 30});
    this.addChild( energyMeter );
    
    // add the voltmeter
    var voltMeter = new VoltmeterNode(capacitorLabModel, circuitNode,
                                      //circuitNode.wireNode,
                                      //circuitNode.capacitor,
                                      {x: 500, y: 250});
    this.addChild( voltMeter );
    
    // add the electric field meter
    var eFieldMeter = new EFieldMeterNode(capacitorLabModel,
                                          circuitNode.capacitor,
                                          {x: 450, y: 350});
    this.addChild( eFieldMeter );
    
    // Add the control panel that will allow users to control the visibility
    // of the plate charges and electric field lines
    var viewVisibilityCheckBoxGroup = new VerticalCheckBoxGroup( [
      { content: new Text( plateChargeString, labelOptionFont ), property: capacitorLabModel.plateChargeVisibleProperty, label: plateChargeString },
      { content: new Text( eFieldLinesString, labelOptionFont ), property: capacitorLabModel.eFieldVisibleProperty, label: eFieldLinesString }
    ], { boxWidth: 15, spacing: 5 } );
    var titleToControlsVerticalSpace = 7;
    var viewVisibilityControlsVBox = new VBox( {
      children: [
        new Text( viewTitleString, titleFont ),
        new VStrut( titleToControlsVerticalSpace ),
        new HBox( { children: [ new HStrut( 10 ), viewVisibilityCheckBoxGroup, new HStrut( 15 ) ] } )
      ],
      align: 'left'
    } );
    var viewVisibilityControlPanel = new Panel( viewVisibilityControlsVBox,
    {
      xMargin: 5,
      fill: 'rgb( 240, 240, 240 )',
      top: 5,
      right: this.layoutBounds.width - 10,
    } );
    this.addChild( viewVisibilityControlPanel );
    
    // Add the control panel that will allow users to control the visibility
    // of the various meters
    var meterVisibilityCheckBoxGroup = new VerticalCheckBoxGroup( [
      { content: new Text( capMeterString, labelOptionFont ), property: capacitorLabModel.capacitanceMeterProperty, label: capMeterString },
      { content: new Text( chargeMeterString, labelOptionFont ), property: capacitorLabModel.plateChargeMeterProperty, label: chargeMeterString },
      { content: new Text( eMeterString, labelOptionFont ), property: capacitorLabModel.energyMeterProperty, label: eMeterString },
      { content: new Text( voltMeterString, labelOptionFont ), property: capacitorLabModel.voltMeterProperty, label: voltMeterString },
      { content: new Text( eFieldMeterString, labelOptionFont ), property: capacitorLabModel.eFieldMeterProperty, label: eFieldMeterString }
    ], { boxWidth: 15, spacing: 5 } );
    var meterVisibilityControlsVBox = new VBox( {
      children: [
        new Text( metersTitleString, titleFont ),
        new VStrut( titleToControlsVerticalSpace ),
        new HBox( { children: [ new HStrut( 10 ), meterVisibilityCheckBoxGroup ] } )
      ],
      align: 'left'
    } );
    var meterVisibilityControlPanel = new Panel( meterVisibilityControlsVBox,
    {
      xMargin: 5,
      fill: 'rgb( 240, 240, 240 )',
      top: 5 + viewVisibilityControlPanel.bottom,
      right: this.layoutBounds.width - 10
    } );
    this.addChild( meterVisibilityControlPanel );
  }

  return inherit( ScreenView, CapacitorLabScreenView, {

    // Called by the animation loop. Optional, so if your view has no animation, you can omit this.
    step: function( dt ) {
      // Handle view animation here.
    }
  } );
} );