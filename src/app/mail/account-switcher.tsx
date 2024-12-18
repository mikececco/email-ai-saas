'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { api } from '~/trpc/react'
import { useLocalStorage } from 'usehooks-ts'
import { cn } from '~/lib/utils'
import { Plus } from 'lucide-react'
import { getAurinkoAuthUrl } from '~/lib/aurinko'

type Props = {
    isCollapsed: boolean
}

const AccountSwitcher  = ({isCollapsed}: Props) => {

    const { data: accounts, isLoading, error } = api.account.getAccounts.useQuery()
    const [accountId, setAccountId] = useLocalStorage('accountId', '') //persitent in local memory as opposed to alternative useState<string | null>(null)

    if (isLoading) return <div>Loading accounts...</div>
    if (error) return <div>Error loading accounts: {error.message}</div>
    if (!accounts || accounts.length === 0) return <div>No accounts found</div>

    return (
        <>
            <Select defaultValue={accountId} onValueChange={setAccountId}>
            <SelectTrigger
                className={cn(
                    "flex w-full flex-1 items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
                    isCollapsed &&
                    "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden"
                )}
                aria-label="Select account"
            >
                <SelectValue placeholder="Select an account">
                    <span className={cn({ "hidden": !isCollapsed })}>
                    {
                        accounts.find((account) => account.id === accountId)?.emailAddress[0] //get first letter of account when collapsed
                    }
                    </span>
                    <span className={cn("ml-2", isCollapsed && "hidden")}>
                    {
                        accounts.find((account) => account.id === accountId)
                        ?.emailAddress
                    }
                    </span>
                </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {accounts.map((account) => {
                        return (
                            <SelectItem key={account.id} value={account.id}> 
                                <div className="cursor-pointer flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
                                    {/* {account.icon} */}
                                    {account.emailAddress}
                                </div>
                            </SelectItem>
                        )
                    })}
                    <div onClick={async () => {
                        const authUrl = await getAurinkoAuthUrl('Google')

                        window.location.href = authUrl
                    }} className='flex relative outline-none focus:bg-accent rounded-sm py-1.5 pl-2 pr-8 text-sm hover:bg-gray-50 w-full cursor-pointer items-center'>
                        <Plus className='size-4 mr-1'/>
                        Add account
                    </div>
                </SelectContent>
            </Select>
            {/* {data?.map(account => {
                return <div key={account.id}>
                    {account.emailAddress}
                </div>
            })} */}
        </>
    )
}

export default AccountSwitcher 