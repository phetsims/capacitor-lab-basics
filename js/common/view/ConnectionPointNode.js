// Copyright 2002-2015, University of Colorado Boulder

/**
 * Visual representation of a connection point on the circuit.  This is a black circle with input handling.  Clicking
 * on a connection point will set the circuit connection.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );

  // strings
  var accessibleSwitchToBatteryString = require( 'string!CAPACITOR_LAB_BASICS/accessible.switchToBattery' );
  var accessibleSwitchToCenterString = require( 'string!CAPACITOR_LAB_BASICS/accessible.switchToCenter' );
  var accessibleSwitchToLightbulbString = require( 'string!CAPACITOR_LAB_BASICS/accessible.switchToLightbulb' );

  // constants
  var CONNECTION_POINT_RADIUS = 6;

  // colors
  var DISCONNECTED_POINT_COLOR = 'rgb( 151, 208, 255 )';
  var DISCONNECTED_POINT_STROKE = PhetColorScheme.RED_COLORBLIND;
  var CONNECTION_POINT_HIGHLIGHTED = 'yellow';

  /**
   * Constructor for the ConnectionPointNode.
   *
   * @param {string} connectionType
   * @param {Property} circuitConnectionProperty
   * @param {Object} options
   * @constructor
   */
  function ConnectionPointNode( connectionType, circuitConnectionProperty, options ) {

    options = _.extend( {
      fill: DISCONNECTED_POINT_COLOR,
      lineWidth: 2,
      lineDash: [ 3, 3 ],
      stroke: DISCONNECTED_POINT_STROKE
    } );
    Circle.call( this, CONNECTION_POINT_RADIUS, options );
    var thisNode = this;
    this.cursor = 'pointer';

    function resetPinColors() {
      thisNode.fill = DISCONNECTED_POINT_COLOR;
      thisNode.stroke = DISCONNECTED_POINT_STROKE;
    }

    // link pin style properties to the circuit connection. Needs to be done in addition to the button listener so that
    // all connection points update when a single connection point is interacted with.
    circuitConnectionProperty.link( function( circuitConnection ) {
      resetPinColors();
    } );

    // Add input listener to set circuit state.
    this.addInputListener( new ButtonListener( {
      over: function( event ) {
        thisNode.fill = CONNECTION_POINT_HIGHLIGHTED;
      },
      up: function( event ) {
        resetPinColors();
      },
      down: function( event ) {
        circuitConnectionProperty.set( connectionType );
      }
    } ) );

    // add the accessible content
    this.accessibleContent = {
      createPeer: function( accessibleInstance ) {
        var domElement = document.createElement( 'input' );
        if ( connectionType === 'BATTERY_CONNECTED' ) {
          domElement.value = accessibleSwitchToBatteryString;
        }
        else if ( connectionType === 'OPEN_CIRCUIT' ) {
          domElement.value = accessibleSwitchToCenterString;
        }
        else {
          domElement.value = accessibleSwitchToLightbulbString;
        }
        domElement.type = 'button';

        domElement.tabIndex = '0';

        domElement.addEventListener( 'click', function() {
          circuitConnectionProperty.set( connectionType );
        } );

        var accessiblePeer = new AccessiblePeer( accessibleInstance, domElement );
        domElement.id = accessiblePeer.id;
        return accessiblePeer;

      }
    };
  }

  return inherit( Circle, ConnectionPointNode, {} );

} );