interface LocalStorageValue {
  expire: number;
  value: any;
}

export namespace LocalStorageUtil {
  export function setLocalStorage(key: string, value: any): void {
    const setValue: LocalStorageValue = {
      expire: getExpire().getTime(),
      value,
    };
    localStorage.setItem(key, JSON.stringify(setValue));
  }

  export function getLocalStorage( key: string): any {
    const value = localStorage.getItem(key);
    if (!value) {
      return null;
    }

    const ls: LocalStorageValue = JSON.parse(value);

    if (ls.expire < new Date().getTime()) {
      localStorage.removeItem(key);
      ls.value = null;
    }
    return ls.value;
  }

  function getExpire(): Date {
    const dt = new Date();
    dt.setDate(dt.getDay() + 1);
    return dt;
  }
}
