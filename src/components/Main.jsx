import { Flex, useMediaQuery } from "@chakra-ui/react";
import AsSeenOn from "./AsSeenOn";
import "./Main.scss";
import Hero from "./Hero";

function Main({
  login,
  setReRender,
  reRender,
  firebaseApp,
  currentPhase,
  currentPhase_loading,
}) {
  const [isLargerThan500] = useMediaQuery("(min-width: 500px)");

  return (
    <>
      <Flex
        as="main"
        justifyContent={"space-around"}
        gap="1rem"
        padding={isLargerThan500 ? "2rem" : "3rem .5rem"}
        flexDirection="column"
        alignItems="center"
        minHeight={"80vh"}
      >
        <Hero
          login={login}
          setReRender={setReRender}
          reRender={reRender}
          firebaseApp={firebaseApp}
          currentPhase={currentPhase}
          currentPhase_loading={currentPhase_loading}
        />
      </Flex>
      <AsSeenOn />
    </>
  );
}

export default Main;
