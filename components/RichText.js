/**
 * Initilaize RichTextEditor from React element
 */
import {
  RichTextEditorComponent,
  Inject,
  QuickToolbar,
  Image,
  Link,
  HtmlEditor,
  Toolbar,
  Count
} from "@syncfusion/ej2-react-richtexteditor";
import * as React from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

const CREATE_MODIFICATION = gql`
  mutation createModification($newContent: String!, $articleId: ID!) {
    createModification(
      input: { newContent: $newContent, articleId: $articleId }
    ) {
      id
    }
  }
`;

const RichText = ({ articleId, content }) => {
  const [createModification, { data }] = useMutation(CREATE_MODIFICATION);

  const inlineMode = {
    enable: true,
    onSelection: true
  };
  const format = {
    width: "auto"
  };
  const fontFamily = {
    width: "auto"
  };
  const toolbarSettings = {
    enable: true,
    items: [
      "Formats",
      "Alignments",
      "OrderedList",
      "UnorderedList",
      "|",
      "FontName",
      "FontColor",
      "FontSize",
      "BackgroundColor",
      "-",
      "Bold",
      "Italic",
      "Underline",
      "StrikeThrough",
      "|",
      "CreateLink",
      "Image",
      "|",
      "SubScript",
      "SuperScript",
      "|",
      "Print",
      "SourceCode"
    ],
    image: [
      "Align",
      "Caption",
      "Remove",
      "InsertLink",
      "OpenImageLink",
      "-",
      "EditImageLink",
      "RemoveImageLink",
      "Display",
      "AltText",
      "Dimension",
      {
        template:
          '<button class="e-tbar-btn e-btn" id="roatateLeft"><span class="e-btn-icon e-icons e-rotate-left"></span>',
        tooltipText: "Rotate Left"
      },
      {
        template:
          '<button class="e-tbar-btn e-btn" id="roatateRight"><span class="e-btn-icon e-icons e-rotate-right"></span>',
        tooltipText: "Rotate Right"
      }
    ]
  };
  const onSave = newContent => {
    console.log(newContent);
    createModification({
      variables: {
        newContent: newContent,
        articleId: articleId
      }
    });
  };

  return (
    <RichTextEditorComponent
      id="inlineRTE"
      enableResize={false}
      enableTabKey={true}
      inlineMode={inlineMode}
      locale={"es-AR"}
      toolbarSettings={toolbarSettings}
      format={format}
      showCharCount={true}
      fontFamily={fontFamily}
      change={valueTemplate => onSave(valueTemplate.value)}
      saveInterval={10000}
      valueTemplate={`<p>${content}</p>`}
    >
      <Inject
        services={[Count, Image, Link, QuickToolbar, HtmlEditor, Toolbar]}
      />
    </RichTextEditorComponent>
  );
};

export default RichText;
