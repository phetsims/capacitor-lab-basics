// Copyright 2015-2021, University of Colorado Boulder

/**
 * Drag handler for capacitor plate area property.
 * This drag handle is attached to the front-left corner of the capacitor plate, and its
 * drag axis is the diagonal line from the front-left corner to the back-right corner of the plate.
 *
 * Dragging on a diagonal is tricky; all computations are based on the x axis, ignoring other axes.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import LinearFunction from '../../../../../dot/js/LinearFunction.js';
import Utils from '../../../../../dot/js/Utils.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import { DragListener } from '../../../../../scenery/js/imports.js';
import capacitorLabBasics from '../../../capacitorLabBasics.js';

class PlateAreaDragHandler extends DragListener {
  /**
   * @param {Capacitor} capacitor
   * @param {CLModelViewTransform3D} modelViewTransform
   * @param {Range} valueRange
   * @param {Tandem} tandem
   */
  constructor( capacitor, modelViewTransform, valueRange, tandem ) {
    super( {
      allowTouchSnag: false,
      tandem: tandem,
      start: event => {
        const width = capacitor.plateSizeProperty.value.width;
        const pMouse = event.pointer.point;
        const pOrigin = modelViewTransform.modelToViewDeltaXYZ( width / 2, 0, width / 2 );
        this.clickXOffset = pMouse.x - pOrigin.x;
      },
      drag: event => {
        const pMouse = event.pointer.point;
        const plateWidth = this.getPlateWidth( pMouse );

        // Discretize the plate area to round values by scaling m -> mm, rounding, then scaling back.
        // Plate area drags should then snap only in steps of 10 mm^2.
        const plateArea = Utils.roundSymmetric( 1e5 * plateWidth * plateWidth ) / 1e5;
        capacitor.setPlateWidth( Math.sqrt( plateArea ) );
      }
    } );

    // @private
    this.modelViewTransform = modelViewTransform;
    this.valueRange = valueRange;

    // @private {Vector2}
    this.clickXOffset = new Vector2( 0, 0 );
  }

  /**
   * Determines the plateWidth for a specific mouse position.  This effectively accounts for the z-axis dimension.
   *
   * @param {Vector2} pMouse
   * return {number}
   * @public
   */
  getPlateWidth( pMouse ) {
    // pick any 2 view values
    const xView1 = 0;
    const xView2 = 1;

    // compute corresponding model values
    const xModel1 = this.getModelX( pMouse, xView1 );
    const xModel2 = this.getModelX( pMouse, xView2 );

    const linearFunction = new LinearFunction( xView1, xView2, xModel1, xModel2 );
    return Utils.clamp( linearFunction.inverse( 0 ), this.valueRange.min, this.valueRange.max );

  }

  /**
   * Determines how far the mouse is from where we grabbed the arrow, for a hypothetical capacitor plate width.
   *
   * @param {Vector2} pMouse
   * @param {number} samplePlateWidth
   * @returns {number}
   * @public
   */
  getModelX( pMouse, samplePlateWidth ) {
    const pBackRightCorner = this.modelViewTransform.modelToViewXYZ( samplePlateWidth / 2, 0, samplePlateWidth / 2 );
    return pMouse.x - pBackRightCorner.x - this.clickXOffset;
  }
}

capacitorLabBasics.register( 'PlateAreaDragHandler', PlateAreaDragHandler );

export default PlateAreaDragHandler;