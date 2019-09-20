// Copyright 2015-2019, University of Colorado Boulder

/**
 * Capacitance screen for the Capacitor Lab Basics sim.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const CapacitanceModel = require( 'CAPACITOR_LAB_BASICS/capacitance/model/CapacitanceModel' );
  const CapacitanceScreenView = require( 'CAPACITOR_LAB_BASICS/capacitance/view/CapacitanceScreenView' );
  const capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  const CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  const CLBModelViewTransform3D = require( 'CAPACITOR_LAB_BASICS/common/model/CLBModelViewTransform3D' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );

  // strings
  const screenCapacitanceString = require( 'string!CAPACITOR_LAB_BASICS/screen.capacitance' );

  // images
  const capacitorIconImage = require( 'mipmap!CAPACITOR_LAB_BASICS/capacitance_screen_icon.png' );

  /**
   * @constructor
   *
   * @param {Property.<boolean>} switchUsedProperty - whether switch has been changed by user. Affects both screens.
   * @param {Tandem} tandem
   */
  function CapacitanceScreen( switchUsedProperty, tandem ) {

    const options = {
      name: screenCapacitanceString,
      backgroundColorProperty: new Property( CLBConstants.SCREEN_VIEW_BACKGROUND_COLOR ),
      homeScreenIcon: new Image( capacitorIconImage ),
      tandem: tandem
    };

    Screen.call( this,
      function() { return new CapacitanceModel( switchUsedProperty, new CLBModelViewTransform3D(), tandem.createTandem( 'model' ) ); },
      function( model ) { return new CapacitanceScreenView( model, tandem.createTandem( 'view' ) ); },
      options );
  }

  capacitorLabBasics.register( 'CapacitanceScreen', CapacitanceScreen );

  return inherit( Screen, CapacitanceScreen );
} );
