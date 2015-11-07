// Copyright 2015, University of Colorado Boulder

/**
 * Creates the 2D shape for a wire. Shapes are in the global view coordinate frame.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Shape = require( 'KITE/Shape' );
  var LineStyles = require( 'KITE/util/LineStyles' );

  /**
   * Constructor for WireShapeCreator.
   *
   * @param {Wire} wire
   * @param {ModelViewTransform2} modelViewTransform
   */
  function WireShapeCreator( wire, modelViewTransform ) {
    // @private
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

    createWireShape: function() {

      // stroke styles for the wire shapes.
      var strokeStyles = new LineStyles( {
        lineWidth: 7,
        lineCap: 'round',
        lineJoin: 'round'
      } );
      var wireShape = new Shape();

      // move to the start point of the first wire segment
      wireShape.moveToPoint( this.wire.segments[ 0 ].startPoint ).lineToPoint( this.wire.segments[ 0 ].endPoint );

      // go through the points 'tip to tail', assuming they are in the desired order
      for ( var i = 1; i < this.wire.segments.length; i++ ) {
        var currentSegment = this.wire.segments[ i ];
        wireShape.lineToPoint( currentSegment.endPoint );
      }

      // return a transformed shape defined by the stroke styles.
      wireShape = this.modelViewTransform.modelToViewShape( wireShape );
      wireShape = wireShape.getStrokedShape( strokeStyles );
      return wireShape;
    },

    /**
     * Create the shape for one wire segment.
     *
     * @param {WireSegment} segment
     * @returns {Shape}
     */
    createWireSegmentShape: function( segment /* thickness */ ) {
      var line = Shape.lineSegment( segment.startPoint.x, segment.startPoint.y, segment.endPoint.x, segment.endPoint.y );
      return this.modelViewTransform.modelToViewShape( line );
    },

    /**
     * Offset required to make 2 segments join seamlessly at a corner.  This is specific to strokeStyles of the wire
     * shape.
     *
     * @returns {number}
     */
    getCornerOffset: function() {
      return 0;
    },

    /**
     * Offset required to make a wire align properly with some endpoint (eg, a battery terminal).
     * This is specific to strokeStyles of the wire shape.
     *
     * @returns {number}
     */
    getEndOffset: function() {
      return this.wire.thickness / 2;
    }
  } );
} );