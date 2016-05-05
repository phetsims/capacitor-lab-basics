// Copyright 2015, University of Colorado Boulder

/**
 * Drag handler for the switch node.  The circuit switch can be dragged between connection points, and is also limited
 * to the region in between the possible connection points.
 *
 * TODO: This is one of two possible drag styles.  With this style, the user can drag the switch anywhere within the
 * limiting bounds of the circuit switch.  On drag end, the switch snaps to the cloest connection point.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  // constants
  var BATTERY_CONNECTED_MIN_ANGLE = 3 * Math.PI / 4 - Math.PI / 8;
  var OPEN_CIRCUIT_MIN_ANGLE = Math.PI / 2 - Math.PI / 8;
  var OPEN_CIRCUIT_MAX_ANGLE = 3 * Math.PI / 4 - Math.PI / 8;
  var LIGHT_BULB_CONNECTED_MIN_ANGLE = 0;
  var LIGHT_BULB_CONNECTED_MAX_ANGLE = Math.PI / 2 - Math.PI / 8;

  //Compute the distance (in radians) between angles a and b, using an inlined dot product (inlined to remove allocations)
  var distanceBetweenAngles = function( a, b ) {
    var dotProduct = Math.cos( a ) * Math.cos( b ) + Math.sin( a ) * Math.sin( b );
    return Math.acos( dotProduct );
  };

  /**
   * Constructor for the CircuitSwitchDragHandler.
   * @param {SwitchNode} switchNode
   * @constructor
   */
  function CircuitSwitchDragHandler( switchNode ) {

    var circuitSwitch = switchNode.circuitSwitch; // for readability

    var initialEndPoint;
    var lastAngle = 0;
    var currentAngle = 0;
    var angleOffset = 0;
    var angle = 0;

    SimpleDragHandler.call( this, {
      allowTouchSnag: true,

      start: function( event ) {

        var hingePoint = circuitSwitch.hingePoint.toVector2(); // in model coordinates
        initialEndPoint = circuitSwitch.getSwitchEndPoint(); // in model coordinates
        angleOffset = initialEndPoint.minus( hingePoint ).angle(); // angle of switch segment with the horizontal
        lastAngle = angleOffset;
        switchNode.dragging = true;

      },
      drag: function( event ) {

        var pMouse = switchNode.globalToParentPoint( event.pointer.point ); // mouse in view coordinates
        var transformedPMouse = switchNode.modelViewTransform.viewToModelPosition( pMouse ).toVector2(); // mouse in model coordinates

        var hingePoint = circuitSwitch.hingePoint.toVector2(); // in model coordinates
        angle = transformedPMouse.minus( hingePoint ).angle();

        var leftLimitAngle = circuitSwitch.getLeftLimitAngle();
        var rightLimitAngle = circuitSwitch.getRightLimitAngle();

        // get the max and min angles, which depend on circuit switch orientation
        var maxAngle = Math.max( leftLimitAngle, rightLimitAngle );
        var minAngle = Math.min( leftLimitAngle, rightLimitAngle );

        // restrict the angle so that it cannot be dragged beyond limits
        if ( angle < minAngle ) {
          angle = minAngle;
        }
        if ( angle > maxAngle ) {
          angle = maxAngle;
        }
        currentAngle = angle;

        // make sure that the switch does not snap to connection points if the user drags beyond limiting angles
        if ( Math.abs( distanceBetweenAngles( currentAngle, lastAngle ) ) >= Math.PI / 4 ) {
          // noop
        }
        else {
          circuitSwitch.angle = angle - angleOffset;
          lastAngle = currentAngle;
        }

      },
      end: function( event ) {

        // snap the switch to the nearest connection point and set the active connection
        var absAngle = Math.abs( circuitSwitch.angle + angleOffset );
        angle = 0;
        angleOffset = 0;
        if ( absAngle > BATTERY_CONNECTED_MIN_ANGLE ) {
          circuitSwitch.circuitConnectionProperty.set( 'BATTERY_CONNECTED' );
        }
        else if ( absAngle < OPEN_CIRCUIT_MAX_ANGLE && absAngle > OPEN_CIRCUIT_MIN_ANGLE ) {
          circuitSwitch.circuitConnectionProperty.set( 'OPEN_CIRCUIT' );
        }
        else if ( absAngle < LIGHT_BULB_CONNECTED_MAX_ANGLE && absAngle > LIGHT_BULB_CONNECTED_MIN_ANGLE ) {
          circuitSwitch.circuitConnectionProperty.set( 'LIGHT_BULB_CONNECTED' );
        }
        else {
          console.log( ' TODO: Please restrict dragging to the correct bounds.' );
        }

        circuitSwitch.angle = angle;
        switchNode.dragging = false;

      }
    } );
  }

  capacitorLabBasics.register( 'CircuitSwitchDragHandler', CircuitSwitchDragHandler );

  return inherit( SimpleDragHandler, CircuitSwitchDragHandler );

} );