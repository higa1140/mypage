<template>
  <div>
    <b-card-group columns>
      <b-card v-for="(item, index) in items" :key="index"
        :img-src="item.image"
        img-alt="Image"
       style="max-width: 20rem;"
        class="mb-2"
      >
        <b-link :to="item.personUrl">
          <h5>{{item.personName}}</h5>
        </b-link>

        <a :href="item.shopUrl" class="card-link">{{item.shopName}} ({{item.place}})</a>
        <b-card-text>
          <b-badge v-if="item.isToday" variant="success">Today</b-badge>
          <div v-for="(value, key) in item.schedule" :key="key">
            <div v-if='value != "-"'>
            {{key}} :  {{value}}
            </div>
          </div>

        </b-card-text>
      </b-card>
    </b-card-group>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

interface Hoge {
  schedule: {[key: string]: string};
  isToday: boolean;

}

@Component
export default class Schedule extends Vue {
  private yobi: string[] = new Array("日","月","火","水","木","金","土");
  public items: Hoge[] = [];
  constructor(){
    super();
    this.getSchedule();
  }

  private getSchedule() {
    var url = 'https://us-central1-higapro-180014.cloudfunctions.net/higa-check';
    url+='?url=https%3A%2F%2Fwww.cityheaven.net%2Ftokyo%2FA1305%2FA130505%2Fcosplay-chikan%2Fgirlid-20595871%2F%3Flo%3D1';
    url+='&url=https%3A%2F%2Fwww.cityheaven.net%2Ftokyo%2FA1305%2FA130505%2Fcoach-watashi%2Fgirlid-20962052%2F%3Flo%3D1';
    url+='&url=https%3A%2F%2Fwww.cityheaven.net%2Ftokyo%2FA1304%2FA130404%2Fseifuku-o%2Fgirlid-22809307%2F%3Flo%3D1';
    url+='&url=https%3A%2F%2Fwww.cityheaven.net%2Ftokyo%2FA1303%2FA130301%2Fshibuya-snoop%2Fgirlid-22623293%2F%3Flo%3D1';
    url+='&url=https%3A%2F%2Fwww.cityheaven.net%2Ftokyo%2FA1303%2FA130301%2Fcennendo%2Fgirlid-24191028%2F%3Flo%3D1';

    this.items = [];

    let cb = ( response: Hoge[]) => {
      let now = new Date();
      var today: string = (now.getMonth() + 1 ) + "/" + now.getDate() + "(" + this.yobi[now.getDay()] + ")";

      response.forEach((value: Hoge)=>{
        let todaySchedule: string = value.schedule[today];
        if (todaySchedule.match(/^\d{1,2}:\d{2}/)) {
          value["isToday"] = true;
        }
 
        this.items.push(value);
      });

    };
    this.requestAjax(url, cb);
  }



  private requestAjax (endpoint: string, callback: Function) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
      if (this.readyState==4 && this.status==200) {
        callback(this.response);
      }
    };
    xhr.responseType = 'json';
    xhr.open('GET',endpoint,true);
    xhr.send();
  };

  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
