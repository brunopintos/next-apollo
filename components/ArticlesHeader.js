import { useRouter } from "next/router";
import React from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { logout } from "../lib/auth";
import styled from "styled-components";
import IconButton from "@material-ui/core/IconButton";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import { fade, makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import TextField from "@material-ui/core/TextField";
import HomeIcon from "@material-ui/icons/Home";
import Link from "next/link";
import Autocomplete, {
  createFilterOptions
} from "@material-ui/lab/Autocomplete";

const GET_ARTICLES = gql`
  query getArticles {
    getArticles {
      id
      title
      content
    }
  }
`;

const StyledAppBar = styled(AppBar)`
  && {
    background-color: Gold;
  }
`;

const StyledButton = styled(Button)`
  && {
    text-transform: none;
  }
`;

const StyledToolBar = styled(Toolbar)`
  && {
    display: flex;
    justify-content: space-between;
  }
`;

const filter = createFilterOptions();

const useStyles = makeStyles(theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1
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
  }
}));

const ArticlesHeader = ({ handleDialog }) => {
  const router = useRouter();
  const classes = useStyles();

  const [value, setValue] = React.useState(null);
  const articles = useQuery(GET_ARTICLES);

  return (
    <>
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
                setTimeout(() => {
                  handleDialog(newValue, true);
                });
                return;
              }

              if (newValue && newValue.inputValue) {
                handleDialog(newValue.inputValue, true);
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
                <TextField
                  {...params}
                  color="secondary"
                  label="Search article..."
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
    </>
  );
};

export default ArticlesHeader;
