import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Operacao from './Operacao'

class App extends Component() {
  constructor(props) {
    super(props)
    this.state = {
      operacoes: []
    }
  }

  componentDidMount() {
    axios
      .get('http://localhost:3000/api/operacoes')
      .then(operacoes => {
        this.setState({ operacoes: operacoes.data })
      })
  }

  render() {
    return (
      <div className="App" >
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div>
            {this.state.operacoes.map(op => <Operacao key={op._id} operacao={op} />)}
          </div>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
        </a>
        </header>
      </div>
    )
  }
}

export default App;
