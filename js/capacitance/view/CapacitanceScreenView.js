// Copyright 2015-2019, University of Colorado Boulder

/**
 * "Capacitance" ScreenView for Capacitor Lab Basics.  Assembles the view from a CapacitanceCircuit and panels.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BarMeterPanel = require( 'CAPACITOR_LAB_BASICS/common/view/BarMeterPanel' );
  const CapacitanceCircuitNode = require( 'CAPACITOR_LAB_BASICS/capacitance/view/CapacitanceCircuitNode' );
  const capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  const CLBViewControlPanel = require( 'CAPACITOR_LAB_BASICS/common/view/control/CLBViewControlPanel' );
  const DebugLayer = require( 'CAPACITOR_LAB_BASICS/common/view/DebugLayer' );
  const inherit = require( 'PHET_CORE/inherit' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const StopwatchNode = require( 'SCENERY_PHET/StopwatchNode' );
  const Vector2 = require( 'DOT/Vector2' );
  const VoltmeterNode = require( 'CAPACITOR_LAB_BASICS/common/view/meters/VoltmeterNode' );
  const VoltmeterToolboxPanel = require( 'CAPACITOR_LAB_BASICS/common/view/control/VoltmeterToolboxPanel' );

  /**
   * @constructor
   * @param {CLBModel} model
   * @param {Tandem} tandem
   */
  function CapacitanceScreenView( model, tandem ) {

    ScreenView.call( this, { tandem: tandem } );

    // @private {YawPitchModelViewTransform3}
    this.modelViewTransform = model.modelViewTransform;

    // @private {CLBModel}
    this.model = model;

    // @private {CapacitanceCircuitNode} circuit
    this.capacitanceCircuitNode = new CapacitanceCircuitNode( model, tandem.createTandem( 'capacitanceCircuitNode' ) );

    // meters
    const voltmeterNode = new VoltmeterNode( model.voltmeter, this.modelViewTransform, model.voltmeterVisibleProperty, tandem.createTandem( 'voltmeterNode' ) );

    // @public {StopwatchNode}
    const stopwatchNode = new StopwatchNode( model.stopwatch, {
      visibleBoundsProperty: this.visibleBoundsProperty,
      tandem: tandem.createTandem( 'stopwatchNode' ),
      dragListenerOptions: {
        end: () => {

          // When a node is released, check if it is over the toolbox.  If so, drop it in.
          if ( toolboxPanel.bounds.intersectsBounds( stopwatchNode.bounds ) ) {
            model.stopwatch.reset();
          }
        }
      }
    } );
    this.addChild( stopwatchNode );

    const toolboxPanel = new VoltmeterToolboxPanel(
      this.layoutBounds,
      stopwatchNode,
      voltmeterNode,
      this.modelViewTransform,
      model.voltmeter.isDraggedProperty,
      model.stopwatch,
      model.voltmeterVisibleProperty,
      tandem.createTandem( 'toolboxPanel' ), {
        includeTimer: false
      }
    );

    // control
    const viewControlPanel = new CLBViewControlPanel( model, tandem.createTandem( 'viewControlPanel' ), {
      maxTextWidth: 200
    } );
    viewControlPanel.rightTop = this.layoutBounds.rightTop.plus( new Vector2( -10, 10 ) );
    toolboxPanel.rightTop = viewControlPanel.rightBottom.plus( new Vector2( 0, 10 ) );

    const capacitanceBarMeterPanel = new BarMeterPanel(
      model,
      tandem.createTandem( 'barMeterPanel' )
    );
    capacitanceBarMeterPanel.left = this.capacitanceCircuitNode.topWireNode.left - 40;
    capacitanceBarMeterPanel.top = this.layoutBounds.top + 10;

    const resetAllButton = new ResetAllButton( {
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
