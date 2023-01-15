import {
  InputGroup,
  NumberInput,
  NumberInputField,
  InputRightAddon,
  Button,
  Text,
  InputLeftAddon,
} from "@chakra-ui/react";
import { IBAT_DECIMALS, NFT_TOKEN_SYMBOL } from "../CONTRACT_DETAILS";

function InputAmount({
  setAmount,
  elID,
  setRightButtonAction,
  placeHolder,
  leftLabel,
  rightLabel,
}) {
  const handleInputAmount = (e) => {
    // console.log(`swap handleInputAmount`);
    // make sure it exists
    if (!e) {
      setAmount(0);
      console.log(`setting input to 0 - ${elID}`);
      console.error(`dev-swap-error with input`);
      return;
    }
    // read the input value
    e = Number(e).toFixed(IBAT_DECIMALS);
    e = parseFloat(e);
    // console.log(e);

    try {
      setAmount(e);
      // console.log(`setAmount - ${e} - ${elID}`);
    } catch (error) {
      console.error(error);
      console.error(`dev-swap inputAmount`);
    }
  };

  return (
    <>
      <InputGroup alignItems="center">
        <InputLeftAddon
          marginX=".5rem"
          position="absolute"
          height="1.5rem"
          left={"0px"}
          borderRadius=".5rem !important"
          textTransform={"uppercase"}
          fontSize=".75rem"
          fontWeight={"normal"}
          bg="#161838"
          padding={".25rem"}
          background="transparent"
        >
          {leftLabel ? leftLabel : NFT_TOKEN_SYMBOL}
        </InputLeftAddon>
        <NumberInput
          min={0}
          placeholder={"0 "}
          clampValueOnBlur={false}
          onChange={(e) => handleInputAmount(e)}
          variant="filled"
          background="rgba(0, 2, 17, 0.3)"
          borderRadius="xl"
          width="100%"
          position={"relative"}
        >
          <NumberInputField
            paddingLeft={"3.5rem"}
            placeholder={
              placeHolder ? placeHolder : `Buying Amount ${NFT_TOKEN_SYMBOL}`
            }
            borderRadius="xl"
            id={elID}
            bg={"#ffffff33"}
          />
        </NumberInput>
        <InputRightAddon
          padding={0}
          marginRight=".5rem"
          position="absolute"
          height="1.5rem"
          right={"0px"}
          borderRadius=".5rem !important"
          children={
            <>
              <Button
                textTransform={"uppercase"}
                fontSize=".75rem"
                fontWeight={"normal"}
                bg="#161838"
                padding={".25rem"}
                background="transparent"
                onClick={setRightButtonAction}
                height="100%"
              >
                <Text color="white">{rightLabel ? rightLabel : "Max"}</Text>
              </Button>
            </>
          }
        />
      </InputGroup>
    </>
  );
}

export default InputAmount;
