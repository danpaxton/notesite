import { Editor } from '@tinymce/tinymce-react';

import './NoteEditor.css';

const NoteEditor = ({ handleSave, note }) => {

  const handleChange = (newValue, editor) => {
    if (note) {
      note.text = newValue;
      handleSave();
    }
  };

  return (
    <div className='fixed top-24 h-4/5 md:h-full w-full shadow-lg'>
      <Editor
        apiKey="j5j03cv3b4fs3ehd53fcxgds9xrm7ntj9k00hac9qwjpuz6h"
        onEditorChange={handleChange}
        initialValue={note ? note.text : "" }
        init={{
          menubar: false,
          toolbar_mode: 'scrolling',
          statusbar: false,
          highlight_on_focus: false,
          plugins: 'anchor autolink codesample image link lists media searchreplace table visualblocks wordcount linkchecker',
          toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
      />
    </div>
  );
}
export default NoteEditor;