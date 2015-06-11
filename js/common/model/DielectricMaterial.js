// Copyright 2002-2015, University of Colorado Boulder

/**
 * Base class and subclasses for dielectric materials. All subclasses for "real" materials are immutable.
 * The subclass for a "custom" material has a mutable dielectric constant.
 *
 * NOTE: Air is the only dielectric material needed for now.  Custom Dielectrics will not be ported at this time.
 * (5/31/15)
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
  var AIR_COLOR = 'rgba( 255, 0, 0, 1 )';  // This should never be seen so pick something obviously wrong.

  function DielectricMaterial( name, dielectricConstant, color ) {

    this.name = name;
    this.color = color;
    this.dielectricConstant = dielectricConstant;

  }

  return inherit( Object, DielectricMaterial, {}, {

    Air: function() { return new DielectricMaterial( 'air', CLConstants.EPSILON_AIR, AIR_COLOR ); }

  } );
} );
