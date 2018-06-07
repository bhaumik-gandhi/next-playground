import DatePicker from "react-datepicker";
import moment from "moment";
import Link from "next/link";
import Router from "next/router";
import AgreementService from "../../libs/AgreementService";
import { get } from "lodash";

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
      },
      errors: {
        name: {
          isRequired: true,
          isRequiredError: false
        },
        startDate: {
          isRequired: true,
          isRequiredError: false
        },
        endDate: {
          isRequired: true,
          isRequiredError: false,
          isValidDateError: false
        },
        value: {
          isRequired: true,
          isRequiredError: false
        },
        status: {
          isRequired: true,
          isRequiredError: false
        }
      }
    };
    this.formSubmitted = false;
    this.status = ["Active", "Renewed", "Amended"];
  }

  checkIsFormValid = () => {
    let requiredFields = [];
    let nonRequiredFields = [];
    let allFields = Object.keys(this.state.errors);

    allFields.map(f => {
      if (this.state.errors[f].isRequired) {
        requiredFields.push(f);
      } else {
        nonRequiredFields.push(f);
      }
    });
    let isFormValid = true;

    requiredFields.map(rf => {
      if (!this.state.form[rf]) {
        isFormValid = false;
      }
      if (rf === 'endDate') {
        let startDate = this.state.form.startDate.valueOf();
        let endDate = this.state.form.endDate.valueOf();
        if (startDate >= endDate) {
          isFormValid = false;
        }
      }
    });

    nonRequiredFields.map(nrf => {});

    this.setError(allFields);

    return isFormValid;
  };

  setError = field => {
    if (Array.isArray(field)) {
      let errors = this.state.errors;

      field.map(f => {
        let isRequired = get(this.state.errors[f], "isRequired");
        let value = get(this.state.form, `${f}`);
        if (isRequired) {
          if (!value) {
            errors[f].isRequiredError = true;
          } else {
            errors[f].isRequiredError = false;
          }
        }
      });

      this.setState({
        errors
      });
    } else {
      let isRequired = get(this.state.errors[field], "isRequired");
      let value = get(this.state.form, field);

      if (isRequired) {
        if (!value) {
          this.setState({
            errors: {
              ...this.state.errors,
              [field]: {
                ...this.state.errors[field],
                isRequiredError: true
              }
            }
          });
        } else {
          let isValidDateError=``;
          if (field === 'endDate') {
            let startDate = this.state.form.startDate.valueOf();
            let endDate = this.state.form.endDate.valueOf();
            if (startDate >= endDate) {
              isValidDateError = {isValidDateError: true}
            } else {
              isValidDateError = {isValidDateError: false}
            }
          }

          this.setState({
            errors: {
              ...this.state.errors,
              [field]: {
                ...this.state.errors[field],
                isRequiredError: false,
                ...isValidDateError
              }
            }
          });
        }
      } else {
        this.setState({
          errors: {
            ...this.state.errors,
            [field]: {
              ...this.state.errors[field]
            }
          }
        });
      }
    }
  };

  updateData = e => {
    let name = e.target.name;
    let value = e.target.value;
    console.log(name, value);
    if (name === "value") {
      value = parseInt(value);
    }
    this.setState(
      {
        form: {
          ...this.state.form,
          [name]: value
        }
      },
      () => {
        this.setError(name);
      }
    );
  };

  handleChange = (date, forDate) => {
    console.log(forDate);
    this.updateData({
      target: { name: forDate, value: date }
    });
  };

  submit = () => {
    if (this.formSubmitted) {
      console.error("Form already submitted...");
      return;
    }

    this.formSubmitted = true;

    if (!this.checkIsFormValid()) {
      console.error("FORM NOT VALID");
      this.formSubmitted = false;
      return;
    }
    let obj = {
      ...this.state.form,
      startDate: moment(this.state.form.startDate).valueOf(),
      endDate: moment(this.state.form.endDate).valueOf()
    };
    AgreementService.create(obj)
      .then(res => {
        console.log(res);
        Router.push("/");
      })
      .catch(err => {
        console.error(err);
        this.formSubmitted = false;
      });
  };

  render() {
    return (
      <div className="form-container">
        <div>
          <Link href="/">
            <a style={{ fontSize: "18px" }}>Back to List</a>
          </Link>
        </div>
        <div className="input-container">
          <input
            className="form-input"
            placeholder="Agreement Name"
            name="name"
            onChange={e => this.updateData(e)}
            onBlur={() => this.setError("name")}
          />
          {this.state.errors.name.isRequiredError ? (
            <div className="validation-err-msg">
              Agreement Name cannot be left blank
            </div>
          ) : null}
          <div className="date-picker-container">
            <div>
              <DatePicker
                selected={this.state.form.startDate}
                onChange={date => this.handleChange(date, "startDate")}
                showTimeSelect
                timeFormat="HH:mm"
                dateFormat="DD MMM YYYY - HH:mm:ss A"
                timeCaption="time"
                placeholderText="Start Date"
                className="form-input"
                onBlur={() => this.setError("startDate")}
              />
              {this.state.errors.startDate.isRequiredError ? (
                <div className="validation-err-msg">
                  Start Date cannot be left blank
                </div>
              ) : null}
            </div>
            <div>
              <DatePicker
                selected={this.state.form.endDate}
                onChange={date => this.handleChange(date, "endDate")}
                showTimeSelect
                timeFormat="HH:mm"
                dateFormat="DD MMM YYYY - HH:mm:ss A"
                timeCaption="time"
                placeholderText="End Date"
                className="form-input"
                onBlur={() => this.setError("endDate")}
              />
              {this.state.errors.endDate.isRequiredError ? (
                <div className="validation-err-msg">
                  End Date cannot be left blank
                </div>
              ) : null}
              {this.state.errors.endDate.isValidDateError ? (
                <div className="validation-err-msg">
                  End Date always greater than start date
                </div>
              ) : null}
            </div>
          </div>
          <input
            className="form-input"
            type="number"
            placeholder="Agreement Value"
            name="value"
            onChange={e => this.updateData(e)}
            onBlur={() => this.setError("value")}
          />
          {this.state.errors.value.isRequiredError ? (
            <div className="validation-err-msg">Value cannot be left blank</div>
          ) : null}
          <select
            name="status"
            onChange={e => this.updateData(e)}
            className="form-input"
            style={{ backgroundColor: "#fff" }}
            onBlur={() => this.setError("status")}
          >
            {this.status.map(status => <option key={status}>{status}</option>)}
          </select>
          {this.state.errors.status.isRequiredError ? (
            <div className="validation-err-msg">
              Status cannot be left blank
            </div>
          ) : null}
          <button onClick={this.submit} className="form-btn">
            Create Agreement
          </button>
        </div>
      </div>
    );
  }
}
