// Copyright 2016, University of Colorado Boulder

/**
 * Portion of the plate charge area facing the vacuum gap
 *
 * @author Jesse Greenberg
 * @author Andrew Adare
 */

define( function( require ) {
  'use strict';

  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PlateChargeNode = require( 'CAPACITOR_LAB_BASICS/common/view/PlateChargeNode' );

  /**
   * @param {Capacitor} capacitor
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Object} options - See options for PlateChargeNode
   * @constructor
   */
  function VacuumPlateChargeNode( capacitor, modelViewTransform, options ) {
    PlateChargeNode.call( this, capacitor, modelViewTransform, options );
  }

  capacitorLabBasics.register( 'VacuumPlateChargeNode', VacuumPlateChargeNode );

  return inherit( PlateChargeNode, VacuumPlateChargeNode, {

    /**
     * Get plate charge from capacitor in the model
     *
     * @returns {number} charge
     * @public
     */
    getPlateCharge: function() {
      return this.capacitor.plateChargeProperty.value;
    },


    /**
     * Gets the x offset (relative to the plate origin) of the portion of the plate that is facing the vacuum gap
     *
     * @returns {number} offset
     * @public
     */
    getContactXOrigin: function() {
      return -this.capacitor.plateSizeProperty.value.width / 2;
    },

    /**
     * Gets the width of the portion of the plate that is in contact with air.
     *
     * @returns {number}
     * @public
     */
    getContactWidth: function() {
      return this.capacitor.plateSizeProperty.value.width;
    }
  } );
} );
