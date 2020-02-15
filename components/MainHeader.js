import React from "react";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import HomeIcon from "@material-ui/icons/Home";

import Link from "next/link";
import styled from "styled-components";

const ImageButton = styled(IconButton)`
  width: 5%;
`;

const StyledDiv = styled(Container)`
  && {
    flex-grow: 1;
  }
`;

const Title = styled(Typography)`
  && {
    flex-grow: 1;
    display: "block";
    padding-left: 5px;
    height: 100%;
  }
`;

const MainHeader = () => (
  <StyledDiv>
    <AppBar color="primary" position="fixed">
      <Toolbar>
        <Link href="/">
          <IconButton color="secondary" edge="start" aria-label="home page">
            <HomeIcon />
          </IconButton>
        </Link>
        <Title color="secondary" variant="h6">
          Lithium Knowledge Base
        </Title>
        <Link href="/login">
          <Button color="secondary">Log in</Button>
        </Link>
        <Link href="/signup">
          <Button color="secondary">Sign up</Button>
        </Link>
      </Toolbar>
    </AppBar>
  </StyledDiv>
);

export default MainHeader;
