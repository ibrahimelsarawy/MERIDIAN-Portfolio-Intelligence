export type AllocationTarget = { name: string; current: number; target: number; value: number };
export type RebalanceAction = 'BUY' | 'SELL' | 'HOLD';
export type RebalanceRow = AllocationTarget & { drift: number; action: RebalanceAction; tradeValue: number };
