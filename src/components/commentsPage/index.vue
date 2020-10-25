<template>
  <div ref="commentsDiv" class="commentsDiv">
    <div class="comment-topdiv">
      <span>Comments</span><button @click="deactivePage">X</button>
    </div>

    <div class="contentDiv detectScrollDiv" ref="detectScroll">
      <itemInViewportList
        :detectScrollElement="getDetectElement"
        :that="this"
        :triggerRules="inViewportRules"
        v-on:scrollInViewport="fetchCommentDataAndSetRules"
        inline-template
        ><div>
          <inViewportItem
            :that="that"
            v-for="commentData in that.commentsData"
            :key="commentData.commentInfo.id"
            inline-template
          >
            <div class="commentContentDiv">
              <span class="commentName">{{ commentData.userInfo.name }}</span>
              <span class="commentText">{{ commentData.commentInfo.text }}</span
              ><span class="commentTime">{{
                commentData.commentInfo.datetime
              }}</span>
            </div>
          </inViewportItem>
          <div v-if="that.endOfComments" class="endOfComment">
            End of comments.
          </div>
        </div>
      </itemInViewportList>
    </div>
    <div class="commentEditDiv">
      <input v-model="text" placeholder="type something..." />
      <button @click="sendComment">send</button>
    </div>
  </div>
</template>

<script>
import itemInViewportList from "../itemInViewportList";
import inViewportItem from "../itemInViewportList/inViewportItem";
import sywekAxios from "../../reference/axiosMsgReaction";
import Vue from "vue";
export default {
  name: "commentsPage",
  components: { itemInViewportList, inViewportItem },
  props: ["currentCommentId"],
  data() {
    return {
      text: "",
      commentsData: [],
      count: 6,
      offset: 0,
      endOfComments: false,
      inViewportRules: [],
      getDetectElement: () => {
        return this.$refs.detectScroll;
      },
      isFetching: false,
      needUpdate: true,
    };
  },
  watch: {
    currentCommentId: function () {
      this.needUpdate = true;
    },
  },
  methods: {
    async initCommentsPage() {
      this.commentsData = [];
      this.offset = 0;
      this.endOfComments = false;
      this.inViewportRules = [];
      this.fetchCommentDataAndSetRules();
    },
    async fetchCommentDataAndSetRules() {
      if (this.isFetching) return;
      this.isFetching = true;
      let _ret = await sywekAxios.get(
        process.env.VUE_APP_API_URL + `/post/${this.currentCommentId}/comments`,
        {
          params: {
            count: this.count,
            offset: this.offset,
          },
        },
        true
      );

      if (_ret.data.comments.length < this.count) this.endOfComments = true;
      this.offset += _ret.data.comments.length;

      if (_ret.msg == "Successed") {
        _ret.data.comments.map((v) => {
          this.commentsData.splice(this.commentsData.length, 0, v);
        });
      }
      this.autoSetRules();
      this.isFetching = false;
    },
    autoSetRules() {
      let _rules = [];
      _rules.splice(0, 0, {
        index: this.commentsData.length - 1,
        direction: "any",
        axis: "y",
        type: "any",
        inViewportType: "block",
      });
      Vue.set(this, "inViewportRules", _rules);
      console.log(this.inViewportRules);
    },
    async sendComment() {
      let _ret = await sywekAxios.post(
        process.env.VUE_APP_API_URL + `/post/${this.currentCommentId}/comment`,
        { comment: this.text },
        {},
        true
      );

      if (_ret.msg == "Successed") {
        (this.text = ""), this.initCommentsPage();
        this.$emit(
          "commentCountUpdate",
          _ret.data.postid,
          _ret.data.commentscount
        );
      }
    },
    activePage() {
      this.$refs.commentsDiv.classList.add("commentsDivActive");
      if (this.needUpdate) {
        this.initCommentsPage();
        this.needUpdate = false;
      }
    },
    deactivePage() {
      this.$emit("deactivePage");

      this.$refs.commentsDiv.classList.remove("commentsDivActive");
    },
  },
};
</script>

<style >
.commentsDiv {
  background-color: rgb(38, 42, 43);
  /* background-color: #333; */
  border-radius: 1rem 1rem 0 0;
  position: fixed;
  width: 100%;
  height: 50vh;

  top: 100vh;
  left: 0;
  right: 0;

  transition: all 400ms;
  z-index: 1000;

  display: flex;
  flex-direction: column;
}
.commentsDivActive {
  top: 50vh;
}
.comment-topdiv {
  color: white;
  position: relative;
  height: 2rem;
  margin-top: 1rem;
}
.comment-topdiv > button {
  background: none;
  color: white;
  font-size: 1.2rem;
  border-radius: 2rem;
  /* border: none; */
  margin-right: 1rem;
  position: absolute;
  top: 0;
  right: 0;
}
.contentDiv {
  height: 100%;
}
.commentEditDiv > * {
  margin: 0;
  padding: 0;
  background: transparent;
  color: aliceblue;
}
.commentEditDiv {
  width: 100%;
  display: flex;
  flex-direction: row;
}
.commentEditDiv > input {
  width: 100%;
}
.commentEditDiv > button {
  width: 5rem;
  font-size: 1.2rem;
}
.detectScrollDiv {
  height: 100%;
  overflow-y: scroll;
}

.commentContentDiv {
  display: flex;
  flex-direction: column;
  min-height: 4rem;
  margin: 1rem;
  border: solid 1px rgba(139, 137, 136, 0.54);
  border-top: none;
  border-left: none;
  border-right: none;
}
.commentContentDiv > * {
  margin: 0.2rem 1rem;
}
.commentName {
  color: bisque;
  text-align: left;
}
.commentText {
  text-align: left;
  word-wrap: break-word;
  color: aliceblue;
}
.commentTime {
  text-align: right;
  font-size: 0.8rem;
  color: rgb(200, 195, 188);
}
.endOfComment {
  height: 3rem;
  color: rgba(180, 180, 180, 0.37);
}
</style>
