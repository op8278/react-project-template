import { hot } from 'react-hot-loader/root'
import React from 'react'
import ReactDOM from 'react-dom'
import Home from '@page/Home'

const $root = document.getElementById('root')

const Root = hot(Home)

ReactDOM.render(<Root />, $root)
