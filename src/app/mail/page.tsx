import dynamic from 'next/dynamic'

// import Mail from './mail'
const Mail = dynamic(() => {
  return import ('./mail')
}, {
  ssr: false //This approach is useful for components that rely on client-specific data or when you want to optimize server performance by reducing the rendering workload.
})

const EmailDashboard = () => {
  return (
    <Mail 
      defaultLayout = {[20,32,48]}
      navCollapsedSize = {4}
      defaultCollapsed = {false}
    />
  )
}

export default EmailDashboard