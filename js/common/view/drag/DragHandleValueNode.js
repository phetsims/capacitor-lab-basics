// Copyright 2015-2022, University of Colorado Boulder

/**
 * Value displayed on a drag handle.
 * The value is formatted, and its presentation is localizable.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Utils from '../../../../../dot/js/Utils.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import merge from '../../../../../phet-core/js/merge.js';
import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import { Node, RichText, Text } from '../../../../../scenery/js/imports.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import capacitorLabBasics from '../../../capacitorLabBasics.js';

// constants
const LABEL_FONT = new PhetFont( { weight: 'bold', size: 12 } );
const VALUE_FONT = new PhetFont( { size: 12 } );

// max width of text for the label and value, determined empirically
const LABEL_MAX_WIDTH = 100;
const VALUE_MAX_WIDTH = 80;

class DragHandleValueNode extends Node {
  /**
   * @param {string} label
   * @param {number} value
   * @param {string} unitsPattern
   * @param {Object} [options]
   */
  constructor( label, value, unitsPattern, options ) {

    options = merge( { tandem: Tandem.OPTIONAL }, options );

    super();

    // @private {string}
    this.unitsPattern = unitsPattern;

    const labelNode = new Text( label, { font: LABEL_FONT, maxWidth: LABEL_MAX_WIDTH } );
    this.addChild( labelNode );

    // @private
    this.valueText = new RichText( '', {
      font: VALUE_FONT,
      maxWidth: VALUE_MAX_WIDTH,
      tandem: options.tandem.createTandem( 'valueText' )
    } );
    this.addChild( this.valueText );

    // layout: value below label, left-justified
    labelNode.translation = new Vector2( 0, 0 );
    this.valueText.translation = new Vector2( 0, labelNode.bottom + 15 );

    this.setValue( value );
    this.mutate( options );
  }


  /**
   * Set the value of the value node, formatting the number and the units to the pattern.
   * @public
   *
   * @param {number} value
   * @param {number} decimalPlaces
   */
  setValue( value, decimalPlaces ) {
    const formattedValue = Utils.toFixed( value, decimalPlaces /* one decimal place */ );
    this.valueText.setString( StringUtils.fillIn( this.unitsPattern, {
      value: formattedValue
    } ) );
  }
}

capacitorLabBasics.register( 'DragHandleValueNode', DragHandleValueNode );

export default DragHandleValueNode;