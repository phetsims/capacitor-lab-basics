// Copyright 2015-2017, University of Colorado Boulder

/**
 * Control panel for view elements in Capacitor Lab: Basics.  Controls the visibility of plate charges, current
 * indicators, electric field and values.  This set of controls is used in both the 'light-bulb' and 'capacitance'
 * screens.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VerticalCheckBoxGroup = require( 'SUN/VerticalCheckBoxGroup' );

  // constants
  var CHECK_BOX_FONT = new PhetFont( 16 );

  // strings
  var barGraphsString = require( 'string!CAPACITOR_LAB_BASICS/barGraphs' );
  var barGraphString = require( 'string!CAPACITOR_LAB_BASICS/barGraph' );
  var currentDirectionString = require( 'string!CAPACITOR_LAB_BASICS/currentDirection' );
  var electricFieldString = require( 'string!CAPACITOR_LAB_BASICS/electricField' );
  var plateChargesString = require( 'string!CAPACITOR_LAB_BASICS/plateCharges' );

  /**
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

    var verticalCheckBoxGroupTandem = tandem.createTandem( 'verticalCheckBoxGroup' );

    var checkBoxItems = [ {
      string: plateChargesString,
      property: model.plateChargesVisibleProperty,
      tandem: verticalCheckBoxGroupTandem.createTandem( 'plateChargesCheckBox' )
    }, {
      string: options.numberOfBarGraphs > 1 ? barGraphsString : barGraphString,
      property: model.barGraphsVisibleProperty,
      tandem: verticalCheckBoxGroupTandem.createTandem( 'barGraphsCheckBox' )
    }, {
      string: electricFieldString,
      property: model.electricFieldVisibleProperty,
      tandem: verticalCheckBoxGroupTandem.createTandem( 'electricFieldCheckBox' )
    }, {
      string: currentDirectionString,
      property: model.currentVisibleProperty,
      tandem: verticalCheckBoxGroupTandem.createTandem( 'currentCheckBox' )
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
      tandem: verticalCheckBoxGroupTandem,
      boxWidth: viewCheckBoxItems[ 0 ].content.height
    } );

    Panel.call( this, verticalCheckBoxGroup, {
      xMargin: 10,
      yMargin: 10,
      fill: CLBConstants.METER_PANEL_FILL,
      tandem: tandem
    } );
  }

  capacitorLabBasics.register( 'CLBViewControlPanel', CLBViewControlPanel );

  return inherit( Panel, CLBViewControlPanel );
} );
