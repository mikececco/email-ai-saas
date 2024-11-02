'use client'

import React, { useState } from 'react'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '~/components/ui/resizable'
import { Separator } from '~/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { TooltipProvider } from '~/components/ui/tooltip'
import { cn } from '~/lib/utils'
import AccountSwitcher from './account-switcher'
import Sidebar from './sidebar'
import ThreadList from './thread-list'

type Props = {
    defaultLayout: number[] | undefined
    navCollapsedSize: number
    defaultCollapsed: boolean
}

const Mail = ({defaultLayout = [20,32,48], navCollapsedSize, defaultCollapsed} : Props) => { //20,32,48 in percentage of the screen
  
    const [isCollapsed, setIsCollapsed] = useState(false)
  
    return (
    <TooltipProvider delayDuration={0}>
        <ResizablePanelGroup direction="horizontal" onLayout={(sizes: number[]) => {
            console.log(sizes); //listen for size change
        }} className='items-stretch h-full min-h-screen'>
      <ResizablePanel defaultSize={defaultLayout[0]} 
      collapsedSize={navCollapsedSize} 
      collapsible={true} 
      minSize={15}
      maxSize={40}
      onCollapse={() => {
        setIsCollapsed(true)
      }}
      onResize={() => {
        setIsCollapsed(false)
      }}
      className={cn(isCollapsed && 'min-w-[50px] transition-all duration-300 ease-in-out')}>
        <div className='flex flex-col h-full flex-1'>
            <div className={cn('flex h-[52px] items-center justify-center', isCollapsed ? 'h-[52px]' : 'px-2')}>
                {/* Account Switcher */}
                <AccountSwitcher isCollapsed={isCollapsed}/>
            </div>
            <Separator />
            <Sidebar isCollapsed={isCollapsed} />
            <div className='flex-1'>
            </div>
            Ask AI
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
        <Tabs defaultValue='inbox'>
          <div className='flex items-center px-4 py-2'>
            <h1 className='text-xl font-bold'>Inbox</h1>
            <TabsList className='ml-auto'>
              <TabsTrigger value='inbox' className='text-zinc-600 dark:text-zinc-200'>
                Inbox
              </TabsTrigger>
              <TabsTrigger value='done' className='text-zinc-600 dark:text-zinc-200'>
                Done
              </TabsTrigger>
            </TabsList>
          </div>

          <Separator />
          Searchbar
          <TabsContent value='inbox'>
            <ThreadList />
          </TabsContent>
          <TabsContent value='done'>
            <ThreadList />
          </TabsContent>
        </Tabs>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
        Thread Display
      </ResizablePanel>
    </ResizablePanelGroup>
    </TooltipProvider>
  )
}

export default Mail