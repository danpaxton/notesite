import { Editor } from '@tinymce/tinymce-react';

import './NoteEditor.css';

const NoteEditor = ({ handleSave, note }) => {

  const handleChange = (newValue, editor) => {
    if (note) {
      note.text = newValue;
      console.log(note.text)
      handleSave();
    }
  };

  return (
    <div className='shadow-lg h-full w-full rounded-lg'>
      <Editor
        apiKey="j5j03cv3b4fs3ehd53fcxgds9xrm7ntj9k00hac9qwjpuz6h"
        onEditorChange={handleChange}
        initialValue={note ? note.text : "" }
        init={{
          menubar: false,
          toolbar_mode: 'sliding',
          statusbar: false,
          toolbar_location: 'bottom',
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