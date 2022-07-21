<template>
  <!-- 
    ref 是 vue 自带的获取 DOM 和组件的方法
    给 DOM 节点加上 ref 属性相当于起了名，在 $ref 属性中多了这个元素的引用，可以通过 vue 的实例 this.$ref.name 获取这个 DOM
    给组件加上 ref 属性相当于起了名，在 $ref 属性中多了这个组件的引用，可以通过 this.$ref.name.变量名(方法名) 获取这个组件的变量或方法
   -->
  <!-- 滚动组件以容器的形式导出，组件内部内容以 solt 插槽的新式展示，插槽是 Vue 提出的概念，用于决定将所携带的内容，插入到指定的某个位置-->
  <div ref="wrapper" class="scroll-wrapper">
    <slot></slot>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  export default {
    props: {
      /**
       * 节流：一个函数执行一次后，只有在大于设定的执行周期后才能执行第二次，类似技能冷却，常用于上拉加载、滚动条等，可以通过 setTimeout(执行的函数, 时间) 实现
       * 0 表示不派发 scroll 事件
       * 1 表示滚动时会派发 scroll 事件，会节流
       * 2 表示滚动实时派发 scroll 事件，不会节流
       * 3 任何时候都派发 scroll 事件，包括滚动和调用 scrollTo
       */
      probeType: {
        type: Number,
        defalut: 1
      },
      // 是否派发 click 事件
      click: {
        type: Boolean,
        default: true
      },
      // 是否开启横向滚动
      scrollX: {
        type: Boolean,
        default: false
      },
      // 是否派发滚动事件
      listenScroll: {
        type: Boolean,
        default: false
      },
      // 列表的数据
      scrollData: {
        type: Array,
        default: null
      },
      // 是否派发滚动到底部的事件，用于上拉加载
      pullup: {
        type: Boolean,
        default: false
      },
      // 是否派发顶部下拉的事件，用于下拉刷新
      pulldown: {
        type: Boolean,
        default: false
      },
      // 是否派发列表滚动开始的事件
      beforeScroll: {
        type: Boolean,
        default: false
      },
      // 数据更新后刷新 scroll 的延时
      refreshDelay: {
        type: Number,
        default: 20
      }
    },
    mounted() {
      /**
       * 使用 nextTick 异步调用，保证 DOM 渲染完毕后再初始化 better-scroll
       * 然而这里虽然使用了异步调用，但还是没法保证 better-scroll 的正确滚动
       * 这是因为父组件与子组件的生命周期执行顺序是*父 created - 父 beforeMounted - 子 created - 子 beforeMounted - 子 mounted - 父 mounted*
       * 因此在 better-scroll 完成初始化后，父组件中又会调用接口获取数据改变 content 的内容和高度，也改变了 DOM 结构，导致无法正确滚动
       * 因此需要利用 update 和 scroll.refresh 重新计算
       */ 
      this.$nextTick(() => {
        this.initScroll()
      })
    },
    // 由于数据更改导致 DOM 重新渲染时调用
    updated() {
      // better-scroll 的 refresh 方法，用于重新计算 bttter-scroll，在 DOM 结构发生变化的时候调用保证滚动效果正常
      this.scroll.refresh()
    },
    methods: {
      initScroll() {
        if (!this.$refs.wrapper) {
          retrun
        }
        // 初始化，配置参数
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click,
          scrollX: this.scrollX
        })
        // 派发滚动事件
        if (this.listenScroll) {
          const self = this
          // 在里面的 this 指向的就和外面的不同了
          // 根据子组件的 scroll 事件获取 position
          this.scroll.on('scroll', (pos) => {
            // 子组件通过 $emit 的方式调用父组件中的 scorll 事件并将 position 传过去
            self.$emit('scroll', pos)
          })
        }
        if (this.pullup) {
          this.scroll.on('scrollEnd', () => {
            // 判断滚动到了底部 值越下面越小
            if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
              // 派发滚动到底部的事件
              this.$emit('scrollToEnd')
            }
          })
        }
        if (this.pulldown) {
          this.scroll.on('touchend', (pos) => {
            // 判断下拉动作
            if (pos.y > 50) {
              // 下拉刷新
              this.$emit('pulldown')
            }
          })
        }
        if (this.beforeScroll) {
          this.scroll.on('beforeScrollStart', () => {
            // 列表滚动前触发
            this.$emit('beforeScroll')
          })
        }
      },
      disable() {
        // 代理 better-scroll 的 disable 方法
        this.scroll && this.scroll.disable()
      },
      enable() {
        // 代理 better-scroll 的 enable 方法
        this.scroll && this.scroll.enable()
      },
      refresh() {
        // 代理 better-scroll 的 refresh 方法
        this.scroll && this.scroll.refresh()
      },
      scrollTo() {
        // 代理 better-scroll 的 scrollTo 方法
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement() {
        // 代理 better-scroll 的 scrollToElement 方法
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    }
  }
</script>

<style lang="less" scoped>
  .scroll-wrapper {
    width: 100%;
    height: 100%;
    // 溢出隐藏
    overflow: hidden;
  }
</style>