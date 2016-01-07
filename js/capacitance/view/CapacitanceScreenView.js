// Copyright 2015, University of Colorado Boulder

/**
 * "Intro" ScreenView for Capacitor Lab Basics.
 *
 * This this extension of ScreenView is a direct port of DielectricCanvas of Capacitor Lab without dielectrics.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var CapacitanceCircuitNode = require( 'CAPACITOR_LAB_BASICS/capacitance/view/CapacitanceCircuitNode' );
  var CapacitorLabBasicsViewControl = require( 'CAPACITOR_LAB_BASICS/common/view/control/CapacitorLabBasicsViewControl' );
  var VoltmeterNode = require( 'CAPACITOR_LAB_BASICS/common/view/meters/VoltmeterNode' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var Path = require( 'SCENERY/nodes/Path' );
  var VoltmeterToolBoxPanel = require( 'CAPACITOR_LAB_BASICS/common/view/control/VoltmeterToolBoxPanel' );
  var CapacitanceBarMeterPanel = require( 'CAPACITOR_LAB_BASICS/capacitance/view/CapacitanceBarMeterPanel' );
  var KeyboardHelpPanel = require( 'CAPACITOR_LAB_BASICS/common/view/KeyboardHelpPanel' );
  var PlayAreaNode = require( 'CAPACITOR_LAB_BASICS/common/view/PlayAreaNode' );
  var Input = require( 'SCENERY/input/Input' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  // constants
  var DEBUG_SHAPES = false;
  
  // strings
  var screenCapacitanceLabelString = require( 'string!CAPACITOR_LAB_BASICS/screen.capacitanceLabel' );
  var screenCapacitanceDescriptionString = require( 'string!CAPACITOR_LAB_BASICS/screen.capacitanceDescription' );
  var accessiblePlayAreaLabelString = require( 'string!CAPACITOR_LAB_BASICS/accessible.playAreaLabel' );
  var accessibleCapacitancePlayAreaDescriptionString = require( 'string!CAPACITOR_LAB_BASICS/accessible.capacitancePlayAreaDescription' );

  /**
   * @param {CapacitorLabBasicsModel} model
   * @constructor
   */
  function CapacitanceScreenView( model ) {

    ScreenView.call( this );

    this.modelViewTransform = model.modelViewTransform;

    this.model = model; // @private

    // Maxima, for calibrating various view representations.
    var maxPlateCharge = model.getMaxPlateCharge();
    //var maxExcessDielectricPlateCharge = model.getMaxExcessDielectricPlateCharge();
    var maxEffectiveEField = model.getMaxEffectiveEField();
    //var eFieldReferenceMagnitude = model.getEFieldReferenceMagnitude();

    // circuit
    var capacitanceCircuitNode = new CapacitanceCircuitNode( model.circuit, this.modelViewTransform, model.plateChargesVisibleProperty,
      model.eFieldVisibleProperty, model.currentIndicatorsVisibleProperty, maxPlateCharge, maxEffectiveEField );

    // meters
    var voltmeterNode = new VoltmeterNode( model.voltmeter, this.modelViewTransform, model.voltmeterVisibleProperty );
    var voltmeterToolBoxPanel = new VoltmeterToolBoxPanel( voltmeterNode, this.modelViewTransform,
      model.voltmeter.inUserControlProperty, model.voltmeterVisibleProperty );

    // control
    // TODO: Layout calculations are messy, come back soon to clean up.
    //var minWidth = this.layoutBounds.right - capacitanceMeterNode.left;
    var capacitanceViewControl = new CapacitorLabBasicsViewControl( model, 0 );
    capacitanceViewControl.translation = this.layoutBounds.rightTop.minusXY( capacitanceViewControl.width + 10, -10 );
    voltmeterToolBoxPanel.rightTop = capacitanceViewControl.rightBottom.plusXY( 0, 20 );

    var capacitanceBarMeterPanel = new CapacitanceBarMeterPanel( model, capacitanceCircuitNode.width );
    capacitanceBarMeterPanel.leftBottom = capacitanceCircuitNode.topWireNode.leftTop.minusXY( 0, 60 );

    var resetAllButton = new ResetAllButton( {
      listener: function() { model.reset(); },
      bottom: this.layoutBounds.bottom - 20,
      right: this.layoutBounds.right - 30,
      radius: 25
    } );
    
    var keyboardHelpPanel = new KeyboardHelpPanel( model );
    keyboardHelpPanel.centerX = ( this.layoutBounds.right + this.layoutBounds.left ) / 2;
    keyboardHelpPanel.centerY = ( this.layoutBounds.top + this.layoutBounds.bottom ) / 2;

    // track user control of the voltmeter and place the voltmeter back in the tool box if bounds collide.
    model.voltmeter.inUserControlProperty.link( function( inUserControl ) {
      if ( !inUserControl && voltmeterToolBoxPanel.bounds.intersectsBounds( voltmeterNode.bounds.eroded( 40 ) ) ) {
        model.voltmeterVisibleProperty.set( false );
      }
    } );
    
    var playAreaNode = new PlayAreaNode( accessiblePlayAreaLabelString, accessibleCapacitancePlayAreaDescriptionString );
    // this.addChild( capacitanceCircuitNode );
    // this.addChild( voltmeterToolBoxPanel );
    // this.addChild( voltmeterNode );

    // rendering order - ensure that the playAreaHeading node is at the top
    this.addChild( playAreaNode );
    this.addChild( capacitanceCircuitNode );
    this.addChild( capacitanceBarMeterPanel );
    this.addChild( capacitanceViewControl );
    this.addChild( voltmeterToolBoxPanel );
    this.addChild( voltmeterNode );
    this.addChild( resetAllButton );
    this.addChild( keyboardHelpPanel );

    // debug shapes for probe collision testing, to be removed soon
    if ( DEBUG_SHAPES ) {
      var topTerminalNode = new Path( model.circuit.battery.shapeCreator.createPositiveTerminalShapeBody( model.circuit.battery.location ), {
        fill: 'rgba( 1, 0, 0, 0.5 )'
      } );
      this.addChild( topTerminalNode );
      // add a shape at the tip of the probe for debugging probe tip collisions.
      this.addChild( new Path( model.voltmeter.shapeCreator.getPositiveProbeTipShape(), {
          fill: 'rgba( 1, 0, 0, 0.5 )'
        } )
      );
      this.addChild( new Path( model.voltmeter.shapeCreator.getNegativeProbeTipShape(), {
          fill: 'rgba( 1, 0, 0, 0.5 )'
        } )
      );
    }
    
    // accessible content
    var activeElement = document.activeElement;
    var shiftKey = false;
    this.accessibleContent = {
      createPeer: function( accessibleInstance ) {

        // generate the 'supertype peer' for the ScreenView in the parallel DOM.
        var accessiblePeer = ScreenView.ScreenViewAccessiblePeer( accessibleInstance, screenCapacitanceDescriptionString, screenCapacitanceLabelString );

        // add a global event listener to all children of this screen view, bubbles through all children
        accessiblePeer.domElement.addEventListener( 'keydown', function( event ) {
          // 'global' event behavior in here...
          // keycode = 'h'
          if ( event.keyCode === 72 ) {
            model.keyboardHelpVisibleProperty.set( true );
            var panel = document.getElementById( keyboardHelpPanel.accessibleId );
            panel.focus();
          }
          else if ( event.keyCode === Input.KEY_TAB || event.keyCode === Input.KEY_ESCAPE ) {
            if ( model.keyboardHelpVisibleProperty.get() ) {
              if ( activeElement === document.body) {
                activeElement = document.getElementById( capacitanceCircuitNode.accessibleId );
                event.preventDefault();
              }
              if ( shiftKey ) {
                event.preventDefault();
              }
              activeElement.focus();
              model.keyboardHelpVisibleProperty.set( false );
            }
            activeElement = document.activeElement;
            shiftKey = event.shiftKey;
          }
        } );

        return accessiblePeer;
      }
    };

  }

  capacitorLabBasics.register( 'CapacitanceScreenView', CapacitanceScreenView );
  
  return inherit( ScreenView, CapacitanceScreenView );
} );