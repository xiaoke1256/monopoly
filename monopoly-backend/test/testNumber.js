

const generateRoomNo = ()=>{
  return Math.floor(Math.random()*Math.pow(16,4)).toString(16).toUpperCase()
}

console.log("roomNo:", generateRoomNo())