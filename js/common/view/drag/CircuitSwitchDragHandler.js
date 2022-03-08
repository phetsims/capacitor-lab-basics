// Copyright 2015-2022, University of Colorado Boulder

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

import Range from '../../../../../dot/js/Range.js';
import Utils from '../../../../../dot/js/Utils.js';
import { DragListener } from '../../../../../scenery/js/imports.js';
import capacitorLabBasics from '../../../capacitorLabBasics.js';
import CLBQueryParameters from '../../CLBQueryParameters.js';
import CircuitState from '../../model/CircuitState.js';

class CircuitSwitchDragHandler extends DragListener {
  /**
   * @param {SwitchNode} switchNode
   * @param {Property.<boolean>} switchLockedProperty
   * @param {Property.<boolean>} userControlledProperty
   * @param {Tandem} tandem
   */
  constructor( switchNode, switchLockedProperty, userControlledProperty, tandem ) {

    const circuitSwitch = switchNode.circuitSwitch; // for readability

    let angle = 0;

    // Customization for PhET-iO applications
    const twoStateSwitch = CLBQueryParameters.switch === 'twoState';

    // @private
    let snapRange = {
      right: new Range( 0, 3 * Math.PI / 8 ),
      center: new Range( 3 * Math.PI / 8, 5 * Math.PI / 8 ),
      left: new Range( 5 * Math.PI / 8, Math.PI )
    };

    if ( twoStateSwitch ) {
      snapRange = {
        right: new Range( 0, Math.PI / 2 ),
        center: new Range( Math.PI / 2, Math.PI / 2 ),
        left: new Range( Math.PI / 2, Math.PI )
      };
    }

    super( {
      tandem: tandem,

      start: event => {
        switchLockedProperty.value = true;
        userControlledProperty.value = true;

        circuitSwitch.circuitConnectionProperty.set( CircuitState.SWITCH_IN_TRANSIT );

      },
      drag: event => {

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
        angle = Utils.moduloBetweenDown( angle, middleAngle - Math.PI, middleAngle + Math.PI );
        angle = Utils.clamp( angle, minAngle, maxAngle );

        circuitSwitch.angleProperty.set( angle );
      },
      end: () => {
        switchLockedProperty.value = false;
        userControlledProperty.value = false;

        // snap the switch to the nearest connection point and set the active connection
        const absAngle = Math.abs( circuitSwitch.angleProperty.value );

        let connection = null;
        if ( snapRange.right.contains( absAngle ) ) {
          connection = CircuitState.LIGHT_BULB_CONNECTED;
        }
        else if ( snapRange.center.contains( absAngle ) ) {
          connection = CircuitState.OPEN_CIRCUIT;
        }
        else if ( snapRange.left.contains( absAngle ) ) {
          connection = CircuitState.BATTERY_CONNECTED;
        }
        assert && assert( connection, `No snap region found for switch angle: ${absAngle}` );

        circuitSwitch.circuitConnectionProperty.set( connection );
      }
    } );
  }
}

capacitorLabBasics.register( 'CircuitSwitchDragHandler', CircuitSwitchDragHandler );

export default CircuitSwitchDragHandler;