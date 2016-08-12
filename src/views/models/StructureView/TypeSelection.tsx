import * as React from 'react'
import { findDOMNode } from 'react-dom'
import Icon from '../../../components/Icon/Icon'
import ScrollBox from '../../../components/ScrollBox/ScrollBox'
const ClickOutside: any = (require('react-click-outside') as any).default
const classes: any = require('./TypeSelection.scss')

const types = [
  'Int',
  'Float',
  'Boolean',
  'String',
  'DateTime',
  'GraphQLID',
  'Enum',
]

interface Props {
  selected: string
  select: (typeIdentifier: string) => void
}

interface State {
  open: boolean
}

export default class TypeSelection extends React.Component<Props, State> {

  refs: {
    [key: string]: any;
    scroll: ScrollBox
  }

  state = {
    open: false,
  }

  componentWillUnmount () {
    window.removeEventListener('keydown', this._listenForKeys, true)
  }

  componentWillUpdate (nextProps, nextState) {
    if (!this.state.open && nextState.open) {
      window.addEventListener('keydown', this._listenForKeys, true)
    } else if (this.state.open && !nextState.open) {
      window.removeEventListener('keydown', this._listenForKeys, true)
    }
  }

  _select (type) {
    this.props.select(type)
    this.setState({ open: false })
  }

  _open () {
    this.setState({ open: true })
  }

  _close () {
    this.setState({ open: false })
  }

  _listenForKeys = (e: KeyboardEvent) => {
    const allTypes = [...types]
    let selectedIndex = allTypes.indexOf(this.props.selected)

    switch (e.keyCode) {
      case 9: // tab
      case 13: // enter
      case 27: // esc
        e.stopPropagation()
        return this._close()
      case 40:
        selectedIndex++
        break
      case 38:
        selectedIndex--
        break
    }

    selectedIndex = (selectedIndex + allTypes.length) % allTypes.length

    this.props.select(allTypes[selectedIndex])

    const relativePosition = selectedIndex / allTypes.length
    const outerContainerElement = findDOMNode(this.refs.scroll.refs.outerContainer)
    const innerContainerElement = findDOMNode(this.refs.scroll.refs.innerContainer)
    outerContainerElement.scrollTop = innerContainerElement.clientHeight * relativePosition
  }

  render () {
    if (!this.state.open) {
      return (
        <div
          className={classes.root}
          tabIndex={0}
          onClick={() => this._open()}
          onFocus={() => this._open()}
        >
          <div className={classes.preview}>
            <span>
              {this.props.selected}
            </span>
            <Icon
              width={11}
              height={6}
              src={require('assets/icons/arrow.svg')}
              />
          </div>
        </div>
      )
    }

    return (
      <div className={classes.root}>
        <ClickOutside onClickOutside={() => this._close()}>
          <div className={classes.overlay} ref='overlay'>
            <ScrollBox
              ref='scroll'
              innerContainerClassName={classes.scrollInnerContainer}
              outerContainerClassName={classes.scrollOuterContainer}
            >
              <div className={classes.list}>
                {types.map((type) => (
                  <div
                    key={type}
                    onClick={() => this._select(type)}
                    className={type === this.props.selected ? classes.selected : ''}
                  >
                    {type}
                  </div>
                ))}
              </div>
            </ScrollBox>
          </div>
        </ClickOutside>
      </div>
    )
  }
}
