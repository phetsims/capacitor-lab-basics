// Copyright 2002-2015, University of Colorado Boulder

/**
 * Arrow slider
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Input = require( 'SCENERY/input/Input' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );

  /**
   * Constructor for the sliders used to change plate size and separation
   * Based on the Slider class
   * @param {Property} valueProperty
   * @param { {min:number, max:number} } range
   * @constructor
   */
  function PlateSlider( valueProperty, range, options ) {

    var thisSlider = this;
    Node.call( thisSlider );

    options = _.extend( {
      // track
      trackSize: new Dimension2( 50, 5 ),
      trackFill: 'white',
      trackStroke: 'black',
      trackLineWidth: 1,
      // thumb
      thumbSize: new Dimension2( 22, 45 ),
      thumbFillEnabled: 'rgb(0,200,0)',
      thumbFillHighlighted: 'rgb(255,246,0)',
      thumbFillDisabled: '#F0F0F0',
      thumbStroke: 'black',
      thumbLineWidth: 1,
      // other
      cursor: 'pointer',
      enabledProperty: new Property( true ),
      startDrag: function() {}, // called when a drag sequence starts
      endDrag: function() {} // called when a drag sequence ends
    }, options );
    this.options = options; // @private TODO save only the options that are needed by prototype functions

    // @private mapping between value and track position
    thisSlider.valueToPosition = new LinearFunction( range.min, range.max, 0, options.trackSize.width, true /* clamp */ );

    // @private track
    thisSlider.track = new Rectangle( 0, 0, options.trackSize.width, options.trackSize.height,
      { fill: options.trackFill, stroke: options.trackStroke, lineWidth: options.trackLineWidth } );
    thisSlider.track.visible = false;
    thisSlider.addChild( thisSlider.track );

    // thumb, points up
    var thumb = new ArrowNode( 0, 0, 60, 0, {
      doubleHead: true,
      tailWidth: 10,
      headWidth: 28,
      headHeight: 22,
      fill: 'rgb(0,200,0)',
      stroke: 'black',
      lineWidth: 2,
      focusable: true,
    } );
    thumb.centerY = thisSlider.track.centerY;
    thisSlider.addChild( thumb );

    // thumb touch area
    var dx = 0.5 * thumb.width;
    var dy = 0.25 * thumb.height;
    thumb.touchArea = Shape.rectangle( ( -thumb.width / 2 ) - dx, ( -thumb.height / 2 ) - dy, thumb.width + dx + dx, thumb.height + dy + dy );

    // highlight thumb on pointer over
    thumb.addInputListener( new ButtonListener( {
      over: function( event ) { if ( options.enabledProperty.get() ) { thumb.fill = options.thumbFillHighlighted; } },
      up: function( event ) { if ( options.enabledProperty.get() ) { thumb.fill = options.thumbFillEnabled; } }
    } ) );
    
    thumb.addInputListener( {
      keydown: function( event, trail ) {
        var keyCode = event.domEvent.keyCode;
        var step = (range.max - range.min) / 10;
        if ( ((keyCode === Input.KEY_UP_ARROW || keyCode === Input.KEY_RIGHT_ARROW) && thisSlider.rotation <= 0) ||
            ((keyCode === Input.KEY_LEFT_ARROW || keyCode === Input.KEY_DOWN_ARROW) && thisSlider.rotation > 0)) {
          if ( valueProperty.get() < range.max - step ) {
            valueProperty.set( valueProperty.get() + step );
          }
          else {
            valueProperty.set( range.max );
          }
        }
        else if ( ((keyCode === Input.KEY_LEFT_ARROW || keyCode === Input.KEY_DOWN_ARROW) && thisSlider.rotation <= 0) ||
                 ((keyCode === Input.KEY_UP_ARROW || keyCode === Input.KEY_RIGHT_ARROW) && thisSlider.rotation > 0)) {
          if ( valueProperty.get() > range.min + step ) {
            valueProperty.set( valueProperty.get() - step );
          }
          else {
            valueProperty.set( range.min );
          }
        }
      }
    } );
    
    // update value when thumb is dragged
    var thumbHandler = new SimpleDragHandler( {
      clickXOffset: 0, // x-offset between initial click and thumb's origin
      allowTouchSnag: true,
      start: function( event ) {
        if ( options.enabledProperty.get() ) {
          options.startDrag();
        }
        this.clickXOffset = thumb.globalToParentPoint( event.pointer.point ).x - thumb.x;
      },
      drag: function( event ) {
        if ( options.enabledProperty.get() ) {
          var x = thumb.globalToParentPoint( event.pointer.point ).x - this.clickXOffset;
          valueProperty.set( thisSlider.valueToPosition.inverse( x ) );
        }
      },
      end: function() {
        if ( options.enabledProperty.get() ) {
          options.endDrag();
        }
      }
    } );
    thumb.addInputListener( thumbHandler );

    // enable/disable thumb
    options.enabledProperty.link( function( enabled ) {
      thumb.fill = enabled ? options.thumbFillEnabled : options.thumbFillDisabled;
      thumb.cursor = enabled ? 'pointer' : 'default';
      if ( !enabled ) {
        if ( thumbHandler.dragging ) { thumbHandler.endDrag(); }
      }
    } );

    // update thumb location when value changes
    valueProperty.link( function( value ) {
      thumb.centerX = thisSlider.valueToPosition( value );
    } );

    thisSlider.mutate( options );
  }

  inherit( Node, PlateSlider, {
  } );

  return PlateSlider;
} );