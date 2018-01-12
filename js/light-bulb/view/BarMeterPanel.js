// Copyright 2015-2017, University of Colorado Boulder

/**
 * Panel which holds the bar meters and associated check boxes which control bar meter visibility.
 *
 * This panel uses several layout boxes to achieve the desired alignment.  The meter value nodes are aligned to the
 * right while the bar meters are aligned to the left.  The checkboxes are also aligned to the left.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var BarMeterNode = require( 'CAPACITOR_LAB_BASICS/common/view/meters/BarMeterNode' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var Checkbox = require( 'SUN/Checkbox' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PlateChargeBarMeterNode = require( 'CAPACITOR_LAB_BASICS/common/view/meters/PlateChargeBarMeterNode' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var CHECKBOX_VERTICAL_SPACING = 28;
  var VALUE_FONT = new PhetFont( 16 );
  var VALUE_COLOR = 'black';

  // strings
  var capacitanceString = require( 'string!CAPACITOR_LAB_BASICS/capacitance' );
  var picoCoulombsPatternString = require( 'string!CAPACITOR_LAB_BASICS/picoCoulombsPattern' );
  var picoFaradsPatternString = require( 'string!CAPACITOR_LAB_BASICS/picoFaradsPattern' );
  var picoJoulesPatternString = require( 'string!CAPACITOR_LAB_BASICS/picoJoulesPattern' );
  var storedEnergyString = require( 'string!CAPACITOR_LAB_BASICS/storedEnergy' );
  var topPlateChargeString = require( 'string!CAPACITOR_LAB_BASICS/topPlateCharge' );

  /**
   * @constructor
   *
   * @param {CLBLightBulbModel} model
   * @param {number} minWidth - minimum width of the whole panel
   * @param {Tandem} tandem
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
      picoFaradsPatternString,
      capacitanceString,
      tandem.createTandem( 'capacitanceMeterNode' ) );

    var plateChargeMeterNode = new PlateChargeBarMeterNode(
      model.plateChargeMeter,
      CLBConstants.POSITIVE_CHARGE_COLOR,
      CLBConstants.PLATE_CHARGE_METER_MAX_VALUE,
      picoCoulombsPatternString,
      topPlateChargeString,
      tandem.createTandem( 'plateChargeMeterNode' ) );

    var storedEnergyMeterNode = new BarMeterNode(
      model.storedEnergyMeter,
      CLBConstants.STORED_ENERGY_COLOR,
      CLBConstants.STORED_ENERGY_METER_MAX_VALUE,
      picoJoulesPatternString,
      storedEnergyString,
      tandem.createTandem( 'storedEnergyMeterNode' ) );

    meterNodes.children = [ capacitanceMeterNode, plateChargeMeterNode, storedEnergyMeterNode ];

    // create checkboxes for each meter node
    var checkboxNodes = new Node();

    // Settings for title strings
    var fontOptions = {
      font: VALUE_FONT,
      fill: VALUE_COLOR,
      maxWidth: 120
    };

    var capacitanceLabel = new Text( capacitanceString, fontOptions );
    var capacitanceCheckbox = new Checkbox( capacitanceLabel, model.capacitanceMeterVisibleProperty, {
      tandem: tandem.createTandem( 'capacitanceCheckbox' )
    } );

    var topPlateChargeLabel = new Text( topPlateChargeString, fontOptions );
    var topPlateChargeCheckbox = new Checkbox( topPlateChargeLabel, model.topPlateChargeMeterVisibleProperty, {
      tandem: tandem.createTandem( 'topPlateChargeCheckbox' )
    } );

    var storedEnergyLabel = new Text( storedEnergyString, fontOptions );
    var storedEnergyCheckbox = new Checkbox( storedEnergyLabel, model.storedEnergyMeterVisibleProperty, {
      tandem: tandem.createTandem( 'storedEnergyCheckbox' )
    } );

    checkboxNodes.children = [ capacitanceCheckbox, topPlateChargeCheckbox, storedEnergyCheckbox ];

    parentNode.children = [ checkboxNodes, meterNodes ];

    // layout
    // check boxes aligned vertically, centered left
    capacitanceCheckbox.translation = new Vector2( 0, 0 );
    topPlateChargeCheckbox.translation = new Vector2( 0, CHECKBOX_VERTICAL_SPACING );
    storedEnergyCheckbox.translation = new Vector2( 0, 2 * CHECKBOX_VERTICAL_SPACING );

    // The BarMeterNodes have a common x-coordinate
    var x = 0.44 * minWidth;

    var y = capacitanceCheckbox.centerY;
    capacitanceMeterNode.axisLine.translation = new Vector2( x, y );

    y = topPlateChargeCheckbox.centerY;
    plateChargeMeterNode.axisLine.translation = new Vector2( x, y );

    y = storedEnergyCheckbox.centerY;
    storedEnergyMeterNode.axisLine.translation = new Vector2( x, y );

    Panel.call( this, parentNode, {
      fill: CLBConstants.METER_PANEL_FILL,
      minWidth: minWidth,
      align: 'left',
      xMargin: 10,
      yMargin: 10,
      resize: false,
      tandem: tandem
    } );

    // link visibility to the model property
    model.barGraphsVisibleProperty.link( function( barGraphsPanelVisible ) {
      self.visible = barGraphsPanelVisible;
    } );
  }

  capacitorLabBasics.register( 'BarMeterPanel', BarMeterPanel );

  return inherit( Panel, BarMeterPanel );
} );