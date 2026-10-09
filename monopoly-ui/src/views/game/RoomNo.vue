<template>
  <div class="center">
    <QrcodeVue :value="url" />
  </div>
</template>
<script>
import QrcodeVue from 'qrcode.vue';
import { getCurrentRoomNo } from '@/api/gameApi.js';

export default {
  name: 'RoomNoComponent',
  components: {
    QrcodeVue
  },
  data() {
    return {
      roomNo: '',
      url: window.location.href
    };
  },
  mounted(){
    getCurrentRoomNo().then(roomNo=>{
      this.roomNo = roomNo;
      const protocol = location.protocol;
      this.url = `${protocol}//${location.host}/login?roomNo=${this.roomNo}`;
    }).catch(error=>{
      console.error('Error fetching current room number:', error);
    });
  }
}
</script>
<style lang="scss" scoped>
.center {
  text-align: center;
}
</style>