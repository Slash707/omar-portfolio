`timescale 1ns / 1ps

module brainless_stim(
    output reg [3:0] data_in,
    output reg [3:0] addr_bus,
    output reg invert,
    output reg arith,
    output reg pass,
    output reg load_acc,
    output reg acc_to_db,
    output reg reset,
    output reg clk,
    output reg write,
    output reg read,
    input [3:0] data_bus,
    input [3:0] accum,
    input [3:0] alu_out
);

// Test vector storage
reg [27:0] test_vals[0:7];
reg [2:0] test_addr;
integer num_tests;

// Response checking
reg [27:0] response;
wire [3:0] exp_accum = response[27:24];
wire [3:0] exp_alu_out = response[23:20];
wire [3:0] exp_data_bus = response[19:16];
wire [3:0] exp_addr_bus = response[15:12];
wire [2:0] exp_alu_ctrl = response[11:9]; // {invert, arith, pass}
wire exp_load_acc = response[8];
wire exp_acc_to_db = response[7];
wire exp_write = response[6];
wire exp_read = response[5];
wire exp_reset = response[0];

integer errors;

// Clock generation
always begin
    #5 clk = 0;
    #5 clk = 1;
end

initial begin
    // Initialize
    errors = 0;
    test_addr = 0;
    num_tests = 8;
    
    // Open VCD file for waveform viewing
    $dumpfile("brainless_waves.vcd");
    $dumpvars(0, brainless_stim);
    
    // Initialize all outputs
    data_in = 0;
    addr_bus = 0;
    invert = 0;
    arith = 0;
    pass = 0;
    load_acc = 0;
    acc_to_db = 0;
    reset = 0;
    write = 0;
    read = 0;
    
    // ********** ONLY MODIFY BELOW THIS LINE *****************
    
    // Test vectors
    // Format: 28'haccum_aluOut_dataBus_addrBus_aluControls_loadAcc_accToDb_write_read_reset
    // aluControls = {invert, arith, pass} (3 bits)
    
           test_vals[0] = 28'h0000004; // Reset=1
    test_vals[1] = 28'h0000000; // Reset=0  
    test_vals[2] = 28'h0003011; // Load 3 attempt
    test_vals[3] = 28'h0003011; // Same (check)
    test_vals[4] = 28'h0003000; // Hold
    test_vals[5] = 28'h0003000; // Hold
    test_vals[6] = 28'h0003000; // Hold
    test_vals[7] = 28'h0003000; // Hold
    
    // ********** ONLY MODIFY ABOVE THIS LINE *****************
    
    // Apply test vectors
    for (test_addr = 0; test_addr < num_tests; test_addr = test_addr + 1) begin
        response = test_vals[test_addr];
        
        // Apply inputs on falling edge of clock
        @(negedge clk);
        
        // Set control signals
        reset = exp_reset;
        read = exp_read;
        write = exp_write;
        acc_to_db = exp_acc_to_db;
        load_acc = exp_load_acc;
        
        // Set ALU controls
        {invert, arith, pass} = exp_alu_ctrl;
        
        // Set address bus
        addr_bus = exp_addr_bus;
        
        // Wait for outputs to stabilize, then check on rising edge
        @(posedge clk);
        #2; // Small delay for output stabilization
        
        // Check outputs
        if (accum !== exp_accum) begin
            $display("Error at test %0d: accum = %h, expected %h", 
                     test_addr, accum, exp_accum);
            errors = errors + 1;
        end
        
        if (alu_out !== exp_alu_out) begin
            $display("Error at test %0d: alu_out = %h, expected %h", 
                     test_addr, alu_out, exp_alu_out);
            errors = errors + 1;
        end
        
        if (data_bus !== exp_data_bus) begin
            $display("Error at test %0d: data_bus = %h, expected %h", 
                     test_addr, data_bus, exp_data_bus);
            errors = errors + 1;
        end
    end
    
    // Summary
    if (errors == 0)
        $display("All tests passed!");
    else
        $display("%0d tests failed", errors);
    
    $finish;
end

endmodule