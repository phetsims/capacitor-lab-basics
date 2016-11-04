// Copyright 2016, University of Colorado Boulder

/**
 * Abstract base class for all bar meter nodes.  Factory functions allow for creating all specific meter subclasses.
 * Origin is at the center-left of the vertical track at the base of the bar.
 *
 * The bar meter node is composed of a rectangular bar graph and a value node.  The composite parts are added to layout
 * boxes in the BarMeterPanel so that alignment can be perfectly set.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var TandemText = require( 'TANDEM/scenery/nodes/TandemText' );
  var Util = require( 'DOT/Util' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  // phet-io modules
  var TNode = require( 'ifphetio!PHET_IO/types/scenery/nodes/TNode' );

  // constants
  var BASE_LINE_LENGTH = 25;
  var BAR_SIZE = new Dimension2( 255, 18 );
  var BASE_LINE_OFFSET = ( BASE_LINE_LENGTH - BAR_SIZE.height ) / 2;
  var BAR_STROKE_COLOR = 'black';
  var BAR_LINE_WIDTH = 1;
  var VALUE_METER_SPACING = 7;
  var VALUE_MAX_WIDTH = 45; // max width for i18n

  // value display
  var VALUE_FONT = new PhetFont( 12 );
  var VALUE_COLOR = 'black';

  // strings
  var capacitanceString = require( 'string!CAPACITOR_LAB_BASICS/capacitance' );
  var storedEnergyString = require( 'string!CAPACITOR_LAB_BASICS/storedEnergy' );
  var plateChargeString = require( 'string!CAPACITOR_LAB_BASICS/plateCharge' );
  var unitsPicoFaradsString = require( 'string!CAPACITOR_LAB_BASICS/units.picoFarads' );
  var unitsPicoCoulombsString = require( 'string!CAPACITOR_LAB_BASICS/units.picoCoulombs' );
  var unitsPicoJoulesString = require( 'string!CAPACITOR_LAB_BASICS/units.picoJoules' );
  var pattern0Value1UnitsString = require( 'string!CAPACITOR_LAB_BASICS/pattern.0value.1units' );

  /**
   * Constructor.
   *
   * @param {BarMeter} meter
   * @param {string} barColor - fill color of the BarMeter
   * @param {number} exponent - used to set the scale for the meter graph
   * @param {string} unitsString - string representing units
   * @param {string} titleString - title string for the bar graph
   * @constructor
   */
  function BarMeterNode( meter, barColor, exponent, unitsString, titleString, tandem ) {

    var self = this;

    this.maxValue = Math.pow( 10, exponent ); // max value for this meter

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
    this.arrowNode = new ArrowNode( 0, 0, BAR_SIZE.height + 2, 0, {
      fill: barColor,
      headWidth: BAR_SIZE.height + 5,
      tailWidth: 12,
      stroke: 'black'
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

  inherit( Node, BarMeterNode, {

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
        var meterValue = Util.toFixed( Math.pow( 10, 12 ) * this.meter.value, 2 );
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
      this.arrowNode.visible = Math.abs( this.meter.value ) > this.maxValue;
    },

    updateLayout: function() {
      this.barNode.leftCenter = this.axisLine.leftCenter;
      this.valueTextNode.rightCenter = this.axisLine.leftCenter.minusXY( VALUE_METER_SPACING, 0 );
    },

    getMaxWidth: function() {
      return BAR_SIZE.width + BASE_LINE_LENGTH * 2 + BASE_LINE_OFFSET + VALUE_METER_SPACING;
    }
  }, {

    // factory functions to construct different tpes of MeterNodes
    /**
     * Factory constructor for a BarMeterNode.
     *
     * @param {CapacitanceMeter} meter
     * @param {Tandem} tandem
     * @constructor
     */
    createCapacitanceBarMeterNode: function( meter, tandem ) {
      return new BarMeterNode(
        meter,
        CLBConstants.CAPACITANCE_COLOR,
        CLBConstants.CAPACITANCE_METER_VALUE_EXPONENT,
        unitsPicoFaradsString,
        capacitanceString,
        tandem );
    },
    /**
     * Factory constructor for a PlateChargeBarMeterNode.
     *
     * @param {CapacitanceMeter} meter
     * @constructor
     */
    createPlateChargeBarMeterNode: function( meter, tandem ) {
      return new PlateChargeBarMeterNode( meter, tandem );
    },
    /**
     * Factory constructor for a BarMeterNode.
     *
     * @param {CapacitanceMeter} meter
     * @constructor
     */
    createStoredEnergyBarMeterNode: function( meter, tandem ) {
      return new BarMeterNode(
        meter,
        CLBConstants.STORED_ENERGY_COLOR,
        CLBConstants.STORED_ENERGY_METER_VALUE_EXPONENT,
        unitsPicoJoulesString,
        storedEnergyString,
        tandem );
    }
  } );

  /**
   * Constructor for a BarNode. The bar which indicates the magnitude of the value being read by the meter. Origin is
   * at upper left of track.
   *
   * @param {string} barColor
   * @param {number} maxValue
   * @param {number} value
   * @constructor
   */
  function BarNode( barColor, value, maxValue ) {

    assert && assert( value >= 0, 'value must be >= 0 : ' + value );

    this.value = value;
    this.maxValue = maxValue;

    Rectangle.call( this, 0, 0, BAR_SIZE.width, BAR_SIZE.height, {
      fill: barColor,
      stroke: BAR_STROKE_COLOR,
      lineWidth: BAR_LINE_WIDTH
    } );

    this.update();

  }

  capacitorLabBasics.register( 'BarMeterNode.BarNode', BarNode );

  inherit( Rectangle, BarNode, {

    setValue: function( value ) {

      assert && assert( value >= 0, 'value must be >= 0 : ' + value );

      if ( value !== this.value ) {
        this.value = value;
        this.update();
      }
    },

    update: function() {
      var percent = Math.min( 1, Math.abs( this.value ) / this.maxValue );
      var x = ( 1 - percent ) * BAR_SIZE.width;
      var width = BAR_SIZE.width - x;
      this.setRect( 0, -BASE_LINE_LENGTH / 2 + BASE_LINE_OFFSET, width, BAR_SIZE.height );
    }

  } );

  /**
   * Constructor for the PlateChargeMeterNode.  This needs its own subclass because this node requires a unique
   * setValue function.
   *
   * @param {PlateChargeMeter} meter
   * @constructor
   */
  function PlateChargeBarMeterNode( meter, tandem ) {
    BarMeterNode.call(
      this,
      meter,
      CLBConstants.POSITIVE_CHARGE_COLOR,
      CLBConstants.PLATE_CHARGE_METER_VALUE_EXPONENT,
      unitsPicoCoulombsString,
      plateChargeString,
      tandem
    );
  }

  capacitorLabBasics.register( 'PlateChargeBarMeterNode', PlateChargeBarMeterNode );

  inherit( BarMeterNode, PlateChargeBarMeterNode, {

    // This meter displays absolute value, and changes color to indicate positive or negative charge.
    setValue: function( value ) {
      BarMeterNode.prototype.setValue.call( this, Math.abs( value ) );
      this.setBarColor( ( value >= 0 ) ? CLBConstants.POSITIVE_CHARGE_COLOR : CLBConstants.NEGATIVE_CHARGE_COLOR );
    }
  } );

  return BarMeterNode;
} );
