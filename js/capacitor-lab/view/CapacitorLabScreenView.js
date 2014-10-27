//  Copyright 2002-2014, University of Colorado Boulder

/**
 *
 * @author Emily Randall
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var BatteryNode = require( 'CAPACITOR_LAB/capacitor-lab/view/BatteryNode' );

  /**
   * @param {CapacitorLabModel} capacitorLabModel
   * @constructor
   */
  function CapacitorLabScreenView( capacitorLabModel ) {

    ScreenView.call( this );

    // Create and add the Reset All Button in the bottom right, which resets the model
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        capacitorLabModel.reset();
      },
      right: this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );
    this.addChild( resetAllButton );
    
    var batteryNode = new BatteryNode( capacitorLabModel, {
      x: -this.layoutBounds.maxX / 2,
      y: -this.layoutBounds.maxY / 4
    } );
    this.addChild( batteryNode );
  }

  return inherit( ScreenView, CapacitorLabScreenView, {

    // Called by the animation loop. Optional, so if your view has no animation, you can omit this.
    step: function( dt ) {
      // Handle view animation here.
    }
  } );
} );