// Copyright 2015-2017, University of Colorado Boulder

/**
 * Drag handle for changing the plate separation.
 * Origin is at the end of the dashed line that is farthest from the arrow.
 * Attached to the top capacitor plate, in the center of the plate's top face.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var DragListener = require( 'SCENERY/listeners/DragListener' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * This is the drag handler for the capacitor plate separation
   * property. Plate separation is a vertical quantity, so we're dragging along the y axis. Other axes are ignored.
   * @constructor
   *
   * @param {Capacitor} capacitor
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Range} valueRange
   * @param {Tandem} tandem
   */
  function PlateSeparationDragHandler( capacitor, modelViewTransform, valueRange, tandem ) {
    // @private {Vector2}
    var clickYOffset = new Vector2( 0, 0 );

    DragListener.call( this, {
      tandem: tandem,
      start: function( event ) {
        var pMouse = event.pointer.point;
        var pOrigin = modelViewTransform.modelToViewXYZ( 0, -( capacitor.plateSeparationProperty.value / 2 ), 0 );
        clickYOffset = pMouse.y - pOrigin.y;
      },
      drag: function( event ) {
        var pMouse = event.pointer.point;
        var yView = pMouse.y - clickYOffset;

        var separation = Util.clamp( 2 * modelViewTransform.viewToModelDeltaXY( 0, -yView ).y,
          valueRange.min, valueRange.max );

        // Discretize the plate separation to integral values by scaling m -> mm, rounding, and un-scaling.
        capacitor.plateSeparationProperty.value = Util.roundSymmetric( 5e3 * separation ) / 5e3;
      }
    } );
  }

  capacitorLabBasics.register( 'PlateSeparationDragHandler', PlateSeparationDragHandler );

  return inherit( DragListener, PlateSeparationDragHandler );
} );

