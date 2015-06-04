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
     * Create a wire shape by adding the shapes of each wire segment.  We cannot use constructional area geometry here,
     * but we can build up the total shape if we assume that each segment is a line.
     *
     * @return {Shape} wireShape
     */
    createWireShape: function() {
      // TODO: This should be tested.
      // Move to the initial position of the first segment.
      var wireShape = new Shape().moveToPoint( this.wire.segments.startPoint );
      this.wire.segments.forEach( function( segment ) {
        // Line to the end position of each subsequent line to draw the total circuit shape.
        wireShape.lineToPoint( segment.endPoint );
      } );
      return this.modelViewTransform.modelToViewShape( wireShape ); // TODO: mvt transform here or in view elements?
    },

    // Offset required to make 2 segments join seamlessly at a corner. This is specific to CAP_STYLE.
    getCornerOffset: function() {
      return 0;
    },

    // Offset required to make a wire align properly with some endpoint (eg, a battery terminal). This is specific to CAP_STYLE.
    getEndOffset: function() {
      return this.wire.thickness / 2;
    }
  } );
} );