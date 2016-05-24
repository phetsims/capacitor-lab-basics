// Copyright 2015, University of Colorado Boulder

/**
 * Intro screen for the Capacitor Lab Basics sim.
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
  var Image = require('SCENERY/nodes/Image');
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var capacitanceTitleString = require( 'string!CAPACITOR_LAB_BASICS/capacitance.title' );

  // images
  var capacitorIconImage = require( 'image!CAPACITOR_LAB_BASICS/capacitor-icon.png' );

  /**
   * @param {Tandem} tandem
   * @constructor
   */
  function CapacitanceScreen( tandem ) {

    var icon = new Image( capacitorIconImage );
    icon.scale( 1.4, 1.0 );

    Screen.call( this, capacitanceTitleString, icon,
      function() { return new CapacitanceModel( new CLBModelViewTransform3D(), tandem.createTandem( 'model' ) ); },
      function( model ) { return new CapacitanceScreenView( model, tandem.createTandem( 'view' ) ); }, {
        backgroundColor: 'rgb( 194, 227, 255 )',
        tandem: tandem
      }
    );

  }

  capacitorLabBasics.register( 'CapacitanceScreen', CapacitanceScreen );

  return inherit( Screen, CapacitanceScreen );
} );