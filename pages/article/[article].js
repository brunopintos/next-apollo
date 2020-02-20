import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import gql from "graphql-tag";
import styled from "styled-components";
import withAuth from "../../lib/jwt";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { fade, makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import ArticleItem from "../../components/ArticleItem";
import InputBase from "@material-ui/core/InputBase";
import RichText from "../../components/RichText";
import Button from "@material-ui/core/Button";

const GET_ARTICLE = gql`
  query getArticle($id: ID!) {
    getArticle(id: $id) {
      id
      title
      content
      updatedAt
    }
  }
`;

const GET_ROOT_ARTICLES = gql`
  query getRootArticles {
    getRootArticles {
      id
      title
      icon
      content
      parent {
        id
      }
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
    padding-left: 5px;
    height: 100%;
  }
`;

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  listRoot: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    zIndex: 1150
  },
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    backgroundColor: "white"
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto"
    }
  },
  searchIcon: {
    width: theme.spacing(7),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "black"
  },
  inputRoot: {
    color: "black"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: 120,
      "&:focus": {
        width: 200
      }
    }
  },
  toolbar: theme.mixins.toolbar
}));

const Article = props => {
  const classes = useStyles();
  const router = useRouter();

  const rootArticles = useQuery(GET_ROOT_ARTICLES);
  const article = useQuery(GET_ARTICLE, {
    fetchPolicy: "cache-and-network",
    variables: {
      id: /(.*)\-(\d+)$/.exec(router.query.article)[2]
    }
  });

  const thisArticle = article.data?.getArticle;
  const articleTitle = /(.*)\-(\d+)$/.exec(router.query.article)[1];

  return (
    <div className={classes.root}>
      {props.changeTitle(`LKB - ${articleTitle}`)}
      <CssBaseline />
      <StyledAppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Title color="secondary" variant="h6">
            {articleTitle}
          </Title>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon color="secondary" />
            </div>
            <InputBase
              color="secondary"
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput
              }}
              inputProps={{ "aria-label": "search" }}
            />
          </div>
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
        <List className={classes.listRoot}>
          {rootArticles.data?.getRootArticles.map(article => (
            <ArticleItem article={article} selectedArticle={thisArticle?.id} />
          ))}
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <RichText article={thisArticle} />
      </main>
    </div>
  );
};

export default withAuth()(Article);
