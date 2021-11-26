// Copyright 2015-2021, University of Colorado Boulder

/**
 * Drag handle for changing the plate separation.
 * Origin is at the end of the dashed line that is farthest from the arrow.
 * Attached to the top capacitor plate, in the center of the plate's top face.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Utils from '../../../../../dot/js/Utils.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import { DragListener } from '../../../../../scenery/js/imports.js';
import capacitorLabBasics from '../../../capacitorLabBasics.js';

class PlateSeparationDragHandler extends DragListener {
  /**
   * This is the drag handler for the capacitor plate separation
   * property. Plate separation is a vertical quantity, so we're dragging along the y axis. Other axes are ignored.
   *
   * @param {Capacitor} capacitor
   * @param {YawPitchModelViewTransform3} modelViewTransform
   * @param {Range} valueRange
   * @param {Tandem} tandem
   */
  constructor( capacitor, modelViewTransform, valueRange, tandem ) {
    // @private {Vector2}
    let clickYOffset = new Vector2( 0, 0 );

    super( {
      allowTouchSnag: false,
      tandem: tandem,
      start: event => {
        const pMouse = event.pointer.point;
        const pOrigin = modelViewTransform.modelToViewXYZ( 0, -( capacitor.plateSeparationProperty.value / 2 ), 0 );
        clickYOffset = pMouse.y - pOrigin.y;
      },
      drag: event => {
        const pMouse = event.pointer.point;
        const yView = pMouse.y - clickYOffset;

        const separation = Utils.clamp( 2 * modelViewTransform.viewToModelDeltaXY( 0, -yView ).y,
          valueRange.min, valueRange.max );

        // Discretize the plate separation to integral values by scaling m -> mm, rounding, and un-scaling.
        capacitor.plateSeparationProperty.value = Utils.roundSymmetric( 5e3 * separation ) / 5e3;
      }
    } );
  }
}

capacitorLabBasics.register( 'PlateSeparationDragHandler', PlateSeparationDragHandler );

export default PlateSeparationDragHandler;