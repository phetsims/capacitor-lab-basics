// Copyright 2016, University of Colorado Boulder

/**
 * Portion of the plate charge area in contact with air.  Charges appear on this node which 
 * is in contact with aire (not in contact with the dielectric.)
 * 
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PlateChargeNode = require( 'CAPACITOR_LAB_BASICS/common/view/PlateChargeNode' );

  /**
   * Constructor.
   * @param {Capacitor} capacitor
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Object} options - See options for PlateChargeNode
   * @constructor
   */
  function AirPlateChargeNode( capacitor, modelViewTransform, options ) {
    PlateChargeNode.call( this, capacitor, modelViewTransform, options );
  }

  capacitorLabBasics.register( 'AirPlateChargeNode', AirPlateChargeNode );

  return inherit( PlateChargeNode, AirPlateChargeNode, {

    // Gets the portion of the plate charge due to air.
    getPlateCharge: function() {
      return this.capacitor.getTotalPlateCharge();
    },

    // Gets the x offset (relative to the plate origin) of the portion of the
    // plate that is in contact with air.
    getContactXOrigin: function() {
      return -this.capacitor.plateSize.width / 2;
    },

    /**
     * Gets the width of the portion of the plate that is in contact with air.
     * NOTE: This should always return the width of the capacitor plates since
     * dielectrics have not been introduced yet.
     *
     * @returns {number}
     */
    getContactWidth: function() {
      return this.capacitor.plateSize.width;
    }
  } );
} );
