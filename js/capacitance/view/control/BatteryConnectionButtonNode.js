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
  var Node = require( 'SCENERY/nodes/Node' );
  var CircuitConnectionEnum = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitConnectionEnum' );

  // strings
  var connectBatteryString = require( 'string!CAPACITOR_LAB_BASICS/connectBattery' );
  var disconnectBatteryString = require( 'string!CAPACITOR_LAB_BASICS/disconnectBattery' );

  /**
   * Constructor for the BatteryConnectionButtonNode.
   *
   * @param {SingleCircuit} circuit
   * @constructor
   */
  function BatteryConnectionButtonNode( circuit ) {

    Node.call( this );

    var connectButtonContent = new Text( connectBatteryString, { font: new PhetFont( 20 ) } );
    var disconnectButtonContent = new Text( disconnectBatteryString, { font: new PhetFont( 20 ) } );

    // create the button that connects the battery to the circuit and toggles visibility of disconnect button.
    var connectBatteryButton = new RectangularPushButton( {
      baseColor: 'white',
      content: connectButtonContent,
      listener: function() {
        circuit.circuitConnection = CircuitConnectionEnum.BATTERY_CONNECTED; // connect the battery to the circuit.
      }
    } );

    // create the button that disconects that battery from the circuit and toggles visibility of the connect button.
    var disconnectBatteryButton = new RectangularPushButton( {
      baseColor: 'white',
      content: disconnectButtonContent,
      listener: function() {
        circuit.circuitConnection = CircuitConnectionEnum.OPEN_CIRCUIT;
      }
    } );

    // toggle which button is visible.
    circuit.circuitConnectionProperty.link( function( circuitConnection ) {
      connectBatteryButton.visible = ( circuitConnection === CircuitConnectionEnum.OPEN_CIRCUIT);
      disconnectBatteryButton.visible = ( circuitConnection === CircuitConnectionEnum.BATTERY_CONNECTED );
    } );

    this.addChild( connectBatteryButton );
    this.addChild( disconnectBatteryButton );

  }

  return inherit( Node, BatteryConnectionButtonNode, {

    /**
     * Get the appropriate text label for the button given the current circuit state.
     *
     * // TODO: Not in use at the moment.  If we consolidate to one button later, we could use this helper function.
     *
     * @param {boolean} isBatteryConnected
     * @returns {string}
     */
    //getText: function( isBatteryConnected ) {
    //  return isBatteryConnected ? disconnectBatteryString : connectBatteryString;
    //}
  } );
} );
