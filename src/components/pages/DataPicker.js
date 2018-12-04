import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-day-picker/lib/style.css';

export default class DataPick extends React.Component {
  static defaultProps = {
    numberOfMonths: 2,
  };
  constructor(props) {
    super(props);
    this.num = this.props.count
    this.className = `Selectable DatePicker${this.num}`
    this.handleChangeEnd = this.handleChangeEnd.bind(this);
    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.state = {
      startDate: (this.props.start === null ) ? new Date() : new Date(this.props.start),
      endDate: (this.props.end === null ) ? new Date() : new Date(this.props.end)
    }
  }

  handleChangeEnd(endDate) {
    this.setState({startDate: this.state.startDate, endDate});
  }

  handleChangeStart(startDate) {
    this.setState({startDate, endDate: startDate});
  }

  render () {
    return (
      <div>
        <DatePicker
            selected={this.state.startDate}
            selectsStart
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onChange={this.handleChangeStart}
            className='calander'
        />
        -
        <DatePicker
          selected={this.state.endDate}
          selectsEnd
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          onChange={this.handleChangeEnd}
          className='calander'
          />
      </div>)
  }

}
