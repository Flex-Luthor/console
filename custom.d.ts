declare module 'react-router-relay'
declare module 'react-datepicker'
declare module 'lokka'
declare module 'lokka-transport-http'
declare module 'react-router'
declare module 'react-redux'
declare module 'react-tether'
declare module 'smooch'
declare module 'graphql'
declare module 'graphql/*'

declare var require: {
  <T>(path: string): T
  (paths: string[], callback: (...modules: any[]) => void): void
  ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void
}

declare var analytics: any
declare var __BACKEND_ADDR__: any
declare var __SMOOCH_TOKEN__: any

declare module 'react-relay' {

  // fragments are a hash of functions
  interface Fragments {
    [query: string]: ((variables?: RelayVariables) => string)
  }

  interface CreateContainerOpts {
    initialVariables?: Object
    fragments: Fragments
    prepareVariables?(prevVariables: RelayVariables): RelayVariables
  }

  interface RelayVariables {
    [name: string]: any
  }

  // add static getFragment method to the component constructor
  interface RelayContainerClass<T> extends React.ComponentClass<T> {
    getFragment: ((q: string, vars?: RelayVariables) => string)
  }

  interface RelayQueryRequestResolve {
    response: any
  }

  interface RelayMutationRequest {
    getQueryString(): string
    getVariables(): RelayVariables
    resolve(result: RelayQueryRequestResolve)
    reject(errors: any)
  }

  interface RelayQueryRequest {
    resolve(result: RelayQueryRequestResolve)
    reject(errors: any)

    getQueryString(): string
    getVariables(): RelayVariables
    getID(): string
    getDebugName(): string
  }

  interface RelayNetworkLayer {
    supports(...options: string[]): boolean
  }

  class DefaultNetworkLayer implements RelayNetworkLayer {
    constructor(host: string, options: any)
    supports(...options: string[]): boolean
  }

  function createContainer<T>(component: React.ComponentClass<T>, params?: CreateContainerOpts): RelayContainerClass<any>
  function injectNetworkLayer(networkLayer: RelayNetworkLayer)
  function isContainer(component: React.ComponentClass<any>): boolean
  function QL(...args: any[]): string

  class Route {
    constructor(params?: RelayVariables)
  }

  // Relay Mutation class, where T are the props it takes and S is the returned payload from Relay.Store.update.
  // S is typically dynamic as it depends on the data the app is currently using, but it's possible to always
  // return some data in the payload using REQUIRED_CHILDREN which is where specifying S is the most useful.
  class Mutation<T,S> {
    props: T

    constructor(props: T)
    static getFragment(q: string): string
  }

  interface Transaction {
    getError(): Error
    Status(): number
  }

  interface StoreUpdateCallbacks<T> {
    onFailure?(transaction: Transaction)
    onSuccess?(response: T)
  }

  interface Store {
    commitUpdate(mutation: Mutation<any,any>, callbacks?: StoreUpdateCallbacks<any>)
  }

  var Store: Store

  class RootContainer extends React.Component<RootContainerProps,any> {}

  interface RootContainerProps extends React.Props<RootContainer>{
    Component: RelayContainerClass<any>
    route: Route
    renderLoading?(): JSX.Element
    renderFetched?(data: any): JSX.Element
    renderFailure?(error: Error, retry: Function): JSX.Element
  }

  interface RelayProp {
    variables: any
    setVariables(variables: Object)
  }
}
