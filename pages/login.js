import React, { useState } from "react";
import { withApollo } from "../lib/apollo";
import gql from "graphql-tag";
import styled from "styled-components";
import { useMutation } from "@apollo/react-hooks";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Link from "next/link";

import { TextField } from "formik-material-ui";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import MainHeader from "../components/MainHeader";
import Title from "../components/Title";

const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
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
    .required("Must enter an email.")
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

const LittleText = styled(Typography)`
  && {
    font-size: 12.5px;
  }
`;

const Login = () => {
  const [login, { data }] = useMutation(LOGIN);
  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  return (
    <Container>
      <MainHeader title="KB - Knowledge Base" />
      <Title variant="h3">Log In</Title>
      <Formik
        initialValues={{
          email: "",
          password: ""
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          login({
            variables: { email: values.email, password: values.password }
          }).then(data => {
            if (data.data.login) {
              enqueueSnackbar(`User ${values.email} logged in!!`, {
                variant: "success"
              });
              router.push("/onboarding");
            } else {
              enqueueSnackbar("Wrong email or password.", {
                variant: "error"
              });
            }
          });
          resetForm();
          setSubmitting(false);
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
                  <StyledButton
                    type="submit"
                    aria-label="Continue"
                    disabled={isSubmitting}
                  >
                    Continue
                  </StyledButton>
                </Grid>
                <Grid item>
                  <LittleText variant="h6">
                    Don't have an account?{" "}
                    <Link href="/signup">
                      <a>Sign Up</a>
                    </Link>
                  </LittleText>
                </Grid>
              </StyledGrid>
            </Form>
          </MaxWidthContainer>
        )}
      </Formik>
    </Container>
  );
};

export default withApollo(Login);
