import Container from "@material-ui/core/Container";
import styled from "styled-components";

const Layout = styled(Container).attrs(props => ({
  background: props.background || "khaki"
}))``;

export default Layout;
