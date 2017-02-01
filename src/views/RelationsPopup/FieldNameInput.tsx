import * as React from 'react'
import {Icon} from 'graphcool-styles'

interface State {
  isHovered: boolean
  isEnteringFieldName: boolean
}

interface Props {
  relatedFieldName: string | null
  relatedFieldType: string | null
  didChangeFieldName: (newFieldName: string) => void
}

export default class FieldNameInput extends React.Component<Props, State> {

  state = {
    isHovered: false,
    isEnteringFieldName: false,
  }

  render() {

    let relatedFieldElement: JSX.Element
    if (this.props.relatedFieldName && this.props.relatedFieldType) {
      relatedFieldElement = (
        <div className={`flex itemsCenter ph16 pv8 ${this.state.isHovered && 'bgBlack02'}`}>
          <style jsx={true}>{`

            .fieldType {
              @inherit: .f14, .ml6, .pv4, .ph6, .black50, .bgBlack04, .br2;
              font-family: 'Source Code Pro';
            }

            .purpleColor {
              color: rgba(164,3,111,1);
            }

            .move {
              transition: .25s linear all;
            }

          `}</style>
          {!this.state.isEnteringFieldName && !this.state.isHovered &&
          (<div className='f20 purpleColor'>{this.props.relatedFieldName}</div>
          )}
          {!this.state.isEnteringFieldName && this.state.isHovered &&
          (<div className='flex itemsCenter '>
              <div className='f20 purpleColor'>{this.props.relatedFieldName}</div>
              <Icon
                className='mh4 move'
                src={require('../../assets/icons/edit_project_name.svg')}
                width={16}
                height={16}
              />
            </div>
          )}
          {this.state.isEnteringFieldName &&
          (<input
              type='text'
              autoFocus={true}
              className='f20 purpleColor bgTransparent wS96'
              onKeyDown={this.handleKeyDown}
              value={this.props.relatedFieldName}
              onChange={(e) => this.props.didChangeFieldName(e.target.value)}
            />
          )}
          <div className='fieldType'>{this.props.relatedFieldType}</div>
        </div>
      )
    } else {
      relatedFieldElement = (
        <div className='ph16 pv8 black20 f20 i'>will be generated</div>
      )
    }

    return (
      <div
        className='bgWhite pointer'
        onMouseEnter={() => this.setState({isHovered: true} as State)}
        onMouseLeave={() => this.setState({isHovered: false} as State)}
        onClick={() => this.setState({isEnteringFieldName: true} as State)}q
      >
        <div className='black40 f14 ph16 pv8'>related field:</div>
        {relatedFieldElement}
      </div>
    )
  }

  private handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.setState({
        isEnteringFieldName: false,
      } as State)
    } else if (e.keyCode === 27) {
      this.setState({
        isEnteringFieldName: false,
      } as State)
    }
  }

=======
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return (
      <div></div>
    )
  }
>>>>>>> d7fcd252a9132eeac2cfd1b99f1305797c66019e
}
