// Copyright 2014-2022, University of Colorado Boulder

/**
 * Visual representation of a DC battery, with a control for setting its voltage. Image flips when the polarity of the
 * voltage changes. Origin is at center of this node's bounding rectangle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import CapacitorConstants from '../../../../scenery-phet/js/capacitor/CapacitorConstants.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, Text } from '../../../../scenery/js/imports.js';
import VSlider from '../../../../sun/js/VSlider.js';
import capacitorLabBasics from '../../capacitorLabBasics.js';
import CapacitorLabBasicsStrings from '../../CapacitorLabBasicsStrings.js';
import CLBConstants from '../CLBConstants.js';
import BatteryGraphicNode from './BatteryGraphicNode.js';

// constants
const LABEL_FONT = new PhetFont( 12 );

const voltsPatternString = CapacitorLabBasicsStrings.voltsPattern;

class BatteryNode extends Node {
  /**
   * @param {Battery} battery
   * @param {RangeWithValue} voltageRange
   * @param {Tandem} tandem
   */
  constructor( battery, voltageRange, tandem ) {

    super( { tandem: tandem } );

    // battery image, scaled to match model dimensions
    const graphicNode = new Node( {
      scale: 0.30,
      children: [ BatteryGraphicNode.POSITIVE_UP ]
    } );
    this.addChild( graphicNode );

    // voltage slider
    const trackLength = 0.55 * graphicNode.bounds.height;
    const sliderNode = new VSlider( battery.voltageProperty, voltageRange, {
      trackSize: new Dimension2( 8, trackLength ),
      thumbSize: new Dimension2( 35, 20 ),
      thumbTouchAreaXDilation: 11,
      thumbTouchAreaYDilation: 11,
      majorTickLength: 18,
      thumbFill: 'rgb(255,237,53)',
      thumbFillHighlighted: 'rgb(71,207,255)', // same as default
      thumbStroke: 'rgb(191,191,191)',
      thumbLineWidth: 2,
      thumbCenterLineStroke: 'black',
      constrainValue: value => Utils.roundSymmetric( value * 20 ) / 20,
      endDrag: () => {
        if ( Math.abs( battery.voltageProperty.value ) < CLBConstants.BATTERY_VOLTAGE_SNAP_TO_ZERO_THRESHOLD ) {
          battery.voltageProperty.value = 0;
        }
      },
      tandem: tandem.createTandem( 'slider' )
    } );

    // function to create the tick mark labels using a string pattern.
    const createTickLabel = ( value, textFill, tandem ) => {
      const labelText = new Text( StringUtils.fillIn( voltsPatternString, { value: value } ), {
        font: LABEL_FONT,
        fill: textFill,
        cursor: 'arrow',
        maxWidth: graphicNode.width * 0.3,
        tandem: tandem
      } );
      return labelText;
    };
    // add the tick marks
    const maximumTickLabel = createTickLabel( voltageRange.max, 'black', tandem.createTandem( 'maximumTickLabelText' ) );
    const defaultTickLabel = createTickLabel( voltageRange.defaultValue, 'white', tandem.createTandem( 'defaultTickLabelText' ) );
    const minimumTickLabel = createTickLabel( voltageRange.min, 'white', tandem.createTandem( 'minimumTickLabelText' ) );
    sliderNode.addMajorTick( voltageRange.max, maximumTickLabel );
    sliderNode.addMajorTick( voltageRange.defaultValue, defaultTickLabel );
    sliderNode.addMajorTick( voltageRange.min, minimumTickLabel );

    this.addChild( sliderNode );

    // layout, set by visual inspection, depends on battery image.
    sliderNode.center = new Vector2( graphicNode.center.x + 5, graphicNode.center.y + 12 ); // sort of centered.

    // when battery polarity changes, change the battery image
    battery.polarityProperty.link( polarity => {
      if ( polarity === CapacitorConstants.POLARITY.POSITIVE ) {
        graphicNode.children = [ BatteryGraphicNode.POSITIVE_UP ];
        minimumTickLabel.fill = 'white';
        maximumTickLabel.fill = 'black';
      }
      else {
        graphicNode.children = [ BatteryGraphicNode.POSITIVE_DOWN ];
        minimumTickLabel.fill = 'black';
        maximumTickLabel.fill = 'white';
      }
    } );
  }
}

capacitorLabBasics.register( 'BatteryNode', BatteryNode );
export default BatteryNode;