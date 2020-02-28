import React from "react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import styled from "styled-components";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Autocomplete, {
  createFilterOptions
} from "@material-ui/lab/Autocomplete";
import { logout } from "../lib/auth";

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
          <Typography variant="h6" color="secondary">
            Lithium KB
          </Typography>
          <Autocomplete
            value={value}
            onChange={(event, newValue) => {
              if (typeof newValue === "string") {
                setTimeout(() => {
                  handleDialog(null, newValue, true);
                });
                return;
              }
              if (newValue && newValue.inputValue) {
                handleDialog(null, newValue.inputValue, true);
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
                  label="🔍 Search article..."
                  fullWidth
                />
              </div>
            )}
          />
          <StyledButton color="secondary" onClick={logout}>
            Log out
          </StyledButton>
        </StyledToolBar>
      </StyledAppBar>
    </>
  );
};

export default ArticlesHeader;
