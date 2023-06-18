const fetch = require('node-fetch');
const cheerio = require('cheerio');
const urler = require('catch-redirect-url');
const axios = require("axios");

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
  } else if (url.startsWith("https://www.facebook.com/")) {
    try {
    const vid = url.match(/\/(?:videos|reel|watch|story\.php).*?(?:\/|\?v=|story_fbid=)(\d+)/)?.[1];
    const response = await fetch(`https://graph.facebook.com/v8.0/${vid}?fields=source&access_token=${token}`);
    const data = await response.json();
    if (data.source === undefined) {
      try {
        const response = await fetch('https://www.facebook.com/api/graphql/', {
          method: 'POST',
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            doc_id: '5279476072161634',
            variables: JSON.stringify({
              UFI2CommentsProvider_commentsKey: 'CometTahoeSidePaneQuery',
              caller: 'CHANNEL_VIEW_FROM_PAGE_TIMELINE',
              displayCommentsContextEnableComment: null,
              displayCommentsContextIsAdPreview: null,
              displayCommentsContextIsAggregatedShare: null,
              displayCommentsContextIsStorySet: null,
              displayCommentsFeedbackContext: null,
              feedbackSource: 41,
              feedLocation: 'TAHOE',
              focusCommentID: null,
              privacySelectorRenderLocation: 'COMET_STREAM',
              renderLocation: 'video_channel',
              scale: 1,
              streamChainingSection: false,
              useDefaultActor: false,
              videoChainingContext: null,
              videoID: vid,
            }),
            fb_dtsg: "",
            server_timestamps: true,
          }),
        });
        const data = await response.text();
        const parsedData = JSON.parse(data.split('\n')[0]);
        if(parsedData.data.video == null && url.indexOf('/permalink/') !== -1) {
          fetch("https://fdownload.app/api/ajaxSearch", {
            "headers": {
              "accept": "*/*",
              "accept-language": "en,ar-DZ;q=0.9,ar;q=0.8",
              "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
              "x-requested-with": "XMLHttpRequest",
              "Referer": "https://fdownload.app/en"
            },
            "body": `p=home&q=${encodeURIComponent(url)}`,
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
      });
        } else {
          const videoUrl =
          parsedData.data.video.playable_url_quality_hd ||
          parsedData.data.video.playable_url;
          const result = {
            facebook: videoUrl
          }
          resolve(result);
        }
      } catch (error) {
        reject({ status: false, message: 'error fetch data', e: error.message })
      }
    } else {
      const result = {
        facebook: data.source
      }
      resolve(result);
    }
    } catch (error) {
      reject({ status: false, message: 'error fetch data', e: error.message })
    }
  } else if (url.startsWith("https://l.facebook.com/") || url.startsWith("https://fb.watch/")) {
    if (url.startsWith("https://l.facebook.com/")) {
    const uValue = url.match(/u=([^&]+)/)[1];
    const decodedValue = decodeURIComponent(uValue);
    resolve(get(decodedValue, token));
    } else {
      axios.get(url, { maxRedirects: 1 })
      .then(response => {
        const regex = /<([^>]+)>/;
        const matches = regex.exec(response.headers.link);
        const url = matches[1];
        resolve(get(url, token));
      })
      .catch(error => {
        console.error('An error occurred:', error);
      });
    }
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