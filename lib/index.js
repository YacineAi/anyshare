const fetch = require('node-fetch');
const cheerio = require('cheerio');
const urler = require('catch-redirect-url');
const axios = require("axios");
const http = require('http');
const https = require('https');

function getFileSize(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const options = {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    };

    const request = client.request(url, options, (response) => {
      if (response.statusCode === 200) {
        const contentLength = parseInt(response.headers['content-length'], 10);
        const sizeInKB = contentLength / 1024;
        resolve(sizeInKB);
      } else {
        reject(new Error(`Request failed with status code ${response.statusCode}`));
      }
    });

    request.on('error', reject);
    request.end();
  });
}



//const parseString = (string) => JSON.parse(`{"text": "${string}"}`).text;

/* --------------- CORE --------------- */
function get(url, token) {
  return new Promise(async (resolve, reject) => {
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
  } else if (url.startsWith("https://www.facebook.com/") || url.startsWith("https://fb.watch/")) {
    try {
    const vid = url.match(/\/(?:videos|reel|watch)(?:\/?)(?:\?v=)?(\d+)/)?.[1];
    const response = await fetch(`https://graph.facebook.com/v8.0/${vid}?fields=source&access_token=${token}`);
    const data = await response.json();
    const result = {
      facebook: data.source
    }
    resolve(result);
    } catch (error) {
      reject({ status: false, message: 'error fetch data', e: error.message })
    }
/*
    axios.get(`https://fbdownloader.live/`)
      .then((resp) => {
        var token = resp.data.match(/_csrf:'(.*?)'/);
        const $ = cheerio.load(resp.data);
        const cookie = resp.headers['set-cookie'].join('');
        fetch("https://fbdownloader.live/analyze", {
      "headers": {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "x-requested-with": "XMLHttpRequest",
        "cookie": cookie,
        "Referer": "https://fbdownloader.live/",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "body": `q=${encodeURIComponent(url)}&_csrf=${token[1]}`,
      "method": "POST"
    })
    .then(res => res.text())
    .then(data => {
      //console.log(data)
      const $1 = cheerio.load(data)
      const cher = $1('#video tr:first-child .button.is-small.is-success.no-underline').attr('href');
      //console.log(data)
      getFileSize(cher)
      .then((size) => {
        if(size.toFixed() > 25000) {
          const result = {
            limit: "25mb"
          }
          resolve(result);
        } else {
          const result = {
            facebook: cher
          }
          resolve(result);
        }
  })
  .catch((e) => {
    reject({ status: false, message: 'error fetch data', e: e.message })
  });
    }).catch(e => {
      reject({ status: false, message: 'error fetch data', e: e.message })
  });
      })
    */
  } else if (url.startsWith("https://x.xx/")) {
    //
  } else if (url.startsWith("https://www.instagram.com/p/") || url.startsWith("https://www.instagram.com/tv/") || url.startsWith("https://www.instagram.com/reel/")) {
      //const vid = url.split('/')[4];
      fetch("https://saveig.app/api/ajaxSearch", {
        "headers": {
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "Referer": "https://saveig.app/en"
        },
        "body": `q=${encodeURIComponent(url)}&t=media&lang=en`,
        "method": "POST"
      })
      .then(res => res.json())
          .then(data => {
          const $1 = cheerio.load(data.data)
          const cher = $1('.download-items__btn a').attr('href');
          const result = {
            instavid: cher
          }
          resolve(result);
        }).catch(e => {
          reject({ status: false, message: 'error fetch data', e: e.message })
      });
  } else if (url.startsWith("https://www.instagram.com/stories/") || url.startsWith("https://instagram.com/stories/")) {
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