'use client'

import {type Editor} from '@tiptap/react'
import { Bold } from 'lucide-react'

type Props = {
    editor: Editor
}

const EditorMenubar = ({editor}: Props) => {
  return (
    <div className='flex flex-wrap gap-2'>
        <button
            onClick={() => {
                editor.chain().focus().toggleBold().run() //call toggleBold function on editor
            }}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'is-active' : ''}
            >
            <Bold className='size-4 text-secondary-foreground'/>
        </button>
        
    </div>
  )
}

export default EditorMenubar