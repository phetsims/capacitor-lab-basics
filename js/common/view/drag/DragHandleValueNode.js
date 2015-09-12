// Copyright 2002-2015, University of Colorado Boulder

/**
 * Value displayed on a drag handle.
 * The value is formatted, and its presentation is localizable.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Util = require( 'DOT/Util' );
  var SubSupText = require( 'SCENERY_PHET/SubSupText' );
  var Text = require( 'SCENERY/nodes/Text' );

  // constants
  var LABEL_FONT = new PhetFont( { weight: 'bold', size: 12 } );
  var VALUE_FONT = new PhetFont( { size: 12 } );

  // strings
  var pattern_0value1units = require( 'string!CAPACITOR_LAB_BASICS/pattern.0value.1units' );

  /**
   * Constructor for the DragHandleValueNode.
   *
   * @param {string} label
   * @param {number} value
   * @param {string} units
   * @param {Property.<boolean>} valueVisibleProperty
   * @constructor
   */
  function DragHandleValueNode( label, value, units, valueVisibleProperty ) {

    Node.call( this );
    var thisNode = this;

    this.units = units; // @private

    var labelNode = new Text( label, { font: LABEL_FONT } );
    this.addChild( labelNode );

    this.valueNode = new SubSupText( '', { font: VALUE_FONT } ); // @private
    this.addChild( this.valueNode );

    // layout: value below label, left-justified
    labelNode.translation = new Vector2( 0, 0 );
    this.valueNode.translation = new Vector2( 0, labelNode.bottom + 15 );

    this.setValue( value );

    // listen for visibility updates from the model.
    valueVisibleProperty.link( function( visible ) {
      thisNode.valueNode.visible = visible;
    } );

  }

  return inherit( Node, DragHandleValueNode, {

    /**
     * Set the value of the value node, formatting the number and the units to the pattern.
     *
     * @param value
     */
    setValue: function( value ) {
      var formattedValue = Util.toFixed( value, 1 /* one decimal place */ );
      this.valueNode.setText( StringUtils.format( pattern_0value1units, formattedValue, this.units ) );
    }

  } );
} );