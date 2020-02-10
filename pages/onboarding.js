import React from "react";
import styled from "styled-components";
import Link from "next/link";
import withAuth from "../lib/jwt";

import MainHeader from "../components/MainHeader";
import Title from "../components/Title";
import Layout from "../components/Layout";

import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";

const Subtitle = styled(Typography)`
  && {
    margin: 0;
    width: 100%;
    text-align: center;
    color: #fff;
    position: relative;
  }
`;

const StyledImage = styled.img`
  margin: auto;
  width: 80%;
  padding-top: 4%;
  display: block;
`;

const StyledContainer = styled(Container)`
  && {
    width: 80%;
    padding-bottom: 50px;
  }
`;

const StyledButton = styled(Button)`
  && {
    background-color: Gold;
    display: block;
    margin-top: 5%;
    margin-left: auto;
    margin-right: auto;
  }
`;

const Onboarding = () => {
  return (
    <Layout>
      <MainHeader title="Lithium KB - Lithium Knowledge Base" />
      <Title variant="h3">Welcome to Lithium KB!</Title>
      <Subtitle variant="h5">
        Create articles to start sharing knowledge with your partners!
      </Subtitle>
      <Link href="/articles">
        <StyledButton aria-label="Continue">Let's Go!</StyledButton>
      </Link>
      <StyledContainer>
        <StyledImage
          src="/lkbScreenRecord.gif"
          alt="lithium kb screen record"
        />
      </StyledContainer>
    </Layout>
  );
};

export default withAuth(["USER", "ADMIN"])(Onboarding);
