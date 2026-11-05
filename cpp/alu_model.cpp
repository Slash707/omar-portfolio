// alu_model.cpp
// Learning example: a software model of a 4-bit ALU.
// It mirrors the structure of a Verilog ALU: two operands, an operation
// select input, a result output, and status flags.
//
// Build:  g++ -std=c++17 -Wall -o alu_model alu_model.cpp
// Run:    ./alu_model

#include <cstdint>
#include <iostream>
#include <string>

enum class Op : uint8_t { ADD = 0, SUB = 1, AND = 2, OR = 3, XOR = 4, NOT_A = 5 };

struct AluResult {
    uint8_t value;  // 4-bit result
    bool carry;     // carry out (or no-borrow for SUB)
    bool zero;      // result is 0
};

// One-bit full adder, the building block of the ripple-carry adder below.
static void fullAdder(bool a, bool b, bool cin, bool &sum, bool &cout) {
    sum  = a ^ b ^ cin;
    cout = (a & b) | (cin & (a ^ b));
}

// 4-bit ripple-carry adder built from four full adders.
static uint8_t add4(uint8_t a, uint8_t b, bool cin, bool &cout) {
    uint8_t result = 0;
    bool carry = cin;
    for (int i = 0; i < 4; ++i) {
        bool s;
        fullAdder((a >> i) & 1, (b >> i) & 1, carry, s, carry);
        result |= static_cast<uint8_t>(s) << i;
    }
    cout = carry;
    return result;
}

AluResult alu(uint8_t a, uint8_t b, Op op) {
    a &= 0x0F;
    b &= 0x0F;
    bool carry = false;
    uint8_t r = 0;

    switch (op) {
        case Op::ADD:   r = add4(a, b, false, carry); break;
        case Op::SUB:   r = add4(a, static_cast<uint8_t>(~b) & 0x0F, true, carry); break;  // a + ~b + 1
        case Op::AND:   r = a & b; break;
        case Op::OR:    r = a | b; break;
        case Op::XOR:   r = a ^ b; break;
        case Op::NOT_A: r = static_cast<uint8_t>(~a) & 0x0F; break;
    }
    return {r, carry, r == 0};
}

static std::string bin4(uint8_t v) {
    std::string s;
    for (int i = 3; i >= 0; --i) s += ((v >> i) & 1) ? '1' : '0';
    return s;
}

int main() {
    struct Test { uint8_t a, b; Op op; const char *name; };
    const Test tests[] = {
        {5, 3, Op::ADD, "ADD"}, {9, 9, Op::ADD, "ADD"}, {7, 2, Op::SUB, "SUB"},
        {12, 10, Op::AND, "AND"}, {12, 10, Op::OR, "OR"}, {12, 10, Op::XOR, "XOR"},
        {5, 0, Op::NOT_A, "NOT_A"},
    };
    for (const auto &t : tests) {
        AluResult r = alu(t.a, t.b, t.op);
        std::cout << t.name << "  A=" << bin4(t.a) << " B=" << bin4(t.b)
                  << "  ->  " << bin4(r.value)
                  << "  carry=" << r.carry << " zero=" << r.zero << "\n";
    }
    return 0;
}
