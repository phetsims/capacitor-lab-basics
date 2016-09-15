// Copyright 2015, University of Colorado Boulder

/**
 * Tool box that contains a voltmeter.  The user can drag the voltmeter out of the toolbox for
 * use.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var VoltmeterNode = require( 'CAPACITOR_LAB_BASICS/common/view/meters/VoltmeterNode' );
  var Panel = require( 'SUN/Panel' );
  var Vector2 = require( 'DOT/Vector2' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var Node = require( 'SCENERY/nodes/Node' );

  // phet-io modules
  var TNode = require('ifphetio!PHET_IO/types/scenery/nodes/TNode');

  /**
   *
   * @param {VoltmeterNode} voltmeterNode
   * @param {CLModelViewTransform} modelViewTransform
   * @param {Property.<boolean>} inUserControlProperty
   * @param {Property.<boolean>} voltmeterVisibleProperty
   * @param {Tandem} tandem
   * @constructor
   */
  function VoltmeterToolBoxPanel( voltmeterNode, modelViewTransform, inUserControlProperty, voltmeterVisibleProperty,
    tandem ) {

    var self = this;
    this.voltmeterNode = voltmeterNode; // @private

    // create the icon for the toolbox.
    var voltmeterIconNode = VoltmeterNode.createVoltmeterIconNode();


    voltmeterIconNode.addInputListener( {
      down: function( event ) {
        voltmeterVisibleProperty.set( true );

        // initial position of the pointer in the screenView coordinates
        var initialPosition = self.globalToParentPoint( event.pointer.point );

        // make sure that the center of the voltmeter body is offset by the body dimensions
        var offsetPosition = new Vector2( -voltmeterNode.bodyNode.width / 2, -voltmeterNode.bodyNode.height / 2 );

        var voltmeterBodyPosition = initialPosition.plus( offsetPosition );
        voltmeterNode.bodyNode.bodyLocationProperty.set( modelViewTransform.viewToModelPosition( voltmeterBodyPosition ) );

        // start drag from the body node's movable drag handler
        voltmeterNode.bodyNode.movableDragHandler.startDrag( event );
      }
    } );

    // wrap all off this content inside of a node that will hold the input element and its descriptions
    Node.call( this );

    var toolboxPanel = new Panel( voltmeterIconNode, {
      xMargin: 15,
      yMargin: 15,
      fill: CLBConstants.METER_PANEL_FILL
    } );
    this.addChild( toolboxPanel );

    voltmeterVisibleProperty.link( function( voltmeterVisible ) {
      voltmeterIconNode.visible = !voltmeterVisible;
    } );

    // track user control of the voltmeter and place the voltmeter back in the tool box if bounds collide
    // panel exists for lifetime of sim, no need for dispose
    inUserControlProperty.link( function( inUserControl ) {
      if ( !inUserControl && self.bounds.intersectsBounds( voltmeterNode.bodyNode.bounds.eroded( 40 ) ) ) {
        voltmeterVisibleProperty.set( false );
      }
    } );

    // Register with tandem.  No need to handle dispose/removeInstance since this
    // exists for the lifetime of the simulation.
    tandem.addInstance( this, TNode );
  }

  capacitorLabBasics.register( 'VoltmeterToolBoxPanel', VoltmeterToolBoxPanel );

  return inherit( Node, VoltmeterToolBoxPanel );
} );

