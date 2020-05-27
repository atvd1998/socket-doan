import React, { Component } from 'react';
import io from 'socket.io-client';

var socket;

export default class Test extends Component {
  state = {
    data: [],
    chair: [],
  };

  componentDidMount() {
    socket = io('http://localhost:5000');
    socket.on('getdata', (data) => {
      console.log(data);
      this.setState((prevState) => ({
        data: [...prevState.data, data],
      }));
    });
  }
  componentWillUnmount() {
    socket.emit('disconnect');
    socket.off();
  }
  handleChange = (e) => {
    this.setState({
      chair: e.target.value,
    });
  };
  handleClick = () => {
    socket.emit('sendvalue', this.state.chair);
  };
  render() {
    return (
      <div>
        <input type="text" name="chair" onChange={this.handleChange} />
        <button onClick={this.handleClick}>Click</button>
        {this.state.data.map((d, index) => {
          return <div key={index}>{d}</div>;
        })}
      </div>
    );
  }
}
