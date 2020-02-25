import React, { Component } from 'react'
import ReactGA from 'react-ga'
import { Route } from 'react-router-dom'

let isInitialized = false

/*
example usage:
sendGAEvent({
  category: 'Service',
  action: action + '  Completed',
})
*/
export function sendGAEvent(eventProps: ReactGA.EventArgs) {
  if (isInitialized) ReactGA.event(eventProps)
}

interface GoogleAnalyticsProps {
  location: {
    pathname: string
    search: string
  }
  options: object
}

class GoogleAnalytics extends Component<GoogleAnalyticsProps> {
  componentDidMount() {
    this.logPageChange(this.props.location.pathname, this.props.location.search)
  }

  componentDidUpdate({ location: prevLocation }: GoogleAnalyticsProps) {
    const {
      location: { pathname, search },
    } = this.props
    const isDifferentPathname = pathname !== prevLocation.pathname
    const isDifferentSearch = search !== prevLocation.search

    if (isDifferentPathname || isDifferentSearch) {
      this.logPageChange(pathname, search)
    }
  }

  logPageChange(pathname: string, search = '') {
    const page = pathname + search
    const { location } = window
    ReactGA.set({
      page,
      location: `${location.origin}${page}`,
      ...this.props.options,
    })
    ReactGA.pageview(page)
  }

  render() {
    return null
  }
}

const RouteTracker = () => <Route component={GoogleAnalytics} />

const init = (trackingID: string, options = {}) => {
  ReactGA.initialize(trackingID, {
    ...options,
  })

  isInitialized = true
  return isInitialized
}

export default {
  GoogleAnalytics,
  RouteTracker,
  init,
}
