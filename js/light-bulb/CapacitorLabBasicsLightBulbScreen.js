// Copyright 2002-2015, University of Colorado Boulder

/**
 * LightBulb screen for the Capacitor Lab Basics sim.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var CapacitorLabBasicLightBulbsModel = require( 'CAPACITOR_LAB_BASICS/light-bulb/model/CapacitorLabBasicsLightBulbModel' );
  var CapacitorLabBasicsLightBulbScreenView = require( 'CAPACITOR_LAB_BASICS/light-bulb/view/CapacitorLabBasicsLightBulbScreenView' );
  var CLModelViewTransform3D = require( 'CAPACITOR_LAB_BASICS/common/model/CLModelViewTransform3D' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var capacitorLabBasicsLightBulbTitle = require( 'string!CAPACITOR_LAB_BASICS/lightBulb.title' );

  /**
   * @constructor
   */
  function CapacitorLabBasicsLightBulbScreen() {

    // TODO: Icons need to be created for this sim.
    var icon = new Rectangle( 0, 0, 548, 373, { fill: 'blue' } );

    Screen.call( this, capacitorLabBasicsLightBulbTitle, icon,
      function() { return new CapacitorLabBasicLightBulbsModel( new CLModelViewTransform3D() ); },
      function( model ) { return new CapacitorLabBasicsLightBulbScreenView( model ); },
      { backgroundColor: '#ECFFF5' }
    );

  }

  return inherit( Screen, CapacitorLabBasicsLightBulbScreen );
} );