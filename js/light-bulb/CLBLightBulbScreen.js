// Copyright 2015-2018, University of Colorado Boulder

/**
 * LightBulb screen for the Capacitor Lab Basics sim.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var BulbNode = require( 'CAPACITOR_LAB_BASICS/common/view/BulbNode' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var CLBLightBulbModel = require( 'CAPACITOR_LAB_BASICS/light-bulb/model/CLBLightBulbModel' );
  var CLBLightBulbScreenView = require( 'CAPACITOR_LAB_BASICS/light-bulb/view/CLBLightBulbScreenView' );
  var CLBModelViewTransform3D = require( 'CAPACITOR_LAB_BASICS/common/model/CLBModelViewTransform3D' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );
  var ScreenIcon = require( 'JOIST/ScreenIcon' );

  // strings
  var screenLightBulbString = require( 'string!CAPACITOR_LAB_BASICS/screen.lightBulb' );

  /**
   * @constructor
   *
   * @param {Property.<boolean>} switchUsedProperty - whether switch has been changed by user. Affects both screens.
   * @param {Tandem} tandem
   */
  function CLBLightBulbScreen( switchUsedProperty, tandem ) {

    var iconNode = new BulbNode.createBulbIcon();
    iconNode.rotate( -Math.PI / 2 );
    var icon = new ScreenIcon( iconNode, {
      fill: CLBConstants.SCREEN_VIEW_BACKGROUND_COLOR
    } );

    var options = {
      name: screenLightBulbString,
      backgroundColorProperty: new Property( CLBConstants.SCREEN_VIEW_BACKGROUND_COLOR ),
      homeScreenIcon: icon,
      tandem: tandem
    };

    Screen.call( this,
      function() {
        return new CLBLightBulbModel( switchUsedProperty, new CLBModelViewTransform3D(), tandem.createTandem( 'model' ) );
      },
      function( model ) {
        return new CLBLightBulbScreenView( model, tandem.createTandem( 'view' ) );
      },
      options );
  }

  capacitorLabBasics.register( 'CLBLightBulbScreen', CLBLightBulbScreen );

  return inherit( Screen, CLBLightBulbScreen );
} );
