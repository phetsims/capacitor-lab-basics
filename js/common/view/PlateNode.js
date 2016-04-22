// Copyright 2014-2015, University of Colorado Boulder

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
  var BoxNode = require( 'CAPACITOR_LAB_BASICS/common/view/BoxNode' );
  var PlateChargeNode = require( 'CAPACITOR_LAB_BASICS/common/view/PlateChargeNode' );
  var CLConstants = require( 'CAPACITOR_LAB_BASICS/common/CLConstants' );
  var Bounds3 = require( 'DOT/Bounds3' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  // constants
  // capacitor plates
  var PLATE_COLOR = new Color( 245, 245, 245 );

  function PlateNode( capacitor, modelViewTransform, polarity, maxPlateCharge ) {

    BoxNode.call( this, modelViewTransform, PLATE_COLOR, capacitor.plateSize );

    this.modelViewTransform = modelViewTransform; // @private

    // Charges restricted to the largest possible top face on a capacitor plate.  Bounds needed for canvas.
    var canvasBounds = this.getMaxBoxNodeBounds();

    // @private
    this.airPlateChargeNode = PlateChargeNode.AirPlateChargeNode( capacitor, modelViewTransform, polarity, maxPlateCharge, canvasBounds );
    this.addChild( this.airPlateChargeNode );

  }

  capacitorLabBasics.register( 'PlateNode', PlateNode );
  
  return inherit( BoxNode, PlateNode, {

    /**
     * Make the charges on this plate visible.
     *
     * @param {boolean} visible
     */
    setChargeVisible: function( visible ) {
      //dielectricPlateChargeNode.setVisible( visible );
      this.airPlateChargeNode.visible = visible;
    },

    /**
     * Get bounds for a plate with maximum width.  Useful for layout and bounds calculations.
     *
     * @return {Bounds3}
     */
    getMaxBoxNodeBounds: function() {
      var maxWidthBoxNode = new BoxNode(
        this.modelViewTransform,
        PLATE_COLOR,
        new Bounds3( 0, 0, 0, CLConstants.PLATE_WIDTH_RANGE.max, CLConstants.PLATE_HEIGHT, CLConstants.PLATE_WIDTH_RANGE.max )
      );
      return maxWidthBoxNode.bounds;
    }

  }, {

    /**
     * Factory function for a TopPlateNode.
     *
     * @param {Capacitor} capacitor
     * @param {CLBModelViewTransform3D} modelViewTransform
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
     * @param {CLBModelViewTransform3D} modelViewTransform
     * @param {number} maxPlateCharge
     * @constructor
     */
    BottomPlateNode: function( capacitor, modelViewTransform, maxPlateCharge ) {
      // TODO: TEST THE OPACITY VALUE, IT MAY BE WRONG.
      return new PlateNode( capacitor, modelViewTransform, CLConstants.POLARITY.NEGATIVE, maxPlateCharge, 0.75 /* dielectricPlateChargeOpacity */ );
    }
  } );
} );