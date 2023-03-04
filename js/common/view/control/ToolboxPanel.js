// Copyright 2015-2023, University of Colorado Boulder

/**
 * Toolbox that contains a voltmeter and timer.  The user can drag the voltmeter out of the toolbox for
 * use.  TODO: Perhaps it should be renamed now that it contains tools other than the Voltmeter
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Vector2 from '../../../../../dot/js/Vector2.js';
import merge from '../../../../../phet-core/js/merge.js';
import Stopwatch from '../../../../../scenery-phet/js/Stopwatch.js';
import StopwatchNode from '../../../../../scenery-phet/js/StopwatchNode.js';
import { AlignBox, DragListener, HBox, Node } from '../../../../../scenery/js/imports.js';
import Panel from '../../../../../sun/js/Panel.js';
import EventType from '../../../../../tandem/js/EventType.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import capacitorLabBasics from '../../../capacitorLabBasics.js';
import CLBConstants from '../../CLBConstants.js';
import VoltmeterNode from '../meters/VoltmeterNode.js';

class ToolboxPanel extends Node {
  /**
   * @param {StopwatchNode|null} stopwatchNode
   * @param {VoltmeterNode} voltmeterNode
   * @param {YawPitchModelViewTransform3} modelViewTransform
   * @param {Property.<boolean>} isDraggedProperty
   * @param {Stopwatch} stopwatch
   * @param {Property.<boolean>} voltmeterVisibleProperty
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( stopwatchNode, voltmeterNode, modelViewTransform, isDraggedProperty, stopwatch, voltmeterVisibleProperty, tandem, options ) {
    options = merge( {
      includeTimer: true,
      alignGroup: null
    }, options );


    // wrap all off this content inside of a node that will hold the input element and its descriptions
    super( {
      tandem: tandem,
      phetioEventType: EventType.USER
    } );

    // @private {VoltmeterNode}
    this.voltmeterNode = voltmeterNode;

    // create the icon for the toolbox.
    const voltmeterScale = options.includeTimer === true ? 0.6 : 1;
    const voltmeterIconNode = VoltmeterNode.createVoltmeterIconNode( voltmeterScale, tandem.createTandem( 'voltmeterIcon' ) );
    voltmeterIconNode.cursor = 'pointer';

    voltmeterIconNode.addInputListener( DragListener.createForwardingListener( event => {
      this.phetioStartEvent( 'dragged' );
      voltmeterVisibleProperty.set( true );

      // initial position of the pointer in the screenView coordinates
      const initialPosition = this.globalToParentPoint( event.pointer.point );

      // make sure that the center of the voltmeter body is offset by the body dimensions
      const offsetPosition = new Vector2( -voltmeterNode.bodyNode.width / 2, -voltmeterNode.bodyNode.height / 2 );

      const voltmeterBodyPosition = initialPosition.plus( offsetPosition );
      voltmeterNode.bodyNode.bodyPositionProperty.set( modelViewTransform.viewToModelPosition( voltmeterBodyPosition ) );

      // start drag from the body node's movable drag handler
      voltmeterNode.bodyNode.dragListener.press( event );
      this.phetioEndEvent();
    } ) );

    // Create timer to be turned into icon
    const placeholderTimer = new StopwatchNode( new Stopwatch( { isVisible: true, tandem: Tandem.OPT_OUT } ), {
      numberDisplayOptions: {
        numberFormatter: StopwatchNode.createRichTextNumberFormatter( {
          showAsMinutesAndSeconds: true,
          numberOfDecimalPlaces: 1
        } )
      },
      scale: 0.60,
      tandem: Tandem.OPT_OUT
    } );

    const timeNodeIconTandem = tandem.createTandem( 'timerIcon' );

    // {Node} Create timer icon. Visible option is used only for reset() in ToolboxPanel.js
    const timerIconNode = placeholderTimer.rasterized( {
      resolution: 5,
      imageOptions: {
        cursor: 'pointer',
        pickable: true,
        tandem: options.includeTimer ? timeNodeIconTandem : Tandem.OPT_OUT
      }
    } );

    // create a forwarding listener for the StopwatchNode DragListener
    timerIconNode.addInputListener( DragListener.createForwardingListener( event => {
      if ( !stopwatch.isVisibleProperty.get() ) {
        stopwatch.isVisibleProperty.value = true;

        const coordinate = this.globalToParentPoint( event.pointer.point ).minusXY(
          stopwatchNode.width / 2,
          stopwatchNode.height / 2
        );
        stopwatch.positionProperty.set( coordinate );
        stopwatchNode.dragListener.press( event, stopwatchNode );
      }
    }, {

      // allow moving a finger (on a touchscreen) dragged across this node to interact with it
      allowTouchSnag: true,
      tandem: timeNodeIconTandem.createTandem( 'dragListener' )
    } ) );

    stopwatch.isVisibleProperty.link( visible => {
      timerIconNode.visible = !visible;
    } );

    const toolbox = new HBox( {
      spacing: 13,
      align: 'center',
      xMargin: 0,
      excludeInvisibleChildrenFromBounds: false
    } );
    if ( options.includeTimer ) {
      toolbox.addChild( voltmeterIconNode );
      toolbox.addChild( timerIconNode );
    }
    else {
      toolbox.addChild( voltmeterIconNode );
    }

    // {AlignBox|HBox}
    const content = options.alignGroup ? new AlignBox( toolbox, {
      group: options.alignGroup,
      xAlign: 'center'
    } ) : toolbox;
    this.addChild( new Panel( content, {
      xMargin: 10,
      yMargin: 15,
      align: 'center',
      minWidth: 175,
      fill: CLBConstants.METER_PANEL_FILL
    } ) );

    voltmeterVisibleProperty.link( voltmeterVisible => {
      voltmeterIconNode.visible = !voltmeterVisible;
    } );

    // track user control of the voltmeter and place the voltmeter back in the toolbox if bounds collide
    // panel exists for lifetime of sim, no need for dispose
    isDraggedProperty.link( isDragged => {
      if ( !isDragged && this.bounds.intersectsBounds( voltmeterNode.bodyNode.bounds.eroded( 40 ) ) ) {
        voltmeterVisibleProperty.set( false );
      }
    } );
  }
}

capacitorLabBasics.register( 'ToolboxPanel', ToolboxPanel );

export default ToolboxPanel;
