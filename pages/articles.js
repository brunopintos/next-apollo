import React from "react";
import ArticlesDrawer from "../components/ArticlesDrawer";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import styled from "styled-components";
import { Container } from "@material-ui/core";

const drawerWidth = 170;

const StyledAppBar = styled(Container)`
  && {
    background-color: Gold;
    width: calc(100% - ${drawerWidth}px);
    margin-left: ${drawerWidth}px;
  }
`;

const Title = styled(Typography)`
  && {
    flex-grow: 1;
    display: "block";
    color: black;
    padding-left: 5px;
    height: 100%;
  }
`;

const Articles = () => {
  let actualArticle = null; //ask the db

  return (
    <div>
      <CssBaseline />
      <StyledAppBar position="fixed">
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" edge="start">
            <MenuIcon />
          </IconButton>
          <Title variant="h6">Articles</Title>
        </Toolbar>
      </StyledAppBar>
      <ArticlesDrawer
        list={[
          { id: 1, icon: "!", name: "ARTICLE 1" },
          { id: 2, icon: "@", name: "ARTICLE 2" },
          { id: 3, icon: "#", name: "ARTICLE 3" },
          { id: 4, icon: "$", name: "ARTICLE 4" }
        ]}
      />
      <main>
        <div />
        <Typography paragraph>Hola</Typography>
      </main>
    </div>
  );
};

export default Articles;
