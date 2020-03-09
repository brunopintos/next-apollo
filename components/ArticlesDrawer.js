import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import AddIcon from "@material-ui/icons/Add";

import DialogCreateArticle from "./DialogCreateArticle";
import ArticleItem from "./ArticleItem";
import ArticlesHeader from "./ArticlesHeader";

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

const GET_USER_FAVORITES = gql`
  query getUserFavorites {
    getUserFavorites {
      id
    }
  }
`;

const StyledList = styled(List)`
  && {
    width: 100%,
    maxWidth: 240px,
  }
`;

const ItemsContainer = styled.div`
  && {
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: space-between;
  }
`;

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  listRoot: {
    width: "100%",
    maxWidth: drawerWidth,
    backgroundColor: theme.palette.background.paper
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    zIndex: 1150
  },
  drawerPaper: {
    width: drawerWidth
  },
  toolbar: theme.mixins.toolbar
}));

const ArticlesDrawer = ({ articleId }) => {
  const classes = useStyles();
  const rootArticles = useQuery(GET_ROOT_ARTICLES);
  const favoriteArticles = useQuery(GET_USER_FAVORITES);
  const articleWithParents = useQuery(GET_ARTICLE_WITH_PARENTS, {
    fetchPolicy: "cache-and-network",
    variables: {
      id: articleId
    }
  });

  const [expandedByArticleOpen, setExapandedByArticleOpen] = useState(
    articleWithParents.data?.getArticleWithParents.filter(
      parent => parent.id === articleId
    ).length !== 0 &&
      articleWithParents.data?.getArticleWithParents[
        articleWithParents.data?.getArticleWithParents.length - 1
      ].id !== articleId
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogValue, setDialogValue] = useState("");
  const [parentId, setParentId] = useState(null);
  const [toggleRefetch, setToggleRefetch] = useState(false);

  const handleDialog = (newParentId, newDialogValue, newDialogOpen) => {
    setParentId(newParentId);
    setDialogValue(newDialogValue);
    setDialogOpen(newDialogOpen != null ? newDialogOpen : !dialogOpen);
  };

  const handleParentChange = () => {
    rootArticles.refetch();
    setToggleRefetch(!toggleRefetch);
  };

  return (
    <>
      <ArticlesHeader handleDialog={handleDialog} />
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <ItemsContainer>
          <div>
            <div className={classes.toolbar} />
            <StyledList>
              {rootArticles.data?.getRootArticles.map(article => (
                <ArticleItem
                  handleDialog={handleDialog}
                  handleParentChange={handleParentChange}
                  toggleRefetch={toggleRefetch}
                  article={article}
                  expandedByArticleOpen={expandedByArticleOpen}
                  articleWithParents={
                    expandedByArticleOpen
                      ? articleWithParents.data?.getArticleWithParents
                      : null
                  }
                  favorites={favoriteArticles.data?.getUserFavorites}
                />
              ))}
            </StyledList>
          </div>
          <div>
            <Divider />
            <StyledList>
              <ListItem button onClick={() => handleDialog(null, "", true)}>
                <ListItemIcon>
                  <AddIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="New article" />
              </ListItem>
            </StyledList>
          </div>
        </ItemsContainer>
      </Drawer>
      <DialogCreateArticle
        parentId={parentId}
        handleDialog={handleDialog}
        dialogOpen={dialogOpen}
        dialogValue={dialogValue}
      />
    </>
  );
};

export default ArticlesDrawer;
