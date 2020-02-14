import React, { useState } from "react";
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
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useMutation } from "@apollo/react-hooks";

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

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(8, "Your title must be at least 8 characters.")
    .max(100, "Your title is too long.")
    .required("Must enter a title.")
});

const StyledButton = styled(Button)`
  && {
    background-color: Gold;
  }
`;

const CustomDialog = styled(Dialog)`
  && {
    min-width: 50%;
  }
`;

const useStyles = makeStyles(theme => ({
  nested: {
    paddingLeft: theme.spacing(6)
  }
}));

const ArticleItem = ({ article, handleClick, selectedArticle }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState(selectedArticle === article.id);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { loading, error, data } = useQuery(GET_SUB_ARTICLES, {
    variables: {
      id: article.id
    }
  });
  const [createSubArticle] = useMutation(CREATE_SUB_ARTICLE);

  if (loading) return <p>Loading ...</p>;
  if (error) {
    return <p>{error.message}</p>;
  }

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleDialog = () => {
    setDialogOpen(!dialogOpen);
  };

  if (article) {
    return (
      <>
        <ListItem
          key={article.id}
          className={article.parent ? classes.nested : undefined}
          selected={selected}
          onClick={handleClick}
        >
          {data.getSubArticles.length > 0 &&
            (expanded ? (
              <ExpandLess onClick={handleExpandClick} />
            ) : (
              <ExpandMore onClick={handleExpandClick} />
            ))}
          <Link
            href="/article/[article]"
            as={`/article/${article.title}-${article.id}`}
          >
            <ListItemText primary={article.title} onClick={handleClick} />
          </Link>
          <IconButton edge="end" aria-label="delete" onClick={handleDialog}>
            <AddIcon />
          </IconButton>
        </ListItem>
        {data.getSubArticles.map(article => (
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ArticleItem article={article} />
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
                    parentId: article.id
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
                    <StyledButton onClick={handleDialog}>Cancel</StyledButton>
                    <StyledButton
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
      </>
    );
  } else {
    return <></>;
  }
};

export default ArticleItem;
