export namespace AjaxUtil {
  export function requestAjax(endpoint: string, callback: (response: any) => void) {
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
