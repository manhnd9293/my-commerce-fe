import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Button } from '@/components/ui/button.tsx';

interface EditorComponentProps {
  content: string;
  onUpdateContent: (data: string) => void;
}



function EditorComponent({content, onUpdateContent}: EditorComponentProps) {
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      // @ts-ignore
      const updateContent = editorRef.current.getContent();
      onUpdateContent(updateContent);
      console.log(updateContent);
    }
  };
  return (
    <div>
      <Editor
        apiKey='iloqhvyja1d64v0zfn5delyuec4rcmxlju53bq2etbpho9zb'
        onInit={(_evt, editor) => {
          // @ts-ignore
          editorRef.current = editor
        }}
        initialValue={content}
        init={{
          height: 500,
          menubar: false,
          branding: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
        onChange={(e)=> {
          console.log(e.target.value)
        }}
      />
    </div>
  );
}

export default EditorComponent;