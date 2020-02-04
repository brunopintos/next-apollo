import React from "react";
import { withApollo } from "../lib/apollo";
import styled from "styled-components";

import { Typography, Container } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";

import Link from "next/link";
import MainHeader from "../components/MainHeader";
import Title from "../components/Title";
import Layout from "../components/Layout";

const Subtitle = styled(Typography)`
  && {
    margin: 0;
    width: 100%;
    text-align: center;
    padding-top: 10%;
    font-weight: bold;
    color: #fff;
  }
`;

const StyledTitle = styled(Title)`
  && {
    padding-top: 20%;
  }
`;

const WelcomeToLKB = styled(Container)`
  position: relative;
  min-height: 100%;
  display: block;
  z-index: 1;
  &::before {
    content: "";
    background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
      url("/welcomeToLKB.jpeg");
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-position: center;
    position: absolute;
    background-size: cover;
  }
`;

const OnboardingDescription = styled(Container)`
  position: relative;
  min-height: 500px;
  display: block;
  z-index: 1;
  margin: auto;
  text-align: center;
`;

const Description = styled(Typography)`
  && {
    margin: 0;
    width: 100%;
    text-align: center;
    color: #fff;
    position: relative;
  }
`;

const Arrow = styled.img`
  padding-top: 20%;
  position: relative;
  display: block;
  width: 10%;
  bottom: 0;
  right: 45%;
  left: 45%;
`;

const StyledCard = styled(Card)`
  margin: 1.5%;
  margin-top: 10%;
  max-width: 30%;
  display: inline-block; /* si estoy en celular esto se tiene que borrar asi pasan a estar en fila hacia abajo*/
`;

const Welcome = () => {
  return (
    <Layout>
      <MainHeader title="Lithium KB - Lithium Knowledge Base" />
      <WelcomeToLKB>
        <StyledTitle variant="h3">Welcome to Lithium KB!</StyledTitle>
        <Description variant="h6">
          Turn your tribal knowledge into easy-to-find answers.
        </Description>
        <Description variant="h6">
          With Lithium KB, knowledge and collaboration meet to achieve great
          things.
        </Description>
        <Arrow src="/doubleArrowBottom.png" alt=""></Arrow>
      </WelcomeToLKB>
      <OnboardingDescription>
        <StyledCard>
          <CardActionArea>
            <CardMedia
              component="img"
              alt="Books"
              height="140"
              image="/sourceOfTruth.jpeg"
              title="Source of Truth"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Create a source of truth
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Save time by harnessing your teams' collective knowledge into
                easy-to-find answers for everyone!
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button size="small" color="primary">
              Share
            </Button>
            <Button size="small" color="primary">
              Learn More
            </Button>
          </CardActions>
        </StyledCard>
        <StyledCard>
          <CardActionArea>
            <CardMedia
              component="img"
              alt="Team sharing information and having fun"
              height="140"
              image="/informationSharing.jpeg"
              title="Information Sharing"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Inspire information sharing
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Encourage all your teams to share knowledge and strengthen
                company culture!
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button size="small" color="primary">
              Share
            </Button>
            <Button size="small" color="primary">
              Learn More
            </Button>
          </CardActions>
        </StyledCard>
        <StyledCard>
          <CardActionArea>
            <CardMedia
              component="img"
              alt="Lithium Knowledge Base get started screenshot"
              height="140"
              image="/lkbScreenshot.png"
              title="Lithium KB get started screenshot"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Use templates
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Accelerate your learning curve and start working smoothly by
                using our templates!
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button size="small" color="primary">
              Share
            </Button>
            <Link href="/login">
              <Button size="small" color="primary">
                Let's Go
              </Button>
            </Link>
          </CardActions>
        </StyledCard>
      </OnboardingDescription>
    </Layout>
  );
};

export default withApollo(Welcome);
