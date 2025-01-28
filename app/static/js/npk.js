document.addEventListener('DOMContentLoaded', ()=>{
  const comp=document.getElementById('npk-post');
  // comp.textContent="Nitrogen (N): 30 ppm \n Phosphorus (P): 20 ppm \n Potassium (K): 100 ppm \n Soil pH: 6.5 \n Soil Moisture: 40% \n Temperature: 25°C \n Humidity: 50%";
  
  const socket=new WebSocket("ws://localhost:8766");
  socket.onopen=()=>{
    console.log("npk websocket initiating");
  }
  socket.onmessage=(event)=>{
    const ed=JSON.parse(JSON.parse(event.data));
    const arr=ed.data;
    comp.innerHTML='<p><i class="fa fa-leaf"></i> Nitrogen (N):'+arr[0]+'\n<i class="fa fa-leaf"></i> Phosphorus (P):'+arr[1]+'\n <i class="fa fa-cogs"></i> Potassium (K):'+arr[2]+'\n<i class="fa fa-tint"></i>Soil pH:'+arr[3]+'\n<i class="fa fa-tint"></i>Soil Moisture:'+arr[4]+'%\n<i class="fa fa-thermometer-half"></i>Temperature:'+arr[5]+'\n<i class="fa fa-tint"></i>Humidity:'+arr[6]+'%\n</p><div class="details"><h3>NPK</h3><p>Nitrogen Phosphorous Potassium</p></div>';

  }
  socket.onclose=()=>{
    console.log("closed");
  }
});