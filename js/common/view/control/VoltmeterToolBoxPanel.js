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
  var inherit = require( 'PHET_CO' + 'RE/inherit' );
  var VoltmeterNode = require( 'CAPACITOR_LAB_BASICS/common/view/meters/VoltmeterNode' );
  var Panel = require( 'SUN/Panel' );

  function VoltmeterToolBoxPanel() {

    var voltmeterIconNode = VoltmeterNode.VoltmeterIconNode();

    // TODO: Add drag handlers here for popping the voltmeter on and off the screenview.

    Panel.call( this, voltmeterIconNode, {
      xMargin: 15,
      yMargin: 15
    } );

  }

  return inherit( Panel, VoltmeterToolBoxPanel );


} );