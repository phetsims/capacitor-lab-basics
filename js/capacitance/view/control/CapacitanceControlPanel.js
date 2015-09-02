// Copyright 2002-2015, University of Colorado Boulder

/**
 * Control panel for Capacitor Lab: Basics.  Controls visibility of plate charges, electric field lines, physical
 * values, and the voltmeter.
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

  // strings
  var plateChargesString = require( 'string!CAPACITOR_LAB_BASICS/plateCharges' );
  var eFieldString = require( 'string!CAPACITOR_LAB_BASICS/eField' );
  var valuesString = require( 'string!CAPACITOR_LAB_BASICS/values' );
  var viewString = require( 'string!CAPACITOR_LAB_BASICS/view' );

  /**
   * Constructor.
   *
   * @param {CapacitorLabBasicsModel} model
   * @param {number} minWidth - minimum width of the panels, calculated by layout in the screen view.
   * @constructor
   */
  function CapacitanceControlPanel( model, minWidth ) {

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
    var viewCheckBoxItems = createCheckBoxItems( viewAssets );
    var viewVerticalCheckBoxGroup = new VerticalCheckBoxGroup( viewCheckBoxItems );
    var viewVisibilityControlBox = createControlBox( viewString, viewVerticalCheckBoxGroup );
    var viewVisibilityControlPanel = createControlPanel( viewVisibilityControlBox, minWidth );

    LayoutBox.call( this, {
      children: [
        viewVisibilityControlPanel
      ],
      align: 'left'
    } );
  }

  // convenience functions for constructing panels and layout boxes
  /**
   * Organize strings and properties into objects for each check box group.
   *
   * @param assets
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

  return inherit( LayoutBox, CapacitanceControlPanel );

} );