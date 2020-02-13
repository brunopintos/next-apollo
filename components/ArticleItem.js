import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";

const GET_SUB_ARTICLES = gql`
  query getSubArticles($id: ID!) {
    getSubArticles(id: $id) {
      id
      title
      icon
      content
    }
  }
`;

const ArticleItem = ({ article }) => {
  const [open, setOpen] = useState(false);
  const { loading, error, data } = useQuery(GET_SUB_ARTICLES, {
    variables: {
      id: article.id
    }
  });

  if (loading) return <p>Loading ...</p>;
  if (error) {
    return <p>{error.message}</p>;
  }

  const handleClick = () => {
    setOpen(!open);
  };

  if (article) {
    return (
      <>
        <ListItem button key={article.id} onClick={handleClick}>
          <ListItemText primary={article.icon} />
          <ListItemText primary={article.title} />
          {data.getSubArticles.length > 0 &&
            (open ? <ExpandLess /> : <ExpandMore />)}
        </ListItem>
        {data.getSubArticles.map(article => (
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ArticleItem article={article} />
            </List>
          </Collapse>
        ))}
      </>
    );
  } else {
    return <></>;
  }
};

export default ArticleItem;
