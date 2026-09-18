/* Lawsonite Field Guides content. Original educational field cards.
   Official manufacturer links only — we do not host copyrighted manuals. */
window.__LAWSONITE_GUIDES__ = {
  groups: [
    { key: 'learn', title: 'Learn', sub: 'Crash courses', icon: 'meter', ids: ['meter', 'first-five', 'safety'] },
    { key: 'cheat', title: 'Cheats', sub: 'Lookups', icon: 'wire', ids: ['readings', 'pinouts', 'resistor', 'poe', 'fail-safe', 'ip', 'toner', 'keypad', 'vista-128', 'wireless-5800', 'ecp-vplex', 'rj31x', 'ampacity', 'verkada-claim', 'bosch-sdi2', 'mercury-bus', 'simplex-4100', 'firelite-protocol'] },
    { key: 'ts', title: 'Calls', sub: 'Symptom trees', icon: 'zap', ids: ['camera-offline', 'reader-dead', 'maglock', 'door-latch', 'access-denied', 'no-comms', 'ac-batt', 'zone-open', 'no-link', 'doorbell', 'keypad-blank', 'wireless-sup', 'polling-trouble', 'verkada-blank', 'verkada-door', 'bosch-lsn', 'nac-booster', 'comms-takeover'] },
    { key: 'docs', title: 'Docs', sub: 'Official sheets', icon: 'book', ids: ['manuals'] }
  ],
  pages: {}
};

(function (P) {
  P.meter = {
    id: 'meter', icon: 'meter', kind: 'guide', eyebrow: 'Crash course · 8 minutes',
    title: 'Voltmeter crash course',
    hub: 'Newbie with a meter and a lock that will not',
    lede: 'You are on site, the lock is dead, and someone handed you a meter. This is the version that keeps you from blowing the fuse, measuring ohms on a live NAC, or calling a maglock bad when the run is just starving.',
    tags: ['meter', 'multimeter', 'voltage', 'continuity', 'ohms', 'newbie', 'DMM'],
    related: [
      { href: '/guides/readings', label: 'Expected voltages' },
      { href: '/guides/resistor', label: 'Resistor / EOL' },
      { href: '/checklist/multimeter-basics', label: 'Meter punch list' },
      { href: '/refs#ohm', label: 'Ohm’s law calc' }
    ],
    sections: [
      { type: 'warn', text: 'Educational only. Your meter’s own manual wins. Do not use a cheap meter as a life-safety instrument on fire NAC or line voltage. If you are not qualified for the circuit, stop.' },
      { type: 'h2', text: 'Jacks first — this is how people blow meters', body: 'Black lead stays in COM. Red lead stays in VΩ for almost everything on a low-voltage job. The A / mA jack is only for current, in series, with the circuit opened. If you probe a power supply with the red lead in A, you short the supply through the meter and pop the fuse (or worse).' },
      {
        type: 'svg',
        caption: 'Left jack COM (black). Right jack VΩ (red) for voltage, ohms, continuity. The extra A jack is a trap until you mean it.',
        svg: '<svg viewBox="0 0 320 140" role="img" aria-label="Simple meter jack diagram"><rect x="20" y="20" width="280" height="100" rx="12" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="80" cy="70" r="18" fill="none" stroke="currentColor" stroke-width="2"/><text x="80" y="74" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor">COM</text><circle cx="160" cy="70" r="18" fill="none" stroke="currentColor" stroke-width="2"/><text x="160" y="74" text-anchor="middle" font-size="10" font-weight="700" fill="currentColor">VΩ</text><circle cx="240" cy="70" r="18" fill="none" stroke="#fb4f14" stroke-width="2"/><text x="240" y="74" text-anchor="middle" font-size="11" font-weight="700" fill="#fb4f14">A</text><text x="80" y="108" text-anchor="middle" font-size="10" fill="currentColor">black</text><text x="160" y="108" text-anchor="middle" font-size="10" fill="currentColor">almost always</text><text x="240" y="108" text-anchor="middle" font-size="10" fill="#fb4f14">current only</text></svg>'
      },
      {
        type: 'steps', title: 'Every measurement, same ritual',
        items: [
          { text: 'Confirm the dial: VDC, VAC, Ω, or continuity. Auto-range is fine; if it is manual, start higher than you expect.', tip: 'Locks and panels are DC. Doorbells and some transformers are AC. Guessing the wrong one gives you a confusing near-zero.' },
          'Touch COM/black to the negative / common / drain. Touch red to the point under test.',
          'Read it, then move. Do not leave the meter hanging in a can while you pull wire.',
          { text: 'If you get 0.00 and you expected voltage: check the dial, the jacks, a known-good battery, then the circuit.', tip: 'A dead meter fuse (from a previous current mistake) can make every voltage reading look like zero. Keep a 9V in the truck for a sanity check.' }
        ]
      },
      {
        type: 'widget', name: 'meter', title: 'What are you measuring right now?',
        targets: [
          { label: '12 V lock / maglock at the can', range: 'DC volts, 20 V or auto', where: 'Supply terminals at the power supply or lock controller. Red on +, black on −.', expect: '13.4–13.8 V with AC on and a healthy float. ~12.5–12.8 V on battery only.', ifnot: '0 V: dead supply, tripped breaker, blown DC fuse, wrong terminals. 11 V at the can: dying battery or the supply is set to 12 V and sagging under load.' },
          { label: 'Same lock at the door', range: 'DC volts', where: 'Lock pigtail, or the last landing before the coil. Same polarity.', expect: 'Within ~5–10% of what you had at the can. A 13.6 V can and 11.2 V door is voltage drop, not a “bad maglock.”', ifnot: 'Big drop: long run, 22 AWG doing an amp’s job, bad splice, shared return. Use the voltage-drop calc, then upsize or shorten.' },
          { label: 'Reader', range: 'DC volts at the reader', where: 'Red/black (or +V / GND) on the pigtail. Confirm 12 vs 24 on the label first.', expect: 'Label voltage, typically 12 V (11–14) or 24 V (22–28) under load.', ifnot: '0 V: open pair, reversed at a previous splice, controller output off. Low V: drop on a long 22/6. Reader that chirps then dies: brownout when the radio/backlight kicks in.' },
          { label: 'Burglar zone / contact', range: 'DC volts across the zone at the panel, then ohms with power off or zone disconnected', where: 'Zone + and − at the panel. For ohms, lift one side so you are not reading through the panel.', expect: 'Sealed with EOL: the programmed value (often ~1k, 2.2k, 4.7k). Shorted: near 0 Ω. Open: OL.', ifnot: 'Random jumping: poor splice, wet cable, a contact that is barely made. Measure at the device too — the run lies.' },
          { label: 'NAC / strobe circuit', range: 'DC volts, 50 V or auto', where: 'NAC +/− at the panel or booster. Polarity matters for sync and for some horns.', expect: 'Nominal 24 VDC; many panels sit ~24–28 V in standby. In alarm it must still hold up at the last device.', ifnot: 'Educational only. If this is a life-safety system, follow site protocol. 0 V: trouble, disabled circuit, or you are on the wrong pair. Big drop in alarm: overload or a T-tap.' },
          { label: 'PoE camera', range: 'DC volts if you must; a PoE tester is better', where: 'Do not pierce data pairs as a habit. Midspan injector DC input, or a known spare-pair injector.', expect: '802.3af/at/bt PSE is typically ~44–57 VDC. 12 V “passive PoE” is a different animal — matching them wrong cooks a camera.', ifnot: 'No link + no voltage: dead port, disabled PoE, budget exhausted. Voltage present, no data: VLAN, bad crimp, wrong pair. See the camera-offline tree.' },
          { label: 'Panel / standby battery', range: 'DC volts', where: 'Battery terminals themselves, then the charger float at the board.', expect: '12 V SLA: ~12.6–12.8 rest, ~13.5–13.8 on float. A battery that reads 12.6 with no load and collapses to 10 V under a horn is cooked.', ifnot: 'Charger float over ~14.4 V can boil a battery. Under ~13.2 V float with AC present: charger or AC problem, not “replace the battery and leave.”' },
          { label: 'Doorbell transformer', range: 'AC volts', where: 'Transformer secondary screws. Then at the chime and at the doorbell.', expect: 'Often 16 VAC. Video doorbells are piggy: they want enough VA (often 16 VAC 30 VA class), not just 16 V with nothing left.', ifnot: '0 VAC: dead transformer or tripped primary. 10 VAC under load: undersized VA or a long skinny run. See the doorbell tree.' }
        ]
      },
      {
        type: 'table', title: 'Dial positions you actually use',
        headers: ['Setting', 'Use it for', 'Do not'],
        rows: [
          ['V⎓  DC V', 'Locks, readers, NAC, batteries, most LV', 'A doorbell transformer (that is AC)'],
          ['V~  AC V', 'Doorbell xfmrs, 24 VAC cameras, 120 V only if qualified', 'A maglock (you will think it is dead)'],
          ['Ω', 'EOL, coil resistance, lifted pairs', 'A live circuit — you can damage the meter'],
          ['Continuity / beep', 'Finding the other end, a broken conductor', 'A live pair. Beep ≠ “this is the right voltage.”'],
          ['A / mA', 'Current in SERIES, circuit opened', 'Probing a supply in parallel. That is a dead short.']
        ]
      },
      {
        type: 'h2', text: 'Continuity vs ohms vs “it beeped”',
        body: 'Continuity is a crude ohms check with a beep. Great for “is this the same conductor.” Bad for “is this a 2.2 kΩ EOL.” Use ohms when the number matters. Lift the circuit so you are not reading through a panel, a diode, or a second device in parallel.'
      },
      {
        type: 'faq', title: 'I am seeing something stupid',
        items: [
          { q: 'Everything reads 0.00 V', a: 'Dial on DC? Red lead in VΩ, not A? Try a known 9 V battery. If the battery reads 0 too, the meter fuse or the meter is done. If the battery is fine, the circuit is actually dead — power, fuse, breaker, wrong pair.' },
          { q: 'I get a minus sign', a: 'You swapped leads. The magnitude is still useful. On a lock, minus just means you are sitting on the return. On a NAC, polarity can actually matter — flip it on purpose, do not ignore it.' },
          { q: 'Ohms wander while I hold the probes', a: 'You are measuring yourself (skin), a dirty splice, or a moving contact. Use firm pressure. For EOL, disconnect one side. For a coil, read it cold, off the circuit.' },
          { q: 'The lock works at the can but not at the door', a: 'That is voltage drop or a bad splice until proven otherwise. Measure DC at both ends under load (lock actually pulling). Then open the voltage-drop calc.' },
          { q: 'Can I measure PoE on an RJ45 with meter pins?', a: 'You can, and you can also wreck a jack. Prefer a PoE tester or measure at the injector DC input. If you must, know whether the port is Mode A (data pairs 1/2 + 3/6) or Mode B (4/5 + 7/8). Passive 12/24 V is not 802.3.' }
        ]
      }
    ]
  };

  P['first-five'] = {
    id: 'first-five', icon: 'user', kind: 'guide', eyebrow: 'On site',
    title: 'First five minutes on site',
    hub: 'Before you climb, before you swap parts',
    lede: 'Most callbacks start in the first five minutes: nobody wrote down the zone text, nobody checked AC, and somebody reset the panel before looking.',
    tags: ['process', 'service', 'intake', 'newbie'],
    related: [{ href: '/guides/safety', label: 'Don’t make it worse' }, { href: '/guides/meter', label: 'Meter course' }, { href: '/jobsheets', label: 'Job sheet' }],
    sections: [
      {
        type: 'checks', title: 'Do these before you touch a device',
        items: [
          'Who called, and what did they actually see or hear? Alarm, chirp, trouble, “camera down,” door won’t lock — those are different jobs.',
          'Life safety first. Occupied building + any chance of a real fire or medical: follow site protocol. You are not troubleshooting a detector during an evacuation.',
          'Photo the panel / switch / lock can as you found it: LEDs, LCD text, jumper positions, the mess of wires.',
          'Write the exact zone / camera / door name and the time from the history. That is what monitoring, the next tech, and the AHJ will ask for.',
          'Power: AC present? Battery voltage at the battery? Any trouble LED you are about to clear?',
          'Ask what changed: construction, IT VLAN, new cameras, a painter, a storm, a “we just reset it.”',
          'If you are going to drop a maglock or a fire-interface door, know the egress path before you do it.'
        ]
      },
      { type: 'tip', text: 'A job sheet with site, time, and the panel text takes 40 seconds and saves the next visit. Use Lawsonite’s Job sheet from the checklist toolbar.' }
    ]
  };

  P.safety = {
    id: 'safety', icon: 'fire', kind: 'guide', eyebrow: 'Do not make it worse',
    title: 'Doors, fire, and “just jumper it”',
    hub: 'The ways a service call becomes a real problem',
    lede: 'Low voltage still moves doors and fire appliances. The fastest way to get someone hurt — or you fired — is a fail-safe/fail-secure mixup or a silenced NAC you forgot to restore.',
    tags: ['safety', 'egress', 'fire', 'fail-safe', 'AHJ'],
    related: [{ href: '/guides/fail-safe', label: 'Fail-safe vs fail-secure' }, { href: '/checklist/fire-alarm-interface-free-egress', label: 'Free egress checklist' }],
    sections: [
      { type: 'warn', text: 'If a door is on an egress path, you do not get to “temporarily” leave it locked without power, or unlocked without the owner knowing. Fire-interface and delayed-egress hardware have rules. When in doubt, secure the building the way you found it and escalate.' },
      {
        type: 'steps', title: 'Hard no’s',
        items: [
          'Do not disable a fire alarm, NAC, or elevator recall to “get the trouble to clear” unless you are authorized and have a fire watch / impairment process.',
          'Do not jumper a maglock across a supply “just to test” and walk away. You just defeated REX, fire release, and maybe the listed hardware.',
          'Do not swap fail-safe and fail-secure strikes because the one in the truck “almost fits.” The door’s job in a power loss is a life-safety decision.',
          'Do not megger (high-voltage insulation test) a data pair, a reader, or a camera. You will let the smoke out.',
          'Line voltage (120 V transformers, NAC boosters with mains): if you are not qualified, you do not open that.'
        ]
      }
    ]
  };

  P.readings = {
    id: 'readings', icon: 'meter', kind: 'cheat', eyebrow: 'Cheat sheet',
    title: 'Expected voltages',
    hub: 'What “good” looks like on a meter',
    lede: 'Typical field numbers. The device label and the panel programming always win. Measure under load when it matters (lock pulled in, camera IR on, NAC in alarm).',
    tags: ['voltage', 'battery', '12V', '24V', 'PoE', 'NAC'],
    related: [{ href: '/guides/meter', label: 'Meter course' }, { href: '/refs#vd', label: 'Voltage drop' }, { href: '/refs#poe', label: 'PoE budget' }],
    sections: [
      {
        type: 'table', title: 'Power',
        headers: ['What', 'Typical', 'Sick'],
        rows: [
          ['12 V SLA battery, rest', '12.6–12.8 V', '<12.2 V rest, or collapses under load'],
          ['12 V SLA on float', '13.5–13.8 V', '<13.2 with AC present, or >14.4 boiling'],
          ['24 V battery set (two 12s)', '27–27.6 V float', 'One battery in the pair is hiding — measure each'],
          ['12 V lock supply', '12.0 set / ~13.6 float combo', 'Set to 12.0 and a long run = a weak lock'],
          ['24 V lock / NAC supply', '24–28 V', 'Sags hard when the last strobe turns on'],
          ['Reader 12 V', '11–14 V at the reader', '<11 V: drop or a hungry keypad/backlight'],
          ['PoE PSE (802.3)', '~44–57 VDC', '0 V: port off / budget. 12 or 24 V: passive, not 802.3'],
          ['Doorbell xfmr', '16 VAC common', '10 VAC under a video doorbell: starved VA'],
          ['Camera 12 V barrel', '12.0–12.6 V', 'Wall wart that reads 18 V open and 9 V loaded']
        ],
        foot: 'Float vs rest: a battery still on the charger is not a load test. Lift it or watch it when the panel goes to battery.'
      },
      {
        type: 'table', title: 'Supervision / EOL (ohms, circuit isolated)',
        headers: ['What you read', 'Usually means', 'Next'],
        rows: [
          ['Near 0 Ω', 'Shorted pair or a contact welded/bridged', 'Lift the EOL, isolate halves of the run'],
          ['The programmed EOL (1k / 2.2k / 4.7k…)', 'Sealed, happy', 'Confirm it matches programming, not just “a resistor”'],
          ['OL / infinite', 'Open: cut, unplugged, missing EOL, broken conductor', 'Walk from the last known landing'],
          ['EOL ± a little, jumping', 'Intermittent contact, wet cable, poor splice', 'Wiggle test, then replace the last 10 feet']
        ]
      }
    ]
  };

  P.pinouts = {
    id: 'pinouts', icon: 'wire', kind: 'cheat', eyebrow: 'Cheat sheet',
    title: 'Pinouts & pairs',
    hub: 'RJ45, Wiegand, OSDP, lock, PoE',
    lede: 'The colors people argue about on the truck. Always check the reader card — HID is common, not universal.',
    tags: ['568B', 'RJ45', 'Wiegand', 'OSDP', 'pinout', 'PoE', 'wiring'],
    related: [{ href: '/guides/poe', label: 'PoE classes' }, { href: '/guides/reader-dead', label: 'Reader dead' }],
    sections: [
      {
        type: 'h2', text: 'T568B (use this unless the site is already T568A end-to-end)',
        body: 'Both ends the same. Mixing A and B on one cable is a split pair and a mystery until you look.'
      },
      {
        type: 'svg',
        caption: 'T568B looking at the jack: 1 white/orange, 2 orange, 3 white/green, 4 blue, 5 white/blue, 6 green, 7 white/brown, 8 brown.',
        svg: '<svg viewBox="0 0 320 150" role="img" aria-label="T568B pair colors"><rect x="30" y="20" width="260" height="90" rx="8" fill="none" stroke="currentColor" stroke-width="2"/><g font-size="9" font-weight="700" text-anchor="middle"><rect x="46" y="36" width="22" height="50" fill="#f8e0b0"/><text x="57" y="64" fill="#333">w/O</text><rect x="78" y="36" width="22" height="50" fill="#e67e22"/><text x="89" y="64" fill="#fff">O</text><rect x="110" y="36" width="22" height="50" fill="#d5f5e3"/><text x="121" y="64" fill="#333">w/G</text><rect x="142" y="36" width="22" height="50" fill="#3498db"/><text x="153" y="64" fill="#fff">Bl</text><rect x="174" y="36" width="22" height="50" fill="#d6eaf8"/><text x="185" y="64" fill="#333">w/B</text><rect x="206" y="36" width="22" height="50" fill="#1e8449"/><text x="217" y="64" fill="#fff">G</text><rect x="238" y="36" width="22" height="50" fill="#f5e6d3"/><text x="249" y="64" fill="#333">w/Br</text><rect x="270" y="36" width="22" height="50" fill="#6e2c00"/><text x="281" y="64" fill="#fff">Br</text></g><text x="160" y="132" text-anchor="middle" font-size="11" fill="currentColor">Pin 1 left → pin 8 right (clip down, facing you)</text></svg>'
      },
      {
        type: 'table', title: 'PoE on that same jack',
        headers: ['Standard', 'Power on', 'Notes'],
        rows: [
          ['802.3af/at Mode A', '1/2 and 3/6 (data pairs)', 'Common on cameras / phones'],
          ['802.3af/at Mode B', '4/5 and 7/8 (spare pairs)', 'Many injectors'],
          ['802.3bt (Type 3/4)', 'All four pairs', 'Higher watt PTZ / heaters'],
          ['Passive 12/24 V', 'Whoever built the injector', 'Not 802.3. Will damage a 48 V-only radio or vice versa']
        ]
      },
      {
        type: 'table', title: 'HID-style Wiegand pigtail (verify on the sheet)',
        headers: ['Color', 'Typical'],
        rows: [
          ['Red', '+VDC'],
          ['Black', 'Ground'],
          ['Green', 'Data0 / RS-485-B*'],
          ['White', 'Data1 / RS-485-A*'],
          ['Orange', 'Green LED'],
          ['Yellow', 'Beeper'],
          ['Brown', 'Red LED'],
          ['Blue', 'Hold / extra LED'],
          ['Drain', 'Shield — ground at the panel end only']
        ],
        foot: '*On HID Signo, green/white double as OSDP RS-485. Do not land Wiegand and OSDP as if they were the same job. Official sheet: HID Signo install guide.'
      },
      {
        type: 'table', title: 'OSDP / RS-485 reader (typical)',
        headers: ['Wire', 'Job'],
        rows: [
          ['+V / GND', '12–24 V per label, sized for the run'],
          ['A / B (twisted pair)', 'RS-485. Swap A/B if it will not poll — first trick, not a new reader.'],
          ['Shield', 'Single-end ground. Grounding both ends is how you build a ground loop.'],
          ['EOL', '120 Ω at the far end of a multi-drop bus, not on every reader by default']
        ]
      },
      {
        type: 'h2', text: 'Maglock / strike at the door',
        body: 'Power pair to the coil. Bond / door-status is a separate supervised loop. REX / motion / crash bar is what lets people out. Fire-release is what drops the lock on alarm. Do not share a random negative with a reader unless the drawing says so.'
      }
    ]
  };

  P.resistor = {
    id: 'resistor', icon: 'wire', kind: 'cheat', eyebrow: 'Cheat sheet',
    title: 'Resistor color code & EOL',
    hub: 'What is that little stripey thing at the contact',
    lede: 'EOL is not a lucky charm. It has to match what the panel is programmed for, and it has to sit at the last device, not in the can (unless it is a non-supervised home-run and you know that).',
    tags: ['EOL', 'resistor', 'color code', '2.2k', '4.7k', 'supervision'],
    related: [{ href: '/refs#eol', label: 'EOL helper' }, { href: '/guides/meter', label: 'Meter course' }, { href: '/guides/zone-open', label: 'Zone won’t restore' }],
    sections: [
      { type: 'widget', name: 'resistor' },
      {
        type: 'table', title: 'EOLs you actually see',
        headers: ['Value', 'Where it shows up', 'Look'],
        rows: [
          ['1 kΩ', 'Some access / intrusion', 'Brown-black-red'],
          ['2.2 kΩ', 'Very common intrusion', 'Red-red-red'],
          ['4.7 kΩ', 'Common intrusion / some fire IDC', 'Yellow-violet-red'],
          ['3.0 / 3.9 kΩ', 'Some fire IDC', 'Check the panel, not the junk drawer'],
          ['10 kΩ', 'Some older / specialty', 'Brown-black-orange']
        ],
        foot: 'Fire IDC vs burglar: do not grab “a resistor.” Class B fire circuits are listed parts and a specific value. Educational only.'
      },
      { type: 'tip', text: 'If the panel wants 2.2 k and you stuffed 1 k in the can because it was in the bag, you will chase a “shorted zone” that is just math. Read programming, then read ohms with one side lifted.' }
    ]
  };

  P.poe = {
    id: 'poe', icon: 'net', kind: 'cheat', eyebrow: 'Cheat sheet',
    title: 'PoE classes & matching',
    hub: 'af / at / bt / passive — do not mix them up',
    lede: 'A camera that reboots when IR kicks on is often a class mismatch or a hungry budget, not a “bad camera.”',
    tags: ['PoE', '802.3af', '802.3at', '802.3bt', 'class', 'camera'],
    related: [{ href: '/refs#poe', label: 'PoE budget calc' }, { href: '/guides/camera-offline', label: 'Camera offline' }, { href: '/checklist/poe-night-ir-reboot-isolation', label: 'Night-IR punch list' }],
    sections: [
      {
        type: 'table',
        headers: ['Name', 'IEEE', 'Rough watts at PD', 'Typical'],
        rows: [
          ['Class 0 / 3  (af)', '802.3af Type 1', '~13 W', 'Small indoor camera, VoIP phone'],
          ['Class 4  (at / PoE+)', '802.3at Type 2', '~25.5 W', 'IR turret, small PTZ, some heaters'],
          ['Class 5–6 (bt)', '802.3bt Type 3', '~51–60 W', 'PTZ, multi-sensor, heater + IR'],
          ['Class 7–8 (bt)', '802.3bt Type 4', '~71–90 W', 'Big PTZ / lighting / high-draw'],
          ['Passive 12 / 24 V', 'not IEEE', 'Whatever the brick is', 'Some radios, some “PoE” injectors from a junk drawer']
        ],
        foot: 'PSE (switch/injector) must meet or exceed the PD (camera). A 15 W port and a 25 W camera is a night-time reboot waiting to happen.'
      },
      {
        type: 'steps', title: 'Match check in 30 seconds',
        items: [
          'Read the camera label: 802.3af, at, bt, or 12 V DC.',
          'Read the switch port / injector: same family. UniFi “PoE” vs “PoE+” vs “PoE++” is not a suggestion.',
          'Long cheap CCA cable counts as extra load. If IR kills it, try a known-good short patch at the switch first.',
          'Passive 24 V into an 802.3-only camera, or 48 V into a passive-only radio, is how you buy a new one.'
        ]
      }
    ]
  };

  P['fail-safe'] = {
    id: 'fail-safe', icon: 'lock', kind: 'cheat', eyebrow: 'Cheat sheet',
    title: 'Fail-safe vs fail-secure',
    hub: 'What the door does when power dies',
    lede: 'Fail-safe: loss of power unlocks (typical maglock). Fail-secure: loss of power stays locked (typical storeroom strike). Egress and fire codes can override what the hardware wants.',
    tags: ['fail-safe', 'fail-secure', 'maglock', 'strike', 'egress'],
    related: [{ href: '/checklist/fail-safe-vs-fail-secure-wiring', label: 'Wiring checklist' }, { href: '/guides/maglock', label: 'Maglock tree' }, { href: '/guides/safety', label: 'Don’t make it worse' }],
    sections: [
      {
        type: 'svg',
        caption: 'Power to lock vs power to unlock. If you land a fail-secure strike on a maglock power-loss-unlock output, the door does the opposite of the drawing.',
        svg: '<svg viewBox="0 0 320 160" role="img" aria-label="Fail-safe versus fail-secure"><rect x="16" y="16" width="136" height="128" rx="10" fill="none" stroke="currentColor" stroke-width="2"/><text x="84" y="40" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">Fail-safe</text><text x="84" y="62" text-anchor="middle" font-size="10" fill="currentColor">Power ON = locked</text><text x="84" y="80" text-anchor="middle" font-size="10" fill="currentColor">Power OFF = open</text><text x="84" y="112" text-anchor="middle" font-size="10" fill="currentColor">Maglock, some</text><text x="84" y="128" text-anchor="middle" font-size="10" fill="currentColor">fire-release doors</text><rect x="168" y="16" width="136" height="128" rx="10" fill="none" stroke="currentColor" stroke-width="2"/><text x="236" y="40" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">Fail-secure</text><text x="236" y="62" text-anchor="middle" font-size="10" fill="currentColor">Power ON = unlocked</text><text x="236" y="80" text-anchor="middle" font-size="10" fill="currentColor">Power OFF = locked</text><text x="236" y="112" text-anchor="middle" font-size="10" fill="currentColor">Storeroom strike,</text><text x="236" y="128" text-anchor="middle" font-size="10" fill="currentColor">many electrified locks</text></svg>'
      },
      { type: 'warn', text: 'Egress doors, stair towers, delayed egress, and fire-listed hardware are not “whatever is in the truck.” If the drawing and the hardware disagree, stop and ask. Unlocking a stair on power loss vs locking people in is not a wiring preference.' },
      {
        type: 'faq',
        items: [
          { q: 'The maglock dropped on a power blip and people walked out. Is it broken?', a: 'That is fail-safe doing its job. If the owner wanted it to stay locked on power loss, they specified the wrong device for that opening — or they need battery standby sized for the lock, plus a listed fire-release path.' },
          { q: 'Strike is locked with no power and I cannot get in.', a: 'Fail-secure. Mechanical key / core override is the way in, not 12 V from a drill battery unless you like melted coils.' }
        ]
      }
    ]
  };

  P.ip = {
    id: 'ip', icon: 'net', kind: 'cheat', eyebrow: 'Cheat sheet',
    title: 'Camera network mini',
    hub: 'Link light, IP, VLAN, the 30-second version',
    lede: 'You do not need to be IT. You do need to know why a camera is dark when the PoE light is green.',
    tags: ['IP', 'VLAN', 'DHCP', 'camera', 'ONVIF', 'subnet'],
    related: [{ href: '/guides/camera-offline', label: 'Camera offline' }, { href: '/guides/no-link', label: 'No link light' }],
    sections: [
      {
        type: 'steps', title: 'Layer it',
        items: [
          'No link light at the camera or the switch: it is copper, power, or the port. Not a password.',
          'Link, no picture: IP, VLAN, NVR channel, or the stream. Ping before you re-image a camera.',
          'Wrong subnet (camera 192.168.1.x, NVR 192.168.0.x, no route): they will never see each other. This is the #1 “IT changed something” call.',
          'DHCP vs static: a camera that worked for a year then vanished on a router swap often had a DHCP lease that died. Check the reservation, not the lens.',
          'Default credentials belong in the trash after commissioning. If you are authorized and it is still admin/admin, that is a finding — write it down.'
        ]
      },
      {
        type: 'table',
        headers: ['Shorthand', 'Meaning'],
        rows: [
          ['/24', '255.255.255.0 — 256 addresses, the usual camera LAN'],
          ['Gateway', 'Who you talk to to leave this LAN. Blank gateway = local only'],
          ['VLAN', 'A switch-enforced LAN. Wrong VLAN = link light, no NVR'],
          ['ONVIF', 'How many NVRs discover cameras. It is not magic if the VLAN is wrong'],
          ['802.1X', 'Port authentication. A replaced camera with the same IP can still be silent']
        ]
      }
    ]
  };

  P.toner = {
    id: 'toner', icon: 'wire', kind: 'guide', eyebrow: 'Crash course',
    title: 'Tone and probe',
    hub: 'Find the other end without ripping the ceiling',
    lede: 'A toner puts a warble on a conductor. A probe hears it. It is not a cable certifier, and it will lie next to a bundle of angry 24 V locks.',
    tags: ['toner', 'probe', 'cable', 'trace'],
    sections: [
      {
        type: 'steps',
        items: [
          'Disconnect the pair from the panel / switch if you can. Toning a live PoE pair is messy and sometimes unsafe for the port.',
          'Clip the toner on one conductor plus ground, or on the pair per the toner’s diagram. Start on the lowest setting.',
          'At the far end, sniff with the probe. The loudest jack is the winner — not the first one that whispers.',
          'If the whole bundle sings, you have inductive coupling. Drop the volume, isolate, or lift neighbors.',
          'Confirm with a continuity beep or a link light after you land it. Tone is a pointer, not a marriage certificate.'
        ]
      },
      { type: 'tip', text: 'Label both ends the same day you tone them. Future-you is the next tech, and future-you is mean.' }
    ]
  };

  function ts(id, icon, title, hub, lede, tags, sections, related) {
    P[id] = {
      id: id, icon: icon, kind: 'ts', eyebrow: 'Troubleshooting',
      title: title, hub: hub, lede: lede, tags: tags, sections: sections, related: related || []
    };
  }

  ts('camera-offline', 'cam', 'Camera has no picture / offline',
    'Link, power, IP — in that order',
    'Do not start in the NVR software if the Ethernet jack is dark. Copper first, then power, then IP.',
    ['camera', 'PoE', 'offline', 'NVR', 'IR'],
    [
      { type: 'warn', text: 'If this is a life-safety or evidence camera (casino, custody, ER), say so up front and do not factory-reset anything without the owner.' },
      { type: 'steps', title: '1. Physical / link', items: [
        'Link light on the camera and the switch port? No light: patch cord, punch, injector, or dead port. Swap a known-good 3-foot jumper at the switch.',
        'Power: PoE class vs camera label. Night-only death → IR / heater draw. See the night-IR punch list.',
        'Wiggle the RJ45. Intermittent cameras are often a bad crimp, not a haunted NVR.',
        'CCA or a 300-foot run on af: it works at noon and dies at dusk. Try a short known-good cable as a witness.'
      ]},
      { type: 'steps', title: '2. Power personality', items: [
        '802.3af camera on a passive 24 V injector — or the reverse — is a fried camera waiting to be invoiced.',
        'Port PoE disabled in the switch GUI is more common than a dead PHY. Look before you swap hardware.',
        'PoE budget exhausted: last camera added wins, everyone else brownouts. Open the PoE calc.'
      ]},
      { type: 'steps', title: '3. Network / NVR', items: [
        'Ping the camera from the NVR subnet. No ping + good link = VLAN or IP, not a lens.',
        'Wrong subnet after an IT “cleanup” is the classic. 192.168.1.x camera, 10.x NVR, no route.',
        'Channel disabled, license expired, or the camera was moved to another recorder. Ask before you reset.',
        'If you must default a camera, photograph the existing IP / credentials first. Write them on the job sheet.'
      ]}
    ],
    [{ href: '/guides/poe', label: 'PoE classes' }, { href: '/guides/ip', label: 'Network mini' }, { href: '/checklist/poe-night-ir-reboot-isolation', label: 'Night-IR list' }, { href: '/refs#poe', label: 'PoE calc' }]
  );

  ts('reader-dead', 'lock', 'Reader dead / no beep / no LED',
    'Power, then data, then the card',
    'A dark reader is usually power or a reversed pair. A lit reader that will not beep a card is data, format, or the panel is not listening.',
    ['reader', 'Wiegand', 'OSDP', 'HID', 'access'],
    [
      { type: 'steps', title: 'Dark reader', items: [
        { text: 'DC voltage at the reader pigtail, on DC volts, red on red, black on black.', tip: '0 V: open run or the controller output is off. 5–8 V on a 12 V reader: drop. 24 V on a 12 V-only reader: you may have cooked it.' },
        'Confirm 12 vs 24 on the label. Mix-ups happen on a 24 V lock power supply.',
        'If the voltage is good and it is still dark: try a known-good reader on a 3-foot pigtail at the can. If that lives, the run is the job. If that dies, the port or the reader.'
      ]},
      { type: 'steps', title: 'Lit, but no card read', items: [
        'Wiegand vs OSDP. A Signo landed as Wiegand while the panel port is OSDP (or the reverse) is silent.',
        'Green/white swapped on Wiegand can give you inverted-looking data or nothing useful. Swap, do not replace yet.',
        'OSDP A/B swapped: first trick. Then address, baud, and whether the bus is 2-wire RS-485 on the right terminals.',
        'Card format: a 26-bit panel and a 37-bit corporate badge will “read” at the reader and fail at the controller. That is not a broken reader.',
        'Hold / D1 / LED lines shorted to ground can mute a reader. Lift extras if you only needed power and data.'
      ]}
    ],
    [{ href: '/guides/pinouts', label: 'Pinouts' }, { href: '/guides/meter', label: 'Meter' }, { href: '/guides/manuals', label: 'HID / manuals' }, { href: '/guides/access-denied', label: 'Access denied' }]
  );

  ts('maglock', 'lock', 'Maglock won’t lock or won’t release',
    'Power, drop, REX, fire, bond',
    'Won’t lock: no power, drop, or the armature is not making. Won’t release: REX/fire not actually interrupting the coil, or someone jumpered it.',
    ['maglock', 'REX', 'bond', 'fail-safe'],
    [
      { type: 'warn', text: 'Know the egress path before you drop or force a maglock. If it is fire-released, restoring it wrong can lock people in or leave a door unlatched.' },
      { type: 'steps', title: 'Will not lock / weak', items: [
        'DC at the lock under load. A lock that reads 13 V open and 8 V pulled in is a supply or a run, not a “weak magnet.”',
        'Armature contact: paint, a door that does not close, a filler plate, a sagging header. Maglocks need full face contact.',
        'Shared power with a hungry strike or a long 22 AWG homerun. Size the pair; do not add a second lock to a dying 12 V brick.',
        'Bond sensor (DPS on the mag) is a status loop, not the coil. A “forced door” with a locked mag is often the bond, not the lock.'
      ]},
      { type: 'steps', title: 'Will not release', items: [
        'REX, button, motion, crash bar, and fire relay must interrupt the coil (or the listed lock controller). Measure the coil while you hit REX — voltage should die.',
        'If voltage stays while REX LEDs blink, you are shunting a status input, not the lock power. Wrong terminals. Classic.',
        'A jumper left from the last “test” is a callback with a lawyer on the other end. Look.',
        'Fail-safe vs a strike that was supposed to be fail-secure: you may have the wrong device on the opening. Stop and read the drawing.'
      ]}
    ],
    [{ href: '/guides/fail-safe', label: 'Fail-safe vs fail-secure' }, { href: '/guides/readings', label: 'Voltages' }, { href: '/refs#vd', label: 'Voltage drop' }]
  );

  ts('door-latch', 'door', 'Door won’t latch / strike chatter',
    'Mechanical first, then the strike',
    'Nine times out of ten the door is warped, the latch is hitting the lip, or the preload is killing an undersized strike. Electrified hardware cannot fix a carpenter problem.',
    ['strike', 'latch', 'preload', 'HES', 'door'],
    [
      { type: 'steps', items: [
        'Close it by hand with the strike unpowered (fail-secure) or powered (fail-safe) as designed. If it will not latch mechanically, stop calling it an “access problem.”',
        'Preload: the door is leaning on the latch when the strike tries to move. Fix the closer, hinges, weatherstrip, or strike alignment. A 2000 lb mag does not excuse a 1/4" mis-shim.',
        'Chatter / buzz: AC on a DC coil, or a supply that sags every half-cycle. Measure DC with a meter that is not on AC by accident.',
        'Coil resistance off the circuit vs the label. Open coil = dead strike. Shorted coil = dead supply soon.',
        'Fire-listed doors: the strike, the lock, and the door are a listed assembly. Random hardware from the truck can void the label. See the UL 10C checklist.'
      ]}
    ],
    [{ href: '/checklist/flush-rim-strike', label: 'Strike punch list' }, { href: '/guides/fail-safe', label: 'Fail-safe / secure' }, { href: '/guides/manuals', label: 'HES / Von Duprin' }]
  );

  ts('access-denied', 'lock', 'Card reads, door does not open',
    'The reader is fine. The decision is elsewhere.',
    'LED flashed, beep happened, lock never moved. That is schedules, format, output wiring, or a locked-out user — not a new reader.',
    ['access', 'badge', 'format', 'schedule', 'REX'],
    [
      { type: 'steps', items: [
        'Did the controller see a badge? Software event vs no event. No event: data never arrived (Wiegand/OSDP). Event + deny: logic, not copper.',
        'Format / facility code. A 26-bit panel and a 37-bit badge is a deny with a healthy reader.',
        'Schedules, holidays, lockdown, anti-passback. 2 a.m. “it worked yesterday” is often a time clock that drifted after a power hit.',
        'Output: relay clicking at the can and no movement at the door is the lock run. No click is programming or a disabled output.',
        'REX works, badge does not: input path is fine, credential path is not. Badge works, REX does not: the opposite. Use that.'
      ]}
    ],
    [{ href: '/guides/reader-dead', label: 'Reader dead' }, { href: '/guides/maglock', label: 'Maglock' }]
  );

  ts('no-comms', 'bell', 'No comms to monitoring / “failed to test”',
    'Path, power, account, then the panel',
    'The panel can be perfect and still fail to test. Start with the communicator path: SIM, Ethernet, phone, or radio signal — not a new motherboard.',
    ['comms', 'communicator', 'monitoring', 'LTE', 'IP'],
    [
      { type: 'steps', items: [
        'What path? POTS, LTE, dual-path IP. The trouble LED meaning is on that communicator’s sheet, not a guess.',
        'Power at the communicator. Many LTE radios brown out on a dying 12 V that still looks “fine” to the panel.',
        'Antenna / signal. A can in a steel room with the antenna inside is a monument to callbacks. Photo RSSI if the radio shows it.',
        'Account / line number / IP / registration. After a board swap, the communicator is a new brick until it is programmed.',
        'IT blocked outbound. IP communicators die on a new firewall. That is not an alarm problem; it is a port / DNS / VLAN problem.',
        'Do a tester-initiated test with monitoring on the phone. “I think it sent” is not a test.'
      ]},
      { type: 'tip', text: 'Write the communicator model, signal, and the test ticket number on the job sheet. The next storm will not remember.' }
    ],
    [{ href: '/guides/ac-batt', label: 'AC / battery' }, { href: '/guides/first-five', label: 'First five minutes' }]
  );

  ts('ac-batt', 'zap', 'AC trouble / battery trouble',
    'Measure the battery, then the charger, then AC',
    'A “low battery” that comes back every Monday is often a dying float, a battery that was never loaded, or a transformer that cooks itself on a shared outlet.',
    ['battery', 'AC', 'transformer', 'trouble'],
    [
      { type: 'steps', items: [
        'DC at the battery posts, not the silk-screen. Then DC at the charger with AC present (float).',
        'Load: if you can, force battery (unplug AC with the owner’s blessing) and watch voltage while a sounder or lock is doing work. A 12.7 V brick that hits 10 V in 20 seconds is done.',
        'AC at the transformer secondary (VAC) and the primary if you are qualified. Shared with a fridge or a space heater is a classic.',
        'Two 12 V in series for 24 V: measure each. One open battery makes a very weird 24 V system.',
        'Replace in pairs on 24 V. Date the new ones. Cheap no-name SLA is how you buy this call twice.'
      ]}
    ],
    [{ href: '/guides/readings', label: 'Expected voltages' }, { href: '/guides/meter', label: 'Meter' }, { href: '/refs#battery', label: 'AH calc' }]
  );

  ts('zone-open', 'bell', 'Zone / point will not restore',
    'EOL, the device, then the pair',
    'If it will not seal, decide whether you are looking at an open, a short, or a resistor in the wrong place. The meter tells you in one lift.',
    ['zone', 'EOL', 'contact', 'open', 'short'],
    [
      { type: 'steps', items: [
        'Read the panel: open vs short vs trouble. Those three are not interchangeable English.',
        'Ohms at the panel with one side lifted. 0 Ω = short. OL = open. EOL value = sealed at this end — the panel may still hate the value.',
        'If OL: jumper the zone at the panel. If it seals, the panel is fine and the field is open. Walk it. If it does not, programming or the zone input.',
        'EOL in the can instead of at the last device: you just unsupervised the entire run. Move it.',
        'A “restored” zone that bounces: door that does not quite close, a magnet that moved 1/4", a painter.',
        'Smoke / heat / glass: power-cycle and maintenance per the device. A dirty chamber is not a new detector until you look.'
      ]}
    ],
    [{ href: '/guides/resistor', label: 'EOL / resistor' }, { href: '/checklist/false-alarm-symptom-tree', label: 'False alarm tree' }, { href: '/checklist/device-class-symptom-quickref', label: 'Device class' }]
  );

  ts('no-link', 'net', 'No link light',
    'The cheapest test in the trade',
    'No link is copper or power. It is not a password, a VLAN, or an NVR license.',
    ['ethernet', 'link', 'crimp', 'PoE'],
    [
      { type: 'steps', items: [
        'Known-good 3-foot patch at the switch. If that links, the field cable is the job.',
        'Known-good patch at the camera / reader / AP. Same idea from the other end.',
        'Crimp: 568B both ends? Clip down, pins gold-side? A 568A-to-B cable is a split-pair ghost.',
        'PoE injector in the middle: test with it out, then in. A dead injector kills link and power.',
        'Damaged tab on an RJ45 that “clicks” but does not actually latch. Replace the head, do not tape it.',
        'Once you have link, then — and only then — talk IP.'
      ]}
    ],
    [{ href: '/guides/pinouts', label: '568B' }, { href: '/guides/camera-offline', label: 'Camera offline' }, { href: '/guides/toner', label: 'Tone & probe' }]
  );

  ts('doorbell', 'bell', 'Doorbell / chime / video doorbell dead',
    'VA, then the chime, then the button',
    'Video doorbells starve 10 VA transformers. Measure VAC under load at the doorbell, not just at the transformer with the doorbell unplugged.',
    ['doorbell', 'transformer', '16VAC', 'chime'],
    [
      { type: 'steps', items: [
        'Transformer secondary: VAC, typically 16 V. Then the same measurement with the doorbell connected. Collapse = undersized VA or a dying transformer.',
        'Many video doorbells want 16 VAC 30 VA (or a listed adapter). A 10 VA chime transformer will “work” until someone rings it.',
        'Digital chimes and some mechanical chimes need a power kit / jumper. Without it the doorbell browns out or reboots on ring.',
        'Button shorted (stuck ring) vs open (never rings). Continuity with the transformer dropped.',
        'Doorbell cameras still need network. A “dead” Ring/Nest/etc. with 16 VAC present is Wi-Fi, not the transformer. Separate the jobs.'
      ]}
    ],
    [{ href: '/guides/meter', label: 'Meter (use AC)' }, { href: '/guides/readings', label: 'Voltages' }, { href: '/checklist/doorbell-transformer-chime-power-health', label: 'Doorbell punch list' }]
  );

  P.manuals = {
    id: 'manuals', icon: 'book', kind: 'manual', eyebrow: 'Product cards',
    title: 'Common product cards & official docs',
    hub: 'Gotchas we actually hit, plus the manufacturer sheet',
    lede: 'We do not host copyrighted manuals. Each card is original field notes plus a link to the manufacturer’s own documentation. Search their site by exact model if the landing page moved.',
    tags: ['manual', 'HID', 'Altronix', 'Vista', 'vista 128', '128bpt', 'DSC', 'Neo', 'HES', 'Axis', '6160', 'docs', 'Notifier', 'Simplex', 'Lenel', 'Genetec', 'Avigilon', 'Hikvision', 'Kantech', 'Salto', 'DSX', 'INVID', 'iSTAR', 'WIN-PAK', 'Verkada', 'Bosch', 'Openpath', 'Rhombus', 'ButterflyMX', 'StarLink'],
    related: [{ href: '/guides/pinouts', label: 'Pinouts' }, { href: '/guides/meter', label: 'Meter' }],
    sections: [
      { type: 'note', text: 'Authorized work only. Factory default codes belong in the official installer guide and should already have been changed. We do not publish backdoor lists.' },
      {
        type: 'products',
        items: [
          {
            brand: 'Altronix', title: 'AL400UL / ACM lock power',
            use: 'The gray can that is quietly running every maglock on the job. 12 or 24 V selectable, battery standby, AC-fail and batt-fail contacts.',
            look: 'SW1 voltage select. AC LED. DC output terminals. Battery leads. Fire-alarm trigger on ACM models (outputs drop on FACP).',
            gotchas: [
              'Measure the output before you land locks. A can left on 24 V will cook 12 V maglocks.',
              'ACM fire trigger polarity and NO/NC have to match the FACP. Wrong and the doors never drop — or they never lock.',
              'Keep high-voltage AC and power-limited wiring spaced. The sheet is not kidding.',
              'Batteries are optional for some access listings and required for others. Do not assume.'
            ],
            href: 'https://altronix.com/library/pdf/installation_instructions/AL400UL.pdf',
            linkLabel: 'Altronix AL400UL install PDF',
            linkSub: 'altronix.com — also grab the ACM variant sheet for fire-drop outputs',
            tags: ['power', 'maglock', 'ACM']
          },
          {
            brand: 'Altronix', title: 'ACM8 / ACM4 access power controller',
            use: 'Breaks one supply into fused, triggerable lock outputs. Fire trigger to drop selected doors.',
            look: 'Per-output fuses or PTC. Trigger input from FACP. Jumpers for fail-safe vs fail-secure behavior per output.',
            gotchas: [
              'Fail-safe/fail-secure jumper per output is how you accidentally invert one door on a floor of eight.',
              'A blown output fuse looks like a dead maglock. Check the ACM before you buy a lock.',
              'Do not mix lock power and reader power on the same output “because it is 12 V.” Noise and brownouts.'
            ],
            href: 'https://www.altronix.com/resources',
            linkLabel: 'Altronix resources / install sheets',
            linkSub: 'Search ACM8 or ACM4 on altronix.com',
            tags: ['ACM8', 'fire drop']
          },
          {
            brand: 'HID', title: 'Signo / iCLASS / multiCLASS readers',
            use: 'The reader on the wall. Wiegand or OSDP, 12–24 V, pigtail or terminal.',
            look: 'Label for 12/24 V and OSDP vs Wiegand. Tamper on the backplate. Drain wire.',
            gotchas: [
              'Green/white are Wiegand data or OSDP RS-485 depending on how it was ordered / configured. Do not guess.',
              'Metal-mount without a spacer kills read range. Especially Signo on a hollow metal frame.',
              'Hold line tied down = reader looks dead to cards. Lift unused inputs.',
              'OSDP address/baud mismatch is silent. A/B swap is the first 10-second test.'
            ],
            href: 'https://www.hidglobal.com/documents/hid-signo-reader-install-guide',
            linkLabel: 'HID Signo reader install guide',
            linkSub: 'hidglobal.com/documents — grab the exact model (20/40/K/T) sheet',
            tags: ['reader', 'OSDP', 'Wiegand']
          },
          {
            brand: 'HID / Mercury', title: 'Aero X1100 / LP1502-class controllers',
            use: 'The intelligent controller in the can. Readers, inputs, outputs, OSDP buses.',
            look: 'IO module ports, reader ports labeled Wiegand vs OSDP, 12/24 V input, status LEDs.',
            gotchas: [
              'RS-485 IO modules need twisted pair and a single-end shield. Star wiring is how you get ghosts.',
              'Do not land 24 V readers on a 12 V-only reader port.',
              'After a power hit, wait for a full boot before you declare a bus dead.'
            ],
            href: 'https://www.hidglobal.com/documents',
            linkLabel: 'HID document library (Aero / Mercury)',
            linkSub: 'Search X1100, X100, or LP1502',
            tags: ['controller', 'Mercury', 'Aero']
          },
          {
            brand: 'Securitron / ASSA ABLOY', title: 'Magnalock (M32 / M62 class)',
            use: 'Fail-safe maglock. Power to lock. Bond sensor on many models.',
            look: 'Voltage printed on the pigtail. Bond leads separate from coil. Armature hardware is specific — do not substitute random screws.',
            gotchas: [
              'Armature must sit flat. A 1/8" gap from a poor header is a “weak lock.”',
              'Bond sensor is a supervisory contact, not power. Landing it on the coil output does nothing useful.',
              'Sized for 12 or 24. 24 V on a 12 V coil is smoke. Check the pigtail before you land the ACM.'
            ],
            href: 'https://www.securitron.com',
            linkLabel: 'Securitron Magnalock product / docs',
            linkSub: 'securitron.com — download the exact model install sheet',
            tags: ['maglock']
          },
          {
            brand: 'HES / ASSA ABLOY', title: '1006 / 5000-series electric strikes',
            use: 'Frame-mounted strike. Fail-secure or fail-safe kits. Preload is the enemy.',
            look: 'Faceplate, keeper orientation, 12/24 dual voltage, plug-in latches on 1006.',
            gotchas: [
              'Preload from a misaligned door will make a healthy strike buzz and die. Fix the door.',
              'Dual-voltage: the plug/jumper is how you pick 12 vs 24. Wrong jumper + 24 V = dead coil.',
              'Fire-listed openings need the listed strike for that door. A 5000 in a 1006 hole is not a flex.'
            ],
            href: 'https://www.hesinnovations.com',
            linkLabel: 'HES docs & install sheets',
            linkSub: 'hesinnovations.com — 1006 / 5000 / 8000 series',
            tags: ['strike']
          },
          {
            brand: 'Von Duprin / Allegion', title: 'QEL / RX exit devices',
            use: 'Electrified panic hardware. QEL retracts the latch electrically. RX is a request-to-exit switch in the bar.',
            look: 'Power transfer (EPT / door loop / hinge). 24 VDC typical. RX is a dry contact, not lock power.',
            gotchas: [
              'QEL current inrush is not a 500 mA supply. Size the ACM output and the pair.',
              'RX does not unlock anything by itself. It is an input. Wire it to the controller REX, not to the strike coil, unless the drawing says so.',
              'Fire-rated vs panic-rated devices are not interchangeable. Look at the label on the bar.'
            ],
            href: 'https://us.allegion.com/en/home/products/brands/von-duprin.html',
            linkLabel: 'Von Duprin product / literature',
            linkSub: 'allegion.com — QEL, RX, EPT install sheets',
            tags: ['exit device', 'QEL']
          },
          {
            brand: 'Resideo / Honeywell', title: 'VISTA-15P / 20P / 21iP',
            use: 'The beige intrusion panel in a million closets. ECP bus, hardwire zones, 16.5 VAC transformer, SLA battery.',
            look: 'TB terminals: 1–2 AC, 3 bell+, 4–7 ECP (keypads / radios), zone pairs, 25 earth. Keypad address sticks.',
            gotchas: [
              'Zones that are not used still want their EOL if they are enabled. A “mystery open” is often zone 1 with no resistor.',
              'ECP is 4-wire: Aux power and data. A keypad with no bars is often power drop, not a dead pad.',
              'Communicator (LTE/IP) has its own power and antenna story. “Failed to test” is often the radio, not the VISTA board.',
              'Programming and defaults: use the official installer guide for the revision on the board. Do not assume a code from a forum.'
            ],
            href: 'https://www.resideo.com/us/en/pro/products/security/intrusion-panels-systems/hybrid-systems/vista-20p-vistar-control-panel-vista-20p/',
            linkLabel: 'VISTA-20P product + literature',
            linkSub: 'resideo.com Pro — grab the install/setup that matches the board revision (K5305-1…)',
            tags: ['Vista', 'vista 20p', 'vista 15p', '21ip', 'intrusion']
          },
          {
            brand: 'Resideo / Honeywell', title: 'VISTA-128BPT / 250BPT / 128BPTSIA',
            use: 'The commercial burglary panel people mean when they say “Vista 128.” Eight partitions, V-Plex polling loop, ECP devices, 5800 wireless. It is not a 20P in a bigger can.',
            look: '1361 transformer (not the 20P’s 1321). Polling loop terminals are polarity-sensitive. Keypads must be 6160-class alpha for programming. #93 menu for devices/zones.',
            gotchas: [
              'Do not treat terminal numbers like a 20P. ECP vs polling loop are different buses. Wrong pair = a keypad that never comes up or a loop that ground-faults.',
              'Every keypad, RF receiver, 4204, and communicator needs a unique device address AND to be enabled in #93. Address 31 is a trap.',
              'Polling loop (V-Plex) is polarity sensitive. T-taps and star wiring make ghosts. 4101SN / 4208SN / 5193SN live here, not on hardwire zones.',
              'Zone 1 2-wire smoke is limited — this is still a burglary BPT, not a fire panel. Fire/burg is the FBPT family.',
              'Document number to hunt: 800-06903 (install/setup) plus the matching programming guide. Match the revision on the board.'
            ],
            href: 'https://www.resideo.com/us/en/pro/products/security/intrusion-panels-systems/hybrid-systems/vista-128bpt-vistar-light-commercial-burglary-alarm-128-zones-8-partitions-vista-128bpt/',
            linkLabel: 'VISTA-128BPT product + literature',
            linkSub: 'resideo.com — download the 128BPT/250BPT install & programming guides for your revision',
            tags: ['vista 128', 'vista-128', 'vista128', '128bpt', '250bpt', '128bptsia', 'partition', 'v-plex', 'commercial vista']
          },
          {
            brand: 'Resideo / Honeywell', title: 'VISTA-128FBPT / 32FBPT / 250FBPT',
            use: 'Commercial fire + burglary VISTA. SLC-ish V-Plex, NAC, two-wire smokes on more than zone 1. If the door says FBPT, do not program it like a 20P or a 128BPT.',
            look: 'Fire-side communicator rules. NAC / bell supervision. Cabinet attack-resistance hardware. Separate fire/burg partitions.',
            gotchas: [
              'Impairment / fire watch may be required before you disable NAC or SLC. Photograph the panel, then follow site process.',
              'AlarmNet on the fire side of the bus — the quick-start is explicit. Wrong bus = failed fire signals.',
              'Keypad addressing still 1+3 at power-up, but commercial fire listings limit which pads you can use.',
              'Hunt install R800-27641 / 800-09617 class docs and the fire programming addendum that matches the board date.'
            ],
            href: 'https://www.resideo.com/us/en/pro/products/security/intrusion-panels-systems/combination-fire-burglary-systems/v128fbpt-vistar-light-commercial-fire-and-partitioned-alarm-control-panel-v128fbpt/',
            linkLabel: 'VISTA-128FBPT product + datasheets',
            linkSub: 'resideo.com Pro — 32FBPT / 128FBPT / 250FBPT literature',
            tags: ['vista 128', '128fbpt', '32fbpt', '250fbpt', 'vista fire', 'commercial fire']
          },
          {
            brand: 'Resideo / Honeywell', title: '6160 / 6160RF / 6160V alpha keypad',
            use: 'The fat alpha pad you actually program a 128 with. 6150 will not cut it for #93 menus.',
            look: 'Address stored in the pad. 6160RF has a built-in receiver — do not also add a 5881 on the same address.',
            gotchas: [
              'Addressing: within ~30 seconds of power-up, hold 1 and 3. Enter two-digit address, star to save. Then enable that address in the panel.',
              'Blank display with 13.5 V at the pad: data wires reversed, address collision, or the pad was never enabled.',
              'ECP run length vs gauge matters on a 128 with 15 pads. Voltage at the last keypad, not at the board.',
              '6160V voice pad is restricted on some SIA / commercial fire jobs. Read the listing.'
            ],
            href: 'https://www.resideo.com/us/en/pro/products/security/vista/user-interfaces/hardwired-keypads/',
            linkLabel: 'VISTA hardwired keypads (6160 family)',
            linkSub: 'resideo.com Pro — 6160 / 6160V / 6150 listing; grab the exact pad sheet',
            tags: ['6160', '6160rf', '6160v', 'keypad', 'alpha', 'vista keypad']
          },
          {
            brand: 'Resideo / Honeywell', title: '5881 / 5883 5800-series RF receiver',
            use: 'House wireless for VISTA. Serial transmitters, not DSC wireless.',
            look: 'Dip address. Antennas up and away from the can. 5881ENL/M/H zone counts differ.',
            gotchas: [
              'Receiver inside the metal can = “RF supervision fail” on every PIR. Mount it, don’t stack it on the board.',
              'Each transmitter has a unique serial. Duplicate serials or House-ID devices mixed in are a mess.',
              '5816 is two loops. People program loop 1 and leave the reed unused — or the opposite.',
              'Jam / supervision troubles after a Wi-Fi 2.4 GHz AP was taped to the same closet. Move one of them.'
            ],
            href: 'https://www.resideo.com/us/en/pro/products/security/receivers/wireless-receivers/5881enhc-maximum-zone-commercial-5800-series-receiver-5881enhc/',
            linkLabel: '5881ENHC RF receiver product + docs',
            linkSub: 'resideo.com Pro — 5881ENL/M/H/HC family',
            tags: ['5881', '5883', '5800', '5816', 'wireless', 'rf']
          },
          {
            brand: 'Resideo / Honeywell', title: '4204 relay / 4219 / 4229 zone expander',
            use: 'ECP add-ons. 4204 = four relays. 4219/4229 = hardwire zones (4229 also has two relays).',
            look: 'Dip switch address 01–15. 4-wire ECP harness. EOL at the expander’s zones, not in the panel.',
            gotchas: [
              'Address collision with a keypad or RF receiver is a classic “new expander did nothing.”',
              '4229 relays are not 4204 relays in programming. Use the right device type in #93.',
              'Aux power: every expander drinks. Add a listed supply before the pads go dim.'
            ],
            href: 'https://www.resideo.com/us/en/pro/products/security/vista/zone-expanders/4204-intelligent-relay-board-4204/',
            linkLabel: '4204 relay module product + docs',
            linkSub: 'resideo.com Pro — also 4219 wired expander',
            tags: ['4204', '4219', '4229', 'expander', 'relay']
          },
          {
            brand: 'Resideo / AlarmNet', title: 'LTEM-PA / LTEM-PV / 7847i communicators',
            use: 'LTE / IP communicators on ECP. “Failed to test” is usually this brick, the antenna, or IT — not the VISTA motherboard.',
            look: 'Own DC supply on many LTE models. Antenna outside the can. ECP 3-wire harness to panel data/common.',
            gotchas: [
              'On a 20P the harness is typically panel 4 (GND), 6 (data in), 7 (data out) — confirm the sheet for 128BPT terminals.',
              'Power the communicator’s own transformer. Starving it off keypad aux is a brownout every time it registers.',
              'Antenna in a steel closet = one bar and a failed fire signal. RSSI on the unit, photo it.',
              'After a board swap the communicator is a new account until you program it. Do a tester-initiated test with monitoring on the phone.'
            ],
            href: 'https://www.resideo.com/us/en/pro/products/security/communicators/ltem-pa-advanced-modular-communicator-att-ltem-pa/',
            linkLabel: 'LTEM-PA communicator product + docs',
            linkSub: 'resideo.com Pro — LTEM-PA / LTEM-PV family; 7847i is under VISTA communicators',
            tags: ['ltem', 'ltem-pa', 'ltem-pv', '7847i', 'alarmnet', 'lte', 'communicator']
          },
          {
            brand: 'DSC / JCI', title: 'PowerSeries (PC1616 / 1832 / 1864 class)',
            use: 'The other beige panel. Keybus, zone terminals, 16.5 VAC, battery.',
            look: 'Keybus red/blk/grn/yel. Zone COM pairs. PC-Link / installer port. Module addresses.',
            gotchas: [
              'Keybus length and star wiring cause random keypad trouble. Follow the sheet; do not daisy-chain like it is doorbell wire.',
              'Modules (wireless, IO) need unique addresses. Two devices on the same address is a haunted house.',
              'Installer programming is in the official installation manual for that exact PC-board. Use it.'
            ],
            href: 'https://www.dsc.com',
            linkLabel: 'DSC document library',
            linkSub: 'dsc.com — PowerSeries installation manuals',
            tags: ['DSC', 'PowerSeries']
          },
          {
            brand: 'Bosch', title: 'B-series / Solution / D9412 class',
            use: 'Commercial-ish intrusion and integrated fire on some platforms. SDI2 / radical buses depending on vintage.',
            look: 'Board revision silk-screen. Bus type is not interchangeable across generations.',
            gotchas: [
              'The bus on a B8512 is not the bus on a 20-year-old D9412. Bring the right modules.',
              'Ground fault LEDs mean a real field problem. Do not clear and leave.',
              'Use Bosch’s documentation portal for the exact firmware + hardware pair.'
            ],
            href: 'https://www.boschsecurity.com/us/en/support/datasheets-and-documents/',
            linkLabel: 'Bosch datasheets & documents',
            linkSub: 'boschsecurity.com support',
            tags: ['Bosch']
          },
          {
            brand: 'System Sensor', title: 'SpectrAlert / strobes / horns',
            use: 'Notification appliances. Candela jumper, horn/strobe split, sync protocol.',
            look: 'Candela setting on the back. Horn vs strobe jumper. Compatibility with the NAC / sync module.',
            gotchas: [
              'Candela jumper left on 15 cd in a 75 cd design is an AHJ fail, not a “dim strobe.”',
              'Mismatched sync protocols (System Sensor vs Wheelock vs others) = a disco that will not pass.',
              'NAC voltage at the last device in alarm is the measurement that matters. See the NAC calc and strobe TS list.'
            ],
            href: 'https://www.systemsensor.com',
            linkLabel: 'System Sensor documents',
            linkSub: 'systemsensor.com — SpectrAlert Advance install / compatibility',
            tags: ['strobe', 'NAC', 'fire']
          },
          {
            brand: 'Eaton / Wheelock', title: 'Exceder / Horns & strobes',
            use: 'The other half of the strobe war. Sync and candela still apply.',
            look: 'Candela tap. Mounting plate. Wheelock sync vs “plain” NAC.',
            gotchas: [
              'A Wheelock appliance on a System Sensor sync NAC (or the reverse) is a compatibility card problem. Check before you open 40 bags.',
              'Same voltage-drop rules as any NAC. Last-device voltage in alarm.'
            ],
            href: 'https://www.eaton.com/us/en-us/catalog/emergency-communications/wheelock.html',
            linkLabel: 'Eaton Wheelock catalog / docs',
            linkSub: 'eaton.com Wheelock',
            tags: ['Wheelock', 'NAC']
          },
          {
            brand: 'Axis', title: 'Axis IP cameras / companion mics',
            use: 'The camera that actually has a datasheet worth reading. PoE class, SD, T-shirt of connectors on the back.',
            look: 'Part number on the belly. PoE class. Recessed factory-reset. I/O and audio are extra, not assumed.',
            gotchas: [
              'PoE class on the datasheet vs the switch port. IR + heater + cold start is a Type 2 conversation.',
              'Factory default is a button sequence with power applied — photograph the IP first.',
              'Axis has current firmware and a known-good support path. Use it instead of a random YouTube reset.'
            ],
            href: 'https://www.axis.com/support',
            linkLabel: 'Axis support & manuals',
            linkSub: 'axis.com/support — pick the exact model',
            tags: ['camera', 'Axis']
          },
          {
            brand: 'Hanwha Vision', title: 'P / Q / X series cameras',
            use: 'The other common commercial camera. PoE, SUNAPI / ONVIF, SD.',
            look: 'Model on the gimbal or belly. Reset button. MicroSD behind a gasket you will forget to reseat.',
            gotchas: [
              'Open the gasket, change the SD, fail to reseat, water in two weeks. Photograph the seal.',
              'Default IP / discovery: use their Tool or ONVIF. Wrong VLAN still wins.',
              'IR reboot: same PoE story as everyone else.'
            ],
            href: 'https://www.hanwhavision.com',
            linkLabel: 'Hanwha Vision support',
            linkSub: 'Search the exact model + “manual”',
            tags: ['camera', 'Hanwha']
          },
          {
            brand: 'LifeSafety Power', title: 'FPO / unified power',
            use: 'The nicer lock-power platform. Modular 12/24, fire trigger, distribution buss.',
            look: 'FPO supply + B1/B2 or similar distribution. Fire input polarity. DC OK LEDs per bus.',
            gotchas: [
              'Configure 12 vs 24 per bus before landing hardware. Mixed doors need mixed busses, not hope.',
              'Fire trigger must be tested. An untested FPO is a maglock that will not drop.'
            ],
            href: 'https://lifesafetypower.com',
            linkLabel: 'LifeSafety Power manuals',
            linkSub: 'lifesafetypower.com — FPO / C4 / FPO150',
            tags: ['power']
          },
          {
            brand: 'Ubiquiti', title: 'UniFi switch PoE',
            use: 'The switch in the IDF that is powering half the cameras. PoE vs PoE+ vs PoE++ is per port and per SKU.',
            look: 'Model on the face (USW-24-PoE vs Pro vs Enterprise). Port LEDs. Adopted vs standalone.',
            gotchas: [
              'A “PoE” UniFi SKU may only be af. A PTZ wants at or bt. Read the SKU, not the logo.',
              'Disabling PoE on a port in the controller looks like a dead camera.',
              'Budget: the switch has a total watt ceiling. The 16th camera is when people start rebooting.'
            ],
            href: 'https://help.ui.com',
            linkLabel: 'UniFi help center',
            linkSub: 'help.ui.com — switch PoE specs for the exact SKU',
            tags: ['UniFi', 'PoE', 'switch']
          },
          {
            brand: 'Generic / IEEE', title: '802.3af / at / bt (the actual PoE)',
            use: 'When the camera says af and the injector says “24 V PoE,” someone is about to buy a camera.',
            look: 'PSE marking: 802.3af / at / bt or “passive.” PD marking on the camera.',
            gotchas: [
              'Passive 24 V ≠ 802.3. Different voltages, different pairs, different smoke.',
              'Mode A vs Mode B: both are legal 802.3. A broken cable that only has pairs 4–8 can fool one and not the other.',
              'Use the PoE class cheat and the budget calc. Then the night-IR list.'
            ],
            href: 'https://www.ieee.org',
            linkLabel: 'IEEE (standards body)',
            linkSub: 'You do not need to buy the standard — use the camera and switch datasheets',
            tags: ['PoE']
          },
          {
            brand: 'Napco', title: 'Gemini / NAPCO intrusion',
            use: 'Still out there. Keypads, gem-print, wireless that is not 5800.',
            look: 'Panel silk-screen, keypad model, wireless receiver type.',
            gotchas: [
              'Do not treat it like a VISTA. Programming, EOL, and wireless are their own ecosystem.',
              'Bring the Napco installer manual for that panel. Forums will mix Gemini generations.'
            ],
            href: 'https://www.napcosecurity.com',
            linkLabel: 'Napco Security',
            linkSub: 'napcosecurity.com — technical documents',
            tags: ['Napco']
          },
          {
            brand: 'DMP', title: 'XR / XT panels',
            use: 'Commercial intrusion / access hybrid. LX-bus, wireless, built-in comms on many boxes.',
            look: 'XR150/XR550 class on the board. Cell / network cards. Keypad addresses.',
            gotchas: [
              'Programming is Dealer Admin / Remote Link — not *20. Do not brute-force it like a VISTA.',
              'LX-bus devices need the right cable and length. Random 22/4 is a trouble LED later.'
            ],
            href: 'https://www.dmp.com',
            linkLabel: 'DMP dealer / docs',
            linkSub: 'dmp.com — XR installation guides',
            tags: ['DMP']
          },
          {
            brand: 'Notifier / Honeywell Fire', title: 'NFS / fire panels (educational)',
            use: 'Life-safety. If you are not the fire tech of record, you look, you photograph, you do not “clear trouble and go.”',
            look: 'Panel type on the door. SLC vs IDC vs NAC. Disable keys. Battery size.',
            gotchas: [
              'Impairment / fire watch may be required before you disable anything. That is process, not heroics.',
              'Ground fault: sectionalize. Do not shotgun devices.',
              'Use the official Notifier document for that exact NFS/NFS2 panel. This app is not that document.'
            ],
            href: 'https://buildings.honeywell.com/us/en/brands/our-brands/notifier',
            linkLabel: 'Notifier (Honeywell Buildings) docs',
            linkSub: 'buildings.honeywell.com/notifier — NFS / NFS2 manuals for the panel on the door',
            tags: ['fire', 'Notifier', 'NFS', 'NFS2']
          },
          {
            brand: 'DSC / JCI', title: 'PowerSeries Neo (HS2032 / HS2064 / HS2128)',
            use: 'The current DSC platform. Encrypted wireless, HSM modules, different keypad bus than PC1864.',
            look: 'HS2LCD / HS2TCHP pads. HSM2108 zone expander, HSM2300 power, HSM2HOST wireless. Corbus, not old keybus colors assumed.',
            gotchas: [
              'Neo is not a PC1864 with a new sticker. Module enrollment and partition logic live in the Neo installer manual.',
              'HSM2HOST placement is RF, not “in the can.” Same rule as a 5881.',
              'Corbus length and star wiring still cause keypad trouble. Follow the Neo wiring tables.'
            ],
            href: 'https://www.dsc.com',
            linkLabel: 'DSC library (PowerSeries Neo)',
            linkSub: 'dsc.com — HS2128 / HS2064 installation manuals',
            tags: ['neo', 'hs2128', 'hs2064', 'hs2032', 'powerseries neo', 'dsc neo']
          },
          {
            brand: 'Altronix', title: 'AL600ULACM / Maximal / Trove',
            use: 'Bigger brothers of the AL400. Maximal = multi-PSU can. Trove = access enclosure with backplanes for Mercury/HID/Altronix boards.',
            look: 'Voltage select per supply. Fire trigger. Battery sets. Trove sub-assembly part numbers on the backplane.',
            gotchas: [
              'Maximal has more than one DC supply in one box. Door 1 on 12 V and door 2 on 24 V is a jumper, not a prayer.',
              'Trove backplanes are brand-specific. A Mercury board on the wrong subassembly is a skip.',
              'UL ACM fire-drop still has to be tested. An untested Maximal is a maglock that will not drop.'
            ],
            href: 'https://www.altronix.com/products/AL600ULACM',
            linkLabel: 'Altronix AL600ULACM',
            linkSub: 'Also Maximal3 and Trove2 on altronix.com/resources',
            tags: ['al600', 'al600ulacm', 'maximal', 'trove', 'trove2', 'lock power']
          },
          {
            brand: 'HID', title: 'RP40 / RPK40 / iCLASS SE readers',
            use: 'The generation before Signo. Still on half the doors you service. Wiegand pigtail is the same color story — verify the sheet.',
            look: 'Model on the back. 5–16 VDC typical. Tamper. Drain.',
            gotchas: [
              'iCLASS SE vs multiCLASS vs Prox-only is a credential problem, not a “bad reader,” if the badge was swapped to a new corporate format.',
              'Metal-mount spacer still applies.',
              'RP40 is not OSDP unless that SKU says so. Do not land RS-485 on a Wiegand-only reader.'
            ],
            href: 'https://www.hidglobal.com/documents',
            linkLabel: 'HID document library (RP40 / iCLASS SE)',
            linkSub: 'hidglobal.com/documents — search the exact SKU',
            tags: ['rp40', 'rpk40', 'iclass se', 'hid rp40', 'prox']
          },
          {
            brand: 'HID / Mercury', title: 'Mercury LP1502 / MR52 / MR16IN',
            use: 'OEM boards inside RS2, Open Options, Genetec, Lenel, S2, Feenics, and a dozen white-label cans. Same board, different software.',
            look: 'LP1502 intelligent controller. MR52 two-reader interface. 12 V input. RS-485 IO bus.',
            gotchas: [
              'The software brand on the login page does not change RS-485 rules. Twisted pair, single-end shield, unique addresses.',
              'MR52 reader ports: 12 V vs 24 V jumpers. Mix-ups cook readers.',
              'After a power cycle wait for a full boot before you declare a downstream MR dead.'
            ],
            href: 'https://www.hidglobal.com/documents',
            linkLabel: 'HID Mercury / Aero install guides',
            linkSub: 'Search LP1502, MR52, MR16IN',
            tags: ['mercury', 'lp1502', 'mr52', 'mr16in', 'rs2', 'lenel', 'genetec', 's2']
          },
          {
            brand: 'Von Duprin / Allegion', title: '99 / 98 series exit device + QEL / RX / LX',
            use: 'The panic bar on the stair. 99 is rim/surface-ish family; electrified options are QEL (latch retraction), RX (REX switch), LX (latch monitoring).',
            look: 'Fire vs panic label on the rail. QEL current sticker. EPT / power transfer in the hinge or loop.',
            gotchas: [
              'QEL inrush will fold a 500 mA ACM output. Size for inrush, not just holding.',
              'RX is a switch in the bar. It does not unlock the maglock unless you landed it on REX.',
              'Fire-rated 99-F vs panic 99 — not interchangeable. The AHJ can see the label from the corridor.'
            ],
            href: 'https://us.allegion.com/en/home/products/brands/von-duprin.html',
            linkLabel: 'Von Duprin 99 / QEL literature',
            linkSub: 'allegion.com — 98/99, QEL, RX, EPT',
            tags: ['von duprin', '99 series', '98 series', 'qel', 'rx', 'exit device', 'panic']
          },
          {
            brand: 'HES / ASSA ABLOY', title: '9600 / 9400 / 8000 surface strikes',
            use: 'Surface-mount and aluminum-frame strikes. Different body than a 1006. Preload still kills them.',
            look: 'Body style. 12/24 dual voltage plug. Keeper handing.',
            gotchas: [
              'An 8000 is not a 1006 faceplate. Bring the right body for the frame.',
              'Aluminum storefront: the cut-out is unforgiving. Template first.',
              'Same dual-voltage jumper trap as the 1006.'
            ],
            href: 'https://www.hesinnovations.com',
            linkLabel: 'HES 8000 / 9400 / 9600 docs',
            linkSub: 'hesinnovations.com',
            tags: ['hes 9600', 'hes 8000', 'hes 9400', 'surface strike', 'storefront']
          },
          {
            brand: 'Schlage / Allegion', title: 'ND / L electrified cylindrical & mortise (EL/EU / RX)',
            use: 'Electrified lockset in the door, not a strike in the frame. Power transfer through the hinge or EPT.',
            look: 'EL vs EU (fail-safe vs fail-secure function). RX switch option. 12/24. Door handing.',
            gotchas: [
              'Function (storeroom vs entrance vs classroom) is the hardware, not the panel. Wrong function = “the badge works but the inside lever is dead.”',
              'Preload and bind on a mortise is a door/frame problem.',
              'Fire-listed doors need listed electrified mortise + closer + listed power transfer. Random EPT can void the label.'
            ],
            href: 'https://us.allegion.com/en/home/products/brands/schlage.html',
            linkLabel: 'Schlage electrified ND / L docs',
            linkSub: 'allegion.com — ND-EL/EU, L909x series',
            tags: ['schlage', 'nd series', 'l series', 'el', 'eu', 'mortise', 'cylindrical']
          },
          {
            brand: 'Securitron / ASSA ABLOY', title: 'M32 / M62 Magnalock + BPS / EEB / DK',
            use: 'Maglock plus the power supply (BPS), emergency exit button (EEB), and digital keypad (DK) that often sit in the same opening.',
            look: 'Coil voltage on the pigtail. Bond sensor leads. BPS fire-trigger. EEB is a break-glass or mushroom that must drop the lock.',
            gotchas: [
              'EEB in parallel with REX is not the same as in series with lock power. If the mag does not drop when you hit EEB, you landed a status input.',
              'BPS is a lock power supply. Do not feed readers off it without looking at noise and listing.',
              'M62 is a bigger magnet than M32. Header and armature hardware are not mix-and-match.'
            ],
            href: 'https://www.securitron.com',
            linkLabel: 'Securitron Magnalock / BPS / EEB',
            linkSub: 'securitron.com — M32, M62, BPS-24, EEB2',
            tags: ['m32', 'm62', 'bps', 'eeb', 'dk-26', 'magnalock']
          },
          {
            brand: 'LifeSafety Power', title: 'FPO150 / FPO250 + C4 / D8 distribution',
            use: 'Modular 12/24 lock power. FPO is the supply; C4/D8-style boards are the fused outputs and fire trigger.',
            look: 'Per-bus 12/24 jumpers. Fire input polarity. DC OK LEDs. Battery set.',
            gotchas: [
              'Configure 12 vs 24 per bus before landing hardware.',
              'Fire trigger must be tested on the doors it claims to drop.',
              'NetLink / network monitoring is extra — a green LED on the FPO is not a tested drop.'
            ],
            href: 'https://lifesafetypower.com',
            linkLabel: 'LifeSafety Power FPO manuals',
            linkSub: 'lifesafetypower.com — FPO150, FPO250, C4, D8',
            tags: ['fpo150', 'fpo250', 'c4', 'd8', 'lifesafety']
          },
          {
            brand: 'System Sensor', title: '2W-B / 4W-B / COSMO smoke-CO',
            use: 'The heads on the ceiling. 2-wire vs 4-wire is the whole job. COSMO is smoke+CO on one base.',
            look: '2W vs 4W on the box. Base vs head compatibility. Maintenance date.',
            gotchas: [
              'A 4-wire head on a 2-wire IDC (or reverse) will not behave. Read the box.',
              'Dirty chamber is the nuisance alarm. Clean/replace per the sheet before you condemn the loop.',
              'CO vs smoke is different response. Do not silence a CO like a dusty photoelectric.'
            ],
            href: 'https://www.systemsensor.com',
            linkLabel: 'System Sensor detector docs',
            linkSub: 'systemsensor.com — 2W-B, 4W-B, COSMO-2W',
            tags: ['2w-b', '4w-b', 'cosmo', 'smoke', 'co', 'system sensor']
          },
          {
            brand: 'Silent Knight / Honeywell Fire', title: '6820 / 6700 / 5808 FACP',
            use: 'Addressable fire panels you will trip over in schools and small commercial. SK vs Notifier vs EST is not interchangeable software.',
            look: 'Panel model on the door. SLC class A/B. NAC circuits. Battery size in the can.',
            gotchas: [
              'You do not “clear trouble and go” on a 6820 without an impairment process.',
              'SLC ground fault: sectionalize. Same as any addressable fire panel.',
              'Use Silent Knight / Honeywell Fire docs for that exact 6820 firmware.'
            ],
            href: 'https://www.silentknight.com',
            linkLabel: 'Silent Knight documentation',
            linkSub: 'silentknight.com — 6820 / 6700 install',
            tags: ['silent knight', '6820', '6700', '5808', 'facp', 'fire']
          },
          {
            brand: 'Edwards / EST', title: 'EST3 / EST4 / iO64 / iO500',
            use: 'Edwards/EST fire. EST3 is the big stacked one. iO is the smaller cousin. Signature vs conventional is a different job.',
            look: 'Node / CPU type. Signature SLC. Audio RIS if voice. Network fiber between nodes.',
            gotchas: [
              'EST3 networking is its own career. Do not factory-default a node because a printer is offline.',
              'Signature devices are polarity and data. A conventional mega-ohm tester on a Signature loop is how you buy a loop.',
              'Official Edwards / Carrier fire docs only. This app is orientation, not the panel manual.'
            ],
            href: 'https://edwardsfiresafety.com',
            linkLabel: 'Edwards fire safety docs',
            linkSub: 'edwardsfiresafety.com — EST3 / EST4 / iO',
            tags: ['est3', 'est4', 'io64', 'io500', 'edwards', 'signature', 'fire']
          },
          {
            brand: 'Axis', title: 'P32 / M30 / Q16 cameras + A1601 door controller',
            use: 'P3245-class turrets are everywhere. A1601 is Axis’s door controller — not a camera.',
            look: 'Part number on the belly. PoE class. Recessed reset. A1601 has reader + lock terminals.',
            gotchas: [
              'P32 IR + cold start can want at/PoE+. An af-only switch = night reboot.',
              'A1601 is 802.3at class territory with locks attached. Do not feed it like a 4 W spy cam.',
              'Firmware and AXIS Device Manager beat a random YouTube reset.'
            ],
            href: 'https://www.axis.com/support',
            linkLabel: 'Axis support (P32 / A1601)',
            linkSub: 'axis.com/support — pick the exact model',
            tags: ['p3245', 'p32', 'm30', 'q16', 'a1601', 'axis camera']
          },
          {
            brand: 'Ubiquiti', title: 'UniFi G4 / G5 cameras + USW PoE switches',
            use: 'Protect cameras and the UniFi switch powering them. Adoption is the religion.',
            look: 'SKU on the switch (PoE vs PoE+ vs PoE++). Camera adopted or pending. VLAN.',
            gotchas: [
              'A G4 PTZ on a USW-24-PoE (af) is a brownout. Read the SKU wattage.',
              'Inform URL / adoption: a replaced Cloud Key looks like “every camera died.”',
              'PoE disabled per port in the controller is the silent killer.'
            ],
            href: 'https://help.ui.com',
            linkLabel: 'UniFi help (Protect / switches)',
            linkSub: 'help.ui.com',
            tags: ['unifi', 'g4', 'g5', 'protect', 'usw', 'ubiquiti']
          },
          {
            brand: 'Bosch', title: 'D9412GV4 / B8512G / B5512',
            use: 'GV4 is the old commercial warhorse. B-series is the current one. SDI vs SDI2 vs RADION wireless are not mix-and-match.',
            look: 'Board silk-screen. Firmware sticker. SDI2 bus vs legacy SDI. B-series “RADION” receivers.',
            gotchas: [
              'A GV4 keypad on a B-series bus (or reverse) is a brick. Bring the right pads.',
              'Ground fault LED means a real field problem.',
              'RPS / Remote Programming Software is how you do this — not *20.'
            ],
            href: 'https://www.boschsecurity.com/us/en/support/datasheets-and-documents/',
            linkLabel: 'Bosch D9412 / B-series docs',
            linkSub: 'boschsecurity.com — D9412GV4, B8512G, B5512',
            tags: ['d9412', 'd9412gv4', 'b8512', 'b5512', 'gv4', 'bosch panel']
          },
          {
            brand: '2N / Axis', title: '2N IP Style / IP Verso / Helios',
            use: 'SIP/IP intercom at the door. PoE, 12 V backup, Wiegand or OSDP out to the access panel.',
            look: 'PoE class. 12 V terminals. Reader module slots. Tamper.',
            gotchas: [
              'These want a healthy PoE+ budget plus a 12 V brick if locks hang off them.',
              'Wiegand out of a 2N into a Mercury/HID panel is a format and pulse-width conversation.',
              '2N IP Manager / web UI — default credentials are a finding. Change them.'
            ],
            href: 'https://www.2n.com',
            linkLabel: '2N support & manuals',
            linkSub: '2n.com — IP Style, IP Verso, Helios',
            tags: ['2n', 'ip style', 'verso', 'helios', 'intercom', 'sip']
          },
          {
            brand: 'Aiphone', title: 'JO / JP / IX / GT series intercom',
            use: 'The other door phone. Analog JO/JP vs IP IX is a different cable plant.',
            look: 'Model on the tenant station. 18/2 vs CAT6. Power supply part number.',
            gotchas: [
              'Do not put IX (IP) on leftover JO (analog) wire and expect video.',
              'GT multi-tenant risers are their own drawing. A spare pair is not a GT bus.',
              'Use Aiphone’s wiring diagrams for that exact series. They are free and good.'
            ],
            href: 'https://www.aiphone.com/support',
            linkLabel: 'Aiphone support / wiring diagrams',
            linkSub: 'aiphone.com/support — JO, JP, IX, GT',
            tags: ['aiphone', 'jo', 'jp', 'ix', 'gt', 'intercom']
          },
          {
            brand: 'Potter', title: 'PFC-4064 / IPA / AFC fire panels',
            use: 'Potter addressable and conventional FACPs in waterflow / sprinkler-heavy jobs.',
            look: 'NAC voltage. SLC. Waterflow / tampers as IDC. Battery calculations on the door.',
            gotchas: [
              'Waterflow retard and bell-time are programming, not a bad flow switch, until you time it.',
              'Impairment process still applies.',
              'potterfire.com has the install manuals — use the exact PFC/IPA/AFC model.'
            ],
            href: 'https://www.potterfire.com',
            linkLabel: 'Potter fire manuals',
            linkSub: 'potterfire.com — PFC-4064, IPA-4000, AFC',
            tags: ['potter', 'pfc-4064', 'ipa', 'afc', 'waterflow', 'fire']
          },
          {
            brand: 'Wheelock / Eaton', title: 'Exceder LED3 / E50 / RSS strobes',
            use: 'LED and xenon notification. Candela tap on the back. Wall vs ceiling.',
            look: 'Candela setting. Wall/ceiling marking. Sync module compatibility.',
            gotchas: [
              'LED3 is not the old xenon current draw. Update the NAC calc — but still measure last-device voltage in alarm.',
              'Ceiling vs wall: the wrong mount fails the visual inspection even if it flashes.'
            ],
            href: 'https://www.eaton.com/us/en-us/catalog/emergency-communications/wheelock.html',
            linkLabel: 'Wheelock Exceder / E50 docs',
            linkSub: 'eaton.com Wheelock',
            tags: ['exceder', 'led3', 'e50', 'rss', 'wheelock strobe']
          },
          {
            brand: 'Generic / telco', title: 'RJ31X / RJ38X seizure jack',
            use: 'The 8-position jack that puts the alarm panel in series with the phone line so it can seize the line and kick house phones off.',
            look: 'Shorting bar in the plug. Panel cord to the jack. House vs telco side.',
            gotchas: [
              'If the shorting plug is pulled and the panel cord is out, house phones go dead. Put the plug back before you leave a “quick test.”',
              'VOIP ATAs and fiber ONTs break seizure. “No comms” on POTS after an ISP swap is often this, not the panel.',
              'See the RJ31X field card in Field brain for the pin story.'
            ],
            href: '/guides/rj31x',
            linkLabel: 'Lawsonite RJ31X field card',
            linkSub: 'Pin story, shorting bar, VOIP gotchas — then the panel’s own install guide',
            tags: ['rj31x', 'rj38x', 'seizure', 'pots', 'phone jack', 'dact']
          },
          {
            brand: 'Notifier / Honeywell Fire', title: 'NFS2-640 / NFS2-3030 FACP',
            use: 'The red can in a lot of mid-to-large commercial. NFS2-640 is one SLC loop (expandable). NFS2-3030 is the bigger networked cousin. CLIP vs FlashScan is the whole job.',
            look: 'CPU type on the door. SLC class A/B. NAC circuits. Disable keys. Battery size in the can. Network nodes if 3030.',
            gotchas: [
              'Impairment / fire watch may be required before you disable SLC or NAC. Photograph the panel, then follow site process.',
              'FlashScan heads on a CLIP loop (or reverse) will not poll. Match protocol to the devices that are actually on the wire.',
              'Ground fault: sectionalize. Do not shotgun devices. This app is orientation, not the NFS2 programming manual.'
            ],
            href: 'https://buildings.honeywell.com/us/en/brands/our-brands/notifier',
            linkLabel: 'Notifier (Honeywell Buildings) docs',
            linkSub: 'buildings.honeywell.com/notifier — NFS2-640 / NFS2-3030 authorized docs',
            tags: ['nfs2-640', 'nfs2-3030', 'nfs2', 'notifier', 'flashscan', 'clip', 'facp', 'commercial fire']
          },
          {
            brand: 'Fire-Lite / Honeywell Fire', title: 'ES-200X / ES-50X / MS-9200UDLS',
            use: 'The small-commercial addressable FACP you trip over in retail, churches, and strip malls. ES-200X replaced a pile of MS-9200UDLS jobs. LiteSpeed vs CLIP vs SS protocol is not mix-and-match.',
            look: 'Model on the door. SLC device count. Built-in IPOTS / DACT. NAC sync jumper (System Sensor / Wheelock / Gentex).',
            gotchas: [
              'Protocol cannot be split on one loop. A leftover CLIP head on a LiteSpeed panel is a trouble, not a “bad detector.”',
              'ES-series auto-learn is not a license to skip a map. Address collisions still happen.',
              'Impairment process still applies. Official Fire-Lite sheet for that exact ES/MS model.'
            ],
            href: 'https://www.firelite.com',
            linkLabel: 'Fire-Lite manuals & datasheets',
            linkSub: 'firelite.com — ES-200X, ES-50X, MS-9200UDLS',
            tags: ['es-200x', 'es-50x', 'ms-9200udls', 'ms9200', 'fire-lite', 'firelite', 'litespeed', 'facp', 'commercial fire']
          },
          {
            brand: 'Simplex / Johnson Controls', title: '4100ES / 4010ES FACP',
            use: 'Campus and high-rise fire. TrueAlarm sensors, TrueAlert ES NACs, optional voice and firefighter phones. 4100ES networks; 4010ES is the smaller sibling.',
            look: 'ES-PS power supply. InfoAlarm / touchscreen vs 2x40. IDNet / MAPNET channel cards. ES Net vs 4120 network vintage.',
            gotchas: [
              'You do not factory-default a 4100ES because a printer is offline. This is a networked life-safety system.',
              'TrueAlarm drift compensation and dirty-detector reports live in the panel. A “bad smoke” is often a maintenance report.',
              'Voice / firefighter phone is its own career. Official Simplex / JCI docs only.'
            ],
            href: 'https://www.simplexfire.com/resources',
            linkLabel: 'Simplex 4100ES literature',
            linkSub: 'simplexfire.com/resources — 4100ES / 4010ES datasheets',
            tags: ['4100es', '4010es', 'simplex', 'truealarm', 'truealert', 'idnet', 'es net', 'facp', 'commercial fire']
          },
          {
            brand: 'Gamewell-FCI / Honeywell Fire', title: 'E3 Series FACP',
            use: 'Networked addressable fire with ILI-MB-E3 / NGA nodes. Common in schools, hospitals, and municipal buildings that are not Notifier or Simplex.',
            look: 'Node type on the door. SLC style. NGA graphic annunciator. Network fiber vs copper.',
            gotchas: [
              'E3 networking is its own drawing. Do not unplug a node “to clear a trouble.”',
              'Velociti vs CLIP-class devices depend on the loop card. Bring the loop inventory, not a guess.',
              'gamewell-fci.com / Honeywell Buildings for the exact E3 CPU.'
            ],
            href: 'https://www.gamewell-fci.com',
            linkLabel: 'Gamewell-FCI documentation',
            linkSub: 'gamewell-fci.com — E3 Series, ILI, NGA',
            tags: ['e3', 'gamewell', 'fci', 'gamewell-fci', 'ili', 'nga', 'facp', 'commercial fire']
          },
          {
            brand: 'Mircom', title: 'FX-2000 / FX-3500 / Flex-Net',
            use: 'Canadian and US commercial FACP. Addressable SLC, NAC, optional voice. Flex-Net is the networked platform.',
            look: 'CPU / node. SLC class. NAC voltage. Battery calc on the door.',
            gotchas: [
              'Mircom software and job files are not Notifier files. Bring the right config tool.',
              'Ground fault: sectionalize. Same as any addressable fire panel.',
              'Impairment process still applies. mircom.com for the exact FX/Flex-Net model.'
            ],
            href: 'https://www.mircom.com',
            linkLabel: 'Mircom fire manuals',
            linkSub: 'mircom.com — FX-2000, FX-3500, Flex-Net',
            tags: ['mircom', 'fx-2000', 'fx-3500', 'flex-net', 'flexnet', 'facp', 'commercial fire']
          },
          {
            brand: 'Gentex', title: 'Commander 3 / horns & strobes',
            use: 'The third strobe protocol after System Sensor and Wheelock. Candela tap, horn/strobe split, Gentex sync.',
            look: 'Candela setting. Wall vs ceiling. Sync module vs “plain” NAC.',
            gotchas: [
              'Gentex sync on a System Sensor or Wheelock NAC (or the reverse) is a disco that will not pass.',
              'Same last-device voltage-in-alarm rule as any NAC. Measure it.',
              'Ceiling vs wall marking still fails visual even if it flashes.'
            ],
            href: 'https://fireprotection.gentex.com/products',
            linkLabel: 'Gentex fire-protection products',
            linkSub: 'fireprotection.gentex.com — Commander, horns, strobes, sync',
            tags: ['gentex', 'commander', 'strobe', 'horn', 'NAC', 'sync', 'commercial fire']
          },
          {
            brand: 'Fire-Lite / Honeywell Fire', title: 'FCPS-24S6 / FCPS-24S8 NAC booster',
            use: 'Remote NAC power. Sync in, NAC out, battery standby. The can that is quietly carrying the corridor strobes.',
            look: 'AC LED. DC output. Battery leads. Sync input from the FACP. Per-circuit fuses.',
            gotchas: [
              'Sync protocol has to match the FACP and the appliances. A Wheelock booster on System Sensor heads is a fail.',
              'EOL is at the last device on the booster circuit, not back at the FACP.',
              'Batteries and the calc on the door are not optional. An untested booster is strobes that die in minute two.'
            ],
            href: 'https://www.firelite.com',
            linkLabel: 'Fire-Lite FCPS booster docs',
            linkSub: 'firelite.com — FCPS-24S6 / FCPS-24S8',
            tags: ['fcps', 'fcps-24s6', 'fcps-24s8', 'nac booster', 'booster', 'fire-lite', 'commercial fire']
          },
          {
            brand: 'LenelS2', title: 'OnGuard / S2 NetBox',
            use: 'Enterprise access. OnGuard is the thick-client Lenel stack (Mercury/HID boards in the can). S2 NetBox is the appliance / web UI cousin after the merger.',
            look: 'Software brand on the login. Mercury LP/MR or S2 nodes in the enclosure. Reader ports 12/24. RS-485 IO bus.',
            gotchas: [
              'The login page does not change RS-485 rules. Twisted pair, single-end shield, unique addresses.',
              'OnGuard vs NetBox programming is different software. Do not assume a Lenel download works on S2.',
              'Official LenelS2 docs for that exact panel/node. This app is field orientation.'
            ],
            href: 'https://www.lenels2.com',
            linkLabel: 'LenelS2 product / support',
            linkSub: 'lenels2.com — OnGuard, S2 NetBox, Mercury hardware',
            tags: ['lenel', 'lenels2', 'onguard', 's2', 'netbox', 'mercury', 'access', 'commercial access']
          },
          {
            brand: 'Genetec', title: 'Security Center / Synergis',
            use: 'VMS + access on one platform. Synergis is the access appliance; Security Center is the software. Mercury/HID or HID VertX-class hardware underneath on many jobs.',
            look: 'Synergis Cloud Link / unit in the can. Mercury boards. OSDP vs Wiegand per reader port.',
            gotchas: [
              'A Genetec login does not make OSDP A/B swap go away. Same bus rules as any Mercury job.',
              'Cloud Link offline ≠ “readers dead” until you check local cache / fail-mode jumpers.',
              'genetec.com support for the exact Synergis unit and Security Center version.'
            ],
            href: 'https://www.genetec.com',
            linkLabel: 'Genetec Security Center / Synergis',
            linkSub: 'genetec.com — Synergis, Security Center, Cloud Link',
            tags: ['genetec', 'synergis', 'security center', 'cloud link', 'vms', 'access', 'commercial access']
          },
          {
            brand: 'Software House / JCI', title: 'C-CURE 9000 / iSTAR',
            use: 'Enterprise access. iSTAR controllers in the can, C-CURE software upstairs. Not Mercury — different board, different bus.',
            look: 'iSTAR Ultra / Edge / Apex in the enclosure. Reader ports. Input/output boards. Network drop to the server.',
            gotchas: [
              'iSTAR is not a Mercury LP1502. Do not land it like one. Bring the Software House install sheet.',
              'Cluster / encryption / host-offline behavior is programming. A “dead reader” after a server reboot may be fail-mode.',
              'swhouse.com / JCI for C-CURE and iSTAR docs.'
            ],
            href: 'https://docs.johnsoncontrols.com/softwarehouse/',
            linkLabel: 'Software House C-CURE / iSTAR docs',
            linkSub: 'docs.johnsoncontrols.com/softwarehouse — C-CURE 9000, iSTAR',
            tags: ['ccure', 'c-cure', 'istar', 'software house', 'swhouse', 'access', 'commercial access']
          },
          {
            brand: 'Kantech / JCI', title: 'KT-400 / KT-1 / EntraPass',
            use: 'Mid-market access. KT-400 is the four-door controller. EntraPass is the software (Special / Corporate / Global). ioSmart readers are the current Kantech credential story.',
            look: 'KT-400 in the can. 12 V. RS-485 to downstream. Reader ports. Combus vs Ethernet.',
            gotchas: [
              'EntraPass edition (Special vs Corporate vs Global) changes how many controllers and what features you actually have.',
              'ioSmart vs old ioProx vs third-party Wiegand is a credential/format problem, not a “bad reader,” if badges were swapped.',
              'kantech.com for KT-400 / KT-1 install sheets.'
            ],
            href: 'https://www.kantech.com',
            linkLabel: 'Kantech KT-400 / EntraPass docs',
            linkSub: 'kantech.com — KT-400, KT-1, EntraPass, ioSmart',
            tags: ['kantech', 'kt-400', 'kt400', 'kt-1', 'entrapass', 'iosmart', 'access', 'commercial access']
          },
          {
            brand: 'RS2 / Genetec', title: 'Access It! / Mercury hardware',
            use: 'Access It! software on Mercury LP/MR boards. A huge installed base in schools and commercial. Genetec acquired RS2 — the boards did not change.',
            look: 'LP1501/1502 + MR52 in an Altronix/Trove can. 12 V. RS-485 IO bus.',
            gotchas: [
              'Software brand on the PC does not change RS-485, addressing, or reader-port voltage jumpers.',
              'After a power cycle wait for a full boot before you declare a downstream MR dead.',
              'rs2tech.com / Genetec for Access It! docs; HID for the Mercury board sheet.'
            ],
            href: 'https://www.rs2tech.com',
            linkLabel: 'RS2 Access It! / Genetec',
            linkSub: 'rs2tech.com — Access It! Universal; Mercury hardware is HID',
            tags: ['rs2', 'access it', 'accessit', 'mercury', 'lp1502', 'mr52', 'commercial access']
          },
          {
            brand: 'SDC', title: '1511 / 1581 Exit Check delayed egress',
            use: 'Delayed-egress maglock / controller. 15-second nuisance delay (or listed alternative) with audible, then release. Fire alarm must drop it immediately.',
            look: 'Exit Check controller. Maglock. Nuisance delay jumper. Fire-alarm trigger. Signage required by code.',
            gotchas: [
              'Fire alarm release is immediate — not after 15 seconds. If the mag holds on fire, you landed status, not the drop.',
              'Signage and the listed delay are AHJ items. Do not invent a 30-second delay because someone asked.',
              'Free egress on the listed opening still has to work if electronics fail. Read the SDC sheet and the adopted IBC/NFPA language.'
            ],
            href: 'https://www.sdcsecurity.com',
            linkLabel: 'SDC Exit Check / 1511 docs',
            linkSub: 'sdcsecurity.com — 1511, 1581, Exit Check',
            tags: ['sdc', '1511', '1581', 'exit check', 'delayed egress', 'maglock', 'commercial access']
          },
          {
            brand: 'Alarm Lock / NAPCO', title: 'Trilogy / Networx DL2700 / DL4100',
            use: 'Standalone and networked cylindrical locksets. Audit trail in the lock. Networx adds radio to a gateway. Very common on interior offices and storage.',
            look: 'Model on the inside housing. Battery pack. Key override. Networx antenna / gateway if present.',
            gotchas: [
              'Dead lock is usually batteries. Change them before you condemn the board. Photograph the audit if you can.',
              'Handing and latch length are hardware, not programming. A bound latch looks like “it won’t unlock.”',
              'Networx gateway offline ≠ lock dead. The lock still runs locally on its schedule until you need a download.'
            ],
            href: 'https://www.alarmlock.com',
            linkLabel: 'Alarm Lock Trilogy / Networx',
            linkSub: 'alarmlock.com — DL2700, DL4100, Networx',
            tags: ['trilogy', 'networx', 'dl2700', 'dl4100', 'alarm lock', 'alarmlock', 'standalone lock', 'commercial access']
          },
          {
            brand: 'Schlage / Allegion', title: 'AD-400 / NDE / LE wireless locks',
            use: 'Wireless locksets on ENGAGE or older AD-Series PIM400. Battery in the lock, hub in the closet. Interior openings everywhere.',
            look: 'Model on the inside escutcheon. ENGAGE vs AD-400 radio. PIM400 / ENGAGE gateway. Battery door.',
            gotchas: [
              'AD-400 is not NDE. Different radio, different software, different gateway. Do not mix them on one story.',
              'Dead lock: batteries first, then handing, then whether the hub actually sees it.',
              'Fire-rated doors need listed wireless mortise + listed hardware. Random cylindrical on a rated stair is an AHJ fail.'
            ],
            href: 'https://us.allegion.com/en/home/products/brands/schlage.html',
            linkLabel: 'Schlage AD-400 / NDE / LE docs',
            linkSub: 'allegion.com — AD-400, NDE, LE, ENGAGE',
            tags: ['ad-400', 'ad400', 'nde', 'le', 'engage', 'schlage wireless', 'pim400', 'commercial access']
          },
          {
            brand: 'Farpointe Data', title: 'Delta / Pyramid / Ranger readers',
            use: 'The other credential reader. Pyramid (125 kHz), Delta (13.56), Ranger (UHF long-range). Wiegand or OSDP pigtail.',
            look: 'Model on the back. 5–16 VDC typical. Drain. Tamper.',
            gotchas: [
              'Pyramid vs Delta vs Ranger is a credential frequency problem. A Prox badge will not read a Delta-only head.',
              'Metal-mount spacer still applies. Long-range Ranger wants a clean view, not a reader stuffed in a mullion.',
              'farpointe.com for the exact SKU install sheet.'
            ],
            href: 'https://www.farpointedata.com/',
            linkLabel: 'Farpointe reader docs',
            linkSub: 'farpointedata.com — Delta, Pyramid, Ranger',
            tags: ['farpointe', 'delta', 'delta3', 'pyramid', 'ranger', 'reader', 'prox', 'commercial access']
          },
          {
            brand: 'Identiv / Hirsch', title: 'Velocity / MX controllers',
            use: 'Hirsch/Identiv access. MX controllers, SNIB comms, DIGI*TRAC vintage still in the field. Velocity is the software.',
            look: 'MX / Mx-1 in the can. SNIB3 network board. Reader ports. MATCH / RS-485 depending on vintage.',
            gotchas: [
              'Hirsch is not Mercury. Addressing, termination, and reader power are on the Hirsch sheet.',
              'SNIB vs SNIB2 vs SNIB3 is a comms generation. Mixing them without the note is a silent bus.',
              'identiv.com for Velocity / MX docs.'
            ],
            href: 'https://www.identiv.com',
            linkLabel: 'Identiv Hirsch Velocity / MX',
            linkSub: 'identiv.com — Velocity, MX, SNIB',
            tags: ['hirsch', 'identiv', 'velocity', 'mx', 'snib', 'digitrac', 'access', 'commercial access']
          },
          {
            brand: 'Avigilon / Motorola', title: 'H5 / H6 cameras + Unity / ACC',
            use: 'Commercial cameras plus ACC / Unity VMS. Analytics on the camera. PoE class matters on H5A/H6A with IR and heater.',
            look: 'Part number on the belly. PoE class. SD behind a gasket. ACC server vs Unity cloud/hybrid.',
            gotchas: [
              'H6 analytics + IR + cold start can want at/PoE+. An af-only switch = night reboot.',
              'Factory default is a button sequence with power applied — photograph the IP first.',
              'ACC vs Unity is a software generation. A replaced server looks like “every camera died.”'
            ],
            href: 'https://www.avigilon.com',
            linkLabel: 'Avigilon support & manuals',
            linkSub: 'avigilon.com — H5, H6, ACC, Unity',
            tags: ['avigilon', 'h5', 'h6', 'h5a', 'acc', 'unity', 'camera', 'vms', 'commercial camera']
          },
          {
            brand: 'Hikvision', title: 'AcuSense / DS-2CD cameras + iVMS / Hik-Connect',
            use: 'A huge installed base. AcuSense is the current analytics line. iVMS-4200 / Hik-Connect / HikCentral depending on the job.',
            look: 'Model on the gimbal. PoE class. Reset recessed. SADP discovery tool.',
            gotchas: [
              'Activation / password is mandatory on current firmware. A “dead” camera is often not activated yet.',
              'SADP on the right VLAN finds it. Wrong VLAN still wins.',
              'PoE class vs IR. Same night-reboot story as everyone else. hikvision.com for the exact DS-2CD sheet.'
            ],
            href: 'https://www.hikvision.com',
            linkLabel: 'Hikvision support / downloads',
            linkSub: 'hikvision.com — DS-2CD, AcuSense, iVMS-4200',
            tags: ['hikvision', 'acusense', 'ds-2cd', 'ivms', 'hik-connect', 'camera', 'commercial camera']
          },
          {
            brand: 'Bosch', title: 'FLEXIDOME / AUTODOME cameras',
            use: 'Commercial Bosch video. FLEXIDOME is the turret/dome. AUTODOME is the PTZ. CPP-era firmware and Project Assistant matter.',
            look: 'Model on the belly. PoE vs 24 VAC on older AUTODOME. Reset. SD.',
            gotchas: [
              'AUTODOME heaters and PTZ motors are a PoE+ / midspan conversation. Do not feed a PTZ like a 4 W spy cam.',
              'Project Assistant / Configuration Manager beat a random YouTube reset.',
              'boschsecurity.com for the exact FLEXIDOME / AUTODOME datasheet.'
            ],
            href: 'https://www.boschsecurity.com/us/en/support/datasheets-and-documents/',
            linkLabel: 'Bosch FLEXIDOME / AUTODOME docs',
            linkSub: 'boschsecurity.com — FLEXIDOME, AUTODOME, Configuration Manager',
            tags: ['flexidome', 'autodome', 'bosch camera', 'ptz', 'camera', 'commercial camera']
          },
          {
            brand: 'Pelco / Motorola', title: 'Spectra / Sarix cameras',
            use: 'Spectra is the PTZ in gyms and parking lots. Sarix is the fixed/bullet line. Huge legacy install base.',
            look: 'Model in the bubble or on the belly. 24 VAC vs PoE. Heater. UTP vs coax on older Spectra.',
            gotchas: [
              'Legacy Spectra on 24 VAC is not a PoE camera. A midspan will not wake a 24 VAC PTZ.',
              'Heater + blower + cold start will fold an undersized transformer. Measure VAC under load at the unit.',
              'pelco.com for the exact Spectra / Sarix sheet.'
            ],
            href: 'https://www.pelco.com',
            linkLabel: 'Pelco Spectra / Sarix support',
            linkSub: 'pelco.com — Spectra, Sarix',
            tags: ['pelco', 'spectra', 'sarix', 'ptz', 'camera', 'commercial camera']
          },
          {
            brand: 'Milestone', title: 'XProtect VMS',
            use: 'The VMS on a lot of commercial NVRs that are actually PCs. Essential / Express / Professional / Expert / Corporate SKUs change device count and features.',
            look: 'XProtect version on the Management Client. Recording server vs management server. Device pack version.',
            gotchas: [
              'A camera that “died” after a Windows update is often the recording server service, not the camera.',
              'Device pack has to support that camera firmware. Out-of-date pack = no stream, not a bad cam.',
              'milestonesys.com for XProtect admin docs. Hardware still has its own OEM sheet.'
            ],
            href: 'https://www.milestonesys.com',
            linkLabel: 'Milestone XProtect support',
            linkSub: 'milestonesys.com — XProtect, device packs',
            tags: ['milestone', 'xprotect', 'vms', 'nvr', 'device pack', 'commercial camera']
          },
          {
            brand: 'Exacq / JCI', title: 'exacqVision VMS / recorders',
            use: 'The other common commercial VMS. Hybrid and IP servers. EasyConnect / Enterprise clients.',
            look: 'Server SKU. Client version vs server version. Camera licenses.',
            gotchas: [
              'Client newer than server (or reverse) is a “won’t connect” ticket, not a dead NVR.',
              'License / MAC after a motherboard swap: the box looks empty until you re-host licenses.',
              'exacq.com for server/client compatibility and camera support lists.'
            ],
            href: 'https://www.exacq.com',
            linkLabel: 'exacqVision support',
            linkSub: 'exacq.com — exacqVision servers and clients',
            tags: ['exacq', 'exacqvision', 'vms', 'nvr', 'johnson controls', 'commercial camera']
          },
          {
            brand: 'Panasonic i-PRO', title: 'i-PRO cameras / WV series',
            use: 'Former Panasonic Security. i-PRO is the current brand. WV-S / WV-U series, AI analytics, PoE.',
            look: 'Model on the belly. PoE class. SD. Reset.',
            gotchas: [
              'i-PRO vs old Panasonic firmware tools are not the same installer. Use i-PRO Config / the current tool.',
              'PoE class vs IR + heater. Same night-reboot story.',
              'i-pro.com for the exact WV-S / WV-U datasheet.'
            ],
            href: 'https://i-pro.com',
            linkLabel: 'i-PRO support & manuals',
            linkSub: 'i-pro.com — WV-S, WV-U, i-PRO cameras',
            tags: ['i-pro', 'ipro', 'panasonic', 'wv-s', 'wv-u', 'camera', 'commercial camera']
          },
          {
            brand: 'Open Options', title: 'DNA Fusion / Mercury hardware',
            use: 'DNA Fusion software on Mercury boards. Common in education and commercial. Same LP/MR hardware story as RS2/Lenel.',
            look: 'LP1502 + MR52. 12 V. RS-485. Software on a workstation, not in the can.',
            gotchas: [
              'DNA Fusion version vs Mercury firmware: a mismatch looks like a dead downstream MR.',
              'Same RS-485 and reader-port jumper rules as every other Mercury white-label.',
              'openoptions.com for DNA Fusion; HID for the board sheet.'
            ],
            href: 'https://www.openoptions.com',
            linkLabel: 'Open Options DNA Fusion',
            linkSub: 'openoptions.com — DNA Fusion; Mercury hardware is HID',
            tags: ['open options', 'dna fusion', 'dnafusion', 'mercury', 'access', 'commercial access']
          },
          {
            brand: 'Bosch', title: 'AMC2 access controller',
            use: 'Bosch Access Modular Controller. RS-485 to readers and extensions. Access Professional Edition / BIS / AMS software depending on vintage.',
            look: 'AMC2-4W / 4WE in the can. 12/24. Reader ports. Extension boards.',
            gotchas: [
              'AMC2 is not a Mercury board. Addressing and bus termination are on the Bosch sheet.',
              'APE vs BIS vs AMS is different software. Do not assume a laptop “Bosch tool” talks to every vintage.',
              'boschsecurity.com — AMC2 install / AMS docs.'
            ],
            href: 'https://www.boschsecurity.com/us/en/support/datasheets-and-documents/',
            linkLabel: 'Bosch AMC2 / access control docs',
            linkSub: 'boschsecurity.com — AMC2, AMS, Access Professional Edition',
            tags: ['amc2', 'bosch access', 'ams', 'ape', 'bis', 'access', 'commercial access']
          },
          {
            brand: 'Salto', title: 'XS4 / Space / SVN / JustIN',
            use: 'Wireless and SALTO Virtual Network locks. No maglock homerun on most interior doors. SVN updates the lock through the credential. Space / JustIN Mobile is the current software story.',
            look: 'Model on the inside escutcheon. Battery pack. SVN vs BLUEnet / SALTO KS / Space. Cylinder override.',
            gotchas: [
              'A lock that will not update is often a dead battery or a credential that never passed an encoder / wall reader, not a bad mortise.',
              'SVN vs RF vs JustIN Mobile are different update paths. Do not mix the story on one opening.',
              'Fire-rated doors still need listed hardware. A SALTO cylindrical on a rated stair is an AHJ conversation.'
            ],
            href: 'https://www.saltosystems.com',
            linkLabel: 'SALTO product / support',
            linkSub: 'saltosystems.com — XS4, Space, SVN, JustIN',
            tags: ['salto', 'xs4', 'svn', 'justIN', 'space', 'wireless lock', 'commercial access']
          },
          {
            brand: 'DSX', title: 'WinDSX / 1042 / 1040 / 1048 controllers',
            use: 'Independent intelligent controllers plus WinDSX / WinDSX SQL. Schools and commercial love it because the panel keeps running if the PC dies. Not Mercury.',
            look: '1042 two-door in the can. 1040 / 1048 for more I/O. DSX-LAN / IP-HUB for network. 12 V. Reader ports on the board, not an MR52.',
            gotchas: [
              'This is not a Mercury LP1502. Addressing, download, and comm-server rules are DSX. Bring the DSX sheet.',
              'WinDSX (Access DB) vs WinDSX SQL is a size decision. Do not install SQL because a laptop “had it.”',
              'Comm Server PC is the one talking to the panels. A workstation with no comm path looks like “every door died.”'
            ],
            href: 'https://www.dsxinc.com',
            linkLabel: 'DSX Access Systems',
            linkSub: 'dsxinc.com — WinDSX, 1042, 1040, 1048, IP-HUB',
            tags: ['dsx', 'windsx', '1042', '1040', '1048', 'dsx-lan', 'access', 'commercial access']
          },
          {
            brand: 'Software House / JCI', title: 'iSTAR Ultra / Ultra SE / Edge G2',
            use: 'The controller in a C-CURE can. Ultra is the big one. Edge / Edge G2 is the one- or two-door cousin. Not a Mercury board — different terminals, different download.',
            look: 'iSTAR silk-screen. Reader ports. ACM / RM relay boards. Network drop to the C-CURE server. Cluster LED.',
            gotchas: [
              'iSTAR firmware has to match the C-CURE version. A mismatch looks like a dead cluster after a server upgrade.',
              'Host-offline / fail-mode is programming. Do not assume unlocked-on-fail unless the drawing says so.',
              'docs.johnsoncontrols.com/softwarehouse for the exact Ultra / Edge install.'
            ],
            href: 'https://docs.johnsoncontrols.com/softwarehouse/',
            linkLabel: 'Software House iSTAR docs',
            linkSub: 'JCI Knowledge Exchange — iSTAR Ultra, Ultra SE, Edge G2',
            tags: ['istar', 'istar ultra', 'istar edge', 'ccure', 'c-cure', 'software house', 'swhouse', 'commercial access']
          },
          {
            brand: 'Honeywell', title: 'WIN-PAK / NetAXS / Pro-Watch',
            use: 'Honeywell access software stack. WIN-PAK is the mid-market workhorse. NetAXS is the web-board in the can. Pro-Watch is enterprise. PW-5000 / PW-6000 / Mercury OEM mixed depending on vintage.',
            look: 'NetAXS web sticker on the board. PW intelligent controller. 12 V. Reader ports. WIN-PAK workstation vs browser.',
            gotchas: [
              'WIN-PAK vs Pro-Watch vs MAXPRO Cloud are not the same download. Bring the right tool.',
              'NetAXS default IP / web UI — change it. A board that “pings but will not log in” is often a browser TLS or default-password leftover.',
              'Honeywell security / buildings docs for that exact PW or NetAXS SKU.'
            ],
            href: 'https://buildings.honeywell.com/us/en/brands/our-brands/security',
            linkLabel: 'Honeywell WIN-PAK / NetAXS / Pro-Watch',
            linkSub: 'buildings.honeywell.com — WIN-PAK, NetAXS, Pro-Watch, PW-6000',
            tags: ['win-pak', 'winpak', 'netaxs', 'pro-watch', 'prowatch', 'pw-6000', 'honeywell access', 'commercial access']
          },
          {
            brand: 'Brivo', title: 'Access / ACS6000 / OnAir',
            use: 'Cloud access. ACS6000-class panels in the can, browser upstairs. Contractors hit this in multi-site retail and offices that dumped the on-prem server.',
            look: 'ACS panel. Ethernet. Reader ports. Cloud status LED. 12 V.',
            gotchas: [
              'No cloud path = no admin, but doors should still run on cached credentials until you prove otherwise.',
              'Reader format / OSDP vs Wiegand is still a field problem. The cloud UI does not fix a swapped data pair.',
              'brivo.com support for the exact ACS / Control Panel model.'
            ],
            href: 'https://www.brivo.com',
            linkLabel: 'Brivo Access support',
            linkSub: 'brivo.com — Access, ACS6000, OnAir',
            tags: ['brivo', 'acs6000', 'onair', 'cloud access', 'commercial access']
          },
          {
            brand: 'Gallagher', title: 'Command Centre / T20 / T15',
            use: 'Gallagher access — common in industrial, campuses, and anything that came out of ANZ/UK and landed in the US. T-series controllers, Command Centre software.',
            look: 'T20 / T15 in the can. HBUS / reader ports. 13.6 V typical. Fence / intercom options on some jobs.',
            gotchas: [
              'HBUS is not Wiegand. Gallagher readers on HBUS; third-party Wiegand takes a different port / interface.',
              'Controller firmware vs Command Centre version — a mismatch after an IT upgrade looks like a dead site.',
              'security.gallagher.com for the exact T-series sheet.'
            ],
            href: 'https://security.gallagher.com',
            linkLabel: 'Gallagher Command Centre / T-series',
            linkSub: 'security.gallagher.com — T20, T15, Command Centre',
            tags: ['gallagher', 't20', 't15', 'command centre', 'hbus', 'commercial access']
          },
          {
            brand: 'Paxton', title: 'Net2 / Paxton10 / Switch2',
            use: 'UK-origin access that shows up in US offices and schools. Net2 is the classic. Paxton10 is the IP generation. Switch2 is the old standalone two-door.',
            look: 'Net2 Plus in the can. 12 V. Paxton readers (clock/data, not HID Prox unless that SKU). Ethernet to the Net2 PC / Paxton10.',
            gotchas: [
              'Paxton tokens are not HID Prox. A corporate badge that worked on Signo will not read a Paxton head.',
              'Net2 software PC is the brain. A replaced PC with no backup looks like every fob died.',
              'paxton-access.com for Net2 / Paxton10 install.'
            ],
            href: 'https://www.paxton-access.com',
            linkLabel: 'Paxton Net2 / Paxton10 docs',
            linkSub: 'paxton-access.com — Net2 Plus, Paxton10, Switch2',
            tags: ['paxton', 'net2', 'paxton10', 'switch2', 'access', 'commercial access']
          },
          {
            brand: 'PDK / ProdataKey', title: 'Cloud nodes / pdk.io',
            use: 'Cloud access nodes in the can, browser at pdk.io. Popular with small commercial and multi-site contractors who do not want a server.',
            look: 'PDK node. Ethernet or cell. Reader ports. 12 V. Cloud LED.',
            gotchas: [
              'No WAN = no live admin. Cached cards should still work. Prove the path before you swap a node.',
              'Reader voltage and Wiegand/OSDP are still copper. The cloud does not fix a yellow/green swap.',
              'prodatakey.com / pdk.io support for the exact node SKU.'
            ],
            href: 'https://www.prodatakey.com',
            linkLabel: 'PDK / ProdataKey support',
            linkSub: 'prodatakey.com — cloud nodes, pdk.io',
            tags: ['pdk', 'prodatakey', 'pdk.io', 'cloud access', 'commercial access']
          },
          {
            brand: 'Linear / Nortek', title: 'eMerge E3 / Essential / Elite',
            use: 'Web-based access panel. eMerge E3 is the one in a lot of small commercial and apartments. Browser to the panel, no thick client.',
            look: 'E3 board in a can. Ethernet. Reader ports. 12 V. Default IP on the label.',
            gotchas: [
              'Default IP / password on the door label. Change them. A “new” panel that will not load is often the laptop on the wrong subnet.',
              'Browser TLS / Java leftovers on old firmware. Use the current browser note from Linear, not an ancient IE bookmark.',
              'nortekcontrol.com / linear-solutions for the E3 install.'
            ],
            href: 'https://www.nortekcontrol.com',
            linkLabel: 'Linear eMerge E3 docs',
            linkSub: 'nortekcontrol.com — eMerge E3 Essential / Elite',
            tags: ['emerge', 'e3', 'linear', 'nortek', 'access', 'commercial access']
          },
          {
            brand: 'Keyscan / Dormakaba', title: 'Aurora / CA4500 / CA8500',
            use: 'Keyscan access. Aurora is the current software. CA-series controllers in the can. Common in Canada and US commercial.',
            look: 'CA4500 / CA8500. 12 V. Reader ports. Network / serial to Aurora PC.',
            gotchas: [
              'CIM / CIMC network modules vs old serial. A panel that “worked on COM1” will sit mute on Ethernet until the CIM is set.',
              'Aurora vs System VII vs Client software vintage — match the controller firmware.',
              'keyscan.ca for CA / Aurora docs.'
            ],
            href: 'https://www.keyscan.ca',
            linkLabel: 'Keyscan Aurora / CA controllers',
            linkSub: 'keyscan.ca — Aurora, CA4500, CA8500',
            tags: ['keyscan', 'aurora', 'ca4500', 'ca8500', 'dormakaba', 'commercial access']
          },
          {
            brand: 'Dormakaba', title: 'E-Plex / Best / Saffire / Switch TECH',
            use: 'Standalone and networked locksets. E-Plex is the keypad cylindrical everyone has in storage rooms. Best cores. Saffire / Switch TECH on hotel and multi-family.',
            look: 'Model on the inside housing. Battery pack. Key override / Best core. Wireless gateway if present.',
            gotchas: [
              'Dead lock is batteries until proven otherwise. Photograph the audit if you can.',
              'Handing and latch length are hardware. A bound latch looks like “it will not unlock.”',
              'Hotel / multi-family encoders are their own software. Do not treat Saffire like an E-Plex.'
            ],
            href: 'https://www.dormakaba.com',
            linkLabel: 'Dormakaba E-Plex / Best docs',
            linkSub: 'dormakaba.com — E-Plex, Best, Saffire',
            tags: ['e-plex', 'eplex', 'best', 'saffire', 'dormakaba', 'standalone lock', 'commercial access']
          },
          {
            brand: 'DoorKing / DKS', title: '1833 / 1834 / 1835 / 1837 telephone entry',
            use: 'The pedestal or wall box at the gate. Telephone entry plus card / prox on many units. 1833 is classic. 1835/1837 add more directory / display.',
            look: 'Model on the board. 16 VAC transformer (not 16 VAC doorbell leftover). Phone line or IP / cell adapter. Tracker expansion boards.',
            gotchas: [
              'These want a listed 16 VAC 20–40 VA class transformer, not a 10 VA chime brick. Measure VAC under load.',
              'Tracker expansion addressing — two boards on one address is a haunted gate.',
              'VOIP analog adapters and fiber ONTs break phone-entry seize the same way RJ31X dies. Cell / IP adapters exist for a reason.'
            ],
            href: 'https://www.doorking.com',
            linkLabel: 'DoorKing 1830-series docs',
            linkSub: 'doorking.com — 1833, 1834, 1835, 1837, Tracker',
            tags: ['doorking', 'dks', '1833', '1834', '1835', '1837', 'telephone entry', 'gate', 'commercial access']
          },
          {
            brand: 'HID / ISONAS', title: 'IP-Bridge / Pure IP readers',
            use: 'Power-over-Ethernet readers. No home-run to a Mercury board — the reader IS the door controller. IP-Bridge exists for legacy ISONAS to HID Aero migrations.',
            look: 'PoE class. Door contact / REX / lock outputs on the reader or bridge. MAC / default IP.',
            gotchas: [
              'Lock power off a reader PoE budget is a real number. A maglock on a Class 2 port brownouts the reader when it pulls.',
              'VLAN / DHCP reservations matter. A replaced switch with no reservation looks like the door died.',
              'hidglobal.com ISONAS / IP-Bridge sheets — not a Wiegand pigtail card.'
            ],
            href: 'https://www.hidglobal.com/documents',
            linkLabel: 'HID ISONAS / IP-Bridge docs',
            linkSub: 'hidglobal.com/documents — ISONAS, IP-Bridge, Pure IP',
            tags: ['isonas', 'ip-bridge', 'ipbridge', 'pure ip', 'poe reader', 'hid isonas', 'commercial access']
          },
          {
            brand: 'AMAG', title: 'Symmetry / M2150',
            use: 'AMAG Symmetry software, M2150-class controllers. Government-adjacent and commercial. Not Mercury.',
            look: 'M2150 in the can. Reader ports. Network to the Symmetry server.',
            gotchas: [
              'Symmetry version vs panel firmware. Same story as every enterprise stack.',
              'Reader technology (multiCLASS vs Prox) is a credential problem if the site swapped badges.',
              'amag.com for Symmetry / M2150 docs.'
            ],
            href: 'https://www.amag.com',
            linkLabel: 'AMAG Symmetry docs',
            linkSub: 'amag.com — Symmetry, M2150',
            tags: ['amag', 'symmetry', 'm2150', 'access', 'commercial access']
          },
          {
            brand: 'Feenics', title: 'Keep / Mercury hardware',
            use: 'Cloud access software on Mercury LP/MR boards. Another white-label of the same hardware as RS2 / Open Options / Lenel.',
            look: 'LP1502 + MR52. 12 V. RS-485. Keep browser, not a thick client in the can.',
            gotchas: [
              'Software brand does not change RS-485, addressing, or reader-port jumpers.',
              'Cloud path down ≠ doors dead until you prove cached credentials failed.',
              'feenics.com for Keep; HID for the board sheet.'
            ],
            href: 'https://www.feenics.com',
            linkLabel: 'Feenics Keep',
            linkSub: 'feenics.com — Keep; Mercury hardware is HID',
            tags: ['feenics', 'keep', 'mercury', 'cloud access', 'commercial access']
          },
          {
            brand: 'CDVI', title: 'Atrium / K2 / Centaur',
            use: 'CDVI access. Atrium is the current web/software platform. K2 / Centaur still in the field. Popular in Canada and some US commercial.',
            look: 'A22 / A22K / K2 controller. 12 V. Reader ports. Ethernet.',
            gotchas: [
              'Atrium vs Centaur vs K2 software are generations. A USB dongle or license from the wrong era will not talk.',
              'Reader format — CDVI credentials vs HID Prox is a mix you confirm on the label.',
              'cdviusa.com / cdvi.com for Atrium install.'
            ],
            href: 'https://www.cdviusa.com',
            linkLabel: 'CDVI Atrium / K2 docs',
            linkSub: 'cdviusa.com — Atrium, A22, K2, Centaur',
            tags: ['cdvi', 'atrium', 'k2', 'centaur', 'a22', 'access', 'commercial access']
          },
          {
            brand: 'Command Access', title: 'Electrified exit / mortise kits (QEL-style)',
            use: 'Aftermarket motor-latch kits in Von Duprin / Sargent / Yale / Corbin rails. The panic bar that “got electrified later.”',
            look: 'Command Access motor in the rail. Power transfer. 24 VDC typical. RX / latch monitor extras.',
            gotchas: [
              'Inrush is not a 500 mA ACM output. Size like a QEL.',
              'Fire-listed openings need the listed kit for that rail. A random motor in a 99-F can void the label.',
              'commandaccess.com for the exact rail kit sheet.'
            ],
            href: 'https://www.commandaccess.com',
            linkLabel: 'Command Access kit docs',
            linkSub: 'commandaccess.com — electrified exit / mortise kits',
            tags: ['command access', 'qel', 'exit device', 'electrified trim', 'commercial access']
          },
          {
            brand: 'RCI / Rutherford', title: 'FDAK / 8310 / 8371 maglocks & strikes',
            use: 'The other maglock / strike house. 8310-class mags, delayed egress, strikes. Common when the spec was not Securitron/HES.',
            look: 'Voltage on the pigtail. Bond sensor leads. Delayed-egress board if present.',
            gotchas: [
              'Same 12 vs 24 trap as every mag. Check the pigtail before the ACM.',
              'Delayed egress still needs immediate fire drop and listed signage. Do not invent a 30-second timer.',
              'rutherfordcontrols.com for the exact 8310 / FDAK sheet.'
            ],
            href: 'https://www.rutherfordcontrols.com',
            linkLabel: 'RCI / Rutherford docs',
            linkSub: 'rutherfordcontrols.com — 8310, 8371, FDAK',
            tags: ['rci', 'rutherford', '8310', 'fdak', 'maglock', 'strike', 'commercial access']
          },
          {
            brand: 'LCN / Allegion', title: '4040XP closer / 4642 auto operator',
            use: 'The closer on every commercial door, and the low-energy auto-operator on ADA openings. 4642 / 9130 / 2800-class operators need a listed actuator and often a fire-alarm drop.',
            look: 'Closer number on the body. Operator header. 120 VAC to the operator, 24 V to actuators. Fire-alarm input on auto units.',
            gotchas: [
              'Low-energy operators are not “just a closer with a button.” Fire-alarm disable, guide rails, and timing are listed.',
              'A 4040XP installed upside down or on the wrong side of the hinge is a slam, not a bad door.',
              'allegion.com LCN — 4040XP, 4642, 9130 sheets.'
            ],
            href: 'https://us.allegion.com/en/home/products/brands/lcn.html',
            linkLabel: 'LCN 4040XP / operators',
            linkSub: 'allegion.com — 4040XP, 4642, 9130',
            tags: ['lcn', '4040xp', '4642', 'auto operator', 'closer', 'ada', 'commercial access']
          },
          {
            brand: 'Detex', title: 'Advantex / delayed egress / EAX',
            use: 'Exit alarms, delayed egress bars, Advantex panic hardware. EAX is the battery exit alarm on back doors.',
            look: 'Fire vs panic label. Delayed-egress logic board. 24 V or battery EAX. Signage.',
            gotchas: [
              'EAX screaming after a battery change still wants the door actually latched. A bent strike is not a new EAX.',
              'Delayed egress: fire drop is immediate. Same rule as SDC Exit Check.',
              'detex.com for Advantex / EAX sheets.'
            ],
            href: 'https://www.detex.com',
            linkLabel: 'Detex Advantex / EAX docs',
            linkSub: 'detex.com — Advantex, delayed egress, EAX',
            tags: ['detex', 'advantex', 'eax', 'delayed egress', 'exit alarm', 'commercial access']
          },
          {
            brand: 'IEI / Essex', title: 'Keypads / PIEZO / Hub',
            use: 'Standalone door keypads. IEI Hub / MiniProx / keypad cylinders. Essex PIEZO vandal pads. Still on half the storage rooms you service.',
            look: 'Model on the back. 12/24. Relay vs Wiegand out. Illuminated vs piezo.',
            gotchas: [
              'A keypad with a relay output is not a reader. Landing it on Data 0/1 does nothing useful.',
              'Default codes belong in the official sheet and should already have been changed. We do not publish them.',
              'iei.com / essexelectronics.com for the exact pad.'
            ],
            href: 'https://www.ieib.com',
            linkLabel: 'IEI keypad docs',
            linkSub: 'ieib.com — Hub, keypads; Essex PIEZO is essexelectronics.com',
            tags: ['iei', 'essex', 'piezo', 'keypad', 'hub', 'standalone', 'commercial access']
          },
          {
            brand: 'Camden', title: 'CM restroom / door controls / push plates',
            use: 'Restroom kits, push plates, wireless receivers, relay logic for auto doors and maglock restrooms.',
            look: 'CM-series control box. 12/24. Wireless receiver learn-button. Occupied / vacant indicators.',
            gotchas: [
              'Restroom kits have a sequence (lock, occupied lamp, unlock). A “broken mag” is often a logic jumper.',
              'Wireless push plates: learn the fob to the receiver. A replaced receiver has no memory of the old plates.',
              'camdencontrols.com for the exact CM kit drawing.'
            ],
            href: 'https://www.camdencontrols.com/',
            linkLabel: 'Camden CM / push-plate docs',
            linkSub: 'camdencontrols.com — restroom kits, CM, wireless plates',
            tags: ['camden', 'cm-120', 'push plate', 'restroom', 'auto door', 'commercial access']
          },
          {
            brand: 'BEA', title: 'Body sensors / overhead presence / knowing actuators',
            use: 'Activation and safety sensors on swinging and sliding auto doors. Presence vs motion. Knowing actuators on the jamb.',
            look: 'Sensor on the header. 12/24. Presence curtain vs motion radar. Learn / width knobs.',
            gotchas: [
              'A door that “won’t stay open” is often the presence sensor seeing the floor or a mat, not a dead operator.',
              'ANSI / BHMA swing-door sensors are a listing. Random PIR over an ADA operator is not a BEA.',
              'beasensors.com for the exact overhead / knowing sheet.'
            ],
            href: 'https://www.beasensors.com',
            linkLabel: 'BEA sensor docs',
            linkSub: 'beasensors.com — overhead presence, body sensors, knowing',
            tags: ['bea', 'presence', 'knowing', 'auto door', 'header sensor', 'commercial access']
          },
          {
            brand: 'LiftMaster / Chamberlain', title: 'Operators / monitored photo eyes / myQ',
            use: 'Gate and overhead operators. UL 325 monitored photo eyes / edges. myQ / LiftMaster cloud on some units.',
            look: 'Operator model on the motor rail. 120 VAC. Photo-eye type (retro vs through-beam). Monitored vs old non-monitored.',
            gotchas: [
              'UL 325: unmonitored eyes will not let a current operator run. “It worked with the old motor” is the whole ticket.',
              'Photo-eye alignment is the job. A new board will not fix a dirty or aimed-at-the-sun eye.',
              'liftmaster.com for the exact operator and eye SKU.'
            ],
            href: 'https://www.liftmaster.com',
            linkLabel: 'LiftMaster operator / photo-eye docs',
            linkSub: 'liftmaster.com — operators, monitored eyes, myQ',
            tags: ['liftmaster', 'chamberlain', 'myq', 'photo eye', 'ul 325', 'gate', 'overhead', 'commercial access']
          },
          {
            brand: 'INVID Tech', title: 'Vision / Paramont / Record cameras & NVRs',
            use: 'Contractor-grade IP and HD-over-coax. Vision / Paramont / Record / Ultra series. Plug-and-play PoE NVRs, CMS, P2P QR.',
            look: 'Series on the NVR face (VN / PN / Record). PoE port count vs channel count. Camera model on the gimbal. NDAA vs non-NDAA SKU.',
            gotchas: [
              'Channel count is not PoE-port count. A 32-ch box with 16 PoE ports still needs a switch for the rest.',
              'P2P / QR is not a VLAN. Wrong subnet = “camera offline” with a green link.',
              'invidtech.com for the exact Vision / Paramont / Record SKU. Mix-and-match series is a firmware conversation.'
            ],
            href: 'https://invidtech.com',
            linkLabel: 'INVID Tech product / support',
            linkSub: 'invidtech.com — Vision, Paramont, Record, Ultra',
            tags: ['invid', 'invidtech', 'vision nvr', 'paramont', 'record series', 'camera', 'nvr', 'commercial camera']
          },
          {
            brand: 'Digital Watchdog', title: 'MEGApix / Blackjack / DW Spectrum',
            use: 'DW cameras plus Blackjack NVRs running DW Spectrum (Nx Witness fork). Huge contractor install base in US commercial.',
            look: 'MEGApix model on the belly. Blackjack SKU. Spectrum client vs server version. PoE class.',
            gotchas: [
              'Spectrum client newer than server (or reverse) is a “won’t connect” ticket.',
              'Blackjack is a PC. Windows updates and a full disk look like “every camera died.”',
              'digital-watchdog.com for MEGApix / Blackjack / Spectrum.'
            ],
            href: 'https://digital-watchdog.com',
            linkLabel: 'Digital Watchdog support',
            linkSub: 'digital-watchdog.com — MEGApix, Blackjack, DW Spectrum',
            tags: ['digital watchdog', 'dw', 'megapix', 'blackjack', 'dw spectrum', 'nx', 'camera', 'nvr', 'commercial camera']
          },
          {
            brand: 'Speco', title: 'Blue / Intensifier / NVR',
            use: 'Speco Blue app + Intensifier cameras (they want to see color in the dark). NVRs with PoE. Common in small commercial and multi-site retail.',
            look: 'Intensifier vs IR on the camera. NVR PoE ports. Blue app vs old Speco DDNS.',
            gotchas: [
              'Intensifier / white-light cameras draw more PoE at night. An af switch = night reboot.',
              'Blue app vs the old Speco player — a replaced NVR looks like “the app broke.”',
              'specotech.com for the exact Intensifier / Blue NVR sheet.'
            ],
            href: 'https://www.specotech.com',
            linkLabel: 'Speco Blue / Intensifier docs',
            linkSub: 'specotech.com — Blue, Intensifier, NVRs',
            tags: ['speco', 'speco blue', 'intensifier', 'camera', 'nvr', 'commercial camera']
          },
          {
            brand: 'Honeywell Video', title: '35 Series / Performance / MAXPRO',
            use: 'Honeywell-branded cameras and MAXPRO NVR / VMS. 35 Series is the current IP line. Performance Series still everywhere.',
            look: 'Model on the belly. PoE class. MAXPRO NVR vs VMS server. Reset.',
            gotchas: [
              'MAXPRO NVR vs MAXPRO VMS vs older Fusion / Rapid Eye are different software. Bring the right client.',
              'PoE class vs IR. Same night-reboot story.',
              'Honeywell security video docs for the exact 35 Series / MAXPRO SKU.'
            ],
            href: 'https://buildings.honeywell.com/us/en/brands/our-brands/security',
            linkLabel: 'Honeywell 35 Series / MAXPRO',
            linkSub: 'buildings.honeywell.com — 35 Series, Performance, MAXPRO',
            tags: ['honeywell camera', '35 series', 'maxpro', 'performance series', 'camera', 'nvr', 'commercial camera']
          },
          {
            brand: 'IC Realtime', title: 'IP cameras / NVRs / IC View',
            use: 'Another contractor IP line. NVRs with PoE, IC View / IC Cloud apps, lots of turret/bullet SKUs on small commercial.',
            look: 'Model on the gimbal. PoE ports vs channels. IC View vs SmartPSS leftovers.',
            gotchas: [
              'Activation / password on current firmware. A “dead” camera is often not activated.',
              'PoE budget on the NVR. The 9th camera is when people start rebooting.',
              'icrealtime.com for the exact SKU.'
            ],
            href: 'https://icrealtime.com',
            linkLabel: 'IC Realtime support',
            linkSub: 'icrealtime.com — cameras, NVRs, IC View',
            tags: ['ic realtime', 'icrealtime', 'ic view', 'camera', 'nvr', 'commercial camera']
          },
          {
            brand: 'Uniview', title: 'IPC / NVR / EZView',
            use: 'UNV cameras and NVRs. EZView / EZStation / EZTools. Common as an NDAA-path alternative on contractor jobs.',
            look: 'IPC model. NVR PoE. EZTools discovery. Default IP.',
            gotchas: [
              'EZTools on the right VLAN finds it. Wrong VLAN still wins.',
              'PoE class vs IR / heater. Same night-reboot story.',
              'uniview.com / uniew.com regional — use the exact IPC datasheet.'
            ],
            href: 'https://www.uniview.com',
            linkLabel: 'Uniview support / downloads',
            linkSub: 'uniview.com — IPC, NVR, EZView, EZTools',
            tags: ['uniview', 'unv', 'ezview', 'eztools', 'camera', 'nvr', 'commercial camera']
          },
          {
            brand: 'Vivotek', title: 'IB / FD / CC series cameras',
            use: 'Vivotek IP cameras. Shepherd / VAST VMS. Common in commercial and city jobs that are not Axis/Hanwha.',
            look: 'IB (bullet) / FD (dome) / CC on the belly. PoE class. SD. Reset.',
            gotchas: [
              'Shepherd finds the camera. A replaced laptop with no Shepherd looks like they all vanished.',
              'PoE class vs IR. Same story.',
              'vivotek.com support for the exact IB/FD SKU.'
            ],
            href: 'https://www.vivotek.com',
            linkLabel: 'Vivotek support',
            linkSub: 'vivotek.com — IB, FD, Shepherd, VAST',
            tags: ['vivotek', 'ib series', 'fd series', 'shepherd', 'vast', 'camera', 'commercial camera']
          },
          {
            brand: 'American Dynamics / JCI', title: 'VideoEdge / Illustra cameras',
            use: 'Tyco/JCI video. VideoEdge NVR, Illustra cameras, victor / VideoEdge client. Often sits next to C-CURE.',
            look: 'Illustra model. VideoEdge server SKU. victor Unified vs VideoEdge client.',
            gotchas: [
              'victor Unified vs VideoEdge vs older Intellex are different clients. Bring the right one.',
              'License / MAC after a motherboard swap: the box looks empty until you re-host.',
              'JCI / American Dynamics docs for VideoEdge / Illustra.'
            ],
            href: 'https://www.americandynamics.net',
            linkLabel: 'American Dynamics VideoEdge / Illustra',
            linkSub: 'americandynamics.net — VideoEdge, Illustra, victor',
            tags: ['american dynamics', 'videoedge', 'illustra', 'victor', 'jci', 'camera', 'nvr', 'commercial camera']
          },
          {
            brand: 'Cisco Meraki', title: 'MV cameras / dashboard',
            use: 'Cloud cameras. The camera IS the NVR — footage on the camera / cloud, dashboard in the browser. No local client to “fix.”',
            look: 'MV model. PoE class. Meraki serial. Dashboard network.',
            gotchas: [
              'If it is not claimed to the right dashboard network, it is a brick with a pretty LED.',
              'Local streaming still needs the dashboard account. A “dead camera” is often a license / claim, not PoE.',
              'meraki.cisco.com for the exact MV datasheet.'
            ],
            href: 'https://meraki.cisco.com',
            linkLabel: 'Meraki MV docs',
            linkSub: 'meraki.cisco.com — MV cameras, dashboard',
            tags: ['meraki', 'mv', 'cisco meraki', 'cloud camera', 'commercial camera']
          },
          {
            brand: 'Teledyne FLIR', title: 'Elara / Saros / FC-series thermal',
            use: 'Thermal and visible perimeter cameras. Elara / Saros / FC. Different animal than a 4 MP turret in a hallway.',
            look: 'Thermal vs visible lens. PoE vs 24 VAC / 12 V. Heater. Analytics box.',
            gotchas: [
              'Thermal wants a stable mount and a real power budget. A 4 W af port will not run a heated FC-series.',
              'Analytics / VMS integration is a license. “No alarm” may be software, not a dead imager.',
              'flir.com / teledyneflir.com for the exact Elara / FC sheet.'
            ],
            href: 'https://www.flir.com',
            linkLabel: 'FLIR / Teledyne security cameras',
            linkSub: 'flir.com — Elara, Saros, FC-series thermal',
            tags: ['flir', 'teledyne', 'elara', 'saros', 'thermal', 'fc-series', 'camera', 'commercial camera']
          },
          {
            brand: 'Network Optix', title: 'Nx Witness VMS',
            use: 'The VMS under DW Spectrum, Hanwha WAVE, and a pile of white-labels. Same client bones, different plugin/branding.',
            look: 'Nx / WAVE / Spectrum on the desktop. Server vs client version. Camera list.',
            gotchas: [
              'Client/server version mismatch is the classic “won’t connect.”',
              'A white-label (DW, WAVE) still wants that vendor’s camera plugin / device pack.',
              'networkoptix.com for Nx Witness admin docs.'
            ],
            href: 'https://www.networkoptix.com',
            linkLabel: 'Nx Witness docs',
            linkSub: 'networkoptix.com — Nx Witness; also DW Spectrum / WAVE',
            tags: ['nx witness', 'network optix', 'dw spectrum', 'wave', 'vms', 'commercial camera']
          },
          {
            brand: '3xLOGIC', title: 'VIGIL / VISIX cameras',
            use: 'VIGIL VMS / NVRs and VISIX cameras. Contractor and enterprise mix. Often next to access in the same closet.',
            look: 'VIGIL server SKU. VISIX model. Client version.',
            gotchas: [
              'VIGIL client vs server version. Same mismatch story as everyone else.',
              'PoE class vs IR. Same night-reboot story.',
              '3xlogic.com for VIGIL / VISIX.'
            ],
            href: 'https://www.3xlogic.com',
            linkLabel: '3xLOGIC VIGIL / VISIX',
            linkSub: '3xlogic.com — VIGIL, VISIX',
            tags: ['3xlogic', 'vigil', 'visix', 'camera', 'vms', 'nvr', 'commercial camera']
          },
          {
            brand: 'OpenEye', title: 'Web Services / recorders',
            use: 'OpenEye NVRs with a browser client (no thick client required on many boxes). Common in US commercial.',
            look: 'Recorder SKU. Web UI. Camera list. RAID / disk health.',
            gotchas: [
              'Browser to the box. A replaced IP / DNS looks like the whole site went dark.',
              'Disk SMART / RAID rebuilds kill recording before they kill live view. Check storage first.',
              'openeye.net for the exact recorder sheet.'
            ],
            href: 'https://www.openeye.net',
            linkLabel: 'OpenEye recorders / Web Services',
            linkSub: 'openeye.net — Web Services, recorders',
            tags: ['openeye', 'open eye', 'nvr', 'web services', 'commercial camera']
          },
          {
            brand: 'Siemens', title: 'Cerberus PRO / FireFinder XLS / FC922',
            use: 'Siemens / Cerberus fire. XLS is the big FireFinder. Cerberus PRO / FC-series is the current modular stack. Desigo CC on some campuses.',
            look: 'Panel type on the door. FC922 / FC924 / XLS. Periphery boards. Network nodes.',
            gotchas: [
              'You do not factory-default an XLS because a printer is offline.',
              'Desigo / Cerberus tools are licensed. A laptop with “a Siemens program” is not the right one.',
              'Siemens Building fire docs for that exact Cerberus / XLS CPU. Impairment process still applies.'
            ],
            href: 'https://www.siemens.com/global/en/products/buildings/fire.html',
            linkLabel: 'Siemens Cerberus / FireFinder docs',
            linkSub: 'siemens.com — Cerberus PRO, FireFinder XLS, FC922',
            tags: ['siemens', 'cerberus', 'firefinder', 'xls', 'fc922', 'fc924', 'desigo', 'facp', 'commercial fire']
          },
          {
            brand: 'Kidde / Fenwal', title: 'VS / VS4 / AEGIS suppression & fire',
            use: 'Kidde VS air-aspirating / intelligent fire and Fenwal / Kidde suppression panels. Server rooms, industrial, clean agent.',
            look: 'VS4 vs AEGIS vs Fenwal 732. Releasing circuits. Cylinder solenoid supervision. Abort / maintain switches.',
            gotchas: [
              'Releasing panels are not a burglar can. Do not jumper a solenoid “to stop the trouble.”',
              'Impairment / bottle-disconnect process is site SOP and often AHJ. Photograph, tag, follow it.',
              'kidde-fenwal.com for the exact VS / AEGIS / Fenwal sheet.'
            ],
            href: 'https://kidde-fenwal.com',
            linkLabel: 'Kidde / Fenwal docs',
            linkSub: 'kidde-fenwal.com — VS, VS4, AEGIS, Fenwal releasing',
            tags: ['kidde', 'fenwal', 'vs4', 'aegis', 'suppression', 'releasing', 'commercial fire']
          },
          {
            brand: 'Notifier / Honeywell Fire', title: 'NFS-320 / NFS2-320 / AFP-320',
            use: 'The smaller Notifier intelligent panel. One SLC. Everywhere in small commercial that is not a Fire-Lite ES-200X.',
            look: 'NFS-320 vs NFS2-320 on the door. SLC class. NAC. Battery size.',
            gotchas: [
              'CLIP vs FlashScan on that loop. Mixed protocol is a trouble, not a bad head.',
              'Impairment process still applies.',
              'buildings.honeywell.com/notifier for the exact 320 sheet.'
            ],
            href: 'https://buildings.honeywell.com/us/en/brands/our-brands/notifier',
            linkLabel: 'Notifier NFS-320 docs',
            linkSub: 'buildings.honeywell.com/notifier — NFS-320, NFS2-320',
            tags: ['nfs-320', 'nfs2-320', 'afp-320', 'notifier', 'facp', 'commercial fire']
          },
          {
            brand: 'Simplex / Johnson Controls', title: '4100U / 4010 / 4006 / 4008',
            use: 'The generation before 4100ES. 4100U is still a mountain of campus nodes. 4010 / 4006 / 4008 are the smaller cousins. Mapnet / IDNet vintage matters.',
            look: '4100U vs 4100ES on the door. Mapnet II vs IDNet. InfoAlarm vs 2x40. Network 4120.',
            gotchas: [
              'A 4100U programmer is not a 4100ES programmer. Bring the right software and the job file.',
              'Do not “upgrade a node” because a printer is offline.',
              'simplexfire.com/resources for 4100U / 4010 datasheets. Impairment still applies.'
            ],
            href: 'https://www.simplexfire.com/resources',
            linkLabel: 'Simplex 4100U / 4010 literature',
            linkSub: 'simplexfire.com/resources — 4100U, 4010, 4006',
            tags: ['4100u', '4010', '4006', '4008', 'simplex', 'mapnet', 'idnet', 'facp', 'commercial fire']
          },
          {
            brand: 'Fire-Lite / Honeywell Fire', title: 'MS-4 / MS-5UD / MS-10UD conventional',
            use: 'Small conventional FACPs. Five- and ten-zone with a DACT. Still the panel in a ton of retail and restaurants.',
            look: 'Zone LEDs. NAC. DACT RJ31X. Battery size. Dialer vs IP communicator add-on.',
            gotchas: [
              'Conventional zones want the listed EOL at the last device. A resistor in the can unsupervised the run.',
              'MS-5UD vs MS-9200UDLS is conventional vs addressable. Do not autoprogram a conventional can.',
              'firelite.com for the exact MS-5UD / MS-10UD sheet.'
            ],
            href: 'https://www.firelite.com',
            linkLabel: 'Fire-Lite MS-5UD / MS-10UD docs',
            linkSub: 'firelite.com — MS-4, MS-5UD, MS-10UD',
            tags: ['ms-5ud', 'ms-10ud', 'ms-4', 'ms5ud', 'conventional', 'fire-lite', 'facp', 'commercial fire']
          },
          {
            brand: 'Xtralis / Honeywell', title: 'VESDA aspirating smoke',
            use: 'Air-sampling detection. VESDA-E / VESDA LaserFocus / VLC. Pipes in the ceiling, detector in a closet. Data centers and warehouses.',
            look: 'Detector model. Pipe network. Filter. Display / VSC software. Flow readings.',
            gotchas: [
              'A high-flow or low-flow trouble is the pipe or filter, not a new detector, until you look.',
              'Do not “clean” by blowing the pipes backward into the detector. That is how you buy a detector.',
              'xtralis.com / Honeywell VESDA docs for the exact VESDA-E sheet.'
            ],
            href: 'https://www.xtralis.com',
            linkLabel: 'VESDA / Xtralis docs',
            linkSub: 'xtralis.com — VESDA-E, LaserFocus, VLC',
            tags: ['vesda', 'xtralis', 'aspirating', 'air sampling', 'vesda-e', 'commercial fire']
          },
          {
            brand: 'Hochiki', title: 'FireNET / FireNET Plus',
            use: 'Hochiki intelligent fire. FireNET and FireNET Plus panels, analog sensors. Common where the spec was not Notifier/Simplex/EST.',
            look: 'FireNET vs Plus on the door. SLC. NAC. Loop cards.',
            gotchas: [
              'Hochiki protocol is not CLIP and not FlashScan. Bring Hochiki heads to a Hochiki loop.',
              'Impairment process still applies.',
              'hochiki.com / hochikiamerica.com for FireNET docs.'
            ],
            href: 'https://www.hochiki.com',
            linkLabel: 'Hochiki FireNET docs',
            linkSub: 'hochiki.com — FireNET, FireNET Plus',
            tags: ['hochiki', 'firenet', 'firenet plus', 'facp', 'commercial fire']
          },
          {
            brand: 'Fike', title: 'Cheetah Xi / CyberCat suppression',
            use: 'Fike intelligent fire and releasing. Cheetah Xi / CyberCat. Clean agent and preaction jobs.',
            look: 'Cheetah vs CyberCat on the door. Releasing circuits. Abort. Cylinder supervision.',
            gotchas: [
              'Releasing: do not jumper solenoids to clear a trouble.',
              'Impairment / bottle process is SOP. Photograph, tag, follow it.',
              'fike.com for Cheetah Xi / CyberCat manuals.'
            ],
            href: 'https://www.fike.com',
            linkLabel: 'Fike Cheetah / CyberCat docs',
            linkSub: 'fike.com — Cheetah Xi, CyberCat',
            tags: ['fike', 'cheetah', 'cheetah xi', 'cybercat', 'suppression', 'releasing', 'commercial fire']
          },
          {
            brand: 'STI', title: 'Stopper II / pull covers / Mini Stopper',
            use: 'The plastic cover over the pull that is supposed to stop false alarms. Stopper II, Mini Stopper, horn/strobe damage stoppers.',
            look: 'Cover vs labeled pull. Indoor vs weather. Horn in the cover on some models.',
            gotchas: [
              'A Stopper that does not latch will false the pull. Hinge pins and weather kits matter.',
              'AHJ may not allow a cover on every pull. Listed use only — do not invent a cover on a stair that forbids it.',
              'sti-usa.com for Stopper II install.'
            ],
            href: 'https://www.sti-usa.com/',
            linkLabel: 'STI Stopper II docs',
            linkSub: 'sti-usa.com — Stopper II, Mini Stopper',
            tags: ['sti', 'stopper', 'stopper ii', 'pull cover', 'false alarm', 'commercial fire']
          },
          {
            brand: 'Honeywell / Resideo', title: 'PROA7PLUS / ProSeries',
            use: 'The current Resideo residential / light-commercial touch panel. Replaces a pile of LYNX and some VISTA-with-a-Tuxedo jobs. ProSeries takeovers are a different animal than a 20P.',
            look: 'PROA7 vs PROA7PLUS on the back. PROWIFI / PROLTE modules. PROSIXPIR / SIXFOB peripherals. Transformer.',
            gotchas: [
              'This is not a VISTA. Programming is AlarmNet 360 / the panel UI, not *20.',
              'SIX sensors are encrypted to that panel. A leftover 5800 from the VISTA will not enroll unless the sheet says so.',
              'resideo.com Pro — PROA7PLUS product page / ProSeries docs.'
            ],
            href: 'https://www.resideo.com/us/en/pro/products/security/',
            linkLabel: 'Resideo ProSeries / PROA7',
            linkSub: 'resideo.com Pro — PROA7PLUS, ProSeries, SIX sensors',
            tags: ['proa7', 'proa7plus', 'proseries', 'lynx', 'six', 'resideo', 'intrusion']
          },
          {
            brand: 'Qolsys', title: 'IQ Panel 4 / IQ Hub',
            use: 'Alarm.com panel. IQ4 is the current touch panel. PowerG wireless, PowerG+ on newer. Huge contractor takeover base.',
            look: 'IQ Panel 4 vs IQ Hub vs IQ2. PowerG vs 319.5 vs 345 daughter cards. Transformer / battery.',
            gotchas: [
              'Frequency daughter card has to match the sensors. A 319.5 IQ will not hear 345 Honeywell PIRs.',
              'Alarm.com dealer site is the brain for comms. A panel with no path is a SIM / registration job, not a new panel, until you look.',
              'qolsys.com for IQ Panel 4 install.'
            ],
            href: 'https://www.qolsys.com',
            linkLabel: 'Qolsys IQ Panel 4 docs',
            linkSub: 'qolsys.com — IQ Panel 4, IQ Hub, PowerG',
            tags: ['qolsys', 'iq panel', 'iq4', 'iq panel 4', 'powerg', 'alarm.com', 'intrusion']
          },
          {
            brand: 'Interlogix / UTC', title: 'NetworX NX-8E / Concord 4 / Simon',
            use: 'The other beige panel that got orphaned when Interlogix wound down. NX-4/6/8/8E and Concord are still in a mountain of closets. SuperBus / data bus.',
            look: 'NX-8E vs Concord vs Simon on the door. SuperBus devices. NX-588E wireless. Transformer.',
            gotchas: [
              'Interlogix is not selling you a new NX-8E. Takeover path is usually an LTEM-P with PRODCM or a new panel. Do not promise a factory replacement board.',
              'SuperBus length and star wiring cause keypad trouble. Same as any keypad bus.',
              'Docs are archived — hunt the exact NX / Concord install PDF. LTEM-P takeover sheet is current.'
            ],
            href: 'https://www.resideo.com/us/en/pro/solutions/security/ltem-p-communicator/',
            linkLabel: 'LTEM-P takeover (NX / Concord path)',
            linkSub: 'Resideo LTEM-P docs cover NX-4/6/8/8E takeover; hunt archived NX/Concord PDFs for programming',
            tags: ['interlogix', 'nx-8e', 'nx8e', 'concord', 'simon', 'superbus', 'utc', 'intrusion']
          },
          {
            brand: 'ELK', title: 'M1 Gold / M1EZ8',
            use: 'The integrator panel. Lighting, access, HVAC rules, and burglar in one can. RP software. Still a cult favorite on custom jobs.',
            look: 'M1 Gold vs EZ8. Data bus (M1KP keypads, M1XIN expanders). M1XEP ethernet. 12 V / 16.5 VAC.',
            gotchas: [
              'ELK RP is how you program this. A keypad * installer code will not give you the lighting rules.',
              'Bus devices need unique addresses. Two M1XIN on one address is a haunted house.',
              'elkproducts.com for M1 Gold / EZ8 manuals.'
            ],
            href: 'https://www.elkproducts.com',
            linkLabel: 'ELK M1 docs',
            linkSub: 'elkproducts.com — M1 Gold, M1EZ8, RP',
            tags: ['elk', 'm1', 'm1 gold', 'm1ez8', 'elk rp', 'intrusion']
          },
          {
            brand: '2GIG / Nice', title: 'GC3e / GC2 / Edge',
            use: '2GIG panels. GC2 is the old one. GC3e / Edge is current. Alarm.com path on most. 345 MHz vs encrypted depending on vintage.',
            look: 'GC2 vs GC3 vs Edge on the back. Cell module. Transformer. 345 sensors vs eSeries.',
            gotchas: [
              'eSeries encrypted sensors will not talk to a vanilla GC2. Match the sensor generation to the panel.',
              'Alarm.com registration is the communicator story. A panel with bars and no path is a module / SIM job.',
              '2gig.com for GC3e / Edge install.'
            ],
            href: 'https://www.2gig.com',
            linkLabel: '2GIG GC3e / Edge docs',
            linkSub: '2gig.com — GC2, GC3e, Edge',
            tags: ['2gig', 'gc3', 'gc3e', 'gc2', 'edge', 'alarm.com', 'intrusion']
          },
          {
            brand: 'Honeywell Commercial', title: 'Galaxy Dimension / Galaxy Flex / G3',
            use: 'Honeywell commercial intrusion (the UK/EU Galaxy line that also landed in US commercial). Dimension / Flex / G3. Not a VISTA.',
            look: 'Dimension vs Flex on the door. RIO expanders. Telecom / Ethernet modules. Keypads.',
            gotchas: [
              'Galaxy is not *20. Downloader / local keypad programming is Galaxy. Bring the Galaxy manual.',
              'RIO addressing. Two RIOs on one address is the classic.',
              'Honeywell commercial security docs for Dimension / Flex.'
            ],
            href: 'https://buildings.honeywell.com/us/en/brands/our-brands/security',
            linkLabel: 'Honeywell Galaxy docs',
            linkSub: 'buildings.honeywell.com — Galaxy Dimension, Flex, G3',
            tags: ['galaxy', 'galaxy dimension', 'galaxy flex', 'g3', 'honeywell commercial', 'intrusion']
          },
          {
            brand: 'Paradox', title: 'EVO192 / Magellan / Spectra',
            use: 'Paradox intrusion. EVO is the commercial bus panel. Magellan wireless. Spectra is the smaller cousin. Common on import / integrator jobs.',
            look: 'EVO192 vs Magellan vs Spectra. BabyWare / Insite Gold. BUS expanders. RTX3 wireless.',
            gotchas: [
              'BabyWare is the tool. A Vista-style keypad punch will not give you EVO modules.',
              'BUS length and star wiring. Same keypad-bus ghosts as everyone else.',
              'paradox.com for EVO192 / Magellan manuals.'
            ],
            href: 'https://www.paradox.com',
            linkLabel: 'Paradox EVO / Magellan docs',
            linkSub: 'paradox.com — EVO192, Magellan, Spectra, BabyWare',
            tags: ['paradox', 'evo192', 'evo', 'magellan', 'spectra', 'babyware', 'intrusion']
          },
          {
            brand: 'Telguard', title: 'TG-7 / TG-1 / TG-4 communicators',
            use: 'Cellular communicators that sit next to a panel and seize a dialer or talk Contact ID / panel bus. TG-7FS is the fire one. Still a mountain of takeovers.',
            look: 'TG-7 vs TG-1 vs TG-4. Antenna. Own DC supply on many. Dialer-capture vs bus. Fire vs burg listing on the door.',
            gotchas: [
              'Fire-listed TG-7FS is not a burg TG-1. Do not swap them to “make it cheaper.”',
              'Antenna in a steel closet = one bar and a failed test. RSSI on the unit, photo it.',
              'telguard.com for the exact TG sheet. Power the communicator; starving it off keypad aux is a brownout.'
            ],
            href: 'https://www.telguard.com',
            linkLabel: 'Telguard TG communicator docs',
            linkSub: 'telguard.com — TG-7, TG-7FS, TG-1, TG-4',
            tags: ['telguard', 'tg-7', 'tg7', 'tg-1', 'tg-4', 'communicator', 'cell', 'fire communicator']
          },
          {
            brand: 'Alula', title: 'Connect+ / BAT-Fire / Universal takeovers',
            use: 'Takeover communicators and Connect+ panels. BAT-Fire is the fire communicator contractors use when the AHJ wants cell and the old DACT is dead.',
            look: 'BAT-Fire vs Connect+. Dialer capture vs panel bus. Antenna. Own supply.',
            gotchas: [
              'Fire listings on BAT-Fire are the point. A burg-only communicator on a FACP is an AHJ fail.',
              'Dialer-capture polarity and ring voltage. Confirm the sheet before you declare the FACP dialer dead.',
              'alula.com for BAT-Fire / Connect+ docs.'
            ],
            href: 'https://www.alula.com',
            linkLabel: 'Alula BAT-Fire / Connect+',
            linkSub: 'alula.com — BAT-Fire, Connect+, takeovers',
            tags: ['alula', 'bat-fire', 'batfire', 'connect+', 'communicator', 'fire communicator']
          },
          {
            brand: 'Verkada', title: 'Command + cameras (CD / CM / CF / D / I series)',
            use: 'Cloud cameras. The camera IS the NVR — onboard storage plus Command in the browser. No local client to “fix.” CD/CM/CF/D/I SKUs, fisheye, PTZ, and Command Connector for non-Verkada ONVIF.',
            look: 'Model on the belly. PoE class (many want at). Serial / claim QR. Status LED. MicroSD / onboard SSD is inside — you do not service it like a HDD bay.',
            gotchas: [
              'Claim the camera to Command BEFORE you hang it on a VLAN that cannot reach the internet. Footage recorded before claim is gone.',
              'A “dead” Verkada with link and PoE is usually license, site permission, or claim — not a bad imager. Org Admin vs Site Admin vs Site Viewer is the whole ticket.',
              'IR + analytics + cold start can want PoE+. An af-only switch = night reboot, same as everyone else. help.verkada.com for the exact CD/CM SKU.'
            ],
            href: 'https://help.verkada.com/verkada-cameras/getting-started/get-started-with-verkada-security-cameras',
            linkLabel: 'Verkada camera getting started',
            linkSub: 'help.verkada.com — Command claim, PoE, licensing',
            tags: ['verkada', 'command', 'cd52', 'cm41', 'cf81', 'd80', 'cloud camera', 'camera', 'commercial camera']
          },
          {
            brand: 'Verkada', title: 'Access controllers AC12 / AC41 / AC42 / AD readers',
            use: 'Cloud access. PoE controllers in the can, AD-series readers, doors configured in Command. AC12 is one door. AC41/AC42/AC62 are the multi-door cassettes.',
            look: 'Controller SKU. Cassette / door ports (lock, reader, DPI, REX). PoE class. Claim serial. AD32 / AD33 / AD34 readers.',
            gotchas: [
              'No WAN = no live admin. Cached credentials should still work until you prove they do not. Do not swap a controller because Command would not load on guest Wi-Fi.',
              'Lock outputs are a real current number. A maglock on a PoE door port brownouts the controller. Use listed lock power where the sheet says so.',
              'Fire-alarm release and free egress are still copper and listings. Command schedules do not replace a fire drop on a maglock opening.',
              'help.verkada.com — Access, configure a door, AC-series.'
            ],
            href: 'https://help.verkada.com/access-control/configuration/configure-a-door-in-command',
            linkLabel: 'Verkada Access — configure a door',
            linkSub: 'help.verkada.com — AC12, AC41, AC42, AD readers',
            tags: ['verkada access', 'ac12', 'ac41', 'ac42', 'ac62', 'ad32', 'ad34', 'cloud access', 'commercial access']
          },
          {
            brand: 'Verkada', title: 'Alarms / BP panels / wireless sensors + TD intercom',
            use: 'Verkada Alarms (BP-series style hubs, wireless contacts/PIRs) and TD-series intercoms. Same Command org as the cameras. Cellular backup on many alarm kits.',
            look: 'Alarm panel / hub SKU. Cell vs ethernet. Sensor enrollment in Command. TD53-class intercom PoE.',
            gotchas: [
              'Monitoring is Command + a monitoring partner, not AlarmNet. A “failed to test” is license, cell path, or site config — not a VISTA communicator harness.',
              'Wireless sensors are Verkada RF, not 5800 and not PowerG. Do not enroll a 5816 here.',
              'Intercom: PoE class, door release output current, and Command permissions. A “dead station” with PoE is often claim / site role.',
              'help.verkada.com — Alarms and Intercom sections.'
            ],
            href: 'https://help.verkada.com',
            linkLabel: 'Verkada Help (Alarms / Intercom)',
            linkSub: 'help.verkada.com — Alarms, BP hubs, TD intercoms',
            tags: ['verkada alarms', 'verkada intercom', 'td53', 'bp52', 'command alarms', 'intercom', 'intrusion']
          },
          {
            brand: 'Bosch', title: 'FPA-1000 / FPA-5000 / Modular fire',
            use: 'Bosch addressable fire. FPA-1000 is the smaller US panel. FPA-5000 / Modular is the big networked one (FPA-5000, AVENAR in some markets). Not a B-series burglar can.',
            look: 'FPA-1000 vs 5000 on the door. LSN / LSN improved loop. NAC. Battery size. Remote keypad / panel controllers.',
            gotchas: [
              'Impairment / fire watch may be required before you disable LSN or NAC. Photograph, then follow site process.',
              'LSN devices are Bosch protocol. A System Sensor CLIP head will not poll. Do not megger the loop.',
              'RPS / FSP-5000-RPS is the tool. A laptop with “a Bosch program” is not automatically the fire one.',
              'boschsecurity.com datasheets for the exact FPA CPU. This app is orientation, not the panel manual.'
            ],
            href: 'https://www.boschsecurity.com/us/en/support/datasheets-and-documents/',
            linkLabel: 'Bosch FPA fire docs',
            linkSub: 'boschsecurity.com — FPA-1000, FPA-5000, Modular, LSN',
            tags: ['fpa-1000', 'fpa-5000', 'fpa1000', 'bosch fire', 'lsn', 'avenar', 'facp', 'commercial fire']
          },
          {
            brand: 'Bosch', title: 'BVMS / DIVAR IP / DIVAR recorders',
            use: 'Bosch video software and recorders. BVMS is the enterprise VMS. DIVAR IP is the NVR appliance. DIVAR analog / hybrid still in closets. Configuration Manager / Project Assistant for cameras.',
            look: 'DIVAR SKU on the face. BVMS operator vs config client. Camera CPP generation. License dongle / software license.',
            gotchas: [
              'Operator Client vs Config Client. The guard PC with Operator will not let you add a camera.',
              'License after a motherboard swap: the box looks empty until you re-host. Photograph the license before you image a drive.',
              'Camera firmware vs BVMS version — an old CPP4 on a new BVMS can sit “offline” with a green link.',
              'boschsecurity.com — BVMS, DIVAR IP, Configuration Manager.'
            ],
            href: 'https://www.boschsecurity.com/us/en/support/datasheets-and-documents/',
            linkLabel: 'Bosch BVMS / DIVAR docs',
            linkSub: 'boschsecurity.com — BVMS, DIVAR IP, DIVAR, Configuration Manager',
            tags: ['bvms', 'divar', 'divar ip', 'bosch vms', 'configuration manager', 'nvr', 'camera', 'commercial camera']
          },
          {
            brand: 'Bosch', title: 'RADION wireless / B810 receivers',
            use: 'Bosch wireless for B-series and some GV4. RADION devices, B810 / B810i receivers. Not 5800, not PowerG, not DSC.',
            look: 'B810 on the bus (SDI2). RADION PIR / contact / smoke. RF LED. House code / enrollment.',
            gotchas: [
              'Receiver inside the metal can = supervision fail on every point. Same rule as a 5881. Mount it.',
              'SDI2 vs legacy SDI. A GV4 RADION story is not a B8512 story. Bring the right receiver.',
              'Jam / RF noise next to a 2.4 GHz AP. Move one of them.',
              'boschsecurity.com — RADION, B810 install.'
            ],
            href: 'https://www.boschsecurity.com/us/en/support/datasheets-and-documents/',
            linkLabel: 'Bosch RADION / B810 docs',
            linkSub: 'boschsecurity.com — RADION wireless, B810 receiver',
            tags: ['radion', 'b810', 'bosch wireless', 'sdi2', 'intrusion']
          },
          {
            brand: 'Notifier / Honeywell Fire', title: 'NBG-12LX / NBG-12 pull stations',
            use: 'The dual-action pull on half the commercial buildings in the country. Addressable LX vs conventional. Stopper II often over it.',
            look: 'NBG-12 vs 12LX on the inside. Address (LX). Glass / plastic break rod. Key reset vs hex.',
            gotchas: [
              'Addressable LX is an SLC device. A leftover conventional 12 on a FlashScan loop will not poll.',
              'Key reset vs hex. The wrong key on a truck is a second trip.',
              'A Stopper that does not latch will false the pull. Hinge pins and weather kits matter.'
            ],
            href: 'https://buildings.honeywell.com/us/en/brands/our-brands/notifier',
            linkLabel: 'Notifier pull-station docs',
            linkSub: 'buildings.honeywell.com/notifier — NBG-12, NBG-12LX',
            tags: ['nbg-12', 'nbg-12lx', 'pull', 'pull station', 'notifier', 'commercial fire']
          },
          {
            brand: 'System Sensor', title: 'DNR / DNRW duct detectors',
            use: 'In-duct smoke. Sampling tubes, remote test, shutdown relay. The unit in the RTU that is always in trouble after a filter change.',
            look: 'DNR vs conventional duct. Tube length vs duct width. Exhaust vs supply orientation. Remote test station.',
            gotchas: [
              'Tubes have to match the duct width and face the airflow the sheet says. A 4-foot tube in an 8-foot duct is a trouble, not a new head.',
              'Shutdown relay vs supervisory. HVAC techs land it as a status and then nobody understands why the unit will not start.',
              'Cover gasket after a filter job. An unseated cover is a dirty / trouble in two weeks.'
            ],
            href: 'https://www.systemsensor.com',
            linkLabel: 'System Sensor DNR docs',
            linkSub: 'systemsensor.com — DNR, DNRW, sampling tubes',
            tags: ['dnr', 'dnrw', 'duct detector', 'system sensor', 'hvac shutdown', 'commercial fire']
          },
          {
            brand: 'Simplex / Johnson Controls', title: 'TrueAlert ES / 4906 / 49AV notification',
            use: 'Addressable NAC appliances on IDNAC. Candela and tone live in the panel, not a tap on the device the way a conventional Wheelock does.',
            look: '49xx model on the back. IDNAC vs conventional NAC. Candela set in software. Wall vs ceiling.',
            gotchas: [
              'You do not tap candela with a screwdriver on TrueAlert ES. The panel owns it. A “wrong candela” is programming.',
              'IDNAC polarity and Class A/B are on the 4100ES card. A conventional RSS on IDNAC will not play.',
              'Last-device voltage still matters. Addressable does not repeal Ohm.'
            ],
            href: 'https://www.simplexfire.com/resources',
            linkLabel: 'Simplex TrueAlert literature',
            linkSub: 'simplexfire.com/resources — TrueAlert ES, 4906, 49AV',
            tags: ['truealert', '4906', '49av', 'idnac', 'simplex', 'strobe', 'commercial fire']
          },
          {
            brand: 'Edwards / EST', title: 'SIGA / Signature detectors & modules',
            use: 'Signature analog heads and SIGA modules on EST3 / EST4 / iO. Mapping, personality, and the programmer are the job.',
            look: 'SIGA-PHS / HFS / IB on the head. Module personality. Loop card type. Mapping vs QuickStart vintage.',
            gotchas: [
              'Personality on a SIGA module is not a CLIP address. Wrong personality = wrong device type, not a bad module.',
              'Do not mix Signature and conventional on one loop and hope.',
              'SDU / FireWorks / the current EST tool — a leftover laptop from EST2 will not talk EST4.'
            ],
            href: 'https://www.edwardsfiresafety.com',
            linkLabel: 'Edwards Signature / SIGA docs',
            linkSub: 'edwardsfiresafety.com — SIGA, Signature, EST3/4',
            tags: ['siga', 'signature', 'est', 'edwards', 'siga-phs', 'commercial fire']
          },
          {
            brand: 'Potter', title: 'PAD100 / addressable modules',
            use: 'Potter addressable monitor / relay / isolator modules on IPA / AFC / PFC loops. The little beige boxes on the sprinkler riser.',
            look: 'PAD100-PD / RM / ZM. Address. EOL. Class A/B jumper.',
            gotchas: [
              'Flow / tampers on a PAD100 want the listed EOL at the device, not in the can.',
              'Address collisions after a “quick add.” Walk the map.',
              'pottersignal.com for the exact PAD100 sheet.'
            ],
            href: 'https://www.pottersignal.com',
            linkLabel: 'Potter PAD100 docs',
            linkSub: 'pottersignal.com — PAD100, IPA, AFC',
            tags: ['pad100', 'potter', 'addressable module', 'flow', 'tamper', 'commercial fire']
          },
          {
            brand: 'Space Age Electronics', title: 'SSU / elevator lobby / fan shutdown',
            use: 'The other beige can: elevator recall, hatch, shunt, fan shutdown. Relays and LEDs that the fire panel talks to and the elevator guy swears at.',
            look: 'SSU-series. 24 V. Fire-alarm inputs vs elevator outputs. LED legend on the door.',
            gotchas: [
              'Recall vs shunt vs hatch are different circuits. Landing “fire” on the wrong one is a failed inspection, not a bad relay.',
              'Elevator contractors will jumper it for a test. Look before you condemn the FACP.',
              '1sae.com for the exact SSU drawing.'
            ],
            href: 'https://www.1sae.com',
            linkLabel: 'Space Age Electronics docs',
            linkSub: '1sae.com — SSU, elevator lobby, fan shutdown',
            tags: ['space age', 'ssu', 'elevator recall', 'shunt', 'fan shutdown', 'commercial fire']
          },
          {
            brand: 'Avigilon / Motorola', title: 'ACM / Unity Access',
            use: 'Avigilon access (the ACM appliance / Unity Access). Often in the same closet as ACC / Unity video. Mercury-class or Avigilon boards depending on vintage.',
            look: 'ACM appliance vs Unity Access. Controller SKU. Reader ports. Video integration license.',
            gotchas: [
              'ACM vs Unity Access are generations. A laptop with the wrong client looks like every door died.',
              'Video-verified access is a license and a camera pair, not a reader swap.',
              'avigilon.com for ACM / Unity Access docs.'
            ],
            href: 'https://www.avigilon.com',
            linkLabel: 'Avigilon ACM / Unity Access',
            linkSub: 'avigilon.com — ACM, Unity Access',
            tags: ['avigilon acm', 'unity access', 'acm', 'access', 'commercial access']
          },
          {
            brand: 'Avigilon Alta / Openpath', title: 'Smart Reader / Core / Alta Cloud',
            use: 'Cloud access that used to say Openpath. Smart Readers, Core / Hub, mobile credentials. Now Avigilon Alta. The reader is the door controller.',
            look: 'Smart Reader on the mullion. PoE or 12 V. Cloud LED. Core in the closet on older jobs.',
            gotchas: [
              'No WAN = no live admin. Cached mobiles / cards should still work until you prove they do not.',
              'A maglock on reader power is a brownout. Use listed lock power.',
              'Alta vs Openpath apps. A rebranded site looks like “the app broke.” alta.avigilon.com / help.'
            ],
            href: 'https://www.avigilon.com/alta',
            linkLabel: 'Avigilon Alta / Openpath',
            linkSub: 'avigilon.com/alta — Smart Reader, Core, cloud',
            tags: ['openpath', 'alta', 'avigilon alta', 'smart reader', 'cloud access', 'commercial access']
          },
          {
            brand: 'Adams Rite / ASSA ABLOY', title: '7100 / 7400 / 6500 electric strikes & exit',
            use: 'Aluminum-storefront strikes and latches. 7100/7400 in the frame, 6500-class latches in the stile. The glass door that never latches after a summer of sun.',
            look: 'Faceplate. 12/24. Fail-safe vs fail-secure kit. Latch vs strike in the stile.',
            gotchas: [
              'Preload from a warped aluminum door will buzz a healthy 7100 to death. Fix the door.',
              'Centerline vs offset. A 7100 in a 7400 hole is not a flex.',
              'adamsrite.com for the exact 7100 / 7400 sheet.'
            ],
            href: 'https://www.adamsrite.com',
            linkLabel: 'Adams Rite strike / latch docs',
            linkSub: 'adamsrite.com — 7100, 7400, 6500',
            tags: ['adams rite', '7100', '7400', '6500', 'storefront', 'strike', 'commercial access']
          },
          {
            brand: 'SARGENT / ASSA ABLOY', title: '80-series electrified exit / mortise',
            use: 'SARGENT 80-series panic and 8200 mortise. EL/EU, RX, motor kits. The other rail when it is not Von Duprin.',
            look: '80 vs 90 on the rail. 12/24. RX vs LX. Power transfer.',
            gotchas: [
              'EL vs EU is fail-secure vs fail-safe. Same trap as Schlage. Read the solenoid.',
              'Inrush on motorized 80-series is not a 500 mA ACM output.',
              'sargentlock.com / ASSA for the exact 80-series sheet.'
            ],
            href: 'https://www.sargentlock.com',
            linkLabel: 'SARGENT 80-series docs',
            linkSub: 'sargentlock.com — 80-series, 8200, EL/EU',
            tags: ['sargent', '80 series', '8200', 'electrified exit', 'mortise', 'commercial access']
          },
          {
            brand: 'Yale / ASSA ABLOY', title: 'nexTouch / 6100 / 7100 electrified',
            use: 'Yale cylindrical and mortise electrified, plus nexTouch keypad cylindricals. Interior offices and multi-family.',
            look: 'nexTouch vs 6100 mortise. Battery vs hardwired. 12/24. Handing.',
            gotchas: [
              'nexTouch dead is batteries until proven otherwise. Same as Trilogy.',
              'Handing and latch length are hardware. A bound latch looks like “it will not unlock.”',
              'yalehome.com / commercial Yale docs for nexTouch / 6100.'
            ],
            href: 'https://www.yalehome.com',
            linkLabel: 'Yale nexTouch / electrified docs',
            linkSub: 'yalehome.com — nexTouch, 6100, 7100',
            tags: ['yale', 'nextouch', '6100', '7100', 'cylindrical', 'commercial access']
          },
          {
            brand: 'DynaLock', title: '3000 / 2011 maglocks & delays',
            use: 'The other maglock house. 3000-series mags, delayed egress, 2011-class. Common when the spec was not Securitron or RCI.',
            look: 'Voltage on the pigtail. Bond sensor. Delayed-egress board. 12/24.',
            gotchas: [
              'Same 12 vs 24 trap. Check the pigtail before the ACM.',
              'Delayed egress: fire drop is immediate. Signage is an AHJ item.',
              'dynalock.com for the exact 3000 / 2011 sheet.'
            ],
            href: 'https://www.dynalock.com',
            linkLabel: 'DynaLock maglock docs',
            linkSub: 'dynalock.com — 3000, 2011, delayed egress',
            tags: ['dynalock', '3000', '2011', 'maglock', 'delayed egress', 'commercial access']
          },
          {
            brand: 'Trine', title: '3478 / 3234 / 4100 electric strikes',
            use: 'The value strike in a lot of aluminum and wood frames. 3478 is the workhorse. Dual voltage, fail-safe / fail-secure kits.',
            look: 'Faceplate. 12/24. Keeper orientation. Lip length.',
            gotchas: [
              'Preload kills these just like a 1006. Fix the door.',
              'Lip length vs frame. A 3478 in a deep frame that needed a 4100 will never latch clean.',
              'trineonline.com for the exact 3478 / 3234 sheet.'
            ],
            href: 'https://www.trineonline.com',
            linkLabel: 'Trine strike docs',
            linkSub: 'trineonline.com — 3478, 3234, 4100',
            tags: ['trine', '3478', '3234', '4100', 'strike', 'commercial access']
          },
          {
            brand: 'Securitron / ASSA ABLOY', title: 'BPS / AQD power + TSB Touch Sense',
            use: 'BPS-24 / AQD lock power, and the TSB Touch Sense Bar that is a REX without a PIR. Very common on maglock openings.',
            look: 'BPS voltage select. Fire-alarm trigger. TSB on the rail, 12/24, output to the controller REX.',
            gotchas: [
              'TSB is a REX, not lock power. Wire it to the controller REX input, not across the mag coil, unless the drawing says so.',
              'AQD / BPS fire trigger polarity. Wrong and the doors never drop — or they never lock.',
              'securitron.com — BPS, AQD, TSB.'
            ],
            href: 'https://www.securitron.com',
            linkLabel: 'Securitron BPS / TSB docs',
            linkSub: 'securitron.com — BPS-24, AQD, TSB Touch Sense',
            tags: ['bps', 'aqd', 'tsb', 'touch sense', 'securitron', 'rex', 'lock power', 'commercial access']
          },
          {
            brand: 'Von Duprin / Allegion', title: 'EPT-2 / EPT-10 power transfer',
            use: 'The hinge-side transfer that feeds QEL / EL without a door loop. EPT-2 vs EPT-10 current. Fire-listed when the opening is.',
            look: 'EPT in the frame/hinge edge. Wire count. 24 V typical. Fire label.',
            gotchas: [
              'EPT-2 is not an EPT-10. QEL inrush on an EPT-2 is a melted transfer and a callback.',
              'Door loops vs EPT: loops fail on fire-listed openings that required an EPT. Look at the listing.',
              'allegion.com Von Duprin — EPT-2, EPT-10.'
            ],
            href: 'https://us.allegion.com/en/home/products/brands/von-duprin.html',
            linkLabel: 'Von Duprin EPT docs',
            linkSub: 'allegion.com — EPT-2, EPT-10 power transfer',
            tags: ['ept', 'ept-10', 'ept-2', 'power transfer', 'von duprin', 'qel', 'commercial access']
          },
          {
            brand: 'Inner Range', title: 'Integriti / Inception / Concept',
            use: 'Australian-origin access / intrusion that shows up in US industrial and campuses. Integriti is current. Concept is the old one. Inception is the smaller web panel.',
            look: 'LAN modules. Reader ports. RS-485. Integriti software vs Inception web.',
            gotchas: [
              'Concept vs Integriti are not the same download. Bring the right tool.',
              'LAN module addressing. Two modules on one address is a haunted bus.',
              'innerrange.com for Integriti / Inception docs.'
            ],
            href: 'https://www.innerrange.com',
            linkLabel: 'Inner Range Integriti / Inception',
            linkSub: 'innerrange.com — Integriti, Inception, Concept',
            tags: ['inner range', 'integriti', 'inception', 'concept', 'access', 'commercial access']
          },
          {
            brand: 'ZKTeco', title: 'inBio / Atlas / BioPro',
            use: 'Biometric and card panels. inBio in the can, Atlas cloud/web, BioPro software. Common on small commercial and multi-tenant.',
            look: 'inBio 160/260/460. 12 V. Reader ports vs onboard FP. Network.',
            gotchas: [
              'Default IP / password on the label. Change them.',
              'Fingerprint vs card vs both is programming. A “dead reader” is often a matching-threshold, not a new sensor.',
              'zkteco.com for inBio / Atlas install.'
            ],
            href: 'https://www.zkteco.com',
            linkLabel: 'ZKTeco inBio / Atlas docs',
            linkSub: 'zkteco.com — inBio, Atlas, BioPro',
            tags: ['zkteco', 'inbio', 'atlas', 'biopro', 'fingerprint', 'access', 'commercial access']
          },
          {
            brand: 'Keri Systems', title: 'NXT / Doors.NET / NXT-4x4',
            use: 'Keri access. NXT controllers, Doors.NET software. Still in a lot of schools and offices that never left it.',
            look: 'NXT-4x4 / 2x2 in the can. 12 V. Reader ports. Network vs old serial.',
            gotchas: [
              'Doors.NET vs old Doors32. A replaced PC with the wrong generation looks like every badge died.',
              'NXT addressing and downstream. Same RS-485 rules as everyone else.',
              'kerisys.com for NXT / Doors.NET.'
            ],
            href: 'https://www.kerisys.com',
            linkLabel: 'Keri NXT / Doors.NET docs',
            linkSub: 'kerisys.com — NXT-4x4, Doors.NET',
            tags: ['keri', 'nxt', 'doors.net', 'nxt-4x4', 'access', 'commercial access']
          },
          {
            brand: 'AWID', title: 'KP-6840 / LR-2000 / proximity readers',
            use: 'The other Prox. KP-6840 keypad/reader, LR-2000 long-range. Wiegand. Common where HID was “too much money this week.”',
            look: 'Model on the back. 5–16 V. Wiegand pigtail. Range jumper on LR.',
            gotchas: [
              'AWID Prox is not HID Prox. A corporate badge that works on Signo will not read an AWID head unless it is dual-tech.',
              'LR-2000 wants a clean view and a listed mount. A reader stuffed in a mullion is not long-range.',
              'awid.com for KP-6840 / LR-2000 sheets.'
            ],
            href: 'https://www.awid.com',
            linkLabel: 'AWID reader docs',
            linkSub: 'awid.com — KP-6840, LR-2000, Prox',
            tags: ['awid', 'kp-6840', 'lr-2000', 'prox', 'reader', 'commercial access']
          },
          {
            brand: 'ButterflyMX', title: 'Video intercom / cloud access',
            use: 'Cloud video intercom on multi-family. Panel on the entry, app for residents, door release on a relay. Contractors hit it on takeovers constantly.',
            look: 'Panel SKU. PoE. Relay to the strike / mag. Cloud LED. Tenant app vs property app.',
            gotchas: [
              'No WAN = no directory. Cached unlocks vary by firmware. Prove the path before you swap the panel.',
              'Strike power is not the panel. Brownout on a mag hung off PoE is the same story as everyone else.',
              'butterflymx.com support for the exact panel.'
            ],
            href: 'https://www.butterflymx.com',
            linkLabel: 'ButterflyMX support',
            linkSub: 'butterflymx.com — video intercom, cloud access',
            tags: ['butterflymx', 'butterfly mx', 'intercom', 'multifamily', 'cloud access', 'commercial access']
          },
          {
            brand: 'Rhombus', title: 'R-series cameras / Console',
            use: 'Cloud cameras. Console in the browser, onboard storage, similar pitch to Verkada/Meraki. PoE, claim, license.',
            look: 'R-series model. PoE class. Serial / claim. Console org.',
            gotchas: [
              'Claim / license / org permissions — same order as Verkada. A healthy PoE light is not “it is recording for you.”',
              'PoE class vs IR. Night reboot on af-only switches.',
              'rhombus.com / console help for the exact R-series sheet.'
            ],
            href: 'https://www.rhombus.com',
            linkLabel: 'Rhombus camera / Console',
            linkSub: 'rhombus.com — R-series, Console',
            tags: ['rhombus', 'r-series', 'cloud camera', 'console', 'camera', 'commercial camera']
          },
          {
            brand: 'Eagle Eye Networks', title: 'Cloud VMS / bridges',
            use: 'Cloud VMS. A bridge / CMVR on site talks to Eagle Eye cloud. Cameras can be almost anything ONVIF. The “NVR” is not a local client.',
            look: 'Bridge SKU. WAN. Camera list in Eagle Eye. ONVIF credentials.',
            gotchas: [
              'Bridge offline = no history in the cloud, local buffer depending on SKU. Do not format a camera SD because the cloud tab spun.',
              'ONVIF user on the camera has to match what the bridge was given. A password rotation on 40 cams looks like a mass death.',
              'een.com for bridge / cloud docs.'
            ],
            href: 'https://www.een.com',
            linkLabel: 'Eagle Eye Networks docs',
            linkSub: 'een.com — cloud VMS, bridges, CMVR',
            tags: ['eagle eye', 'een', 'cmvr', 'bridge', 'cloud vms', 'nvr', 'commercial camera']
          },
          {
            brand: 'LTS', title: 'CMIP / PTIP cameras + NVRs',
            use: 'Contractor IP line (LTS / LT Security). NVRs with PoE, CMIP turrets, PTIP PTZ. Lots of small commercial.',
            look: 'CMIP / PTIP on the gimbal. NVR PoE ports vs channels. Default IP.',
            gotchas: [
              'Activation / password on current firmware. A “dead” camera is often not activated.',
              'Channel count is not PoE-port count. Same as INVID.',
              'ltsecurityinc.com for the exact CMIP / NVR sheet.'
            ],
            href: 'https://www.ltsecurityinc.com',
            linkLabel: 'LTS support / downloads',
            linkSub: 'ltsecurityinc.com — CMIP, PTIP, NVRs',
            tags: ['lts', 'cmip', 'ptip', 'lt security', 'camera', 'nvr', 'commercial camera']
          },
          {
            brand: 'Hanwha Vision', title: 'Wisenet WAVE NVR / SSM',
            use: 'WAVE is the Nx-based VMS Hanwha ships. SSM is the older Hanwha VMS. Cameras are P/Q/X; the server is a different animal.',
            look: 'WAVE vs SSM on the desktop. Server vs client version. Camera plugin.',
            gotchas: [
              'WAVE client newer than server (or reverse) is a “won’t connect” ticket. Same as DW Spectrum.',
              'SSM vs WAVE are not interchangeable. A replaced NVR with the other client looks empty.',
              'hanwhavision.com — Wisenet WAVE, SSM.'
            ],
            href: 'https://www.hanwhavision.com',
            linkLabel: 'Hanwha WAVE / SSM docs',
            linkSub: 'hanwhavision.com — Wisenet WAVE, SSM',
            tags: ['wisenet wave', 'wave', 'ssm', 'hanwha', 'nvr', 'vms', 'commercial camera']
          },
          {
            brand: 'Genetec', title: 'Security Center video / Omnicast',
            use: 'The video half of Security Center. Omnicast is the old name still on buildings. Archiver vs Directory vs Auxiliary. Not just Synergis.',
            look: 'Security Center vs Omnicast client. Archiver server. Camera connection (unit vs archiver).',
            gotchas: [
              'Directory vs Archiver. A camera “offline” with ping is often the Archiver service, not the cam.',
              'License / MAC after a motherboard swap. Photograph it before you image a drive.',
              'genetec.com — Security Center, Omnicast, Archiver.'
            ],
            href: 'https://www.genetec.com',
            linkLabel: 'Genetec Security Center video',
            linkSub: 'genetec.com — Security Center, Omnicast, Archiver',
            tags: ['genetec video', 'omnicast', 'security center', 'archiver', 'vms', 'commercial camera']
          },
          {
            brand: 'Alarm.com', title: 'ADC modules / takeovers / cameras',
            use: 'The cloud behind a pile of Qolsys, 2GIG, DSC, and Interlogix jobs. ADC communicator, ADC cameras, emPower Z-Wave. The panel is local; the path is Alarm.com.',
            look: 'Module SKU (ADC-SEM, image sensor, etc.). Cell vs broadband. Panel type. Alarm.com dealer site.',
            gotchas: [
              'A panel with bars and no path is a SIM / registration / dealer-site job, not a new board, until you look.',
              'Image sensors and ADC cameras are Alarm.com, not the panel brand. Wrong VLAN still wins.',
              'alarm.com / dealer support for the exact module. We do not publish dealer credentials.'
            ],
            href: 'https://www.alarm.com',
            linkLabel: 'Alarm.com support',
            linkSub: 'alarm.com — ADC modules, takeovers, cameras',
            tags: ['alarm.com', 'alarmcom', 'adc', 'qolsys', '2gig', 'takeover', 'communicator']
          },
          {
            brand: 'Napco', title: 'StarLink communicators',
            use: 'Napco’s radio. StarLink fire vs burg. Sits next to Gemini / NAPCO panels and also takeover jobs. Own supply, own antenna.',
            look: 'StarLink fire vs burg listing on the door. Antenna. DC in. Dialer vs bus.',
            gotchas: [
              'Fire-listed StarLink on a FACP. A burg radio on fire is an AHJ fail.',
              'Antenna in the can = failed test. RSSI, photograph, move it.',
              'napcosecurity.com — StarLink fire / burg.'
            ],
            href: 'https://www.napcosecurity.com',
            linkLabel: 'Napco StarLink docs',
            linkSub: 'napcosecurity.com — StarLink communicators',
            tags: ['starlink', 'napco starlink', 'communicator', 'fire communicator']
          },
          {
            brand: 'Uplink', title: 'LTE communicators / takeovers',
            use: 'Uplink radios on takeovers and FACPs. Dialer capture and panel-bus flavors. Another can in the copper closet with its own antenna.',
            look: 'Model / listing (fire vs burg). Antenna. Own DC. Capture vs bus.',
            gotchas: [
              'Listing on the door vs the panel it is talking to. Same fire/burg trap as Telguard.',
              'Capture polarity and ring voltage. Confirm the sheet before you declare the DACT dead.',
              'uplink.com for the exact LTE sheet.'
            ],
            href: 'https://www.uplink.com',
            linkLabel: 'Uplink communicator docs',
            linkSub: 'uplink.com — LTE, takeovers, fire communicators',
            tags: ['uplink', 'lte', 'communicator', 'takeover', 'fire communicator']
          },
          {
            brand: 'RISCO', title: 'LightSYS / ProSYS / Agility',
            use: 'European-origin intrusion that shows up on US integrator and import jobs. LightSYS 2 is the common one. Wireless + bus.',
            look: 'LightSYS vs ProSYS vs Agility. Bus expanders. Wireless receiver. Configuration software.',
            gotchas: [
              'Configuration software is not *20. Bring the RISCO tool.',
              'Bus length and star wiring. Same keypad-bus ghosts as everyone else.',
              'riscogroup.com for LightSYS / ProSYS manuals.'
            ],
            href: 'https://www.riscogroup.com',
            linkLabel: 'RISCO LightSYS / ProSYS docs',
            linkSub: 'riscogroup.com — LightSYS, ProSYS, Agility',
            tags: ['risco', 'lightsys', 'prosys', 'agility', 'intrusion']
          },
          {
            brand: 'Vanderbilt', title: 'SPC / ACT365 / ACTpro',
            use: 'Vanderbilt (ex-Siemens / PAC / Inner Range-adjacent in some markets). SPC intrusion, ACT365 / ACTpro access. Common on export and some US campuses.',
            look: 'SPC panel vs ACT access. Keypads. Expanders. Ethernet.',
            gotchas: [
              'SPC is not a VISTA and not a B-series. Bring Vanderbilt / SPC docs.',
              'ACT365 cloud vs ACTpro on-prem. A replaced PC with the other client looks empty.',
              'vanderbiltindustries.com for SPC / ACT.'
            ],
            href: 'https://www.vanderbiltindustries.com',
            linkLabel: 'Vanderbilt SPC / ACT docs',
            linkSub: 'vanderbiltindustries.com — SPC, ACT365, ACTpro',
            tags: ['vanderbilt', 'spc', 'act365', 'actpro', 'intrusion', 'access']
          },
          {
            brand: 'Horton / Record', title: 'Automatic sliding / swinging doors',
            use: 'The header over the vestibule. Horton, Record, Stanley, Besam-class operators. 120 VAC, sensors, breakout, fire-alarm disable.',
            look: 'Operator sticker in the header. 120 VAC. BEA / MS Sedco sensors. Fire-alarm input. Breakout.',
            gotchas: [
              'A door that “will not stay open” is often the presence sensor seeing the floor, not a dead motor.',
              'Fire-alarm disable and guide rails are listed. Random PIR over an ADA operator is not a Horton.',
              'hortondoors.com / record-usa.com for the exact operator. Bring the header sticker.'
            ],
            href: 'https://www.hortondoors.com',
            linkLabel: 'Horton automatic door docs',
            linkSub: 'hortondoors.com — also Record, Stanley, Besam headers',
            tags: ['horton', 'record', 'stanley', 'besam', 'auto door', 'sliding', 'ada', 'commercial access']
          },
          {
            brand: 'Alvarado / Fastlane', title: 'Turnstiles / SU / optical lanes',
            use: 'Optical turnstiles and waist-high. Alvarado SU-series, Fastlane, Boon Edam-class. Access control is an input; the lane has its own brain.',
            look: 'Lane controller in the pedestal. 24 V. Access-granted input vs fire-alarm drop. IR beams.',
            gotchas: [
              'Fire-alarm drop on a lane is life-safety. Do not jumper it for a “test.”',
              'Access-granted pulse width. A 50 ms reader pulse into a lane that wanted 1 s looks like “badge does nothing.”',
              'alvaradomfg.com / Fastlane docs for the exact lane.'
            ],
            href: 'https://www.alvaradomfg.com',
            linkLabel: 'Alvarado turnstile docs',
            linkSub: 'alvaradomfg.com — SU, optical lanes; Fastlane is a related optical product',
            tags: ['alvarado', 'fastlane', 'turnstile', 'optical lane', 'su-5000', 'commercial access']
          },
          {
            brand: 'MS Sedco', title: 'D96 / microwave / presence sensors',
            use: 'The other overhead sensor on auto doors (next to BEA). Microwave motion vs presence. Knowing-style actuators on some packages.',
            look: 'D96 / D99 in the header. 12/24. Width / sensitivity pots. Presence vs motion.',
            gotchas: [
              'Motion seeing the street = door that never rests. Presence seeing the floor = door that will not stay open. Aim it.',
              'ANSI / BHMA swing-door sensors are a listing. Random PIR is not an MS Sedco.',
              'mssedco.com for the exact D-series sheet.'
            ],
            href: 'https://www.mssedco.com',
            linkLabel: 'MS Sedco sensor docs',
            linkSub: 'mssedco.com — D96, microwave, presence',
            tags: ['ms sedco', 'sedco', 'd96', 'microwave', 'presence', 'auto door', 'commercial access']
          },
          {
            brand: 'Altronix', title: 'eFlow / VertiLine power',
            use: 'eFlow is the current Altronix access/fire-power platform. VertiLine is the rack. Fire-alarm disconnect, battery, PTC outputs.',
            look: 'eFlow SKU. Voltage select. FACP trigger. Battery leads. PTC vs fuse outputs.',
            gotchas: [
              'Measure the output before you land locks. Same 12/24 trap as AL400.',
              'FACP trigger polarity and NO/NC. Wrong and the doors never drop.',
              'altronix.com — eFlow, VertiLine install sheets.'
            ],
            href: 'https://www.altronix.com',
            linkLabel: 'Altronix eFlow docs',
            linkSub: 'altronix.com — eFlow, VertiLine',
            tags: ['eflow', 'vertiline', 'altronix', 'lock power', 'power']
          },
          {
            brand: 'DSC / JCI', title: 'PowerSeries Pro (HS3xxx)',
            use: 'The current DSC “Pro” panel above Neo. HS3128 / HS3032 class. Encrypted wireless, different modules than PC1864 and not the same as Neo HS2.',
            look: 'HS3 on the board. Corbus. HSM modules. Keypads. PowerSeries Pro installer manual — not a Neo memory.',
            gotchas: [
              'Pro is not Neo is not PowerSeries. Module part numbers and enrollment are different. Bring the Pro manual.',
              'Two pads on one address = haunted keys. Unique addresses.',
              'dsc.com — PowerSeries Pro install / programming.'
            ],
            href: 'https://www.dsc.com',
            linkLabel: 'DSC PowerSeries Pro docs',
            linkSub: 'dsc.com — HS3128, HS3032, PowerSeries Pro',
            tags: ['powerseries pro', 'hs3128', 'hs3032', 'dsc pro', 'neo', 'intrusion']
          }
        ]
      }
    ]
  };
})(window.__LAWSONITE_GUIDES__.pages);

(function (P) {
  function ts(id, icon, title, hub, lede, tags, sections, related) {
    P[id] = {
      id: id, icon: icon, kind: 'ts', eyebrow: 'Troubleshooting',
      title: title, hub: hub, lede: lede, tags: tags, sections: sections, related: related || []
    };
  }
  P['vista-128'] = {
    id: 'vista-128', icon: 'bell', kind: 'guide', eyebrow: 'Cheat sheet',
    title: 'VISTA-128 / 250 / FBPT field card',
    hub: 'Not a 20P. Partitions, V-Plex, ECP, 1361.',
    lede: 'When someone says “Vista 128” they usually mean a 128BPT (burg) or 128FBPT (fire/burg). Eight partitions, polling loop, ECP devices. If you land it like a 20P you will spend the afternoon chasing a keypad that never comes up.',
    tags: ['vista 128', 'vista-128', '128bpt', '128fbpt', '250bpt', 'v-plex', 'partition', '6160'],
    related: [
      { href: '/guides/manuals?q=vista%20128', label: '128 manuals' },
      { href: '/guides/keypad', label: 'Keypad addressing' },
      { href: '/guides/ecp-vplex', label: 'ECP vs V-Plex' },
      { href: '/guides/polling-trouble', label: 'Polling loop trouble' }
    ],
    sections: [
      { type: 'warn', text: 'FBPT is a fire/burg panel. Do not disable NAC or the fire bus to “clear a trouble” without an impairment process. BPT is burglary — still not a 20P.' },
      {
        type: 'table', title: 'Which 128 is this?',
        headers: ['Door says', 'Job', 'Transformer (typical)'],
        rows: [
          ['128BPT / 250BPT / SIA', 'Commercial burglary, 8 partitions', '1361 / 16.5 VAC 40 VA class — not the 20P 1321'],
          ['128FBPT / 32FBPT / 250FBPT', 'Commercial fire + burglary', 'See the FBPT sheet; fire listings apply'],
          ['VISTA-20P / 15P / 21iP', 'Residential / light commercial', 'Different can, different terminals, different menus']
        ]
      },
      {
        type: 'steps', title: 'First things that bite',
        items: [
          { text: 'Programming keypad must be a 6160-class alpha. A 6150 will leave you unable to run #93.', tip: 'Address the pad (1+3 at power-up), then enable that address in device programming. Address 31 is a known foot-gun.' },
          'ECP is the keypad / RF / 4204 / communicator bus. Polling loop (V-Plex) is a different, polarity-sensitive pair — often terminals called out separately on the 128 board. Do not swap them.',
          'Every ECP device needs a unique address AND to be enabled. A 5881 that is dipped but not in #93 does nothing.',
          'V-Plex devices (4101SN, 4208SN, 5193SN, VISTAKEY) live on the polling loop. Star wiring and T-taps make intermittent ghosts.',
          'Partitions: a zone that “won’t display” is often on partition 3 while you are standing at a partition 1 pad. GOTO (if enabled) or walk to the right pad.',
          'Document hunt: 800-06903 class install/setup for BPT; FBPT has its own R800- / 800-09617 class numbers. Match the revision date on the board.'
        ]
      },
      { type: 'tip', text: 'Search Field brain for “vista 128” — it should now hit this card and the product manuals. Open the Resideo literature for the exact SKU on the door.' }
    ]
  };

  P.keypad = {
    id: 'keypad', icon: 'bell', kind: 'cheat', eyebrow: 'Cheat sheet',
    title: 'Keypad addressing (Vista / DSC)',
    hub: 'Blank pad, wrong address, 1+3',
    lede: 'A keypad with 13 volts and no bars is usually address, data, or it was never enabled — not a new pad.',
    tags: ['6160', 'keypad', 'address', 'ecp', 'hs2lcd', '1 and 3'],
    related: [{ href: '/guides/keypad-blank', label: 'Blank keypad tree' }, { href: '/guides/vista-128', label: 'Vista 128' }, { href: '/guides/manuals?q=6160', label: '6160 card' }],
    sections: [
      {
        type: 'steps', title: 'Honeywell / Resideo 6160-class (ECP)',
        items: [
          'Power the pad. Within about 30 seconds, press and hold 1 and 3 together.',
          'Display should show an address (often “CON ADDRESS = 00”). Enter the two-digit address you want.',
          'Press * to save. Then in the panel, enable that same address in device programming (#93 on a 128, *93 / device fields on a 20P).',
          'Do not use address 31 on these buses. It fights other devices.',
          '6160RF includes a receiver. Do not also hang a 5881 on the same address.'
        ]
      },
      {
        type: 'steps', title: 'DSC PowerSeries / Neo',
        items: [
          'Old PowerSeries keypads: enroll on the keybus per the PC-board manual (often *8 installer, then module enrollment).',
          'Neo HS2 pads enroll differently — use the Neo installer manual, not a PC1864 memory.',
          'Two pads on one address = random missing keys and ghost troubles. Unique addresses, always.'
        ]
      },
      { type: 'note', text: 'Installer programming codes are in the official manual for that panel revision. We do not publish factory-default code lists.' }
    ]
  };

  P['wireless-5800'] = {
    id: 'wireless-5800', icon: 'zap', kind: 'cheat', eyebrow: 'Cheat sheet',
    title: '5800 wireless (VISTA)',
    hub: 'Serials, loops, supervision, jam',
    lede: 'Honeywell 5800 is serial-number wireless. It is not DSC, not 2GIG, not a “House ID” system except for a few older keys.',
    tags: ['5800', '5816', '5881', 'wireless', 'rf', 'supervision'],
    related: [{ href: '/guides/manuals?q=5881', label: '5881 card' }, { href: '/guides/wireless-sup', label: 'Wireless supervision TS' }],
    sections: [
      {
        type: 'table',
        headers: ['Thing', 'Field note'],
        rows: [
          ['5816', 'Two loops. Reed + terminals. Program the loop you actually used.'],
          ['5800PIR / COMBO', 'Walk-test with the receiver in its final spot, not on the bench.'],
          ['5820L / 5811', 'Slim contacts. Magnet orientation is the callback.'],
          ['5881ENL / M / H', 'Zone-count SKUs. H is the big one. Address + enable.'],
          ['5800C2W', 'Hardwire-to-wireless converter. You just added RF supervision to old loops.']
        ]
      },
      { type: 'tip', text: 'Receiver antennas up, away from the metal can and away from a 2.4 GHz AP. A 5881 in the can is why every PIR went “supervision fail” on Tuesday.' }
    ]
  };

  P['ecp-vplex'] = {
    id: 'ecp-vplex', icon: 'wire', kind: 'cheat', eyebrow: 'Cheat sheet',
    title: 'ECP vs V-Plex polling loop',
    hub: 'Two buses. Do not cross the streams.',
    lede: 'On a 20P you mostly have ECP (keypads). On a 128 you have ECP and a polling loop. They look like “more 4-wire” until they don’t.',
    tags: ['ecp', 'v-plex', 'polling loop', 'vista 128', '4101sn'],
    related: [{ href: '/guides/vista-128', label: 'Vista 128' }, { href: '/guides/polling-trouble', label: 'Polling trouble' }],
    sections: [
      {
        type: 'table',
        headers: ['Bus', 'What lives here', 'How it fails'],
        rows: [
          ['ECP (keypad bus)', '6160, 5881, 4204, 4229, AlarmNet', 'Blank pads, device troubles, comms fail. Data swapped = no bars with good voltage.'],
          ['Polling loop / V-Plex', '4101SN, 4208SN, 5193SN, VISTAKEY', 'Polarity, T-taps, too much length, a shorted SN device takes weird chunks of the loop.']
        ]
      },
      { type: 'warn', text: 'Do not megger a V-Plex loop. Do not land ECP data on polling-loop terminals. The silk-screen on a 128 is not a 20P.' }
    ]
  };

  P.rj31x = {
    id: 'rj31x', icon: 'net', kind: 'cheat', eyebrow: 'Cheat sheet',
    title: 'RJ31X seizure jack',
    hub: 'POTS, house phones, and the shorting plug',
    lede: 'The panel sits in series with the telco line so it can kick the house phones off and dial. Fiber ONTs and VOIP ATAs do not seize like POTS.',
    tags: ['rj31x', 'rj38x', 'pots', 'dact', 'phone', 'seizure'],
    related: [{ href: '/guides/no-comms', label: 'No comms' }, { href: '/guides/manuals?q=rj31x', label: 'RJ31X card' }],
    sections: [
      {
        type: 'steps',
        items: [
          'The plug has a shorting bar. Panel cord in: panel is in series. Cord out: house phones should still work if the shorting bar is intact.',
          'If you pull the cord and the shorting bar is missing/bent, the house goes dead. That is the “I unplugged the alarm and lost the phones” call.',
          'After an ISP swap to fiber, seizure is often gone. The panel may need an LTE communicator. Do not spend an hour “fixing RJ31X” on an ONT.',
          'Line-seize test: trigger a communicator test and confirm house phones go dead during dial. If they do not, you are not in series.'
        ]
      }
    ]
  };

  P.ampacity = {
    id: 'ampacity', icon: 'wire', kind: 'cheat', eyebrow: 'Cheat sheet',
    title: 'Wire size vs drop (LV reality)',
    hub: 'At 12 V, drop kills you before ampacity does',
    lede: 'NEC ampacity is a safety ceiling. A maglock dying at the door is voltage drop. Use the calc; this table is the gut check.',
    tags: ['awg', 'voltage drop', '18/2', '22/4', 'lock power'],
    related: [{ href: '/refs#vd', label: 'Voltage drop calc' }, { href: '/refs#wire', label: 'Wire size picker' }, { href: '/guides/readings', label: 'Expected voltages' }],
    sections: [
      {
        type: 'table',
        headers: ['Pair', 'Typical LV use', 'Gets you in trouble when'],
        rows: [
          ['22/4, 22/6', 'Keypads, contacts, readers (data + light power)', 'You hang a maglock or QEL on it'],
          ['18/2, 18/4', 'Locks, REX, 12/24 V homeruns', '200 ft of 18 AWG at 1 A on 12 V — do the math'],
          ['16/2, 14/2', 'Long lock runs, NAC, 24 V', 'Still not an excuse to skip last-device voltage'],
          ['CAT5/6 copper', 'Ethernet, sometimes 12 V on spare pairs', 'CCA (copper-clad) and PoE IR cameras'],
          ['Shielded 22/2', 'RS-485 / OSDP / audio', 'Shield grounded at both ends (loop)']
        ],
        foot: 'Educational. Open the voltage-drop calc with the real amps from the label, one-way feet, and 12 vs 24 V.'
      }
    ]
  };

  ts('keypad-blank', 'bell', 'Keypad blank / no bars / “not ready” forever',
    'Voltage, address, data, enable',
    'If the pad is dark, measure DC at the pad. If it is lit but deaf, it is address or data. If it says NOT READY, that is zones — not a dead pad.',
    ['keypad', '6160', 'blank', 'ecp', 'not ready'],
    [
      { type: 'steps', items: [
        'DC at the last keypad. <11 V on a 12 V pad: drop or too many devices on aux. Add a listed supply or shorten the run.',
        'Lit, no text / no bars: address it (1+3), enable it in the panel, check data in/out are not swapped.',
        'Two devices on one address: unplug suspects until the pad behaves, then re-address.',
        'NOT READY with zone text: that is an open zone. Different job — see zone won’t restore.',
        '128 systems: you may be on the wrong partition. Try a pad that is assigned to the partition in trouble, or GOTO if enabled.'
      ]}
    ],
    [{ href: '/guides/keypad', label: 'Addressing' }, { href: '/guides/vista-128', label: 'Vista 128' }, { href: '/guides/zone-open', label: 'Zone open' }]
  );

  ts('wireless-sup', 'zap', 'Wireless supervision / RF fail',
    'Receiver first, then the point, then the AP',
    'A whole building of “supervision fail” is the receiver. One window is the transmitter or the magnet.',
    ['5800', 'supervision', 'rf', 'jam', '5881'],
    [
      { type: 'steps', items: [
        'All RF points fail: receiver unplugged, un-enabled, in the can, or an address fight. Check the 5881/HSM2HOST before you replace 40 PIRs.',
        'One point: battery, serial programming, loop number (5816), magnet moved, transmitter in a metal door.',
        'Jam trouble: 2.4 GHz AP, analog camera, or a noisy PSU taped to the receiver. Move things 6 feet and watch.',
        'Walk-test with the receiver in its final location. Bench tests lie.'
      ]}
    ],
    [{ href: '/guides/wireless-5800', label: '5800 cheat' }, { href: '/guides/manuals?q=5881', label: '5881 card' }]
  );

  ts('polling-trouble', 'wire', 'Polling loop / V-Plex trouble',
    'Polarity, a shorted SN, then the homerun',
    'The 128’s polling loop is its own animal. A shorted 4101SN can take down more than “just that door.”',
    ['v-plex', 'polling', '4101sn', '4208sn', 'vista 128'],
    [
      { type: 'warn', text: 'Do not insulation-test (megger) a V-Plex loop. You will destroy SN devices.' },
      { type: 'steps', items: [
        'Confirm you are on the polling-loop terminals, not ECP. Polarity matters — swap once as a test and note it.',
        'If the whole loop is down, lift the field pair at the panel. Loop healthy at the board = field short. Split the run.',
        'A newly added SN device that kills the loop: that device or its homerun. Remove it, see the rest return.',
        'T-taps and stars: rebuild as a daisy chain or home runs per the sheet. “It worked until we added the warehouse” is topology.',
        'VISTAKEY / door modules on this bus follow the same polarity and address rules.'
      ]}
    ],
    [{ href: '/guides/ecp-vplex', label: 'ECP vs V-Plex' }, { href: '/guides/vista-128', label: 'Vista 128' }]
  );

  ts('verkada-blank', 'cam', 'Verkada: link up, Command blank',
    'Claim, license, then site role',
    'A Verkada with PoE and a link light is not “dead.” Command is the NVR. If the org cannot see it, you are looking at claim, license, VLAN, or a Site Viewer who was never granted the site.',
    ['verkada', 'command', 'claim', 'license', 'poe', 'camera'],
    [
      { type: 'steps', items: [
        'Link LED at the camera and the switch. No link is copper or PoE class — see no-link. Do not factory-reset a camera that never had Ethernet.',
        'Claim the serial in Command BEFORE you hang it on a VLAN that cannot reach the internet. Footage recorded before claim is gone.',
        'Org Admin vs Site Admin vs Site Viewer. Sites do not inherit users. “IT can see it and I cannot” is permissions, not a bad imager.',
        'Every camera needs a license on that org. An unlicensed cam looks offline in Command with a healthy PoE light.',
        'DHCP and outbound HTTPS. A guest VLAN or a firewall that blocks Command is a “dead” camera with a green link.',
        'PoE+ for IR / analytics / cold start. An af-only switch = night reboot. Same as Axis and Avigilon.',
        'Non-Verkada ONVIF goes through a Command Connector, not a magic adopt. Check the connector compatibility list.'
      ]}
    ],
    [{ href: '/guides/verkada-claim', label: 'Claim / PoE / license' }, { href: '/guides/manuals?q=verkada', label: 'Verkada cards' }, { href: '/guides/no-link', label: 'No link' }]
  );

  ts('verkada-door', 'lock', 'Verkada door will not unlock',
    'Cache, copper, then Command',
    'Cloud access still has a lock, a fire drop, and a reader on copper. Command being slow is not a reason to swap the controller.',
    ['verkada', 'ac12', 'ac41', 'access', 'cloud', 'fire drop'],
    [
      { type: 'steps', items: [
        'WAN down: cached credentials should still work until you prove they do not. Do not replace an AC12 because guest Wi-Fi would not load Command.',
        'Reader beep / LED vs lock motion. Beep and no motion is the output, the strike, or fire-alarm shunt — not a new AD reader.',
        'Lock current on a PoE door port is a real number. A maglock on the controller brownouts the cassette. Use listed lock power when the sheet says so.',
        'Fire-alarm release is still a dry contact on the opening. Command schedules do not replace a fire drop on a maglock.',
        'Door object in Command: port, lock type, DPI, REX. A door that was never added will never unlock, no matter how pretty the LED is.',
        'Third-party Wiegand on an AD port is a format and jumper conversation. Verkada readers are the easy path.'
      ]}
    ],
    [{ href: '/guides/verkada-claim', label: 'Claim cheat' }, { href: '/guides/access-denied', label: 'Card reads, no unlock' }, { href: '/guides/manuals?trade=access', label: 'Access cards' }]
  );

  ts('bosch-lsn', 'bell', 'Bosch FPA / LSN loop trouble',
    'Do not megger it. Sectionalize.',
    'FPA-1000 / FPA-5000 talk LSN (or LSN improved), not CLIP and not a B-series keypad bus. The wrong laptop tool is how you spend a day.',
    ['bosch', 'fpa-1000', 'fpa-5000', 'lsn', 'rps', 'fire'],
    [
      { type: 'warn', text: 'Do not insulation-test (megger) an LSN loop. You will destroy devices. Impairment / fire watch may be required before you disable anything.' },
      { type: 'steps', items: [
        'Photograph the panel, the trouble text, and the loop card. Then follow site impairment process. This is life-safety, not a burg can.',
        'RPS / FSP-5000-RPS is the fire tool. A laptop with “a Bosch program” (RPS for intrusion, Configuration Manager for cameras) is not automatically the right one.',
        'Whole loop down: lift the field pair at the panel. Healthy at the board = field. Split the run. A single shorted module can take a chunk of LSN.',
        'Protocol: LSN devices on an LSN loop. A leftover System Sensor CLIP head will not poll. Match the sheet to the can.',
        'Ground fault: sectionalize. Do not shotgun detectors. Same as Notifier.',
        'AC / battery troubles are still voltage. Measure the batteries off the charger before you condemn the CPU.'
      ]}
    ],
    [{ href: '/guides/manuals?q=FPA', label: 'FPA cards' }, { href: '/guides/ac-batt', label: 'AC / battery' }, { href: '/guides/safety', label: 'Doors, fire, jumpering' }]
  );

  ts('nac-booster', 'fire', 'NAC booster / remote power trouble',
    'Sync, EOL, then the batteries',
    'The closet can that is quietly carrying the corridor strobes. FCPS-24S6/S8, Wheelock, Altronix NAC. Input from the FACP, output to the field.',
    ['nac', 'booster', 'fcps', 'sync', 'strobe', 'eol'],
    [
      { type: 'steps', items: [
        'Sync protocol has to match the FACP and the appliances. Wheelock sync into System Sensor heads (or the reverse) is a disco that will not pass.',
        'EOL is at the last device on the booster circuit, not back at the FACP. A resistor in the booster can unsupervised the run.',
        'Measure last-device voltage in alarm. Same drop rule as any NAC. The booster does not repeal Ohm.',
        'Batteries and the calc on the door are not optional. An untested booster is strobes that die in minute two.',
        'Input from the FACP: if the booster never triggers, the NAC input, the polarity, or the FACP circuit is the job — not 40 new strobes.',
        'Class A vs Class B on the booster card. A missing jumper looks like an open NAC.'
      ]}
    ],
    [{ href: '/guides/manuals?q=FCPS', label: 'FCPS card' }, { href: '/refs#nac', label: 'NAC load calc' }, { href: '/guides/manuals?trade=fire', label: 'Fire cards' }]
  );

  ts('comms-takeover', 'bell', 'Communicator takeover / failed to test',
    'Path, listing, then the antenna',
    'LTEM-P, Telguard, BAT-Fire, PRODCM dialer capture. The panel is fine and the path is not — or the path is a burg communicator on a FACP.',
    ['ltem', 'telguard', 'alula', 'takeover', 'dact', 'communicator'],
    [
      { type: 'steps', items: [
        'Fire-listed vs burg-listed. A TG-1 on a FACP (or a burg LTEM on a fire panel) is an AHJ fail even if it “tests.” Read the door.',
        'Dialer-capture vs panel bus / ECP. Capture wants ring voltage and polarity. Bus wants the right connector. Mixing them is a silent communicator.',
        'Power the communicator from a listed supply. Starving it off keypad aux is a brownout after the first radio burst.',
        'Antenna in a steel closet = one bar and a failed test. RSSI on the unit, photograph it, then move the antenna.',
        'Registration: AlarmNet 360, Telguard portal, Alula, Alarm.com. A panel with bars and no account is not a new radio.',
        'After an ISP swap, RJ31X seizure is often dead. That is a communicator job, not an hour on the jack. See RJ31X.'
      ]}
    ],
    [{ href: '/guides/no-comms', label: 'No comms tree' }, { href: '/guides/rj31x', label: 'RJ31X' }, { href: '/guides/manuals?q=LTEM', label: 'LTEM card' }]
  );

  P['verkada-claim'] = {
    id: 'verkada-claim', icon: 'cam', kind: 'cheat', eyebrow: 'Cheat sheet',
    title: 'Verkada claim / PoE / license',
    hub: 'Claim it before you hang it',
    lede: 'Command is the product. The camera is a PoE endpoint with a serial. Get the order of operations right and you skip a truck roll.',
    tags: ['verkada', 'command', 'claim', 'license', 'poe', 'ac12'],
    related: [{ href: '/guides/verkada-blank', label: 'Command blank' }, { href: '/guides/verkada-door', label: 'Door will not unlock' }, { href: '/guides/manuals?q=verkada', label: 'Verkada cards' }],
    sections: [
      {
        type: 'table',
        headers: ['Step', 'What “good” looks like', 'How it fails'],
        rows: [
          ['Claim', 'Serial in Command, then cable', 'Hung first on a dark VLAN. Footage before claim is gone.'],
          ['License', 'Org has a seat for that camera', 'Unlicensed = “offline” with a healthy PoE light.'],
          ['Site role', 'You are Site Admin on that site', 'Sites do not inherit users. IT can see it; you cannot.'],
          ['PoE', 'at / PoE+ for IR + analytics', 'af-only switch = night reboot.'],
          ['Network', 'DHCP + outbound HTTPS to Command', 'Guest VLAN / firewall = green link, blank Command.']
        ]
      },
      { type: 'tip', text: 'Access controllers (AC12 / AC41 / AC42) claim the same way. Lock power is still a current number — a maglock on a PoE door port can brown out the cassette.' }
    ]
  };

  P['bosch-sdi2'] = {
    id: 'bosch-sdi2', icon: 'bell', kind: 'cheat', eyebrow: 'Cheat sheet',
    title: 'Bosch SDI / SDI2 addressing',
    hub: 'B-series is not a VISTA',
    lede: 'B8512G / B5512 / D9412GV4 talk SDI or SDI2, not ECP. Keypads, B810 RADION, and B208 expanders each have an address. Two devices on one address is the haunted house.',
    tags: ['bosch', 'sdi2', 'sdi', 'b8512', 'b5512', 'd9412', 'b810', 'radion'],
    related: [{ href: '/guides/manuals?q=bosch', label: 'Bosch cards' }, { href: '/guides/keypad', label: 'Keypad addressing' }, { href: '/guides/wireless-sup', label: 'Wireless supervision' }],
    sections: [
      {
        type: 'table',
        headers: ['Bus', 'What lives here', 'Foot-gun'],
        rows: [
          ['SDI (legacy GV4)', 'D1260 / D1255 keypads, older modules', 'Do not land SDI2 devices here and hope.'],
          ['SDI2 (B-series)', 'B920/B930 pads, B810 RADION, B208 / B308 expanders', 'Unique addresses. Receiver in the metal can = every point supervision-fails.'],
          ['RADION / B810', 'Wireless PIRs, contacts, smokes', 'Not 5800, not PowerG. Bosch RF only.']
        ]
      },
      { type: 'warn', text: 'RPS (Remote Programming Software) is how you program this. A Vista-style *20 punch will not give you SDI2 modules. Intrusion RPS is not FPA fire RPS.' }
    ]
  };

  P['mercury-bus'] = {
    id: 'mercury-bus', icon: 'lock', kind: 'cheat', eyebrow: 'Cheat sheet',
    title: 'Mercury LP / MR bus',
    hub: 'RS-485, address, jumpers — software is a sticker',
    lede: 'Lenel, RS2, Open Options, Feenics, Genetec, and a pile of others are the same LP1501/1502 + MR52 hardware. The brand on the PC does not change the copper.',
    tags: ['mercury', 'lp1502', 'mr52', 'rs-485', 'osdp', 'lenel', 'rs2'],
    related: [{ href: '/guides/reader-dead', label: 'Reader dead' }, { href: '/guides/manuals?q=mercury', label: 'Mercury cards' }, { href: '/refs#rs485', label: 'RS-485 length' }],
    sections: [
      {
        type: 'steps',
        items: [
          'One RS-485 pair, daisy-chained, shield single-end. Stars and T-taps are intermittent ghosts.',
          'Unique addresses on every MR52 / MR16IN. Two boards on address 0 = random downstream death.',
          'Termination at the far end (and only the far end, plus the intelligent controller). Two extra jumpers in the middle kill the bus.',
          'Reader port: 12 vs 24, Wiegand vs OSDP. The jumper is how you pick. Wrong jumper + 24 V = dead reader.',
          'After a power cycle wait for a full boot before you declare a downstream MR dead.',
          'Software (OnGuard, Access It!, DNA Fusion, Keep) is a download. A “dead door” after a server upgrade is often firmware mismatch, not a new LP1502.'
        ]
      }
    ]
  };

  P['simplex-4100'] = {
    id: 'simplex-4100', icon: 'bell', kind: 'cheat', eyebrow: 'Cheat sheet',
    title: 'Simplex 4100ES first five',
    hub: 'Do not factory-default a campus panel',
    lede: 'TrueAlarm, TrueAlert, IDNet / MAPNET, optional voice. The programmer and the job file are the product. This card is orientation.',
    tags: ['4100es', '4010es', 'simplex', 'truealarm', 'idnet', 'es net'],
    related: [{ href: '/guides/manuals?q=4100ES', label: '4100ES card' }, { href: '/guides/safety', label: 'Impairment' }, { href: '/guides/bosch-lsn', label: 'Bosch FPA tree' }],
    sections: [
      { type: 'warn', text: 'You do not factory-default a 4100ES because a printer is offline. Impairment / fire watch may be required before you disable NAC or IDNet.' },
      {
        type: 'steps',
        items: [
          'Photograph the door, the trouble, and the revision. 4100U vs 4100ES vs 4010ES are different programmers and different job files.',
          'TrueAlarm “dirty detector” is a maintenance report, not automatically a new smoke. Run the report before you open 40 bags.',
          'IDNet vs MAPNET vintage. Mixing cards and devices across generations is a trouble, not a bad head.',
          'Voice / firefighter phone is its own career. Do not “clear the audio trouble” by pulling amplifiers.',
          'ES Net vs 4120 network. Unplugging a node to clear a trouble can take a campus with it.'
        ]
      }
    ]
  };

  P['firelite-protocol'] = {
    id: 'firelite-protocol', icon: 'bell', kind: 'cheat', eyebrow: 'Cheat sheet',
    title: 'Fire-Lite LiteSpeed vs CLIP vs SS',
    hub: 'Protocol is not mix-and-match',
    lede: 'ES-200X / ES-50X replaced a pile of MS-9200UDLS jobs. The loop protocol is the whole ticket. You cannot split protocols on one SLC.',
    tags: ['fire-lite', 'es-200x', 'ms-9200udls', 'litespeed', 'clip', 'slc'],
    related: [{ href: '/guides/manuals?q=ES-200X', label: 'ES-200X card' }, { href: '/guides/manuals?trade=fire', label: 'Fire cards' }],
    sections: [
      {
        type: 'table',
        headers: ['Panel', 'Protocol', 'Do not'],
        rows: [
          ['ES-50X / ES-200X / ES-1000X', 'SS, LiteSpeed, or CLIP (pick one per loop)', 'Mix a leftover CLIP head on a LiteSpeed loop'],
          ['MS-9200UDLS / MS-9600LS', 'LiteSpeed or CLIP', 'Assume ES auto-learn will fix address collisions'],
          ['MS-9200 / MS-9050UD vintage', 'CLIP only', 'Drop LiteSpeed detectors on a CLIP-only panel']
        ]
      },
      { type: 'tip', text: 'Address collisions still happen after auto-learn. Walk the map. Impairment process still applies before you disable the SLC.' }
    ]
  };
})(window.__LAWSONITE_GUIDES__.pages);

