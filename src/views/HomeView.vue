<template>
  <div class="main">
    <h3>
      <p>简介：Midjourney Imagine API</p>
      <p>
        Midjourney
        是一个强大的图像生成服务，可以通过自然语言描述生成对应的精美图像。本 API
        对接了 Midjourney 官方，提供了 Midjourney
        的调用能力，并支持图像的预览生成和连续修改操作。
      </p>
    </h3>
    <h3>
      1. 要使用 Midjourney Imagine API，首先可以到
      <a
        href="https://auth.zhishuyun.com/auth/login?inviter_id=2ab51d06-743f-4a52-917f-af8b4a761400&redirect=https://data.zhishuyun.com"
        >Midjourney Imagine API</a
      >
      页面点击「获取」按钮：
    </h3>
    <a-input v-model="token" placeholder="请输入申请的token" />
    <h3>2. 生成MJ图片</h3>
    <a-textarea
      v-if="!result"
      v-model="formData.prompt"
      placeholder="图像描述。在第一次生成预览图时，需要指定该字段，代表待生成图像的描述。建议用英文"
      :rows="4"
    />
    <a-radio-group
      v-model="formData.action"
      style="display: flex; flex-direction: column"
    >
      <a-radio
        :value="item.value"
        v-for="item in actionList"
        :key="item.value"
        >{{ item.label }}</a-radio
      >
    </a-radio-group>
    <div class="img-box" v-if="result?.image_url">
      <img :src="result.image_url" alt="" />
    </div>
    <div class="action-box">
      <a-button class="my-button" type="primary" @click="submitThrottle">创作</a-button>
      <a-button class="my-button" type="primary" @click="resetAll">重置</a-button>
    </div>
  </div>
</template>

<script>
function mk_formData() {
  return {
    action: "generate",
    prompt: null,
    image_id: null,
  };
}
function mk_actionList() {
  return [
    {
      label: "创作一个预览图",
      value: "generate",
    },
  ];
}
import { message } from "ant-design-vue";
import { throttle, downloadPic, removeNull } from "../libs/util.js";
export default {
  data() {
    return {
      token: null,
      formData: mk_formData(),
      formRules: [
        {
          key: "prompt",
          message: "请写下你的创意",
        },
      ],
      // 基本案列数据
      actionList: mk_actionList(),
      workId: null,
      result: null,
    };
  },
  mounted() {},
  methods: {
    submitThrottle() {
      throttle(this.submit, 2000)();
    },
    async submit() {
      if (!this.token) {
        message.error("请先输入token");
        return;
      }
      message.loading(
        "正在创作，精美图片，需要时间打磨，预计1-2分钟出炉,请勿连续操作...",
        0
      );
      console.log("参数是");
      console.log(this.formData);

      let body = removeNull(this.formData);
      try {
        const re = await this.$fetch.post(
          `midjourney/imagine?token=${this.token}`,
          body,
          {}
        );

        this.result = re;
        this.disposeData();
        message.destroy();
      } catch (e) {
        console.log(e);
      }
    },
    /**
     * 处理返回的数据
     */
    disposeData() {
      this.getActionList();
      this.formData.action = this.actionList[0].value;
      this.formData.prompt = null;
      this.formData.image_id = this.result.image_id;
    },
    getActionList() {
      this.actionList = this.result.actions.map((v) => {
        return {
          label: this.getActionsDes(v),
          value: v,
        };
      });
    },
    getActionsDes(action) {
      let key = action.slice(0, -1);
      let index = action.slice(-1);

      const obj = {
        upsample: "放大使用",
        variation: "变换生成四张类似的图片",
        upsample_light: "柔化处理",
        upsample_beta: "测试版本的放大处理",
      };

      return `对第${index}张图片  ` + (obj[key] ?? key);
    },
    resetAll() {
      this.formData = mk_formData();
      this.actionList = mk_actionList();
      this.result = null
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  padding: 2vh 2vw;
  .img-box {
    img {
      margin: 2vh 0;
      width: 50vw;
    }
  }
  .action-box {
    margin: 20px 0;
    .my-button{
      margin: 0 20px 0 0;
    }
  }
 
}
h3 {
  margin: 10px 0 10px 0;
}
</style>
