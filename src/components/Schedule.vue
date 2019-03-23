<template>
  <div>
    <b-card v-for="(item, index) in items" :key="index">
      <b-media>
        <b-img slot="aside" width="64" :src="item.image" style="height: 100%" />

        <b-media-body>
          <b-link :to="item.personUrl">
            <h5>{{item.personName}}</h5>
          </b-link>

          <a :href="item.shopUrl" class="card-link">{{item.shopName}} ({{item.place}})</a>
          
          <b-badge v-if="item.isToday" variant="success">Today</b-badge>
          <div v-for="(value, key) in item.schedule" :key="key">
            {{key}} : {{value}}
          </div>

        </b-media-body>
      </b-media>
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
    const urlsJson: {urls: string[]} = require('../assets/url.json');
    const apiUrl: string = 'https://us-central1-higapro-180014.cloudfunctions.net/higa-check-osmosis'
      + urlsJson.urls.reduce((prev: string, current: string) => { return prev + '&url=' + current; }, '?');

    this.items = [];

    this.requestAjax(apiUrl, this.apiCallback);
  }

  private apiCallback(response: ResponseItem[])  {
    const now = new Date();
    const today: string = (now.getMonth() + 1 ) + '/' + now.getDate() + '(' + this.yobi[now.getDay()] + ')';

    response.forEach((responseItem: ResponseItem) => {
      const matcher: RegExp = /^\d{1,2}:\d{2}/;
      const todaySchedule: string = responseItem.schedule[today];
      if (todaySchedule.match(matcher)) {
        responseItem.isToday = true;
      }

      const schedule: {[key: string]: string} = {};
      Object.keys(responseItem.schedule).forEach((key: string) => {
        if (responseItem.schedule[key].match(matcher)) {
          schedule[key] = responseItem.schedule[key];
        }
      });
      responseItem.schedule = schedule;
      this.items.push(responseItem);
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
</style>
