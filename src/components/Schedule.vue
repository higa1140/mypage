<template>
  <div>
    <b-card v-for="(item, index) in items" :key="index"
      :img-src="item.image"
      img-alt="Image"
      img-left
      class="mb-3"
      >
      <b-link :to="item.personUrl">
        <h5>{{item.personName}}</h5>
      </b-link>

      <a :href="item.shopUrl" class="card-link">{{item.shopName}} ({{item.place}})</a>
      <b-card-text>
        <b-badge v-if="item.isToday" variant="success">Today</b-badge>
        <div v-for="(value, key) in item.schedule" :key="key">
          <div v-if='value != "-"'>
          {{key}} : {{value}}
          </div>
        </div>

      </b-card-text>
    </b-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

interface ResponseItem {
  schedule: {[key: string]: string};
  isToday: boolean;

}

@Component
export default class Schedule extends Vue {
  private yobi: string[] = new Array('日', '月', '火', '水', '木', '金', '土');
  private items: ResponseItem[] = [];
  constructor() {
    super();
    this.getSchedule();
  }

  private getSchedule() {
    let apiUrl = 'https://us-central1-higapro-180014.cloudfunctions.net/higa-check';

    const urlsJson: {urls: string[]} = require('../assets/url.json');
    apiUrl += urlsJson.urls.reduce((prev: string, current: string) => { return prev + '&url=' + current; }, '?');

    this.items = [];

    this.requestAjax(apiUrl, this.apiCallback);
  }

  private apiCallback(response: ResponseItem[])  {
    const now = new Date();
    const today: string = (now.getMonth() + 1 ) + '/' + now.getDate() + '(' + this.yobi[now.getDay()] + ')';

    response.forEach((value: ResponseItem) => {
      const todaySchedule: string = value.schedule[today];
      if (todaySchedule.match(/^\d{1,2}:\d{2}/)) {
        value.isToday = true;
      }

      const schedule: {[key: string]: string} = {};
      Object.keys(value.schedule).forEach((key: string) => {
        if (value.schedule[key].match(/^\d{1,2}:\d{2}/)) {
          schedule[key] = value.schedule[key];
        }
      });
      value.schedule = schedule;
      this.items.push(value);
    });
  }

  private requestAjax(endpoint: string, callback: (response: any) => void) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        callback(this.response);
      }
    };
    xhr.responseType = 'json';
    xhr.open('GET', endpoint, true);
    xhr.send();
  }
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
