// Copyright 2015, University of Colorado Boulder

/**
 * LightBulb screen for the Capacitor Lab Basics sim.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var CLBLightBulbModel = require( 'CAPACITOR_LAB_BASICS/light-bulb/model/CLBLightBulbModel' );
  var CLBLightBulbScreenView = require( 'CAPACITOR_LAB_BASICS/light-bulb/view/CLBLightBulbScreenView' );
  var CLBModelViewTransform3D = require( 'CAPACITOR_LAB_BASICS/common/model/CLBModelViewTransform3D' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Screen = require( 'JOIST/Screen' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  // strings
  var lightBulbTitleString = require( 'string!CAPACITOR_LAB_BASICS/lightBulb.title' );

  /**
   * @constructor
   */
  function CLBLightBulbScreen( tandem ) {

    // TODO: Icons need to be created for this sim.
    var icon = new Rectangle( 0, 0, 548, 373, { fill: 'blue' } );

    Screen.call( this, lightBulbTitleString, icon,
      function() { return new CLBLightBulbModel( new CLBModelViewTransform3D() ); },
      function( model ) { return new CLBLightBulbScreenView( model, tandem.createTandem( 'view' ) ); }, {
        backgroundColor: 'rgb( 194, 227, 255 )',
        tandem: tandem
      }
    );

  }

  capacitorLabBasics.register( 'CLBLightBulbScreen', CLBLightBulbScreen );

  return inherit( Screen, CLBLightBulbScreen );
} );