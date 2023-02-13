const fetch = require('node-fetch');
const cheerio = require('cheerio');
const urler = require('catch-redirect-url');
const axios = require("axios");

//const parseString = (string) => JSON.parse(`{"text": "${string}"}`).text;

/* --------------- CORE --------------- */
function get(url) {
  return new Promise((resolve, reject) => {
    if (url.startsWith("https://vm.tiktok.com/") || url.startsWith("https://www.tiktok.com/") || url.startsWith("https://m.tiktok.com/v/")) {
      axios.get('https://tikwm.com/api/?url=' + url)
      .then((resp) => {
        const result = {
          tiktok: resp.data.data.play
        }
        resolve(result);
      })
      /*
      axios.get('https://ttdownloader.com/')
      .then((resp) => {
        const $ = cheerio.load(resp.data);
        const cookie = resp.headers['set-cookie'].join('');
        const token = $('#token').attr('value');
        fetch("https://ttdownloader.com/search/", {
          "headers": {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "cookie": cookie,
            "Referer": "https://ttdownloader.com/"
          },
          "body": `url=${url}&format=&token=${token}`,
          "method": "POST"
          })
          .then(res => res.text())
          .then(data => {
          const $1 = cheerio.load(data)
          const cher = $1('.result:nth-child(2) .download-link').attr('href');
          urler(cher, function (url) {
            const result = {
              tiktok: url
            }
            resolve(result);
          })
        })
      })
      */
  } else if (url.startsWith("https://www.facebook.com/")) {
    axios.get('https://fdownloader.net/en')
      .then(({ data }) => {
        const exp = data.match(/k_exp="(.*?)"/);
        const token = data.match(/k_token="(.*?)"/);
        fetch("https://fdownloader.net/api/ajaxSearch", {
          "headers": {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
          },
          "body": `k_exp=${exp[1]}&k_token=${token[1]}&q=${url}`,
          "method": "POST"
        })
        .then(response => response.json())
        .then(data => {
          var $1 = cheerio.load(data.data);
          var link = $1('.button.is-success.is-small.download-link-fb').attr('href');
          var time = $1('p').text();
          time = time.split(":");
          if (time[0] >= 5) {
            var e = 819
              reject(e)
          } else {
            const result = {
              facebook: link
            }
            resolve(result);
          }
        })
      }).catch(e => {
          reject({ status: false, message: 'error fetch data', e: e.message })
      });
  } else if (url.startsWith("https://fb.watch/")) {
    fetch(url)
    .then(response => response) // x.url
    .then(x => fetch("https://fdownloader.net/api/ajaxSearch", {
      "headers": {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      "body": `q=${x.url}`,
      "method": "POST"
    })
    .then(response => response.json())
    .then(data => {
      var $1 = cheerio.load(data.data);
      var link = $1('.button.is-success.is-small.download-link-fb').attr('href');
      var time = $1('p').text();
      time = time.split(":");
      if (time[0] >= 5) {
        var e = 819
          reject(e)
      } else {
        const result = {
          facebook: link
        }
        resolve(result);
      }
    }).catch(e => {
      reject({ status: false, message: 'error fetch data', e: e.message })
  }));
  } else if (url.startsWith("https://www.instagram.com/p/") || url.startsWith("https://www.instagram.com/tv/") || url.startsWith("https://www.instagram.com/reel/")) {
      //const vid = url.split('/')[4];
      fetch("https://ssyoutube.com/api/convert", {
        "headers": {
          "accept": "application/json, text/plain, */*",
          "accept-language": "en,ar-DZ;q=0.9,ar;q=0.8",
          "content-type": "application/json",
          "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest",
          "cookie": "_ga=GA1.2.1105512461.1669141912; uid=7dd280a92bfd4314; laravel_session=eyJpdiI6IkRsY0gzamdyMFV3T050Y1g5bkFIb0E9PSIsInZhbHVlIjoiTnltMkFFZUo5MG1KTUpUcFpoTmpNTTRrT2ZIcmtmMEtsREl6UXltYk4vRlYvcXptVmhWbDN4QlR2Y0VkYVVFUXI0VE51WHZaUTdTMWdLNWpyT1VXbEFla1BwY1V3akNNSmdndnlZOTFwNEJjaHdLV09MZndOUWpqY1MzMWFnem8iLCJtYWMiOiIzNmEzMzZhYTM1MTJkMDMwZmIzZGVkMzU1MjM5YTY1ZDljZDk3NDU0MzdlYTUyYTMxMjNiYjkyZTNlODY0NzgxIiwidGFnIjoiIn0%3D; push=29; outputStats=37; clickAds=38; _gid=GA1.2.640126404.1676296979; _gat_outputStats=1",
          "Referer": "https://ssyoutube.com/en467/",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": `{\"url\":\"${url}\"}`,
        "method": "POST"
      })
      .then(response => response.json())
      .then(data => {
        if (data.url[0].type == "mp4") {
          let unsafe = data.url[0].url.split("uri=");
          let base = unsafe[1].split("&filename=");
          const result = {
            instavid: decodeURIComponent(base[0])
          }
          resolve(result);
        } else {
          const result = {
            instimage: data.url[0].url
          }
          resolve(result);
        }
      }).catch(e => {
        reject({ status: false, message: 'error fetch data', e: e.message })
    });
  } else if (url.startsWith("https://www.instagram.com/stories/")) {
    fetch("https://ssyoutube.com/api/ig/story?url=" + encodeURIComponent(url), {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en,ar-DZ;q=0.9,ar;q=0.8",
        "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
        "cookie": "_ga=GA1.2.1105512461.1669141912; uid=7dd280a92bfd4314; push=29; outputStats=37; clickAds=38; _gid=GA1.2.640126404.1676296979; laravel_session=eyJpdiI6IjRHMU1xamtYR3R6Q0k1azJOQ1psRVE9PSIsInZhbHVlIjoiMjNkRkpxS3lxaEFwWmlRL0pIbC8vMWRIczBuM2tWb1ZRb0twcmlzLzQzMW5Yek5RVmpGZFZyMGFuMWhoWWtaVWc2MFFEdVpOT1NCOVNMa1pEeUp6S3VjN093a2IwMFROY1V3cUw1YWRyS0YrKzN0YjVINjJrNjFWV2o3YmcvWjQiLCJtYWMiOiJkZmY5MDJjNGNjN2JhNTZlNmRiM2IzODg4ZGFlM2RjMWY4ZTYyMjI0YjZiYjUwODA0OTdhN2NhZmVjNWEwOThlIiwidGFnIjoiIn0%3D; _gat_outputStats=1",
        "Referer": "https://ssyoutube.com/en467/",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "body": null,
      "method": "GET"
    })
      .then(response => response.json())
      .then(data => {
        if (data.result[0].video_versions) {
          const result = {
            instavid: data.result[0].video_versions[0].url
          }
          resolve(result);
        } else {
          const result = {
            instimage: data.result[0].image_versions2.candidates[0].url
          }
          resolve(result);
        }
      }).catch(e => {
        reject({ status: false, message: 'error fetch data', e: e.message })
    });
  } else if (url.startsWith("@")) {
      let uid = url.split("@");
      fetch("https://igdownloader.com/ajax", {
        "headers": {
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "x-requested-with": "XMLHttpRequest",
          "Referer": "https://igdownloader.com/reels-downloader"
        },
        "body": `link=https://www.instagram.com/${uid[1]}&downloader=avatar`,
        "method": "POST"
      })
      .then(response => response.json())
      .then(data => {
        var $1 = cheerio.load(data.html);
        var link = $1('.download-button').attr('href');
        const result = {
          instavatar: link
        }
        resolve(result);
      }).catch(e => {
        reject({ status: false, message: 'error fetch data', e: e.message })
    });
  } else if (url.startsWith("https://youtube.com/") || url.startsWith("https://www.youtube.com/") || url.startsWith("https://youtu.be/")) {
      fetch("https://api.onlinevideoconverter.pro/api/convert", {
      "headers": {
        "content-type": "application/json",
        "Referer": "https://onlinevideoconverter.pro/"
      },
      "body": `{\"url\":\"${url}\"}`,
      "method": "POST"
    })
      .then(response => response.json())
      .then(data => {
        var durTime = data.meta.duration;
        durTime = durTime.split(":");
        if (durTime[0] >= 10) {
          var e = 819
          reject(e)
        } else {
          if (durTime[0] <= 1) {
            if (data.url[0] == "720") {
              const result = {
                shorts: [{
                  cover: data.thumb,
                  id: data.id,
                  name: data.meta.title,
                  duration: data.meta.duration,
                  vid: data.url[0].url,
                  audio: data.mp3Converter
                }]
              }
              resolve(result);
            } else if (data.url[1] == "720") {
              const result = {
                shorts: [{
                  cover: data.thumb,
                  id: data.id,
                  name: data.meta.title,
                  duration: data.meta.duration,
                  vid: data.url[1].url,
                  audio: data.mp3Converter
                }]
              }
              resolve(result);
            } else {
              const result = {
                shorts: [{
                  cover: data.thumb,
                  id: data.id,
                  name: data.meta.title,
                  duration: data.meta.duration,
                  vid: data.url[0].url,
                  audio: data.mp3Converter
                }]
              }
              resolve(result);
            }
          } else {
            const result = {
              shorts: [{
                cover: data.thumb,
                id: data.id,
                name: data.meta.title,
                duration: data.meta.duration,
                vid: data.url[1].url,
                audio: data.mp3Converter
              }]
            }
            resolve(result);
          }
        }
      }).catch(e => {
        reject({ status: false, message: 'error fetch data', e: e.message })
    });
  } else if (url.startsWith("https://pin.it/")) {
    const fx = url.split('/')[3]
    urler(`https://api.pinterest.com/url_shortener/${fx}/redirect/`, function (url) {
      const vid = url.split('/')[4]
      axios.get(`https://www.pinterest.com/pin/${vid}/`)
      .then(({ data }) => {
        var arrayGet = data.match(/"V_720P":{(.*?)}/);
        if (arrayGet != null) {
          let vidGet = arrayGet[1].match(/"url":"(.*?)"/);
          const result = {
            pinvid: vidGet[1]
          }
          resolve(result);
        } else {
          let arrayGet = data.match(/"V_EXP7":{(.*?)}/);
          let vidGet = arrayGet[1].match(/"url":"(.*?)"/);
          const result = {
            pinvid: vidGet[1]
          }
          resolve(result);
        }
      }).catch(e => {
          reject({ status: false, message: 'error fetch data', e: e.message })
      });
    })
  }
  })
}
  module.exports.get = get