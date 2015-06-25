// Copyright 2002-2015, University of Colorado Boulder

/**
 * Circuit control panel for Capacitor Lab: Basics.  Controls how the circuit is connected to the battery and the
 * lightBulb.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Image = require( 'SCENERY/nodes/Image' );
  var CircuitConnectionEnum = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitConnectionEnum' );
  var BulbNode = require( 'CAPACITOR_LAB_BASICS/common/view/BulbNode' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );

  // images
  var batteryImage = require( 'image!SCENERY_PHET/battery-D-cell.png' );

  function CircuitControlPanel( circuitModel ) {


    var connectionButtonGroupComponents = [
      {
        value: CircuitConnectionEnum.BATTERY_CONNECTED,
        node: new Image( batteryImage, { scale: 0.75, rotation: -Math.PI / 2 } )
      }, {
        value: CircuitConnectionEnum.LIGHT_BULB_CONNECTED,
        node: BulbNode.createBulb( { scale: 0.75, rotation: Math.PI / 2 } )
      }, {
        value: CircuitConnectionEnum.OPEN_CIRCUIT,
        node: new Text( "Open Circuit", { font: new PhetFont( 15 ), rotation: Math.PI / 4 } ) // TODO: PLACEHOLDER FOR OPEN CIRCUIT ICON.
      }
    ];

    RadioButtonGroup.call( this, circuitModel.circuitConnectionProperty, connectionButtonGroupComponents, {
      buttonContentXMargin: 20,
      buttonContentYMargin: 4,
      orientation: 'horizontal',
      baseColor: 'white', // lavender-ish
      selectedLineWidth: 3,
      deselectedLineWidth: 1
    } );
  }

  return inherit( RadioButtonGroup, CircuitControlPanel );

} );