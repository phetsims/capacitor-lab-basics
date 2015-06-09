// Copyright 2002-2015, University of Colorado Boulder

/**
 * Visual representation of a capacitor plate.  For a partially-inserted dielectric, the portion of the plate that
 * contacts the dielectric is charged differently than the portion of the plate that contacts air.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var BoxNode = require( 'CAPACITOR_LAB/common/view/BoxNode' );
  var PlateChargeNode = require( 'CAPACITOR_LAB/common/view/PlateChargeNode' );
  var CLConstants = require( 'CAPACITOR_LAB/common/CLConstants' );

  // constants
  // capacitor plates
  var PLATE_COLOR = new Color( 245, 245, 245 );

  function PlateNode( capacitor, modelViewTransform, polarity, maxPlateCharge ) {

    BoxNode.call( this, modelViewTransform, PLATE_COLOR, capacitor.plateSize );

    //this.dielectricPlateChargeNode = new DielectricPlateChargeNode( capacitor, mvt, polarity, maxPlateCharge, dielectricPlateChargeTransparency );
    //addChild( dielectricPlateChargeNode );
    this.airPlateChargeNode = PlateChargeNode.AirPlateChargeNode( capacitor, modelViewTransform, polarity, maxPlateCharge );
    this.addChild( this.airPlateChargeNode );

  }

  return inherit( BoxNode, PlateNode, {

    /**
     * Make the charges on this plate visible.
     *
     * @param {boolean} visible
     */
    setChargeVisible: function( visible ) {
      //dielectricPlateChargeNode.setVisible( visible );
      this.airPlateChargeNode.visible = visible;
    }
  }, {

    /**
     * Factory function for a TopPlateNode.
     *
     * @param {Capacitor} capacitor
     * @param {CLModelViewTransform3D} modelViewTransform
     * @param {number} maxPlateCharge
     * @constructor
     */
    TopPlateNode: function( capacitor, modelViewTransform, maxPlateCharge ) {
      // TODO: TEST THE OPACITY VALUE, IT MAY BE WRONG.
      return new PlateNode( capacitor, modelViewTransform, CLConstants.POLARITY.POSITIVE, maxPlateCharge, 0 /* dielectricPlateChargeOpacity */ );
    },

    /**
     * Factory function for a BottomPlateNode.
     *
     * @param {Capacitor} capacitor
     * @param {CLModelViewTransform3D} modelViewTransform
     * @param {number} maxPlateCharge
     * @constructor
     */
    BottomPlateNode: function( capacitor, modelViewTransform, maxPlateCharge ) {
      // TODO: TEST THE OPACITY VALUE, IT MAY BE WRONG.
      return new PlateNode( capacitor, modelViewTransform, CLConstants.POLARITY.NEGATIVE, maxPlateCharge, 0.75 /* dielectricPlateChargeOpacity */ );
    }
  } );
} );