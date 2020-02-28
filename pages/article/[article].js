import React from "react";
import { useRouter } from "next/router";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

import { fade, makeStyles } from "@material-ui/core/styles";

import withAuth from "../../lib/jwt";
import ArticleContent from "../../components/ArticleContent";
import ArticleListDrawer from "../../components/ArticlesDrawer";

const GET_ARTICLE_WITH_PARENTS = gql`
  query getArticleWithParents($id: ID!) {
    getArticleWithParents(id: $id) {
      id
      title
      content
      createdAt
      updatedAt
    }
  }
`;

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  listRoot: {
    width: "100%",
    maxWidth: 240,
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
    paddingTop: 112 + 40,
    paddingLeft: theme.spacing(30),
    paddingRight: theme.spacing(30),
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
      width: 300,
      "&:focus": {
        width: 400
      }
    }
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  },
  extendedIcon: {
    marginRight: theme.spacing(1)
  },
  toolbar: theme.mixins.toolbar
}));

const Article = props => {
  const classes = useStyles();
  const router = useRouter();

  const articleWithParents = useQuery(GET_ARTICLE_WITH_PARENTS, {
    fetchPolicy: "cache-and-network",
    variables: {
      id: /(.*)\-(\d+)$/.exec(router.query.article)[2]
    }
  });

  const articleTitle = /(.*)\-(\d+)$/.exec(router.query.article)[1];

  return (
    <div className={classes.root}>
      {props.changeTitle(`LKB - ${articleTitle}`)}
      <ArticleListDrawer
        articleWithParents={articleWithParents.data?.getArticleWithParents}
      />
      <main className={classes.content}>
        <ArticleContent
          articleWithParents={articleWithParents.data?.getArticleWithParents}
        />
      </main>
    </div>
  );
};

export default withAuth()(Article);
