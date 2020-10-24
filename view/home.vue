<template>
  <div class="homediv">
    <!-- <div class="rightDiv">
      <div class="rightContent"></div>
    </div> -->
    <div class="topbar">
      <button class="searchBtn">
        <svg class="toolIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
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
    <itemInViewportList ref="IVList" :that="this" :triggerRules="rules" v-on:scrollInViewport="itemInViewportFunc" inline-template>
      <div>
        <inViewportItem :that="that" v-for="(postData, index) in that.homePageData" :key="postData.postInfo.id + '' + index" inline-template>
          <div class="item">
            <div class="socialToolsDiv">
              <button
                class="toolsbtn"
                :class="postData.readersInfo.liked ? 'liked' : ''"
                @click="that._setLikePost(postData.postInfo.id, !postData.readersInfo.liked)"
              >
                <svg class="toolIcon" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 98 98">
                  <g data-name="&lt;Group&gt;">
                    <path
                      d="M66.1,16.3A22.2,22.2,0,0,0,49,24.2a21.9,21.9,0,0,0-17.1-7.9A22.4,22.4,0,0,0,9.5,38.7c0,21.2,37,41.9,38.5,42.7a1.8,1.8,0,0,0,2,0c1.5-.8,38.5-21.2,38.5-42.7A22.4,22.4,0,0,0,66.1,16.3ZM49,77.4C43.2,74,13.5,55.9,13.5,38.7A18.4,18.4,0,0,1,31.9,20.3a18,18,0,0,1,15.4,8.3,2.1,2.1,0,0,0,3.4,0A18.4,18.4,0,0,1,84.5,38.7C84.5,56.1,54.8,74.1,49,77.4Z"
                      data-name="&lt;Compound Path&gt;"
                    />
                  </g></svg
                ><span>{{ postData.postInfo.likesCount }}</span>
              </button>
              <button class="toolsbtn">
                <svg class="toolIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
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
              v-if="index == that.currentPostIndex"
              class="video"
              contorls
              :autoplay="index == that.currentPostIndex"
              :muted="index != that.currentPostIndex"
              loop
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
import Vue from "vue";
import sywekAxios from "../src/reference/axiosMsgReaction";
export default {
  name: "tiktokHome",
  components: { itemInViewportList, inViewportItem },
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
    };
  },
  methods: {
    async _setLikePost(postid, like) {
      console.log(postid, like);
      let _data = like
        ? await sywekAxios.post(process.env.VUE_APP_API_URL + `/like/${postid}`, {}, {}, true)
        : await sywekAxios.delete(process.env.VUE_APP_API_URL + `/like/${postid}`, {}, {}, true);

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
      if (this.currentPostIndex == this.homePageData.length - 2) this.getPostData();
    },
    async getPostData() {
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

      let _length = _data.data.length;
      if (_length < this.fetchOffset) {
        this.isFetchedEndposts = true;
      }
      this.fetchOffset += _length;

      if (this.isFetchedEndposts) {
        this.fetchOffset = 0;
      }

      _data.data.map((v) => {
        this.homePageData.splice(this.homePageData.length, 0, v);
      });

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
    await this.getPostData();
    this._autoSetRules();
    //reset triggeredItemIndex when mouse down
    window.addEventListener("touchstart", () => {
      this.triggeredItemIndex = undefined;
    });

    //move scroll to detected item top
    window.addEventListener("touchend", () => {
      if (this.triggeredItemIndex == undefined) return;
      const _itemTop = this._getViewportItemTop(this.triggeredItemIndex);

      window.scrollTo(0, _itemTop);
      this.currentPostIndex = this.triggeredItemIndex;
      console.log("a", this.currentPostIndex);
      this.triggeredItemIndex = undefined;
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
}
.postDiv {
  position: absolute;
  left: 1rem;
  bottom: 3rem;
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
  height: 3rem;
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
.liked svg {
  fill: red;
}
</style>
