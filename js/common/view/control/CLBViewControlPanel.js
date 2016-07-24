  // Copyright 2015, University of Colorado Boulder

/**
 * Control panel for view elements in Capacitor Lab: Basics.  Controls the visibility of plate charges, current
 * indicators, electric field and values.  This set of controls is used in both the 'light-bulb' and 'capacitance'
 * screens.
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
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  // phet-io modules
  var TPanel = require( 'ifphetio!PHET_IO/types/sun/TPanel' );

  // constants
  var PANEL_TITLE_FONT = new PhetFont( { weight: 'bold', size: 18 } );
  var CHECK_BOX_FONT = new PhetFont( 16 );
  var TITLE_VERTICAL_SPACE = 10;

  // strings
  var plateChargesString = require( 'string!CAPACITOR_LAB_BASICS/plateCharges' );
  var eFieldString = require( 'string!CAPACITOR_LAB_BASICS/eField' );
  var viewString = require( 'string!CAPACITOR_LAB_BASICS/view' );
  var currentString = require( 'string!CAPACITOR_LAB_BASICS/current' );
  var barGraphString = require( 'string!CAPACITOR_LAB_BASICS/barGraph' );
  var barGraphsString = require( 'string!CAPACITOR_LAB_BASICS/barGraphs' );

  /**
   * Constructor.
   *
   * @param {CLBModel} model
   * @param {Tandem} tandem
   * @param {Object} options
   * @constructor
   */
  function CLBViewControlPanel( model, tandem, options ) {

    var defaultOptions = {
      numberOfBarGraphs: 1,
      maxTextWidth: 250
    };

    options = _.extend( {}, defaultOptions, options );

    var viewAssets = [
      {
        string: plateChargesString,
        property: model.plateChargesVisibleProperty,
        tandemName: 'plateChargesCheckBox'
      },
      {
        string: options.numberOfBarGraphs > 1 ? barGraphsString : barGraphString,
        property: model.barGraphsVisibleProperty,
        tandemName: 'barGraphsCheckBox'
      },
      {
        string: eFieldString,
        property: model.eFieldVisibleProperty,
        tandemName: 'eFieldCheckBox'
      },
      {
        string: currentString,
        property: model.currentVisibleProperty,
        tandemName: 'currentCheckBox'
      }
    ];


    var viewCheckBoxItems = createCheckBoxItems( viewAssets, options.maxTextWidth );
    var verticalCheckBoxGroup = new VerticalCheckBoxGroup( viewCheckBoxItems, {
      tandem: tandem.createTandem( 'verticalCheckBoxGroup' )
    } );
    var viewVisibilityControlBox = createControlBox( viewString, verticalCheckBoxGroup );

    Panel.call( this, viewVisibilityControlBox, {
      xMargin: 10,
      yMargin: 10,
      align: 'left',
      fill: CLBConstants.METER_PANEL_FILL
    } );

    // Register with tandem.  No need to handle dispose/removeInstance since the CLBViewControlPanel exists for the
    // lifetime of the simulation.
    tandem.addInstance( this, TPanel );
  }

  // convenience functions for constructing panels and layout boxes
  /**
   * Organize strings and properties into objects for each check box group.
   *
   * @param {array} assets
   * @returns {Array}
   */
  function createCheckBoxItems( assets, maxTextWidth ) {
    var items = [];
    assets.forEach( function( asset ) {
      items.push( {
        content: new Text( asset.string, { font: CHECK_BOX_FONT, maxWidth: maxTextWidth } ),
        property: asset.property,
        label: asset.string,
        tandemName: asset.tandemName
      } );
    } );
    return items;
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
        new Text( titleString, { font: PANEL_TITLE_FONT, maxWidth: 300 } ),
        new VStrut( TITLE_VERTICAL_SPACE ),
        checkBoxGroup
      ],
      align: 'left'
    } );
  }

  capacitorLabBasics.register( 'CLBViewControlPanel', CLBViewControlPanel );

  return inherit( Panel, CLBViewControlPanel );
} );