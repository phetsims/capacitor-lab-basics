// Copyright 2002-2015, University of Colorado Boulder

/**
 * Pseudo-3D representation of a box, using parallelograms.  Only the three visible faces are shown: top, front,
 * right side.  The top and right-side faces are foreshortened to give the illusion of distance between front and back
 * planes. Origin is at the center of the top face.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var BoxShapeCreator = require( 'CAPACITOR_LAB_BASICS/common/model/shapes/BoxShapeCreator' );

  // constants
  var LINE_WIDTH = 1;
  var STROKE = 'black';

  /**
   * Constructor for the BoxNode.
   *
   * @param {CLModelViewTransform3} modelViewTransform
   * @param {Color} color
   * @param {Bounds3} size
   * @constructor
   */
  function BoxNode( modelViewTransform, color, size ) {

    Node.call( this );

    this.shapeCreator = new BoxShapeCreator( modelViewTransform );
    this.size = size;

    // front faces
    this.topNode = new Path( this.shapeCreator.createTopFaceBounds3( size ), {
      fill: this.getTopColor( color ),
      lineWidth: LINE_WIDTH,
      stroke: STROKE
    } );
    this.frontNode = new Path( this.shapeCreator.createFrontFaceBounds3( size ), {
      fill: this.getFrontColor( color ),
      lineWidth: LINE_WIDTH,
      stroke: STROKE
    } );
    this.rightSideNode = new Path( this.shapeCreator.createRightSideFaceBounds3( size ), {
      fill: this.getSideColor( color ),
      lineWidth: LINE_WIDTH,
      stroke: STROKE
    } );

    // rendering order
    this.addChild( this.topNode );
    this.addChild( this.frontNode );
    this.addChild( this.rightSideNode );

  }

  return inherit( Node, BoxNode, {

    /**
     * Get color for the top of the capacitor.  Top color is the base color.
     *
     * @return {Color}
     */
    getTopColor: function( baseColor ) {
      return baseColor;
    },

    /**
     * Get the color for the front of the capacitor.  Front color is one shade darker
     *
     * @param {Color} baseColor
     * @return {Color}
     */
    getFrontColor: function( baseColor ) {
      return baseColor.darkerColor();
    },

    /**
     * Get the color for the side of the capacitor.  Side color is two shade darker.
     *
     * @param {Color} baseColor
     *
     */
    getSideColor: function( baseColor ) {
      return baseColor.darkerColor().darkerColor();
    },

    setColor: function( color ) {
      this.topNode.fill = this.getTopColor( color );
      this.frontNode.fill = this.getFrontColor( color );
      this.rightSideNode.fill = this.getSideColor( color );
    },

    updateShapes: function() {
      this.topNode.shape = this.shapeCreator.createTopFaceBounds3( this.size );
      this.frontNode.shape = this.shapeCreator.createFrontFaceBounds3( this.size );
      this.rightSideNode.shape = this.shapeCreator.createRightSideFaceBounds3( this.size );
    },

    /**
     * Set the size of this box.
     *
     * @param {Bounds3} size
     */
    setBoxSize: function( size ) {
      if ( !size.equals( this.size ) ) {
        this.size = size;
        this.updateShapes();
      }
    }
  } );
} );



