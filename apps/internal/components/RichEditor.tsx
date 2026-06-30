'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';
import { Bold, Italic, List, ListOrdered, Quote, Link2, Heading2, Heading3, Undo, Redo } from 'lucide-react';

export default function RichEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' } }),
      Placeholder.configure({ placeholder: 'Tulis isi artikel di sini...' }),
    ],
    content: value || '',
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        style: 'min-height:240px; padding:14px; outline:none; line-height:1.7; font-size:14px; color:var(--text);',
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  if (!editor) return null;

  const Btn = ({ onClick, active, title, children }: any) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer',
        border: '1px solid ' + (active ? 'transparent' : 'var(--border)'),
        background: active ? 'linear-gradient(135deg, #2d7a5e, #d63a7a)' : 'var(--glass)',
        color: active ? 'white' : 'var(--text2)',
      }}
    >
      {children}
    </button>
  );

  const addLink = () => {
    const prev = editor.getAttributes('link').href;
    const url = window.prompt('URL link:', prev || 'https://');
    if (url === null) return;
    if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden', background: 'var(--bg)' }}>
      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', padding: '8px', borderBottom: '1px solid var(--border)', background: 'var(--glass)' }}>
        <Btn title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={15} /></Btn>
        <Btn title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={15} /></Btn>
        <Btn title="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 size={15} /></Btn>
        <Btn title="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 size={15} /></Btn>
        <Btn title="Bullet List" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={15} /></Btn>
        <Btn title="Numbered List" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={15} /></Btn>
        <Btn title="Quote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote size={15} /></Btn>
        <Btn title="Link" active={editor.isActive('link')} onClick={addLink}><Link2 size={15} /></Btn>
        <div style={{ width: '1px', background: 'var(--border)', margin: '2px 4px' }} />
        <Btn title="Undo" onClick={() => editor.chain().focus().undo().run()}><Undo size={15} /></Btn>
        <Btn title="Redo" onClick={() => editor.chain().focus().redo().run()}><Redo size={15} /></Btn>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
