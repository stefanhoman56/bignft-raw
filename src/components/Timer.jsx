import { Flex, Text, Image } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import iconTimer from "../assets/timer.svg";
import { LAUNCH_DATE_UTC } from "../CONTRACT_DETAILS";

function Timer({ isLargerThan500 }) {
  const calculateTimeLeft = () => {
    let difference = +new Date(LAUNCH_DATE_UTC) - +new Date();
    // month - date - year

    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) {
      return;
    }

    timerComponents.push(
      <span>
        {timeLeft[interval]} {interval}{" "}
      </span>
    );
  });

  return (
    <Flex
      fontSize={isLargerThan500 ? "1.2rem" : ".85rem"}
      padding={"0.25rem 1rem"}
      background="-webkit-linear-gradient(0deg, #5CA1FF, #D48EFF)"
      alignItems={"center"}
      justifyContent="center"
      style={{
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
      id="timer"
      minWidth={isLargerThan500 ? "700px" : ""}
    >
      {/* { timerComponents : <span>Time's up!</span>} */}
      {timerComponents.length ? (
        <>
          <Image src={iconTimer} />
          <Flex gap=".5rrem" alignItems={"flex-end"}>
            <Text id="timerdays" fontWeight="black">
              {timeLeft.days < 10 ? `0${timeLeft.days}` : timeLeft.days}
            </Text>
            <Text
              textTransform={"uppercase"}
              marginRight=".5rem"
              fontSize={isLargerThan500 ? ".85rem" : ".6rem"}
              marginBottom=".15rem"
              marginLeft={".15rem"}
            >
              days
            </Text>
            <Text id="timerhrs" fontWeight="black">
              {timeLeft.hours < 10 ? `0${timeLeft.hours}` : timeLeft.hours}
            </Text>
            <Text
              textTransform={"uppercase"}
              marginRight=".5rem"
              fontSize={isLargerThan500 ? ".85rem" : ".6rem"}
              marginBottom=".15rem"
              marginLeft={".15rem"}
            >
              hours
            </Text>
            <Text id="timermins" fontWeight="black">
              {timeLeft.minutes < 10
                ? `0${timeLeft.minutes}`
                : timeLeft.minutes}
            </Text>
            <Text
              textTransform={"uppercase"}
              marginRight=".5rem"
              fontSize={isLargerThan500 ? ".85rem" : ".6rem"}
              marginBottom=".15rem"
              marginLeft={".15rem"}
            >
              mins
            </Text>
            <Text id="timersecs" fontWeight="black">
              {timeLeft.seconds < 10
                ? `0${timeLeft.seconds}`
                : timeLeft.seconds}
            </Text>
            <Text
              textTransform={"uppercase"}
              marginRight=".5rem"
              fontSize={isLargerThan500 ? ".85rem" : ".6rem"}
              marginBottom=".15rem"
              marginLeft={".15rem"}
            >
              secs
            </Text>
            <Text fontSize={isLargerThan500 ? "1rem" : ".85rem"}>
              {" "}
              remaining
            </Text>
          </Flex>
          {/* <Text id="timerdays" fontSize={"5rem"}>
            {timeLeft.days < 10 ? `0${timeLeft.days}` : timeLeft.days}
            {timeLeft.days < 10 ? `0${timeLeft.days}` : timeLeft.days}
          </Text>
          <Text textTransform={"uppercase"} marginBottom="1.5rem">
            days
          </Text>
          <Text id="timerhrs" fontSize={"5rem"}>
            {timeLeft.hours < 10 ? `0${timeLeft.hours}` : timeLeft.hours}
          </Text>
          <Text textTransform={"uppercase"} marginBottom="1.5rem">
            hours
          </Text>
          <Text id="timermins" fontSize={"5rem"}>
            {timeLeft.minutes < 10 ? `0${timeLeft.minutes}` : timeLeft.minutes}
          </Text>
          <Text textTransform={"uppercase"} marginBottom="1.5rem">
            mins
          </Text>
          <Text id="timersecs" fontSize={"5rem"}>
            {timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}
          </Text>
          <Text textTransform={"uppercase"} marginBottom="1.5rem">
            secs
          </Text> */}
        </>
      ) : (
        <Text id="timersecs" fontSize={"5rem"}>
          Time's Up!
        </Text>
      )}
    </Flex>
  );
}

export default Timer;
