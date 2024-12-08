import React from 'react'
import EmailEditor from './email-editor'
import useThreads from '~/hooks/use-threads'
import { api } from '~/trpc/react'

const ReplyBox = () => {

  const [threadId] = useThreads()
  const { accountId } = useThreads()
  const { data: replyDetails } = api.account.getReplyDetails.useQuery({
    accountId: accountId,
    threadId: threadId || '',
    // replyType: 'reply'
  })

}

const Component = () => {
  return (
    <EmailEditor
            toValues={toValues}
            ccValues={ccValues}

            onToChange={(values) => { 
                setToValues(values)
            }}
            onCcChange={(values) => {
                setCcValues(values)
            }}

            subject={subject}
            setSubject={setSubject}
            to={toValues.map(to => to.value)}
            handleSend={handleSend}
            isSending={sendEmail.isPending}
        />
  )
}

export default ReplyBox