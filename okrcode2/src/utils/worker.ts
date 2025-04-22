onmessage = (event:MessageEvent<any>)=>{
  startTimer(event.data)
}

function startTimer (data:any){
  setInterval(()=>{
    postMessage(data.message || 'interval')
  },data.timer || 15000)
}


