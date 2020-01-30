import React from "react";
import { withApollo } from "../lib/apollo";
import gql from "graphql-tag";
import styled from "styled-components";
import { useMutation } from "@apollo/react-hooks";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { TextField } from "formik-material-ui";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";

import MainHeader from "../components/MainHeader";
import Title from "../components/Title";

const SIGNUP_USER = gql`
  mutation CreateUsers($email: String!, $password: String!) {
    signupUser(email: $email, password: $password) {
      id
      email
      password
    }
  }
`;

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Your password must be at least 8 characters.")
    .max(100, "Your password is too long.")
    .required("Must enter a password."),
  email: Yup.string()
    .email("Your email address is invalid.")
    .min(2, "Your email address is invalid.")
    .max(320, "Your email address is too long.")
    .required("Must enter an email."),
  passwordConfirmation: Yup.string()
    .oneOf(
      [Yup.ref("password"), null],
      "Your password and the confirmation must match."
    )
    .required("Must enter the password confirmation.")
});

const StyledTextField = styled(TextField)``;

const MaxWidthContainer = styled(Container)`
  && {
    max-width: 250px;
  }
`;

const StyledGrid = styled(Grid)`
  && {
    padding-top: 20px;
  }
`;

const StyledButton = styled(Button)`
  && {
    background-color: Gold;
  }
`;

const Signup = () => {
  const [signupUser, { data }] = useMutation(SIGNUP_USER);
  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  return (
    <Container>
      <MainHeader title="KB - Knowledge Base" />
      <Title variant="h3">Sign Up</Title>
      <Formik
        initialValues={{
          email: "",
          password: "",
          passwordConfirmation: ""
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, setErrors }) => {
          signupUser({
            variables: {
              email: values.email,
              password: values.password
            }
          }).then(data => {
            if (data.data.signupUser) {
              enqueueSnackbar(`User ${values.email} created successfully!!`, {
                variant: "success"
              });
              router.push("/onboarding");
            } else {
              enqueueSnackbar("Oops! Something went wrong.", {
                variant: "error"
              });
            }
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
          <MaxWidthContainer>
            <Form onSubmit={handleSubmit} noValidate>
              <StyledGrid
                container
                direction="column"
                spacing={3}
                alignItems="center"
              >
                <Grid item>
                  <StyledTextField
                    name="email"
                    label="Email"
                    variant="outlined"
                    value={values.email}
                    type="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && errors.email}
                    helperText={
                      touched.email && errors.email ? errors.email : ""
                    }
                  />
                </Grid>
                <Grid item>
                  <StyledTextField
                    name="password"
                    label="Password"
                    variant="outlined"
                    value={values.password}
                    type="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && errors.password}
                    helperText={
                      touched.password && errors.password ? errors.password : ""
                    }
                  />
                </Grid>
                <Grid item>
                  <StyledTextField
                    name="passwordConfirmation"
                    label="Confirm password"
                    variant="outlined"
                    type="password"
                    value={values.passwordConfirmation}
                    onChange={handleChange}
                    onBlur={handleChange}
                    error={
                      touched.passwordConfirmation &&
                      errors.passwordConfirmation
                    }
                    helperText={
                      touched.passwordConfirmation &&
                      errors.passwordConfirmation
                        ? errors.passwordConfirmation
                        : ""
                    }
                  />
                </Grid>
                <Grid item>
                  <StyledButton
                    type="submit"
                    aria-label="Continue"
                    disabled={isSubmitting}
                  >
                    Continue
                  </StyledButton>
                </Grid>
              </StyledGrid>
            </Form>
          </MaxWidthContainer>
        )}
      </Formik>
    </Container>
  );
};

export default withApollo(Signup);
