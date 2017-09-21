// Copyright 2015-2017, University of Colorado Boulder

/**
 * Value displayed on a drag handle.
 * The value is formatted, and its presentation is localizable.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var LABEL_FONT = new PhetFont( { weight: 'bold', size: 12 } );
  var VALUE_FONT = new PhetFont( { size: 12 } );

  // max width of text for the label and value, determined empirically
  var LABEL_MAX_WIDTH = 100;
  var VALUE_MAX_WIDTH = 80;

  // strings
  var pattern0Value1UnitsString = require( 'string!CAPACITOR_LAB_BASICS/pattern.0value.1units' );

  /**
   * Constructor for the DragHandleValueNode.
   *
   * @param {string} label
   * @param {number} value
   * @param {string} units
   * @constructor
   */
  function DragHandleValueNode( label, value, units ) {

    Node.call( this );

    this.units = units; // @private

    var labelNode = new Text( label, { font: LABEL_FONT, maxWidth: LABEL_MAX_WIDTH } );
    this.addChild( labelNode );

    this.valueNode = new RichText( '', { font: VALUE_FONT, maxWidth: VALUE_MAX_WIDTH } ); // @private
    this.addChild( this.valueNode );

    // layout: value below label, left-justified
    labelNode.translation = new Vector2( 0, 0 );
    this.valueNode.translation = new Vector2( 0, labelNode.bottom + 15 );

    this.setValue( value );

  }

  capacitorLabBasics.register( 'DragHandleValueNode', DragHandleValueNode );

  return inherit( Node, DragHandleValueNode, {

    /**
     * Set the value of the value node, formatting the number and the units to the pattern.
     *
     * @param value
     * @public
     */
    setValue: function( value, decimalPlaces ) {
      var formattedValue = Util.toFixed( value, decimalPlaces /* one decimal place */ );
      this.valueNode.setText( StringUtils.format( pattern0Value1UnitsString, formattedValue, this.units ) );
    }

  } );
} );