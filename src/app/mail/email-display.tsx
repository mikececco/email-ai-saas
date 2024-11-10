'use client'

import useThreads from "~/hooks/use-threads"
import { cn } from "~/lib/utils"
import { RouterOutputs } from "~/trpc/react"
import Avatar from 'react-avatar'
import { formatDistanceToNow } from "date-fns"
import {Letter} from 'react-letter'

type Props = {
    email: RouterOutputs['account']['getThreads'][0]['emails'][0] //type of output of procedure coming from TRPC
}

const EmailDisplay = ({email}: Props) => {
    const {account } = useThreads()
    const isMe = account?.emailAddress === email.from.address
    // who sent the email?
  return (
    <div className={
        cn('border rounded-md p-4 transition-all hover:traslate-x-2', {
            'border-l-gray-900 border-left-4': isMe
        })
    }>
        <div className="flex items-center justify-between gap-2">
            <div className="flex items-center justify-between gap-2">
                {!isMe && <Avatar name={email.from.name ?? email.from.address} email={email.from.address} size="35" textSizeRatio={2} round={true} />}
                <span>
                    {isMe ? 'Me' : email.from.address}
                </span>
            </div>

            <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(email.sentAt ?? new Date(), {
                    addSuffix: true
                })}
            </p>
        </div>


        <div className="h-4">
        </div>

        <Letter html={email?.body ?? ''} className="bg-white rounded-md"/>
    </div>
  )
}
     
export default EmailDisplay