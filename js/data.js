/* ===== EDIT YOUR DETAILS HERE ===== */
const CONFIG = {
  email: "omarmfa2211@gmail.com",
  linkedin: "https://www.linkedin.com/in/omar-ahmed-30925635b",
  github: "https://github.com/Slash707",
  location: "Kuwait City, Kuwait",
  profilePhoto: "",
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
    tag: "Digital logic design, Verilog",
    summary: "Coursework in combinational and sequential digital design, from adders and multiplexers to registers, ALU architecture, and a small microprocessor.",
    overview: "I used a digital logic simulator to design and study circuits ranging from basic gates to a small processor. The coursework covered half and full adders, multiplexers, an ALU, registers, a program counter, and a microprocessor datapath and controller. I implemented designs in Verilog, tested them with Icarus Verilog testbenches, and inspected signal waveforms in GTKWave to check their behavior.",
    objective: "Understand how basic logic components combine into larger digital systems, and use simulation to verify that their outputs follow the expected behavior.",
    tools: ["Digital logic simulator", "Verilog", "Icarus Verilog", "GTKWave"],
    contrib: [
      "Designed and tested combinational logic including adders, multiplexers, and ALU operations.",
      "Worked with sequential components including D flip-flop registers and a program counter.",
      "Combined datapath and control components into a small microprocessor coursework design.",
      "Ran testbenches and test vectors, then inspected simulation waveforms to check signal behavior."
    ],
    concepts: [
      "Combinational and sequential logic",
      "Adders, multiplexers, and ALU operations",
      "Registers, program counters, and processor datapaths",
      "Microcoded control and simulation-based verification"
    ],
    learn: [
      "How individual logic blocks combine into a datapath and processor.",
      "How testbenches and waveforms help identify and verify digital circuit behavior."
    ],
    alu: true,
    docs: [],
    links: [],
    media: []
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
  { title: "Trash Force Trio Slides", href: "assets/docs/Trash_Force_Trio_Slides.pdf", preview: "assets/previews/slides.jpg", sum: "Short slide deck pitching the project: the problem, the three robots, their sensors and outputs, and how they collaborate." }
];

/* Verilog design cards in the "Code & Hardware Projects" section (internal id: labGrid) */
const LABS = [
  {
    title: "Digital Logic Design & Microprocessor Summary",
    sub: "Verilog, Icarus Verilog & GTKWave",
    points: [
      "Designed combinational logic such as half and full adders, multiplexers, incrementers, and ALU operations.",
      "Worked with sequential logic including registers, a program counter, and a small microprocessor datapath and controller.",
      "Used Icarus Verilog testbenches and test vectors, then inspected signal waveforms in GTKWave to verify expected behavior."
    ]
  }
];

const CPPFILES = [
  { name: "alu_model.cpp", path: "cpp/alu_model.cpp", note: "Software model of a 4-bit ALU built from full adders and logic operations." },
  { name: "fuzzy_membership.cpp", path: "cpp/fuzzy_membership.cpp", note: "Fuzzification of wind speed into LOW, MEDIUM and HIGH sets: a concept study, not the internship system." }
];