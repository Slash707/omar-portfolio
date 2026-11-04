/* ===== EDIT YOUR DETAILS HERE ===== */
const CONFIG = {
  email: "omarmfa2211@gmail.com",
  linkedin: "https://www.linkedin.com/in/omar-ahmed-30925635b",
  github: "",                          // paste your GitHub profile URL here; the icon appears automatically
  location: "Kuwait City, Kuwait",
  profilePhoto: "assets/profile.jpg",  // the site also tries .jpeg, .png, .webp and a few other names
  showPlaceholders: false
};

const SKILLS = {
  "Programming": ["C++", "JavaScript", "Verilog", "HTML and CSS"],
  "Digital electronics": ["Digital Logic Design", "Logic Gates", "Adders", "Multiplexers", "Registers", "ALU Architecture", "Digital Circuit Simulation"],
  "Hardware and robotics": ["Arduino", "Sensors", "Motors", "Electronic Circuits", "Robotics", "Microcontroller Fundamentals"],
  "Engineering and research": ["Control Systems Fundamentals", "Renewable Energy Systems Research", "Technical Research and Analysis", "Engineering Problem-Solving", "System Architecture Fundamentals"],
  "Software and tools": ["Icarus Verilog", "GTKWave", "Tinkercad", "Microsoft Excel", "Microsoft Word", "Microsoft PowerPoint"]
};

/* thumb: a real image shown on the project card. Projects without a real image show no thumbnail. */
const PROJECTS = [
  {
    id: "project-robotics",
    title: "International Robotics Competitions",
    tag: "Robotics, high school",
    summary: "Two international robotics competitions combining electronics, sensors, motors, and programming in a team setting.",
    overview: "During high school I took part in two international robotics competitions. They put me in a team environment where mechanical parts, electrical circuits, sensors, motors, and code all had to work together.",
    objective: "Compete as part of a team by contributing to a working robot that integrates mechanical, electronic, and software components.",
    tools: ["Robotics hardware", "Sensors", "Motors", "Electrical circuits", "Programming"],
    contrib: ["Participated in two international robotics competitions as a team member."],
    concepts: ["Integration of mechanical, electronic, and software subsystems", "Sensor and motor interfacing", "Teamwork under competition constraints"],
    learn: ["Early hands-on experience that sparked my interest in engineering.", "Practice in debugging systems where hardware and software interact."],
    docs: [], links: [], media: []
  },
  {
    id: "project-alu",
    title: "ALU & Microprocessor Digital Design",
    tag: "Academic, Verilog",
    thumb: { src: "assets/projects/wave-micro.svg", alt: "Simulation waveform of my microprocessor design" },
    summary: "Designed and simulated digital logic circuits from basic adders to a full microprocessor with a microcoded controller using Verilog.",
    overview: "This coursework took a design from single gates to a small processor. I drew each circuit in a Digital logic simulator, exported it to Verilog, and simulated it with Icarus Verilog using test-vector files. It covers half and full adders, multiplexers, a 4-bit register built from D flip-flops, program counters, and finally a microprocessor with a controller driven by a microcoded ROM, an address generator, and RAM loaded from a file.",
    objective: "Understand how basic digital components combine into registers, an ALU and a working processor, and check each design in simulation.",
    tools: ["Digital (logic simulator)", "Verilog", "Icarus Verilog", "GTKWave (VCD waveforms)"],
    contrib: ["Designed and simulated the circuits for each assignment as coursework.", "Wrote test vectors and ran the simulations, using the VCD waveforms to check behavior."],
    concepts: ["Combinational logic: adders, multiplexers, incrementer", "Sequential logic: D flip-flops, register with enable and reset, program counter", "ALU with invert, pass, carry-out and overflow signals", "Microcoded control: step counter, instruction register, ROM", "Test-vector simulation and waveform inspection"],
    learn: ["How small blocks compose into a datapath and then a processor.", "How to read VCD waveforms to confirm or debug behavior."],
    alu: true,
    docs: [
      { label: "ALU & Multiplexer source files (.zip)", href: "assets/docs/ALU_Multiplexer_Design_Files.zip" },
      { label: "Register & CPU source files (.zip)", href: "assets/docs/Register_CPU_Design_Files.zip" },
      { label: "Microprocessor source files (.zip)", href: "assets/docs/Microprocessor_Design_Files.zip" }
    ],
    links: [],
    media: [
      { src: "assets/projects/wave-mux.svg", alt: "Waveform of the 4-bit multiplexer plotted from my simulation" },
      { src: "assets/projects/wave-reg.svg", alt: "Waveform of the 4-bit register plotted from my simulation" },
      { src: "assets/projects/wave-micro.svg", alt: "Waveform of the microprocessor plotted from my simulation" }
    ]
  },
  {
    id: "project-trashforce",
    title: "Trash Force Trio: Forest Robot System",
    tag: "Team design project",
    thumb: { src: "assets/projects/eco-circuit.jpg", alt: "Tinkercad circuit of my Eco-Monitor robot" },
    summary: "A team design for three cooperating forest-maintenance robots. I designed and simulated the Eco-Monitor, a soil-moisture robot, in Tinkercad.",
    overview: "Trash Force Trio is the FSE 100 (Introduction to Engineering) team project of team Circuit Squad, with Janisha Johnson and Mona Breslau. The team proposed three cooperating robots to help maintain forest trails: a Patrol Ranger that follows trails and flags hazards, an Obstacle Guardian that clears obstacles, and an Eco-Monitor that measures soil moisture at target locations. The report covers research, requirements, individual ideation, decision matrices, designs, algorithms with flowcharts, Tinkercad models, and Tinkercad circuit simulations.",
    objective: "Propose and model a coordinated robot team that reduces the manual labor of forest trail maintenance.",
    tools: ["Tinkercad (3D model and circuit)", "Arduino Uno", "Ultrasonic, IR and soil moisture sensors", "Servo and DC motors", "Flowcharts", "Decision matrix / AHP"],
    contrib: ["Wrote requirements for the Eco-Monitor, Trash Collector and Obstacle Guardian.", "Wrote the project schedule section (phases and milestones).", "Proposed my own concepts for the Eco-Monitor, Trash Collector Bot and Obstacle Guardian.", "Wrote the proposed Eco-Monitor design: sensors, actuators, algorithm and flowchart.", "Built the Eco-Monitor Tinkercad 3D model and the Tinkercad circuit that simulates its algorithm (Arduino Uno, soil moisture sensor, ultrasonic sensor, servo, two DC motors)."],
    concepts: ["Requirements engineering", "Sensor and actuator selection", "Algorithm design and flowcharts", "Weighted decision matrices (AHP)", "Circuit simulation"],
    learn: ["Early prototyping and frequent testing matter, especially for sensors on uneven terrain.", "Communication between robots was hard, which taught the team to simplify and plan backup methods."],
    docs: [
      { label: "Full team report (PDF)", href: "assets/docs/FSE100_Final_Report.pdf" },
      { label: "Pitch slides (PDF)", href: "assets/docs/Trash_Force_Trio_Slides.pdf" }
    ],
    links: [
      { label: "Eco-Monitor simulation video (YouTube)", href: "https://youtu.be/agQ80y1PLqM" },
      { label: "Team pitch video (YouTube)", href: "https://youtu.be/xqhZXyMk4mA" }
    ],
    media: [
      { src: "assets/projects/eco-3d.jpg", alt: "Tinkercad 3D model views of the Eco-Monitor robot" },
      { src: "assets/projects/eco-flow.jpg", alt: "Eco-Monitor algorithm flowchart" },
      { src: "assets/projects/eco-circuit.jpg", alt: "Tinkercad circuit of the Eco-Monitor" }
    ]
  },
  {
    id: "project-arduino",
    title: "Arduino Microcontroller Prototyping",
    tag: "Hands-on electronics",
    summary: "Integrating Arduino boards, sensors, motors, and code into small interactive systems.",
    overview: "I have worked with Arduino, sensors, motors, and electronic circuits, writing programs that connect them into interactive systems.",
    objective: "Build working systems by pairing circuit design with microcontroller programming.",
    tools: ["Arduino", "Sensors", "Motors", "Electronic circuits", "Programming (C++)"],
    contrib: ["Wired circuits and wrote code to make components work together."],
    concepts: ["Microcontroller fundamentals", "Reading sensors and driving motors", "Circuit building and testing"],
    learn: ["Fundamentals of microcontrollers; I have not claimed PCB design or production firmware work."],
    docs: [], links: [], media: []
  }
];

/* preview: a real image of the document's first page, or a real waveform from my simulations */
const DOCS = [
  { title: "Resume", href: "assets/resume.pdf", preview: "assets/previews/resume.jpg", sum: "My current resume: ASU Electrical Engineering (expected 2029), skills, relevant coursework, and academic projects." },
  { title: "Trash Force Trio Report", href: "assets/docs/FSE100_Final_Report.pdf", preview: "assets/previews/report.jpg", sum: "Team report for a three-robot forest maintenance system. Covers requirements, designs, algorithms, decision matrices, and Tinkercad simulations; includes my Eco-Monitor design and circuit." },
  { title: "Trash Force Trio Slides", href: "assets/docs/Trash_Force_Trio_Slides.pdf", preview: "assets/previews/slides.jpg", sum: "Short slide deck pitching the project: the problem, the three robots, their sensors and outputs, and how they collaborate." },
  { title: "ALU & Multiplexer Design", href: "assets/docs/ALU_Multiplexer_Design_Files.zip", preview: "assets/projects/wave-mux.svg", sum: "Digital and Verilog files for half and full adders, a 4-bit adder, multiplexers, an incrementer, and a not/negate circuit, with test vectors." },
  { title: "Register & CPU Design", href: "assets/docs/Register_CPU_Design_Files.zip", preview: "assets/projects/wave-reg.svg", sum: "Files for a 4-bit register, program counter, program RAM, an ALU, and a simple CPU, with testbenches." },
  { title: "Microprocessor Design", href: "assets/docs/Microprocessor_Design_Files.zip", preview: "assets/projects/wave-micro.svg", sum: "Files for a small microprocessor with a controller, address generator, registers, and memory, with a test-vector testbench." }
];

/* Verilog design cards in the "Code & Hardware Projects" section (internal id: labGrid) */
const LABS = [
  {
    title: "ALU & Multiplexer Implementation", sub: "Combinational logic",
    points: [
      "Built half and full adders, a 4-bit adder, 2-bit and 4-bit multiplexers, an incrementer, and a not/negate circuit in Digital.",
      "Exported the 4-bit multiplexer to Verilog and tested it with vectors: select 0 passes A, select 1 passes B.",
      "The simulation ran with no output mismatches."
    ],
    wave: { src: "assets/projects/wave-mux.svg", alt: "Waveform of the 4-bit multiplexer: output y follows a when sel is 0 and b when sel is 1" },
    zip: { label: "Download ALU files", href: "assets/docs/ALU_Multiplexer_Design_Files.zip" }
  },
  {
    title: "Register & Simple CPU Architecture", sub: "Sequential logic",
    points: [
      "Built a 4-bit register from D flip-flops with enable and reset, plus a program counter and program RAM.",
      "Combined an ALU, accumulator and RAM into a simple CPU datapath.",
      "The register testbench ran with no output mismatches. The waveform shows it loading F while enabled, holding, then clearing on reset."
    ],
    wave: { src: "assets/projects/wave-reg.svg", alt: "Waveform of the 4-bit register: q loads F when enable is high, holds, then clears on reset" },
    zip: { label: "Download register files", href: "assets/docs/Register_CPU_Design_Files.zip" }
  },
  {
    title: "Microprocessor Datapath & Control", sub: "Datapath and control",
    points: [
      "Combined the datapath with a controller that uses a 64x14 microcode ROM, a step register, and an instruction register.",
      "Added an address generator (program counter and memory address register) and RAM contents loaded from a file.",
      "The waveform shows the step counter cycling, the program counter advancing, and the accumulator loading a value from RAM."
    ],
    wave: { src: "assets/projects/wave-micro.svg", alt: "Waveform of the microprocessor: clock, reset, step register, program counter and accumulator" },
    zip: { label: "Download microprocessor files", href: "assets/docs/Microprocessor_Design_Files.zip" }
  }
];

const VFILES = [
  { name: "multiplexer_4bit.v", path: "verilog/multiplexer_4bit.v", note: "Verilog exported from my Digital 4-bit multiplexer, built from four 2-bit multiplexers." },
  { name: "multiplexer_4bit_vectors.txt", path: "verilog/multiplexer_4bit_vectors.txt", note: "My multiplexer test vectors: expected y, select, a, b." },
  { name: "register_4bit.v", path: "verilog/register_4bit.v", note: "Verilog exported from my 4-bit register: four D flip-flops with enable and reset." },
  { name: "register_4bit_stim.v", path: "verilog/register_4bit_stim.v", note: "Stimulus file with the register's test vectors." },
  { name: "microprocessor.v", path: "verilog/microprocessor.v", note: "Verilog exported from my microprocessor: controller with microcode ROM, address generator, and the accumulator datapath." },
  { name: "microprocessor_stim.v", path: "verilog/microprocessor_stim.v", note: "Stimulus file for the microprocessor testbench." }
];

const CPPFILES = [
  { name: "alu_model.cpp", path: "cpp/alu_model.cpp", note: "Software model of a 4-bit ALU built from full adders and logic operations." },
  { name: "fuzzy_membership.cpp", path: "cpp/fuzzy_membership.cpp", note: "Fuzzification of wind speed into LOW, MEDIUM and HIGH sets: a concept study, not the internship system." }
];