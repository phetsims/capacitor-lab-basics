//  Copyright 2002-2014, University of Colorado Boulder

/**
 *
 * @author Emily Randall
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var BatteryNode = require( 'CAPACITOR_LAB/capacitor-lab/view/BatteryNode' );
  var CapacitorNode = require( 'CAPACITOR_LAB/capacitor-lab/view/CapacitorNode' );
  var CircuitNode = require( 'CAPACITOR_LAB/capacitor-lab/view/CircuitNode' );
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
  var VStrut = require( 'SUN/VStrut' );
  var WireNode = require( 'CAPACITOR_LAB/capacitor-lab/view/WireNode' );
  
  var BarMeterNode = require( 'CAPACITOR_LAB/capacitor-lab/view/meters/BarMeterNode' );

  /**
   * @param {CapacitorLabModel} capacitorLabModel
   * @constructor
   */
  function CapacitorLabScreenView( capacitorLabModel ) {

    ScreenView.call( this );
    
    // Strings
    var connectBatteryString = "Connect Battery";
    var disconnectBatteryString = "Disconnect Battery";
    var viewTitleString = "View";
    var plateChargeString = "Plate Charges";
    var eFieldLinesString = "Electric Field Lines";
    var metersTitleString = "Meters";
    var capMeterString = "Capacitance";
    var chargeMeterString = "Plate Charge";
    var eMeterString = "Stored Energy";
    var voltMeterString = "Voltmeter";
    var eFieldMeterString = "Electric Field Detector";
    
    var labelOptionFont = {font: new PhetFont( 12 )};
    var titleFont = new PhetFont( 14 );
    
    var barmeter = new BarMeterNode(10, "<b>Capacitance</b>", ".89x10<sup>-13</sup> F", {x: 400, y : 30});
    this.addChild(barmeter);

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
      x: 0,
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
      x: 0,
      y: circuitNode.top + 80,
      listener: function () {
        capacitorLabModel.batteryConnectedProperty.value = !capacitorLabModel.batteryConnectedProperty.value;
        }
      });
    this.addChild(connectBatteryButton);
    
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