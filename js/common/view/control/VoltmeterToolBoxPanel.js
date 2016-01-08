// Copyright 2015, University of Colorado Boulder

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
  var AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );
  var CLConstants = require( 'CAPACITOR_LAB_BASICS/common/CLConstants' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  // strings
  var accessibleVoltmeterToolboxString = require( 'string!CAPACITOR_LAB_BASICS/accessible.voltmeterToolbox' );
  var accessibleVoltmeterToolboxDescriptionString = require( 'string!CAPACITOR_LAB_BASICS/accessible.voltmeterToolboxDescription' );
  var accessibleVoltmeterDescriptionString = require( 'string!CAPACITOR_LAB_BASICS/accessible.voltmeterDescription' );

  /**
   *
   * @param {VoltmeterNode} voltmeterNode
   * @param {CLModelViewTransform} modelViewTransform
   * @param {Property.<boolean>} inUserControlProperty
   * @param {Property.<boolean>} voltmeterVisibleProperty
   * @constructor
   */
  function VoltmeterToolBoxPanel( voltmeterNode, modelViewTransform, inUserControlProperty, voltmeterVisibleProperty ) {

    var thisToolBoxPanel = this;
    this.voltmeterNode = voltmeterNode; // @private

    // create the icon for the toolbox.
    var voltmeterIconNode = VoltmeterNode.VoltmeterIconNode();

    var toolBoxDragHandler = new SimpleDragHandler( {

      parentScreenView: null, // needed for coordinate transforms
      modelViewTransform: modelViewTransform,

      start: function( event ) {

        // pull the voltmeter out of the toolbox
        inUserControlProperty.set( true );
        voltmeterVisibleProperty.set( true );

        if ( !this.parentScreenView ) {
          // find the root parent screenView
          var testNode = thisToolBoxPanel;
          while ( testNode !== null ) {
            if ( testNode instanceof ScreenView ) {
              this.parentScreenView = testNode;
              break;
            }
            testNode = testNode.parents[ 0 ]; // Move up the scene graph by one level
          }
          assert && assert( this.parentScreenView, 'unable to find parent screen view' );
        }

        // initial position of the pointer in the screenView coordinates
        var initialPosition = this.parentScreenView.globalToLocalPoint( event.pointer.point );

        // make sure that the center of the voltmeter body is offset for the
        var offsetPosition = new Vector2( -voltmeterNode.bodyNode.width / 2, -voltmeterNode.bodyNode.height / 2 );

        // position of the  electricPotential sensor in ScreenView coordinates
        var voltmeterBodyPosition = initialPosition.plus( offsetPosition );
        voltmeterNode.bodyNode.bodyLocationProperty.set( modelViewTransform.viewToModelPosition( voltmeterBodyPosition ) );
      },

      end: function( event ) {
        // if the bounds of the voltmeter body intersects the tool box
        if ( thisToolBoxPanel.bounds.intersectsBounds( voltmeterNode.bodyNode.bounds.eroded( 40 ) ) ) {
          voltmeterVisibleProperty.set( false );
        }
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
      yMargin: 15,
      fill: CLConstants.METER_PANEL_FILL,
      accessibleContent: {
        createPeer: function( accessibleInstance ) {
          var trail = accessibleInstance.trail;
          var topElement = document.createElement( 'div' );

          var label = document.createElement( 'h3' );
          label.textContent = accessibleVoltmeterToolboxString;
          label.id = 'toolbox-label-' + trail.getUniqueId();
          topElement.appendChild( label );

          var description = document.createElement( 'p' );
          description.textContent = accessibleVoltmeterToolboxDescriptionString;
          description.id = 'toolbox-description-' + trail.getUniqueId();
          topElement.appendChild( description );

          topElement.setAttribute( 'aria-describedby', description.id );
          topElement.setAttribute( 'aria-labeledby', label.id );

          topElement.tabIndex = '-1';

          var domElement = document.createElement( 'input' );
          domElement.value = accessibleVoltmeterDescriptionString;
          domElement.type = 'button';
          topElement.appendChild( domElement );

          domElement.tabIndex = '0';

          domElement.addEventListener( 'click', function() {
            inUserControlProperty.set( !inUserControlProperty.get() );
            voltmeterVisibleProperty.set( !voltmeterVisibleProperty.get() );

            var tab = '0';
            if ( !inUserControlProperty.get() ) {
              tab = '-1';
            }
            // add the voltmeter to the tab order.
            var bodyElementId = thisToolBoxPanel.voltmeterNode.bodyNode.accessibleVoltmeterBodyId;
            var bodyElement = document.getElementById( bodyElementId );
            bodyElement.tabIndex = tab;

            var redProbeId = thisToolBoxPanel.voltmeterNode.positiveProbeNode.accessibleProbeId;
            var redProbe = document.getElementById( redProbeId );
            redProbe.tabIndex = tab;
            var blackProbeId = thisToolBoxPanel.voltmeterNode.negativeProbeNode.accessibleProbeId;
            var blackProbe = document.getElementById( blackProbeId );
            blackProbe.tabIndex = tab;

            // set focus immediately to the voltmeter body
            if ( inUserControlProperty.get() ) {
              bodyElement.focus();
            }
          } );

          var accessiblePeer = new AccessiblePeer( accessibleInstance, topElement );
          topElement.id = accessiblePeer.id + '-description';
          domElement.id = accessiblePeer.id;
          return accessiblePeer;
        }
      }
    } );

    voltmeterVisibleProperty.link( function( voltmeterVisible ) {
      voltmeterIconNode.visible = !voltmeterVisible;
    } );

  }

  capacitorLabBasics.register( 'VoltmeterToolBoxPanel', VoltmeterToolBoxPanel );

  return inherit( Panel, VoltmeterToolBoxPanel );
} );