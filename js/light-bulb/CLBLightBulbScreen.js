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
  var Screen = require( 'JOIST/Screen' );
  var ScreenIcon = require( 'JOIST/ScreenIcon' );
  var BulbNode = require( 'CAPACITOR_LAB_BASICS/common/view/BulbNode' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  // strings
  var lightBulbTitleString = require( 'string!CAPACITOR_LAB_BASICS/lightBulb.title' );

  /**
   * @param {Property.<boolean>} switchUsedProperty - whether switch has been changed by user. Affects both screens.
   * @param {Tandem} tandem
   * @constructor
   */
  function CLBLightBulbScreen( switchUsedProperty, tandem ) {

    var iconNode = new BulbNode.createBulb();
    iconNode.rotate( -Math.PI / 2 );
    var icon = new ScreenIcon( iconNode, {
      fill: CLBConstants.SCREEN_VIEW_BACKGROUND_COLOR
    } );

    Screen.call( this, lightBulbTitleString, icon,
      function() {
        return new CLBLightBulbModel( switchUsedProperty, new CLBModelViewTransform3D(), tandem.createTandem( 'model' ) ); },
      function( model ) {
        return new CLBLightBulbScreenView( model, tandem.createTandem( 'view' ) ); }, {
        backgroundColor: CLBConstants.SCREEN_VIEW_BACKGROUND_COLOR,
        tandem: tandem
      }
    );

  }

  capacitorLabBasics.register( 'CLBLightBulbScreen', CLBLightBulbScreen );

  return inherit( Screen, CLBLightBulbScreen );
} );

