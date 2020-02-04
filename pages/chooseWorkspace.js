import Layout from "../components/Layout";

const chooseWorkspace = () => {
  return (
    <Layout>
      <p>chooseWorkspace page</p>
    </Layout>
  );
};

export default chooseWorkspace;

// import Layout from "../components/Layout";
// import Title from "../components/Title";
// import { Formik, Form } from "formik";

// const Description = styled(Typography)`
//   && {
//     margin: 0;
//     width: 100%;
//     text-align: center;
//     color: #fff;
//     position: relative;
//   }
// `;

// const MaxWidthContainer = styled(Container)`
//   && {
//     max-width: 250px;
//   }
// `;

// const StyledGrid = styled(Grid)`
//   && {
//     padding-top: 20px;
//   }
// `;

// const StyledButton = styled(Button)`
//   && {
//     background-color: Gold;
//   }
// `;

// const validationSchema = Yup.object().shape({
//   password: Yup.string()
//     .min(8, "Your password must be at least 8 characters.")
//     .max(100, "Your password is too long.")
//     .required("Must enter a password."),
//   usernameOrEmail: Yup.string()
//     .min(2, "Your username or email address is invalid.")
//     .max(320, "Your username or email address is too long.")
//     .required("Must enter an username or email address.")
// });

// const chooseWorkspace = () => {
//   return (
//     <Layout>
//       <Title>Create yout new workspace</Title>
//       <Description>
//         We'll get you started on Lithium KB in a few steps.
//       </Description>
//       <Formik
//         initialValues={{
//           name: ""
//         }}
//         validationSchema={validationSchema}
//         onSubmit={(values, { setSubmitting, setErrors }) => {
//           login({
//             variables: {
//               usernameOrEmail: values.usernameOrEmail,
//               password: values.password
//             }
//           })
//             .then(data => {
//               enqueueSnackbar(`User ${data.data.login.username} logged in!!`, {
//                 variant: "success"
//               });
//               router.push("/onboarding");
//             })
//             .catch(err => {
//               if (err.message.includes("username")) {
//                 setErrors({
//                   usernameOrEmail: err.graphQLErrors.map(x => x.message)
//                 });
//               } else {
//                 setErrors({
//                   password: err.graphQLErrors.map(x => x.message)
//                 });
//               }
//               setSubmitting(false);
//             });
//         }}
//       >
//         {({
//           values,
//           errors,
//           touched,
//           handleChange,
//           handleBlur,
//           handleSubmit,
//           isSubmitting
//         }) => (
//           <MaxWidthContainer>
//             <Form onSubmit={handleSubmit} noValidate>
//               <StyledGrid
//                 container
//                 direction="column"
//                 spacing={3}
//                 alignItems="center"
//               >
//                 <Grid item>
//                   <StyledTextField
//                     name="usernameOrEmail"
//                     label="Username/Email"
//                     variant="outlined"
//                     value={values.usernameOrEmail}
//                     type="text"
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     error={touched.usernameOrEmail && errors.usernameOrEmail}
//                     helperText={
//                       touched.usernameOrEmail && errors.usernameOrEmail
//                         ? errors.usernameOrEmail
//                         : ""
//                     }
//                     required
//                   />
//                 </Grid>
//                 <Grid item>
//                   <StyledTextField
//                     name="password"
//                     label="Password"
//                     variant="outlined"
//                     value={values.password}
//                     type="password"
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     error={touched.password && errors.password}
//                     helperText={
//                       touched.password && errors.password ? errors.password : ""
//                     }
//                     required
//                   />
//                 </Grid>
//                 <Grid item>
//                   <StyledButton
//                     type="submit"
//                     aria-label="Continue"
//                     disabled={isSubmitting}
//                   >
//                     Continue
//                   </StyledButton>
//                 </Grid>
//                 <Grid item>
//                   <LittleText variant="h6">
//                     Don't have an account?{" "}
//                     <Link href="/signup">
//                       <a>Sign Up</a>
//                     </Link>
//                   </LittleText>
//                 </Grid>
//               </StyledGrid>
//             </Form>
//           </MaxWidthContainer>
//         )}
//       </Formik>
//     </Layout>
//   );
// };

// export default chooseWorkspace;
