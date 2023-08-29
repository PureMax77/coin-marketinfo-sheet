import { SymbolInfo_Mexc } from "@/types/apiTypes";
import { MexcCoinMapType } from "@/types/commonTypes";

export const coinListFilter = (data: SymbolInfo_Mexc[]): MexcCoinMapType => {
  const result: MexcCoinMapType = new Map();

  data.forEach((item: SymbolInfo_Mexc) => {
    // 현물거래(spot) 아니면 필터
    if (!item.permissions.includes("SPOT")) return;

    const preArray = result.get(item.quoteAsset)!;

    if (preArray) result.set(item.quoteAsset, [...preArray, item.baseAsset]);
    else result.set(item.quoteAsset, [item.baseAsset]);
  });

  // sort
  result.forEach((value, key) => {
    value.sort();
    result.set(key, value);
  });

  return result;
};
