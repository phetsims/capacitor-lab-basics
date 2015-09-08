// Copyright 2002-2015, University of Colorado Boulder

/**
 * Visual representation of the effective E-field (E_effective) between the capacitor plates.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Emily Randal
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  //modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var CLConstants = require( 'CAPACITOR_LAB_BASICS/common/CLConstants' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var CanvasNode = require( 'SCENERY/nodes/CanvasNode' );

  // constants
  var ARROW_SIZE = new Dimension2( 10, 15 );
  var LINE_WIDTH = 2;
  var ARROW_COLOR = 'black';

  /**
   * Draw an EField line using with canvas.
   *
   * @param {Vector2} position - origin, at the center of the line
   * @param {number} length length of the line in view coordinates
   * @param {string} direction
   * @param {CanvasRenderingContext2D} context
   */
  function drawEFieldLine( position, length, direction, context ) {

    // line, origin at center
    context.moveTo( position.x, position.y - length / 2 );
    context.lineTo( position.x, position.y + length / 2 );

    // pull out for readability
    var w = ARROW_SIZE.width;
    var h = ARROW_SIZE.height;

    // make sure that the arrow path is centered along the field line.
    // dividing by 4 aligns better than dividing by 2 for the narrow line width.
    var xOffset = LINE_WIDTH / 4;
    var arrowCenter = position.x + xOffset;

    // path for the UP arrow
    if ( direction === CLConstants.DIRECTION.UP ) {
      context.moveTo( arrowCenter, position.y - h / 2 );
      context.lineTo( arrowCenter + w / 2, position.y + h / 2 );
      context.lineTo( arrowCenter - w / 2, position.y + h / 2 );
    }

    // path for the DOWN arrow
    else if ( direction === CLConstants.DIRECTION.DOWN ) {
      context.moveTo( arrowCenter, position.y + h / 2 );
      context.lineTo( arrowCenter - w / 2, position.y - h / 2 );
      context.lineTo( arrowCenter + w / 2, position.y - h / 2 );
    }

    else { console.error( 'EFieldLine must be of orientation UP or DOWN' ); }

  }

  /**
   * Constructor for the EFieldNode.
   *
   * @param {Capacitor} capacitor
   * @param {CLModelViewTransform3D} modelViewTransform
   * @param {number} maxEffectiveEField
   * @param {Bounds2} canvasBounds
   * @constructor
   */
  function EFieldNode( capacitor, modelViewTransform, maxEffectiveEField, canvasBounds ) {

    CanvasNode.call( this, { canvasBounds: canvasBounds } );
    var thisNode = this;

    this.capacitor = capacitor;
    this.modelViewTransform = modelViewTransform;
    this.maxEffectiveEField = maxEffectiveEField;

    capacitor.multilink( [ 'platesVoltage', 'plateSeparation', 'plateSize' ], function() {
      if ( thisNode.visible ) {
        thisNode.invalidatePaint();
      }
    } );
  }

  return inherit( CanvasNode, EFieldNode, {

    /**
     * Update the node when it becomes visible.  Overrides setVisible in Node.
     */
    setVisible: function( visible ) {
      Node.prototype.setVisible.call( this, visible );
      if ( visible ) {
        this.invalidatePaint();
      }
    },

    paintCanvas: function( wrapper ) {

      var context = wrapper.context;

      // compute density (spacing) of field lines
      var effectiveEField = this.capacitor.getEffectiveEField();
      var lineSpacing = this.getLineSpacing( effectiveEField );

      if ( lineSpacing > 0 ) {

        context.beginPath();

        // relevant model values
        var plateWidth = this.capacitor.plateSize.width;
        var plateDepth = plateWidth;
        var plateSeparation = this.capacitor.plateSeparation;

        /*
         * Create field lines, working from the center outwards so that lines appear/disappear at edges of plate as
         * E_effective changes.
         */
        var length = this.modelViewTransform.modelToViewDeltaXYZ( 0, plateSeparation, 0 ).y;
        var direction = ( effectiveEField >= 0 ) ? CLConstants.DIRECTION.DOWN : CLConstants.DIRECTION.UP;
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
     * Gets the spacing of E-field lines. Higher E-field results in higher density, therefore lower spacing. Density is
     * computed for the minimum plate size.
     *
     * @param {number} effectiveEField
     * @return {number} spacing, in model coordinates
     */
    getLineSpacing: function( effectiveEField ) {
      if ( effectiveEField === 0 ) {
        return 0;
      }
      else {
        var numberOfLines = this.getNumberOfLines( effectiveEField );
        return CLConstants.PLATE_WIDTH_RANGE.min / Math.sqrt( numberOfLines ); // assumes a square plate!;
      }
    },

    /**
     * Computes number of lines to put on the smallest plate, linearly proportional to plate charge.
     */
    getNumberOfLines: function( effectiveEField ) {
      var absEField = Math.abs( effectiveEField );
      var numberOfLines = Math.floor( CLConstants.NUMBER_OF_EFIELD_LINES.max * absEField / this.maxEffectiveEField );
      if ( absEField > 0 && numberOfLines < CLConstants.NUMBER_OF_EFIELD_LINES.min ) {
        numberOfLines = CLConstants.NUMBER_OF_EFIELD_LINES.min;
      }
      return numberOfLines;
    }

  } );
} );