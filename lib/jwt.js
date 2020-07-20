import React from "react";
import Router from "next/router";
import { auth, logout } from "./auth";
import jwt_decode from "jwt-decode";

const getDisplayName = Component =>
  Component.displayName || Component.name || "Component";

export const withAuth = ({ requiredRoles } = {}) => WrappedComponent =>
  class AuthComponent extends React.Component {
    state = {
      user: null
    };
    static displayName = `withAuth(${getDisplayName(WrappedComponent)})`;
    static async getInitialProps(ctx) {
      const token = auth(ctx);
      const componentProps =
        WrappedComponent.getInitialProps &&
        (await WrappedComponent.getInitialProps(ctx));
      try {
        const { user } = jwt_decode(token);
        if (requiredRoles && !requiredRoles.includes(user.role)) {
          redirect({ uri: "/login", ctx });
        }
        return { ...componentProps, token, user };
      } catch (err) {
        redirect({ uri: "/login", ctx });
      }
    }
    render() {
      return (
        <WrappedComponent
          {...this.props}
          logout={logout}
          user={this.state.user || this.props.user}
        />
      );
    }
  };
const redirect = ({ ctx, uri }) => {
  if (ctx.req) {
    ctx.res.writeHead(302, { Location: uri });
    ctx.res.end();
    return;
  } else {
    Router.push(uri);
  }
};
export default withAuth;
