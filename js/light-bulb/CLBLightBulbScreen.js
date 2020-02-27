// Copyright 2015-2019, University of Colorado Boulder

/**
 * LightBulb screen for the Capacitor Lab Basics sim.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import inherit from '../../../phet-core/js/inherit.js';
import YawPitchModelViewTransform3 from '../../../scenery-phet/js/capacitor/YawPitchModelViewTransform3.js';
import capacitorLabBasicsStrings from '../capacitor-lab-basics-strings.js';
import capacitorLabBasics from '../capacitorLabBasics.js';
import CLBConstants from '../common/CLBConstants.js';
import BulbNode from '../common/view/BulbNode.js';
import CLBLightBulbModel from './model/CLBLightBulbModel.js';
import CLBLightBulbScreenView from './view/CLBLightBulbScreenView.js';

const screenLightBulbString = capacitorLabBasicsStrings.screen.lightBulb;

/**
 * @constructor
 *
 * @param {Property.<boolean>} switchUsedProperty - whether switch has been changed by user. Affects both screens.
 * @param {Tandem} tandem
 */
function CLBLightBulbScreen( switchUsedProperty, tandem ) {

  const iconNode = new BulbNode.createBulbIcon();
  iconNode.rotate( -Math.PI / 2 );
  const icon = new ScreenIcon( iconNode, {
    fill: CLBConstants.SCREEN_VIEW_BACKGROUND_COLOR
  } );

  const options = {
    name: screenLightBulbString,
    backgroundColorProperty: new Property( CLBConstants.SCREEN_VIEW_BACKGROUND_COLOR ),
    homeScreenIcon: icon,
    tandem: tandem
  };

  Screen.call( this,
    function() {
      return new CLBLightBulbModel( switchUsedProperty, new YawPitchModelViewTransform3(), tandem.createTandem( 'model' ) );
    },
    function( model ) {
      return new CLBLightBulbScreenView( model, tandem.createTandem( 'view' ) );
    },
    options );
}

capacitorLabBasics.register( 'CLBLightBulbScreen', CLBLightBulbScreen );

inherit( Screen, CLBLightBulbScreen );
export default CLBLightBulbScreen;