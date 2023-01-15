import { Flex, Image, Text, useMediaQuery } from "@chakra-ui/react";
import s0 from "../assets/seen00.png";
import s1 from "../assets/seen01.png";
import s2 from "../assets/seen02.png";
import s3 from "../assets/seen03.png";
import s4 from "../assets/seen04.png";
import s5 from "../assets/seen05.png";
import s6 from "../assets/seen06.png";

function AsSeenOn() {
  const [isLargerThan500] = useMediaQuery("(min-width: 500px)");
  return (
    <Flex
      fontFamily={"russo one"}
      textTransform="uppercase"
      gap="2rem"
      margin={"auto"}
      padding="2rem 1rem"
      direction={isLargerThan500 ? "row" : "column"}
      background="#140421"
    >
      <Text
        width={"max-content"}
        minWidth="max-content"
        margin={isLargerThan500 ? "initial" : "auto"}
      >
        As seen on
      </Text>
      <Flex gap="1rem" flexWrap={"wrap"} justifyContent="center">
        <Image src={s0} />
        <Image src={s1} />
        <Image src={s2} />
        <Image src={s3} />
        <Image src={s4} />
        <Image src={s5} />
        <Image src={s6} />
      </Flex>
    </Flex>
  );
}

export default AsSeenOn;
