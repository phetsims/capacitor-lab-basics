// Copyright 2015, University of Colorado Boulder

/**
 * Drag handler for capacitor plate area property.
 * This drag handle is attached to the front-left corner of the capacitor plate, and its
 * drag axis is the diagonal line from the front-left corner to the back-right corner of the plate.
 *
 * Dragging on a diagonal is tricky; all computations are based on the x axis, ignoring other axes.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  //var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var TandemDragHandler = require( 'TANDEM/scenery/input/TandemDragHandler' );

  /**
   * Constructor.
   * @param {DragHandleArrowNode} dragNode
   * @param {Capacitor} capacitor
   * @param {CLModelViewTransform3D} modelViewTransform
   * @param {Range} valueRange
   * @param {Tandem} tandem
   */
  function PlateAreaDragHandler( dragNode, capacitor, modelViewTransform, valueRange, tandem ) {

    var self = this;

    // @private
    this.dragNode = dragNode;
    this.capacitor = capacitor;
    this.modelViewTransform = modelViewTransform;
    this.valueRange = valueRange;
    this.clickXOffset = new Vector2( 0, 0 );

    TandemDragHandler.call( this, {
      tandem: tandem,
      start: function( event ) {
        var pMouse = event.pointer.point;
        var pOrigin = modelViewTransform.modelToViewDeltaXYZ( capacitor.plateSize.width / 2, 0, capacitor.plateSize.width / 2 );
        self.clickXOffset = pMouse.x - pOrigin.x;
      },
      drag: function( event ) {
        var pMouse = event.pointer.point;
        var plateWidth = self.getPlateWidth( pMouse );

        // Discretize the plate width to round values by scaling m -> mm, rounding, and un-scaling.
        // Plate area drags will then snap only to perfect integer squares (in mm).
        capacitor.setPlateWidth( Util.roundSymmetric( 1e3 * plateWidth ) / 1e3 );
      }
    } );

  }

  capacitorLabBasics.register( 'PlateAreaDragHandler', PlateAreaDragHandler );

  return inherit( TandemDragHandler, PlateAreaDragHandler, {

    /**
     * Determines the plateWidth for a specific mouse position.  This effectively accounts for the z-axis dimension.
     *
     * @param {Vector2} pMouse
     * return {number}
     */
    getPlateWidth: function( pMouse ) {
      // pick any 2 view values
      var xView1 = 0;
      var xView2 = 1;

      // compute corresponding model values
      var xModel1 = this.getModelX( pMouse, xView1 );
      var xModel2 = this.getModelX( pMouse, xView2 );

      var linearFunction = new LinearFunction( xView1, xView2, xModel1, xModel2 );
      return Util.clamp( linearFunction.inverse( 0 ), this.valueRange.min, this.valueRange.max );

    },

    /**
     * Determines how far the mouse is from where we grabbed the arrow, for a hypothetical capacitor plate width.
     *
     * @param {Vector2} pMouse
     * @param {number} samplePlateWidth
     * @return {number}
     */
    getModelX: function( pMouse, samplePlateWidth ) {
      var pBackRightCorner = this.modelViewTransform.modelToViewXYZ( samplePlateWidth / 2, 0, samplePlateWidth / 2 );
      return pMouse.x - pBackRightCorner.x - this.clickXOffset;
    }
  } );
} );