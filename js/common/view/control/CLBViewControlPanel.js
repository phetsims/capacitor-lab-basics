// Copyright 2015-2020, University of Colorado Boulder

/**
 * Control panel for view elements in Capacitor Lab: Basics.  Controls the visibility of plate charges, current
 * indicators, electric field and values.  This set of controls is used in both the 'light-bulb' and 'capacitance'
 * screens.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import Vector2 from '../../../../../dot/js/Vector2.js';
import inherit from '../../../../../phet-core/js/inherit.js';
import merge from '../../../../../phet-core/js/merge.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import AlignBox from '../../../../../scenery/js/nodes/AlignBox.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import Panel from '../../../../../sun/js/Panel.js';
import VerticalAquaRadioButtonGroup from '../../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import VerticalCheckboxGroup from '../../../../../sun/js/VerticalCheckboxGroup.js';
import capacitorLabBasicsStrings from '../../../capacitorLabBasicsStrings.js';
import capacitorLabBasics from '../../../capacitorLabBasics.js';
import CLBConstants from '../../CLBConstants.js';

// constants
const CHECKBOX_FONT = new PhetFont( 16 );

const barGraphsString = capacitorLabBasicsStrings.barGraphs;
const conventionalString = capacitorLabBasicsStrings.conventional;
const currentDirectionString = capacitorLabBasicsStrings.currentDirection;
const electricFieldString = capacitorLabBasicsStrings.electricField;
const electronsString = capacitorLabBasicsStrings.electrons;
const plateChargesString = capacitorLabBasicsStrings.plateCharges;

/**
 * @constructor
 *
 * @param {CLBModel} model
 * @param {Tandem} tandem
 * @param {Object} [options]
 */
function CLBViewControlPanel( model, tandem, options ) {

  options = merge( {
    maxTextWidth: 250,
    alignGroup: null
  }, options );

  const checkboxItems = [ {
    string: plateChargesString,
    property: model.plateChargesVisibleProperty,
    tandem: tandem.createTandem( 'plateChargesCheckbox' )
  }, {
    string: barGraphsString,
    property: model.barGraphsVisibleProperty,
    tandem: tandem.createTandem( 'barGraphsCheckbox' )
  }, {
    string: electricFieldString,
    property: model.electricFieldVisibleProperty,
    tandem: tandem.createTandem( 'electricFieldCheckbox' )
  }, {
    string: currentDirectionString,
    property: model.currentVisibleProperty,
    tandem: tandem.createTandem( 'currentCheckbox' )
  } ];

  const viewCheckboxItems = checkboxItems.map( function( item ) {
    return {
      node: new Text( item.string, {
        font: CHECKBOX_FONT,
        maxWidth: options.maxTextWidth
      } ),
      property: item.property,
      label: item.string,
      tandem: item.tandem
    };
  } );

  const currentTypeRadioButtonGroup = new VerticalAquaRadioButtonGroup( model.currentOrientationProperty, [
    {
      node: new Text( electronsString, {
        font: CHECKBOX_FONT,
        maxWidth: options.maxTextWidth
      } ),
      value: 0,
      tandemName: 'electronsRadioButton'
    },
    {
      node: new Text( conventionalString, {
        font: CHECKBOX_FONT,
        maxWidth: options.maxTextWidth
      } ),
      value: Math.PI,
      tandemName: 'conventionalRadioButton'
    }
  ], {
    spacing: 5,
    touchAreaXDilation: 5,
    tandem: tandem.createTandem( 'currentTypeRadioButtonGroup' )
  } );

  const verticalCheckboxGroup = new VerticalCheckboxGroup( viewCheckboxItems, {
    checkboxOptions: {
      // The box is as wide as the largest item is tall
      boxWidth: viewCheckboxItems[ 0 ].node.height
    }
  } );

  const optionsNode = new Node( { children: [ verticalCheckboxGroup, currentTypeRadioButtonGroup ] } );

  currentTypeRadioButtonGroup.leftTop = new Vector2( verticalCheckboxGroup.left + 25, verticalCheckboxGroup.bottom + 10 );

  // {Node|AlignBox}
  const content = options.alignGroup ? new AlignBox( optionsNode, {
    group: options.alignGroup,
    xAlign: 'center'
  } ) : optionsNode;

  Panel.call( this, content, {
    xMargin: 10,
    yMargin: 10,
    align: 'left',
    minWidth: 175,
    fill: CLBConstants.METER_PANEL_FILL,
    tandem: tandem
  } );
}

capacitorLabBasics.register( 'CLBViewControlPanel', CLBViewControlPanel );

inherit( Panel, CLBViewControlPanel );
export default CLBViewControlPanel;