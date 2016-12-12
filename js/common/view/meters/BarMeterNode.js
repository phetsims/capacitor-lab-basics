// Copyright 2016, University of Colorado Boulder

/**
 * Abstract base class for all bar meter nodes.
 * Origin is at the center-left of the vertical track at the base of the bar.
 *
 * The bar meter node is composed of a rectangular bar graph and a value node.  The composite parts are added to layout
 * boxes in the BarMeterPanel so that alignment can be perfectly set.
 *
 * @author Jesse Greenberg
 * @author Andrew Adare
 */
define( function( require ) {
  'use strict';

  // modules
  var BarNode = require( 'CAPACITOR_LAB_BASICS/common/view/meters/BarNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Line = require( 'SCENERY/nodes/Line' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var TandemText = require( 'TANDEM/scenery/nodes/TandemText' );
  var Util = require( 'DOT/Util' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  // phet-io modules
  var TNode = require( 'ifphetio!PHET_IO/types/scenery/nodes/TNode' );

  // constants
  var BASE_LINE_LENGTH = 25; // Length of vertical line at the origin (left end) of the bar
  var BAR_STROKE_COLOR = 'black';
  var BAR_LINE_WIDTH = 1;
  var VALUE_METER_SPACING = 7; // between right side of value text and left side of bar
  var VALUE_MAX_WIDTH = 60; // max width of value string for i18n

  // value display
  var VALUE_FONT = new PhetFont( 14 );
  var VALUE_COLOR = 'black';

  // strings
  var pattern0Value1UnitsString = require( 'string!CAPACITOR_LAB_BASICS/pattern.0value.1units' );

  /**
   * Constructor.
   *
   * @param {BarMeter} meter
   * @param {string} barColor - fill color of the BarMeter
   * @param {number} maxValue - model value at which the bar has max length
   * @param {string} unitsString - string representing units
   * @param {string} titleString - title string for the bar graph
   * @constructor
   */
  function BarMeterNode( meter, barColor, maxValue, unitsString, titleString, tandem ) {

    var self = this;

    this.maxValue = maxValue;

    this.meter = meter; // @private
    this.unitsString = unitsString; // @private
    this.titleString = titleString; // @public

    // @private vertical line that represents the base of this bar meter
    this.axisLine = new Line( 0, -BASE_LINE_LENGTH / 2, 0, BASE_LINE_LENGTH / 2, {
      stroke: BAR_STROKE_COLOR,
      lineWidth: BAR_LINE_WIDTH
    } );

    // @private bar node which represents the magnitude of the meter
    this.barNode = new BarNode( barColor, meter.valueProperty.get(), this.maxValue );

    // @public value with hundredths precision and units, set in setValue()
    this.valueTextNode = new TandemText( '', {
      font: VALUE_FONT,
      fill: VALUE_COLOR,
      maxWidth: VALUE_MAX_WIDTH,
      tandem: tandem.createTandem( 'valueText' )
    } );

    // @public arrow node used to indicate when the value has gone beyond the scale of this meter
    this.arrowNode = new ArrowNode( 0, 0, this.barNode.barSize.height + 2, 0, {
      fill: barColor,
      headWidth: this.barNode.barSize.height + 5,
      tailWidth: 12,
      stroke: 'black',
      tandem: tandem.createTandem( 'arrowNode' )
    } );

    Node.call( this );
    this.axisLine.children = [ this.valueTextNode, this.barNode, this.arrowNode ];
    this.addChild( this.axisLine );

    // observers
    meter.valueProperty.link( function( value ) {
      self.setValue( value );
      self.updateArrow();
    } );

    // visibility
    meter.visibleProperty.link( function( visible ) {
      self.visible = visible;
    } );

    this.updateLayout();

    // Register with tandem.  No need to handle dispose/removeInstance since this
    // exists for the lifetime of the simulation.
    tandem.addInstance( this, TNode );
  }

  capacitorLabBasics.register( 'BarMeterNode', BarMeterNode );

  return inherit( Node, BarMeterNode, {

    /**
     * Sets the color used to fill the bar and the overload indicator arrow.
     *
     * @param color
     */
    setBarColor: function( color ) {
      this.barNode.fill = color;
      this.arrowNode.fill = color;
    },

    /**
     * Sets the value displayed by the meter.
     * Updates the bar and the value below the meter.
     *
     * @param {number} value
     */
    setValue: function( value ) {

      assert && assert( value >= 0, 'value must be >= 0 : ' + value );

      if ( value !== this.value ) {

        this.value = value;

        // update components
        this.barNode.setValue( value );

        // all meters read in pico units, compensate by multiplying by 10^12
        var meterValue = Util.toFixed( Math.pow( 10, 12 ) * value, 2 );
        var unitsFormatString = StringUtils.format( pattern0Value1UnitsString, meterValue, this.unitsString );
        this.valueTextNode.setText( unitsFormatString );

        // layout
        this.updateLayout;
      }
    },

    /**
     * Update the overload indicator arrow visibility and position.
     */
    updateArrow: function() {
      // update position
      this.arrowNode.left = this.barNode.right + VALUE_METER_SPACING;

      // update visibility
      this.arrowNode.visible = Math.abs( this.meter.valueProperty.get() ) > this.maxValue;
    },

    updateLayout: function() {
      this.barNode.leftCenter = this.axisLine.leftCenter;
      this.valueTextNode.rightCenter = this.axisLine.leftCenter.minusXY( VALUE_METER_SPACING, 0 );
    }

  } );
} );
