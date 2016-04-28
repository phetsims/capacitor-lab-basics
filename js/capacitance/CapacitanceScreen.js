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
  var CLBModelViewTransform3D = require( 'CAPACITOR_LAB_BASICS/common/model/CLBModelViewTransform3D' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Screen = require( 'JOIST/Screen' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  // strings
  var capacitanceTitleString = require( 'string!CAPACITOR_LAB_BASICS/capacitance.title' );

  /**
   * @constructor
   */
  function CapacitanceScreen( tandem ) {

    // TODO: Icons need to be created for this sim.
    var icon = new Rectangle( 0, 0, 548, 373, { fill: 'red' } );

    Screen.call( this, capacitanceTitleString, icon,
      function() { return new CapacitanceModel( new CLBModelViewTransform3D() ); },
      function( model ) { return new CapacitanceScreenView( model ); }, {
        backgroundColor: 'rgb( 194, 227, 255 )',
        tandem: tandem
      }
    );

  }

  capacitorLabBasics.register( 'CapacitanceScreen', CapacitanceScreen );

  return inherit( Screen, CapacitanceScreen );
} );