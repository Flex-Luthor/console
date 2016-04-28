import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import { findDOMNode } from 'react-dom'
import mapProps from 'map-props'
import { Lokka } from 'lokka'
import { Transport } from 'lokka-transport-http'
import { isScalar, isValidValueForType } from 'utils/graphql'
import Tether from 'components/Tether/Tether'
import Icon from 'components/Icon/Icon'
import Loading from 'react-loading'
import classes from './DataTab.scss'

export class DataTab extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    modelName: PropTypes.string.isRequired,
    fields: PropTypes.array.isRequired,
    projectId: PropTypes.string.isRequired,
  }

  static contextTypes = {
    gettingStartedState: PropTypes.object.isRequired,
  }

  constructor (props) {
    super(props)

    const clientEndpoint = `${__BACKEND_ADDR__}/graphql/${this.props.projectId}`
    const token = window.localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}`, 'X-GraphCool-Source': 'dashboard:data-tab' }
    const transport = new Transport(clientEndpoint, { headers })

    this._lokka = new Lokka({ transport })

    this.state = {
      items: [],
      loading: true,
      editingFieldId: null,
      savingFieldId: null,
    }
  }

  componentWillMount () {
    this._reloadData()
  }

  _reloadData () {
    this.setState({ loading: true })
    const fieldNames = this.props.fields
      .map((field) => field.fieldName)
      .join(',')
    const query = `
      {
        viewer {
          all${this.props.modelName}s {
            edges {
              node {
                ${fieldNames}
              }
            }
          }
        }
      }
    `
    return this._lokka.query(query)
      .then((results) => {
        const items = results.viewer[`all${this.props.modelName}s`].edges.map((edge) => edge.node)
        this.setState({ items, loading: false })
      })
  }

  _deleteItem (item) {
    this.setState({ loading: true })
    const mutation = `
      {
        delete${this.props.modelName}(input: {
          id: "${item.id}",
          clientMutationId: "lokka-${Math.random().toString(36).substring(7)}"
        }) {
          clientMutationId
        }
      }
    `
    this._lokka.mutate(mutation)
      .then(() => {
        const items = this.state.items.filter((i) => i.id !== item.id)
        this.setState({ items, loading: false })
      })
  }

  _startEditing (field, fieldId) {
    if (field.fieldName !== 'id' && this.state.editingFieldId === null) {
      this.setState({editingFieldId: fieldId})
    }
  }

  _updateField (item, field, fieldId, value) {
    if (!isValidValueForType(value, field.typeIdentifier)) {
      alert(`'${value}' is not a valid value for field ${field.fieldName}`)
      return
    }

    this.setState({savingFieldId: fieldId})
    const inputString = this._parseValueForField(field, value)
    const mutation = `
      {
        update${this.props.modelName}(input: {
          id: "${item.id}",
          ${inputString},
          clientMutationId: "lokka-${Math.random().toString(36).substring(7)}"
        }) {
          clientMutationId
        }
      }
    `
    this._lokka.mutate(mutation)
      .then(() => {
        item[field.fieldName] = value
        this.setState({editingFieldId: null, savingFieldId: null})
      })
  }

  _parseValueForField (field, rawValue) {
    const key = field.fieldName
    switch (field.typeIdentifier) {
      case 'String': return `${key}: "${rawValue}"`
      case 'Int': return `${key}: ${parseInt(rawValue, 10)}`
      case 'Float': return `${key}: ${parseFloat(rawValue)}`
      case 'Boolean': return `${key}: ${rawValue === 'true'}`
      default: throw Error(`Unsupported typeIdentifier: ${field.typeIdentifier}`)
    }
  }

  _add () {
    this.setState({ loading: true })
    const inputString = this.props.fields
      .filter((field) => field.fieldName !== 'id')
      .map((field) => {
        const rawValue = findDOMNode(this.refs[field.id]).value
        return this._parseValueForField(field, rawValue)
      })
    const mutation = `
      {
        create${this.props.modelName}(input: {
          ${inputString},
          clientMutationId: "lokka-${Math.random().toString(36).substring(7)}"
        }) {
          clientMutationId
        }
      }
    `
    this._lokka.mutate(mutation)
      .then(::this._reloadData)
      .then(() => {
        // getting-started onboarding step
        if (this.props.modelName === 'Todo' && (
           this.context.gettingStartedState.isActive('STEP6_ADD_DATA_ITEM_1') ||
           this.context.gettingStartedState.isActive('STEP7_ADD_DATA_ITEM_2')
             )) {
          this.context.gettingStartedState.nextStep()
        }
      })
  }

  _listenForEnter (e) {
    if (e.keyCode === 13) {
      this._add()
    }
  }

  render () {
    if (this.state.loading) {
      return (
        <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Loading type='bubbles' delay={0} color='#8989B1' />
        </div>
      )
    }

    return (
      <div className={classes.root}>
        <table className={classes.table}>
          <thead>
            <tr>
              {this.props.fields.map((field) => (
                <th key={field.id}>{field.fieldName}</th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr id='newDataItem' className={classes.addRow}>
              <td>ID (generated)</td>
              {this.props.fields.filter((f) => f.fieldName !== 'id').map((field) => {
                let element
                switch (field.typeIdentifier) {
                  case 'Int':
                    element = (
                      <input
                        onKeyUp={::this._listenForEnter}
                        ref={field.id}
                        placeholder={field.fieldName}
                        type='number'
                      />
                    )
                    break
                  case 'Boolean':
                    element = (
                      <select defaultValue='false' ref={field.id}>
                        <option value='true'>true</option>
                        <option value='false'>false</option>
                      </select>
                    )
                    break
                  default:
                    element = (
                      <input
                        onKeyUp={::this._listenForEnter}
                        ref={field.id}
                        placeholder={field.fieldName}
                        type='text'
                      />
                    )
                    if (
                      this.props.modelName === 'Todo' &&
                      field.fieldName === 'text' &&
                      (this.context.gettingStartedState.isActive('STEP6_ADD_DATA_ITEM_1') ||
                      this.context.gettingStartedState.isActive('STEP7_ADD_DATA_ITEM_2'))) {
                      element = (
                        <Tether
                          steps={{
                            STEP6_ADD_DATA_ITEM_1: `Add your first Todo item to the database.
                            It doesn\'t matter what you type here.`,
                            STEP7_ADD_DATA_ITEM_2: 'Well done. Let\'s add another one.',
                          }}
                          offsetX={-10}
                          offsetY={5}
                          width={290}
                        >
                          {element}
                        </Tether>
                      )
                    }
                }
                return (
                  <td key={field.id}>{element}</td>
                )
              })}
              <td className={classes.addButton}>
                <span onClick={::this._add}>Add item</span>
              </td>
            </tr>
            {this.state.items.map((item) => (
              <tr key={item.id}>
                {this.props.fields.map((field) => {
                  let str = 'null'
                  if (item[field.fieldName] !== null) {
                    str = item[field.fieldName].toString()
                    if (str.length > 50) {
                      str = str.substr(0, 47) + '...'
                    }
                  }
                  const fieldId = `${item.id}:${field.id}`
                  if (this.state.editingFieldId === fieldId) {
                    return <td key={fieldId}>
                      {field.typeIdentifier === 'Boolean'
                      ? <select onChange={(e) => this._updateField(item, field, fieldId, e.target.value)}
                        onBlur={(e) => this._updateField(item, field, fieldId, e.target.value)}
                        autoFocus defaultValue={str}>
                        <option value={'true'}>true</option>
                        <option value={'false'}>false</option>
                      </select>
                      : <input autoFocus type='text' defaultValue={str}
                        onBlur={(e) => this._updateField(item, field, fieldId, e.target.value)} />}
                    </td>
                  } else {
                    return <td className={classes.padding}
                      onDoubleClick={() => this._startEditing(field, fieldId)} key={fieldId}>{str}</td>
                  }
                })}
                <td>
                  <span onClick={() => this._deleteItem(item)}>
                    <Icon src={require('assets/icons/delete.svg')} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}

const MappedDataTab = mapProps({
  params: (props) => props.params,
  fields: (props) => (
    props.viewer.model.fields.edges
      .map((edge) => edge.node)
      .filter((field) => isScalar(field.typeIdentifier))
  ),
  modelName: (props) => props.viewer.model.name,
  projectId: (props) => props.viewer.project.id,
})(DataTab)

export default Relay.createContainer(MappedDataTab, {
  initialVariables: {
    modelName: null, // injected from router
    projectName: null, // injected from router
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        model: modelByName(projectName: $projectName, modelName: $modelName) {
          name
          fields(first: 100) {
            edges {
              node {
                id
                fieldName
                typeIdentifier
              }
            }
          }
        }
        project: projectByName(projectName: $projectName) {
          id
        }
      }
    `,
  },
})
