// Copyright 2015-2017, University of Colorado Boulder

/**
 * ScreenView for "Light Bulb" screen of Capacitor Lab: Basics.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var BarMeterPanel = require( 'CAPACITOR_LAB_BASICS/light-bulb/view/BarMeterPanel' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CLBViewControlPanel = require( 'CAPACITOR_LAB_BASICS/common/view/control/CLBViewControlPanel' );
  var DebugLayer = require( 'CAPACITOR_LAB_BASICS/common/view/DebugLayer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LightBulbCircuitNode = require( 'CAPACITOR_LAB_BASICS/light-bulb/view/LightBulbCircuitNode' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Vector2 = require( 'DOT/Vector2' );
  var VoltmeterNode = require( 'CAPACITOR_LAB_BASICS/common/view/meters/VoltmeterNode' );
  var VoltmeterToolBoxPanel = require( 'CAPACITOR_LAB_BASICS/common/view/control/VoltmeterToolBoxPanel' );

  // Panel offsets (wrt various references) in model coordinates.
  var BAR_METER_PANEL_OFFSET = new Vector2( 40, 30 ); // Sign of x offset is reversed

  /**
   * @constructor
   *
   * @param {CLBLightBulbModel} model
   * @param {Tandem} tandem
   */
  function CLBLightBulbScreenView( model, tandem ) {

    ScreenView.call( this, { tandem: tandem } );

    // @private {CLBModelViewTransform3D}
    this.modelViewTransform = model.modelViewTransform;

    // @private {CLBLightBulbModel}
    this.model = model;

    // Circuit
    var lightBulbCircuitNode = new LightBulbCircuitNode( model, tandem.createTandem( 'lightBulbCircuitNode' ) );

    // meters
    var barMeterPanelWidth = lightBulbCircuitNode.topWireNode.width + 2 * BAR_METER_PANEL_OFFSET.x;
    var barMeterPanel = new BarMeterPanel( model, barMeterPanelWidth, tandem.createTandem( 'barMeterPanel' ) );
    var voltmeterNode = new VoltmeterNode( model.voltmeter, this.modelViewTransform, model.voltmeterVisibleProperty,
      tandem.createTandem( 'voltmeterNode' ) );
    var voltmeterToolbox = new VoltmeterToolBoxPanel( voltmeterNode, this.modelViewTransform,
      model.voltmeter.inUserControlProperty, model.voltmeterVisibleProperty, tandem.createTandem( 'voltmeterToolBox' ) );

    // View control panel and voltmeter panel
    var viewControlPanel = new CLBViewControlPanel( model, tandem.createTandem( 'viewControlPanel' ), {
      numberOfBarGraphs: 3,
      maxTextWidth: 200
    } );
    viewControlPanel.rightTop = this.layoutBounds.rightTop.plus( new Vector2( -10, 10 ) );
    voltmeterToolbox.rightTop = viewControlPanel.rightBottom.plus( new Vector2( 0, 10 ) );

    // Circuit bar meter panel
    barMeterPanel.left = lightBulbCircuitNode.topWireNode.left - 40;
    barMeterPanel.top = this.layoutBounds.top + 10;

    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      bottom: this.layoutBounds.bottom - 20,
      right: this.layoutBounds.right - 30,
      radius: 25,
      touchAreaDilation: 20,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );

    // rendering order
    this.addChild( lightBulbCircuitNode );
    this.addChild( barMeterPanel );
    this.addChild( viewControlPanel );
    this.addChild( voltmeterToolbox );
    this.addChild( voltmeterNode );
    this.addChild( resetAllButton );
    this.addChild( new DebugLayer( model ) );
  }

  capacitorLabBasics.register( 'CLBLightBulbScreenView', CLBLightBulbScreenView );

  return inherit( ScreenView, CLBLightBulbScreenView );
} );
