import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { useDrag, useDrop } from "react-dnd";
import { useSnackbar } from "notistack";
import Link from "next/link";
import gql from "graphql-tag";

import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import AddIcon from "@material-ui/icons/Add";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";

const GET_SUB_ARTICLES = gql`
  query getSubArticles($id: ID!) {
    getSubArticles(id: $id) {
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

const FAVORITE_ARTICLE = gql`
  mutation favoriteArticle($id: ID!) {
    favoriteArticle(id: $id) {
      id
    }
  }
`;

const UNFAVORITE_ARTICLE = gql`
  mutation unfavoriteArticle($id: ID!) {
    unfavoriteArticle(id: $id)
  }
`;

const MOVE_ARTICLE = gql`
  mutation moveArticle($subArticleId: ID!, $parentId: ID!) {
    moveArticle(input: { subArticleId: $subArticleId, parentId: $parentId }) {
      id
      title
      icon
      content
    }
  }
`;

const ItemContent = styled.div`
  && {
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
  }
`;

const ItemButtonsContent = styled.div`
  && {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    align-items: center;
  }
`;

const StyledListItem = styled(ListItem)`
  && {
    padding: 8px;
  }
`;

const ItemExpandAndTextContent = styled.div`
  && {
    display: flex;
    justify-content: flex-start;
    width: 100%;
    ${StyledListItem}:hover & {
      max-width: 67%;
    }
    align-items: center;
  }
`;

const StyledIconButtonWithHover = styled(IconButton)`
  && {
    opacity: 0;
    padding: 1px;
    ${StyledListItem}:hover & {
      opacity: 1;
    }
  }
`;

const StyledIconButton = styled(IconButton)`
  && {
    padding: 1px;
  }
`;

const useStyles = makeStyles(theme => ({
  nested: {
    paddingLeft: theme.spacing(4)
  }
}));

const ItemTypes = {
  ARTICLE: "article"
};

const ArticleItem = ({
  handleDialog,
  handleParentChange,
  dragNDroppable,
  article,
  toggleRefetch,
  expandedByArticleOpen,
  articleWithParents,
  favorites
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [favorite, setFavorite] = useState(
    favorites?.filter(favoriteArticle => favoriteArticle.id == article?.id)
      .length !== 0
  );
  const [expanded, setExpanded] = useState(expandedByArticleOpen);

  useEffect(() => {
    setFavorite(
      favorites?.filter(favoriteArticle => favoriteArticle.id == article?.id)
        .length !== 0
    );
  }, [article, favorites]);
  useEffect(() => {
    expandedByArticleOpen && setExpanded(expandedByArticleOpen);
  }, [article, expandedByArticleOpen]);
  useEffect(() => {
    subArticles.refetch();
  }, [article, toggleRefetch]);

  const subArticles = useQuery(GET_SUB_ARTICLES, {
    variables: {
      id: article.id
    }
  });

  const [favoriteArticle] = useMutation(FAVORITE_ARTICLE);
  const [unfavoriteArticle] = useMutation(UNFAVORITE_ARTICLE);
  const [moveArticle] = useMutation(MOVE_ARTICLE);

  const [{ isDragging }, drag] = useDrag({
    item: { id: article?.id, title: article?.title, type: ItemTypes.ARTICLE },
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    })
  });

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.ARTICLE,
    drop: dragObject => {
      moveArticle({
        variables: {
          subArticleId: dragObject.id,
          parentId: article.id
        }
      })
        .then(() => {
          enqueueSnackbar(`${dragObject?.title} moved to ${article?.title}!!`, {
            variant: "success"
          });
          handleParentChange();
          subArticles.refetch();
        })
        .catch(err => {
          enqueueSnackbar(err?.graphQLErrors?.[0].message, {
            variant: "error"
          });
        });
    },
    collect: monitor => ({
      isOver: !!monitor.isOver()
    })
  });

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleFavorite = () => {
    if (favorite) {
      unfavoriteArticle({
        variables: {
          id: article.id
        }
      });
    } else {
      favoriteArticle({
        variables: {
          id: article.id
        }
      });
    }
    setFavorite(!favorite);
  };

  const isArticleSelected = article =>
    articleWithParents?.[articleWithParents.length - 1] === article?.id;

  return (
    <div
      ref={dragNDroppable && drag}
      style={{ opacity: isDragging ? 0.5 : 1, overflowX: "hidden" }}
    >
      <StyledListItem
        ref={dragNDroppable && drop}
        style={{
          backgroundColor: isOver ? "#ffd600" : "transparent"
        }}
        key={article?.id}
        selected={isArticleSelected(article)}
      >
        <ItemContent>
          <ItemExpandAndTextContent style={{ maxWidth: favorite && "67%" }}>
            {subArticles.data?.getSubArticles.length > 0 &&
              (expanded ? (
                <ExpandLess color="primary" onClick={handleExpandClick} />
              ) : (
                <ExpandMore color="primary" onClick={handleExpandClick} />
              ))}
            <Link
              href="/article/[article]"
              as={`/article/${article?.title}-${article?.id}`}
            >
              <Tooltip title={article?.title}>
                <ListItemText
                  color="secondary"
                  disableTypography
                  primary={<Typography noWrap>{article?.title}</Typography>}
                />
              </Tooltip>
            </Link>
          </ItemExpandAndTextContent>
          <ItemButtonsContent>
            <StyledIconButtonWithHover
              color="primary"
              aria-label="delete"
              onClick={() => handleDialog(article?.id, "", true)}
            >
              <AddIcon />
            </StyledIconButtonWithHover>
            {favorite ? (
              <StyledIconButton
                color="primary"
                aria-label="favorite"
                onClick={handleFavorite}
              >
                <FavoriteIcon />
              </StyledIconButton>
            ) : (
              <StyledIconButtonWithHover
                color="secondary"
                aria-label="favorite"
                onClick={handleFavorite}
              >
                <FavoriteBorderIcon />
              </StyledIconButtonWithHover>
            )}
          </ItemButtonsContent>
        </ItemContent>
      </StyledListItem>
      {subArticles.data?.getSubArticles.map(article => (
        <Collapse
          className={classes.nested}
          key={article.id}
          in={expanded}
          timeout="auto"
          unmountOnExit
        >
          <List component="div" disablePadding>
            <ArticleItem
              handleDialog={handleDialog}
              handleParentChange={handleParentChange}
              dragNDroppable={dragNDroppable}
              article={article}
              toggleRefetch={toggleRefetch}
              expandedByArticleOpen={expandedByArticleOpen}
              articleWithParents={
                expandedByArticleOpen ? articleWithParents : null
              }
              favorites={favorites}
            />
          </List>
        </Collapse>
      ))}
    </div>
  );
};

export default ArticleItem;
