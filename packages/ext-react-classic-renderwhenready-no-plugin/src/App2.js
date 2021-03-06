import React, { Component } from 'react'
//import { Panel } from '@sencha/ext-classic'
//import { ExtReact } from '@sencha/ext-react'
import { reactify } from '@sencha/ext-react'
const Panel = reactify('Panel')
const ExtReact = reactify('ExtReact')

import { renderWhenReady } from '@sencha/ext-react'

class App2 extends Component {
  render() {
    return (
      <ExtReact root="div2">
        <Panel title="app2 title"style={{height:'400px'}}>app2</Panel>
      </ExtReact>
    )
 }
}

export default renderWhenReady(App2)
