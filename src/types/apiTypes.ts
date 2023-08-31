export type ChartData = {
  timestamp: number;
  open: string;
  high: string;
  low: string;
  close: string;
  target_volume: string;
  quote_volume: string;
};

export type ChartData_Upbit = {
  market: string;
  candle_date_time_utc: string;
  candle_date_time_kst: string;
  opening_price: number;
  high_price: number;
  low_price: number;
  trade_price: number;
  timestamp: number;
  candle_acc_trade_price: number;
  candle_acc_trade_volume: number;
  prev_closing_price: number;
  change_price: number;
  change_rate: number;
};

export type ChartData_Mexc = {
  openTime: number;
  close: string;
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

export interface SymbolInfo_Mexc {
  symbol: string;
  status: string;
  baseAsset: string;
  baseAssetPrecision: number;
  quoteAsset: string;
  quotePrecision: number;
  quoteAssetPrecision: number;
  baseCommissionPrecision: number;
  quoteCommissionPrecision: number;
  orderTypes: string[];
  quoteOrderQtyMarketAllowed: boolean;
  isSpotTradingAllowed: boolean;
  isMarginTradingAllowed: boolean;
  quoteAmountPrecision: string;
  baseSizePrecision: string;
  permissions: string[];
  filters: any[];
  maxQuoteAmount: string;
  makerCommission: string;
  takerCommission: string;
}

export type coinListRes_Coinone = {
  result: string;
  error_code: string;
  server_time: number;
  currencies: CoinListData[];
};

export type coinListRes_Mexc = {
  exchangeFilters: any[];
  rateLimits: any[];
  serverTime: number;
  symbols: SymbolInfo_Mexc[];
  timezone: string;
};

export type coinListRes_Upbit = {
  market: string;
  korean_name: string;
  english_name: string;
};
