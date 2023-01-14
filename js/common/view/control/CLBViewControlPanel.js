// Copyright 2015-2023, University of Colorado Boulder

/**
 * Control panel for view elements in Capacitor Lab: Basics.  Controls the visibility of plate charges, current
 * indicators, electric field and values.  This set of controls is used in both the 'light-bulb' and 'capacitance'
 * screens.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import Vector2 from '../../../../../dot/js/Vector2.js';
import merge from '../../../../../phet-core/js/merge.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import { AlignBox, Node, Text } from '../../../../../scenery/js/imports.js';
import Panel from '../../../../../sun/js/Panel.js';
import VerticalAquaRadioButtonGroup from '../../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import VerticalCheckboxGroup from '../../../../../sun/js/VerticalCheckboxGroup.js';
import capacitorLabBasics from '../../../capacitorLabBasics.js';
import CapacitorLabBasicsStrings from '../../../CapacitorLabBasicsStrings.js';
import CLBConstants from '../../CLBConstants.js';

// constants
const CHECKBOX_FONT = new PhetFont( 16 );

const barGraphsString = CapacitorLabBasicsStrings.barGraphs;
const conventionalString = CapacitorLabBasicsStrings.conventional;
const currentDirectionString = CapacitorLabBasicsStrings.currentDirection;
const electricFieldString = CapacitorLabBasicsStrings.electricField;
const electronsString = CapacitorLabBasicsStrings.electrons;
const plateChargesString = CapacitorLabBasicsStrings.plateCharges;

class CLBViewControlPanel extends Panel {

  /**
   * @param {CLBModel} model
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( model, tandem, options ) {

    options = merge( {
      maxTextWidth: 250,
      alignGroup: null
    }, options );

    const checkboxItems = [ {
      string: plateChargesString,
      property: model.plateChargesVisibleProperty,
      tandemName: 'plateChargesCheckbox'
    }, {
      string: barGraphsString,
      property: model.barGraphsVisibleProperty,
      tandemName: 'barGraphsCheckbox'
    }, {
      string: electricFieldString,
      property: model.electricFieldVisibleProperty,
      tandemName: 'electricFieldCheckbox'
    }, {
      string: currentDirectionString,
      property: model.currentVisibleProperty,
      tandemName: 'currentCheckbox'
    } ];

    const viewCheckboxItems = checkboxItems.map( item => ( {
      createNode: () => new Text( item.string, {
        font: CHECKBOX_FONT,
        maxWidth: options.maxTextWidth
      } ),
      property: item.property,
      label: item.string,
      tandemName: item.tandemName
    } ) );

    const currentTypeRadioButtonGroup = new VerticalAquaRadioButtonGroup( model.currentOrientationProperty, [
      {
        createNode: () => new Text( electronsString, {
          font: CHECKBOX_FONT,
          maxWidth: options.maxTextWidth
        } ),
        value: 0,
        tandemName: 'electronsRadioButton'
      },
      {
        createNode: () => new Text( conventionalString, {
          font: CHECKBOX_FONT,
          maxWidth: options.maxTextWidth
        } ),
        value: Math.PI,
        tandemName: 'conventionalRadioButton'
      }
    ], {
      radioButtonOptions: {
        enabled: model.currentVisibleProperty.value
      },
      spacing: 5,
      touchAreaXDilation: 5,
      tandem: tandem.createTandem( 'currentTypeRadioButtonGroup' )
    } );

    // Disable the current direction radio buttons when the current visibility is disabled.
    model.currentVisibleProperty.linkAttribute( currentTypeRadioButtonGroup.children[ 0 ], 'enabled' );
    model.currentVisibleProperty.linkAttribute( currentTypeRadioButtonGroup.children[ 1 ], 'enabled' );

    const checkboxGroup = new VerticalCheckboxGroup( viewCheckboxItems, {
      checkboxOptions: {
        // The box is as wide as the largest item is tall
        boxWidth: new Text( electronsString, {
          font: CHECKBOX_FONT,
          maxWidth: options.maxTextWidth
        } ).height
      },
      tandem: tandem.createTandem( 'checkboxGroup' )
    } );

    const optionsNode = new Node( { children: [ checkboxGroup, currentTypeRadioButtonGroup ] } );

    currentTypeRadioButtonGroup.leftTop = new Vector2( checkboxGroup.left + 25, checkboxGroup.bottom + 10 );

    // {Node|AlignBox}
    const content = options.alignGroup ? new AlignBox( optionsNode, {
      group: options.alignGroup,
      xAlign: 'left'
    } ) : optionsNode;

    super( content, {
      xMargin: 10,
      yMargin: 10,
      align: 'left',
      minWidth: 175,
      fill: CLBConstants.METER_PANEL_FILL,
      tandem: tandem
    } );
  }
}

capacitorLabBasics.register( 'CLBViewControlPanel', CLBViewControlPanel );
export default CLBViewControlPanel;