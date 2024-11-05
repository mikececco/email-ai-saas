import { useLocalStorage } from 'usehooks-ts'
import { api } from '~/trpc/react'
import { atom, useAtom} from 'jotai'

export const threadAtom = atom<string | null>(null)

const useThreads = () => {
  const [threadId, setThreadId] = useAtom(threadAtom)

  const { data: accounts , isFetching, refetch} = api.account.getAccounts.useQuery()
  const [accountId] = useLocalStorage('accountId', '')
  const [tab] = useLocalStorage('email-tab', 'inbox')
  const [done] = useLocalStorage('email-done', false)

  const {data: threads} = api.account.getThreads.useQuery({
    accountId,
    tab,
    done
  },{ //The query will only run if both accountId and tab are truthy. 
    enabled: !!accountId && !!tab, placeholderData: e => e, refetchInterval: 5000 //placeholder data to be used while the actual data is being fetched.
  })

  return {threads, threadId, setThreadId, isFetching, refetch, accountId, account: accounts?.find(e=>e.id === accountId)}
}

export default useThreads