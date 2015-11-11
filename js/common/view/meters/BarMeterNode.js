// Copyright 2014-2015, University of Colorado Boulder

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
  var CLConstants = require( 'CAPACITOR_LAB_BASICS/common/CLConstants' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );

  // constants
  var BASE_LINE_LENGTH = 25;
  var BAR_SIZE = new Dimension2( 255, 18 );
  var BASE_LINE_OFFSET = ( BASE_LINE_LENGTH - BAR_SIZE.height ) / 2;
  var BAR_STROKE_COLOR = 'black';
  var BAR_LINE_WIDTH = 1;
  var VALUE_METER_SPACING = 7;

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
  var accessibleCapacitanceGraphString = require( 'string!CAPACITOR_LAB_BASICS/accessible.capacitanceGraph' );
  var accessibleChargeGraphString = require( 'string!CAPACITOR_LAB_BASICS/accessible.chargeGraph' );
  var accessibleEnergyGraphString = require( 'string!CAPACITOR_LAB_BASICS/accessible.energyGraph' );
  var accessibleGraphString = require( 'string!CAPACITOR_LAB_BASICS/accessible.graph' );

  /**
   * Constructor.
   *
   * @param {BarMeter} meter
   * @param {string} barColor - fill color of the BarMeter
   * @param {number} exponent - used to set the scale for the meter graph
   * @param {string} unitsString - string representing units
   * @param {string} titleString - title string for the bar graph
   * @param {string} descriptionString - description for aria
   * @param {string} tabIndex - tab index for accessibility
   * @constructor
   */
  function BarMeterNode( meter, barColor, exponent, unitsString, titleString, descriptionString, tabIndex ) {

    var thisNode = this;

    this.maxValue = Math.pow( 10, exponent ); // max value for this meter

    this.meter = meter; // @private
    this.unitsString = unitsString; // @private
    this.titleString = titleString; // @public
    this.descriptionString = descriptionString; // @private

    // @private vertical line that represents the base of this bar meter
    this.axisLine = new Line( 0, -BASE_LINE_LENGTH / 2, 0, BASE_LINE_LENGTH / 2, {
      stroke: BAR_STROKE_COLOR,
      lineWidth: BAR_LINE_WIDTH
    } );

    // @private bar node which represents the magnitude of the meter
    this.barNode = new BarNode( barColor, meter.value, this.maxValue );

    // @public value with hundredths precision and units, set in setValue()
    this.valueNode = new Text( '', {
      font: VALUE_FONT,
      fill: VALUE_COLOR
    } );

    // @public arrow node used to indicate when the value has gone beyond the scale of this meter
    this.arrowNode = new ArrowNode( 0, 0, BAR_SIZE.height + 2, 0, {
      fill: barColor,
      headWidth: BAR_SIZE.height + 5,
      tailWidth: 12,
      stroke: 'black'
    } );

    Node.call( this );
    this.axisLine.children = [ this.valueNode, this.barNode, this.arrowNode ];
    this.addChild( this.axisLine );

    // observers
    meter.valueProperty.link( function( value ) {
      thisNode.setValue( value );
      thisNode.updateArrow();
    } );

    // visibility
    meter.visibleProperty.link( function( visible ) {
      thisNode.visible = visible;
    } );

    this.updateLayout();

    // add the accessible content
    this.accessibleContent = {
      createPeer: function( accessibleInstance ) {
        var trail = accessibleInstance.trail;
        var domElement = document.createElement( 'div' );
        
        var graphDescription = document.createElement( 'p' );
        graphDescription.innerText = StringUtils.format( accessibleGraphString, titleString );
        
        var valueDescription = document.createElement( 'p' );
        var meterValue = Util.toFixed( Math.pow( 10, 12 ) * meter.value, 2 );
        valueDescription.innerText = StringUtils.format( descriptionString, meterValue );
        
        domElement.appendChild( graphDescription );
        domElement.appendChild( valueDescription );
        
        domElement.setAttribute( 'aria-describedby', StringUtils.format( accessibleGraphString, titleString ) );
        domElement.setAttribute( 'aria-live', 'polite' );

        domElement.tabIndex = tabIndex;

        var accessiblePeer = new AccessiblePeer( accessibleInstance, domElement );
        domElement.id = 'meter-' + trail.getUniqueId();
        thisNode.accessibleId = domElement.id;
        return accessiblePeer;

      }
    };
  }

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
      if ( value < 0 ) {
        console.error( 'value must be >= 0 : ' + value );
      }
      if ( value !== this.value ) {

        this.value = value;

        // update components
        this.barNode.setValue( value );

        // all meters read in pico units, compensate by multiplying by 10^12
        var meterValue = Util.toFixed( Math.pow( 10, 12 ) * this.meter.value, 2 );
        var unitsFormatString = StringUtils.format( pattern0Value1UnitsString, meterValue, this.unitsString );
        this.valueNode.setText( unitsFormatString );
        
        var domElement = document.getElementById( this.accessibleId );
        if ( domElement && this.visible ) {
          var meterString = StringUtils.format( this.descriptionString, meterValue );
          var paragraph = domElement.childNodes[1];
          paragraph.innerText = meterString;
        }

        // layout
        this.updateLayout;
      }
    },

    /**
     * Update the overload indicator arrow  visibility and position.
     */
    updateArrow: function() {
      // update position
      this.arrowNode.left = this.barNode.right + VALUE_METER_SPACING;

      // update visibility
      this.arrowNode.visible = this.meter.value > this.maxValue;
    },

    updateLayout: function() {
      // layout
      this.barNode.leftCenter = this.axisLine.leftCenter;
      this.valueNode.rightCenter = this.axisLine.leftCenter.minusXY( VALUE_METER_SPACING, 0 );
    }
  }, {

    // factory functions to construct different tpes of MeterNodes
    /**
     * Factory constructor for a CapacitanceMeterNode.
     *
     * @param {CapacitanceMeter} meter
     * @param {String} tabIndex
     * @constructor
     */
    CapacitanceBarMeterNode: function( meter, tabIndex ) {
      return new BarMeterNode( meter, CLConstants.CAPACITANCE_COLOR, CLConstants.CAPACITANCE_METER_VALUE_EXPONENT, unitsPicoFaradsString, capacitanceString, accessibleCapacitanceGraphString, tabIndex );
    },
    /**
     * Factory constructor for a CapacitanceMeterNode.
     *
     * @param {CapacitanceMeter} meter
     * @param {String} tabIndex
     * @constructor
     */
    PlateChargeBarMeterNode: function( meter, tabIndex ) {
      return new PlateChargeBarMeterNode( meter, tabIndex );
    },
    /**
     * Factory constructor for a CapacitanceMeterNode.
     *
     * @param {CapacitanceMeter} meter
     * @param {String} tabIndex
     * @constructor
     */
    StoredEnergyBarMeterNode: function( meter, tabIndex ) {
      return new BarMeterNode( meter, CLConstants.STORED_ENERGY_COLOR, CLConstants.STORED_ENERGY_METER_VALUE_EXPONENT, unitsPicoJoulesString, storedEnergyString, accessibleEnergyGraphString, tabIndex );
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

    this.value = value;
    this.maxValue = maxValue;

    Rectangle.call( this, 0, 0, BAR_SIZE.width, BAR_SIZE.height, {
      fill: barColor,
      stroke: BAR_STROKE_COLOR,
      lineWidth: BAR_LINE_WIDTH
    } );

    this.update();

  }

  inherit( Rectangle, BarNode, {

    setValue: function( value ) {
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
   * @param {String} tabIndex
   * @constructor
   */
  function PlateChargeBarMeterNode( meter, tabIndex ) {
    BarMeterNode.call( this, meter, CLConstants.POSITIVE_CHARGE_COLOR, CLConstants.PLATE_CHARGE_METER_VALUE_EXPONENT, unitsPicoCoulombsString, plateChargeString, accessibleChargeGraphString, tabIndex );
  }

  inherit( BarMeterNode, PlateChargeBarMeterNode, {

    // This meter displays absolute value, and changes color to indicate positive or negative charge.
    setValue: function( value ) {
      BarMeterNode.prototype.setValue.call( this, Math.abs( value ) );
      this.setBarColor( ( value >= 0 ) ? CLConstants.POSITIVE_CHARGE_COLOR : CLConstants.NEGATIVE_CHARGE_COLOR );
    }
  } );

  return BarMeterNode;
} );