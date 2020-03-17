import gql from "graphql-tag";

const CREATE_ARTICLE = gql`
  mutation createArticle($title: String!, $parentId: ID) {
    createArticle(input: { title: $title, parentId: $parentId }) {
      id
      title
      icon
      content
    }
  }
`;

export default CREATE_ARTICLE;
