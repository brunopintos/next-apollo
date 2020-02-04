import React from "react";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import styled from "styled-components";

const ArticlesDrawer = props => {
  const StyledDrawer = styled(Drawer)`
    && {
      width: ${props.width}px || 240px;
    }
  `;

  return (
    <StyledDrawer anchor="left" variant="permanent" open>
      {
        <div>
          <List>
            {props.list.map((element, index) => (
              <ListItem button key={element.id}>
                <ListItemIcon>
                  <Typography>{element.icon}</Typography>
                </ListItemIcon>
                <ListItemText primary={element.name} />
              </ListItem>
            ))}
          </List>
        </div>
      }
    </StyledDrawer>
  );
};

export default ArticlesDrawer;
