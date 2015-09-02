// Copyright 2002-2015, University of Colorado Boulder

/**
 * A wire switch is a collection of wire segments that create the functionality and appearance of a circuit switch.
 * The switch is composed of three wire segments and has two possible states, open and closed, as shown below.
 *
 * The closed switch looks like a straight wire:
 *
 * --------------------
 *
 * The open switch looks like on open circuit with an extended wire segment:
 *
 *          \
 *           \
 * -----      \--------
 *
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Wire = require( 'CAPACITOR_LAB_BASICS/common/model/wire/Wire' );
  var WireSegment = require( 'CAPACITOR_LAB_BASICS/common/model/wire/WireSegment' );

  /**
   * Constructor for a Wire.
   */
  function WireSwitch( modelViewTransform, thickness, startPoint, componentSpacing, connectionType ) {

    debugger;
    var segments = [];
    this.connectiontype = connectionType;
    this.componentSpacing = componentSpacing;

    // create the left and right horizontal segments of the switch.
    segments.push( new WireSegment( startPoint, startPoint.plusXY( componentSpacing / 3, 0 ) ) );
    segments.push( new WireSegment( startPoint.plusXY( componentSpacing * 2 / 3, 0 ), startPoint.plusXY( componentSpacing, 0 ) ) );

    // create the 'switch', starting point is the left edge of the segment
    var xOffset = Math.cos( Math.PI / 4 ) * ( componentSpacing / 3 );
    var yOffset = Math.sin( Math.PI / 4 ) * ( componentSpacing / 3 );
    this.switchSegment = new WireSegment( startPoint.plusXY( ( componentSpacing * 2 / 3 ) - xOffset, -yOffset ), startPoint.plusXY( componentSpacing * 2 / 3, 0 ) );
    segments.push( this.switchSegment );

    Wire.call( this, modelViewTransform, thickness, segments );

  }

  return inherit( Wire, WireSwitch, {

    update: function( circuitConnection ) {



    }
  } );
} );