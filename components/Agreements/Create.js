import DatePicker from "react-datepicker";
import moment from "moment";
import axios from "axios";
import { SERVER_URL } from "../../config/env";
import Link from 'next/link'
import Router from 'next/router';

export default class Create extends React.Component {
  constructor() {
    super();
    this.state = {
      form: {
        name: "",
        start_date: "",
        end_date: "",
        value: "",
        status: ""
      }
    };
    this.status = ["Active", "Renewed", "Amended"];
  }

  updateData = e => {
    let name = e.target.name;
    let value = e.target.value;
    console.log(name, value);
    this.setState({
      form: {
        ...this.state.form,
        [name]: value
      }
    });
  };

  handleChange = (date, forDate) => {
    console.log(date.toDate(), forDate);
    this.updateData({
      target: { name: forDate.toLowerCase(), value: date }
    });
  };

  submit = () => {
    console.log(this.state.form);
    let config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    axios
      .post(SERVER_URL, this.state.form, config)
      .then(res => {
        console.log(res);
        Router.push('/');
      })
      .catch(err => {
        console.error(err);
      });
  };

  render() {
    return (
      <div className="form-container">
        <div>
            <Link href="/">
              <a style={{fontSize: '18px'}}>Back to List</a>
            </Link>
        </div>
        <div className="input-container">
          <input
            className="form-input"
            placeholder="Agreement Name"
            name="name"
            onChange={e => this.updateData(e)}
          />
          <div className="date-picker-container">
            <DatePicker
              selected={this.state.form.start_date}
              onChange={date => this.handleChange(date, "START_DATE")}
              showTimeSelect
              timeFormat="HH:mm"
              dateFormat="LLL"
              timeCaption="time"
              placeholderText="Start Date"
              className="form-input"
            />
            <DatePicker
              selected={this.state.form.end_date}
              onChange={date => this.handleChange(date, "END_DATE")}
              showTimeSelect
              timeFormat="HH:mm"
              dateFormat="LLL"
              timeCaption="time"
              placeholderText="End Date"
              className="form-input"
            />
          </div>
          <input
            className="form-input"
            type="number"
            placeholder="Agreement Value"
            name="value"
            onChange={e => this.updateData(e)}
          />
          <select
            name="status"
            onChange={e => this.updateData(e)}
            className="form-input"
            style={{ backgroundColor: "#fff" }}
          >
            {this.status.map(status => <option key={status}>{status}</option>)}
          </select>
          <button onClick={this.submit} className="form-btn">
            Create Agreement
          </button>
        </div>
      </div>
    );
  }
}
