import React from "react";
import gql from "graphql-tag";
import styled from "styled-components";
import withAuth from "../lib/jwt";
import { useQuery } from "@apollo/react-hooks";

import ArticlesSideBar from "../components/ArticlesSideBar";

import CssBaseline from "@material-ui/core/CssBaseline";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

const GET_USER_ARTICLES = gql`
  query getUserArticles {
    getUserArticles {
      id
      title
      icon
      content
    }
  }
`;

const StyledDiv = styled.div`
  && {
    flex-grow: 1;
  }
`;

const StyledAppBar = styled(Container)`
  && {
    background-color: Gold;
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
  const { loading, error, data } = useQuery(GET_USER_ARTICLES);
  if (loading) return <p>Loading ...</p>;
  if (error) {
    return <p>hola</p>;
  }

  return (
    <StyledDiv>
      <CssBaseline />
      <StyledAppBar position="fixed">
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" edge="start">
            <MenuIcon />
          </IconButton>
          <Title variant="h6">Articles</Title>
        </Toolbar>
      </StyledAppBar>
      <ArticlesSideBar list={data.getUserArticles} />
      {/* <main>
        <div />
        <Typography paragraph>Hola</Typography>
      </main> */}
    </StyledDiv>
  );
};

export default withAuth()(Articles);
