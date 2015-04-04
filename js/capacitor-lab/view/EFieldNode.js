// Copyright 2002-2015, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  
  // constants
  // Minimum number of electric field lines
  var MIN_LINES = 4;
  // Maximum number of electric field lines
  var MAX_LINES = 900;
  // Maximum electric field (V/m)
  var MAX_E_FIELD = 6000;
  
  /**
   * Constructor for an electric field line, starting at (x, y)
   * Draws a line with an arrow in the middle; direction of arrow depends on the electric field
   * @param {CapacitorLabModel} model
   * @param {number} arrowLength: the distance between capacitor plates
   * @param {number} plateSeparationScale: the scale to convert the plate separation property value to pixels
   * @param {number} plateDepth: the thickness of the front of the capacitor plate
   * @param {number} x: the x-value where the field line starts
   * @param {number} y: the y-value where the field line starts
   **/
  function EFieldLineNode( model, arrowLength, plateSeparationScale, plateDepth, x, y ) {
    Node.call( this );
    
    var thisNode = this;
    
    // black rectangle, forms half of the arrow
    var rect = new Rectangle( x, y + arrowLength, 2, -arrowLength / 2 - 10, 0, 0, {
      fill: 'black',
      centerX: x,
      stroke: 'black',
      lineWidth: 1
    } );
    // black arrow, forms the other half and shows the direction of the electric field
    var arrow = new ArrowNode( x, y, x, y + arrowLength / 2, {
      tailWidth: 2,
      headWidth: 14,
      headHeight: 16,
      fill: 'black',
      centerX: x,
    } );
    if (model.eFieldProperty.value < 0) {
      rect = new Rectangle( x, y, 2, arrowLength / 2 + 10, 0, 0, {
        fill: 'black',
        centerX: x,
        stroke: 'black',
        lineWidth: 1
      } );
      arrow = new ArrowNode( x, y + arrowLength, x, y + arrowLength / 2, {
        tailWidth: 2,
        headWidth: 14,
        headHeight: 16,
        fill: 'black',
        centerX: x,
      } );
    }
    thisNode.addChild( rect );
    thisNode.addChild( arrow );
    
    model.plateSeparationProperty.link( function () {
      arrowLength = 2 * model.plateSeparationProperty.value * plateSeparationScale - plateDepth;
      if (model.eFieldProperty.value < 0) {
        rect.setRect( x, y, 2, arrowLength / 2 + 10, 0, 0 );
        arrow.setTailAndTip( x, y + arrowLength, x, y + arrowLength / 2 );
      }
      else {
        rect.setRect( x, y + arrowLength / 2 - 10, 2, arrowLength / 2 + 10, 0, 0 );
        arrow.setTailAndTip( x, y, x, y + arrowLength / 2 );
      }
    } );
  }
  
  inherit( Node, EFieldLineNode );

  /**
   * Constructor for the electric field, a collection of electric field lines
   * @param {CapacitorLabModel} model
   * @param {number} arrowLength: the distance between capacitor plates
   * @param {number} plateSeparationScale: the scale to convert the plate separation property value to pixels
   * @param {PlateNode} plate: a capacitor plate of the PlateNode class
   **/
  function EFieldNode( model, arrowLength, plateSeparationScale, plate, options ) {
    Node.call( this, options );
    
    var thisNode = this;
    
    // draws a vector arrow from the point (x, y) to the point (x, y+arrowLength) 
    function drawVectorAtPoint( x, y ) {
      thisNode.addChild( new EFieldLineNode( model, arrowLength, plateSeparationScale, plate.plateDepth, x, y ));
    }
    
    function getNumberOfLines() {
      var numLines = Math.round( MAX_LINES * Math.abs(model.eFieldProperty.value) / MAX_E_FIELD );
      if ( Math.abs(model.eFieldProperty.value) > 0 && numLines < MIN_LINES ) {
        numLines = MIN_LINES;
      }
      return numLines;
    }
    
    function getLineSpacing() {
      if ( Math.abs(model.eFieldProperty.value) === 0 ) {
        return 0;
      }
      else {
        var numLines = getNumberOfLines();
        return plate.minPlateWidth / Math.sqrt(numLines);
      }
    }
    
    function updateGrid() {
      thisNode.removeAllChildren();
      var lineSpacing = getLineSpacing();
      if ( lineSpacing > 0 ) {
        var plateWidth = plate.plateWidth;
        var plateDepth = plateWidth;
        var x = lineSpacing / 2;
        while (x <= plateWidth / 2) {
          var y = lineSpacing / 2;
          while (y <= plateDepth / 2) {
            var b = Math.abs( plate.plateHeight * y / plateDepth );
            var a = Math.abs( b * plate.plateShift / plate.plateHeight ) ;
            
            drawVectorAtPoint( x - a, b );
            drawVectorAtPoint( -x - a, b );
            drawVectorAtPoint( x + a, -b );
            drawVectorAtPoint( -x + a, -b );
            y += lineSpacing;
          }
          x += lineSpacing;
        }
      }
    }
    
    model.eFieldVisibleProperty.link( function () {
      thisNode.visible = model.eFieldVisibleProperty.value;
      if (thisNode.visible) {
        updateGrid();
      }
    } );
    
    model.capacitorPlateAreaProperty.link( function () {
      if (thisNode.visible) {
        updateGrid();
      }
    } );
    
    model.eFieldProperty.link( function() {
      if (thisNode.visible) {
        updateGrid();
      }
    } );
  }

  return inherit( Node, EFieldNode );
} );