// Copyright 2015-2022, University of Colorado Boulder

/**
 * ScreenView for "Light Bulb" screen of Capacitor Lab: Basics.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import StopwatchNode from '../../../../scenery-phet/js/StopwatchNode.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
import { AlignGroup, Color, HBox } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import capacitorLabBasics from '../../capacitorLabBasics.js';
import BarMeterPanel from '../../common/view/BarMeterPanel.js';
import CLBViewControlPanel from '../../common/view/control/CLBViewControlPanel.js';
import ToolboxPanel from '../../common/view/control/ToolboxPanel.js';
import DebugLayer from '../../common/view/DebugLayer.js';
import VoltmeterNode from '../../common/view/meters/VoltmeterNode.js';
import LightBulbCircuitNode from './LightBulbCircuitNode.js';

class CLBLightBulbScreenView extends ScreenView {

  /**
   * @param {CLBLightBulbModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {

    super( { tandem: tandem } );

    // @private {YawPitchModelViewTransform3}
    this.modelViewTransform = model.modelViewTransform;

    // @private {CLBLightBulbModel}
    this.model = model;

    // @private {LightBulbCircuitNode} Circuit
    this.lightBulbCircuitNode = new LightBulbCircuitNode( model, tandem.createTandem( 'lightBulbCircuitNode' ) );

    // meters
    const barMeterPanel = new BarMeterPanel( model, tandem.createTandem( 'barMeterPanel' ) );
    const voltmeterNode = new VoltmeterNode( model.voltmeter, this.modelViewTransform, model.voltmeterVisibleProperty,
      tandem.createTandem( 'voltmeterNode' ) );

    // @public {StopwatchNode}
    const stopwatchNode = new StopwatchNode( model.stopwatch, {
      numberDisplayOptions: {
        numberFormatter: StopwatchNode.createRichTextNumberFormatter( {
          showAsMinutesAndSeconds: true,
          numberOfDecimalPlaces: 1
        } )
      },
      dragBoundsProperty: this.visibleBoundsProperty,
      tandem: Tandem.OPT_OUT, // TODO(phet-io): this seems like it should not opt out, since it has interactive components
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

    // @public {AlignGroup}
    this.rightPanelAlignGroup = new AlignGroup( { matchVertical: false, minWidth: 350 } );

    const toolboxPanel = new ToolboxPanel(
      stopwatchNode,
      voltmeterNode,
      this.modelViewTransform,
      model.voltmeter.isDraggedProperty,
      model.stopwatch,
      model.voltmeterVisibleProperty,
      tandem.createTandem( 'toolboxPanel' ), {
        alignGroup: this.rightPanelAlignGroup
      }
    );

    // View control panel and voltmeter panel
    const viewControlPanel = new CLBViewControlPanel( model, tandem.createTandem( 'viewControlPanel' ), {
      maxTextWidth: 200,
      alignGroup: this.rightPanelAlignGroup
    } );
    viewControlPanel.rightTop = this.layoutBounds.rightTop.plus( new Vector2( -10, 10 ) );
    toolboxPanel.rightTop = viewControlPanel.rightBottom.plus( new Vector2( 0, 10 ) );

    // Circuit bar meter panel
    barMeterPanel.left = this.lightBulbCircuitNode.topWireNode.left - 40;
    barMeterPanel.top = this.layoutBounds.top + 10;

    const timeControlPanel = new Panel( new TimeControlNode( model.isPlayingProperty, {
      timeSpeedProperty: model.timeSpeedProperty,
      playPauseStepButtonOptions: {
        stepForwardButtonOptions: {
          listener: () => { model.manualStep(); }
        }
      },
      tandem: tandem.createTandem( 'timeControlNode' )
    } ), {
      xMargin: 15,
      yMargin: 15,
      stroke: null,
      fill: new Color( 255, 255, 255, 0.6 ),
      tandem: tandem.createTandem( 'timeControlPanel' )
    } );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        model.reset();
      },
      radius: 25,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );

    const simControlHBox = new HBox( {
      children: [
        timeControlPanel,
        resetAllButton
      ],
      spacing: 50,
      bottom: this.layoutBounds.bottom - 20,
      right: this.layoutBounds.right - 30
    } );

    // rendering order
    this.addChild( this.lightBulbCircuitNode );
    this.addChild( simControlHBox );
    this.addChild( barMeterPanel );
    this.addChild( viewControlPanel );
    this.addChild( toolboxPanel );
    this.addChild( voltmeterNode );
    this.addChild( new DebugLayer( model ) );
  }
}

capacitorLabBasics.register( 'CLBLightBulbScreenView', CLBLightBulbScreenView );
export default CLBLightBulbScreenView;