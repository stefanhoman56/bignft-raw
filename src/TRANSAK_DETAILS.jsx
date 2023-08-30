import { isTestnet } from "./CONTRACT_DETAILS";
export const TRANSAK_KYB_IS_DONE = isTestnet ? true : false;
const TRANSAK_API_KEY = isTestnet
  ? "7906b982-ffff-ffff-ffff-72755b441084"
  : "ecb02c15-ffff-ffff-ffff-5ef60ff97ea3";

export const TRANSAK_QUERY_PARAMETERS = `defaultCryptoCurrency=BNB`;
export const TRANSAK_SRC_URL = isTestnet
  ? `https://global-stg.transak.com?apiKey=${TRANSAK_API_KEY}`
  : `https://global.transak.com?apiKey=${TRANSAK_API_KEY}`;
