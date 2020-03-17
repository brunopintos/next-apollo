import gql from "graphql-tag";

const FAVORITE_ARTICLE = gql`
  mutation favoriteArticle($id: ID!) {
    favoriteArticle(id: $id) {
      id
    }
  }
`;

export default FAVORITE_ARTICLE;
