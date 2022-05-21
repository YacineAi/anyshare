const fetch = require('node-fetch');
const request = require('request-promise');
const cheerio = require('cheerio');
const urler = require('catch-redirect-url');
const axios = require("axios");
const headers = {
  "sec-fetch-user": "?1",
  "sec-ch-ua-mobile": "?0",
  "sec-fetch-site": "none",
  "sec-fetch-dest": "document",
  "sec-fetch-mode": "navigate",
  "cache-control": "max-age=0",
  authority: "www.facebook.com",
  "upgrade-insecure-requests": "1",
  "accept-language": "en-GB,en;q=0.9,tr-TR;q=0.8,tr;q=0.7,en-US;q=0.6",
  "sec-ch-ua": '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36",
  accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  cookie:
    "sb=jNw1YphPwIn4Z2FUS5V83WOH; datr=LRlHYgL5F3u1buqhVYPkFm8z; wd=1366x625; locale=en_US; c_user=100021257839965; xs=25:yLOKhQI1Fc60EA:2:1652538815:-1:-1; fr=0zJKaxTIZtxISo5Ug.AWUkNpI593bTtER6xD-V8fFzLMg.Bif7v8.lm.AAA.0.0.Bif73F.AWWbkERbS7k;",
};


const parseString = (string) => JSON.parse(`{"text": "${string}"}`).text;

/* --------------- CORE --------------- */
function get(url) {
  return new Promise((resolve, reject) => {
    if (url.startsWith("https://vm.tiktok.com/")) {
      urler(url, function (url) {
        if (url.startsWith("https://m.tiktok.com/v/")){
          var remv0 = url.split('.html')[0]
          const vid0 = remv0.split('/')[4]
          fetch(`https://api2.musical.ly/aweme/v1/aweme/detail/?aweme_id=${vid0}`)
              .then(response => response.json())
              .then(data0 => {
                var reqOptions = {
                  method: 'GET',
                  uri: `https://www.tiktok.com/node/share/video/@${data0.aweme_detail.author.unique_id}/${vid0}/`,
                  qs: {},
                  headers: {
                    'user-agent': 'okhttp'
                  },
                  json: true
                };
                request(reqOptions)
                  .then(function(parsedBody) {
                    const result = {
                      tiktok:[{
                        author: data0.aweme_detail.author.nickname,
                        cover: parsedBody.itemInfo.itemStruct.video.cover,
                        description: data0.aweme_detail.desc,
                        videowm: parsedBody.itemInfo.itemStruct.video.downloadAddr,
                        videonm: data0.aweme_detail.video.play_addr.url_list[0],
                        audio: parsedBody.itemInfo.itemStruct.music.playUrl
                      }]
                    }
                    resolve(result);
                  })
              })
            .catch(e => {
              reject({ status: false, message: 'error fetch data', e: e.message })
          });
        } else {
          var remv = url.split('?')[0]
          const uid = remv.split('/')[3]
          const vid = remv.split('/')[5]
          fetch(`https://api2.musical.ly/aweme/v1/aweme/detail/?aweme_id=${vid}`)
              .then(response => response.json())
              .then(data => {
                var reqOptions = {
                  method: 'GET',
                  uri: `https://www.tiktok.com/node/share/video/${uid}/${vid}/`,
                  qs: {},
                  headers: {
                    'user-agent': 'okhttp'
                  },
                  json: true
                };
                request(reqOptions)
                  .then(function(parsedBody) {
                    const result = {
                      tiktok:[{
                        author: data.aweme_detail.author.nickname,
                        cover: parsedBody.itemInfo.itemStruct.video.cover,
                        description: data.aweme_detail.desc,
                        videowm: parsedBody.itemInfo.itemStruct.video.downloadAddr,
                        videonm: data.aweme_detail.video.play_addr.url_list[0],
                        audio: parsedBody.itemInfo.itemStruct.music.playUrl
                      }]
                    }
                    resolve(result);
                  })
              })
            .catch(e => {
              reject({ status: false, message: 'error fetch data', e: e.message })
          });
        }
      })
  } else if (url.startsWith("https://www.tiktok.com/")) {
      var remv = url.split('?')[0]
        // const uid = remv.split('/')[3]
        const vid = remv.split('/')[5]
        fetch(`https://api2.musical.ly/aweme/v1/aweme/detail/?aweme_id=${vid}`)
            .then(response => response.json())
            .then(data => {
              const result = {
                tiktok:[{
                  author: data.aweme_detail.author.nickname,
                  cover: data.aweme_detail.video.origin_cover.url_list[0],
                  description: data.aweme_detail.desc,
                  videowm: data.aweme_detail.video.download_addr.url_list[0],
                  videonm: data.aweme_detail.video.play_addr.url_list[0],
                  audio: data.aweme_detail.music.play_url.url_list[0]
                }]
              }
              resolve(result);
            }).catch(e => {
            reject({ status: false, message: 'error fetch data', e: e.message })
        });
  } else if (url.startsWith("https://m.tiktok.com/v/")) {
      var remv = url.split('.html')[0]
      const vid = remv.split('/')[4]
      fetch(`https://api2.musical.ly/aweme/v1/aweme/detail/?aweme_id=${vid}`)
            .then(response => response.json())
            .then(data => {
              var reqOptions = {
                method: 'GET',
                uri: `https://www.tiktok.com/node/share/video/@${data.aweme_detail.author.unique_id}/${vid}/`,
                qs: {},
                headers: {
                  'user-agent': 'okhttp'
                },
                json: true
              };
              request(reqOptions)
                .then(function(parsedBody) {
                  const result = {
                    tiktok:[{
                      author: data.aweme_detail.author.nickname,
                      cover: parsedBody.itemInfo.itemStruct.video.cover,
                      description: data.aweme_detail.desc,
                      videowm: parsedBody.itemInfo.itemStruct.video.downloadAddr,
                      videonm: data.aweme_detail.video.play_addr.url_list[0],
                      audio: parsedBody.itemInfo.itemStruct.music.playUrl
                    }]
                  }
                  resolve(result);
                })
            }).catch(e => {
            reject({ status: false, message: 'error fetch data', e: e.message })
        });
  } else if (url.startsWith("https://www.facebook.com/reel/")) {
      var remv = url.split('?')[0]
      const vid = remv.split('/')[4]
      axios.get(`https://www.facebook.com/watch/?v=${vid}`, { headers })
      .then(({ data }) => {
        const sdMatch = data.match(/"playable_url":"(.*?)"/);
        const hdMatch = data.match(/"playable_url_quality_hd":"(.*?)"/);
        const vidtime = data.match(/"playable_duration_in_ms":(.*?),/);
        const sd = parseString(sdMatch[1]);
        const hd = hdMatch && hdMatch[1] ? parseString(hdMatch[1]) : "";
        if (vidtime[1] >= 300000) {
          var e = 819
          reject(e)
        } else {
          if (vidtime[1] <= 60000) { // 1min
            if (hd.length != 0) {
              const result = {
                facebook: hd
              }
              resolve(result);
            } else {
              const result = {
                facebook: sd
              }
              resolve(result);
            }
          } else { // more then 1min
            if (sd.length != 0) {
              const result = {
                facebook: sd
              }
              resolve(result);
            } else {
              const result = {
                facebook: hd
              }
              resolve(result);
            }
          }
        }
      }).catch(e => {
          reject({ status: false, message: 'error fetch data', e: e.message })
      });
  } else if (url.startsWith("https://www.facebook.com/")) {
    fetch(url)
    .then(response => response) // x.url
    .then(x => axios.get(x.url, { headers })
    .then(({ data }) => {
      const sdMatch = data.match(/"playable_url":"(.*?)"/);
      const hdMatch = data.match(/"playable_url_quality_hd":"(.*?)"/);
      const vidtime = data.match(/"playable_duration_in_ms":(.*?),/);
      const sd = parseString(sdMatch[1]);
      const hd = hdMatch && hdMatch[1] ? parseString(hdMatch[1]) : "";
      if (vidtime[1] >= 300000) {
        var e = 819
        reject(e)
      } else {
        if (vidtime[1] <= 60000) { // 1min
          if (hd.length != 0) {
            const result = {
              facebook: hd
            }
            resolve(result);
          } else {
            const result = {
              facebook: sd
            }
            resolve(result);
          }
        } else { // more then 1min
          if (sd.length != 0) {
            const result = {
              facebook: sd
            }
            resolve(result);
          } else {
            const result = {
              facebook: hd
            }
            resolve(result);
          }
        }
      }
    })).catch(e => {
          reject({ status: false, message: 'error fetch data', e: e.message })
      });
  } else if (url.startsWith("https://fb.watch/")) {
      fetch(url)
      .then(response => response) // x.url
      .then(x => axios.get(x.url, { headers })
      .then(({ data }) => {
        const sdMatch = data.match(/"playable_url":"(.*?)"/);
        const hdMatch = data.match(/"playable_url_quality_hd":"(.*?)"/);
        const vidtime = data.match(/"playable_duration_in_ms":(.*?),/);
        const sd = parseString(sdMatch[1]);
        const hd = hdMatch && hdMatch[1] ? parseString(hdMatch[1]) : "";
        if (vidtime[1] >= 300000) {
          var e = 819
          reject(e)
        } else {
          if (vidtime[1] <= 60000) { // 1min
            if (hd.length != 0) {
              const result = {
                facebook: hd
              }
              resolve(result);
            } else {
              const result = {
                facebook: sd
              }
              resolve(result);
            }
          } else { // more then 1min
            if (sd.length != 0) {
              const result = {
                facebook: sd
              }
              resolve(result);
            } else {
              const result = {
                facebook: hd
              }
              resolve(result);
            }
          }
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
    urler(url, function (url) {
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