import { Flex, Text } from "@chakra-ui/react";
import React, { useCallback } from "react";
import { ref, getDatabase } from "firebase/database";
import { useObject } from "react-firebase-hooks/database";
import { ABI_BATSPresale_MATIC, MATIC_NFT_CONTRACT_ADDRESS, PolygonMainRPCUrl, TOTAL_AMOUNT_TO_RAISE } from "../CONTRACT_DETAILS";
import { ethers } from 'ethers';
import { wait } from "@testing-library/react";
import { async } from "@firebase/util";
import { useEffect } from "react";
import { AstPath } from "prettier";

function ProgressBar2({ isLargerThan500, firebaseApp, currentPhase }) {
  const database = getDatabase(firebaseApp);
  // const realtimeDBVal = "presaleProgressBarTest";
  const realtimeDBValProgressBar = "presaleProgressBar";
  const realtimeDBValTokensSold = "tokensSold";

  const [supply, setSupply] = React.useState();

  const [progressBarVal, progressBarVal_loading] = useObject(
    ref(database, realtimeDBValProgressBar)
  );
  const [tokensSold, tokensSold_loading] = useObject(
    ref(database, realtimeDBValTokensSold)
  );

  const defaultProvider = new ethers.providers.JsonRpcProvider(PolygonMainRPCUrl);
  const readContract = new ethers.Contract(MATIC_NFT_CONTRACT_ADDRESS, ABI_BATSPresale_MATIC, defaultProvider);
  useEffect(async () => {
    const res = await readContract.totalTokensForPresale();
    setSupply(Number(res["_hex"]) + TOTAL_AMOUNT_TO_RAISE.total);
  }, [])

  return (
    <>
      <Flex
        direction={"column"}
        alignItems="flex-end"
        padding={isLargerThan500 ? "1rem 3rem" : ".5rem"}
      >
        <progress
          className="progress__bar"
          value={tokensSold ? tokensSold.val() : 0}
          max={TOTAL_AMOUNT_TO_RAISE.total}
          style={{ width: "100%", margin: "1rem auto" }}
        ></progress>
        <Flex gap=".35rem">
          <Text>Progress</Text>
          <Text fontWeight={"black"}>
            {!progressBarVal_loading &&
              progressBarVal &&
              `${Number(progressBarVal.val()) < 1 ? "<1" : progressBarVal.val()
              }%`}
          </Text>
          <Text>
            (
            {!tokensSold_loading &&
              tokensSold &&
              `$${Number(tokensSold.val()).toLocaleString()} `}
            /{` $${supply}`})
          </Text>
        </Flex>
      </Flex>
    </>
  );
}

export default ProgressBar2;
