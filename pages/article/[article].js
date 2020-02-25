import { useRouter } from "next/router";
import React, { useState } from "react";
import gql from "graphql-tag";
import styled from "styled-components";
import withAuth from "../../lib/jwt";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { fade, makeStyles } from "@material-ui/core/styles";
import HomeIcon from "@material-ui/icons/Home";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import ArticleItem from "../../components/ArticleItem";
import ArticleContent from "../../components/ArticleContent";
import AddIcon from "@material-ui/icons/Add";
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
import Autocomplete, {
  createFilterOptions
} from "@material-ui/lab/Autocomplete";

const GET_ARTICLES = gql`
  query GET_ARTICLES {
    getArticles {
      id
      title
      content
    }
  }
`;

const GET_ARTICLE_WITH_PARENTS = gql`
  query getArticleWithParents($id: ID!) {
    getArticleWithParents(id: $id) {
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

const ItemsContainer = styled.div`
  && {
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: space-between;
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

const filter = createFilterOptions();

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
    paddingTop: 112 + 40,
    paddingLeft: theme.spacing(30),
    paddingRight: theme.spacing(30),
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

  const [dialogOpen, setDialogOpen] = useState(false);
  const [value, setValue] = React.useState(null);
  const [dialogValue, setDialogValue] = React.useState("");

  const rootArticles = useQuery(GET_ROOT_ARTICLES);
  const articleWithParents = useQuery(GET_ARTICLE_WITH_PARENTS, {
    fetchPolicy: "cache-and-network",
    variables: {
      id: /(.*)\-(\d+)$/.exec(router.query.article)[2]
    }
  });
  const [createArticle] = useMutation(CREATE_ARTICLE);
  const [logout] = useMutation(LOG_OUT);
  const articles = useQuery(GET_ARTICLES);

  const articleTitle = /(.*)\-(\d+)$/.exec(router.query.article)[1];

  const handleDialog = () => {
    setDialogValue("");
    setValue("");
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
          <Autocomplete
            value={value}
            onChange={(event, newValue) => {
              if (typeof newValue === "string") {
                // timeout to avoid instant validation of the dialog's form.
                setTimeout(() => {
                  setDialogOpen(true);
                  setDialogValue(newValue);
                });
                return;
              }

              if (newValue && newValue.inputValue) {
                setDialogOpen(true);
                setDialogValue(newValue.inputValue);
                return;
              }

              setValue(newValue);
              router.push(`/article/${newValue.title}-${newValue.id}`);
            }}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);

              if (params.inputValue !== "") {
                filtered.push({
                  inputValue: params.inputValue,
                  title: `Add article: "${params.inputValue}"`
                });
              }

              return filtered;
            }}
            options={articles.data?.getArticles}
            getOptionLabel={option => {
              // e.g value selected with enter, right from the input
              if (typeof option === "string") {
                return option;
              }
              if (option.inputValue) {
                return option.inputValue;
              }
              return option.title;
            }}
            renderOption={option => option.title}
            style={{ width: 400 }}
            autoComplete
            autoHighlight
            renderInput={params => (
              <div className={classes.search}>
                {/* <div className={classes.searchIcon}>
                  <SearchIcon color="secondary" />
                </div> */}
                <TextField
                  {...params}
                  color="secondary"
                  label="Search article..."
                  classes={{
                    root: classes.inputRoot
                  }}
                  fullWidth
                />
              </div>
            )}
          />
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
        <ItemsContainer>
          <div>
            <div className={classes.toolbar} />
            <List className={classes.listRoot}>
              {rootArticles.data?.getRootArticles.map(article => (
                <ArticleItem
                  article={article}
                  selectedArticleWithParents={
                    articleWithParents.data?.getArticleWithParents
                  }
                />
              ))}
            </List>
          </div>
          <div>
            <Divider />
            <List className={classes.listRoot}>
              <ListItem button onClick={handleDialog}>
                <ListItemIcon>
                  <AddIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="New article" />
              </ListItem>
            </List>
          </div>
        </ItemsContainer>
      </Drawer>
      <main className={classes.content}>
        <ArticleContent
          articleWithParents={articleWithParents.data?.getArticleWithParents}
        />
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
