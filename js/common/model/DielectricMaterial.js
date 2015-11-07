// Copyright 2015, University of Colorado Boulder

/**
 * Base class and subclasses for dielectric materials. All subclasses for "real" materials are immutable.
 * The subclass for a "custom" material has a mutable dielectric constant.
 *
 * NOTE: Air is the only dielectric material needed for now. Dielectrics not being ported at this time.
 * However, a basic custom dielectric is used to calculate the maximum number of charges possible on a capacitor.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var CLConstants = require( 'CAPACITOR_LAB_BASICS/common/CLConstants' );

  // constants


  function DielectricMaterial( name, dielectricConstant, color ) {

    // @public (read-only)
    this.name = name;
    this.color = color;
    this.dielectricConstant = dielectricConstant;

  }

  return inherit( Object, DielectricMaterial, {}, {

    Air: function() { return new DielectricMaterial( 'air', CLConstants.EPSILON_AIR, CLConstants.AIR_COLOR ); },
    CustomDielectricMaterial: function( dielectricConstant ) { return new DielectricMaterial( 'Custom', dielectricConstant, CLConstants.CUSTOM_DIELECTRIC_COLOR ); }

  } );
} );
