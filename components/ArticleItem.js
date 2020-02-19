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

const StyledButton = styled(Button)`
  && {
    text-transform: none;
  }
`;

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

const CustomDialog = styled(Dialog)`
  && {
    min-width: 50%;
  }
`;

const useStyles = makeStyles(theme => ({
  nested: {
    paddingLeft: theme.spacing(4)
  }
}));

const ArticleItem = ({ article, selectedArticle }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
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
        {/* pasar a router push en vez de link
      
          -poner en el listItem un onClicked y adentro el router push
          
          -para que el expandLess y el expandMore tengan comportamiento aparte los pongo dentro de un ListItemSecondaryAction

          -lo mismo hago para el boton de agregar un subarticle

          https://material-ui.com/es/components/lists/#checkbox
      */}
        <ListItem key={article.id} selected={selectedArticle === article.id}>
          {data.getSubArticles.length > 0 &&
            (expanded ? (
              <ExpandLess color="primary" onClick={handleExpandClick} />
            ) : (
              <ExpandMore color="primary" onClick={handleExpandClick} />
            ))}
          <Link
            href="/article/[article]"
            as={`/article/${article.title}-${article.id}`}
          >
            <ListItemText color="secondary" primary={article.title} />
          </Link>
          <IconButton
            color="primary"
            edge="end"
            aria-label="delete"
            onClick={handleDialog}
          >
            <AddIcon />
          </IconButton>
        </ListItem>
        {data.getSubArticles.map(article => (
          <Collapse
            className={classes.nested}
            in={expanded}
            timeout="auto"
            unmountOnExit
          >
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
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleDialog}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      aria-label="Continue"
                      disabled={isSubmitting}
                    >
                      Create
                    </Button>
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
