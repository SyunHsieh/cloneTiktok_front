

<template>
  <div>
    <inViewportItem />
  </div>
</template>

<script>
import isElementInViewport, {
  scrollInfo_InnerFunc,
} from "../../reference/scrollFunctions";
import inViewportItem from "../../components/itemInViewportList/inViewportItem";
export default {
  //   let triggerRulesSample =[{
  //   index:0,
  //   direction:'forward','reverse','any',
  //   axis:'x','y','any',
  //  type:'flash' 'continue','any',
  //  inViewportType:'whole','block',
  // }]
  name: "itemInViewportList",
  components: { inViewportItem },
  props: ["triggerRules", "that"],
  data() {
    return {
      triggerFunction: undefined,
    };
  },
  methods: {
    checkItemInViewpart(itemIndex, displayType = "block") {
      let _eles = [];
      for (let i in this.$children) {
        if (this.$children[i].$options.name == "inViewportItem")
          _eles.splice(_eles.length, 0, this.$children[i]);
      }
      if (itemIndex < 0 || _eles.length <= itemIndex) return;

      return isElementInViewport(_eles[itemIndex].$el, displayType);
    },
    _registerScrollEvents() {
      let _body = document.querySelector("body");
      let _scrollInfo_InnerF = scrollInfo_InnerFunc(_body);

      let _preElesType = [];
      return () => {
        let _rules = this.triggerRules;
        if (!_rules || !this.$children) return;

        let _eles = [];

        for (let i in this.$children) {
          if (this.$children[i].$options.name == "inViewportItem")
            _eles.splice(_eles.length, 0, this.$children[i]);
        }

        if (_eles.length <= 0 || !this._checkRules(_rules, _eles.length))
          return;

        if (_preElesType.length != _rules.length)
          for (let i in _rules)
            _preElesType.splice(
              i,
              0,
              isElementInViewport(
                _eles[_rules[i].index].$el,
                _rules[i].inViewportType
              )
            );

        let _ret = [];

        let _scrollInfo = _scrollInfo_InnerF();

        if (_scrollInfo.axis == "none") return;

        for (let ruleIndex in _rules) {
          let rule = _rules[ruleIndex];

          let _curIsElInViewport = isElementInViewport(
            _eles[rule.index].$el,
            rule.inViewportType
          );

          if (!_curIsElInViewport) {
            _preElesType[ruleIndex] = false;
            continue;
          }

          if (
            ((rule.direction != _scrollInfo.direction &&
              rule.direction != "any") ||
              (rule.axis != _scrollInfo.axis && rule.axis != "any") ||
              (rule.type == "flash" && _preElesType[ruleIndex]) ||
              (rule.type == "continue" && !_preElesType[ruleIndex])) == false
          )
            _ret.splice(_ret.splice, 0, {
              index: rule.index,
              direction: _scrollInfo.direction,
              axis: _scrollInfo.axis,
              type: _preElesType[ruleIndex] ? "continue" : "flash",
              inViewportType: rule.inViewportType,
            });

          _preElesType[ruleIndex] = true;
        }

        if (_ret.length > 0) this.$emit("scrollInViewport", _ret);
      };
    },
    _checkRules(_rules, elLength) {
      for (let ruleIndex in _rules) {
        let rule = _rules[ruleIndex];
        if (rule.index < 0 || rule.index >= elLength) return false;

        if (
          rule.direction != "forward" &&
          rule.direction != "reverse" &&
          rule.direction != "any"
        )
          return false;

        if (rule.axis != "x" && rule.axis != "y" && rule.axis != "any")
          return false;

        if (
          rule.type != "flash" &&
          rule.type != "continue" &&
          rule.type != "any"
        )
          return false;

        if (rule.inViewportType != "whole" && rule.inViewportType != "block")
          return false;
      }
      return true;
    },
  },
  mounted() {
    this.triggerFunction = this._registerScrollEvents();
    window.addEventListener("scroll", this.triggerFunction);
  },
  destroyed() {
    let _body = document.querySelector("body");
    _body.removeEventListener("scroll", this.triggerFunction);
  },
};
</script>

<style>
</style> 