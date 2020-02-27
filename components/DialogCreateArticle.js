import React, { useState } from "react";
import gql from "graphql-tag";
import styled from "styled-components";
import { useMutation } from "@apollo/react-hooks";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";

const CREATE_ARTICLE = gql`
  mutation createArticle($title: String!) {
    createArticle(input: { title: $title }) {
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

const DialogCreateArticle = ({ dialogOpen, dialogValue }) => {
  const [createArticle] = useMutation(CREATE_ARTICLE);

  const handleDialog = () => {
    setDialogValue("");
    setValue("");
    setDialogOpen(!dialogOpen);
  };

  return (
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
            title: dialogValue
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, setErrors }) => {
            createArticle({
              variables: {
                title: values.title
              }
            })
              .then(() => {
                enqueueSnackbar(`Article ${title} created!!`, {
                  variant: "success"
                });
                handleDialog();
              })
              .catch(err => {
                setErrors({
                  title: err?.graphQLErrors?.map(x => x.message)
                });
                setSubmitting(false);
                handleDialog();
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
                  helperText={touched.title && errors.title ? errors.title : ""}
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
  );
};

export default DialogCreateArticle;
