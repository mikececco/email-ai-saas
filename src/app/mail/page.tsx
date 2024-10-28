import Mail from './mail'

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