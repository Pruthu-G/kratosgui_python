document.addEventListener('DOMContentLoaded',()=>{
    const comp=document.getElementById('sgp-post');
    //
    const socket=new WebSocket("ws://localhost:8767");
    socket.onopen=()=>{
        console.log("opened!!");
    }
    socket.onmessage=(event)=>{
        const ed=JSON.parse(JSON.parse(event.data));
        const arr=ed.data;
        comp.innerHTML='<i class="fas fa-globe"></i>Carbon Dioxide (CO2): '+arr[0]+' </p><div class="details"> <h3>Gas Sensor(SGP30)</h3> <p>TVOC,eCO2</p> </div>';
    }
});