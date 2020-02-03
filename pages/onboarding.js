import React from "react";
import { withApollo } from "../lib/apollo";
import styled from "styled-components";

import { Typography, Container } from "@material-ui/core";

import MainHeader from "../components/MainHeader";
import Title from "../components/Title";

const Subtitle = styled(Typography)`
  && {
    margin: 0;
    width: 100%;
    text-align: center;
    padding-top: 50px;
    font-weight: bold;
  }
`;

const WelcomeToLKB = styled(Container)`
  position: relative;
  min-height: 700px;
  &::after {
    opacity: 0.3;
    background-image: url("/welcomeToLKB.jpeg");
    width: 100%;
    height: 100%;
    background-size: 100%;
    display: block;
    content: "";
    position: absolute;
    top: 0;
    left: 0;
  }
`;

const Description = styled(Typography)`
  && {
    margin: 0;
    width: 100%;
    text-align: center;
  }
`;

const Onboarding = () => {
  return (
    <Container>
      <MainHeader title="Lithium KB - Lithium Knowledge Base" />
      <WelcomeToLKB>
        <Title variant="h4">Welcome to Lithium KB!</Title>
        <Description variant="h6">
          Turn your tribal knowledge into easy-to-find answers.
        </Description>
        <Description variant="h6">
          With Lithium KB, knowledge and collaboration meet to achieve great
          things.
        </Description>
      </WelcomeToLKB>
      <Subtitle variant="h4">Create a source of truth</Subtitle>
      <Description>
        Save time by harnessing your teams' collective knowledge into
        easy-to-find answers for everyone.
      </Description>
    </Container>
  );
};

export default withApollo(Onboarding);
