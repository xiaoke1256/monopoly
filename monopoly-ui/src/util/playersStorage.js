  export function setPlayers(players){
    sessionStorage.setItem('players',JSON.stringify(players.map(player=>({_id:player._id,roleId:player.roleId,name:player.name,image:player.image,color:player.color,userId:player.userId}))));
  }

  export function getPlayers(){
    const players = sessionStorage.getItem('players');
    return players ? JSON.parse(players) : [];
  }