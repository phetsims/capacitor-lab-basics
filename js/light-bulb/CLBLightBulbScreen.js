// Copyright 2015-2022, University of Colorado Boulder

/**
 * LightBulb screen for the Capacitor Lab Basics sim.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import YawPitchModelViewTransform3 from '../../../scenery-phet/js/capacitor/YawPitchModelViewTransform3.js';
import capacitorLabBasics from '../capacitorLabBasics.js';
import CapacitorLabBasicsStrings from '../CapacitorLabBasicsStrings.js';
import CLBConstants from '../common/CLBConstants.js';
import BulbNode from '../common/view/BulbNode.js';
import CLBLightBulbModel from './model/CLBLightBulbModel.js';
import CLBLightBulbScreenView from './view/CLBLightBulbScreenView.js';

class CLBLightBulbScreen extends Screen {

  /**
   * @param {Property.<boolean>} switchUsedProperty - whether switch has been changed by user. Affects both screens.
   * @param {Tandem} tandem
   */
  constructor( switchUsedProperty, tandem ) {

    const iconNode = BulbNode.createBulbIcon();
    iconNode.rotate( -Math.PI / 2 );
    const icon = new ScreenIcon( iconNode, {
      fill: CLBConstants.SCREEN_VIEW_BACKGROUND_COLOR
    } );

    const iconOptions = {
      maxIconWidthProportion: 1,
      maxIconHeightProportion: 1
    };

    const options = {
      name: CapacitorLabBasicsStrings.screen.lightBulbStringProperty,
      backgroundColorProperty: new Property( CLBConstants.SCREEN_VIEW_BACKGROUND_COLOR ),
      homeScreenIcon: new ScreenIcon( icon, iconOptions ),
      tandem: tandem
    };

    super(
      () => new CLBLightBulbModel( switchUsedProperty, new YawPitchModelViewTransform3(), tandem.createTandem( 'model' ) ),
      model => new CLBLightBulbScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

capacitorLabBasics.register( 'CLBLightBulbScreen', CLBLightBulbScreen );
export default CLBLightBulbScreen;