const ErrorNotification = ( {message}:any ) => {
    if (message === null) {
        return null;
    }
    return (
        <div style={({textAlign:"center", color:"red", paddingTop:16})} className="error">
            {message}
        </div>
    )
}

export default ErrorNotification;