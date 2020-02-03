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
  mutation SignupUser($username: String!, $email: String!, $password: String!) {
    signupUser(username: $username, email: $email, password: $password) {
      username
    }
  }
`;

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .min(8, "Your username must be at least 8 characters.")
    .max(100, "Your username is too long.")
    .required("Must enter a username."),
  email: Yup.string()
    .email("Your email address is invalid.")
    .min(2, "Your email address is invalid.")
    .max(320, "Your email address is too long.")
    .required("Must enter an email address."),
  password: Yup.string()
    .min(8, "Your password must be at least 8 characters.")
    .max(100, "Your password is too long.")
    .required("Must enter a password."),
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
      <MainHeader title="Lithium KB - Lithium Knowledge Base" />
      <Title variant="h3">Sign Up</Title>
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
          passwordConfirmation: ""
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, setErrors }) => {
          signupUser({
            variables: {
              username: values.username,
              email: values.email,
              password: values.password
            }
          })
            .then(() => {
              enqueueSnackbar(
                `User ${values.username} created successfully!!`,
                {
                  variant: "success"
                }
              );
              router.push("/onboarding");
            })
            .catch(err => {
              if (err.message.includes("Both")) {
                setErrors({
                  username: "Username is already in use.",
                  email: "Email address is already in use."
                });
              } else {
                if (err.message.includes("Username")) {
                  setErrors({
                    username: err.graphQLErrors.map(x => x.message)
                  });
                } else {
                  setErrors({
                    email: err.graphQLErrors.map(x => x.message)
                  });
                }
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
                    name="username"
                    label="Username"
                    variant="outlined"
                    value={values.username}
                    type="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.username && errors.username}
                    helperText={
                      touched.username && errors.username ? errors.username : ""
                    }
                    required
                  />
                </Grid>
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
                    required
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
                    required
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
                    required
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
