// Copyright 2015, University of Colorado Boulder

/**
 * Drag handler for the switch node.  The circuit switch can be dragged between connection points, and is also limited
 * to the region in between the possible connection points.
 *
 * The user can drag the switch anywhere within the limiting bounds of the circuit switch.
 * On drag end, the switch snaps to the cloest connection point.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CircuitConnectionEnum = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitConnectionEnum' );
  var CLBQueryParameters = require( 'CAPACITOR_LAB_BASICS/common/CLBQueryParameters' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Range = require( 'DOT/Range' );
  var TandemSimpleDragHandler = require( 'TANDEM/scenery/input/TandemSimpleDragHandler' );

  // Compute the distance (in radians) between angles a and b, using an inlined dot product
  // (inlined to remove allocations)
  var angleDifference = function( a, b ) {
    var dotProduct = Math.cos( a ) * Math.cos( b ) + Math.sin( a ) * Math.sin( b );
    return Math.acos( dotProduct );
  };

  /**
   * Constructor for the CircuitSwitchDragHandler.
   * @param {SwitchNode} switchNode
   * @param {Tandem} tandem
   * @constructor
   */
  function CircuitSwitchDragHandler( switchNode, tandem ) {

    var circuitSwitch = switchNode.circuitSwitch; // for readability

    var self = this;
    var initialEndPoint;
    var lastAngle = 0;
    var currentAngle = 0;
    var angleOffset = 0;
    var angle = 0;

    //REVIEW: Is this query parameter existing long-term?
    this.twoStateSwitch = CLBQueryParameters.switch === 'twoState' ? true : false;

    this.snapRange = {
      right: new Range( 0, 3 * Math.PI / 8 ),
      center: new Range( 3 * Math.PI / 8, 5 * Math.PI / 8 ),
      left: new Range( 5 * Math.PI / 8, Math.PI )
    };

    if ( this.twoStateSwitch ) {
      this.snapRange = {
        right: new Range( 0, Math.PI / 2 ),
        center: new Range( Math.PI / 2, Math.PI / 2 ),
        left: new Range( Math.PI / 2, Math.PI )
      };
    }

    TandemSimpleDragHandler.call( this, {
      tandem: tandem,
      allowTouchSnag: false,

      start: function( event ) {

        var hingePoint = circuitSwitch.hingePoint.toVector2(); // in model coordinates
        initialEndPoint = circuitSwitch.getSwitchEndPoint(); // in model coordinates
        angleOffset = initialEndPoint.minus( hingePoint ).toVector2().angle(); // angle of switch segment with the horizontal
        lastAngle = angleOffset;
        //REVIEW: what does setting 'dragging' here do? Don't see sim-specific checks on it
        switchNode.dragging = true;

        circuitSwitch.circuitConnectionProperty.set( CircuitConnectionEnum.IN_TRANSIT );

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
        if ( Math.abs( angleDifference( currentAngle, lastAngle ) ) >= Math.PI / 4 ) {
          // noop
        }
        else {
          circuitSwitch.angleProperty.set( angle - angleOffset );
          lastAngle = currentAngle;
        }

      },
      end: function( event ) {

        // snap the switch to the nearest connection point and set the active connection
        var absAngle = Math.abs( circuitSwitch.angleProperty.get() + angleOffset );
        angle = 0;
        angleOffset = 0;

        var connection = null;
        if ( self.snapRange.right.contains( absAngle ) ) {
          connection = CircuitConnectionEnum.LIGHT_BULB_CONNECTED;
        }
        else if ( self.snapRange.center.contains( absAngle ) ) {
          connection = CircuitConnectionEnum.OPEN_CIRCUIT;
        }
        else if ( self.snapRange.left.contains( absAngle ) ) {
          connection = CircuitConnectionEnum.BATTERY_CONNECTED;
        }
        assert && assert( connection, 'No snap region found for switch angle: ' + absAngle );

        circuitSwitch.circuitConnectionProperty.set( connection );

        circuitSwitch.angleProperty.set( angle );
        //REVIEW: what does setting 'dragging' here do? Don't see sim-specific checks on it
        switchNode.dragging = false;
      }
    } );
  }

  capacitorLabBasics.register( 'CircuitSwitchDragHandler', CircuitSwitchDragHandler );

  return inherit( TandemSimpleDragHandler, CircuitSwitchDragHandler );

} );
