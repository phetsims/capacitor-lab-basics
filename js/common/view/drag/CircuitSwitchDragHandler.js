// Copyright 2016, University of Colorado Boulder

/**
 * Drag handler for the switch node.  The circuit switch can be dragged between connection points, and is also limited
 * to the region in between the possible connection points.
 *
 * The user can drag the switch anywhere within the limiting bounds of the circuit switch.
 * On drag end, the switch snaps to the cloest connection point.
 *
 * @author Jesse Greenberg
 * @author Andrew Adare
 */
define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CircuitState = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitState' );
  var CLBQueryParameters = require( 'CAPACITOR_LAB_BASICS/common/CLBQueryParameters' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Range = require( 'DOT/Range' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  // Compute the difference (in radians) between angles a and b, using an inlined dot product
  // (inlined to remove allocations)
  var angleDifference = function( a, b ) {
    return Math.acos( Math.cos( a ) * Math.cos( b ) + Math.sin( a ) * Math.sin( b ) );
  };

  /**
   * Constructor for the CircuitSwitchDragHandler.
   * @param {SwitchNode} switchNode
   * @param {Property.<boolean>} switchLockedProperty
   * @param {Property.<boolean>} userControlledProperty
   * @param {Tandem} tandem
   * @constructor
   */
  function CircuitSwitchDragHandler( switchNode, switchLockedProperty, userControlledProperty, tandem ) {

    var circuitSwitch = switchNode.circuitSwitch; // for readability

    var self = this;
    var initialEndPoint;
    var lastAngle = 0;
    var currentAngle = 0;
    var angleOffset = 0;
    var angle = 0;

    // Customization for PhET-iO applications
    // @private
    this.twoStateSwitch = CLBQueryParameters.switch === 'twoState';

    // @private
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

    SimpleDragHandler.call( this, {
      tandem: tandem,
      allowTouchSnag: false,

      start: function( event ) {
        switchLockedProperty.value = true;
        userControlledProperty.value = true;

        var hingePoint = circuitSwitch.hingePoint.toVector2(); // in model coordinates
        initialEndPoint = circuitSwitch.getSwitchEndPoint(); // in model coordinates

        // angle of switch segment with the horizontal
        angleOffset = initialEndPoint.minus( hingePoint ).toVector2().angle();
        lastAngle = angleOffset;

        circuitSwitch.circuitConnectionProperty.set( CircuitState.SWITCH_IN_TRANSIT );

      },
      drag: function( event ) {

        // mouse in view coordinates
        var pMouse = switchNode.globalToParentPoint( event.pointer.point );

        // mouse in model coordinates
        var transformedPMouse = switchNode.modelViewTransform.viewToModelPosition( pMouse ).toVector2();

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
          // no-op
        }
        else {
          circuitSwitch.angleProperty.set( angle - angleOffset );
          lastAngle = currentAngle;
        }
      },
      end: function( event ) {
        switchLockedProperty.value = false;
        userControlledProperty.value = false;

        // snap the switch to the nearest connection point and set the active connection
        var absAngle = Math.abs( circuitSwitch.angleProperty.get() + angleOffset );
        angle = 0;
        angleOffset = 0;

        var connection = null;
        if ( self.snapRange.right.contains( absAngle ) ) {
          connection = CircuitState.LIGHT_BULB_CONNECTED;
        }
        else if ( self.snapRange.center.contains( absAngle ) ) {
          connection = CircuitState.OPEN_CIRCUIT;
        }
        else if ( self.snapRange.left.contains( absAngle ) ) {
          connection = CircuitState.BATTERY_CONNECTED;
        }
        assert && assert( connection, 'No snap region found for switch angle: ' + absAngle );

        circuitSwitch.circuitConnectionProperty.set( connection );

        circuitSwitch.angleProperty.set( angle );
      }
    } );
  }

  capacitorLabBasics.register( 'CircuitSwitchDragHandler', CircuitSwitchDragHandler );

  return inherit( SimpleDragHandler, CircuitSwitchDragHandler );

} );
