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
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/shape' );
  var Dimension2 = require( 'DOT/Dimension2' );

  // constants
  var ARROW_SIZE = new Dimension2( 10, 15 );
  var LINE_WIDTH = 2;
  var ARROW_COLOR = 'black';


  /**
   * Constructor for the EFieldLineNode.
   *
   * @param {number} length length of the line in view coordinates
   * @param {string} direction
   * @constructor
   */
  function EFieldLineNode( length, direction ) {

    // TODO: Extend Path.
    Node.call( this );

    // line, origin at center
    var lineNode = new Path( new Shape.lineSegment( 0, -length / 2, 0, length / 2 ), {
      stroke: ARROW_COLOR,
      lineWidth: LINE_WIDTH
    } );
    this.addChild( lineNode );

    // arrow, shape points "up", origin at center
    var w = ARROW_SIZE.width;
    var h = ARROW_SIZE.height;
    var arrowShape = new Shape()
      .moveTo( 0, -h / 2 ) // tip
      .lineTo( w / 2, h / 2 ) // clockwise
      .lineTo( -w / 2, h / 2 );
    //path.closePath();

    var arrowNode = new Path( arrowShape, {
      fill: ARROW_COLOR
    } );
    this.addChild( arrowNode );
    if ( direction === CLConstants.DIRECTION.DOWN ) {
      arrowNode.rotation = Math.PI;
    }

    // no additional layout needed, handled above by geometry specification

  }

  inherit( Node, EFieldLineNode );

  /**
   * Constructor for the EFieldNode.
   *
   * @param {Capacitor} capacitor
   * @param {CLModelViewTransform3D} modelViewTransform
   * @param {number} maxEffectiveEField
   * @constructor
   */
  function EFieldNode( capacitor, modelViewTransform, maxEffectiveEField ) {

    Node.call( this );
    var thisNode = this;

    this.capacitor = capacitor;
    this.modelViewTransform = modelViewTransform;
    this.maxEffectiveEField = maxEffectiveEField;

    this.parentNode = new Node();
    this.addChild( this.parentNode );

    capacitor.multilink( [ 'platesVoltage', 'plateSeparation', 'plateSize' ], function() {
      if ( thisNode.visible ) {
        thisNode.update();
      }
    } );
  }

  return inherit( Node, EFieldNode, {

    /**
     * Update the node when it becomes visible.  Overrides setVisible in Node.
     */
    setVisible: function( visible ) {
      Node.prototype.setVisible.call( this, visible );
      if ( visible ) {
        this.update();
      }
    },

    update: function() {

      // clear existing field lines
      this.parentNode.removeAllChildren();

      // compute density (spacing) of field lines
      var effectiveEField = this.capacitor.getEffectiveEField();
      var lineSpacing = this.getLineSpacing( effectiveEField );

      if ( lineSpacing > 0 ) {

        // relevant model values
        var plateWidth = this.capacitor.plateSize.width;
        var plateDepth = plateWidth;
        var plateSeparation = this.capacitor.plateSeparation;

        /*
         * Create field lines, working from the center outwards so that
         * lines appear/disappear at edges of plate as E_effective changes.
         */
        var length = this.modelViewTransform.modelToViewDeltaXYZ( 0, plateSeparation, 0 ).y;
        var direction = ( effectiveEField >= 0 ) ? CLConstants.DIRECTION.DOWN : CLConstants.DIRECTION.UP;
        var x = lineSpacing / 2;
        while ( x <= plateWidth / 2 ) {
          var z = lineSpacing / 2;
          while ( z <= plateDepth / 2 ) {

            // add 4 lines, one for each quadrant
            var lineNode0 = new EFieldLineNode( length, direction );
            var lineNode1 = new EFieldLineNode( length, direction );
            var lineNode2 = new EFieldLineNode( length, direction );
            var lineNode3 = new EFieldLineNode( length, direction );
            this.parentNode.addChild( lineNode0 );
            this.parentNode.addChild( lineNode1 );
            this.parentNode.addChild( lineNode2 );
            this.parentNode.addChild( lineNode3 );

            // position the lines
            var y = 0;
            lineNode0.translation = this.modelViewTransform.modelToViewXYZ( x, y, z );
            lineNode1.translation = this.modelViewTransform.modelToViewXYZ( -x, y, z );
            lineNode2.translation = this.modelViewTransform.modelToViewXYZ( x, y, -z );
            lineNode3.translation = this.modelViewTransform.modelToViewXYZ( -x, y, -z );

            z += lineSpacing;
          }
          x += lineSpacing;
        }
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