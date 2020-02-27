import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import gql from "graphql-tag";
import styled from "styled-components";
import Link from "next/link";
import { useQuery } from "@apollo/react-hooks";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useMutation } from "@apollo/react-hooks";
import { useDrag, useDrop } from "react-dnd";
import { useSnackbar } from "notistack";

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

const CREATE_SUB_ARTICLE = gql`
  mutation createArticle($title: String!, $parentId: ID!) {
    createArticle(input: { title: $title, parentId: $parentId }) {
      id
      title
      icon
      content
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

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(1, "Your title must be at least 1 characters.")
    .max(100, "Your title is too long.")
    .required("Must enter a title.")
});

const StyledButton = styled(Button)`
  && {
    text-transform: none;
  }
`;

const CustomDialog = styled(Dialog)`
  && {
    min-width: 50%;
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

const ItemExpandAndTextContent = styled.div`
  && {
    display: flex;
    justify-content: flex-start;
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

const StyledListItem = styled(ListItem)``;

const StyledIconButtonWithHover = styled(IconButton)`
  && {
    opacity: 0;
    padding: 2px;
    ${StyledListItem}:hover & {
      opacity: 1;
    }
  }
`;

const StyledIconButton = styled(IconButton)`
  && {
    padding: 2px;
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

const ArticleItem = ({ article, articleWithParents, favorites }) => {
  const router = useRouter();
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [favorite, setFavorite] = useState(
    favorites?.filter(favoriteArticle => favoriteArticle.id == article?.id)
      .length !== 0
  );
  const [expanded, setExpanded] = useState(
    articleWithParents?.filter(parent => parent.id === article?.id).length !==
      0 &&
      articleWithParents?.[articleWithParents.length - 1].id !== article?.id
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  useEffect(() => {
    setFavorite(
      favorites?.filter(favoriteArticle => favoriteArticle.id == article?.id)
        .length !== 0
    );
  }, [article, favorites]);
  useEffect(() => {
    setExpanded(
      articleWithParents?.filter(parent => parent.id === article?.id).length !==
        0 &&
        articleWithParents?.[articleWithParents.length - 1].id !== article?.id
    );
  }, [article, articleWithParents]);

  const { data } = useQuery(GET_SUB_ARTICLES, {
    variables: {
      id: article.id
    }
  });

  const [createSubArticle] = useMutation(CREATE_SUB_ARTICLE);
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
        .then(articleMoved => {
          enqueueSnackbar(`${dragObject?.title} moved to ${article?.title}!!`, {
            variant: "success"
          });
          router.push(`/article/${dragObject?.title}-${dragObject?.id}`);
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

  const handleDialog = () => {
    setDialogOpen(!dialogOpen);
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
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <StyledListItem
        ref={drop}
        style={{
          backgroundColor: isOver ? "#ffd600" : "transparent"
        }}
        key={article?.id}
        selected={isArticleSelected(article)}
      >
        <ItemContent>
          <ItemExpandAndTextContent>
            {data?.getSubArticles.length > 0 &&
              (expanded ? (
                <ExpandLess color="primary" onClick={handleExpandClick} />
              ) : (
                <ExpandMore color="primary" onClick={handleExpandClick} />
              ))}
            <Link
              href="/article/[article]"
              as={`/article/${article?.title}-${article?.id}`}
            >
              <ListItemText
                color="secondary"
                disableTypography
                primary={<Typography noWrap>{article?.title}</Typography>}
              />
            </Link>
          </ItemExpandAndTextContent>
          <ItemButtonsContent>
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
            <StyledIconButtonWithHover
              color="primary"
              aria-label="delete"
              onClick={handleDialog}
            >
              <AddIcon />
            </StyledIconButtonWithHover>
          </ItemButtonsContent>
        </ItemContent>
      </StyledListItem>
      {data?.getSubArticles.map(article => (
        <Collapse
          className={classes.nested}
          key={article.id}
          in={expanded}
          timeout="auto"
          unmountOnExit
        >
          <List component="div" disablePadding>
            <ArticleItem
              article={article}
              articleWithParents={articleWithParents}
              favorites={favorites}
            />
          </List>
        </Collapse>
      ))}
      <CustomDialog
        fullWidth={true}
        maxWidth={"sm"}
        onClose={handleDialog}
        aria-labelledby="dialog-title"
        open={dialogOpen}
      >
        <DialogTitle id="dialog-title">New Article</DialogTitle>
        <DialogContent dividers>
          <Formik
            initialValues={{
              title: ""
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting, setErrors }) => {
              createSubArticle({
                variables: {
                  title: values.title,
                  parentId: article?.id
                }
              })
                .then(() => {
                  enqueueSnackbar(`Article ${title} in!!`, {
                    variant: "success"
                  });
                  setDialogOpen(!dialogOpen);
                })
                .catch(err => {
                  setErrors({
                    title: err?.graphQLErrors?.map(x => x.message)
                  });
                  setSubmitting(false);
                  setDialogOpen(!dialogOpen);
                });
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting
            }) => (
              <Form onSubmit={handleSubmit} noValidate>
                <DialogContent>
                  <TextField
                    color="secondary"
                    name="title"
                    label="Title"
                    variant="outlined"
                    value={values.title}
                    type="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.title && errors.title}
                    helperText={
                      touched.title && errors.title ? errors.title : ""
                    }
                    required
                    autoFocus
                    fullWidth
                  />
                </DialogContent>
                <DialogActions>
                  <StyledButton
                    variant="contained"
                    color="primary"
                    onClick={handleDialog}
                  >
                    Cancel
                  </StyledButton>
                  <StyledButton
                    variant="contained"
                    color="primary"
                    type="submit"
                    aria-label="Continue"
                    disabled={isSubmitting}
                  >
                    Create
                  </StyledButton>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </CustomDialog>
    </div>
  );
};

export default ArticleItem;
