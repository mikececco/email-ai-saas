import React from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { Nav } from './nav'
import { Inbox } from 'lucide-react'

type Props = {
    isCollapsed: boolean
}

const Sidebar = ({isCollapsed} : Props) => {
    const [accountId] = useLocalStorage('accountId', '') //accessible everywhere
    return (
        <Nav isCollapsed={isCollapsed} links={
            [
                {
                    title: 'Inbox',
                    label: '1',
                    icon: Inbox,
                    variant: 'default'
                }
            ]
        } />
    )
}

export default Sidebar