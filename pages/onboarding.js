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
    padding-top: 20px;
    text-align: center;
  }
`;

const Description = styled(Typography)`
  && {
    margin: 0;
    width: 100%;
    padding-top: 20px;
    text-align: center;
  }
`;

const Onboarding = () => {
  return (
    <Container>
      <MainHeader title="KB - Knowledge Base" />
      <Title variant="h3">Welcome to KB!</Title>
      <Subtitle variant="h5">
        Turn your tribal knowledge into easy-to-find answers.
      </Subtitle>
      <Subtitle variant="h5">
        KB is all you need, let's start creating articles!
      </Subtitle>
      <Description variant="h6"></Description>
    </Container>
  );
};

export default withApollo(Onboarding);
