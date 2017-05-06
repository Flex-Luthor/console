import * as React from 'react'
import * as Modal from 'react-modal'
import {fieldModalStyle} from '../../../utils/modalStyle'
import {Icon, $v} from 'graphcool-styles'
import TestLog from './TestLog'
import {Log} from '../../../types/types'
const ResultViewer: any = require('../FunctionLogs/ResultViewer').ResultViewer

interface Props {
  onRequestClose: () => void
  webhookUrl: string
  isInline: boolean
}

interface State {
  logs: Log[]
}

const modalStyling = {
  ...fieldModalStyle,
  content: {
    ...fieldModalStyle.content,
    width: '100vw',
  },
  overlay: {
    ...fieldModalStyle.overlay,
    backgroundColor: 'rgba(36, 54, 66, 0.98)',
  },
}

export default class TestPopup extends React.Component<Props, State> {

  constructor(props) {
    super(props)

    this.state = {
      logs: [],
    }
  }

  render() {
    const {onRequestClose} = this.props
    return (
      <Modal
        isOpen
        onRequestClose={onRequestClose}
        contentLabel='Function Testing Popup'
        style={modalStyling}
      >
        <style jsx={true}>{`
          .test-popup {
            @p: .pa60, .center, .flex, .justifyCenter;
          }
          .close-icon {
            @p: .absolute, .top38, .right38, .pointer;
          }
          .input {
            @p: .flexFixed, .overflowHidden;
            width: 500px;
          }
          .intro {
            @p: .bgDarkBlue, .pa38;
          }
          .output {
            @p: .flexFixed, .ml38;
          }
          h2 {
            @p: .white, .f20, .fw6;
          }
          p {
            @p: .white50, .f16, .mt16;
          }
          .editor {
            @p: .bgDarkerBlue, .pa16;
          }
          .editor-head {
            @p: .f14, .fw6, .white30, .ttu;
          }
          .title {
            @p: .white40, .f16, .fw6, .ttu, .ml16;
          }
          .buttons {
            @p: .w100, .flex, .justifyEnd;
          }
        `}</style>
        <div className='test-popup'>
          <div className='close-icon'>
            <Icon
              src={require('graphcool-styles/icons/stroke/cross.svg')}
              stroke
              strokeWidth={3}
              color={$v.white}
              width={26}
              height={26}
              onClick={onRequestClose}
            />
          </div>
          <div className='input'>
            <div className='intro'>
              <h2>
                Test Request Pipeline Hook
              </h2>
              <p>
                To test your function, choose a payload that represents a valid input,
                then run it and see in the logs, if it works.
              </p>
            </div>
            <div className='editor'>
              <div className='editor-head'>
                Define your event input
              </div>
              <ResultViewer
                value={message}
              />
              <div className='buttons'>
                <div
                  className='butn primary'
                  onClick={this.runTest}
                >
                  <Icon
                    src={require('graphcool-styles/icons/fill/triangle.svg')}
                    color={$v.white}
                    width={10}
                    height={10}
                  />
                  <span>
                    Run
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className='output'>
            <div className='header'>
              <div className='flex itemsCenter'>
                <Icon
                  src={require('graphcool-styles/icons/fill/logs.svg')}
                  color={$v.white40}
                  width={24}
                  height={24}
                />
                <div className='title'>
                  Your Test Logs
                </div>
              </div>
            </div>
            <div className='logs'>
              <TestLog response={message} />
            </div>
          </div>
        </div>
      </Modal>
    )
  }

  private runTest = () => {
    const {webhookUrl, isInline} = this.props
    return fetch('https://bju4v1fpt2.execute-api.us-east-1.amazonaws.com/dev/execute/', {
      method: 'post',
      body: JSON.stringify({isInlineFunction: isInline, url: webhookUrl, event: message}),
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(res => res.json())
      .then(res => {
        console.log('OMG WE RAN THE SHIT', res)
      })
  }
}

const message = `{
    "data": {
        "id": "",
        "name": "",
        "address": "",
        "isPremium": false
    },
    "context": {
    	"headers": {}
    }
}`
