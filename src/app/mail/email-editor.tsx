'use client'

import StarterKit from '@tiptap/starter-kit'
import {EditorContent, useEditor} from '@tiptap/react'
import { Text } from '@tiptap/extension-text'
import { useState } from 'react'

type Props = []

const EmailEditor = (props: Props) => {
    const [value, setValue] = useState<string>('')

    const CustomText = Text.extend({
        addKeyboardShortcuts() {
            return {
                'Meta-j': () => { //CTRL + J will trigger customText
                    console.log('Meta-j');
                    return true
                    
                }
            }
        }
    })
    const editor = useEditor({
        autofocus: false,
        extensions: [StarterKit, CustomText],
        onUpdate: ({editor}) => {
            setValue(editor.getHTML()) //set value of HTML version of editor
        }
    })
  return (
    <div>
        <div className='prose w-full px-4'>
            <EditorContent editor={editor} value={value} />
        </div>
    </div>
  )
}

export default EmailEditor