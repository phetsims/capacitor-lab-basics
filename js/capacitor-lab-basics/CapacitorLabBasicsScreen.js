// Copyright 2002-2015, University of Colorado Boulder

/**
 *
 * @author Emily Randall
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var CapacitorLabBasicsModel = require( 'CAPACITOR_LAB_BASICS/capacitor-lab-basics/model/CapacitorLabBasicsModel' );
  var CapacitorLabScreenView = require( 'CAPACITOR_LAB_BASICS/capacitor-lab-basics/view/CapacitorLabBasicsScreenView' );
  var CLModelViewTransform3D = require( 'CAPACITOR_LAB_BASICS/common/model/CLModelViewTransform3D' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var capacitorLabSimString = require( 'string!CAPACITOR_LAB_BASICS/capacitor-lab-basics.name' );

  /**
   * @constructor
   */
  function CapacitorLabScreen() {

    // If there are multiple screens, then the icon must be provided here.
    var icon = null;

    Screen.call( this, capacitorLabSimString, icon,
      function() { return new CapacitorLabBasicsModel( new CLModelViewTransform3D() ); },
      function( model ) { return new CapacitorLabScreenView( model ); },
      { backgroundColor: '#9ddcf8' }
    );

  }

  return inherit( Screen, CapacitorLabScreen );
} );