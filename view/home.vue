<template>
  <div class="homediv">
    <!-- <div class="rightDiv">
      <div class="rightContent"></div>
    </div> -->
    <commentsPage
      v-if="homePageData.length > 0"
      :currentCommentId="homePageData[currentPostIndex].postInfo.id"
      ref="commentsDiv"
      v-on:deactivePage="commentPageDeactive"
      v-on:commentCountUpdate="updateCommentCountEvent"
    />
    <div class="topbar">
      <button class="searchBtn">
        <svg
          class="toolIcon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g data-name="Layer 2">
            <g data-name="search">
              <rect width="24" height="24" opacity="0" />
              <path
                d="M20.71 19.29l-3.4-3.39A7.92 7.92 0 0 0 19 11a8 8 0 1 0-8 8 7.92 7.92 0 0 0 4.9-1.69l3.39 3.4a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42zM5 11a6 6 0 1 1 6 6 6 6 0 0 1-6-6z"
              />
            </g>
          </g>
        </svg>
      </button>
    </div>
    <itemInViewportList
      :detectScrollElement="scrollDetectEle"
      ref="IVList"
      :that="this"
      :triggerRules="rules"
      v-on:scrollInViewport="itemInViewportFunc"
      inline-template
    >
      <div>
        <inViewportItem
          :that="that"
          v-for="(postData, index) in that.homePageData"
          :key="postData.postInfo.id + '' + index"
          inline-template
        >
          <div class="item">
            <div class="socialToolsDiv">
              <button
                class="toolsbtn"
                :class="postData.readersInfo.liked ? 'liked' : ''"
                @click="
                  that._setLikePost(
                    postData.postInfo.id,
                    !postData.readersInfo.liked
                  )
                "
              >
                <svg
                  class="toolIcon"
                  viewBox="0 0 47.5 47.5"
                  style="enable-background: new 0 0 47.5 47.5"
                >
                  <defs id="defs6">
                    <clipPath id="clipPath16" clipPathUnits="userSpaceOnUse">
                      <path id="path18" d="M 0,38 38,38 38,0 0,0 0,38 Z" />
                    </clipPath>
                  </defs>
                  <g transform="matrix(1.25,0,0,-1.25,0,47.5)" id="g10">
                    <g id="g12">
                      <g clip-path="url(#clipPath16)" id="g14">
                        <g transform="translate(36.8848,25.1665)" id="g20">
                          <path
                            id="path22"
                            style="
                              fill-opacity: 1;
                              fill-rule: nonzero;
                              stroke: none;
                            "
                            d="m 0,0 c 0,5.45 -4.418,9.868 -9.867,9.868 -3.308,0 -6.227,-1.633 -8.018,-4.129 -1.79,2.496 -4.71,4.129 -8.017,4.129 -5.45,0 -9.868,-4.418 -9.868,-9.868 0,-0.772 0.098,-1.52 0.266,-2.241 1.371,-8.512 10.835,-17.494 17.619,-19.96 6.783,2.466 16.249,11.448 17.617,19.96 C -0.098,-1.52 0,-0.772 0,0"
                          />
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>

                <span>{{ postData.postInfo.likesCount }}</span>
              </button>
              <button @click="that.commentsClick" class="toolsbtn">
                <svg
                  class="toolIcon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M8,11a1,1,0,1,0,1,1A1,1,0,0,0,8,11Zm4,0a1,1,0,1,0,1,1A1,1,0,0,0,12,11Zm4,0a1,1,0,1,0,1,1A1,1,0,0,0,16,11ZM12,2A10,10,0,0,0,2,12a9.89,9.89,0,0,0,2.26,6.33l-2,2a1,1,0,0,0-.21,1.09A1,1,0,0,0,3,22h9A10,10,0,0,0,12,2Zm0,18H5.41l.93-.93a1,1,0,0,0,.3-.71,1,1,0,0,0-.3-.7A8,8,0,1,1,12,20Z"
                  />
                </svg>

                <span>{{ postData.postInfo.commentsCount }}</span>
              </button>
            </div>
            <div v-if="postData" class="postDiv">
              <h3>{{ "@" + postData.userInfo.name }}</h3>
              <span>{{ postData.postInfo.text }}</span>
            </div>
            <video
              @click="that.videoClick"
              :id="['video' + index]"
              v-if="
                index == that.currentPostIndex ||
                index == that.currentPostIndex - 1 ||
                index == that.currentPostIndex + 1
              "
              class="video"
              contorls
              :autoplay="index == that.currentPostIndex"
              :muted="index != that.currentPostIndex"
              loop
              playsinline
            >
              <source :src="postData.postInfo.videourl" type="video/mp4" />
            </video>
          </div>
        </inViewportItem>
      </div>
    </itemInViewportList>
    <div class="bottombar">
      <button @click="$router.push('/createPost')">+</button>
    </div>
  </div>
</template>

<script>
import itemInViewportList from "../src/components/itemInViewportList";
import inViewportItem from "../src/components/itemInViewportList/inViewportItem";
import commentsPage from "../src/components/commentsPage";
import Vue from "vue";
import sywekAxios from "../src/reference/axiosMsgReaction";
export default {
  name: "tiktokHome",
  components: { itemInViewportList, inViewportItem, commentsPage },
  data() {
    return {
      //homepage data
      //1. typeof json
      //2. fetch from axios
      fetchCount: 3,
      fetchOffset: 0,
      isFetchedEndposts: false,
      rules: undefined,
      triggeredItemIndex: undefined,
      currentPostIndex: 0,
      homePageData: [],
      scrollDetectEle: document.querySelector("body"),
      isFetching: false,
    };
  },
  watch: {
    currentPostIndex: function () {
      //paly current video and reset another 2 videos(prev and next);
      let _resetVideo = (video) => {
        if (video == undefined) return;

        video.pause();
        video.currentTime = 0;
      };
      let _curVideo = document.getElementById(`video${this.currentPostIndex}`);
      let _prevVideo = document.getElementById(
        `video${this.currentPostIndex - 1}`
      );
      let _nextVideo = document.getElementById(
        `video${this.currentPostIndex + 1}`
      );
      _resetVideo(_prevVideo);
      _resetVideo(_nextVideo);

      _curVideo.currentTime = 0;
      _curVideo.play();
    },
  },
  methods: {
    videoClick(e) {
      const _video = e.target;
      const _played = _video.paused;
      _played ? _video.play() : _video.pause();
    },
    updateCommentCountEvent(postid, commentscount) {
      this.homePageData.map((v) => {
        if (v.postInfo.id == postid) {
          v.postInfo.commentsCount = commentscount;
        }
      });
    },
    commentPageDeactive() {
      let _body = document.querySelector("body");
      _body.classList.remove("disableScroll");
    },
    commentsClick() {
      this.$refs.commentsDiv.activePage();
      let _body = document.querySelector("body");
      _body.classList.add("disableScroll");
    },
    async _setLikePost(postid, like) {
      let _apiPath = `/post/${postid}/like`;
      let _data = like
        ? await sywekAxios.post(
            process.env.VUE_APP_API_URL + _apiPath,
            {},
            {},
            true
          )
        : await sywekAxios.delete(
            process.env.VUE_APP_API_URL + _apiPath,
            {},
            {},
            true
          );

      if (_data.data) {
        for (let i in this.homePageData) {
          let item = this.homePageData[i];
          if (item.postInfo.id == _data.data.postid) {
            item.readersInfo.liked = _data.data.likeStatus;
            item.postInfo.likesCount = _data.data.likescount;
          }
        }
      }
    },
    _getViewportItemTop(index) {
      for (let i in this.$refs.IVList.$children) {
        if (i == index) {
          const _item = this.$refs.IVList.$children[i].$el;
          return _item.offsetTop;
        }
      }
      return undefined;
    },
    _autoSetRules() {
      //inViewport Rules
      //currentindex 前後各一個inViewportItem
      let _rules = [];
      //set preverse item

      if (this.currentPostIndex != 0)
        _rules.splice(0, 0, {
          index: this.currentPostIndex - 1,
          direction: "any",
          axis: "y",
          type: "continue",
          inViewportType: "block",
        });

      // set next item rule
      if (this.currentPostIndex < this.homePageData.length - 1)
        _rules.splice(0, 0, {
          index: this.currentPostIndex + 1,
          direction: "any",
          axis: "y",
          type: "continue",
          inViewportType: "block",
        });
      Vue.set(this, "rules", _rules);
    },
    itemInViewportFunc(e) {
      Vue.set(this, "triggeredItemIndex", e[0].index);
    },
    async afterTouchEndFunc() {
      if (this.currentPostIndex == this.homePageData.length - 2)
        this.getPostData();
    },
    async getPostData() {
      //fetch data lock
      if (this.isFetching) return;
      this.isFetching = true;
      let _data = await sywekAxios.get(
        process.env.VUE_APP_API_URL + "/posts",
        {
          params: {
            count: this.fetchCount,
            offset: this.fetchOffset,
          },
        },
        true
      );

      //當return length < fetch count 代表到最後一筆資料
      let _length = _data.data.length;
      if (_length < this.fetchOffset) {
        this.isFetchedEndposts = true;
      }

      this.fetchOffset += _length;

      //當最後一筆 下一次從0開始取資料
      if (this.isFetchedEndposts) {
        this.fetchOffset = 0;
      }

      _data.data.map((v) => {
        this.homePageData.splice(this.homePageData.length, 0, v);
      });
      this._autoSetRules();
      //unlock
      this.isFetching = false;
      return _data;
    },
  },
  async mounted() {
    //init
    //1. Fetch data from backend
    //2. assign data to this.homePageData
    //3. set inviewport rules
    //4. register event 'touchstart/touchend',and scroll event if support desktop mode
    //5.   touchStart should reset this.triggeredItemIndex
    //6.    touchEnd should move scroll to next/preverse item,and reset rules
    //7. after touchend run this.afterTouchend Function.(Fetch new data here)

    let _intervelId = undefined;
    let _targetYPos = 0;
    const _scrollPosMatchTimes = 20;
    let _scrollMatchCoount = 0;

    let _clearAutoScroll = () => {
      clearInterval(_intervelId);
      _intervelId = undefined;
    };
    //用來自動scroll 到目標
    let _autoScroll = () => {
      if (_intervelId != undefined) return;
      _intervelId = setInterval(() => {
        this.scrollDetectEle.scrollTo(0, _targetYPos);
        //check position
        if (Math.abs(this.scrollDetectEle.scrollTop - _targetYPos) < 3) {
          if (_scrollMatchCoount == _scrollPosMatchTimes) {
            _clearAutoScroll();
            _scrollMatchCoount = 0;
          } else _scrollMatchCoount += 1;
        }
      }, 10);
    };

    await this.getPostData();
    //reset triggeredItemIndex when touch start
    window.addEventListener("touchstart", () => {
      this.triggeredItemIndex = undefined;
    });

    window.addEventListener("touchend", () => {
      if (this.triggeredItemIndex == undefined) return;
      //抓取 inViewportList scrollTop
      const _itemTop = this._getViewportItemTop(this.triggeredItemIndex);
      //放到 autoScroll param
      _targetYPos = _itemTop;
      //設定自動scroll
      _autoScroll();

      //設定currentIndex
      this.currentPostIndex = this.triggeredItemIndex;

      //自動設定 itemInViewportList rules
      this._autoSetRules();
      this.afterTouchEndFunc();
    });
  },
};
</script>

<style>
.rightDiv {
  background-color: magenta;
  /* height: 100vh; */
  width: 100%;
  top: 0;
  left: 100%;
  bottom: 0;
  /* overflow-x: scroll; */
  position: fixed;
  z-index: 100;
  transition: all 600ms;
}
.rightDiv > .rightContent {
  margin-left: 100%;
  height: 100vh;
  width: 100%;
  background-color: darkblue;
}
.video {
  width: 100%;
  max-height: 100vh;
}
.item {
  position: relative;
  width: 100%;
  height: 100vh;
  margin: 0;
}
.postDiv {
  position: absolute;
  left: 1rem;
  bottom: 7rem;
  text-align: left;
  color: white;
  max-width: 50%;
}

.socialToolsDiv {
  position: absolute;
  right: 0.3rem;
  bottom: 13rem;
  z-index: 10;
}
.toolsbtn {
  display: flex;
  flex-direction: column;
  outline: none;
  align-items: center;
  border: none;
  color: white;
  font-size: 0.8rem;
  background: transparent;
  margin-top: 0.5rem;
}
.toolIcon {
  width: 2.5rem;
  height: 2.5rem;
  fill: white;
}
.toolIcon path {
  fill: white;
}
.topbar {
  position: fixed;
  top: 0;
  right: 1rem;
  z-index: 100;
}

.searchBtn {
  width: 3rem;
  height: 3rem;
  outline: none;
  align-items: center;
  border: none;
  color: white;
  font-size: 0.8rem;
  background: transparent;
  margin-top: 0.5rem;
}
.bottombar {
  position: fixed;
  /* background-color: #111; */
  height: 4rem;
  bottom: 0;
  left: 0;
  right: 0;
}
.bottombar > button {
  background-color: #666;
  color: white;
  text-align: center;

  height: 2rem;
  width: 2rem;
  font-size: 1.3rem;
  margin-top: 0.5rem;
  border-radius: 0.4rem;
}
.liked path {
  fill: red;
}
.disableScroll {
  overflow: hidden;
}
</style>
