// Copyright 2002-2015, University of Colorado Boulder

/**
 * Control panel for view elements in Capacitor Lab: Basics.  Controls the visibility of plate charges, current
 * indicators, electric field and values.  This set of controls is used in both the 'light-bulb' anc 'capacitance'
 * screens.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var VoltmeterNode = require( 'CAPACITOR_LAB_BASICS/common/view/meters/VoltmeterNode' );
  var Panel = require( 'SUN/Panel' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   *
   * @param {VoltmeterNode} voltmeterNode
   * @param {CLModelViewTransform} modelViewTransform
   * @param {Property.<boolean>} inUserControlProperty
   * @constructor
   */
  function VoltmeterToolBoxPanel( voltmeterNode, modelViewTransform, inUserControlProperty ) {

    var thisToolBoxPanel = this;

    // create the icon for the toolbox.
    var voltmeterIconNode = VoltmeterNode.VoltmeterIconNode();

    var toolBoxDragHandler = new SimpleDragHandler( {
      parentScreen: null, // needed for coordinate transforms
      modelViewTransform: modelViewTransform,
      start: function( event ) {
        // pull the voltmeter out of the toolbox
        inUserControlProperty.set( true );

        // find the root parent screenView
        var testNode = thisToolBoxPanel;
        while ( testNode !== null ) {
          if ( testNode instanceof ScreenView ) {
            this.parentScreen = testNode;
            break;
          }
          testNode = testNode.parents[ 0 ]; // Move up the scene graph by one level
        }

        // initial position of the pointer in the screenView coordinates
        var initialPosition = this.parentScreen.globalToLocalPoint( event.pointer.point );

        // make sure that the center of the voltmeter body is offset for the
        var offsetPosition = new Vector2( -voltmeterNode.bodyNode.width / 2, -voltmeterNode.bodyNode.height / 2 );

        // position of the  electricPotential sensor in ScreenView coordinates
        var voltmeterBodyPosition = initialPosition.plus( offsetPosition );
        voltmeterNode.bodyNode.bodyLocationProperty.set( modelViewTransform.viewToModelPosition( voltmeterBodyPosition ) );

      },

      translate: function( translationParams ) {
        // TODO: restrict dragging to the screenView bounds
        var unconstrainedLocation = voltmeterNode.bodyNode.bodyLocationProperty.value.plus( this.modelViewTransform.viewToModelDelta( translationParams.delta ) );
        voltmeterNode.bodyNode.bodyLocationProperty.set( unconstrainedLocation );
      }

    } );
    voltmeterIconNode.addInputListener( toolBoxDragHandler );

    Panel.call( this, voltmeterIconNode, {
      xMargin: 15,
      yMargin: 15
    } );

    inUserControlProperty.link( function( inUserControl ) {
      voltmeterNode.visible = inUserControl;
      voltmeterIconNode.visible = !inUserControl;
    } );
  }

  return inherit( Panel, VoltmeterToolBoxPanel );
} );