import gql from "graphql-tag";

const GET_ARTICLE_WITH_PARENTS = gql`
  query getArticleWithParents($id: ID!) {
    getArticleWithParents(id: $id) {
      id
      title
      icon
      content
      createdAt
      updatedAt
    }
  }
`;

export default GET_ARTICLE_WITH_PARENTS;
