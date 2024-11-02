import React from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { api } from '~/trpc/react'

const useThreads = () => {
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

  return {threads, isFetching, refetch, accountId, account: accounts?.find(e=>e.id === accountId)}
}

export default useThreads