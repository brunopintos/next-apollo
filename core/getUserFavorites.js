import gql from "graphql-tag";

const GET_USER_FAVORITES = gql`
  query getUserFavorites {
    getUserFavorites {
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

export default GET_USER_FAVORITES;
