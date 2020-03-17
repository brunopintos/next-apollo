import React from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import Cookies from "js-cookie";

import styled from "styled-components";
import { TextField } from "formik-material-ui";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import MainHeader from "../components/MainHeader";
import Title from "../components/Title";
import Layout from "../components/Layout";

import LOGIN from "../core/login";

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Your password must be at least 8 characters.")
    .max(100, "Your password is too long.")
    .required("Must enter a password."),
  usernameOrEmail: Yup.string()
    .min(2, "Your username or email address is invalid.")
    .max(320, "Your username or email address is too long.")
    .required("Must enter an username or email address.")
});

const StyledTitle = styled(Title)`
  && {
    color: black;
  }
`;

const StyledLayout = styled(Layout)`
  && {
    background-color: #fff;
  }
`;

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

const LittleText = styled(Typography)`
  && {
    font-size: 12.5px;
  }
`;

const Login = props => {
  const [login, { data }] = useMutation(LOGIN);
  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  if (!!Cookies.get("token")) {
    router.push("/article/Get%20Started-1");
  } else {
    return (
      <StyledLayout>
        {props.changeTitle("LKB - Log In")}
        <MainHeader />
        <StyledTitle variant="h3">Log In</StyledTitle>
        <Formik
          initialValues={{
            usernameOrEmail: "",
            password: ""
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, setErrors }) => {
            login({
              variables: {
                usernameOrEmail: values.usernameOrEmail,
                password: values.password
              }
            })
              .then(data => {
                enqueueSnackbar(`User logged in!!`, {
                  variant: "success"
                });
                Cookies.set("token", data.data.login.token);
                router.push("/article/Get%20Started-1");
              })
              .catch(err => {
                if (err.message.includes("username")) {
                  setErrors({
                    usernameOrEmail: err?.graphQLErrors?.map(x => x.message)
                  });
                } else {
                  setErrors({
                    password: err?.graphQLErrors?.map(x => x.message)
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
                    <TextField
                      color="primary"
                      name="usernameOrEmail"
                      label="Username/Email"
                      variant="outlined"
                      value={values.usernameOrEmail}
                      type="text"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.usernameOrEmail && errors.usernameOrEmail}
                      helperText={
                        touched.usernameOrEmail && errors.usernameOrEmail
                          ? errors.usernameOrEmail
                          : ""
                      }
                      required
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      color="primary"
                      name="password"
                      label="Password"
                      variant="outlined"
                      value={values.password}
                      type="password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.password && errors.password}
                      helperText={
                        touched.password && errors.password
                          ? errors.password
                          : ""
                      }
                      required
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      color="primary"
                      variant="contained"
                      type="submit"
                      aria-label="Continue"
                      disabled={isSubmitting}
                    >
                      Continue
                    </Button>
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
      </StyledLayout>
    );
  }
};

export default Login;
