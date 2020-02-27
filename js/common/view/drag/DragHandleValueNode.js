// Copyright 2015-2019, University of Colorado Boulder

/**
 * Value displayed on a drag handle.
 * The value is formatted, and its presentation is localizable.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Utils from '../../../../../dot/js/Utils.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import inherit from '../../../../../phet-core/js/inherit.js';
import merge from '../../../../../phet-core/js/merge.js';
import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import capacitorLabBasics from '../../../capacitorLabBasics.js';

// constants
const LABEL_FONT = new PhetFont( { weight: 'bold', size: 12 } );
const VALUE_FONT = new PhetFont( { size: 12 } );

// max width of text for the label and value, determined empirically
const LABEL_MAX_WIDTH = 100;
const VALUE_MAX_WIDTH = 80;

/**
 * @constructor
 *
 * @param {string} label
 * @param {number} value
 * @param {string} unitsPattern
 * @param {Object} [options]
 */
function DragHandleValueNode( label, value, unitsPattern, options ) {

  options = merge( { tandem: Tandem.OPTIONAL }, options );

  Node.call( this );

  // @private {string}
  this.unitsPattern = unitsPattern;

  const labelNode = new Text( label, { font: LABEL_FONT, maxWidth: LABEL_MAX_WIDTH } );
  this.addChild( labelNode );

  // @private
  this.valueNode = new RichText( '', {
    font: VALUE_FONT,
    maxWidth: VALUE_MAX_WIDTH,
    tandem: options.tandem.createTandem( 'valueNode' )
  } );
  this.addChild( this.valueNode );

  // layout: value below label, left-justified
  labelNode.translation = new Vector2( 0, 0 );
  this.valueNode.translation = new Vector2( 0, labelNode.bottom + 15 );

  this.setValue( value );
  this.mutate( options );
}

capacitorLabBasics.register( 'DragHandleValueNode', DragHandleValueNode );

export default inherit( Node, DragHandleValueNode, {

  /**
   * Set the value of the value node, formatting the number and the units to the pattern.
   * @public
   *
   * @param {number} value
   * @param {number} decimalPlaces
   */
  setValue: function( value, decimalPlaces ) {
    const formattedValue = Utils.toFixed( value, decimalPlaces /* one decimal place */ );
    this.valueNode.setText( StringUtils.fillIn( this.unitsPattern, {
      value: formattedValue
    } ) );
  }

} );