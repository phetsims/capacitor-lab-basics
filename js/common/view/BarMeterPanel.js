// Copyright 2015-2022, University of Colorado Boulder

/**
 * Panel which holds the bar meters and associated checkboxes which control bar meter visibility.
 *
 * This panel uses several layout boxes to achieve the desired alignment.  The meter value nodes are aligned to the
 * right while the bar meters are aligned to the left.  The checkboxes are also aligned to the left.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, Text } from '../../../../scenery/js/imports.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Panel from '../../../../sun/js/Panel.js';
import capacitorLabBasics from '../../capacitorLabBasics.js';
import CapacitorLabBasicsStrings from '../../CapacitorLabBasicsStrings.js';
import CLBConstants from '../CLBConstants.js';
import BarMeterNode from './meters/BarMeterNode.js';
import PlateChargeBarMeterNode from './meters/PlateChargeBarMeterNode.js';

// constants
const CHECKBOX_VERTICAL_SPACING = 28;
const VALUE_FONT = new PhetFont( 16 );
const VALUE_COLOR = 'black';

const capacitanceString = CapacitorLabBasicsStrings.capacitance;
const picoCoulombsPatternString = CapacitorLabBasicsStrings.picoCoulombsPattern;
const picoFaradsPatternString = CapacitorLabBasicsStrings.picoFaradsPattern;
const picoJoulesPatternString = CapacitorLabBasicsStrings.picoJoulesPattern;
const storedEnergyString = CapacitorLabBasicsStrings.storedEnergy;
const topPlateChargeString = CapacitorLabBasicsStrings.topPlateCharge;

class BarMeterPanel extends Panel {

  /**
   * @param {CLBLightBulbModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {

    const minWidth = 580;

    const parentNode = new Node(); // node that will contain all checkboxes and bar meter nodes

    // create the bar meter nodes with their text values.
    const meterNodes = new Node();

    const capacitanceMeterNode = new BarMeterNode(
      model.capacitanceMeter,
      CLBConstants.CAPACITANCE_COLOR,
      CLBConstants.CAPACITANCE_METER_MAX_VALUE,
      picoFaradsPatternString,
      capacitanceString,
      tandem.createTandem( 'capacitanceMeterNode' ) );

    const plateChargeMeterNode = new PlateChargeBarMeterNode(
      model.plateChargeMeter,
      CLBConstants.POSITIVE_CHARGE_COLOR,
      CLBConstants.PLATE_CHARGE_METER_MAX_VALUE,
      picoCoulombsPatternString,
      topPlateChargeString,
      tandem.createTandem( 'plateChargeMeterNode' ) );

    const storedEnergyMeterNode = new BarMeterNode(
      model.storedEnergyMeter,
      CLBConstants.STORED_ENERGY_COLOR,
      CLBConstants.STORED_ENERGY_METER_MAX_VALUE,
      picoJoulesPatternString,
      storedEnergyString,
      tandem.createTandem( 'storedEnergyMeterNode' ) );

    meterNodes.children = [ capacitanceMeterNode, plateChargeMeterNode, storedEnergyMeterNode ];

    // create checkboxes for each meter node
    const checkboxNodes = new Node();

    // Settings for title strings
    const fontOptions = {
      font: VALUE_FONT,
      fill: VALUE_COLOR,
      maxWidth: 120
    };

    const capacitanceLabel = new Text( capacitanceString, fontOptions );
    const capacitanceCheckbox = new Checkbox( model.capacitanceMeterVisibleProperty, capacitanceLabel, {
      tandem: tandem.createTandem( 'capacitanceCheckbox' )
    } );

    const topPlateChargeLabel = new Text( topPlateChargeString, fontOptions );
    const topPlateChargeCheckbox = new Checkbox( model.topPlateChargeMeterVisibleProperty, topPlateChargeLabel, {
      tandem: tandem.createTandem( 'topPlateChargeCheckbox' )
    } );

    const storedEnergyLabel = new Text( storedEnergyString, fontOptions );
    const storedEnergyCheckbox = new Checkbox( model.storedEnergyMeterVisibleProperty, storedEnergyLabel, {
      tandem: tandem.createTandem( 'storedEnergyCheckbox' )
    } );

    checkboxNodes.children = [ capacitanceCheckbox, topPlateChargeCheckbox, storedEnergyCheckbox ];

    parentNode.children = [ checkboxNodes, meterNodes ];

    // layout
    // checkboxes aligned vertically, centered left
    capacitanceCheckbox.translation = new Vector2( 0, 0 );
    topPlateChargeCheckbox.translation = new Vector2( 0, CHECKBOX_VERTICAL_SPACING );
    storedEnergyCheckbox.translation = new Vector2( 0, 2 * CHECKBOX_VERTICAL_SPACING );

    // The BarMeterNodes have a common x-coordinate
    const x = 0.44 * minWidth;

    let y = capacitanceCheckbox.centerY;
    capacitanceMeterNode.axisLine.translation = new Vector2( x, y );

    y = topPlateChargeCheckbox.centerY;
    plateChargeMeterNode.axisLine.translation = new Vector2( x, y );

    y = storedEnergyCheckbox.centerY;
    storedEnergyMeterNode.axisLine.translation = new Vector2( x, y );

    super( parentNode, {
      fill: CLBConstants.METER_PANEL_FILL,
      minWidth: minWidth,
      align: 'left',
      xMargin: 10,
      yMargin: 10,
      resize: false,
      tandem: tandem
    } );

    // link visibility to the model property
    model.barGraphsVisibleProperty.link( barGraphsPanelVisible => {
      this.visible = barGraphsPanelVisible;
    } );
  }
}

capacitorLabBasics.register( 'BarMeterPanel', BarMeterPanel );
export default BarMeterPanel;