// Copyright 2002-2015, University of Colorado Boulder

/**
 * Button that connects/disconnects the battery from the capacitor. Origin at upper-left of bounding rectangle.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var connectBatteryString = require( 'string!CAPACITOR_LAB_BASICS/connectBattery' );
  var disconnectBatteryString = require( 'string!CAPACITOR_LAB_BASICS/disconnectBattery' );

  /**
   *
   * @param { SingleCircuit } circuit
   * @constructor
   */
  function BatteryConnectionButtonNode( circuit ) {

    var buttonContent = new Text( this.getText( circuit.batteryConnected ), { font: new PhetFont( 20 ) } );
    var thisButton = this;

    RectangularPushButton.call( this, {
      baseColor: 'white',
      content: buttonContent,
      listener: function() {
        circuit.setBatteryConnected( !circuit.batteryConnected ); // toggle battery connectivity when pressed
        buttonContent.setText( thisButton.getText( circuit.batteryConnected ) );
      }
    } );
  }

  return inherit( RectangularPushButton, BatteryConnectionButtonNode, {

    /**
     * Get the appropriate text label for the button given the current circuit state.
     *
     * @param {boolean} isBatteryConnected
     * @returns {string}
     */
    getText: function( isBatteryConnected ) {
      return isBatteryConnected ? disconnectBatteryString : connectBatteryString;
    }

  } );
} );
