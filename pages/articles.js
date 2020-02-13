import React, { useState } from "react";
import gql from "graphql-tag";
import styled from "styled-components";
import withAuth from "../lib/jwt";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import ArticleItem from "../components/ArticleItem";

const GET_ROOT_ARTICLES = gql`
  query getRootArticles {
    getRootArticles {
      id
      title
      icon
      content
    }
  }
`;

const CREATE_GET_STARTED_ARTICLE = gql`
  mutation createArticle {
    createArticle(
      input: { title: "Get Started", icon: "?", content: "👋 Welcome!" }
    ) {
      id
      title
      icon
      content
    }
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
    padding-left: 5px;
    height: 100%;
  }
`;

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  toolbar: theme.mixins.toolbar
}));

const Articles = () => {
  const classes = useStyles();

  const [selectedArticle, setSelectedArticle] = useState(null);
  const { loading, error, data } = useQuery(GET_ROOT_ARTICLES);
  const [createGetStartedArticle] = useMutation(CREATE_GET_STARTED_ARTICLE);

  if (loading) return <p>Loading ...</p>;
  if (error) {
    return <p>{"error"}</p>;
  }

  if (data.getRootArticles === 0) {
    createGetStartedArticle();
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <StyledAppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Title variant="h6" noWrap>
            Articles
          </Title>
        </Toolbar>
      </StyledAppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.toolbar} />
        <List>
          {data.getRootArticles.map(article => (
            <ArticleItem article={article}>{console.log(article)}</ArticleItem>
          ))}
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Typography paragraph>
          {selectedArticle ? selectedArticle.content : "No article seleceted"}
        </Typography>
      </main>
    </div>
  );
};

export default withAuth()(Articles);
