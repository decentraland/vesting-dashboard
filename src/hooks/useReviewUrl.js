import { useMemo } from "react";
import useOpenInNewTab from "./useOpenInNewTab";

export default function useReviewUrl(address) {
  const reviewUrl = useMemo(() => `${process.env.REACT_APP_REVIEW_CONTRACT_URL}${address}`, [address]);
  const clickHook = useOpenInNewTab();
  const clickHandler = (e) => clickHook(e, reviewUrl);

  return [reviewUrl, clickHandler];
}
