/**
 * Configuration information for a circuit. This is purely a data structure, whose purpose is to reduce the number of
 * parameters required in constructors and creation methods.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Vector3 = require( 'DOT/Vector3' );
  var DielectricMaterial = require( 'CAPACITOR_LAB_BASICS/common/model/DielectricMaterial' );

  // constructor
  function CircuitConfig( options ) {

    options = _.extend( {
      // TODO: Populate defaults with intro screen values.
      modelViewTransform: ModelViewTransform2.createIdentity(),
      batteryLocation: new Vector3( 0, 0, 0 ),
      capacitorXSpacing: 0,
      capacitorYSpacing: 0,
      plateWidth: 0,
      plateSeparation: 0,
      dielectricMaterial: DielectricMaterial.Air(),
      dielectricOffset: 0.02, // meters
      wireExtent: 0,
      wireThickness: 1
    }, options );

    this.modelViewTransform = options.modelViewTransform;
    this.batteryLocation = options.batteryLocation;
    this.capacitorXSpacing = options.capacitorXSpacing;
    this.capacitorYSpacing = options.capacitorYSpacing;
    this.plateWidth = options.plateWidth;
    this.plateSeparation = options.plateSeparation;
    this.wireThickness = options.wireThickness;
    this.wireExtent = options.wireExtent;
    this.dielectricMaterial = options.dielectricMaterial;
    this.dielectricOffset = options.dielectricOffset;

  }

  return inherit( Object, CircuitConfig );

} );

