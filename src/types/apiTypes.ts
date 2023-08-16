export type ChartData = {
  timestamp: number;
  open: string;
  high: string;
  low: string;
  close: string;
  target_volume: string;
  quote_volume: string;
};

export type CandleChartRes = {
  result: string;
  error_code: string;
  is_last: boolean;
  chart: ChartData[];
};

export type CoinListData = {
  name: string;
  symbol: string;
  deposit_status: string;
  withdraw_status: string;
  deposit_confirm_count: number;
  max_precision: number;
  deposit_fee: string;
  withdrawal_min_amount: string;
  withdrawal_fee: string;
};

export type coinListRes = {
  result: string;
  error_code: string;
  server_time: number;
  currencies: CoinListData[];
};
