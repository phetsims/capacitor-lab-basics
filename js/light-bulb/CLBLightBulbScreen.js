// Copyright 2015-2019, University of Colorado Boulder

/**
 * LightBulb screen for the Capacitor Lab Basics sim.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BulbNode = require( 'CAPACITOR_LAB_BASICS/common/view/BulbNode' );
  const capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  const CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  const CLBLightBulbModel = require( 'CAPACITOR_LAB_BASICS/light-bulb/model/CLBLightBulbModel' );
  const CLBLightBulbScreenView = require( 'CAPACITOR_LAB_BASICS/light-bulb/view/CLBLightBulbScreenView' );
  const YawPitchModelViewTransform3 = require( 'SCENERY_PHET/capacitor/YawPitchModelViewTransform3' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );
  const ScreenIcon = require( 'JOIST/ScreenIcon' );

  // strings
  const screenLightBulbString = require( 'string!CAPACITOR_LAB_BASICS/screen.lightBulb' );

  /**
   * @constructor
   *
   * @param {Property.<boolean>} switchUsedProperty - whether switch has been changed by user. Affects both screens.
   * @param {Tandem} tandem
   */
  function CLBLightBulbScreen( switchUsedProperty, tandem ) {

    const iconNode = new BulbNode.createBulbIcon();
    iconNode.rotate( -Math.PI / 2 );
    const icon = new ScreenIcon( iconNode, {
      fill: CLBConstants.SCREEN_VIEW_BACKGROUND_COLOR
    } );

    const options = {
      name: screenLightBulbString,
      backgroundColorProperty: new Property( CLBConstants.SCREEN_VIEW_BACKGROUND_COLOR ),
      homeScreenIcon: icon,
      tandem: tandem
    };

    Screen.call( this,
      function() {
        return new CLBLightBulbModel( switchUsedProperty, new YawPitchModelViewTransform3(), tandem.createTandem( 'model' ) );
      },
      function( model ) {
        return new CLBLightBulbScreenView( model, tandem.createTandem( 'view' ) );
      },
      options );
  }

  capacitorLabBasics.register( 'CLBLightBulbScreen', CLBLightBulbScreen );

  return inherit( Screen, CLBLightBulbScreen );
} );
