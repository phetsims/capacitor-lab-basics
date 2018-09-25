// Copyright 2015-2017, University of Colorado Boulder

/**
 * Toolbox that contains a voltmeter and timer.  The user can drag the voltmeter out of the toolbox for
 * use.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var AlignBox = require( 'SCENERY/nodes/AlignBox' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Panel = require( 'SUN/Panel' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var TimerNode = require( 'SCENERY_PHET/TimerNode' );
  var Vector2 = require( 'DOT/Vector2' );
  var VoltmeterNode = require( 'CAPACITOR_LAB_BASICS/common/view/meters/VoltmeterNode' );
  var VoltmeterToolboxPanelIO = require( 'CAPACITOR_LAB_BASICS/common/view/control/VoltmeterToolboxPanelIO' );

  /**
   * @constructor
   *
   * @param {Bounds2} dragBounds
   * @param {TimerNode} timerNode
   * @param {VoltmeterNode} voltmeterNode
   * @param {CLModelViewTransform3D} modelViewTransform
   * @param {Property.<boolean>} isDraggedProperty
   * @param {Property.<boolean>} timerVisibleProperty
   * @param {Property.<boolean>} voltmeterVisibleProperty
   * @param {Tandem} tandem
   * @param {object} Options
   */
  function VoltmeterToolboxPanel( dragBounds, timerNode, voltmeterNode, modelViewTransform, isDraggedProperty,
                                  timerVisibleProperty, voltmeterVisibleProperty, tandem, options ) {
    options = _.extend( {
      includeTimer: true,
      alignGroup: null
    }, options );

    var self = this;

    // @private {VoltmeterNode}
    this.voltmeterNode = voltmeterNode;

    // create the icon for the toolbox.
    var voltmeterScale = options.includeTimer === true ? 0.6 : 1;
    var voltmeterIconNode = VoltmeterNode.createVoltmeterIconNode( voltmeterScale );
    voltmeterIconNode.cursor = 'pointer';

    voltmeterIconNode.addInputListener( SimpleDragHandler.createForwardingListener( function( event ) {
      self.phetioStartEvent( 'dragged' );
      voltmeterVisibleProperty.set( true );

      // initial position of the pointer in the screenView coordinates
      var initialPosition = self.globalToParentPoint( event.pointer.point );

      // make sure that the center of the voltmeter body is offset by the body dimensions
      var offsetPosition = new Vector2( -voltmeterNode.bodyNode.width / 2, -voltmeterNode.bodyNode.height / 2 );

      var voltmeterBodyPosition = initialPosition.plus( offsetPosition );
      voltmeterNode.bodyNode.bodyLocationProperty.set( modelViewTransform.viewToModelPosition( voltmeterBodyPosition ) );

      // start drag from the body node's movable drag handler
      voltmeterNode.bodyNode.movableDragHandler.startDrag( event );
      self.phetioEndEvent();
    } ) );

    // Create timer to be turned into icon
    var secondsProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'secondsProperty' ),
      units: 'seconds'
    } );
    var isRunningProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isRunningProperty' )
    } );
    var timer = new TimerNode( secondsProperty, isRunningProperty, {
      scale: .60,
      tandem: tandem.createTandem( 'timerNode' )
    } );

    // {Node} Create timer icon. Visible option is used only for reset() in ToolboxPanel.js
    var timerIconNode = timer.rasterized( {
      cursor: 'pointer',
      resolution: 5,
      pickable: true,
      tandem: tandem.createTandem( 'timerIcon' )
    } );

    // Drag listener for event forwarding: timerIcon ---> timerNode
    timerIconNode.addInputListener( new SimpleDragHandler.createForwardingListener( function( event ) {

      // Toggle visibility
      timerVisibleProperty.set( true );

      // Now determine the initial position where this element should move to after it's created, which corresponds
      // to the location of the mouse or touch event.
      var initialPosition = timerNode.globalToParentPoint( event.pointer.point )
        .minus( new Vector2( timerNode.width / 2, timerNode.height * 0.4 ) );

      timerNode.positionProperty.set( initialPosition );

      // Sending through the startDrag from icon to timerNode causes it to receive all subsequent drag events.
      timerNode.timerNodeMovableDragHandler.startDrag( event );
    }, {

      // allow moving a finger (on a touchscreen) dragged across this node to interact with it
      allowTouchSnag: true,
      dragBounds: dragBounds,
      tandem: tandem.createTandem( 'dragHandler' )
    } ) );

    timerVisibleProperty.link( function( visible ) {
      timerIconNode.visible = !visible;
    } );

    // wrap all off this content inside of a node that will hold the input element and its descriptions
    Node.call( this, {
      tandem: tandem,
      phetioType: VoltmeterToolboxPanelIO,
      phetioEventType: 'user'
    } );

    var toolbox = new HBox( { spacing: 14, align: 'center', xMargin: 0 } );
    if ( options.includeTimer ) {
      toolbox.addChild( voltmeterIconNode );
      toolbox.addChild( timerIconNode );
    }
    else {
      toolbox.addChild( voltmeterIconNode );
    }

    // {AlignBox|HBox}
    var content = !!options.alignGroup ? new AlignBox( toolbox, { group: options.alignGroup } ) : toolbox;
    this.addChild( new Panel( content, {
      xMargin: 15,
      yMargin: 15,
      align: 'center',
      minWidth: 125,
      fill: CLBConstants.METER_PANEL_FILL,
      tandem: tandem.createTandem( 'voltmeterIconNodePanel' )
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
