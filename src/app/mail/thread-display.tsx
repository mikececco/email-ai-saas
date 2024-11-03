'use client'

import { Archive, ArchiveX, Clock, Trash, Trash2 } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Separator } from "~/components/ui/separator"
import useThreads from "~/hooks/use-threads"

const ThreadDisplay = () => {
    const  {threadId, threads} = useThreads() //from hook

    const thread = threads?.find(t => t.id === threadId)

  return (
    <div className="flex flex-col h-full">
        <div className="flex items-center p-2">
            <div className="flex items-center gap-2">
                <Button variant={'ghost'} size='icon' disabled={!thread}>
                    <Archive className="size-4" />
                </Button>
                <Button variant={'ghost'} size='icon' disabled={!thread}>
                    <ArchiveX className="size-4" />
                </Button>
                <Button variant={'ghost'} size='icon' disabled={!thread}>
                    <Trash2 className="size-4" />
                </Button>
            </div>
            <Separator orientation="vertical" className="ml-2" />
            <Button className='ml-2' variant={'ghost'} size='icon' disabled={!thread}>
                    <Clock className="size-4" />
                </Button>
        </div>

        <div className="flex items-center ml-auto">

        </div>
    </div>
  )
}

export default ThreadDisplay