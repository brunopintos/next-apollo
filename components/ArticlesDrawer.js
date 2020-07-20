import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

import PropTypes from "prop-types";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AddIcon from "@material-ui/icons/Add";
import Typography from "@material-ui/core/Typography";

import DialogCreateArticle from "./DialogCreateArticle";
import ArticleItem from "./ArticleItem";
import ArticlesHeader from "./ArticlesHeader";

import GET_ARTICLE_WITH_PARENTS from "../core/getArticleWithParents";
import GET_ROOT_ARTICLES from "../core/getRootArticles";
import GET_USER_FAVORITES from "../core/getUserFavorites";

const drawerWidth = 240;

const StyledList = styled(List)`
  && {
    width: 100%,
    maxWidth: ${drawerWidth}
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

const StyledAppBar = styled(AppBar)`
  && {
    width: ${drawerWidth};
  }
`;

const StyledTab = styled(Tab)`
  && {
    max-width: 50%;
    min-width: 50%;
  }
`;

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
  drawer: {
    width: drawerWidth,
    maxWidth: drawerWidth,
    flexShrink: 0,
    zIndex: 1150
  },
  drawerPaper: {
    width: drawerWidth,
    maxWidth: drawerWidth
  },
  toolbar: theme.mixins.toolbar
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <div p={3}>{children}</div>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}

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
  const [tabValue, setTabValue] = useState(0);

  const handleDialog = (newParentId, newDialogValue, newDialogOpen) => {
    setParentId(newParentId);
    setDialogValue(newDialogValue);
    setDialogOpen(newDialogOpen != null ? newDialogOpen : !dialogOpen);
  };

  const handleParentChange = () => {
    rootArticles.refetch();
    setToggleRefetch(!toggleRefetch);
  };

  const handleTabChange = (event, newTabValue) => {
    rootArticles.refetch();
    favoriteArticles.refetch();
    setTabValue(newTabValue);
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
          <div className={classes.toolbar} />
          <div className={classes.root}>
            <StyledAppBar position="static">
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                indicatorColor="secondary"
                textColor="secondary"
                variant="standard"
              >
                <StyledTab label="All Articles" wrapping {...a11yProps(0)} />
                <StyledTab label="Favorites" wrapping {...a11yProps(1)} />
              </Tabs>
            </StyledAppBar>
            <TabPanel value={tabValue} index={0}>
              <StyledList>
                {rootArticles.data?.getRootArticles.map(article => (
                  <div className={classes.drawerPaper}>
                    <ArticleItem
                      handleDialog={handleDialog}
                      handleParentChange={handleParentChange}
                      dragNDroppable={true}
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
                  </div>
                ))}
              </StyledList>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <StyledList>
                {favoriteArticles.data?.getUserFavorites.map(article => (
                  <div className={classes.drawerPaper}>
                    <ArticleItem
                      handleDialog={handleDialog}
                      handleParentChange={handleParentChange}
                      dragNDroppable={true}
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
                  </div>
                ))}
              </StyledList>
            </TabPanel>
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
