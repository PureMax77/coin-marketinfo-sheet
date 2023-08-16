export enum CurrencyTypes {
  KRW = "KRW",
  BTC = "BTC",
}

export enum IntervalTypes {
  T1M = "1m",
  T3M = "3m",
  T5M = "5m",
  T10M = "10m",
  T15M = "15m",
  T30M = "30m",
  T1H = "1h",
  T2H = "2h",
  T4H = "4h",
  T6H = "6h",
  T1D = "1d",
  T1W = "1w",
}

export interface CsvInfoType {
  symbol: string;
  market: string;
  year: number;
  month: number;
}
