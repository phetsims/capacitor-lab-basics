// Copyright 2016, University of Colorado Boulder

/**
 * Visual representation of the effective E-field (E_effective) between the capacitor plates.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Emily Randal
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  //modules
  var CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );

  // constants
  var ARROW_SIZE = new Dimension2( 6, 7 );
  var LINE_WIDTH = 1;
  var ARROW_COLOR = 'black';

  // determines spacing of electric field lines, chosen by inspection to match spacing from Java
  var SPACING_CONSTANT = 0.0258;

  /**
   * Draw one EField line with the provided parameters using HTML5 Canvas
   *
   * @param {Vector2} position - origin, at the center of the line
   * @param {number} length length of the line in view coordinates
   * @param {string} direction
   * @param {CanvasRenderingContext2D} context
   */
  function drawEFieldLine( position, length, direction, context ) {

    // line, origin at center
    context.moveTo( position.x, position.y - length / 2 - 3 );
    context.lineTo( position.x, position.y + length / 2 - 3 );

    // pull out for readability
    var w = ARROW_SIZE.width;
    var h = ARROW_SIZE.height;

    // make sure that the arrow path is centered along the field line.
    // dividing by 4 aligns better than dividing by 2 for the narrow line width.
    var xOffset = LINE_WIDTH / 4;
    var arrowCenter = ( direction === CLBConstants.DIRECTION.UP ) ? position.x - xOffset : position.x + xOffset;

    // path for the UP arrow
    if ( direction === CLBConstants.DIRECTION.UP ) {
      context.moveTo( arrowCenter, position.y - h / 2 );
      context.lineTo( arrowCenter + w / 2, position.y + h / 2 );
      context.lineTo( arrowCenter - w / 2, position.y + h / 2 );
    }

    // path for the DOWN arrow
    else if ( direction === CLBConstants.DIRECTION.DOWN ) {
      context.moveTo( arrowCenter, position.y + h / 2 );
      context.lineTo( arrowCenter - w / 2, position.y - h / 2 );
      context.lineTo( arrowCenter + w / 2, position.y - h / 2 );
    }

    else {
      assert && assert( false, 'EFieldLine must be of orientation UP or DOWN' );
    }
  }

  /**
   * Constructor for the EFieldNode.
   *
   * @param {Capacitor} capacitor
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {number} maxEffectiveEField
   * @param {Bounds2} canvasBounds
   * @constructor
   */
  function EFieldNode( capacitor, modelViewTransform, maxEffectiveEField, canvasBounds ) {

    CanvasNode.call( this, {
      canvasBounds: canvasBounds
    } );
    var self = this;

    // @private
    this.capacitor = capacitor;
    this.modelViewTransform = modelViewTransform;
    this.maxEffectiveEField = maxEffectiveEField;

    Property.multilink( [
      capacitor.plateSizeProperty,
      capacitor.plateSeparationProperty,
      capacitor.plateVoltageProperty
    ], function() {
      if ( self.isVisible() ) {
        self.invalidatePaint();
      }
    } );
  }

  capacitorLabBasics.register( 'EFieldNode', EFieldNode );

  return inherit( CanvasNode, EFieldNode, {

    /**
     * Update the node when it becomes visible.  Overrides setVisible in Node.
     * @public
     * @override
     */
    setVisible: function( visible ) {
      Node.prototype.setVisible.call( this, visible );
      if ( visible ) {
        this.invalidatePaint();
      }
    },

    /**
     * Rendering function
     * @public
     *
     * @param  {CanvasRenderingContext2D} context
     */
    paintCanvas: function( context ) {

      // compute density (spacing) of field lines
      var effectiveEField = this.capacitor.getEffectiveEField();
      var lineSpacing = this.getLineSpacing( effectiveEField );

      if ( lineSpacing > 0 ) {

        context.beginPath();

        // relevant model values
        var plateWidth = this.capacitor.plateSizeProperty.value.width;
        var plateDepth = plateWidth;
        var plateSeparation = this.capacitor.plateSeparationProperty.value;

        /*
         * Create field lines, working from the center outwards so that lines appear/disappear at edges of plate as
         * E_effective changes.
         */
        var length = this.modelViewTransform.modelToViewDeltaXYZ( 0, plateSeparation, 0 ).y;
        var direction = ( effectiveEField >= 0 ) ? CLBConstants.DIRECTION.DOWN : CLBConstants.DIRECTION.UP;
        var x = lineSpacing / 2;
        while ( x <= plateWidth / 2 ) {
          var z = lineSpacing / 2;
          while ( z <= plateDepth / 2 ) {

            // calculate position for the lines
            var y = 0;
            var line0Translation = this.modelViewTransform.modelToViewXYZ( x, y, z );
            var line1Translation = this.modelViewTransform.modelToViewXYZ( -x, y, z );
            var line2Translation = this.modelViewTransform.modelToViewXYZ( x, y, -z );
            var line3Translation = this.modelViewTransform.modelToViewXYZ( -x, y, -z );

            // add 4 lines, one for each quadrant
            drawEFieldLine( line0Translation, length, direction, context );
            drawEFieldLine( line1Translation, length, direction, context );
            drawEFieldLine( line2Translation, length, direction, context );
            drawEFieldLine( line3Translation, length, direction, context );

            z += lineSpacing;
          }
          x += lineSpacing;
        }
        // stroke the whole path
        context.strokeStyle = ARROW_COLOR;
        context.fillStyle = ARROW_COLOR;
        context.lineWidth = LINE_WIDTH;
        context.fill();
        context.stroke();
      }
    },

    /**
     * Gets the spacing of E-field lines. Higher E-field results in higher density,
     * therefore lower spacing. Density is computed for the minimum plate size.
     * @public
     *
     * @param {number} effectiveEField
     * @returns {number} spacing, in model coordinates
     */
    getLineSpacing: function( effectiveEField ) {
      if ( effectiveEField === 0 ) {
        return 0;
      }
      else {
        //REVIEW variable is redundant
        // sqrt looks best for a square plate
        var spacing = SPACING_CONSTANT / Math.sqrt( Math.abs( effectiveEField ) );
        return spacing;
      }
    }

  } );
} );
