<template>
  <div>
    <b-card-group>
      <b-card v-for="(item, index) in items" :key="index"
        :img-src="item.image"
        img-alt="Image"
        img-top
        tag="article"
        style="max-width: 20rem;"
        class="mb-2"
      >
        <b-link :to="item.personUrl">
          <h4>{{item.personName}}</h4>
        </b-link>
        <a :href="item.shopUrl" class="card-link">{{item.shopName}}</a>
        <b-card-text>{{item.schedule}}</b-card-text>
      </b-card>
    </b-card-group>
  </div>
</template>

<script>
export default {
  name: 'Schedule',
  data: function() {
    var ret = [];
    var requestAjax = function(endpoint, callback) {
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

    var url = 'https://us-central1-higapro-180014.cloudfunctions.net/higa-check?url=https%3A%2F%2Fwww.cityheaven.net%2Ftokyo%2FA1305%2FA130505%2Fcosplay-chikan%2Fgirlid-20595871%2F%3Flo%3D1&url=https%3A%2F%2Fwww.cityheaven.net%2Ftokyo%2FA1305%2FA130505%2Fcoach-watashi%2Fgirlid-20962052%2F%3Flo%3D1';

    requestAjax(url, function(response){
        response.forEach(function(value) {
          ret.push(value);
        });
      });

    return { items: ret };
  }
}
</script>

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
