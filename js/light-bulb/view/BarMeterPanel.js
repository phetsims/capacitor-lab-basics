// Copyright 2002-2015, University of Colorado Boulder

/**
 * Panel which holds the bar meters and associated check boxes which control bar meter visibility.
 *
 * This panel uses several layout boxes to achieve the desired alignment.  The meter value nodes are aligned to the
 * right while the bar meters are aligned to the left.  The checkboxes are also aligned to the left.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var CLConstants = require( 'CAPACITOR_LAB_BASICS/common/CLConstants' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  var Panel = require( 'SUN/Panel' );
  var CheckBox = require( 'SUN/CheckBox' );
  var BarMeterNode = require( 'CAPACITOR_LAB_BASICS/common/view/meters/BarMeterNode' );

  // constants
  var CHECKBOX_METER_SPACING = 20;
  var CHECKBOX_VERTICAL_SPACING = 13;
  var VALUE_FONT = new PhetFont( 12 );
  var VALUE_COLOR = 'black';

  // strings
  var capacitanceString = require( 'string!CAPACITOR_LAB_BASICS/capacitance' );
  var storedEnergyString = require( 'string!CAPACITOR_LAB_BASICS/storedEnergy' );
  var plateChargeString = require( 'string!CAPACITOR_LAB_BASICS/plateCharge' );

  /**
   * Constructor.
   *
   * @param {array.<BarMeter>} model
   * @param {Property.<boolean>} minWidth
   * @constructor
   */
  function BarMeterPanel( model, minWidth ) {

    var thisPanel = this;

    // create the bar meter nodes with their text values.
    var meterNodes = new Node();
    var capacitanceMeterNode = BarMeterNode.CapacitanceBarMeterNode( model.capacitanceMeter );
    var plateChargeMeterNode = BarMeterNode.PlateChargeBarMeterNode( model.plateChargeMeter );
    var storedEnergyMeterNode = BarMeterNode.StoredEnergyBarMeterNode( model.storedEnergyMeter );
    meterNodes.children = [ capacitanceMeterNode, plateChargeMeterNode, storedEnergyMeterNode ];

    // create checkboxes for each meter node
    var fontOptions = { font: VALUE_FONT, fill: VALUE_COLOR };

    var capacitanceTitle = new Text( capacitanceString, fontOptions );
    var capacitanceCheckBox = new CheckBox( capacitanceTitle, model.capacitanceMeterVisibleProperty );

    var plateChargeTitle = new Text( plateChargeString, fontOptions );
    var plateChargeCheckBox = new CheckBox( plateChargeTitle, model.plateChargeMeterVisibleProperty );

    var storedEnergyTitle = new Text( storedEnergyString, fontOptions );
    var storedEnergyCheckBox = new CheckBox( storedEnergyTitle, model.storedEnergyMeterVisibleProperty );

    // checkboxes go in a layout box aligned to the left
    var checkBoxLayoutBox = new LayoutBox( {
      children: [ capacitanceCheckBox, plateChargeCheckBox, storedEnergyCheckBox ],
      align: 'left',
      orientation: 'vertical',
      spacing: CHECKBOX_VERTICAL_SPACING
    } );

    // plate meter nodes and check boxes in a horizontal layout box.
    var checkBoxMeterLayoutBox = new LayoutBox( {
      children: [ checkBoxLayoutBox, meterNodes ],
      orientation: 'horizontal',
      spacing: CHECKBOX_METER_SPACING
    } );

    capacitanceMeterNode.centerY = -( capacitanceCheckBox.height + CHECKBOX_VERTICAL_SPACING );
    storedEnergyMeterNode.centerY = ( capacitanceCheckBox.height + CHECKBOX_VERTICAL_SPACING );

    Panel.call( this, checkBoxMeterLayoutBox, {
      fill: CLConstants.METER_PANEL_FILL,
      minWidth: minWidth,
      align: 'left'
    } );

    // link visibility to the model property
    model.barGraphsPanelVisibleProperty.link( function( barGraphsPanelVisible ) {
      thisPanel.visible = barGraphsPanelVisible;
    } );

  }

  return inherit( Panel, BarMeterPanel );

} );