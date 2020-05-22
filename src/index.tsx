import React from 'react'

export interface ValineOptions {
  el: string
  appId: string
  appKey: string
  placeholder?: string
  path?: string
  avatar?: '' | 'mp' | 'identicon' | 'monsterid' | 'wavatar' | 'retro' | 'robohash' | 'hide'
  meta?: ('nick' | 'mail' | 'link')[]
  pageSize?: number
  lang?: string
  visitor?: boolean
  highlight?: boolean
  avatarForce?: boolean
  recordIP?: boolean
  serverURLs?: string
  emojiCDN?: string
  emojiMaps?: object
  enableQQ?: boolean
  requiredFields?: ('nick' | 'mail' | 'link')[]
}

export type ValineProps = Omit<ValineOptions, 'el'>

export default class Valine extends React.PureComponent<ValineProps> {
  private _containerRef: React.RefObject<HTMLDivElement>
  constructor(props: ValineProps) {
    super(props)
    this._containerRef = React.createRef()
  }
  async componentDidMount() {
    if (typeof window === `undefined`) {
      return
    }
    if (!this._containerRef.current) {
      return
    }
    const RealValine = await (await import('valine')).default
    console.log('valine props', this.props)
    new RealValine({
      el: this._containerRef.current,
      ...this.props,
    })
  }
  render() {
    return <div ref={this._containerRef} />
  }
}
