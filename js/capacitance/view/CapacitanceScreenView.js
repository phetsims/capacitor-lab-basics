// Copyright 2015-2022, University of Colorado Boulder

/**
 * "Capacitance" ScreenView for Capacitor Lab Basics.  Assembles the view from a CapacitanceCircuit and panels.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import capacitorLabBasics from '../../capacitorLabBasics.js';
import BarMeterPanel from '../../common/view/BarMeterPanel.js';
import CLBViewControlPanel from '../../common/view/control/CLBViewControlPanel.js';
import ToolboxPanel from '../../common/view/control/ToolboxPanel.js';
import DebugLayer from '../../common/view/DebugLayer.js';
import VoltmeterNode from '../../common/view/meters/VoltmeterNode.js';
import CapacitanceCircuitNode from './CapacitanceCircuitNode.js';

class CapacitanceScreenView extends ScreenView {

  /**
   * @param {CLBModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {

    super( { tandem: tandem } );

    // @private {YawPitchModelViewTransform3}
    this.modelViewTransform = model.modelViewTransform;

    // @private {CLBModel}
    this.model = model;

    // @private {CapacitanceCircuitNode} circuit
    this.capacitanceCircuitNode = new CapacitanceCircuitNode( model, tandem.createTandem( 'capacitanceCircuitNode' ) );

    // meters
    const voltmeterNode = new VoltmeterNode( model.voltmeter, this.modelViewTransform, model.voltmeterVisibleProperty, tandem.createTandem( 'voltmeterNode' ) );

    const toolboxPanel = new ToolboxPanel(
      null,
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
      listener: () => {
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

    // Explicitly set reset all button z-order
    resetAllButton.moveToBack();
  }
}

capacitorLabBasics.register( 'CapacitanceScreenView', CapacitanceScreenView );
export default CapacitanceScreenView;