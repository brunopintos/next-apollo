import React from "react";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import styled from "styled-components";

const StyledDrawer = styled(Drawer)`
  && {
    max-width: 240px;
  }
`;

const ArticlesSideBar = props => {
  return (
    <StyledDrawer anchor="left" variant="permanent" open>
      {
        <div>
          <List>
            {props.list.length === 0 ? (
              <div>
                <Typography>There are not articles yet!</Typography>
                <Typography>Create one!</Typography>
              </div>
            ) : (
              props.list.map((element, index) => (
                <ListItem button key={element.id}>
                  <ListItemIcon>
                    <Typography>{element.icon}</Typography>
                  </ListItemIcon>
                  <ListItemText primary={element.title} />
                </ListItem>
              ))
            )}
          </List>
        </div>
      }
    </StyledDrawer>
  );
};

export default ArticlesSideBar;
