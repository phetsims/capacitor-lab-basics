// Copyright 2002-2015, University of Colorado Boulder

/**
 * Control panel for Capacitor Lab: Basics.  Controls visibility of nodes, meters, and physical values.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var VerticalCheckBoxGroup = require( 'SUN/VerticalCheckBoxGroup' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  var VStrut = require( 'SCENERY/nodes/VStrut' );

  // constants
  var PANEL_TITLE_FONT = new PhetFont( { weight: 'bold', size: 18 } );
  var CHECK_BOX_FONT = new PhetFont( 16 );
  var TITLE_VERTICAL_SPACE = 10;
  var PANEL_VERTICAL_SPACE = 30;

  // strings
  var plateChargesString = require( 'string!CAPACITOR_LAB_BASICS/plateCharges' );
  var eFieldLinesString = require( 'string!CAPACITOR_LAB_BASICS/eFieldLines' );
  var valuesString = require( 'string!CAPACITOR_LAB_BASICS/values' );
  var viewString = require( 'string!CAPACITOR_LAB_BASICS/view' );
  var capacitanceString = require( 'string!CAPACITOR_LAB_BASICS/capacitance' );
  var topPlateChargeString = require( 'string!CAPACITOR_LAB_BASICS/topPlateCharge' );
  var storedEnergyString = require( 'string!CAPACITOR_LAB_BASICS/storedEnergy' );
  var graphsString = require( 'string!CAPACITOR_LAB_BASICS/graphs' );

  /**
   * Constructor.
   *
   * @param {CapacitorLabModel} model
   * @param {number} minWidth - minimum width of the panels, calculated by layout in the screen view.
   * @constructor
   */
  function CapacitorLabBasicsVisibilityControlPanel( model, minWidth ) {

    var viewCheckBoxItems = [
      {
        content: new Text( plateChargesString, { font: CHECK_BOX_FONT } ),
        property: model.plateChargesVisibleProperty
      },
      {
        content: new Text( eFieldLinesString, { font: CHECK_BOX_FONT } ),
        property: model.eFieldVisibleProperty
      },
      {
        content: new Text( valuesString, { font: CHECK_BOX_FONT } ),
        property: model.valuesVisibleProperty
      }
    ];

    var graphsCheckBoxItems = [
      {
        content: new Text( capacitanceString, { font: CHECK_BOX_FONT } ),
        property: model.capacitanceMeterVisibleProperty
      },
      {
        content: new Text( topPlateChargeString, { font: CHECK_BOX_FONT } ),
        property: model.plateChargeMeterVisibleProperty
      },
      {
        content: new Text( storedEnergyString, { font: CHECK_BOX_FONT } ),
        property: model.storedEnergyMeterVisibleProperty
      }
    ];

    var viewVerticalCheckBoxGroup = new VerticalCheckBoxGroup( viewCheckBoxItems );
    var graphsVerticalCheckBoxGroup = new VerticalCheckBoxGroup( graphsCheckBoxItems );

    var viewVisibilityControlBox = createControlBox( viewString, viewVerticalCheckBoxGroup );
    var graphsVisibilityControlBox = createControlBox( graphsString, graphsVerticalCheckBoxGroup );

    var graphsVisibilityControlPanel = createControlPanel( graphsVisibilityControlBox, minWidth );
    var viewVisibilityControlPanel = createControlPanel( viewVisibilityControlBox, minWidth );

    LayoutBox.call( this, {
      children: [
        graphsVisibilityControlPanel,
        new VStrut( PANEL_VERTICAL_SPACE ),
        viewVisibilityControlPanel
      ],
      align: 'left'
    } );
  }

  // convenience functions for constructing panels and layout boxes
  /**
   * Create an outlining control panel for a layout box with a minimum width.
   *
   * @param {LayoutBox} layoutBox
   * @param {number} minWidth
   * @returns {Panel}
   */
  function createControlPanel( layoutBox, minWidth ) {
    return new Panel( layoutBox, {
      xMargin: 10,
      yMargin: 10,
      minWidth: minWidth,
      align: 'left'
    } );
  }

  /**
   * Create a layout box with a title and a group of check boxes.
   * @param {string} titleString
   * @param {VerticalCheckBoxGroup} checkBoxGroup
   * @returns {LayoutBox}
   */
  function createControlBox( titleString, checkBoxGroup ) {
    return new LayoutBox( {
      children: [
        new Text( titleString, { font: PANEL_TITLE_FONT } ),
        new VStrut( TITLE_VERTICAL_SPACE ),
        checkBoxGroup
      ],
      align: 'left'
    } );
  }

  return inherit( LayoutBox, CapacitorLabBasicsVisibilityControlPanel );

} );