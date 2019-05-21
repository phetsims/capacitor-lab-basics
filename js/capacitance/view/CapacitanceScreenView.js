// Copyright 2015-2019, University of Colorado Boulder

/**
 * "Capacitance" ScreenView for Capacitor Lab Basics.  Assembles the view from a CapacitanceCircuit and panels.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var BarMeterPanel = require( 'CAPACITOR_LAB_BASICS/common/view/BarMeterPanel' );
  var CapacitanceCircuitNode = require( 'CAPACITOR_LAB_BASICS/capacitance/view/CapacitanceCircuitNode' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CLBViewControlPanel = require( 'CAPACITOR_LAB_BASICS/common/view/control/CLBViewControlPanel' );
  var DebugLayer = require( 'CAPACITOR_LAB_BASICS/common/view/DebugLayer' );
  var DraggableTimerNode = require( 'CAPACITOR_LAB_BASICS/common/view/drag/DraggableTimerNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Vector2 = require( 'DOT/Vector2' );
  var VoltmeterNode = require( 'CAPACITOR_LAB_BASICS/common/view/meters/VoltmeterNode' );
  var VoltmeterToolboxPanel = require( 'CAPACITOR_LAB_BASICS/common/view/control/VoltmeterToolboxPanel' );

  /**
   * @constructor
   * @param {CLBModel} model
   * @param {Tandem} tandem
   */
  function CapacitanceScreenView( model, tandem ) {

    ScreenView.call( this, { tandem: tandem } );

    // @private {CLBModelViewTransform3D}
    this.modelViewTransform = model.modelViewTransform;

    // @private {CLBModel}
    this.model = model;

    // @private {CapacitanceCircuitNode} circuit
    this.capacitanceCircuitNode = new CapacitanceCircuitNode( model, tandem.createTandem( 'capacitanceCircuitNode' ) );

    // meters
    var voltmeterNode = new VoltmeterNode( model.voltmeter, this.modelViewTransform, model.voltmeterVisibleProperty, tandem.createTandem( 'voltmeterNode' ) );

    // @public {DraggableTimerNode}
    var draggableTimerNode = new DraggableTimerNode(
      this.visibleBoundsProperty.get(),
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

    var toolboxPanel = new VoltmeterToolboxPanel(
      this.layoutBounds,
      draggableTimerNode,
      voltmeterNode,
      this.modelViewTransform,
      model.voltmeter.isDraggedProperty,
      model.timerVisibleProperty,
      model.voltmeterVisibleProperty,
      tandem.createTandem( 'ToolboxPanel' ), {
        includeTimer: false
      }
    );

    // control
    var viewControlPanel = new CLBViewControlPanel( model, tandem.createTandem( 'viewControlPanel' ), {
      maxTextWidth: 200
    } );
    viewControlPanel.rightTop = this.layoutBounds.rightTop.plus( new Vector2( -10, 10 ) );
    toolboxPanel.rightTop = viewControlPanel.rightBottom.plus( new Vector2( 0, 10 ) );

    var capacitanceBarMeterPanel = new BarMeterPanel(
      model,
      tandem.createTandem( 'barMeterPanel' )
    );
    capacitanceBarMeterPanel.left = this.capacitanceCircuitNode.topWireNode.left - 40;
    capacitanceBarMeterPanel.top = this.layoutBounds.top + 10;

    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      bottom: this.layoutBounds.bottom - 30,
      right: this.layoutBounds.right - 30,
      radius: 25,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );

    // rendering order
    this.addChild( this.capacitanceCircuitNode );
    this.addChild( capacitanceBarMeterPanel );
    this.addChild( viewControlPanel );
    this.addChild( toolboxPanel );
    this.addChild( voltmeterNode );
    this.addChild( resetAllButton );
    this.addChild( new DebugLayer( model ) );
  }

  capacitorLabBasics.register( 'CapacitanceScreenView', CapacitanceScreenView );

  return inherit( ScreenView, CapacitanceScreenView );
} );
