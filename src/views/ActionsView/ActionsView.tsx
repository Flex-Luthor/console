import * as React from 'react'
import * as Relay from 'react-relay'
import {Viewer, Project} from '../../types/types'
import Header from '../../components/Header/Header'
import ScrollBox from '../../components/ScrollBox/ScrollBox'
import ActionRow from './ActionRow.tsx'
import ActionBoxes from './ActionBoxes.tsx'
import Icon from '../../components/Icon/Icon'
import Helmet from 'react-helmet'
const classes: any = require('./ActionsView.scss')

interface Props {
  viewer: Viewer & { project: Project }
  params: any
  relay: any
}

interface State {
  showAddRow: boolean
  editableActionIds: string[]
}

class ActionsView extends React.Component<Props, State> {

  state = {
    showAddRow: false,
    editableActionIds: [],
  }

  _toggleEdit(id: string) {
    if (this.state.editableActionIds.includes(id)) {
      this._closeEdit(id)
    } else {
      this._openEdit(id)
    }
  }

  _openEdit(id: string) {
    this.setState({editableActionIds: this.state.editableActionIds.concat([id])} as State)
  }

  _closeEdit(id: string) {
    this.setState({editableActionIds: this.state.editableActionIds.filter((i) => i !== id)} as State)
  }

  render() {
    return (
      <div className={classes.root}>
        <Helmet title='Actions 🚀 Graphcool' />
        <Header
          viewer={this.props.viewer}
          params={this.props.params}
          project={this.props.viewer.project}
        >
          <div onClick={() => this.setState({ showAddRow: true } as State)} className={classes.header}>
            <div className={`${classes.button} ${classes.green}`}>
              <Icon
                width={16}
                height={16}
                src={require('assets/icons/add.svg')}
              />
              <span>Create Action</span>
            </div>
          </div>
        </Header>
        <div className={classes.content}>
          <ScrollBox>
            {this.state.showAddRow &&
            <ActionBoxes
              project={this.props.viewer.project}
              action={null}
              relay={this.props.relay}
              close={() => this.setState({ showAddRow: false } as State)}
            />
            }
            {this.props.viewer.project.actions.edges.map((edge) => edge.node).map((action) => (
              <div key={action.id}>
                <ActionRow
                  action={action}
                  projectId={this.props.viewer.project.id}
                  onClick={() => this._toggleEdit(action.id)}
                />
                {this.state.editableActionIds.includes(action.id) &&
                <ActionBoxes
                  project={this.props.viewer.project}
                  action={action}
                  relay={this.props.relay}
                  close={() => this._closeEdit(action.id)}
                />
                }
              </div>
            ))}
          </ScrollBox>
        </div>
      </div>
    )
  }
}

export default Relay.createContainer(ActionsView, {
  initialVariables: {
    projectName: null, // injected from router
  },
    fragments: {
        viewer: () => Relay.QL`
            fragment on Viewer {
                project: projectByName(projectName: $projectName) {
                    actions(first: 1000) {
                        edges {
                            node {
                                id
                                ${ActionRow.getFragment('action')}
                                ${ActionBoxes.getFragment('action')}
                            }
                        }
                    }
                    ${ActionBoxes.getFragment('project')}
                    ${Header.getFragment('project')}
                }
                ${Header.getFragment('viewer')}
            }
        `,
    },
})
