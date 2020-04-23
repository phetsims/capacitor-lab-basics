// Copyright 2015-2020, University of Colorado Boulder

/**
 * Capacitance screen for the Capacitor Lab Basics sim.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import inherit from '../../../phet-core/js/inherit.js';
import YawPitchModelViewTransform3 from '../../../scenery-phet/js/capacitor/YawPitchModelViewTransform3.js';
import Image from '../../../scenery/js/nodes/Image.js';
import capacitorIconImage from '../../mipmaps/capacitance_screen_icon_png.js';
import capacitorLabBasicsStrings from '../capacitorLabBasicsStrings.js';
import capacitorLabBasics from '../capacitorLabBasics.js';
import CLBConstants from '../common/CLBConstants.js';
import CapacitanceModel from './model/CapacitanceModel.js';
import CapacitanceScreenView from './view/CapacitanceScreenView.js';

const screenCapacitanceString = capacitorLabBasicsStrings.screen.capacitance;

/**
 * @constructor
 *
 * @param {Property.<boolean>} switchUsedProperty - whether switch has been changed by user. Affects both screens.
 * @param {Tandem} tandem
 */
function CapacitanceScreen( switchUsedProperty, tandem ) {

  const options = {
    name: screenCapacitanceString,
    backgroundColorProperty: new Property( CLBConstants.SCREEN_VIEW_BACKGROUND_COLOR ),
    homeScreenIcon: new ScreenIcon( new Image( capacitorIconImage ), {
      maxIconWidthProportion: 1,
      maxIconHeightProportion: 1
    } ),
    tandem: tandem
  };

  Screen.call( this,
    function() { return new CapacitanceModel( switchUsedProperty, new YawPitchModelViewTransform3(), tandem.createTandem( 'model' ) ); },
    function( model ) { return new CapacitanceScreenView( model, tandem.createTandem( 'view' ) ); },
    options );
}

capacitorLabBasics.register( 'CapacitanceScreen', CapacitanceScreen );

inherit( Screen, CapacitanceScreen );
export default CapacitanceScreen;