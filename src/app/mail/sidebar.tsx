import React from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { Nav } from './nav'
import { File, Inbox, Send } from 'lucide-react'

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
                },
                {
                    title: 'Draft',
                    label: '4',
                    icon: File,
                    variant: 'ghost' 
                },
                {
                    title: 'Sent',
                    label: '6',
                    icon: Send,
                    variant: 'ghost'
                },
            ]
        } />
    )
}

export default Sidebar