// Copyright 2016, University of Colorado Boulder

/**
 * Drag handle for changing the plate area.
 * Origin is at the end of the dashed line that is farthest from the arrow.
 * Attached to the capacitor's top plate, at front-left corner of top face.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 * @author Andrew Adare
 */
define( function( require ) {
  'use strict';

  // modules
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var DragHandleArrowNode = require( 'CAPACITOR_LAB_BASICS/common/view/drag/DragHandleArrowNode' );
  var DragHandleLineNode = require( 'CAPACITOR_LAB_BASICS/common/view/drag/DragHandleLineNode' );
  var DragHandleValueNode = require( 'CAPACITOR_LAB_BASICS/common/view/drag/DragHandleValueNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PlateAreaDragHandler = require( 'CAPACITOR_LAB_BASICS/common/view/drag/PlateAreaDragHandler' );
  var UnitsUtils = require( 'CAPACITOR_LAB_BASICS/common/model/util/UnitsUtils' );
  var Vector2 = require( 'DOT/Vector2' );

  // phet-io modules
  var TNode = require( 'ifphetio!PHET_IO/types/scenery/nodes/TNode' );

  // constants
  // endpoints for a vertical double-headed arrow, this will be rotated to point along the plate's pseudo-3D diagonal
  var ARROW_TIP_LOCATION = new Vector2( 0, 0 );
  var ARROW_TAIL_LOCATION = new Vector2( 0, CLBConstants.DRAG_HANDLE_ARROW_LENGTH );

  // strings
  var plateAreaString = require( 'string!CAPACITOR_LAB_BASICS/plateArea' );
  var unitsMillimetersString = require( 'string!CAPACITOR_LAB_BASICS/units.millimeters' );

  // endpoints for a vertical line, this will be rotated to point along the plate's pseudo-3D diagonal
  var LINE_LENGTH = 22;
  var LINE_START_LOCATION = new Vector2( 0, 0 );
  var LINE_END_LOCATION = new Vector2( 0, LINE_LENGTH );

  /**
   * Constructor.
   *
   * @param {Capacitor} capacitor
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Range} valueRange
   * @param {Tandem} tandem
   * @constructor
   */
  function PlateAreaDragHandleNode( capacitor, modelViewTransform, valueRange, tandem ) {

    Node.call( this );
    var self = this;

    // @private
    this.capacitor = capacitor;
    this.modelViewTransform = modelViewTransform;

    // arrow
    var arrowNode = new DragHandleArrowNode( ARROW_TIP_LOCATION, ARROW_TAIL_LOCATION,
      tandem.createTandem( 'arrowNode' ) );
    this.addInputListener( new PlateAreaDragHandler( arrowNode, capacitor, modelViewTransform, valueRange,
      tandem.createTandem( 'inputListener' ) ) );

    this.cursor = 'pointer';

    // line
    var lineNode = new DragHandleLineNode( LINE_START_LOCATION, LINE_END_LOCATION );

    // value
    var millimetersSquared = UnitsUtils.metersSquaredToMillimetersSquared( capacitor.getPlateArea() );
    // @private
    this.valueNode = new DragHandleValueNode( plateAreaString, millimetersSquared, unitsMillimetersString + '<sup>' + 2 + '</sup>' );

    // Make text part of the draggable area
    this.valueNode.mouseArea = this.valueNode.bounds.dilated( 0 );
    this.valueNode.touchArea = this.valueNode.bounds.dilated( 0 );

    // Highlight the arrow on pointer over text
    this.valueNode.addInputListener( new ButtonListener( {
      over: function( event ) {
        arrowNode.fill = arrowNode.highlightColor;
      },
      up: function( event ) {
        arrowNode.fill = arrowNode.normalColor;
      }
    } ) );

    // rendering order
    this.addChild( lineNode );
    this.addChild( arrowNode );
    this.addChild( this.valueNode );

    // layout: arrow below line, rotate into alignment with top plate's pseudo-3D diagonal
    var x = 0;
    var y = 0;
    var angle = ( -Math.PI / 2 ) + ( modelViewTransform.yaw / 2 ); // aligned with diagonal of plate surface
    var lineArrowSpacing = 2;
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

    tandem.addInstance( this, TNode );
  }

  capacitorLabBasics.register( 'PlateAreaDragHandleNode', PlateAreaDragHandleNode );

  return inherit( Node, PlateAreaDragHandleNode, {


    /**
     * Synchronizes the value display with the model.
     * @public
     */
    updateDisplay: function() {
      var millimetersSquared = UnitsUtils.metersSquaredToMillimetersSquared( this.capacitor.getPlateArea() );
      this.valueNode.setValue( millimetersSquared, 0 ); // Zero decimal places
    },

    /**
     * Attach drag handle to capacitor's top plate, at back-right corner of top face.
     * @public
     */
    updateOffset: function() {
      var plateSize = this.capacitor.plateSizeProperty.value;
      var x = this.capacitor.location.x + ( plateSize.width / 2 );
      var y = this.capacitor.location.y - ( this.capacitor.plateSeparationProperty.value / 2 ) - plateSize.height;
      var z = this.capacitor.location.z + ( plateSize.depth / 2 );
      this.translation = this.modelViewTransform.modelToViewXYZ( x, y, z );
    }
  } );
} );
