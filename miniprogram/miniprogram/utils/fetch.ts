const app = getApp<IAppOption>();

export function setObjToUrlParams (baseUrl: string, obj?: Record<string, string | number>): string {
  if (!obj) return baseUrl;

  let parameters = '';
  for (const key in obj) {
    parameters += '&' + key + '=' + encodeURIComponent(obj[key]);
  }

  const id = baseUrl.lastIndexOf('?');
  if (id < 0) return baseUrl.replace(/\/?$/, '?') + parameters.slice(1);

  return baseUrl.slice(0, id) + '?' + baseUrl.slice(id + 1).replace(/\/$/, '') + parameters;
}

export class Http {
  static get<T>(url: string, params: Record<string, string | number>, config?: Record<string, any>) {
    return this.request<T>(
      setObjToUrlParams(url, params),
      {
        method: 'GET',
        ...config,
      }
    )
  }

  static post<T>(url: string, data: any, config?: Record<string, any>) {
    return this.request<T>(
      url,
      {
        data,
        method: 'POST',
        ...config,
      });
  }

  static request<T>(url: string, config: Record<string, any>): Promise<T> {
    return new Promise((resolve, reject) => {
      url = `${config.apiUrl || app.globalData.apiUrl}${url}`;

      const header: any = {};
      if (app.globalData.userInfo?.accessToken) 
        header['Authorization'] = `Bearer ${app.globalData.userInfo?.accessToken}`;
      
      wx.request({
        url,
        ...config,
        header,
        success (res) {
          try {
            if (config.responseType == 'arraybuffer') 
              return resolve(res.data as T);
            const data = JSON.parse(res.data as string);
            if (data.state) {
              reject(new Error(data.msg));
            }
            resolve(data.data);
          } catch (error) {
            resolve(res.data as T);
          }
        },
        fail (err) {
          reject(err)
        }
      })
    })
  }
} 
