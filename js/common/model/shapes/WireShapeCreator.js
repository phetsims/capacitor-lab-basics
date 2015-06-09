// Copyright 2002-2015, University of Colorado Boulder

/**
 * Creates the 2D shape for a wire. Shapes are in the global view coordinate frame.
 *
 * TODO: See about extending Shape for all of these types.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Shape = require( 'KITE/Shape' );
  //var Line = require( 'KITE/segments/Line' );


  // constants
  // Determines how the wires are capped. If you change this, you'll need to fiddle with getEndOffset and getCornerOffset.
  //var CAP_STYLE = BasicStroke.CAP_ROUND;

  /**
   * Constructor for WireShapeCreator.
   *
   * @param {Wire} wire
   * @param {ModelViewTransform2} modelViewTransform
   */
  function WireShapeCreator( wire, modelViewTransform ) {
    this.wire = wire;
    this.modelViewTransform = modelViewTransform;
  }

  return inherit( Object, WireShapeCreator, {

    /**
     * Create a wire shape by adding the shapes of each wire segment.
     *
     * We cannot use constructional area geometry here, so a new solution is necessary.  This will construct the shape
     * of each line and return an array of line shapes.  WireNode will then construct the Path for each segment
     * in the array of lines.
     *
     * @return {Array.<Shape>} lineShapes
     */
    createWireShapes: function() {
      // TODO: This should be tested.
      var thisShapeCreator = this; // extend scope for nested callbacks.
      var lineShapes = [];
      this.wire.segments.forEach( function( segment ) {
        lineShapes.push( thisShapeCreator.createWireSegmentShape( segment ) );
      } );
      return lineShapes;
    },

    /**
     * Create the shape for one wire segment.
     *
     * @param {WireSegment} segment
     * @returns {Shape}
     */
    createWireSegmentShape: function( segment /*, thickness */ ) {
      var line = new Shape.lineSegment( segment.startPoint.x, segment.startPoint.y, segment.endPoint.x, segment.endPoint.y );
      //var stroke = new BasicStroke( (float) thickness, CAP_STYLE, BasicStroke.JOIN_MITER );
      //var s = new Area( stroke.createStrokedShape( line ) );
      return this.modelViewTransform.modelToViewShape( line );
    },

    // Offset required to make 2 segments join seamlessly at a corner. This is specific to CAP_STYLE.
    getCornerOffset: function() {
      return 0;
    },

    // Offset required to make a wire align properly with some endpoint (eg, a battery terminal). This is specific to CAP_STYLE.
    getEndOffset: function() {
      //return 0;
      return this.wire.thickness / 2;
    }
  } );
} );