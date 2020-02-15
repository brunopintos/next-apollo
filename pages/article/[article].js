import { useRouter } from "next/router";
import React, { useState } from "react";
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
import Button from "@material-ui/core/Button";
import InputBase from "@material-ui/core/InputBase";
import RichText from "../../components/RichText";

const GET_ARTICLE = gql`
  query getArticle($id: ID!) {
    getArticle(id: $id) {
      id
      title
      content
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

// const CREATE_GET_STARTED_ARTICLE = gql`
//   mutation createArticle {
//     createArticle(
//       input: { title: "Get Started", icon: "?", content: "👋 Welcome!" }
//     ) {
//       id
//       title
//       icon
//       content
//     }
//   }
// `;

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
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
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

const Article = () => {
  const classes = useStyles();
  const router = useRouter();

  const idRegEx = /(.*)\-(\d+)$/;
  const [articleTitleId, articleTitle, articleId] = idRegEx.exec(
    router.query.article
  );

  const rootArticles = useQuery(GET_ROOT_ARTICLES);
  const article = useQuery(GET_ARTICLE, {
    variables: {
      id: articleId
    }
  });
  // const [createGetStartedArticle] = useMutation(CREATE_GET_STARTED_ARTICLE);

  if (rootArticles.loading || article.loading) return <p>Loading ...</p>;
  if (rootArticles.error || article.error) {
    return (
      <>
        <p>{rootArticles.error?.message}</p>
        <p>{article.error?.message}</p>
      </>
    );
  }

  // if (data.getRootArticles === 0) {
  //   createGetStartedArticle();
  // }

  const thisArticle = article.data.getArticle;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <StyledAppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Title variant="h6" noWrap>
            {articleTitle}
          </Title>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
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
          {rootArticles.data.getRootArticles.map(article => (
            <ArticleItem article={article} selectedArticle={thisArticle.id} />
          ))}
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <RichText />
        <Typography paragraph>
          {thisArticle.content ? thisArticle.content : "No article seleceted"}
        </Typography>
      </main>
    </div>
  );
};

export default withAuth()(Article);
