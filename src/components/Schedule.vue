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

interface GetScheduleResponse {
  schedule: {[key: string]: string};
  isToday: boolean;
}

interface GetUrlsResponse {
  urls: string[];
}

@Component
export default class Schedule extends Vue {
  private yobi: string[] = new Array('日', '月', '火', '水', '木', '金', '土');
  private items: GetScheduleResponse[] = [];
  constructor() {
    super();
    this.getUrls();
  }

  private getUrls() {
    const url = 'https://us-central1-higapro-180014.cloudfunctions.net/higa-check-config';
    this.requestAjax(url, this.getUrlsCallback);
  }

  private getUrlsCallback(response: GetUrlsResponse[]) {
    this.getSchedule(response[0].urls);
  }

  private getSchedule(urls: string[]) {
    const apiUrl: string = 'https://us-central1-higapro-180014.cloudfunctions.net/higa-check-osmosis'
      + urls.reduce((prev: string, current: string) => { return prev + '&url=' + current; }, '?');

    this.items = [];

    this.requestAjax(apiUrl, this.apiCallback);
  }



  private apiCallback(response: GetScheduleResponse[])  {
    const now = new Date();
    const today: string = (now.getMonth() + 1 ) + '/' + now.getDate() + '(' + this.yobi[now.getDay()] + ')';
    response.forEach((responseItem: GetScheduleResponse) => {
      const matcher: RegExp = /^\d{1,2}:\d{2}/;

      if (!responseItem.schedule || Object.keys(responseItem.schedule).length === 0) {
        return;
      }

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
