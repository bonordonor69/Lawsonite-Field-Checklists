/* Lawsonite Field Guides content. Original educational field cards.
   Official manufacturer links only — we do not host copyrighted manuals. */
window.__LAWSONITE_GUIDES__ = {
  groups: [
    { key: 'learn', title: 'Learn', sub: 'Crash courses', icon: 'meter', ids: ['meter', 'first-five', 'safety'] },
    { key: 'cheat', title: 'Cheats', sub: 'Lookups', icon: 'wire', ids: ['readings', 'pinouts', 'resistor', 'poe', 'fail-safe', 'ip', 'toner', 'keypad', 'vista-128', 'wireless-5800', 'ecp-vplex', 'rj31x', 'ampacity'] },
    { key: 'ts', title: 'Calls', sub: 'Symptom trees', icon: 'zap', ids: ['camera-offline', 'reader-dead', 'maglock', 'door-latch', 'access-denied', 'no-comms', 'ac-batt', 'zone-open', 'no-link', 'doorbell', 'keypad-blank', 'wireless-sup', 'polling-trouble'] },
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
    tags: ['manual', 'HID', 'Altronix', 'Vista', 'vista 128', '128bpt', 'DSC', 'Neo', 'HES', 'Axis', '6160', 'docs'],
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
            href: 'https://www.resideo.com',
            linkLabel: 'Resideo / Honeywell Home support',
            linkSub: 'Search “VISTA-20P installation and setup” on Resideo — use the guide that matches the board revision (K5305-1…)',
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
            href: 'https://www.resideo.com/us/en/pro/products/security/intrusion-panels-systems/combination-fire-burglary-systems/v128fbpt24kt-vistar-residential-security-control-panel-v128fbpt24kt/',
            linkLabel: 'VISTA-128FBPT product + datasheets',
            linkSub: 'resideo.com — 32FBPT / 128FBPT / 250FBPT literature',
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
            href: 'https://www.resideo.com/us/en/pro/products/security/intrusion-panels-systems/keypads-accessories/',
            linkLabel: 'Resideo keypads & accessories',
            linkSub: 'resideo.com — 6160 / 6160RF install sheet',
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
            href: 'https://www.resideo.com/us/en/pro/products/security/intrusion-panels-systems/keypads-accessories/',
            linkLabel: 'Resideo RF receivers & 5800 accessories',
            linkSub: 'Search 5881ENHC / 5883H on Resideo Pro',
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
            href: 'https://www.resideo.com/us/en/pro/products/security/intrusion-panels-systems/keypads-accessories/',
            linkLabel: 'Resideo expanders & relays',
            linkSub: '4204 / 4219 / 4229 install sheets on Resideo Pro',
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
            href: 'https://www.resideo.com/us/en/pro/products/security/alarmnet-communication/',
            linkLabel: 'AlarmNet communicators',
            linkSub: 'resideo.com — LTEM-PA / LTEM-PV / 7847i docs',
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
            href: 'https://www.notifier.com',
            linkLabel: 'Notifier documentation',
            linkSub: 'notifier.com — authorized manuals for the panel on the door',
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
            href: 'https://www.resideo.com',
            linkLabel: 'Use the panel’s install guide (RJ31X section)',
            linkSub: 'Also the Lawsonite RJ31X cheat in Field brain',
            tags: ['rj31x', 'rj38x', 'seizure', 'pots', 'phone jack', 'dact']
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
})(window.__LAWSONITE_GUIDES__.pages);

