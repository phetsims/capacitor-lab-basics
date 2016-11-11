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
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var Vector2 = require( 'DOT/Vector2' );

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

  capacitorLabBasics.register( 'WireShapeCreator', WireShapeCreator );

  return inherit( Object, WireShapeCreator, {

    /**
     * Create a wire shape.  Shape is generated from the stroked shape of the line
     * segments which are added together totp to tail.  This assumes that segments
     * are added pieced together in the correct order.
     * @return {Shape}
     */
    createWireShape: function() {

      // stroke styles for the wire shapes.
      var strokeStyles = new LineStyles( {
        lineWidth: 7,
        lineCap: 'round',
        lineJoin: 'round'
      } );
      var wireShape = new Shape();

      // Move to the start point of the first wire segment.
      var segment = this.wire.segments[ 0 ];

      // Model coords are 3D; view is in 2D
      var startPoint = segment.startPointProperty.value.toVector2();
      var endPoint = segment.endPointProperty.value.toVector2();

      wireShape.moveToPoint( startPoint ).lineToPoint( endPoint );

      // go through the points 'tip to tail', assuming they are in the desired order
      for ( var i = 1; i < this.wire.segments.length; i++ ) {
        var currentSegment = this.wire.segments[ i ];
        wireShape.lineToPoint( new Vector2(
          currentSegment.endPointProperty.value.x,
          currentSegment.endPointProperty.value.y ) );
      }

      // return a transformed shape defined by the stroke styles.
      wireShape = this.modelViewTransform.modelToViewShape( wireShape );
      wireShape = wireShape.getStrokedShape( strokeStyles );
      return wireShape;
    }
  } );
} );
