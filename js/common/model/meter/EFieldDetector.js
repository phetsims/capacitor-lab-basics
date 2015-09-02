// Copyright 2002-2015, University of Colorado Boulder

/**
 * Model of the E-field Detector.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector3 = require( 'DOT/Vector3' );

  /**
   * Constructor for the EFieldDetector.
   *
   * @param {AbstractCircuit} circuit
   * @param {Bounds2} worldBounds
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Vector3} bodyLocation
   * @param {Vector3} probeLocation
   * @param {boolean} visible
   * @param {boolean} plateVisible
   * @param {boolean} sumVisible
   * @param {boolean} valuesVisible
   * @constructor
   */
  function EFieldDetector( circuit, worldBounds, modelViewTransform, bodyLocation, probeLocation, visible, plateVisible, sumVisible, valuesVisible ) {

    this.circuit = circuit;
    this.modelViewTransform = modelViewTransform;

    PropertySet.call( this, {
      visible: visible,
      bodyLocation: bodyLocation,
      probeLocation: probeLocation,
      plateVector: 0,
      sumVector: 0,
      plateVisible: plateVisible,
      sumVisible: sumVisible,
      valuesVisible: valuesVisible
    } );

    //// observers TODO
    //{
    //  // update vectors when the circuit changes
    //  circuitChangeListener = new CircuitChangeListener() {
    //  public void circuitChanged() {
    //    updateVectors();
    //  }
    //};
    //  circuit.addCircuitChangeListener( circuitChangeListener );
    //
    //  // update vectors when the probe moves
    //  probeLocationProperty.addObserver( new SimpleObserver() {
    //  public void update() {
    //    updateVectors();
    //  }
    //} );
    //
    //  // When the E-field detector becomes visible for the first time, put the probe between the plates of the first capacitor.
    //  hasBeenVisible = visible;
    //  visibleProperty.addObserver( new SimpleObserver() {
    //  public void update() {
    //    if ( !hasBeenVisible ) {
    //      hasBeenVisible = true;
    //      moveProbe( EFieldDetector.this.circuit.getCapacitors().get( 0 ) );
    //    }
    //  }
    //}, false /* notifyOnAdd */ );
    //}

  }

  return inherit( PropertySet, EFieldDetector, {

    // Moves the probes so that it's between the plates of the specified capacitor.
    moveProbe: function( capacitor ) {

      this.probeLocation = capacitor.location;
      /*
       * If the probe intersects the top plate, then it will appear to be outside the
       * capacitor and won't read the E-field. In this case, move the probe down a
       * bit so that it looks like it's still between the plates, and will measure
       * the E-Field.
       */
      if ( this.probeIntersectsTopPlate( capacitor ) ) {
        var x = capacitor.location.x;
        var y = capacitor.location.y + ( capacitor.plateSeparation / 2 );
        var z = capacitor.location.z;
        this.probeLocation = new Vector3( x, y, z );
      }

    },

    // Does the probe intersect the top plate of the specified capacitor?
    probeIntersectsTopPlate: function( capacitor ) {
      var topPlateShape = capacitor.shapeCreator.createTopPlateShapeOccluded();
      var viewPoint = this.modelViewTransform.modelToViewPosition( this.probeLocation );
      return topPlateShape.containsPoint( viewPoint );
    },

    updateVectors: function() {
      // update values displayed by the meter based on probe location
      this.plateVector = this.circuit.getPlatesDielectricEFieldAt( this.probeLocation );
      this.sumVector = this.circuit.getEffectiveEFieldAt( this.probeLocation );
    }

  } );
} );