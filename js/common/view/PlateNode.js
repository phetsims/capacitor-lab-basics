// Copyright 2014-2019, University of Colorado Boulder

/**
 * Visual representation of a capacitor plate.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Bounds3 = require( 'DOT/Bounds3' );
  const BoxNode = require( 'CAPACITOR_LAB_BASICS/common/view/BoxNode' );
  const capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  const CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  const Color = require( 'SCENERY/util/Color' );
  const inherit = require( 'PHET_CORE/inherit' );
  const VacuumPlateChargeNode = require( 'CAPACITOR_LAB_BASICS/common/view/VacuumPlateChargeNode' );

  // constants
  const PLATE_COLOR = new Color( 245, 245, 245 );  // capacitor plates

  /**
   * @constructor
   *
   * @param {Capacitor} capacitor
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {string} polarity - 'POSITIVE' or 'NEGATIVE'
   * @param {number} maxPlateCharge
   */
  function PlateNode( capacitor, modelViewTransform, polarity, maxPlateCharge ) {

    BoxNode.call( this, modelViewTransform, PLATE_COLOR, capacitor.plateSizeProperty.value );

    // @private {CLBModelViewTransform3D}
    this.modelViewTransform = modelViewTransform;

    // Charges restricted to the largest possible top face on a capacitor plate.  Bounds needed for canvas.
    const canvasBounds = this.getMaxBoxNodeBounds();

    // @private {VacuumPlateChargeNode}
    this.vacuumPlateChargeNode = new VacuumPlateChargeNode( capacitor, modelViewTransform, {
      polarity: polarity,
      maxPlateCharge: maxPlateCharge,
      canvasBounds: canvasBounds
    } );
    this.addChild( this.vacuumPlateChargeNode );
  }

  capacitorLabBasics.register( 'PlateNode', PlateNode );

  return inherit( BoxNode, PlateNode, {

    /**
     * Make the charges on this plate visible.
     * @public
     *
     * @param {boolean} visible
     */
    setChargeVisible: function( visible ) {
      this.vacuumPlateChargeNode.visible = visible;
    },

    /**
     * Get bounds for a plate with maximum width.  Useful for layout and bounds calculations.
     * @public
     *
     * @returns {Bounds3}
     */
    getMaxBoxNodeBounds: function() {
      const maxWidthBoxNode = new BoxNode(
        this.modelViewTransform,
        PLATE_COLOR,
        new Bounds3( 0, 0, 0,
                    CLBConstants.PLATE_WIDTH_RANGE.max,
                    CLBConstants.PLATE_HEIGHT,
                    CLBConstants.PLATE_WIDTH_RANGE.max )
      );
      return maxWidthBoxNode.bounds;
    }
  }, {

    /**
     * Factory methods to create top and bottom PlateNode instances.
     * @public
     *
     * @param {Capacitor} capacitor
     * @param {CLBModelViewTransform3D} modelViewTransform
     * @param {number} maxPlateCharge
     *
     * @returns {PlateNode}
     */
    createTopPlateNode: function( capacitor, modelViewTransform, maxPlateCharge ) {
      return new PlateNode( capacitor, modelViewTransform, CLBConstants.POLARITY.POSITIVE, maxPlateCharge );
    },
    createBottomPlateNode: function( capacitor, modelViewTransform, maxPlateCharge ) {
      return new PlateNode( capacitor, modelViewTransform, CLBConstants.POLARITY.NEGATIVE, maxPlateCharge );
    }
  } );
} );

