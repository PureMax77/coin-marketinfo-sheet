import { coinListRes_Upbit } from "@/types/apiTypes";
import { UpbitCoinMapType } from "@/types/commonTypes";

export const coinListFilter = (data: coinListRes_Upbit[]): UpbitCoinMapType => {
  const result: UpbitCoinMapType = new Map();

  data.forEach((item: coinListRes_Upbit) => {
    const [market, symbol] = item.market.split("-");

    const preArray = result.get(market)!;

    if (preArray) result.set(market, [...preArray, symbol]);
    else result.set(market, [symbol]);
  });

  // sort
  result.forEach((value, key) => {
    value.sort();
    result.set(key, value);
  });

  return result;
};
