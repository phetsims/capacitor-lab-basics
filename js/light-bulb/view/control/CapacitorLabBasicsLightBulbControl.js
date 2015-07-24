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
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );

  // constants
  var PANEL_TITLE_FONT = new PhetFont( { weight: 'bold', size: 14 } );
  var CHECK_BOX_FONT = new PhetFont( 12 );
  var TITLE_VERTICAL_SPACE = 10;
  var PANEL_VERTICAL_SPACE = 30;

  // strings
  var plateChargesString = require( 'string!CAPACITOR_LAB_BASICS/plateCharges' );
  var eFieldString = require( 'string!CAPACITOR_LAB_BASICS/eField' );
  var valuesString = require( 'string!CAPACITOR_LAB_BASICS/values' );
  var viewString = require( 'string!CAPACITOR_LAB_BASICS/view' );
  var capacitanceString = require( 'string!CAPACITOR_LAB_BASICS/capacitance' );
  var topPlateChargeString = require( 'string!CAPACITOR_LAB_BASICS/topPlateCharge' );
  var storedEnergyString = require( 'string!CAPACITOR_LAB_BASICS/storedEnergy' );
  var graphsString = require( 'string!CAPACITOR_LAB_BASICS/graphs' );
  var voltmeterString = require( 'string!CAPACITOR_LAB_BASICS/voltmeter' );

  /**
   * Constructor.
   *
   * @param {CapacitorLabModel} model
   * @constructor
   */
  function CapacitorLabBasicsControlPanel( model ) {

    var viewAssets = [
      {
        string: plateChargesString,
        property: model.plateChargesVisibleProperty
      },
      {
        string: eFieldString,
        property: model.eFieldVisibleProperty
      },
      {
        string: valuesString,
        property: model.valuesVisibleProperty
      }
    ];

    var graphAssets = [
      {
        string: capacitanceString,
        property: model.capacitanceMeterVisibleProperty
      },
      {
        string: topPlateChargeString,
        property: model.plateChargeMeterVisibleProperty
      },
      {
        string: storedEnergyString,
        property: model.storedEnergyMeterVisibleProperty
      }
    ];

    var viewCheckBoxItems = createCheckBoxItems( viewAssets );
    var graphsCheckBoxItems = createCheckBoxItems( graphAssets );

    var viewVerticalCheckBoxGroup = new VerticalCheckBoxGroup( viewCheckBoxItems );
    var graphsVerticalCheckBoxGroup = new VerticalCheckBoxGroup( graphsCheckBoxItems );

    var viewVisibilityControlBox = createControlBox( viewString, viewVerticalCheckBoxGroup );
    var graphsVisibilityControlBox = createControlBox( graphsString, graphsVerticalCheckBoxGroup );

    var graphsVisibilityControlPanel = createControlPanel( graphsVisibilityControlBox );
    var viewVisibilityControlPanel = createControlPanel( viewVisibilityControlBox );

    var voltMeterButton = new RectangularPushButton( {
      content: new Text( voltmeterString, { font: PANEL_TITLE_FONT } ),
      listener: function() {
        model.voltmeterVisible = !model.voltmeterVisible;
      },
      baseColor: 'white'
    } );

    LayoutBox.call( this, {
      children: [
        graphsVisibilityControlPanel,
        new VStrut( PANEL_VERTICAL_SPACE ),
        viewVisibilityControlPanel,
        new VStrut( PANEL_VERTICAL_SPACE ),
        voltMeterButton
      ],
      align: 'left'
    } );
  }

  // convenience functions for constructing panels and layout boxes
  /**
   * Organize strings and properties into objects for each check box group.
   *
   * @param {array} assets
   * @returns {Array}
   */
  function createCheckBoxItems( assets ) {
    var items = [];
    assets.forEach( function( asset ) {
      items.push( {
        content: new Text( asset.string, { font: CHECK_BOX_FONT } ),
        property: asset.property
      } );
    } );
    return items;
  }

  /**
   * Create an outlining control panel for a layout box with a minimum width.
   *
   * @param {LayoutBox} layoutBox
   * @returns {Panel}
   */
  function createControlPanel( layoutBox ) {
    return new Panel( layoutBox, {
      xMargin: 10,
      yMargin: 10,
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

  return inherit( LayoutBox, CapacitorLabBasicsControlPanel );

} );