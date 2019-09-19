// Copyright 2015-2019, University of Colorado Boulder

/**
 * Drag handler for the switch node.  The circuit switch can be dragged between connection points, and is also limited
 * to the region in between the possible connection points.
 *
 * The user can drag the switch anywhere within the limiting bounds of the circuit switch.
 * On drag end, the switch snaps to the cloest connection point.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  const CircuitState = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitState' );
  const CLBQueryParameters = require( 'CAPACITOR_LAB_BASICS/common/CLBQueryParameters' );
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Range = require( 'DOT/Range' );
  const Util = require( 'DOT/Util' );

  /**
   * @constructor
   *
   * @param {SwitchNode} switchNode
   * @param {Property.<boolean>} switchLockedProperty
   * @param {Property.<boolean>} userControlledProperty
   * @param {Tandem} tandem
   */
  function CircuitSwitchDragHandler( switchNode, switchLockedProperty, userControlledProperty, tandem ) {

    const circuitSwitch = switchNode.circuitSwitch; // for readability

    const self = this;
    let angle = 0;

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

    DragListener.call( this, {
      tandem: tandem,

      start: function( event ) {
        switchLockedProperty.value = true;
        userControlledProperty.value = true;

        circuitSwitch.circuitConnectionProperty.set( CircuitState.SWITCH_IN_TRANSIT );

      },
      drag: function( event ) {

        // mouse in view coordinates
        const pMouse = switchNode.globalToParentPoint( event.pointer.point );

        // mouse in model coordinates
        const transformedPMouse = switchNode.modelViewTransform.viewToModelPosition( pMouse ).toVector2();

        const hingePoint = circuitSwitch.hingePoint.toVector2(); // in model coordinates
        angle = transformedPMouse.minus( hingePoint ).angle;

        const leftLimitAngle = circuitSwitch.getLeftLimitAngle();
        const rightLimitAngle = circuitSwitch.getRightLimitAngle();

        // get the max and min angles, which depend on circuit switch orientation
        const maxAngle = Math.max( leftLimitAngle, rightLimitAngle );
        const minAngle = Math.min( leftLimitAngle, rightLimitAngle );
        const middleAngle = ( maxAngle + minAngle ) / 2;

        // Spread the angle out around our min/max, so that clamping makes sense.
        // Restrict the angle so that it cannot be dragged beyond limits
        // If the user's cursor is on the opposite side of the hinge point, flip our angle.
        if ( angle * leftLimitAngle < 0 ) {
          angle = -angle;
        }
        angle = Util.moduloBetweenDown( angle, middleAngle - Math.PI, middleAngle + Math.PI );
        angle = Util.clamp( angle, minAngle, maxAngle );

        circuitSwitch.angleProperty.set( angle );
      },
      end: function( event ) {
        switchLockedProperty.value = false;
        userControlledProperty.value = false;

        // snap the switch to the nearest connection point and set the active connection
        const absAngle = Math.abs( circuitSwitch.angleProperty.value );

        let connection = null;
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
      }
    } );
  }

  capacitorLabBasics.register( 'CircuitSwitchDragHandler', CircuitSwitchDragHandler );

  return inherit( DragListener, CircuitSwitchDragHandler );

} );
