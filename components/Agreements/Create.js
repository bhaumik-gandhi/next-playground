import DatePicker from "react-datepicker";
import moment from "moment";
import Link from 'next/link'
import Router from 'next/router';
import AgreementService from '../../libs/AgreementService';

export default class Create extends React.Component {
  constructor() {
    super();
    this.state = {
      form: {
        name: "",
        startDate: "",
        endDate: "",
        value: "",
        status: "Active"
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
      target: { name: forDate, value: date }
    });
  };

  submit = () => {    
    AgreementService
      .create(this.state.form)
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
              selected={this.state.form.startDate}
              onChange={date => this.handleChange(date, "startDate")}
              showTimeSelect
              timeFormat="HH:mm"
              dateFormat="LLL"
              timeCaption="time"
              placeholderText="Start Date"
              className="form-input"
            />
            <DatePicker
              selected={this.state.form.endDate}
              onChange={date => this.handleChange(date, "endDate")}
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
