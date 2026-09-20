/* Lawsonite cable-hardware dictionary + factory-default logins.
   Educational field aide. Confirm nVent CADDY catalog, AHJ, TIA, and NEC. */
(function (root) {
  'use strict';

  function part(mpn, name, desc) {
    return { mpn: mpn, name: name, desc: desc };
  }

  var HOOK = {
    s: { std: part('CAT16', 'CADDY CAT16 J-hook', '1-5/16″ J-hook. About 15 Cat6.'), hp: part('CAT16HP', 'CADDY CAT16HP wide-base', '1-5/16″ wide-base J-hook. Cat6A / fiber saddle.') },
    m: { std: part('CAT32', 'CADDY CAT32 J-hook', '2″ J-hook. About 50 Cat6.'), hp: part('CAT32HP', 'CADDY CAT32HP wide-base', '2″ wide-base J-hook. Cat6A / fiber.') },
    l: { std: part('CAT64', 'CADDY CAT64 J-hook', '4″ J-hook. About 80 Cat6.'), hp: part('CAT64HP', 'CADDY CAT64HP wide-base', '4″ wide-base J-hook. Cat6A / fiber / composite.') },
    xl: { std: part('CAT64HP', 'Cable tray + CAT64HP', 'Primary path is basket/ladder tray. 4″ wide-base J-hook only for drops off the tray.'), hp: part('CAT64HP', 'Cable tray + CAT64HP', 'Primary path is basket/ladder tray. Do not hang 80+ fiber on hooks alone.') }
  };

  var CLIP = {
    f18: part('4Z34', 'CADDY 4Z34 hammer-on flange clip', 'Hammer-on for 1/8″–1/4″ flange. 1/4-20 stud to hang a hook.'),
    f516: part('4Z46', 'CADDY 4Z46 hammer-on flange clip', 'Hammer-on for 5/16″–1/2″ flange. 1/4-20 stud.'),
    f12: part('4Z58', 'CADDY 4Z58 hammer-on flange clip', 'Hammer-on for 1/2″–3/4″ flange. 1/4-20 stud.'),
    f34: part('BC', 'CADDY BC pressed beam clamp', 'Malleable/pressed beam clamp for thicker or painted flange. 1/4-20.'),
    tgrid: part('4ACS', 'CADDY 4ACS T-grid clip', 'Acoustical tee / batwing-style clip. Light data only.'),
    drop: part('CD1T', 'CADDY CD1T drop-wire clip', 'Clips a hook or cable to 12 AWG ceiling drop wire.'),
    rod: part('SCH14', 'CADDY SCH14 rod-mounted hook adapter', 'Hangs a J-hook from existing 1/4-20 or 3/8-16 rod.'),
    sammyC: part('SAMMY 1/4-20', 'Sammy’s 1/4-20 vertical rod anchor', 'Threaded-rod anchor into concrete/deck. Then hang the hook.'),
    sammyS: part('SAMMY SW 1/4-20', 'Sammy’s Sidewinder 1/4-20', 'Side-mount rod anchor into steel deck / purlin.'),
    tapcon: part('TAPCON 1/4 x 1-3/4', '1/4″ x 1-3/4″ hex Tapcon', 'Screw anchor into solid concrete or grouted CMU.'),
    conical: part('CONICAL #10', 'Plastic conical anchor + #10 SMS', 'Light drywall/block. Not an 80-cable point.'),
    toggle: part('TOGGLE 1/8', '1/8″ toggle bolt', 'Hollow drywall when you cannot hit a stud.'),
    sms: part('#10 x 1 SMS', '#10 x 1″ sheet-metal / wood screw', 'Into wood stud or 20–25 ga metal stud. Pilot metal studs.')
  };

  var FAST = {
    hex: '1/4″-20 x 1/2″ hex-head screw + nut (clip stud to J-hook)',
    hex38: '3/8″-16 x 3/4″ hex-head screw + nut (heavy clamp / rod)',
    noneHammer: 'None to the beam — hammer-on seats on the flange. 1/4″-20 x 1/2″ hex screw + nut hangs the J-hook from the clip.',
    noneGrid: 'None — batwing/tee clip springs onto the T-grid. Do not screw the tile.',
    noneDrop: 'None — drop-wire clip bites the 12 AWG. Confirm the wire is structural, not a stray #18.',
    noneRod: 'None extra if the rod is already 1/4-20/3/8-16. SCH adapter + hex nut.',
    sammy: 'Sammy’s 1/4-20 vertical (or Sidewinder in steel). Then 1/4-20 hex nut to the J-hook.',
    tapcon: '1/4″ x 1-3/4″ hex Tapcon (min embed per Tapcon sheet). Then 1/4-20 hardware for the hook.',
    conical: 'Plastic conical anchor with #10 x 1″ sheet-metal screw. Light loads only.',
    toggle: '1/8″ toggle bolt through drywall. Hit a stud instead if you can.',
    sms: '#10 x 1″ SMS / wood screw into the stud. Not for 80-cable points.'
  };

  var HW = {
    cables: [
      { key: 'cat6', label: 'Cat5e / Cat6', wide: false },
      { key: 'cat6a', label: 'Cat6A', wide: true },
      { key: 'fiber', label: 'Indoor fiber', wide: true },
      { key: 'coax', label: 'Security / coax / siamese', wide: false },
      { key: 'fplp', label: 'FPLP / FPLR fire cable', wide: false, fire: true },
      { key: 'control', label: '18/2 – 22/6 control', wide: false },
      { key: 'composite', label: 'Composite / multi-run bundle', wide: true }
    ],
    substrates: [
      { key: 'ibeam', label: 'Structural steel I-beam', flange: true, family: 'steel' },
      { key: 'joist', label: 'Bar joist / open web', flange: true, family: 'steel' },
      { key: 'purlin', label: 'Cee purlin / metal deck', flange: true, family: 'steel' },
      { key: 'concrete', label: 'Concrete wall / ceiling', flange: false, family: 'masonry' },
      { key: 'cmu', label: 'CMU / block', flange: false, family: 'masonry' },
      { key: 'stud', label: 'Drywall / wood or metal stud', flange: false, family: 'stud' },
      { key: 'dropwire', label: 'Drop wire (12 AWG)', flange: false, family: 'wire' },
      { key: 'tgrid', label: 'Acoustical T-grid', flange: false, family: 'grid' },
      { key: 'rod', label: 'Existing threaded rod', flange: false, family: 'rod' }
    ],
    flanges: [
      { key: 'f18', label: '1/8″ – 1/4″' },
      { key: 'f516', label: '5/16″ – 1/2″' },
      { key: 'f12', label: '1/2″ – 3/4″' },
      { key: 'f34', label: '3/4″ – 1-1/4″' }
    ],
    sizes: [
      { key: 's', label: 'Small · ~15 cables' },
      { key: 'm', label: 'Medium · ~50 cables' },
      { key: 'l', label: 'Large · ~80 cables' },
      { key: 'xl', label: 'Extra · 80+ / tray' }
    ],
    cheat: [
      ['Hammer-on flange clip (4Z34 / 4Z46 / 4Z58)', 'I-beam, bar joist, purlin flange', 'Fastest steel attach — no drill', 'Pair with a J-hook. Match flange thickness. Not for crumbling paint or 1″+ flange.'],
      ['Pressed / malleable beam clamp (BC)', 'Thicker, painted, or uneven steel flange', 'When a hammer-on will not seat', '1/4-20 or 3/8-16. Snug, do not crush the beam.'],
      ['Wide-base J-hook (CAT##HP)', 'Any 1/4-20 point', 'Cat5e/6, Cat6A, fiber, composite', '~15 / 50 / 80 by size (CAT16 / 32 / 64). Fill, do not pile.'],
      ['Standard J-hook (CAT##)', 'Any 1/4-20 point', 'Cat5e/6, coax, control, FPLP', 'Same counts. Prefer HP saddles for Cat6A / fiber.'],
      ['Bridle ring, standard', 'Rod, beam, structure', 'Coax / control only', 'Light. TIA-568 fails a skinny ring on Cat6A or fiber.'],
      ['Batwing / T-grid clip (4ACS)', 'Acoustical tee', 'Light data in a drop ceiling', 'Small–medium. Do not screw the tile. Fire cable often needs independent support.'],
      ['Drop-wire clip (CD1T)', '12 AWG ceiling drop wire', 'Existing wire, light data', 'Small–medium. Confirm the wire is structural. Not a fire-cable method in many specs.'],
      ['Sammy’s 1/4-20 (vertical / Sidewinder)', 'Concrete, deck, steel', 'New 1/4-20 point, then hang the hook', 'Then CAT J-hook. Embedment per Sammy sheet.'],
      ['Tapcon / sleeve anchor', 'Solid concrete, grouted CMU', 'Direct-mount a clip or strut', 'Check embedment and dust the hole. Hollow CMU needs a sleeve/toggle.'],
      ['#10 SMS / wood screw / conical', 'Wood stud, light block, drywall', 'Light runs only', 'Not an 80-cable support. Hit a stud or go to rod/beam.'],
      ['Rod adapter (SCH14)', 'Existing 1/4-20 / 3/8-16 rod', 'Hang a hook from all-thread already in the deck', 'Do not share fire-sprinkler rod unless the spec allows it.'],
      ['Cable tray / basket', 'Structure', '80+ cables, fiber trunks, composite', 'Per tray fill. Hooks only for drops off the tray.']
    ],
    resolve: resolve
  };

  function find(list, key) {
    for (var i = 0; i < list.length; i++) if (list[i].key === key) return list[i];
    return null;
  }

  function resolve(sel) {
    sel = sel || {};
    var cable = find(HW.cables, sel.cable);
    var sub = find(HW.substrates, sel.substrate);
    var size = find(HW.sizes, sel.size);
    if (!cable || !sub || !size) return null;
    if (sub.flange && !sel.flange) return null;

    var wide = !!cable.wide;
    var hookSet = HOOK[sel.size] || HOOK.m;
    var hook = wide ? hookSet.hp : hookSet.std;
    var support;
    var fastener;
    var alts = [];
    var warnings = [];

    if (sub.family === 'steel') {
      if (sel.flange === 'f34') {
        support = CLIP.f34;
        fastener = FAST.hex;
        alts.push(part('BC400', 'CADDY BC400 / 3/8 beam clamp', 'Heavier malleable clamp when 1/4-20 BC feels light.'));
      } else {
        support = CLIP[sel.flange] || CLIP.f18;
        fastener = FAST.noneHammer;
        alts.push(CLIP.f34);
      }
      if (sub.key === 'purlin') {
        alts.unshift(CLIP.sammyS);
        warnings.push('Cee purlin / metal deck: if the flange is too thin or coated for a hammer-on, switch to a Sammy’s Sidewinder 1/4-20 and hang the hook from rod.');
      }
    } else if (sub.key === 'concrete') {
      support = CLIP.sammyC;
      fastener = FAST.sammy;
      alts.push(CLIP.tapcon);
    } else if (sub.key === 'cmu') {
      support = CLIP.tapcon;
      fastener = FAST.tapcon;
      alts.push(CLIP.conical);
      warnings.push('Hollow CMU: a Tapcon in the face shell can spin. Use a sleeve anchor or hit grouted cells.');
    } else if (sub.key === 'stud') {
      support = CLIP.sms;
      fastener = FAST.sms;
      alts.push(CLIP.toggle);
      alts.push(CLIP.conical);
      warnings.push('Drywall without a stud is not a medium/large support. Hit wood/metal stud or jump to rod/beam.');
      if (sel.size === 'l' || sel.size === 'xl') {
        warnings.push('Large / extra on drywall: do not. Move the support to structure (beam, joist, rod, concrete).');
      }
    } else if (sub.key === 'dropwire') {
      support = CLIP.drop;
      fastener = FAST.noneDrop;
      alts.push(HOOK.s.hp);
      warnings.push('Drop wire must be 12 AWG structural ceiling wire, not a random thermostat conductor. Many fire specs forbid drop-wire as the listed support.');
    } else if (sub.key === 'tgrid') {
      support = CLIP.tgrid;
      fastener = FAST.noneGrid;
      warnings.push('T-grid clips are for light data. Do not screw the tile. Do not hang 50–80 cables on the grid — independent support (rod/beam) or the ceiling comes down.');
      if (cable.fire) {
        warnings.push('FPLP/FPLR on T-grid usually fails inspection. Fire cable wants listed independent supports at the spec spacing — not a batwing on the tee.');
      }
      if (sel.size === 'l' || sel.size === 'xl') {
        warnings.push('Large / extra on T-grid: no. Use rod, beam, or tray.');
      }
    } else if (sub.key === 'rod') {
      support = CLIP.rod;
      fastener = FAST.noneRod;
      warnings.push('Do not hang from a fire-sprinkler rod unless the engineer/AHJ said you can. Dedicated 1/4-20 or 3/8-16 is the default.');
    }

    if (wide) {
      warnings.push('TIA-568: Cat6A and fiber need a wide-base support or saddle. A standard skinny bridle ring kinks the cable and fails inspection. Use CAT##HP J-hooks, not 4BR/6BR rings.');
    }
    if (cable.key === 'cat6' && (sel.size === 'l' || sel.size === 'xl')) {
      warnings.push('A standard bridle ring is the wrong answer at this fill. J-hook or tray.');
    }
    if (cable.fire) {
      warnings.push('NEC 760 / listed fire-cable supports: spacing is usually 4–5 ft (follow the cable listing and AHJ). Do not use plastic cable ties as the support. Steel J-hooks or listed straps.');
    }
    if (sel.size === 'xl') {
      warnings.push('80+ cables: the honest answer is basket/ladder tray. J-hooks are for the drop, not the trunk.');
    }
    warnings.push('Typical TIA support spacing is 4–5 ft, no mid-span sag onto ceiling tile, no resting on duct. Manufacturer sheet and spec win.');
    warnings.push('nVent CADDY numbers are trade-standard equivalents. ADI/Anixter may sub Erico, B-Line, or generic. Match flange range and hook width, not just the logo.');

    return {
      cable: cable,
      substrate: sub,
      size: size,
      flange: find(HW.flanges, sel.flange),
      primary: support,
      hook: hook,
      fastener: fastener,
      alts: alts,
      warnings: warnings
    };
  }

  /* Official-doc factory defaults only. Change them. Not a backdoor list. */
  var DEFAULTS = [
    { any: ['vista-15', 'vista 15', 'vista-20', 'vista 20', 'vista-21', '21ip'], user: 'Installer 4112', pass: 'Master 1234', extra: '*# within ~50s of power-up if locked out (20P). Change installer and master.' },
    { any: ['vista-128', 'vista 128', 'vista-250', '128bpt', '250bpt', '128fbpt'], user: 'Installer 4140', pass: 'Master 1234', extra: '128/250-class installer is 4140, not 4112. Alpha keypad required.' },
    { any: ['6160'], user: '—', pass: 'Uses the panel installer code', extra: 'Keypad itself has no login. Address via *# or dip per sheet.' },
    { any: ['proa7', 'proseries'], user: 'Installer via AlarmNet / local installer code', pass: 'Master 1234 (until changed)', extra: 'ProSeries is account-tied. Local installer code is job-specific after first program.' },
    { any: ['powerseries pro', 'hs3'], user: 'Installer 5555', pass: 'Master 1234', extra: '*8 5555 on Pro. Change both.' },
    { any: ['powerseries neo', 'hs2032', 'hs2064', 'hs2128'], user: 'Installer 5555', pass: 'Master 1234', extra: '*8 5555. Neo installer is still 5555 until changed.' },
    { any: ['pc1616', 'pc1832', 'pc1864', 'powerseries'], user: 'Installer 5555', pass: 'Master 1234', extra: '*8 5555. Section 006 to change installer.' },
    { any: ['b-series', 'b8512', 'b5512', 'd9412', 'solution'], user: 'Installer 123', pass: 'User 123', extra: 'Bosch B / GV4-class. Remote PIN often 0000 until set. Change all three.' },
    { any: ['fpa-1000', 'fpa-5000'], user: 'Per job / Bosch default on the sheet', pass: '—', extra: 'Modular fire. Do not guess — the commissioning sheet wins.' },
    { any: ['dmp', 'xr /', 'xr/', 'xt panels'], user: 'Default 99 (user) / see installer sheet', pass: '—', extra: 'DMP codes are dealer-programmed more often than not. Confirm on the keypad.' },
    { any: ['napco', 'gemini'], user: 'Installer 1234 (typical older Gemini)', pass: 'User 123', extra: 'Verify on the panel sticker / programming sheet. Many jobs already changed it.' },
    { any: ['iq panel', 'qolsys'], user: 'Dealer 1111 (typical)', pass: 'Master 1234', extra: 'IQ Panel 4 dealer/installer is account-specific after first connect. 1111/1234 are factory until provisioned.' },
    { any: ['2gig', 'gc3', 'gc2'], user: 'Installer 1561', pass: 'Master 1111', extra: '1561 is the classic 2GIG installer. Change it.' },
    { any: ['elk', 'm1 gold', 'm1ez8'], user: 'Installer 1234 / 111111 (see sheet)', pass: 'User 1111', extra: 'M1 RP software password is separate from keypad codes.' },
    { any: ['paradox', 'evo192', 'magellan'], user: 'Installer 000000', pass: 'Master 1234', extra: 'Six-digit installer on EVO is often 000000 until changed.' },
    { any: ['galaxy'], user: 'Engineer 221266 (typical older Galaxy)', pass: 'User 1234', extra: 'Galaxy codes vary by region/firmware. Confirm the commissioning sheet.' },
    { any: ['networx', 'nx-8', 'concord', 'simon'], user: 'Installer 1234 / *8 4321 (varies by panel)', pass: 'Master 1234', extra: 'UTC/Interlogix defaults were not one number. Read the specific NX/Concord sheet.' },
    { any: ['hikvision', 'acusense', 'ds-2cd'], user: 'admin', pass: 'Must activate on first boot (no blank admin on new firmware)', ip: '192.168.1.64', extra: 'SADP to find it. Change immediately. LTS / many OEM rebadge this.' },
    { any: ['uniview', 'ezview'], user: 'admin', pass: '123456 (older) or first-boot activation', ip: '192.168.1.13', extra: 'Some OEM Uniview sit on .64. Try 192.168.1.64 if .13 misses.' },
    { any: ['dahua', 'ic realtime'], user: 'admin', pass: 'admin (legacy) or first-boot activation', ip: '192.168.1.108', extra: 'ConfigTool to find it. Change immediately.' },
    { any: ['lts', 'cmip', 'ptip'], user: 'admin', pass: 'Hikvision-class activation', ip: '192.168.1.64', extra: 'LTS is typically Hik OEM. SADP / LTS tool.' },
    { any: ['hanwha', 'wisenet', 'p / q / x'], user: 'admin', pass: '4321 (until first-boot forces a change)', ip: '192.168.1.10', extra: 'Wisenet Device Manager. 4321 is the classic; new firmware makes you set one.' },
    { any: ['axis'], user: 'root (legacy) / first-boot password', pass: 'pass (very old only)', ip: 'DHCP or 192.168.0.90', extra: 'Modern Axis has no default password — set on first boot. axis-<mac>.local.' },
    { any: ['avigilon', 'h5 /', 'h6 '], user: 'administrator', pass: '(blank) on many ACC cameras until set', extra: 'ACC/Unity login is a site account, not the camera default.' },
    { any: ['exacq'], user: 'admin', pass: 'admin256', extra: 'exacqVision classic default. Change it. Recorders may also use admin / 1234 on older boxes.' },
    { any: ['speco'], user: 'admin', pass: '1234', extra: 'Speco Blue / Intensifier classic. Change it.' },
    { any: ['invid'], user: 'admin', pass: 'OEM (often Hik/Dahua class)', ip: '192.168.1.108 or .64', extra: 'INVID is usually OEM. Try SADP and ConfigTool.' },
    { any: ['vivotek'], user: 'root', pass: 'Set on first boot (older: root / <blank>)', extra: 'Shepherd / Vivotek tool. No standing default on new firmware.' },
    { any: ['unifi', 'ubiquiti', 'g4 /', 'g5 '], user: 'UniFi OS / local admin', pass: 'Set at adopt — old ubnt/ubnt is dead', ip: '192.168.1.20 (switch default before adopt)', extra: 'Cameras are controller-adopted. 192.168.1.20 is a factory UniFi switch, not the camera.' },
    { any: ['verkada'], user: 'Verkada Command (cloud)', pass: 'No local factory user/pass', extra: 'Claim in Command. There is no “admin/admin” on the camera. Offline = Command site, not a default login.' },
    { any: ['rhombus'], user: 'Rhombus Console (cloud)', pass: 'No local factory user/pass', extra: 'Cloud-adopted. No useful local default.' },
    { any: ['meraki'], user: 'Meraki dashboard', pass: 'No local camera login', extra: 'Serial/claim in dashboard. Local web is not the support path.' },
    { any: ['netaxs', 'win-pak', 'pro-watch'], user: 'admin', pass: 'admin (NetAXS factory)', ip: '192.168.1.20 (typical NetAXS)', extra: 'Change on first connect. WIN-PAK/Pro-Watch are Windows logins, not the panel.' },
    { any: ['paxton', 'net2'], user: 'Installer / system engineer', pass: '1234 (classic Net2)', extra: 'Paxton10 is cloud/account. Net2 1234 is the old installer PIN — change it.' },
    { any: ['doorking', '1833', '1834', '1835', '1837'], user: 'Master 9999 or 1234 (by vintage)', pass: '—', extra: 'DKS telephone entry. Confirm the board sticker. 9999 and 1234 are the two you try before the sheet.' },
    { any: ['2n /', '2n ip', 'helios', 'verso'], user: 'admin', pass: '2n', ip: '192.168.1.1', extra: '2N factory admin/2n. Change it. DHCP on some firmware.' },
    { any: ['aiphone', ' ix /', 'jo /', 'jp /'], user: 'admin', pass: '1111 (IX class typical)', ip: '192.168.0.40 (IX typical)', extra: 'IX Series Support Tool. JO/JP analog have no IP login.' },
    { any: ['zkteco', 'inbio', 'atlas'], user: 'admin', pass: 'admin', ip: '192.168.1.201', extra: 'Change immediately. Many inBio boards still ship this.' },
    { any: ['inner range', 'integriti', 'inception'], user: 'Installer per commissioning', pass: '—', extra: 'Inception web default is on the controller sticker / sheet, not a tribal 1234.' },
    { any: ['kantech', 'kt-400', 'kt-1', 'entrapass'], user: 'admin / installer per EntraPass', ip: '192.168.1.2 (KT-400 typical)', extra: 'KT-400 default IP is often 192.168.1.2. EntraPass login is a Windows/site account.' },
    { any: ['mercury', 'lp1502', 'aero', 'x1100'], user: 'Controller web / host software', ip: '192.168.0.251 (common Mercury default)', extra: 'Host software (Lenel, Genetec, Avigilon, Open Options…) owns users. 192.168.0.251 is the board until the host sets DHCP/static.' },
    { any: ['dsx', 'windsx'], user: 'WinDSX operator login (site)', pass: '—', extra: 'No useful camera-style default. The 1040/1042 is a serial/232 brain — software login is the office PC.' },
    { any: ['salto', 'xs4', 'justin'], user: 'Salto software / JustIN mobile', pass: '—', extra: 'Cloud/software credentials. No factory keypad code that opens every XS4.' },
    { any: ['brivo'], user: 'Brivo OnAir / Access (cloud)', pass: '—', extra: 'No local factory admin. Panel is account-claimed.' },
    { any: ['openpath', 'avigilon alta', 'alta cloud'], user: 'Alta / Openpath cloud', pass: '—', extra: 'Smart readers are cloud. No local admin/admin.' },
    { any: ['butterflymx'], user: 'ButterflyMX cloud', pass: '—', extra: 'Property admin is the app, not a local default.' },
    { any: ['pdk', 'prodatakey'], user: 'pdk.io cloud', pass: '—', extra: 'Nodes are cloud-claimed.' },
    { any: ['alarm.com', 'adc '], user: 'Dealer / customer portal', pass: '—', extra: 'Module IMEI/MAC in the dealer portal. No local web default that matters in the field.' },
    { any: ['starlink'], user: 'Napco / StarLink dealer tools', pass: '—', extra: 'Communicator. Programming is panel + dealer, not a camera login.' },
    { any: ['telguard'], user: 'Telguard dealer portal', pass: '—', extra: 'Serial/ICCID in the portal. DIP/default on the board is on the TG sheet.' },
    { any: ['alula'], user: 'Alula dealer portal', pass: '—', extra: 'Connect+/BAT-Fire are account devices.' },
    { any: ['uplink'], user: 'Uplink dealer portal', pass: '—', extra: 'Communicator. No useful local admin.' },
    { any: ['milestone', 'xprotect'], user: 'Windows / XProtect admin (site)', pass: '—', extra: 'No camera-factory login. Management Client is the office account.' },
    { any: ['genetec', 'security center', 'synergis'], user: 'Security Center directory account', pass: '—', extra: 'Synergis/Mercury boards follow the host. No Genetec “admin/admin” on the can.' },
    { any: ['lenels2', 'onguard', 'netbox'], user: 'OnGuard / S2 site account', ip: 'S2 NetBox often 192.168.1.1 on first boot', extra: 'NetBox first-boot IP is on the sticker. OnGuard is a Windows login.' },
    { any: ['c-cure', 'istar'], user: 'C-CURE operator (site)', pass: '—', extra: 'iSTAR is host-programmed. No standing factory user on the board that you should use.' },
    { any: ['gallagher'], user: 'Command Centre operator', pass: '—', extra: 'Controller IP is commissioned. Not a public default password.' },
    { any: ['cdvi', 'atrium'], user: 'admin', pass: 'admin (Atrium typical until changed)', extra: 'Change on first connect. Confirm the K2/Atrium sheet.' },
    { any: ['amag', 'symmetry'], user: 'Symmetry operator (site)', pass: '—', extra: 'M2150 is host-programmed.' },
    { any: ['iei', 'essex'], user: 'Master 1234 (typical older IEI keypad)', pass: '—', extra: 'Many IEI/Essex keypads shipped 1234. Change it. Hub programming is a different code.' },
    { any: ['linear', 'emerge'], user: 'admin', pass: 'admin (eMerge typical)', ip: '192.168.1.1 (typical eMerge)', extra: 'Change immediately. eMerge E3 web UI.' },
    { any: ['keyscan', 'aurora', 'ca4500'], user: 'Aurora / Keyscan operator', pass: '—', extra: 'Controller IP is commissioned. Software login is the office.' },
    { any: ['bosch flexidome', 'autodome', 'flexidome'], user: 'service or live (by vintage)', pass: 'service / live / <blank> (legacy)', extra: 'Modern Bosch IP cameras force a first-boot password. Configuration Manager to find them.' },
    { any: ['panasonic', 'i-pro', 'wv '], user: 'admin', pass: '12345 (legacy i-PRO) or first-boot', extra: 'New i-PRO makes you set a password. Older WV were 12345.' },
    { any: ['pelco', 'sarix', 'spectra'], user: 'admin', pass: 'admin (legacy Sarix) or first-boot', extra: 'Change it. Newer Sarix/Spectra force a unique password.' },
    { any: ['openeye'], user: 'admin', pass: 'admin (legacy Apex/Web Services) or site account', extra: 'OpenEye Web Services is often cloud now. Local recorder defaults were admin/admin — change them.' },
    { any: ['digital watchdog', 'megapix', 'blackjack', 'dw spectrum'], user: 'admin', pass: 'admin (DW Spectrum typical until changed)', extra: 'DW Spectrum client. Change the admin password on first setup.' },
    { any: ['honeywell video', 'maxpro', '35 series'], user: 'admin', pass: '1234 or admin (by recorder vintage)', extra: 'MAXPRO/Performance defaults varied. Confirm the recorder sticker.' },
    { any: ['american dynamics', 'videoedge', 'illustra'], user: 'admin', pass: 'admin or 1234 (legacy Illustra/VideoEdge)', extra: 'Change it. Newer Illustra forces first-boot.' }
  ];

  function defaultsFor(p) {
    if (!p) return null;
    if (p.defaults) return p.defaults;
    var hay = ((p.brand || '') + ' ' + (p.title || '') + ' ' + ((p.tags || []).join(' '))).toLowerCase();
    var i, j, keys;
    for (i = 0; i < DEFAULTS.length; i++) {
      keys = DEFAULTS[i].any || [];
      for (j = 0; j < keys.length; j++) {
        if (hay.indexOf(keys[j].toLowerCase()) >= 0) return DEFAULTS[i];
      }
    }
    return null;
  }

  root.__LAWSONITE_HARDWARE__ = HW;
  root.__LAWSONITE_DEFAULTS_FOR__ = defaultsFor;
})(typeof window !== 'undefined' ? window : globalThis);
