# Capacitor Lab: Basics
## Notes for developers

### Base model
CLBModel contains several visibility properties that are used by the view, and is extended by CLBLightBulbModel and CapacitanceModel for their respective screens. The latter two are small files that mainly add screen-specific bar meters to the base model.

### Circuit model
ParallelCircuit serves as the foundation for the circuit model. It coordinates the functionality for constructing the circuit, and contains logic for determining electrical connectivity between components. It has two subtypes: CapacitanceCircuit for the Capacitance screen, and LightBulbCircuit for the Light Bulb screen.

The circuit components each have a corresponding type:
 - Battery
 - Capacitor
 - LightBulb
 - Wire and its subclasses
They do not have a sim-specific parent type (they inherit directly from Object).

### Measurement devices:
 - BarMeter and its subclasses
 - Voltmeter

Misc notes:

 - Model units are meters, Farad, Coulombs, Volts and Joules.  These are not ideal units for working at this scale,
but they match the design document, and this was the team's preference.  Consequently, you'll see small model values
in the code, like 0.005 meters for plate separation.

 - This sim uses a pseudo-3D perspective, essentially a projection with no vanishing point.
See CLModelViewTransform3D to familiarize yourself with the orientation of the coordinate system.
Turning 3D descriptions into 2D projections is handled in BoxShapeCreator.

 - Measurement of voltage and E-field is done via intersection of shapes. (For example, does the shape of the
positive voltmeter probe intersect the top terminal of the battery?) The shapes for circuit components are created
by the model elements. In a strict MVC architecture, it would be preferable to keep shapes out of the model.
But in this sim, handling shapes in the model simplified both the model and the view.

 - Regarding memory management: Everything created in this sim (model and view) exists for the lifetime of the sim,
there is no dynamic creation/deletion of objects. All observer/observable relationships also exist for the lifetime
of the sim.  So there is no need to call the various memory-management functions associated with objects
(unlink, dispose, detach, etc.)

 - For a list of query parameters that are specific to this simulation, see `CLBQueryParameters`.