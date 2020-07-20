import gql from "graphql-tag";

const LOGIN = gql`
  mutation login($usernameOrEmail: String!, $password: String!) {
    login(usernameOrEmail: $usernameOrEmail, password: $password) {
      token
    }
  }
`;

export default LOGIN;
