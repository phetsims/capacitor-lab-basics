// Copyright 2015-2019, University of Colorado Boulder

/**
 * Creates the 2D shape for a wire. Shapes are in the global view coordinate frame.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  const inherit = require( 'PHET_CORE/inherit' );
  const LineStyles = require( 'KITE/util/LineStyles' );
  const Shape = require( 'KITE/Shape' );

  /**
   * @constructor
   *
   * @param {Wire} wire
   * @param {CLBModelViewTransform3D} modelViewTransform
   */
  function WireShapeCreator( wire, modelViewTransform ) {
    // @private {Wire}
    this.wire = wire;

    // @private {CLBModelViewTransform3D}
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
      const self = this;

      // stroke styles for the wire shapes.
      const strokeStyles = new LineStyles( {
        lineWidth: 7,
        lineCap: 'round',
        lineJoin: 'round'
      } );

      const shapes = this.wire.segments.map( function( segment ) {
        const shape = Shape.lineSegment( segment.startPointProperty.value.toVector2(), segment.endPointProperty.value.toVector2() );
        return self.modelViewTransform.modelToViewShape( shape ).getStrokedShape( strokeStyles );
      } );
      return Shape.union( shapes );
    }
  } );
} );
