'use client'

import StarterKit from '@tiptap/starter-kit'
import {EditorContent, useEditor} from '@tiptap/react'
import { Text } from '@tiptap/extension-text'
import { useState } from 'react'
import EditorMenubar from './editor-menubar'
import { Separator } from '~/components/ui/separator'
import { Button } from '~/components/ui/button'

type Props = []

const EmailEditor = (props: Props) => {
    const [expanded, setExpanded] = useState<boolean>(false)
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

    if (!editor) return null

  return (
    <div>
        <div className='flex p-4 py-2 border-b'>
            <EditorMenubar editor={editor} />
        </div>
        <div className='p-4 pb-0 space-y-2'>
            {expanded && (
                <>
                    cc inputs
                </>
            )}
            <div className='flex items-center gap-2'>
                <div className='cursor-pointer' onClick={() => setExpanded(!expanded)}>
                    <span className='text-green-600 font-medium'>
                        Draft {" "}
                    </span>
                    <span>
                        to Elliot
                    </span>
                </div>
            </div>
        </div>
        <div className='prose w-full px-4'>
            <EditorContent editor={editor} value={value} />
        </div>
        <Separator />

        <div className="py-3 px-4 flex items-center justify-between">
                <span className="text-sm">
                    Tip: Press{" "}
                    <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
                        Cmd + J
                    </kbd>{" "}
                    for AI autocomplete
                </span>
                <Button>
                    Send
                </Button>
            </div>
    </div>
  )
}

export default EmailEditor