// Copyright 2002-2015, University of Colorado Boulder

/**
 * Abstract base class for all bar meters.  Factory functions allow for creating all specific meter subclasses. Origin
 * is at the upper-left corner of the "track" that the bar moves in.
 *
 * TODO: This file is very large.  It may be good to refactor some of the convenience classes here into separate files.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Vector2 = require( 'DOT/Vector2' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SubSupText = require( 'SCENERY_PHET/SubSupText' );
  var Text = require( 'SCENERY/nodes/Text' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var ScientificNotationNode = require( 'SCENERY_PHET/ScientificNotationNode' );
  var CLConstants = require( 'CAPACITOR_LAB_BASICS/common/CLConstants' );

  // constants
  // track
  var TRACK_SIZE = new Dimension2( 30, 120 );
  var TRACK_FILL_COLOR = 'white';
  var TRACK_STROKE_COLOR = 'black';
  var TRACK_LINE_WIDTH = 1;

  // measure
  var MEASURE_LINE_WIDTH = 1;
  var MEASURE_STROKE_COLOR = 'black';

  // bar
  var BAR_STROKE_COLOR = TRACK_STROKE_COLOR;
  var BAR_LINE_WIDTH = TRACK_LINE_WIDTH;
  var BAR_SIZE = new Dimension2( 18, 120 );
  var BAR_OFFSET_FROM_MEASURE = 4;

  // ticks
  var NUMBER_OF_TICKS = 10;
  var MAJOR_TICK_MARK_LENGTH = 5;
  var MINOR_TICK_MARK_LENGTH = 5;
  var TICK_MARK_COLOR = TRACK_STROKE_COLOR;
  var TICK_MARK_LINE_WIDTH = TRACK_LINE_WIDTH;
  var MINOR_TICKS_OUTSIDE = true; // true=ticks outside bar, false=ticks inside bar

  // range labels
  var RANGE_LABEL_FONT = new PhetFont( 11 );
  //var RANGE_LABEL_COLOR = 'black';

  // title
  var TITLE_FONT = new PhetFont( 12 );
  //var TITLE_COLOR = 'black';

  // value display
  var VALUE_FONT = new PhetFont( 11 );
  var VALUE_COLOR = 'black';

  // overload indicator
  var OVERLOAD_INDICATOR_WIDTH = 0.75 * TRACK_SIZE.width;
  var OVERLOAD_INDICATOR_HEIGHT = 15;

  // strings
  var unitsFaradsString = require( 'string!CAPACITOR_LAB_BASICS/units.farads' );
  var unitsCoulombsString = require( 'string!CAPACITOR_LAB_BASICS/units.coulombs' );
  var unitsJoulesString = require( 'string!CAPACITOR_LAB_BASICS/units.joules' );

  /**
   * Constructor for the MeasureNode that gauges the magnitude of the bar meter.  This is a vertical line with tick
   * marks to provide a sense of scale.  The origin is at the top of the vertical line.
   */
  function MeasureNode() {

    // create the line shape
    Line.call( this, 0, 0, 0, BAR_SIZE.height, {
      stroke: MEASURE_STROKE_COLOR,
      lineWidth: MEASURE_LINE_WIDTH
    } );

    // minor ticks
    var deltaY = this.height / NUMBER_OF_TICKS;
    for ( var i = 0; i < NUMBER_OF_TICKS; i++ ) {
      var tickMarkNode = new TickMarkNode( MINOR_TICK_MARK_LENGTH );
      this.addChild( tickMarkNode );
      var xOffset = MINOR_TICKS_OUTSIDE ? -MINOR_TICK_MARK_LENGTH : 0;
      tickMarkNode.translation = new Vector2( xOffset, ( i + 1 ) * deltaY );
    }

    // majors ticks, for min and max
    this.maxTickMarkNode = new TickMarkNode( MAJOR_TICK_MARK_LENGTH ); // @private
    this.addChild( this.maxTickMarkNode );
    this.minTickMarkNode = new TickMarkNode( MAJOR_TICK_MARK_LENGTH ); // @private
    this.addChild( this.minTickMarkNode );

    // layout
    // max tick mark at top of track
    var x = -this.maxTickMarkNode.bounds.width;
    var y = this.translation.y;
    this.maxTickMarkNode.translation = new Vector2( x, y );

    // min tick mark at bottom of track
    x = -this.minTickMarkNode.bounds.width;
    y = this.bounds.maxY;
    this.minTickMarkNode.translation = new Vector2( x, y );

  }

  inherit( Line, MeasureNode );
  /**
   * Constructor for the measureNode, the track that the bar moves in.  Origin is at upper-left corner.  The track is
   */
  function TrackNode() {
    Rectangle.call( this, 0, 0, TRACK_SIZE.width, TRACK_SIZE.height, {
      fill: TRACK_FILL_COLOR,
      stroke: TRACK_STROKE_COLOR,
      lineWidth: TRACK_LINE_WIDTH
    } );
  }

  inherit( Rectangle, TrackNode );

  /**
   * Constructor for a BarNode. The bar which indicates the magnitude of the value being read by the meter. Origin is
   * at upper left of track.
   *
   * @param {string} barColor
   * @param {number} maxValue
   * @param {number} value
   * @constructor
   */
  function BarNode( barColor, maxValue, value ) {

    this.value = value;
    this.maxValue = maxValue;

    Rectangle.call( this, BAR_OFFSET_FROM_MEASURE, 0, BAR_SIZE.width, BAR_SIZE.height, {
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

    setMaxValue: function( maxValue ) {
      if ( maxValue !== this.maxValue ) {
        this.maxValue = maxValue;
        this.update();
      }
    },

    update: function() {
      var percent = Math.min( 1, Math.abs( this.value ) / this.maxValue );
      var y = ( 1 - percent ) * TRACK_SIZE.height;
      var height = TRACK_SIZE.height - y;
      this.setRect( BAR_OFFSET_FROM_MEASURE, y, BAR_SIZE.width, height );
    }

  } );

  /**
   * Horizontal tick mark line, with no label.
   * Origin is at the left end of the line.
   *
   * @param {number} tickMarkLength
   * @constructor
   */
  function TickMarkNode( tickMarkLength ) {
    Path.call( this, Shape.lineSegment( 0, 0, tickMarkLength, 0 ), {
      stroke: TICK_MARK_COLOR,
      lineWidth: TICK_MARK_LINE_WIDTH
    } );
  }

  inherit( Path, TickMarkNode );

  /**
   * Constructor for the label used to indicate the range. Origin is at upper-left corner of bounding box.
   *
   * @param {string} label
   */
  function RangeLabelNode( label ) {

    SubSupText.call( this, label, { font: RANGE_LABEL_FONT } );

  }

  inherit( SubSupText, RangeLabelNode );

  function PowerOfTenRangeLabelNode( exponent ) {
    RangeLabelNode.call( this, '10<sup>' + exponent + '</sup>' );
  }

  inherit( RangeLabelNode, PowerOfTenRangeLabelNode, {
    setExponent: function( exponent ) {
      this.setText( '10<sup>' + exponent + '</sup>' );
    }
  } );

  /**
   * Constructor for the OverloadIndicatorNode. Overload indicator, visible when the value is greater than what the bar
   * is capable of displaying.  The indicator is an arrow that points upward.
   *
   * @param {string} fillColor
   * @param {number} maxValue
   * @param {number} value
   * @constructor
   */
  function OverloadIndicatorNode( fillColor, maxValue, value ) {

    this.value = value;
    this.maxValue = maxValue;

    var tailLocation = new Vector2( 0, OVERLOAD_INDICATOR_HEIGHT );
    var tipLocation = new Vector2( 0, 0 );
    var headHeight = 0.6 * OVERLOAD_INDICATOR_HEIGHT;
    var headWidth = OVERLOAD_INDICATOR_WIDTH;
    var tailWidth = headWidth / 2;

    ArrowNode.call( this, tailLocation.x, tailLocation.y, tipLocation.x, tipLocation.y, {
      headHeight: headHeight,
      headWidth: headWidth,
      tailWidth: tailWidth,
      fill: fillColor
    } );

    this.update();

  }

  inherit( ArrowNode, OverloadIndicatorNode, {

    setValue: function( value ) {
      if ( value !== this.value ) {
        this.value = value;
        this.update();
      }
    },

    setMaxValue: function( maxValue ) {
      if ( maxValue !== this.maxValue ) {
        this.maxValue = maxValue;
        this.update();
      }
    },

    setArrowFillColor: function( color ) {
      this.fill = color;
    },

    update: function() {
      this.visible = this.value > this.maxValue;
    }
  } );

  /**
   * Constructor.
   *
   * @param {BarMeter}
   * @param {CLModelViewTransform3D} modelViewTransform
   * @param {string} barColor
   * @param {string} title
   * @param {string} valueMantissaPattern
   * @param {number} exponent
   * @param {string} units
   * @constructor
   */
  function BarMeterNode( meter, modelViewTransform, barColor, title, valueMantissaPattern, exponent, units ) {

    Node.call( this );
    var thisNode = this;

    this.value = meter.value;
    this.exponentProperty = new Property( exponent );

    // measure
    this.measureNode = new MeasureNode();
    this.addChild( this.measureNode );

    // track
    //this.trackNode = new TrackNode();
    //this.addChild( this.trackNode );

    // bar
    var maxValue = Math.pow( 10, exponent );
    this.barNode = new BarNode( barColor, maxValue, this.value );
    this.addChild( this.barNode );

    // min range label
    this.minLabelNode = new RangeLabelNode( "0" );
    this.addChild( this.minLabelNode );

    // max range label
    this.maxLabelNode = new PowerOfTenRangeLabelNode( exponent );
    this.addChild( this.maxLabelNode );

    // title
    this.titleNode = new Text( title, { font: TITLE_FONT } );
    this.addChild( this.titleNode );

    // overload indicator
    this.overloadIndicatorNode = new OverloadIndicatorNode( barColor, maxValue, this.value );
    this.addChild( this.overloadIndicatorNode );

    // value in scientific notation with units
    this.valueNode = new ScientificNotationNode( meter.valueProperty, {
      font: VALUE_FONT,
      fill: VALUE_COLOR,
      mantissaDecimalPlaces: 2,
      exponent: exponent
    } );
    this.unitsNode = new Text( units, { font: VALUE_FONT, fill: VALUE_COLOR } );
    this.addChild( this.valueNode );
    this.addChild( this.unitsNode );

    // observers
    // value
    meter.valueProperty.link( function( value ) {
      thisNode.setValue( value );
    } );

    // visibility
    meter.visibleProperty.link( function( visible ) {
      thisNode.visible = visible;
    } );

    meter.valueVisibleProperty.link( function( visible ) {
      thisNode.valueNode.visible = visible;
    } );

    // exponent
    this.exponentProperty.link( function() {
      thisNode.handleExponentChanged();
    } );
  }

  inherit( Node, BarMeterNode, {

    /**
     * Sets the value displayed by the meter.
     * Updates the bar and the value below the meter.
     *
     * @param {number} value
     */
    setValue: function( value ) {
      if ( value < 0 ) {
        console.error( "value must be >= 0 : " + value );
      }
      if ( value !== this.value ) {

        this.value = value;

        // update components
        this.barNode.setValue( value );
        this.overloadIndicatorNode.setValue( value );
        this.valueNode.update( value );

        this.updateLayout();
      }
    },

    /**
     * Update the layout of the BarMeterNode.  All offsets for individual node placement determined empirically.
     */
    updateLayout: function() {

      var x = 0;
      var y = 0;
      this.measureNode.translation = new Vector2( x, y );
      //this.measureNode.translation = new Vector2( x, y );

      // bar inside track
      this.barNode.translation = this.measureNode.translation;

      // max label centered on max tick
      x = this.measureNode.bounds.minX - this.maxLabelNode.bounds.width - 5;
      y = this.measureNode.bounds.minY + ( this.maxLabelNode.bounds.height / 2 );
      this.maxLabelNode.translation = new Vector2( x, y );

      // min label centered on min tick
      x = this.measureNode.bounds.minX - this.minLabelNode.bounds.width - 5;
      y = this.measureNode.bounds.maxY;
      this.minLabelNode.translation = new Vector2( x, y );

      // overload indicator centered above bar
      x = this.barNode.bounds.centerX;
      y = this.barNode.bounds.minY - this.overloadIndicatorNode.bounds.height - 1;
      this.overloadIndicatorNode.translation = new Vector2( x, y );

      // title centered below the entire meter
      x = this.barNode.centerX - ( this.titleNode.bounds.width / 2 );
      y = this.minLabelNode.bounds.maxY + 25;
      this.titleNode.translation = new Vector2( x, y );

      // value centered below title
      x = this.titleNode.bounds.centerX - ( this.valueNode.bounds.width / 2 );
      y = this.titleNode.bounds.maxY + 15;
      this.valueNode.translation = new Vector2( x, y );

      // units to the right of the value node.
      // TODO: IS THIS i18n FRIENDLY? PROBABLY NOT.
      x = this.valueNode.bounds.maxX + ( this.unitsNode.bounds.width / 2 );
      y = this.titleNode.bounds.maxY + 15;
      this.unitsNode.translation = new Vector2( x, y );

    },

    /**
     * At most one of the zoom buttons is enabled.
     * If the bar is empty, neither button is enabled.
     * If the bar is less than 10% full, the zoom in button is enabled.
     * If the bar is overflowing, the zoom out button is enabled.
     */
    updateZoomButtons: function() {
      var value = this.value;
      var mantissa = value / Math.pow( 10, this.exponentProperty.value );
      var plusEnabled = ( value !== 0 ) && ( mantissa < 0.1 );
      var minusEnabled = ( value !== 0 ) && ( mantissa > 1 );
      this.zoomInButtonNode.enabled = plusEnabled;
      this.zoomOutButtonNode.enabled = minusEnabled;
    },

    /**
     * Sets the exponent to a value that makes the mantissa >= 0.1.
     */
    updateExponent: function() {
      if ( this.value !== 0 ) {
        var exponent = 0;
        while ( ( this.value / Math.pow( 10, exponent ) ) < 0.1 ) {
          exponent--;
        }
        this.exponentProperty.set( exponent );
      }
    },

    // Sets the exponent used for the value and max label.
    handleExponentChanged: function() {

      var exponent = this.exponentProperty.value;

      // update components
      var maxValue = Math.pow( 10, exponent );
      this.barNode.setMaxValue( maxValue );
      this.overloadIndicatorNode.setMaxValue( maxValue );
      this.maxLabelNode.update( exponent );
      this.valueNode.exponent = exponent; // TODO: This doesn't do anything.  Exponent cannot be changed easily with ScientificNotationNode.
      this.valueNode.update( this.value );
      //this.valueNode.update( exponent );

      this.updateLayout();

    },

    /**
     * Sets the color used to fill the bar.
     *
     * @param color
     */
    setBarColor: function( color ) {
      this.barNode.fill = color;
      this.overloadIndicatorNode.setArrowFillColor( color );
    }
  }, {

    /**
     * Factory constructor for a CapacitanceMeterNode.
     *
     * @param {CapacitanceMeter} meter
     * @param {CLModelViewTransform3D} modelViewTransform
     * @param {string} label
     * @constructor
     */
    CapacitanceMeterNode: function( meter, modelViewTransform, label ) {
      return new BarMeterNode( meter, modelViewTransform, CLConstants.CAPACITANCE_COLOR, label, "0.00", CLConstants.CAPACITANCE_METER_VALUE_EXPONENT, unitsFaradsString );
    },

    /**
     * Factory constructor for a CapacitanceMeterNode.
     *
     * @param {PlateChargeMeter} meter
     * @param {CLModelViewTransform3D} modelViewTransform
     * @param {string} label
     * @constructor
     */
    PlateChargeMeterNode: function( meter, modelViewTransform, label ) {
      return new PlateChargeMeterNode( meter, modelViewTransform, label );
    },

    /**
     * Factory constructor for a StoredEnergyMeterNode.
     * @param {StoredEnergyMeter} meter
     * @param {CLModelViewTransform3D} modelViewTransform
     * @param {string} label
     * @constructor
     */
    StoredEnergyMeterNode: function( meter, modelViewTransform, label ) {
      return new BarMeterNode( meter, modelViewTransform, CLConstants.STORED_ENERGY_COLOR, label, "0.00", CLConstants.STORED_ENERGY_METER_VALUE_EXPONENT, unitsJoulesString );
    }

  } );

  /**
   * Constructor for the PlateChargeMeterNode.  This needs its own subclass because this node requires a unique
   * setValue function.
   *
   * @param {PlateChargeMeter} meter
   * @param {CLModelViewTransform3D} modelViewTransform
   * @param {string} label
   * @constructor
   */
  function PlateChargeMeterNode( meter, modelViewTransform, label ) {
    BarMeterNode.call( this, meter, modelViewTransform, CLConstants.POSITIVE_CHARGE_COLOR, label, "0.00", CLConstants.PLATE_CHARGE_METER_VALUE_EXPONENT, unitsCoulombsString );
  }

  inherit( BarMeterNode, PlateChargeMeterNode, {

    // This meter displays absolute value, and changes color to indicate positive or negative charge.
    setValue: function( value ) {
      BarMeterNode.prototype.setValue.call( this, Math.abs( value ) );
      this.setBarColor( ( value >= 0 ) ? CLConstants.POSITIVE_CHARGE_COLOR : CLConstants.NEGATIVE_CHARGE_COLOR );
    }
  } );

  return BarMeterNode;

} );