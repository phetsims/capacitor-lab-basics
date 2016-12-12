// Copyright 2015, University of Colorado Boulder

/**
 * Panel which holds the bar meters and associated check boxes which control bar meter visibility.
 *
 * This panel uses several layout boxes to achieve the desired alignment.  The meter value nodes are aligned to the
 * right while the bar meters are aligned to the left.  The checkboxes are also aligned to the left.
 *
 * @author Jesse Greenberg
 * @author Andrew Adare
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
  var PlateChargeBarMeterNode = require( 'CAPACITOR_LAB_BASICS/common/view/meters/PlateChargeBarMeterNode' );
  var Vector2 = require( 'DOT/Vector2' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  // phet-io modules
  var TPanel = require( 'ifphetio!PHET_IO/types/sun/TPanel' );

  // constants
  var CHECKBOX_VERTICAL_SPACING = 28;
  var VALUE_FONT = new PhetFont( 16 );
  var VALUE_COLOR = 'black';

  // strings
  var capacitanceString = require( 'string!CAPACITOR_LAB_BASICS/capacitance' );
  var plateChargeString = require( 'string!CAPACITOR_LAB_BASICS/plateCharge' );
  var storedEnergyString = require( 'string!CAPACITOR_LAB_BASICS/storedEnergy' );
  var unitsPicoCoulombsString = require( 'string!CAPACITOR_LAB_BASICS/units.picoCoulombs' );
  var unitsPicoFaradsString = require( 'string!CAPACITOR_LAB_BASICS/units.picoFarads' );
  var unitsPicoJoulesString = require( 'string!CAPACITOR_LAB_BASICS/units.picoJoules' );

  /**
   * @param {BarMeter[]} model
   * @param {Property.<boolean>} minWidth - minimum width of the whole panel
   * @param {Tandem} tandem
   * @constructor
   */
  function BarMeterPanel( model, minWidth, tandem ) {

    var self = this;

    var parentNode = new Node(); // node that will contain all check boxes and bar meter nodes

    // create the bar meter nodes with their text values.
    var meterNodes = new Node();

    var capacitanceMeterNode = new BarMeterNode(
      model.capacitanceMeter,
      CLBConstants.CAPACITANCE_COLOR,
      CLBConstants.CAPACITANCE_METER_MAX_VALUE,
      unitsPicoFaradsString,
      capacitanceString,
      tandem.createTandem( 'capacitanceMeterNode' ) );

    var plateChargeMeterNode = new PlateChargeBarMeterNode(
      model.plateChargeMeter,
      CLBConstants.POSITIVE_CHARGE_COLOR,
      CLBConstants.PLATE_CHARGE_METER_MAX_VALUE,
      unitsPicoCoulombsString,
      plateChargeString,
      tandem.createTandem( 'plateChargeMeterNode' ) );

    var storedEnergyMeterNode = new BarMeterNode(
      model.storedEnergyMeter,
      CLBConstants.STORED_ENERGY_COLOR,
      CLBConstants.STORED_ENERGY_METER_MAX_VALUE,
      unitsPicoJoulesString,
      storedEnergyString,
      tandem.createTandem( 'storedEnergyMeterNode' ) );

    meterNodes.children = [ capacitanceMeterNode, plateChargeMeterNode, storedEnergyMeterNode ];

    // create checkboxes for each meter node
    var checkBoxNodes = new Node();

    // Settings for title strings
    var fontOptions = {
      font: VALUE_FONT,
      fill: VALUE_COLOR,
      maxWidth: 120
    };

    var capacitanceTitle = new Text( capacitanceString, fontOptions );
    var capacitanceCheckBox = new CheckBox( capacitanceTitle, model.capacitanceMeterVisibleProperty, {
      tandem: tandem.createTandem( 'capacitanceMeterCheckBox' )
    } );

    var plateChargeTitle = new Text( plateChargeString, fontOptions );
    var plateChargeCheckBox = new CheckBox( plateChargeTitle, model.plateChargeMeterVisibleProperty, {
      tandem: tandem.createTandem( 'plateChargeMeterCheckBox' )
    } );

    var storedEnergyTitle = new Text( storedEnergyString, fontOptions );
    var storedEnergyCheckBox = new CheckBox( storedEnergyTitle, model.storedEnergyMeterVisibleProperty, {
      tandem: tandem.createTandem( 'storedEnergyMeterCheckBox' )
    } );

    checkBoxNodes.children = [ capacitanceCheckBox, plateChargeCheckBox, storedEnergyCheckBox ];

    parentNode.children = [ checkBoxNodes, meterNodes ];

    // layout
    var x = 0;
    var y = 0;

    // check boxes aligned vertically, centered left
    capacitanceCheckBox.translation = new Vector2( 0, 0 );
    plateChargeCheckBox.translation = new Vector2( 0, CHECKBOX_VERTICAL_SPACING );
    storedEnergyCheckBox.translation = new Vector2( 0, 2 * CHECKBOX_VERTICAL_SPACING );

    // The BarMeterNodes have a common x-coordinate
    x = 0.44*minWidth;

    y = capacitanceCheckBox.centerY + 2;
    capacitanceMeterNode.axisLine.translation = new Vector2( x, y );

    y = plateChargeCheckBox.centerY + 2;
    plateChargeMeterNode.axisLine.translation = new Vector2( x, y );

    y = storedEnergyCheckBox.centerY + 2;
    storedEnergyMeterNode.axisLine.translation = new Vector2( x, y );

    Panel.call( this, parentNode, {
      fill: CLBConstants.METER_PANEL_FILL,
      minWidth: minWidth,
      align: 'left',
      xMargin: 10,
      yMargin: 10,
      resize: false
    } );

    // link visibility to the model property
    model.barGraphsVisibleProperty.link( function( barGraphsPanelVisible ) {
      self.visible = barGraphsPanelVisible;
    } );

    tandem.addInstance( this, TPanel );
  }

  capacitorLabBasics.register( 'BarMeterPanel', BarMeterPanel );

  return inherit( Panel, BarMeterPanel );

} );
