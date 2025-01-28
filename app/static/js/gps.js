const socket=new WebSocket('ws://localhost:8765')
socket.onopen=()=>{
    console.log("got it!")
}

socket.onmessage=(event)=>{
    console.log(event.data)
}

socket.onerror=(error)=>{
    console.log("error and shit")
}