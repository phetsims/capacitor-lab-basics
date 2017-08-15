// Copyright 2016, University of Colorado Boulder

/**
 * Control panel for view elements in Capacitor Lab: Basics.  Controls the visibility of plate charges, current
 * indicators, electric field and values.  This set of controls is used in both the 'light-bulb' and 'capacitance'
 * screens.
 *
 * @author Jesse Greenberg
 * @author Andrew Adare
 */
define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VerticalCheckBoxGroup = require( 'SUN/VerticalCheckBoxGroup' );
  var VStrut = require( 'SCENERY/nodes/VStrut' );

  // constants
  var PANEL_TITLE_FONT = new PhetFont( {
    weight: 'bold',
    size: 18
  } );
  var CHECK_BOX_FONT = new PhetFont( 16 );
  var TITLE_VERTICAL_SPACE = 10;

  // strings
  var plateChargesString = require( 'string!CAPACITOR_LAB_BASICS/plateCharges' );
  var eFieldString = require( 'string!CAPACITOR_LAB_BASICS/eField' );
  var viewString = require( 'string!CAPACITOR_LAB_BASICS/view' );
  var currentDirectionString = require( 'string!CAPACITOR_LAB_BASICS/currentDirection' );
  var barGraphString = require( 'string!CAPACITOR_LAB_BASICS/barGraph' );
  var barGraphsString = require( 'string!CAPACITOR_LAB_BASICS/barGraphs' );

  /**
   * Constructor.
   * @constructor
   *
   * @param {CLBModel} model
   * @param {Tandem} tandem
   * @param {Object} options
   */
  function CLBViewControlPanel( model, tandem, options ) {

    options = _.extend( {
      numberOfBarGraphs: 1,
      maxTextWidth: 250
    }, options );

    var checkBoxItems = [ {
      string: plateChargesString,
      property: model.plateChargesVisibleProperty,
      tandemName: 'plateChargesCheckBox'
    }, {
      string: options.numberOfBarGraphs > 1 ? barGraphsString : barGraphString,
      property: model.barGraphsVisibleProperty,
      tandemName: 'barGraphsCheckBox'
    }, {
      string: eFieldString,
      property: model.eFieldVisibleProperty,
      tandemName: 'eFieldCheckBox'
    }, {
      string: currentDirectionString,
      property: model.currentVisibleProperty,
      tandemName: 'currentCheckBox'
    } ];

    var viewCheckBoxItems = checkBoxItems.map( function( asset ) {
      return {
        content: new Text( asset.string, {
          font: CHECK_BOX_FONT,
          maxWidth: options.maxTextWidth
        } ),
        property: asset.property,
        label: asset.string,
        tandemName: asset.tandemName
      };
    } );

    var verticalCheckBoxGroup = new VerticalCheckBoxGroup( viewCheckBoxItems, {
      tandem: tandem.createTandem( 'verticalCheckBoxGroup' )
    } );

    var viewVisibilityControlBox = new LayoutBox( {
      children: [
        new Text( viewString, {
          font: PANEL_TITLE_FONT,
          maxWidth: 300
        } ),
        new VStrut( TITLE_VERTICAL_SPACE ),
        verticalCheckBoxGroup
      ],
      align: 'left'
    } );

    Panel.call( this, viewVisibilityControlBox, {
      xMargin: 10,
      yMargin: 10,
      fill: CLBConstants.METER_PANEL_FILL,
      tandem: tandem
    } );
  }

  capacitorLabBasics.register( 'CLBViewControlPanel', CLBViewControlPanel );

  return inherit( Panel, CLBViewControlPanel );
} );
