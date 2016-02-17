// Copyright 2015, University of Colorado Boulder

/**
 * Panel which holds the bar meters and associated check boxes which control bar meter visibility.
 *
 * This panel uses several layout boxes to achieve the desired alignment.  The meter value nodes are aligned to the
 * right while the bar meters are aligned to the left.  The checkboxes are also aligned to the left.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var CLConstants = require( 'CAPACITOR_LAB_BASICS/common/CLConstants' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Panel = require( 'SUN/Panel' );
  var CheckBox = require( 'SUN/CheckBox' );
  var BarMeterNode = require( 'CAPACITOR_LAB_BASICS/common/view/meters/BarMeterNode' );
  var Vector2 = require( 'DOT/Vector2' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );
  var Input = require( 'SCENERY/input/Input' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  // constants
  var CHECKBOX_VERTICAL_SPACING = 28;
  var VALUE_FONT = new PhetFont( 15 );
  var VALUE_COLOR = 'black';

  // strings
  var capacitanceString = require( 'string!CAPACITOR_LAB_BASICS/capacitance' );
  var storedEnergyString = require( 'string!CAPACITOR_LAB_BASICS/storedEnergy' );
  var plateChargeString = require( 'string!CAPACITOR_LAB_BASICS/plateCharge' );
  var accessibleGraphCheckboxString = require( 'string!CAPACITOR_LAB_BASICS/accessible.graphCheckbox' );
  var accessibleGraphPanelString = require( 'string!CAPACITOR_LAB_BASICS/accessible.graphPanel' );
  var accessibleGraphPanelLabelString = require( 'string!CAPACITOR_LAB_BASICS/accessible.graphPanelLabel' );

  /**
   * Constructor.
   *
   * @param {array.<BarMeter>} model
   * @param {Property.<boolean>} minWidth
   * @constructor
   */
  function BarMeterPanel( model, minWidth ) {

    var thisPanel = this;

    var parentNode = new Node(); // node that will contain all check boxes and bar meter nodes

    // create the bar meter nodes with their text values.
    var meterNodes = new Node();
    var tabIndex = '-1';
    var capacitanceMeterNode = BarMeterNode.CapacitanceBarMeterNode( model.capacitanceMeter, tabIndex );
    var plateChargeMeterNode = BarMeterNode.PlateChargeBarMeterNode( model.plateChargeMeter, tabIndex );
    var storedEnergyMeterNode = BarMeterNode.StoredEnergyBarMeterNode( model.storedEnergyMeter, tabIndex );
    meterNodes.children = [ capacitanceMeterNode, plateChargeMeterNode, storedEnergyMeterNode ];

    // create checkboxes for each meter node
    var checkBoxNodes = new Node();
    var fontOptions = { font: VALUE_FONT, fill: VALUE_COLOR };

    var capacitanceTitle = new Text( capacitanceString, fontOptions );
    var capacitanceCheckBox = new CheckBox( capacitanceTitle, model.capacitanceMeterVisibleProperty, {
      accessibleLabel: StringUtils.format( accessibleGraphCheckboxString, capacitanceString ),
      tabIndex: tabIndex
    } );

    var plateChargeTitle = new Text( plateChargeString, fontOptions );
    var plateChargeCheckBox = new CheckBox( plateChargeTitle, model.plateChargeMeterVisibleProperty, {
      accessibleLabel: StringUtils.format( accessibleGraphCheckboxString, plateChargeString ),
      tabIndex: tabIndex
    } );

    var storedEnergyTitle = new Text( storedEnergyString, fontOptions );
    var storedEnergyCheckBox = new CheckBox( storedEnergyTitle, model.storedEnergyMeterVisibleProperty, {
      accessibleLabel: StringUtils.format( accessibleGraphCheckboxString, storedEnergyString ),
      tabIndex: tabIndex
    } );

    checkBoxNodes.children = [ capacitanceCheckBox, plateChargeCheckBox, storedEnergyCheckBox ];

    parentNode.children = [ checkBoxNodes, meterNodes ];

    // layout
    var x = 0;
    var y = 0;

    // check boxes aligned vertically, centered left
    capacitanceCheckBox.translation = new Vector2( 0, 0 );
    plateChargeCheckBox.translation = new Vector2( 0, CHECKBOX_VERTICAL_SPACING );
    storedEnergyCheckBox.translation = new Vector2( 0, 2 * CHECKBOX_VERTICAL_SPACING );

    x = capacitanceCheckBox.right + capacitanceMeterNode.valueNode.width + 40;
    y = capacitanceCheckBox.centerY + 2;
    capacitanceMeterNode.axisLine.translation = new Vector2( x, y );

    x = capacitanceMeterNode.axisLine.x;
    y = plateChargeCheckBox.centerY + 2;
    plateChargeMeterNode.axisLine.translation = new Vector2( x, y );

    y = storedEnergyCheckBox.centerY + 2;
    storedEnergyMeterNode.axisLine.translation = new Vector2( x, y );

    Panel.call( this, parentNode, {
      fill: CLConstants.METER_PANEL_FILL,
      minWidth: minWidth,
      align: 'left',
      xMargin: 10,
      yMargin: 10
    } );

    // add the accessible content
    this.accessibleContent = {
      createPeer: function( accessibleInstance ) {
        var trail = accessibleInstance.trail;
        var uniqueId = trail.getUniqueId();

        var domElement = document.createElement( 'div' );
        
        var label = document.createElement( 'h2' );
        label.textContent = accessibleGraphPanelLabelString;
        label.id = 'panel-label-' + uniqueId;
        domElement.appendChild( label );

        var description = document.createElement( 'p' );
        description.textContent = accessibleGraphPanelString;
        description.id = 'panel-description-' + uniqueId;
        domElement.appendChild( description );

        domElement.setAttribute( 'aria-describedby', description.id );
        domElement.setAttribute( 'aria-labeledby', label.id );

        domElement.tabIndex = '0';

        domElement.addEventListener( 'keydown', function( event ) {
          var keyCode = event.keyCode;
          var firstElem;
          if ( keyCode === Input.KEY_ENTER ) {
            setTabIndex( '0' );
            firstElem = capacitanceCheckBox.accessibleInstances[0].peer.domElement;
            firstElem.focus();
          }
          else if ( keyCode === Input.KEY_ESCAPE ) {
            domElement.focus();
            setTabIndex( '-1' );
          }
          else if ( keyCode === Input.KEY_TAB ) {
            var lastElem = document.getElementById( storedEnergyMeterNode.accessibleId );
            firstElem = capacitanceCheckBox.accessibleInstances[0].peer.domElement;            
            if ( document.activeElement === lastElem && !event.shiftKey ) {
              event.preventDefault();
              firstElem.focus();
            }
            if ( document.activeElement === firstElem && event.shiftKey ) {
              event.preventDefault();
              lastElem.focus();
            }
          }
        } );

        var accessiblePeer = new AccessiblePeer( accessibleInstance, domElement );
        domElement.id = accessiblePeer.id;
        return accessiblePeer;

      }
    };

    // link visibility to the model property
    model.barGraphsPanelVisibleProperty.link( function( barGraphsPanelVisible ) {
      thisPanel.visible = barGraphsPanelVisible;
    } );

    var setTabIndex = function( tabIndex ) {
      meterNodes.children.forEach( function( meter ) {
        var element = document.getElementById( meter.accessibleId );
        if ( element ) {
          element.tabIndex = tabIndex;
        }
      } );
      checkBoxNodes.children.forEach( function( checkbox ) {
        var element = checkbox.accessibleInstances[0].peer.domElement;
        if ( element ) {
          element.tabIndex = tabIndex;
        }
      } );
    };

  }

  capacitorLabBasics.register( 'BarMeterPanel', BarMeterPanel );
  
  return inherit( Panel, BarMeterPanel );

} );