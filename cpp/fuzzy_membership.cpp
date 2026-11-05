// fuzzy_membership.cpp
// Learning example: the first step of fuzzy logic control.
// Fuzzification turns a crisp wind speed into degrees of membership
// (0.0 to 1.0) in sets such as LOW, MEDIUM and HIGH.
//
// This illustrates a concept from my research reading. It is NOT the
// internship control system and has no battery or power-flow model.
//
// Build:  g++ -std=c++17 -Wall -o fuzzy fuzzy_membership.cpp
// Run:    ./fuzzy

#include <algorithm>
#include <iomanip>
#include <iostream>

// Triangular membership function with feet at a and c and a peak at b.
double triangle(double x, double a, double b, double c) {
    if (x <= a || x >= c) return 0.0;
    if (x == b) return 1.0;
    return x < b ? (x - a) / (b - a) : (c - x) / (c - b);
}

// Shoulder functions hold at 1.0 beyond the plateau edge.
double lowSet(double v)  { return v <= 4.0 ? 1.0 : std::max(0.0, (8.0 - v) / 4.0); }
double highSet(double v) { return v >= 14.0 ? 1.0 : std::max(0.0, (v - 10.0) / 4.0); }

int main() {
    std::cout << std::fixed << std::setprecision(2);
    std::cout << "wind(m/s)   LOW   MEDIUM   HIGH\n";
    for (double v = 0.0; v <= 18.0; v += 3.0) {
        std::cout << std::setw(8) << v << "   "
                  << lowSet(v) << "     "
                  << triangle(v, 4.0, 9.0, 14.0) << "     "
                  << highSet(v) << "\n";
    }
    // The set boundaries above are arbitrary teaching values.
    return 0;
}
