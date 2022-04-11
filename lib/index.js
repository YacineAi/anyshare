const fetch = require('node-fetch');
const request = require('request-promise');
const cheerio = require('cheerio');
const axios = require('axios');

/* --------------- CORE --------------- */
// return new Promise((resolve, reject) => {})

function get(url) {
  if (url.startsWith("https://vm.tiktok.com/")) {
    return new Promise((resolve, reject) => {
    fetch(url)
    .then(response => response)
    .then(data => { // data.url
        var remv = data.url.split('?')[0]
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
                .catch(function(err) {
                  console.log("request failed : "+err);
                });
            })
          .catch(e => {
            reject({ status: false, message: 'error fetch data', e: e.message })
        });
    });
  })
  } else if (url.startsWith("https://www.tiktok.com/")) {
    return new Promise((resolve, reject) => {
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
            })
          .catch(e => {
            reject({ status: false, message: 'error fetch data', e: e.message })
        });
    })
  } else if (url.startsWith("https://www.facebook.com/reel/")) {
    return new Promise((resolve, reject) => {
      axios.get('https://fdownloader.net/en/facebook-reels-downloader')
      .then((resp) => {
        const $ = cheerio.load(resp.data);
        const cookie = resp.headers['set-cookie'].join('');
        const token = $('input[name="__RequestVerificationToken"]').attr('value');
        fetch("https://fdownloader.net/api/ajaxSearch", {
          "headers": {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "cookie": cookie,
            "Referer": "https://fdownloader.net/en/facebook-reels-downloader"
          },
          "body": `__RequestVerificationToken=${token}&q=${url}`,
          "method": "POST"
        })
        .then(response => response.json())
        .then(data => {
          var $1 = cheerio.load(data.data);
          var link = $1('.button.is-success.is-small.download-link-fb').attr('href');
          const result = {
                  facebook: link
          }
          resolve(result);
        }).catch(e => {
          reject({ status: false, message: 'error fetch data', e: e.message })
      });
      })
    })
  } else if (url.startsWith("https://www.instagram.com/p/")) {
    return new Promise((resolve, reject) => {
      fetch(`https://instadownloader.co/insta_downloader.php?url=${url}`, {
        "headers": {
          "content-type": "application/json",
          "Referer": "https://instadownloader.co/"

        },
        "body": null,
        "method": "GET"
      })
      .then(response => response.json())
      .then(data => {
      const parsed = JSON.parse(data)
        if (parsed.images_links[0]) {
        let image = parsed.images_links[0].url.replace('&dl=1', '')
        const result = {
          instimage: image
        }
        resolve(result);
        } else {
        const result = {
          instavid: parsed.videos_links[0].url
        }
        resolve(result);
        }
      }).catch(e => {
        reject({ status: false, message: 'error fetch data', e: e.message })
    });
    })
  } else if (url.startsWith("https://www.instagram.com/reel/")) {
    return new Promise((resolve, reject) => {
      fetch("https://igdownloader.com/ajax", {
        "headers": {
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "x-requested-with": "XMLHttpRequest",
          "Referer": "https://igdownloader.com/reels-downloader"
        },
        "body": `link=${url}&downloader=reels`,
        "method": "POST"
      })
      .then(response => response.json())
      .then(data => {
        var $1 = cheerio.load(data.html);
        var link = $1('.download-button').attr('href');
        const result = {
          instavid: link
        }
        resolve(result);
      }).catch(e => {
        reject({ status: false, message: 'error fetch data', e: e.message })
    });
    })
  } else if (url.startsWith("@")) {
    return new Promise((resolve, reject) => {
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
      })
  } else if (url.startsWith("https://youtube.com/shorts/") || url.startsWith("https://www.youtube.com/shorts/")) {
    return new Promise((resolve, reject) => {
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
        const result = {
          shorts: [{
            cover: data.thumb,
            name: data.meta.title,
            duration: data.meta.duration,
            short: data.diffConverter,
            audio: data.mp3Converter
          }]
        }
        resolve(result);
      }).catch(e => {
        reject({ status: false, message: 'error fetch data', e: e.message })
    });
    })
    
  }
}
  module.exports.get = get