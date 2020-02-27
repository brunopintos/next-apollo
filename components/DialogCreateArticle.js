import React from "react";
import { useRouter } from "next/router";
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
import { useSnackbar } from "notistack";

const CREATE_ARTICLE = gql`
  mutation createArticle($title: String!, $parentId: ID) {
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

const DialogCreateArticle = ({
  parentId,
  handleDialog,
  dialogOpen,
  dialogValue
}) => {
  const router = useRouter();
  const [createArticle] = useMutation(CREATE_ARTICLE);
  const { enqueueSnackbar } = useSnackbar();

  return (
    <CustomDialog
      fullWidth={true}
      maxWidth={"sm"}
      onClose={() => handleDialog(null, "", false)}
      aria-labelledby="dialog-title"
      open={dialogOpen}
    >
      <DialogTitle id="dialog-title">New Article</DialogTitle>
      <DialogContent dividers>
        <Formik
          initialValues={{
            title: dialogValue,
            parentId: parentId
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, setErrors }) => {
            createArticle({
              variables: {
                title: values.title,
                parentId: values.parentId
              }
            })
              .then(article => {
                enqueueSnackbar(
                  `Article ${article?.data?.createArticle?.title} created!!`,
                  {
                    variant: "success"
                  }
                );
                handleDialog(null, "", false);
                router.push(
                  `/article/${article?.data?.createArticle?.title}-${article?.data?.createArticle?.id}`
                );
              })
              .catch(err => {
                console.log(err);
                setErrors({
                  title: err?.graphQLErrors?.map(x => x.message)
                });
                setSubmitting(false);
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
                  onClick={() => handleDialog(null, "", false)}
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
