import isEqual from 'lodash/isEqual'
import merge from 'lodash/merge'
import React from 'react'

export interface ValineOptions {
  /** Valine 的初始化挂载器。可以是一个CSS 选择器，也可以是一个实际的HTML元素。 */
  el: string | HTMLElement
  /** 从LeanCloud的应用中得到的`appId`，参见: [获取`appId`和`appKey`](https://valine.js.org/quickstart.html) */
  appId: string
  /** 从LeanCloud的应用中得到的`appKey`，参见: [获取`appId`和`appKey`](https://valine.js.org/quickstart.html) */
  appKey: string
  /** 评论框占位提示符 */
  placeholder?: string
  /** 当前文章页路径，用于区分不同的文章页，以保证正确读取该文章页下的评论列表。
   *
   * 可选值：
   * - GraphQL请求到的页面`slug`（推荐）
   * - window.location.pathname (默认值，推荐)
   * - window.location.href
   * - 自定义
   */
  path?: string
  /**
   * Gravatar 头像展示方式。
   *
   * 可选值：
   * - `''`(空字符串)
   * - `mp`
   * - `identicon`
   * - `monsterid`
   * - `wavatar`
   * - `retro`
   * - `robohash`
   * - `hide`
   *
   * 更多信息，请查看[头像配置](https://valine.js.org/avatar.html)。
   */
  avatar?: '' | 'mp' | 'identicon' | 'monsterid' | 'wavatar' | 'retro' | 'robohash' | 'hide'
  /** 评论者相关属性。 */
  meta?: ('nick' | 'mail' | 'link')[]
  /** 评论列表分页，每页条数。 */
  pageSize?: number
  /** 多语言支持。
   *
   * 可选值：
   *
   * - `zh-CN`
   * - `zh-TW`
   * - `en`
   * - `ja`
   *
   * 如需自定义语言，请参考[i18n](https://valine.js.org/i18n.html)。 */
  lang?: string
  /** [文章访问量统计。](https://valine.js.org/visitor.html) */
  visitor?: boolean
  /** 代码高亮，默认开启，若不需要，请手动关闭 */
  highlight?: boolean
  /** 每次访问强制拉取最新的评论列表头像
   *
   * > 不推荐设置为true，目前的评论列表头像会自动带上Valine的版本号 */
  avatarForce?: boolean
  /** 是否记录评论者IP */
  recordIP?: boolean
  /** 该配置适用于国内自定义域名用户, 海外版本会自动检测(无需手动填写)  */
  serverURLs?: string
  /** 设置表情包CDN，参考[自定义表情](https://valine.js.org/emoji.html) */
  emojiCDN?: string
  /** 设置表情包映射，参考[自定义表情](https://valine.js.org/emoji.html) */
  emojiMaps?: Record<string, string>
  /** 是否启用昵称框自动获取QQ昵称和QQ头像, 默认关闭，需博/网站主主动启用 */
  enableQQ?: boolean
  /** 设置必填项，默认匿名，可选值：
   * - `['nick']`
   * - `['nick','mail']`
   * */
  requiredFields?: ['nick'] | ['nick', 'mail']
}

export type ValineProps = Partial<Omit<ValineOptions, 'el'> & { style: React.CSSProperties; className: string }>

/** 使用React包装的Valine评论组件 */
export default class Valine extends React.PureComponent<ValineProps> {
  private _containerRef: React.RefObject<HTMLDivElement>
  constructor(props: ValineProps) {
    super(props)
    this._containerRef = React.createRef()
  }
  async componentDidMount() {
    if (this._checkAvailability()) {
      await this._makeValine()
    }
  }
  async componentDidUpdate(prevProps: ValineProps) {
    if (isEqual(this.props, prevProps)) {
      return
    }
    if (this._checkAvailability()) {
      await this._makeValine()
    }
  }
  render() {
    const { style, className } = this.props
    return <div ref={this._containerRef} style={style} className={className} />
  }

  private _checkAvailability(): boolean {
    return typeof window !== 'undefined' && !!this._containerRef.current
  }
  private async _makeValine() {
    const RealValine = await (await import('valine')).default
    const localOptions = this.props
    const globalOptions = window.valineOptions
    const options = merge({}, globalOptions, localOptions)
    delete options.el
    new RealValine({
      ...options,
      el: this._containerRef.current,
    })
    window.valineOptions
  }
}

declare global {
  interface Window {
    valineOptions: Partial<ValineOptions>
  }
}
