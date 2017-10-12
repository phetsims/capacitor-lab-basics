// Copyright 2015-2017, University of Colorado Boulder

/**
 * Creates the 2D shape for a wire. Shapes are in the global view coordinate frame.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg
 * @author Andrew Adare
 */
define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LineStyles = require( 'KITE/util/LineStyles' );
  var Shape = require( 'KITE/Shape' );

  /**
   * Constructor for WireShapeCreator.
   *
   * @param {Wire} wire
   * @param {CLBModelViewTransform3D} modelViewTransform
   */
  function WireShapeCreator( wire, modelViewTransform ) {
    // @private
    this.wire = wire;
    this.modelViewTransform = modelViewTransform;
  }

  capacitorLabBasics.register( 'WireShapeCreator', WireShapeCreator );

  return inherit( Object, WireShapeCreator, {

    /**
     * Create a wire shape.  Shape is generated from the stroked shape of the line
     * segments which are added together totp to tail.  This assumes that segments
     * are added pieced together in the correct order.
     * @public
     *
     * @returns {Shape}
     */
    createWireShape: function() {
      var self = this;

      // stroke styles for the wire shapes.
      var strokeStyles = new LineStyles( {
        lineWidth: 7,
        lineCap: 'round',
        lineJoin: 'round'
      } );

      var shapes = this.wire.segments.map( function( segment ) {
        var shape = Shape.lineSegment( segment.startPointProperty.value.toVector2(), segment.endPointProperty.value.toVector2() );
        return self.modelViewTransform.modelToViewShape( shape ).getStrokedShape( strokeStyles );
      } );
      return Shape.union( shapes );
    }
  } );
} );
