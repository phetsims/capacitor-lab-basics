// Copyright 2015-2019, University of Colorado Boulder

/**
 * Drag handle for changing the plate separation.  Origin is at the end of the dashed line that is farthest from the
 * arrow. Attached to the top capacitor plate, in the center of the plate's top face.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
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
  const PlateSeparationDragHandler = require( 'CAPACITOR_LAB_BASICS/common/view/drag/PlateSeparationDragHandler' );
  const UnitsUtils = require( 'CAPACITOR_LAB_BASICS/common/model/util/UnitsUtils' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  // endpoints for vertical double-headed arrow
  const ARROW_START_LOCATION = new Vector2( 0, 0 );
  const ARROW_END_LOCATION = new Vector2( 0, -CLBConstants.DRAG_HANDLE_ARROW_LENGTH );

  // endpoints for vertical line
  const LINE_LENGTH = 60;
  const LINE_START_LOCATION = new Vector2( 0, 0 );
  const LINE_END_LOCATION = new Vector2( 0, -LINE_LENGTH );

  // strings
  const millimetersPatternString = require( 'string!CAPACITOR_LAB_BASICS/millimetersPattern' );
  const separationString = require( 'string!CAPACITOR_LAB_BASICS/separation' );

  /**
   * @constructor
   *
   * @param {Capacitor} capacitor
   * @param {YawPitchModelViewTransform3} modelViewTransform
   * @param {Range} valueRange
   * @param {Tandem} tandem
   */
  function PlateSeparationDragHandleNode( capacitor, modelViewTransform, valueRange, tandem ) {

    Node.call( this, { tandem: tandem } );
    const self = this;

    // @private
    this.capacitor = capacitor;
    this.modelViewTransform = modelViewTransform;

    const dragHandler = new PlateSeparationDragHandler( capacitor, modelViewTransform, valueRange,
      tandem.createTandem( 'dragHandler' ) );
    this.addInputListener( dragHandler );

    // arrow
    const arrowNode = new DragHandleArrowNode( ARROW_START_LOCATION, ARROW_END_LOCATION, dragHandler.isHighlightedProperty,
      tandem.createTandem( 'arrowNode' ) );

    this.cursor = 'pointer';

    // line
    const lineNode = new DragHandleLineNode( LINE_START_LOCATION, LINE_END_LOCATION );

    // value
    const millimeters = UnitsUtils.metersToMillimeters( capacitor.plateSeparationProperty.value );
    this.valueNode = new DragHandleValueNode( separationString, millimeters, millimetersPatternString, {
      tandem: tandem.createTandem( 'valueNode' )
    } );

    // Make text part of the draggable area
    this.valueNode.mouseArea = this.valueNode.bounds.dilated( 0 );
    this.valueNode.touchArea = this.valueNode.bounds.dilated( 0 );

    // rendering order
    this.addChild( lineNode );
    this.addChild( arrowNode );
    this.addChild( this.valueNode );

    // layout: arrow about line, horizontally centered
    let x = 0;
    let y = 0;
    lineNode.translation = new Vector2( x, y );

    x = 0;
    y = lineNode.bounds.minY - 2;
    arrowNode.translation = new Vector2( x, y );

    x = arrowNode.bounds.maxX + 5;
    y = arrowNode.bounds.minY - this.valueNode.bounds.height / 2 + 5;
    this.valueNode.translation = new Vector2( x, y );

    // update when related model properties change
    capacitor.plateSeparationProperty.link( function() {
      self.updateValueDisplay();
      self.updateOffset();
    } );

    capacitor.plateSizeProperty.link( function() {
      self.updateOffset();
    } );
  }

  capacitorLabBasics.register( 'PlateSeparationDragHandleNode', PlateSeparationDragHandleNode );

  return inherit( Node, PlateSeparationDragHandleNode, {

    /**
     * Synchronizes the value display with the model.
     * @public
     */
    updateValueDisplay: function() {
      const millimeters = UnitsUtils.metersToMillimeters( this.capacitor.plateSeparationProperty.value );
      this.valueNode.setValue( millimeters, 1 ); // One decimal place
    },

    /**
     * Attach drag handle to top capacitor plate, in center the plate's top face.
     * @public
     */
    updateOffset: function() {
      const width = this.capacitor.plateSizeProperty.value.width;
      const height = this.capacitor.plateSizeProperty.value.height;
      const x = this.capacitor.location.x + ( 0.3 * width );
      const y = this.capacitor.location.y - ( this.capacitor.plateSeparationProperty.value / 2 ) - height;
      const z = 0;
      this.translation = this.modelViewTransform.modelToViewXYZ( x, y, z );
    }
  } );
} );

