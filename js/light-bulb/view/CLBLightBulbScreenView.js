// Copyright 2015-2019, University of Colorado Boulder

/**
 * ScreenView for "Light Bulb" screen of Capacitor Lab: Basics.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  const BarMeterPanel = require( 'CAPACITOR_LAB_BASICS/common/view/BarMeterPanel' );
  const capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  const CLBViewControlPanel = require( 'CAPACITOR_LAB_BASICS/common/view/control/CLBViewControlPanel' );
  const Color = require( 'SCENERY/util/Color' );
  const DebugLayer = require( 'CAPACITOR_LAB_BASICS/common/view/DebugLayer' );
  const DraggableTimerNode = require( 'CAPACITOR_LAB_BASICS/common/view/drag/DraggableTimerNode' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const LightBulbCircuitNode = require( 'CAPACITOR_LAB_BASICS/light-bulb/view/LightBulbCircuitNode' );
  const Panel = require( 'SUN/Panel' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const TimeControlNode = require( 'SCENERY_PHET/TimeControlNode' );
  const Vector2 = require( 'DOT/Vector2' );
  const VoltmeterNode = require( 'CAPACITOR_LAB_BASICS/common/view/meters/VoltmeterNode' );
  const VoltmeterToolboxPanel = require( 'CAPACITOR_LAB_BASICS/common/view/control/VoltmeterToolboxPanel' );

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

    // @private {LightBulbCircuitNode} Circuit
    this.lightBulbCircuitNode = new LightBulbCircuitNode( model, tandem.createTandem( 'lightBulbCircuitNode' ) );

    // meters
    var barMeterPanel = new BarMeterPanel( model, tandem.createTandem( 'barMeterPanel' ) );
    var voltmeterNode = new VoltmeterNode( model.voltmeter, this.modelViewTransform, model.voltmeterVisibleProperty,
      tandem.createTandem( 'voltmeterNode' ) );

    // @public {DraggableTimerNode}
    var draggableTimerNode = new DraggableTimerNode(
      this.layoutBounds,
      Vector2.ZERO,
      model.secondsProperty,
      model.isRunningProperty,
      model.timerVisibleProperty,
      function() {

        // When a node is released, check if it is over the toolbox.  If so, drop it in.
        if ( toolboxPanel.bounds.intersectsBounds( draggableTimerNode.bounds ) ) {
          model.timerVisibleProperty.set( false );
          model.secondsProperty.reset();
          model.isRunningProperty.reset();
        }
      },
      tandem.createTandem( 'timerNode' )
    );
    this.addChild( draggableTimerNode );

    // @public {AlignGroup}
    this.rightPanelAlignGroup = new AlignGroup( { matchVertical: false, minWidth: 350 } );

    var toolboxPanel = new VoltmeterToolboxPanel(
      this.layoutBounds,
      draggableTimerNode,
      voltmeterNode,
      this.modelViewTransform,
      model.voltmeter.isDraggedProperty,
      model.timerVisibleProperty,
      model.voltmeterVisibleProperty,
      tandem.createTandem( 'toolboxPanel' ), {
        alignGroup: this.rightPanelAlignGroup
      }
    );

    // View control panel and voltmeter panel
    var viewControlPanel = new CLBViewControlPanel( model, tandem.createTandem( 'viewControlPanel' ), {
      maxTextWidth: 200,
      alignGroup: this.rightPanelAlignGroup
    } );
    viewControlPanel.rightTop = this.layoutBounds.rightTop.plus( new Vector2( -10, 10 ) );
    toolboxPanel.rightTop = viewControlPanel.rightBottom.plus( new Vector2( 0, 10 ) );

    // Circuit bar meter panel
    barMeterPanel.left = this.lightBulbCircuitNode.topWireNode.left - 40;
    barMeterPanel.top = this.layoutBounds.top + 10;

    var timeControlPanel = new Panel( new TimeControlNode( model.isPlayingProperty, {
      isSlowMotionProperty: model.isSlowMotionProperty,
      stepOptions: {
        listener: function() { model.manualStep(); }
      },
      tandem: tandem.createTandem( 'timeControlNode' )
    } ), {
      xMargin: 15,
      yMargin: 15,
      stroke: null,
      fill: new Color( 255, 255, 255, 0.6 ),
      tandem: tandem.createTandem( 'timeControlPanel' )
    } );

    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      radius: 25,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );

    // rendering order
    this.addChild( this.lightBulbCircuitNode );
    this.addChild( barMeterPanel );
    this.addChild( viewControlPanel );
    this.addChild( toolboxPanel );
    this.addChild( voltmeterNode );
    this.addChild( new HBox( {
      children: [
        timeControlPanel,
        resetAllButton
      ],
      spacing: 50,
      bottom: this.layoutBounds.bottom - 20,
      right: this.layoutBounds.right - 30
    } ) );
    this.addChild( new DebugLayer( model ) );
  }

  capacitorLabBasics.register( 'CLBLightBulbScreenView', CLBLightBulbScreenView );

  return inherit( ScreenView, CLBLightBulbScreenView );
} );
