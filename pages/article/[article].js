import React from "react";
import { useRouter } from "next/router";

import { makeStyles } from "@material-ui/core/styles";

import withAuth from "../../lib/jwt";
import ArticleContent from "../../components/ArticleContent";
import ArticleDrawer from "../../components/ArticlesDrawer";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  content: {
    flexGrow: 1,
    paddingTop: 112 + 40,
    paddingLeft: theme.spacing(30),
    paddingRight: theme.spacing(30),
    backgroundColor: "white"
  }
}));

const Article = props => {
  const classes = useStyles();
  const router = useRouter();

  const articleTitle = /(.*)\-(\d+)$/.exec(router.query.article)[1];

  return (
    <div className={classes.root}>
      {props.changeTitle(`LKB - ${articleTitle}`)}
      <ArticleDrawer articleId={/(.*)\-(\d+)$/.exec(router.query.article)[2]} />
      <main className={classes.content}>
        <ArticleContent
          articleId={/(.*)\-(\d+)$/.exec(router.query.article)[2]}
        />
      </main>
    </div>
  );
};

export default withAuth()(Article);
