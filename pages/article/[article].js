import { useRouter } from "next/router";
import React, { useState } from "react";
import gql from "graphql-tag";
import styled from "styled-components";
import withAuth from "../../lib/jwt";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { fade, makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import HomeIcon from "@material-ui/icons/Home";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import ArticleItem from "../../components/ArticleItem";
import InputBase from "@material-ui/core/InputBase";
import RichText from "../../components/RichText";
import AddBoxIcon from "@material-ui/icons/Add";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import Button from "@material-ui/core/Button";

const GET_ARTICLE = gql`
  query getArticle($id: ID!) {
    getArticle(id: $id) {
      id
      title
      content
      createdAt
      updatedAt
    }
  }
`;

const GET_ROOT_ARTICLES = gql`
  query getRootArticles {
    getRootArticles {
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

const LOG_OUT = gql`
  mutation logout {
    logout
  }
`;

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

const StyledAppBar = styled(AppBar)`
  && {
    background-color: Gold;
  }
`;

const StyledToolBar = styled(Toolbar)`
  && {
    display: flex;
    justify-content: space-between;
  }
`;

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  listRoot: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    zIndex: 1150
  },
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    backgroundColor: "white"
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto"
    }
  },
  searchIcon: {
    width: theme.spacing(7),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "black"
  },
  inputRoot: {
    color: "black"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: 300,
      "&:focus": {
        width: 400
      }
    }
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  },
  extendedIcon: {
    marginRight: theme.spacing(1)
  },
  toolbar: theme.mixins.toolbar
}));

const Article = props => {
  const classes = useStyles();
  const router = useRouter();

  const rootArticles = useQuery(GET_ROOT_ARTICLES);
  const article = useQuery(GET_ARTICLE, {
    fetchPolicy: "cache-and-network",
    variables: {
      id: /(.*)\-(\d+)$/.exec(router.query.article)[2]
    }
  });
  const [createArticle] = useMutation(CREATE_ARTICLE);
  const [logout] = useMutation(LOG_OUT);
  const [dialogOpen, setDialogOpen] = useState(false);

  const thisArticle = article.data?.getArticle;
  const articleTitle = /(.*)\-(\d+)$/.exec(router.query.article)[1];

  const handleDialog = () => {
    setDialogOpen(!dialogOpen);
  };

  return (
    <div className={classes.root}>
      {props.changeTitle(`LKB - ${articleTitle}`)}
      <StyledAppBar position="fixed" className={classes.appBar}>
        <StyledToolBar>
          <Link href="/">
            <IconButton color="secondary" edge="start" aria-label="home page">
              <HomeIcon />
            </IconButton>
          </Link>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon color="secondary" />
            </div>
            <InputBase
              color="secondary"
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput
              }}
              inputProps={{ "aria-label": "search" }}
            />
          </div>
          <Link href="/">
            <StyledButton color="secondary" onClick={logout}>
              Log out
            </StyledButton>
          </Link>
        </StyledToolBar>
      </StyledAppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.toolbar} />
        <List className={classes.listRoot}>
          {rootArticles.data?.getRootArticles.map(article => (
            <ArticleItem article={article} selectedArticle={thisArticle?.id} />
          ))}
        </List>
        <Divider />
        <List className={classes.listRoot}>
          <ListItem button onClick={handleDialog}>
            <ListItemIcon>
              <AddBoxIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="New article" />
          </ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <RichText article={thisArticle} />
      </main>
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
              createArticle({
                variables: {
                  title: values.title
                }
              })
                .then(() => {
                  enqueueSnackbar(`Article ${title} created!!`, {
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

export default withAuth()(Article);
