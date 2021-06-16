[object Promise]

/**
 * Capacitance screen for the Capacitor Lab Basics sim.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import YawPitchModelViewTransform3 from '../../../scenery-phet/js/capacitor/YawPitchModelViewTransform3.js';
import Image from '../../../scenery/js/nodes/Image.js';
import capacitorIconImage from '../../mipmaps/capacitance_screen_icon_png.js';
import capacitorLabBasics from '../capacitorLabBasics.js';
import capacitorLabBasicsStrings from '../capacitorLabBasicsStrings.js';
import CLBConstants from '../common/CLBConstants.js';
import CapacitanceModel from './model/CapacitanceModel.js';
import CapacitanceScreenView from './view/CapacitanceScreenView.js';

class CapacitanceScreen extends Screen {

  /**
   * @param {Property.<boolean>} switchUsedProperty - whether switch has been changed by user. Affects both screens.
   * @param {Tandem} tandem
   */
  constructor( switchUsedProperty, tandem ) {

    const options = {
      name: capacitorLabBasicsStrings.screen.capacitance,
      backgroundColorProperty: new Property( CLBConstants.SCREEN_VIEW_BACKGROUND_COLOR ),
      homeScreenIcon: new ScreenIcon( new Image( capacitorIconImage ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      tandem: tandem
    };

    super(
      () => new CapacitanceModel( switchUsedProperty, new YawPitchModelViewTransform3(), tandem.createTandem( 'model' ) ),
      model => new CapacitanceScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

capacitorLabBasics.register( 'CapacitanceScreen', CapacitanceScreen );
export default CapacitanceScreen;