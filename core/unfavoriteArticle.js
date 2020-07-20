import gql from "graphql-tag";

const UNFAVORITE_ARTICLE = gql`
  mutation unfavoriteArticle($id: ID!) {
    unfavoriteArticle(id: $id)
  }
`;

export default UNFAVORITE_ARTICLE;
