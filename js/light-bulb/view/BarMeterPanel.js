// Copyright 2015, University of Colorado Boulder

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
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Panel = require( 'SUN/Panel' );
  var CheckBox = require( 'SUN/CheckBox' );
  var BarMeterNode = require( 'CAPACITOR_LAB_BASICS/common/view/meters/BarMeterNode' );
  var Vector2 = require( 'DOT/Vector2' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  // constants
  var CHECKBOX_VERTICAL_SPACING = 28;
  var VALUE_FONT = new PhetFont( 15 );
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

    var parentNode = new Node(); // node that will contain all check boxes and bar meter nodes

    // create the bar meter nodes with their text values.
    var meterNodes = new Node();
    var capacitanceMeterNode = BarMeterNode.CapacitanceBarMeterNode( model.capacitanceMeter );
    var plateChargeMeterNode = BarMeterNode.PlateChargeBarMeterNode( model.plateChargeMeter );
    var storedEnergyMeterNode = BarMeterNode.StoredEnergyBarMeterNode( model.storedEnergyMeter );
    meterNodes.children = [ capacitanceMeterNode, plateChargeMeterNode, storedEnergyMeterNode ];

    // create checkboxes for each meter node
    var checkBoxNodes = new Node();
    var fontOptions = { font: VALUE_FONT, fill: VALUE_COLOR };

    var capacitanceTitle = new Text( capacitanceString, fontOptions );
    var capacitanceCheckBox = new CheckBox( capacitanceTitle, model.capacitanceMeterVisibleProperty );

    var plateChargeTitle = new Text( plateChargeString, fontOptions );
    var plateChargeCheckBox = new CheckBox( plateChargeTitle, model.plateChargeMeterVisibleProperty );

    var storedEnergyTitle = new Text( storedEnergyString, fontOptions );
    var storedEnergyCheckBox = new CheckBox( storedEnergyTitle, model.storedEnergyMeterVisibleProperty );

    checkBoxNodes.children = [ capacitanceCheckBox, plateChargeCheckBox, storedEnergyCheckBox ];

    parentNode.children = [ checkBoxNodes, meterNodes ];

    // layout
    var x = 0;
    var y = 0;

    // check boxes aligned vertically, centered left
    capacitanceCheckBox.translation = new Vector2( 0, 0 );
    plateChargeCheckBox.translation = new Vector2( 0, CHECKBOX_VERTICAL_SPACING );
    storedEnergyCheckBox.translation = new Vector2( 0, 2 * CHECKBOX_VERTICAL_SPACING );

    x = capacitanceCheckBox.right + capacitanceMeterNode.valueNode.width + 40;
    y = capacitanceCheckBox.centerY + 2;
    capacitanceMeterNode.axisLine.translation = new Vector2( x, y );

    x = capacitanceMeterNode.axisLine.x;
    y = plateChargeCheckBox.centerY + 2;
    plateChargeMeterNode.axisLine.translation = new Vector2( x, y );

    y = storedEnergyCheckBox.centerY + 2;
    storedEnergyMeterNode.axisLine.translation = new Vector2( x, y );

    Panel.call( this, parentNode, {
      fill: CLBConstants.METER_PANEL_FILL,
      minWidth: minWidth,
      align: 'left',
      xMargin: 10,
      yMargin: 10
    } );

    // link visibility to the model property
    model.barGraphsPanelVisibleProperty.link( function( barGraphsPanelVisible ) {
      thisPanel.visible = barGraphsPanelVisible;
    } );

  }

  capacitorLabBasics.register( 'BarMeterPanel', BarMeterPanel );
  
  return inherit( Panel, BarMeterPanel );

} );