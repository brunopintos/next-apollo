import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Link from "next/link";
import Container from "@material-ui/core/Container";
import styled from "styled-components";
import HomeIcon from "@material-ui/icons/Home";

const ImageButton = styled(IconButton)`
  width: 5%;
`;

const StyledDiv = styled(Container)`
  && {
    flex-grow: 1;
  }
`;

const StyledAppBar = styled(AppBar)`
  && {
    background-color: Gold;
  }
`;

const Title = styled(Typography)`
  && {
    flex-grow: 1;
    display: "block";
    color: black;
  }
`;

const MainHeader = () => (
  <StyledDiv>
    <StyledAppBar position="static">
      <Toolbar>
        <Link href="/">
          <ImageButton aria-label="home page">
            <HomeIcon />
          </ImageButton>
        </Link>
        <Title variant="h6">KB - Knowledge Base</Title>
        <Link href="/login">
          <Button>Log in</Button>
        </Link>
        <Link href="/signup">
          <Button>Sign up</Button>
        </Link>
      </Toolbar>
    </StyledAppBar>
  </StyledDiv>
);

export default MainHeader;
