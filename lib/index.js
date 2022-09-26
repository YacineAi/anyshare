const fetch = require('node-fetch');
const cheerio = require('cheerio');
const urler = require('catch-redirect-url');
const axios = require("axios");

//const parseString = (string) => JSON.parse(`{"text": "${string}"}`).text;

/* --------------- CORE --------------- */
function get(url) {
  return new Promise((resolve, reject) => {
    if (url.startsWith("https://vm.tiktok.com/") || url.startsWith("https://www.tiktok.com/") || url.startsWith("https://m.tiktok.com/v/")) {
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
      fetch("https://api.instavideosave.com/allinone", {
        "headers": {
          "url": url,
          "Referer": "https://instavideosave.net/"
        },
        "body": null,
        "method": "GET"
      })
      .then(response => response.json())
      .then(data => {
        if (data.video) {
          const result = {
            instavid: data.video[0].video
          }
          resolve(result);
        } else {
          const result = {
            instimage: data.image[0]
          }
          resolve(result);
        }
      }).catch(e => {
        reject({ status: false, message: 'error fetch data', e: e.message })
    });
  } else if (url.startsWith("@")) {
      let uid = url.replace("@", "");
      fetch("https://igdownloader.com/ajax", {
        "headers": {
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "x-requested-with": "XMLHttpRequest",
          "Referer": "https://igdownloader.com/reels-downloader"
        },
        "body": `link=https://www.instagram.com/${uid}&downloader=avatar`,
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