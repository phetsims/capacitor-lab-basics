// Copyright 2015-2023, University of Colorado Boulder

/**
 * Drag handle for changing the plate area.
 * Origin is at the end of the dashed line that is farthest from the arrow.
 * Attached to the capacitor's top plate, at front-left corner of top face.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import Vector2 from '../../../../../dot/js/Vector2.js';
import { Node } from '../../../../../scenery/js/imports.js';
import capacitorLabBasics from '../../../capacitorLabBasics.js';
import CapacitorLabBasicsStrings from '../../../CapacitorLabBasicsStrings.js';
import CLBConstants from '../../CLBConstants.js';
import UnitsUtils from '../../model/util/UnitsUtils.js';
import DragHandleArrowNode from './DragHandleArrowNode.js';
import DragHandleLineNode from './DragHandleLineNode.js';
import DragHandleValueNode from './DragHandleValueNode.js';
import PlateAreaDragHandler from './PlateAreaDragHandler.js';

// constants
// endpoints for a vertical double-headed arrow, this will be rotated to point along the plate's pseudo-3D diagonal
const ARROW_TIP_POSITION = new Vector2( 0, 0 );
const ARROW_TAIL_POSITION = new Vector2( 0, CLBConstants.DRAG_HANDLE_ARROW_LENGTH );

const millimetersSquaredPatternString = CapacitorLabBasicsStrings.millimetersSquaredPattern;
const plateAreaString = CapacitorLabBasicsStrings.plateArea;

// endpoints for a vertical line, this will be rotated to point along the plate's pseudo-3D diagonal
const LINE_LENGTH = 22;
const LINE_START_POSITION = new Vector2( 0, 0 );
const LINE_END_POSITION = new Vector2( 0, LINE_LENGTH );

class PlateAreaDragHandleNode extends Node {
  /**
   * @param {Capacitor} capacitor
   * @param {YawPitchModelViewTransform3} modelViewTransform
   * @param {Range} valueRange
   * @param {Tandem} tandem
   */
  constructor( capacitor, modelViewTransform, valueRange, tandem ) {

    super( { tandem: tandem } );

    // @private {Capacitor}
    this.capacitor = capacitor;

    // @private {YawPitchModelViewTransform3}
    this.modelViewTransform = modelViewTransform;

    const dragListener = new PlateAreaDragHandler( capacitor, modelViewTransform, valueRange,
      tandem.createTandem( 'dragListener' ) );
    this.addInputListener( dragListener );

    // arrow
    const arrowNode = new DragHandleArrowNode( ARROW_TIP_POSITION, ARROW_TAIL_POSITION, dragListener.isHighlightedProperty,
      tandem.createTandem( 'arrowNode' ) );

    this.cursor = 'pointer';

    // line
    const lineNode = new DragHandleLineNode( LINE_START_POSITION, LINE_END_POSITION );

    // value
    const millimetersSquared = UnitsUtils.metersSquaredToMillimetersSquared( capacitor.getPlateArea() );

    // @private {DragHandleValueNode}
    this.valueNode = new DragHandleValueNode( plateAreaString, millimetersSquared, millimetersSquaredPatternString, {
      tandem: tandem.createTandem( 'valueNode' )
    } );

    // Make text part of the draggable area
    this.valueNode.mouseArea = this.valueNode.bounds.dilated( 0 );
    this.valueNode.touchArea = this.valueNode.bounds.dilated( 0 );

    // rendering order
    this.addChild( lineNode );
    this.addChild( arrowNode );
    this.addChild( this.valueNode );

    // layout: arrow below line, rotate into alignment with top plate's pseudo-3D diagonal
    let x = 0;
    let y = 0;
    const angle = ( -Math.PI / 2 ) + ( modelViewTransform.yaw / 2 ); // aligned with diagonal of plate surface
    const lineArrowSpacing = 2;
    lineNode.translation = new Vector2( x, y );
    lineNode.rotation = angle;

    x = lineNode.bounds.maxX + lineArrowSpacing;
    y = lineNode.bounds.minY - lineArrowSpacing;
    arrowNode.translation = new Vector2( x, y );
    arrowNode.rotation = angle;

    x = lineNode.bounds.maxX + this.valueNode.bounds.width / 3;
    y = lineNode.bounds.minY - this.valueNode.bounds.height - 14;
    this.valueNode.translation = new Vector2( x, y );

    // watch for model changes
    capacitor.plateSizeProperty.link( () => {
      this.updateDisplay();
      this.updateOffset();
    } );

    capacitor.plateSeparationProperty.link( () => {
      this.updateOffset();
    } );
  }


  /**
   * Synchronizes the value display with the model.
   * @public
   */
  updateDisplay() {
    const millimetersSquared = UnitsUtils.metersSquaredToMillimetersSquared( this.capacitor.getPlateArea() );
    this.valueNode.setValue( millimetersSquared, 0 ); // Zero decimal places
  }

  /**
   * Attach drag handle to capacitor's top plate, at back-right corner of top face.
   * @public
   */
  updateOffset() {
    const plateSize = this.capacitor.plateSizeProperty.value;
    const x = this.capacitor.position.x + ( plateSize.width / 2 );
    const y = this.capacitor.position.y - ( this.capacitor.plateSeparationProperty.value / 2 ) - plateSize.height;
    const z = this.capacitor.position.z + ( plateSize.depth / 2 );
    this.translation = this.modelViewTransform.modelToViewXYZ( x, y, z );
  }
}

capacitorLabBasics.register( 'PlateAreaDragHandleNode', PlateAreaDragHandleNode );

export default PlateAreaDragHandleNode;
