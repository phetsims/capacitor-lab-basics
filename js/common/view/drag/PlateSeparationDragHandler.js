// Copyright 2015-2019, University of Colorado Boulder

/**
 * Drag handle for changing the plate separation.
 * Origin is at the end of the dashed line that is farthest from the arrow.
 * Attached to the top capacitor plate, in the center of the plate's top face.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );

  /**
   * This is the drag handler for the capacitor plate separation
   * property. Plate separation is a vertical quantity, so we're dragging along the y axis. Other axes are ignored.
   * @constructor
   *
   * @param {Capacitor} capacitor
   * @param {YawPitchModelViewTransform3} modelViewTransform
   * @param {Range} valueRange
   * @param {Tandem} tandem
   */
  function PlateSeparationDragHandler( capacitor, modelViewTransform, valueRange, tandem ) {
    // @private {Vector2}
    let clickYOffset = new Vector2( 0, 0 );

    DragListener.call( this, {
      allowTouchSnag: false,
      tandem: tandem,
      start: function( event ) {
        const pMouse = event.pointer.point;
        const pOrigin = modelViewTransform.modelToViewXYZ( 0, -( capacitor.plateSeparationProperty.value / 2 ), 0 );
        clickYOffset = pMouse.y - pOrigin.y;
      },
      drag: function( event ) {
        const pMouse = event.pointer.point;
        const yView = pMouse.y - clickYOffset;

        const separation = Util.clamp( 2 * modelViewTransform.viewToModelDeltaXY( 0, -yView ).y,
          valueRange.min, valueRange.max );

        // Discretize the plate separation to integral values by scaling m -> mm, rounding, and un-scaling.
        capacitor.plateSeparationProperty.value = Util.roundSymmetric( 5e3 * separation ) / 5e3;
      }
    } );
  }

  capacitorLabBasics.register( 'PlateSeparationDragHandler', PlateSeparationDragHandler );

  return inherit( DragListener, PlateSeparationDragHandler );
} );

