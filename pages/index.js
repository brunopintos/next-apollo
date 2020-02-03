import React, { useState } from "react";
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

const StyledImage = styled.img`
  margin: 0;
  width: 100%;
  padding-top: 20px;
`;

const StyledContainer = styled(Container)`
  && {
    width: 80%;
  }
`;

const Welcome = () => {
  return (
    <Container>
      <MainHeader title="Lithium KB - Lithium Knowledge Base" />
      <StyledContainer>
        <Title variant="h3">Welcome to Lithium KB!</Title>
        <Subtitle variant="h5">
          Turn your tribal knowledge into easy-to-find answers!
        </Subtitle>
        <StyledImage
          src="/lkbScreenRecord.gif"
          alt="lithium kb screen record"
        />
      </StyledContainer>
    </Container>
  );
};

export default withApollo(Welcome);
