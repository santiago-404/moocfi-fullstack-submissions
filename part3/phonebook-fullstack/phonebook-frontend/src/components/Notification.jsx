export const Notification = ({content: {success, message}}) => {
  if(!message) return;

  const color = success ? 'green' : 'red'

  const messageStyle = {
    paddingLeft: 10,
    margin: 10,
    borderStyle: 'solid',
    borderRadius: 5,
    borderWidth: 5,
    borderColor: color,
    fontColor: color
  }

  return (
    <div style={messageStyle}>
      <h1>{message}</h1>
    </div>
  )
}