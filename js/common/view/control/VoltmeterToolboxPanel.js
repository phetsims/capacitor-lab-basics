// Copyright 2015-2019, University of Colorado Boulder

/**
 * Toolbox that contains a voltmeter and timer.  The user can drag the voltmeter out of the toolbox for
 * use.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  const CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  const EventType = require( 'TANDEM/EventType' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Panel = require( 'SUN/Panel' );
  const SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  const Tandem = require( 'TANDEM/Tandem' );
  const TimerNode = require( 'SCENERY_PHET/TimerNode' );
  const Vector2 = require( 'DOT/Vector2' );
  const VoltmeterNode = require( 'CAPACITOR_LAB_BASICS/common/view/meters/VoltmeterNode' );

  /**
   * @constructor
   *
   * @param {Bounds2} dragBounds
   * @param {TimerNode} timerNode
   * @param {VoltmeterNode} voltmeterNode
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Property.<boolean>} isDraggedProperty
   * @param {Property.<boolean>} timerVisibleProperty
   * @param {Property.<boolean>} voltmeterVisibleProperty
   * @param {Tandem} tandem
   * @param {object} options
   */
  function VoltmeterToolboxPanel( dragBounds, timerNode, voltmeterNode, modelViewTransform, isDraggedProperty,
                                  timerVisibleProperty, voltmeterVisibleProperty, tandem, options ) {
    options = _.extend( {
      includeTimer: true,
      alignGroup: null
    }, options );

    const self = this;

    // @private {VoltmeterNode}
    this.voltmeterNode = voltmeterNode;

    // create the icon for the toolbox.
    const voltmeterScale = options.includeTimer === true ? 0.6 : 1;
    const voltmeterIconNode = VoltmeterNode.createVoltmeterIconNode( voltmeterScale, tandem.createTandem( 'voltmeterIcon' ) );
    voltmeterIconNode.cursor = 'pointer';

    voltmeterIconNode.addInputListener( SimpleDragHandler.createForwardingListener( function( event ) {
      self.phetioStartEvent( 'dragged' );
      voltmeterVisibleProperty.set( true );

      // initial position of the pointer in the screenView coordinates
      const initialPosition = self.globalToParentPoint( event.pointer.point );

      // make sure that the center of the voltmeter body is offset by the body dimensions
      const offsetPosition = new Vector2( -voltmeterNode.bodyNode.width / 2, -voltmeterNode.bodyNode.height / 2 );

      const voltmeterBodyPosition = initialPosition.plus( offsetPosition );
      voltmeterNode.bodyNode.bodyLocationProperty.set( modelViewTransform.viewToModelPosition( voltmeterBodyPosition ) );

      // start drag from the body node's movable drag handler
      voltmeterNode.bodyNode.movableDragHandler.startDrag( event );
      self.phetioEndEvent();
    } ) );

    // Create timer to be turned into icon
    const timer = new TimerNode( new NumberProperty( 0 ), new BooleanProperty( false ), {
      scale: .60,
      tandem: Tandem.optOut
    } );

    const timeNodeIconTandem = tandem.createTandem( 'timerIcon' );

    // {Node} Create timer icon. Visible option is used only for reset() in ToolboxPanel.js
    const timerIconNode = timer.rasterized( {
      cursor: 'pointer',
      resolution: 5,
      pickable: true,
      tandem: options.includeTimer ? timeNodeIconTandem : Tandem.optOut
    } );

    // Drag listener for event forwarding: timerIcon ---> timerNode
    timerIconNode.addInputListener( new SimpleDragHandler.createForwardingListener( function( event ) {

      // Toggle visibility
      timerVisibleProperty.set( true );

      // Now determine the initial position where this element should move to after it's created, which corresponds
      // to the location of the mouse or touch event.
      const initialPosition = timerNode.globalToParentPoint( event.pointer.point )
        .minus( new Vector2( timerNode.width / 2, timerNode.height * 0.4 ) );

      timerNode.positionProperty.set( initialPosition );

      // Sending through the startDrag from icon to timerNode causes it to receive all subsequent drag events.
      timerNode.timerNodeMovableDragHandler.startDrag( event );
    }, {

      // allow moving a finger (on a touchscreen) dragged across this node to interact with it
      allowTouchSnag: true,
      dragBounds: dragBounds,
      tandem: timeNodeIconTandem.createTandem( 'dragHandler' )
    } ) );

    timerVisibleProperty.link( function( visible ) {
      timerIconNode.visible = !visible;
    } );

    // wrap all off this content inside of a node that will hold the input element and its descriptions
    Node.call( this, {
      tandem: tandem,
      phetioEventType: EventType.USER
    } );

    const toolbox = new HBox( { spacing: 13, align: 'center', xMargin: 0 } );
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

    voltmeterVisibleProperty.link( function( voltmeterVisible ) {
      voltmeterIconNode.visible = !voltmeterVisible;
    } );

    // track user control of the voltmeter and place the voltmeter back in the toolbox if bounds collide
    // panel exists for lifetime of sim, no need for dispose
    isDraggedProperty.link( function( isDragged ) {
      if ( !isDragged && self.bounds.intersectsBounds( voltmeterNode.bodyNode.bounds.eroded( 40 ) ) ) {
        voltmeterVisibleProperty.set( false );
      }
    } );
  }

  capacitorLabBasics.register( 'VoltmeterToolboxPanel', VoltmeterToolboxPanel );

  return inherit( Node, VoltmeterToolboxPanel );
} );
