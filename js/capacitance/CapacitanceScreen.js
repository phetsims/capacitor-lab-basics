// Copyright 2015, University of Colorado Boulder

/**
 * Capacitance screen for the Capacitor Lab Basics sim.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var CapacitanceModel = require( 'CAPACITOR_LAB_BASICS/capacitance/model/CapacitanceModel' );
  var CapacitanceScreenView = require( 'CAPACITOR_LAB_BASICS/capacitance/view/CapacitanceScreenView' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CLBModelViewTransform3D = require( 'CAPACITOR_LAB_BASICS/common/model/CLBModelViewTransform3D' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var Image = require('SCENERY/nodes/Image');
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var capacitanceTitleString = require( 'string!CAPACITOR_LAB_BASICS/capacitance.title' );

  // images
  var capacitorIconImage = require( 'image!CAPACITOR_LAB_BASICS/capacitor-icon.png' );

  /**
   * @param {Property.<boolean>} switchUsedProperty - whether switch has been changed by user. Affects both screens.
   * @param {Tandem} tandem
   * @constructor
   */
  function CapacitanceScreen( switchUsedProperty, tandem ) {

    var icon = new Image( capacitorIconImage );
    icon.scale( 1.4, 1.0 );

    Screen.call( this, capacitanceTitleString, icon,
      function() { return new CapacitanceModel( switchUsedProperty, new CLBModelViewTransform3D(), tandem.createTandem( 'model' ) ); },
      function( model ) { return new CapacitanceScreenView( model, tandem.createTandem( 'view' ) ); }, {
        backgroundColor: CLBConstants.SCREEN_VIEW_BACKGROUND_COLOR,
        tandem: tandem
      }
    );

  }

  capacitorLabBasics.register( 'CapacitanceScreen', CapacitanceScreen );

  return inherit( Screen, CapacitanceScreen );
} );