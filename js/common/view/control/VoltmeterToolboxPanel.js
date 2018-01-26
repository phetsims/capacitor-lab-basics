// Copyright 2015-2017, University of Colorado Boulder

/**
 * Toolbox that contains a voltmeter.  The user can drag the voltmeter out of the toolbox for
 * use.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );
  var VoltmeterNode = require( 'CAPACITOR_LAB_BASICS/common/view/meters/VoltmeterNode' );
  var VoltmeterToolboxPanelIO = require( 'CAPACITOR_LAB_BASICS/common/view/control/VoltmeterToolboxPanelIO' );

  /**
   * @constructor
   *
   * @param {VoltmeterNode} voltmeterNode
   * @param {CLModelViewTransform3D} modelViewTransform
   * @param {Property.<boolean>} isDraggedProperty
   * @param {Property.<boolean>} voltmeterVisibleProperty
   * @param {Tandem} tandem
   */
  function VoltmeterToolboxPanel( voltmeterNode, modelViewTransform, isDraggedProperty, voltmeterVisibleProperty,
                                  tandem ) {

    var self = this;

    // @private {VoltmeterNode}
    this.voltmeterNode = voltmeterNode;

    // create the icon for the toolbox.
    var voltmeterIconNode = VoltmeterNode.createVoltmeterIconNode();
    voltmeterIconNode.cursor = 'pointer';

    voltmeterIconNode.addInputListener( SimpleDragHandler.createForwardingListener( function( event ) {
      self.startEvent( 'user', 'dragged' );
      voltmeterVisibleProperty.set( true );

      // initial position of the pointer in the screenView coordinates
      var initialPosition = self.globalToParentPoint( event.pointer.point );

      // make sure that the center of the voltmeter body is offset by the body dimensions
      var offsetPosition = new Vector2( -voltmeterNode.bodyNode.width / 2, -voltmeterNode.bodyNode.height / 2 );

      var voltmeterBodyPosition = initialPosition.plus( offsetPosition );
      voltmeterNode.bodyNode.bodyLocationProperty.set( modelViewTransform.viewToModelPosition( voltmeterBodyPosition ) );

      // start drag from the body node's movable drag handler
      voltmeterNode.bodyNode.movableDragHandler.startDrag( event );
      self.endEvent();
    } ) );

    // wrap all off this content inside of a node that will hold the input element and its descriptions
    Node.call( this, {
      tandem: tandem,
      phetioType: VoltmeterToolboxPanelIO
    } );

    this.addChild( new Panel( voltmeterIconNode, {
      xMargin: 15,
      yMargin: 15,
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
