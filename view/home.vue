<template>
  <div class="homediv">
    <itemInViewportList
      ref="IVList"
      :that="this"
      :triggerRules="rules"
      v-on:scrollInViewport="itemInViewportFunc"
      inline-template
    >
      <div>
        <inViewportItem
          :that="that"
          v-for="postData in that.homePageData"
          :key="postData.postInfo.id"
          inline-template
        >
          <div class="item">
            <div class="socialToolsDiv">
              <button class="toolsbtn">
                <svg
                  class="toolIcon"
                  xmlns="http://www.w3.org/2000/svg"
                  data-name="Layer 1"
                  viewBox="0 0 98 98"
                >
                  <g data-name="&lt;Group&gt;">
                    <path
                      d="M66.1,16.3A22.2,22.2,0,0,0,49,24.2a21.9,21.9,0,0,0-17.1-7.9A22.4,22.4,0,0,0,9.5,38.7c0,21.2,37,41.9,38.5,42.7a1.8,1.8,0,0,0,2,0c1.5-.8,38.5-21.2,38.5-42.7A22.4,22.4,0,0,0,66.1,16.3ZM49,77.4C43.2,74,13.5,55.9,13.5,38.7A18.4,18.4,0,0,1,31.9,20.3a18,18,0,0,1,15.4,8.3,2.1,2.1,0,0,0,3.4,0A18.4,18.4,0,0,1,84.5,38.7C84.5,56.1,54.8,74.1,49,77.4Z"
                      data-name="&lt;Compound Path&gt;"
                    />
                  </g></svg
                ><span>{{ postData.postInfo.likesCount }}</span>
              </button>
              <button class="toolsbtn">
                <svg
                  class="toolIcon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M8,11a1,1,0,1,0,1,1A1,1,0,0,0,8,11Zm4,0a1,1,0,1,0,1,1A1,1,0,0,0,12,11Zm4,0a1,1,0,1,0,1,1A1,1,0,0,0,16,11ZM12,2A10,10,0,0,0,2,12a9.89,9.89,0,0,0,2.26,6.33l-2,2a1,1,0,0,0-.21,1.09A1,1,0,0,0,3,22h9A10,10,0,0,0,12,2Zm0,18H5.41l.93-.93a1,1,0,0,0,.3-.71,1,1,0,0,0-.3-.7A8,8,0,1,1,12,20Z"
                  />
                </svg>

                <span>{{ postData.postInfo.commentCount }}</span>
              </button>
            </div>
            <div class="postDiv">
              <h3>{{ "@" + postData.ownerInfo.name }}</h3>
              <span>{{ postData.postInfo.postText }}</span>
            </div>
            <video class="video" contorls autoplay muted loop>
              <source :src="postData.postInfo.videoPath" type="video/mp4" />
            </video>
          </div>
        </inViewportItem>
      </div>
    </itemInViewportList>
  </div>
</template>

<script>
import itemInViewportList from "../src/components/itemInViewportList";
import inViewportItem from "../src/components/itemInViewportList/inViewportItem";
import Vue from "vue";
export default {
  name: "tiktokHome",
  components: { itemInViewportList, inViewportItem },
  data() {
    return {
      //homepage data
      //1. typeof json
      //2. fetch from axios
      rules: undefined,
      triggeredItemIndex: undefined,
      currentPostIndex: 0,
      homePageData: [
        {
          ownerInfo: {
            id: 0,
            name: "aaa",
            image: undefined,
          },
          postInfo: {
            id: 0,
            videoPath: "/testvideo/1.mp4",
            postText: "Clone video 0",
            likesCount: 0,
            commentCount: 0,
          },
          readerInfo: {
            isLike: false,
            isFolowing: false,
          },
        },
        {
          ownerInfo: {
            id: 1,
            name: "bbb",
            image: undefined,
          },
          postInfo: {
            id: 1,
            videoPath: "/testvideo/2.mp4",
            postText: "Clone video 1",
            likesCount: 1,
            commentCount: 11,
          },
          readerInfo: {
            isLike: false,
            isFolowing: false,
          },
        },
        {
          ownerInfo: {
            id: 2,
            name: "ccc",
            image: undefined,
          },
          postInfo: {
            id: 2,
            videoPath: "/testvideo/3.mp4",
            postText: "Clone video 2",
            likesCount: 2,
            commentCount: 22,
          },
          readerInfo: {
            isLike: false,
            isFolowing: false,
          },
        },
      ],
    };
  },
  methods: {
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
      const _lastItemToFetchNewData = this.homePageData.length - 2;
      const _fetchCount = 5;

      //test...
      if (this.currentPostIndex == _lastItemToFetchNewData)
        for (let i = 0; i < _fetchCount; i++) {
          const _testData = {
            ownerInfo: {
              id: this.homePageData.length,
              name: "123aaa",
              image: undefined,
            },
            postInfo: {
              id: this.homePageData.length,
              videoPath: "/testvideo/1.mp4",
              postText: `Clone video ${this.homePageData.length}`,
              likesCount: this.homePageData.length,
              commentCount: 33,
            },
            readerInfo: {
              isLike: false,
              isFolowing: false,
            },
          };
          console.log(_testData);
          this.homePageData.splice(this.homePageData.length, 0, _testData);
        }
    },
  },
  mounted() {
    //init
    //1. Fetch data from backend
    //2. assign data to this.homePageData
    //3. set inviewport rules
    //4. register event 'touchstart/touchend',and scroll event if support desktop mode
    //5.   touchStart should reset this.triggeredItemIndex
    //6.    touchEnd should move scroll to next/preverse item,and reset rules
    //7. after touchend run this.afterTouchend Function.(Fetch new data here)
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
      this.triggeredItemIndex = undefined;
      this._autoSetRules();

      this.afterTouchEndFunc();
    });
  },
};
</script>

<style>
.video {
  width: 100%;
  max-height: 100vh;
}
.item {
  position: relative;
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
</style>