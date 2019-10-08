// Copyright 2015-2019, University of Colorado Boulder

/**
 * Control panel for view elements in Capacitor Lab: Basics.  Controls the visibility of plate charges, current
 * indicators, electric field and values.  This set of controls is used in both the 'light-bulb' and 'capacitance'
 * screens.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  const CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Panel = require( 'SUN/Panel' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Vector2 = require( 'DOT/Vector2' );
  const VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );
  const VerticalCheckboxGroup = require( 'SUN/VerticalCheckboxGroup' );

  // constants
  const CHECKBOX_FONT = new PhetFont( 16 );

  // strings
  const barGraphsString = require( 'string!CAPACITOR_LAB_BASICS/barGraphs' );
  const conventionalString = require( 'string!CAPACITOR_LAB_BASICS/conventional' );
  const currentDirectionString = require( 'string!CAPACITOR_LAB_BASICS/currentDirection' );
  const electricFieldString = require( 'string!CAPACITOR_LAB_BASICS/electricField' );
  const electronsString = require( 'string!CAPACITOR_LAB_BASICS/electrons' );
  const plateChargesString = require( 'string!CAPACITOR_LAB_BASICS/plateCharges' );

  /**
   * @constructor
   *
   * @param {CLBModel} model
   * @param {Tandem} tandem
   * @param {Object} options
   */
  function CLBViewControlPanel( model, tandem, options ) {

    options = _.extend( {
      maxTextWidth: 250,
      alignGroup:null
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
      align:'left',
      minWidth:175,
      fill: CLBConstants.METER_PANEL_FILL,
      tandem: tandem
    } );
  }

  capacitorLabBasics.register( 'CLBViewControlPanel', CLBViewControlPanel );

  return inherit( Panel, CLBViewControlPanel );
} );
