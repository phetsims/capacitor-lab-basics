// Copyright 2018-2019, University of Colorado Boulder

/**
 * Responsible for the attributes and drag handlers associated with the timer node.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var TimerNode = require( 'SCENERY_PHET/TimerNode' );
  var Vector2Property = require( 'DOT/Vector2Property' );

  /**
   * @param {Bounds2} dragBounds
   * @param {Vector2} initialPosition
   * @param {Property.<number>} secondsProperty
   * @param {Property.<boolean>} timerRunningProperty
   * @param {Property.<boolean>} visibleProperty
   * @param {function} endDragCallback
   * @param {Tandem} tandem
   * @constructor
   */
  function DraggableTimerNode( dragBounds, initialPosition, secondsProperty, timerRunningProperty, visibleProperty, endDragCallback, tandem ) {
    var self = this;

    TimerNode.call( this, secondsProperty, timerRunningProperty, {
      tandem: tandem.createTandem( 'timer' )
    } );
    this.touchArea = this.localBounds.dilated( 10 );

    // @private {Vector2} (read-only) position of ruler node in screen coordinates
    this.positionProperty = new Vector2Property( initialPosition, {
      tandem: tandem.createTandem( 'positionProperty' )
    } );
    this.positionProperty.linkAttribute( this, 'translation' );

    // @private {MovableDragHandler} (read-only) handles timer node drag events
    this.timerNodeMovableDragHandler = new MovableDragHandler( this.positionProperty, {
      tandem: tandem.createTandem( 'dragHandler' ),
      dragBounds: dragBounds,
      startDrag: function() {
        self.moveToFront();
      },
      endDrag: function() {
        endDragCallback();
      }
    } );
    this.addInputListener( this.timerNodeMovableDragHandler );
    visibleProperty.linkAttribute( this, 'visible' );
  }

  capacitorLabBasics.register( 'DraggableTimerNode', DraggableTimerNode );

  return inherit( TimerNode, DraggableTimerNode, {
    /**
     * @override
     *
     * @public
     */
    reset: function() {
      this.positionProperty.reset();
    }
  } );
} );