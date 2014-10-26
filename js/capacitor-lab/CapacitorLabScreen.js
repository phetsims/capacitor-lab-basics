//  Copyright 2002-2014, University of Colorado Boulder

/**
 *
 * @author Emily Randall
 */
define( function( require ) {
  'use strict';

  // modules
  var CapacitorLabModel = require( 'CAPACITOR_LAB/capacitor-lab/model/CapacitorLabModel' );
  var CapacitorLabScreenView = require( 'CAPACITOR_LAB/capacitor-lab/view/CapacitorLabScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var capacitorLabSimString = require( 'string!CAPACITOR_LAB/capacitor-lab.name' );

  /**
   * @constructor
   */
  function CapacitorLabScreen() {

    //If this is a single-screen sim, then no icon is necessary.
    //If there are multiple screens, then the icon must be provided here.
    var icon = null;

    Screen.call( this, capacitorLabSimString, icon,
      function() { return new CapacitorLabModel(); },
      function( model ) { return new CapacitorLabScreenView( model ); },
      { backgroundColor: 'white' }
    );
  }

  return inherit( Screen, CapacitorLabScreen );
} );