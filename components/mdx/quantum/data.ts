// Numbers from the Group 15 report, "Quantum Circuit Optimisation for ECDSA Point Addition"
// (NTU, Nov 2026). Q = peak live logical qubits, T = mean executed Toffoli gates, S = Q × T.

export type Milestone = {
  run: string;
  change: string;
  q: number;
  t: number;
  s: number;
  /** Improvement vs. the original circuit P0, in %. */
  impr: number;
  /** The student ruling that opened this stage, if any. */
  call?: string;
};

export const MILESTONES: Milestone[] = [
  { run: 'P0', change: 'Original challenge circuit', q: 2715, t: 3942753, s: 10704574395, impr: 0 },
  {
    run: 'P0′',
    change: 'Re-baselined under a strict 10⁻⁹ failure budget: iteration caps raised so no input fails by luck',
    q: 2743,
    t: 4176969,
    s: 11457425967,
    impr: -7.0
  },
  { run: 'H4.A9', change: 'Fused swaps, measured flags, folds using p = 2²⁵⁶ − c', q: 2616, t: 3044812, s: 7965228192, impr: 25.6 },
  {
    run: 'H4.A10',
    change: 'Register widths fitted to measured tails',
    q: 2616,
    t: 2550049,
    s: 6670928184,
    impr: 37.7,
    call: 'Allow widths fitted to measured tails, inside the failure budget.'
  },
  { run: 'H4.A17', change: 'Register lifetimes: qubits live only while they hold information', q: 1970, t: 2704242, s: 5327356740, impr: 50.2 },
  {
    run: 'H4.A23',
    change: 'Record-and-replay divide/multiply: the λ register is gone',
    q: 1750,
    t: 2155507,
    s: 3772137250,
    impr: 64.8,
    call: 'Allow published literature.'
  },
  {
    run: 'H5.A1',
    change: 'Ping-pong GCD: a replay round drops from ~1,270 to ~400 Toffolis',
    q: 1565,
    t: 1196648,
    s: 1872754120,
    impr: 82.5,
    call: 'Allow the competition paper and set a 0.8 × 10⁹ target.'
  },
  { run: 'H5.A3', change: 'Chunked replay adder, joined by one measured carry qubit', q: 1435, t: 1210119, s: 1736520765, impr: 83.8 },
  {
    run: 'H5.A5',
    change: '10⁻⁷ failure budget plus final trims',
    q: 1404,
    t: 1128023,
    s: 1583744292,
    impr: 85.2,
    call: 'Relax the failure budget to 10⁻⁷ per term.'
  }
];

/** Leaderboard best on 27 Oct 2026 (Table 2). */
export const LEADERBOARD = { q: 1234, t: 741659, s: 915207206 };

export const PROTOCOLS = [
  { label: 'Agent alone, direct prompt', attempts: 10, impr: 22.44, exact: 5.18 },
  { label: 'Agent alone, master prompt', attempts: 10, impr: 35.14, exact: 33.37 },
  { label: 'Agent steered by me', attempts: 38, impr: 85.2, mine: true }
] as const;

export const MECHANISMS = [
  { label: 'Algorithm change', detail: 'record-and-replay, ping-pong GCD', share: 52.8, by: 'student' },
  { label: 'Exact gate-level savings', detail: 'fused swaps, measured uncomputation, folds', share: 16.8, by: 'agent' },
  { label: 'Qubit lifetimes', detail: 'allocate late, free early, split adder', share: 16.8, by: 'both' },
  { label: 'Probabilistic widths and round counts', detail: 'sized from measured tails', share: 13.6, by: 'student' }
] as const;
