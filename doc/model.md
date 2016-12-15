# Capacitor Lab: Basics model

There is one capacitor in series with a battery, with the addition of a light bulb wired in parallel in the second screen.

Only vacuum exists between the capacitor plates. No dielectrics are modeled in Capacitor Lab: Basics.

### Constants
epsilon_0 = vacuum permittivity, F/m = 8.854E-12

### Interactive parameters
V = battery voltage, volts (-1.5 to +1.5)
d = plate separation, meters (.002 to .010)
L = plate side length, meters (.010 to .020)

### Derived parameters
A = plate area, meters^2 = L * L
C = capacitance, Farads = epsilon_0 * A / d
Q = plate charge, Coulombs = C * V
sigma = surface charge density, Coulombs/meters^2 = Q / A
E_plates = field due to plates, Volts/meter = sigma / epsilon_0
U = stored energy, Joules = 0.5 * C * V * V
