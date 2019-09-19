// Copyright 2015-2018, University of Colorado Boulder

/**
 * Drag handle for changing the plate area.
 * Origin is at the end of the dashed line that is farthest from the arrow.
 * Attached to the capacitor's top plate, at front-left corner of top face.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  const CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  const DragHandleArrowNode = require( 'CAPACITOR_LAB_BASICS/common/view/drag/DragHandleArrowNode' );
  const DragHandleLineNode = require( 'CAPACITOR_LAB_BASICS/common/view/drag/DragHandleLineNode' );
  const DragHandleValueNode = require( 'CAPACITOR_LAB_BASICS/common/view/drag/DragHandleValueNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PlateAreaDragHandler = require( 'CAPACITOR_LAB_BASICS/common/view/drag/PlateAreaDragHandler' );
  const UnitsUtils = require( 'CAPACITOR_LAB_BASICS/common/model/util/UnitsUtils' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  // endpoints for a vertical double-headed arrow, this will be rotated to point along the plate's pseudo-3D diagonal
  const ARROW_TIP_LOCATION = new Vector2( 0, 0 );
  const ARROW_TAIL_LOCATION = new Vector2( 0, CLBConstants.DRAG_HANDLE_ARROW_LENGTH );

  // strings
  const millimetersSquaredPatternString = require( 'string!CAPACITOR_LAB_BASICS/millimetersSquaredPattern' );
  const plateAreaString = require( 'string!CAPACITOR_LAB_BASICS/plateArea' );

  // endpoints for a vertical line, this will be rotated to point along the plate's pseudo-3D diagonal
  const LINE_LENGTH = 22;
  const LINE_START_LOCATION = new Vector2( 0, 0 );
  const LINE_END_LOCATION = new Vector2( 0, LINE_LENGTH );

  /**
   * @constructor
   *
   * @param {Capacitor} capacitor
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Range} valueRange
   * @param {Tandem} tandem
   */
  function PlateAreaDragHandleNode( capacitor, modelViewTransform, valueRange, tandem ) {

    Node.call( this, { tandem: tandem } );
    const self = this;

    // @private {Capacitor}
    this.capacitor = capacitor;

    // @private {CLBModelViewTransform3D}
    this.modelViewTransform = modelViewTransform;

    const dragListener = new PlateAreaDragHandler( capacitor, modelViewTransform, valueRange,
      tandem.createTandem( 'inputListener' ) );
    this.addInputListener( dragListener );

    // arrow
    const arrowNode = new DragHandleArrowNode( ARROW_TIP_LOCATION, ARROW_TAIL_LOCATION, dragListener.isHighlightedProperty,
      tandem.createTandem( 'arrowNode' ) );

    this.cursor = 'pointer';

    // line
    const lineNode = new DragHandleLineNode( LINE_START_LOCATION, LINE_END_LOCATION );

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
    capacitor.plateSizeProperty.link( function() {
      self.updateDisplay();
      self.updateOffset();
    } );

    capacitor.plateSeparationProperty.link( function() {
      self.updateOffset();
    } );
  }

  capacitorLabBasics.register( 'PlateAreaDragHandleNode', PlateAreaDragHandleNode );

  return inherit( Node, PlateAreaDragHandleNode, {

    /**
     * Synchronizes the value display with the model.
     * @public
     */
    updateDisplay: function() {
      const millimetersSquared = UnitsUtils.metersSquaredToMillimetersSquared( this.capacitor.getPlateArea() );
      this.valueNode.setValue( millimetersSquared, 0 ); // Zero decimal places
    },

    /**
     * Attach drag handle to capacitor's top plate, at back-right corner of top face.
     * @public
     */
    updateOffset: function() {
      const plateSize = this.capacitor.plateSizeProperty.value;
      const x = this.capacitor.location.x + ( plateSize.width / 2 );
      const y = this.capacitor.location.y - ( this.capacitor.plateSeparationProperty.value / 2 ) - plateSize.height;
      const z = this.capacitor.location.z + ( plateSize.depth / 2 );
      this.translation = this.modelViewTransform.modelToViewXYZ( x, y, z );
    }
  } );
} );
