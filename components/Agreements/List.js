import Link from "next/link";
import AgreementService from "../../libs/AgreementService";
import DatePicker from "react-datepicker";
import moment from "moment";

export default class Create extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      filter: [
        {
          selectedField: "",
          selectedOperator: "",
          selectedValue: ""
        }
      ],
      selectedField: "",
      selectedOperator: "",
      form: {
        name: "",
        name: "",
        startDate: "",
        endDate: "",
        value: "",
        status: "Active"
      },
      errMsg: "",
      loading: true
    };
    this.status = ["Active", "Renewed", "Amended"];
    this.fields = [
      {
        key: "",
        value: "Select Field"
      },
      {
        key: "name",
        value: "Name"
      },
      {
        key: "startDate",
        value: "Start Date"
      },
      {
        key: "endDate",
        value: "End Date"
      },
      {
        key: "value",
        value: "Value"
      },
      {
        key: "status",
        value: "Status"
      }
    ];
    this.operators = [
      {
        key: "",
        value: "Select Operator"
      },
      {
        key: "equals",
        value: "="
      },
      {
        key: "not_equals",
        value: "!="
      },
      {
        key: "contains",
        value: "Contains"
      },
      {
        key: "gt_equals",
        value: ">="
      },
      {
        key: "lt_equals",
        value: "<="
      }
    ];
  }

  componentDidMount() {
    this.getAgreements();
  }

  getAgreements = () => {
    AgreementService.get().then(res => {
      console.log(res);
      this.setState({
        data: res.data,
        loading: false
      });
    });
  };

  handleChange = (date, forDate) => {
    console.log(date.toDate(), forDate);
    this.updateData({
      target: { name: forDate, value: date }
    });
  };

  getValueInput = () => {
    if (!this.state.selectedField) {
      return (
        <input
          name="name"
          type="text"
          className="form-input"
          placeholder="Select Field"
          style={{ backgroundColor: "#fff", width: "15%" }}
          disabled
        />
      );
    } else if (this.state.selectedField === "name") {
      return (
        <input
          name="name"
          type="text"
          className="form-input"
          placeholder="Search Name"
          style={{ backgroundColor: "#fff", width: "15%" }}
          onChange={e => this.updateData(e)}
        />
      );
    } else if (this.state.selectedField === "startDate") {
      return (
        <div style={{ display: "inline-block", width: "15%" }}>
          <DatePicker
            selected={this.state.form.startDate}
            onChange={date => this.handleChange(date, "startDate")}
            showTimeSelect
            timeFormat="HH:mm"
            dateFormat="DD MMM YYYY - HH:mm:ss A"
            timeCaption="time"
            placeholderText="Start Date"
            className="form-input"
          />
        </div>
      );
    } else if (this.state.selectedField === "endDate") {
      return (
        <div style={{ display: "inline-block", width: "15%" }}>
          <DatePicker
            selected={this.state.form.endDate}
            onChange={date => this.handleChange(date, "endDate")}
            showTimeSelect
            timeFormat="HH:mm"
            dateFormat="DD MMM YYYY - HH:mm:ss A"
            timeCaption="time"
            placeholderText="End Date"
            className="form-input"
          />
        </div>
      );
    } else if (this.state.selectedField === "value") {
      return (
        <input
          name="value"
          type="number"
          className="form-input"
          placeholder="Search Value"
          style={{ backgroundColor: "#fff", width: "15%" }}
          onChange={e => this.updateData(e)}
        />
      );
    } else if (this.state.selectedField === "status") {
      return (
        <select
          name="status"
          onChange={e => this.updateData(e)}
          className="form-input"
          style={{ backgroundColor: "#fff", width: "15%" }}
        >
          {this.status.map(status => <option key={status} value={status}>{status}</option>)}
        </select>
      );
    }
  };

  selectField = e => {
    this.setState({
      [e.target.name]: e.target.value,
      errMsg: ""
    });
  };

  updateData = e => {
    let name = e.target.name;
    let value = e.target.value;
    console.log(name, value);
    this.setState({
      form: {
        [name]: value
      },
      errMsg: ""
    });
  };

  filter = () => {
    console.log(this.state);
    if (this.state.selectedField == "") {
      this.setState({
        errMsg: "Please, select Field"
      });
      return;
    } else if (this.state.selectedOperator == "") {
      this.setState({
        errMsg: "Please, select operator"
      });
      return;
    } else if (
      !this.state.form[this.state.selectedField] ||
      this.state.form[this.state.selectedField] == ""
    ) {
      this.setState({
        errMsg: "Please, filter with some value"
      });
      return;
    } else {
      this.setState({
        errMsg: ""
      });
    }

    let obj = {
      operation: this.state.selectedOperator,
      [this.state.selectedField]: this.state.form[this.state.selectedField]
    };
    if (obj.startDate) {
      obj.startDate = moment(obj.startDate).valueOf();
    } else if (obj.endDate) {
      obj.endDate = moment(obj.endDate).valueOf();
    }
    AgreementService.filter(obj)
      .then(res => {
        this.setState({
          data: res.data
        });
      })
      .catch(err => {
        console.error(err);
      });
    console.log(obj);
  };

  delete = id => {
    AgreementService.delete([id])
      .then(res => {
        console.log(res);
        this.getAgreements();
      })
      .catch(err => {
        console.error(err);
      });
  };

  render() {
    return (
      <div className="list-container">
        <div>
          <Link href="/create">
            <a style={{ fontSize: "18px" }}>Create</a>
          </Link>
        </div>

        <div className="advance-search-container">
          <div>
            <select
              name="selectedField"
              className="form-input"
              style={{
                backgroundColor: "#fff",
                width: "17%",
                marginRight: "15px"
              }}
              onChange={e => this.selectField(e)}
            >
              {this.fields.map(field => (
                <option key={field.key} value={field.key}>
                  {field.value}
                </option>
              ))}
            </select>

            <select
              name="selectedOperator"
              className="form-input"
              style={{
                backgroundColor: "#fff",
                width: "17%",
                marginRight: "15px"
              }}
              onChange={e => this.selectField(e)}
            >
              {this.operators.map(field => (
                <option key={field.key} value={field.key}>
                  {field.value}
                </option>
              ))}
            </select>

            {this.getValueInput()}
          </div>
        </div>

        <div>
          <button
            className="form-btn"
            style={{ marginBottom: "15px", width: "100px" }}
            onClick={() => this.filter()}
          >
            Search
          </button>
          {this.state.errMsg ? (
            <span style={{ marginLeft: "30px", color: "red" }}>
              {this.state.errMsg}
            </span>
          ) : null}
        </div>

        <div className="grid-header-container">
          <div className="grid-header" style={{ fontWeight: "600" }}>
            Agreement Name
          </div>
          <div className="grid-header" style={{ fontWeight: "600" }}>
            Start Date
          </div>
          <div className="grid-header" style={{ fontWeight: "600" }}>
            End Date
          </div>
          <div className="grid-header" style={{ fontWeight: "600" }}>
            Agreement Value
          </div>
          <div className="grid-header" style={{ fontWeight: "600" }}>
            Agreement Status
          </div>
          <div className="grid-header-last-row" style={{ fontWeight: "600" }}>
            Actions
          </div>
        </div>

        {this.state.data.map((agrmnt, index) => (
          <div className="grid-header-container" key={index}>
            <div
              className={
                this.state.data.length - 1 === index
                  ? "grid-header-row"
                  : "grid-header"
              }
            >
              {agrmnt.name}
            </div>
            <div
              className={
                this.state.data.length - 1 === index
                  ? "grid-header-row"
                  : "grid-header"
              }
            >
              {agrmnt.startDate ? moment(agrmnt.startDate).format('DD MMM YYYY - HH:mm:ss A'): '-'}
            </div>
            <div
              className={
                this.state.data.length - 1 === index
                  ? "grid-header-row"
                  : "grid-header"
              }
            >
              {agrmnt.endDate ? moment(agrmnt.endDate).format('DD MMM YYYY - HH:mm:ss A') : '-'}
            </div>
            <div
              className={
                this.state.data.length - 1 === index
                  ? "grid-header-row"
                  : "grid-header"
              }
            >
              {agrmnt.value}
            </div>
            <div
              className={
                this.state.data.length - 1 === index
                  ? "grid-header-row"
                  : "grid-header"
              }
            >
              {agrmnt.status}
            </div>
            <div
              className={
                this.state.data.length - 1 === index
                  ? "grid-header-last-row-column"
                  : "grid-header-last-row"
              }
            >
              <a
                href="#"
                style={{ marginRight: "15px", textDecoration: "none" }}
              >
                Edit
              </a>
              <a
                href="#"
                style={{ textDecoration: "none" }}
                onClick={() => this.delete(agrmnt.id)}
              >
                Delete
              </a>
            </div>
          </div>
        ))}

        {!this.state.data.length ? (
          <div className="grid-header-container no-data-grid">
            {this.state.loading ? "Loading..." : "No data found"}
          </div>
        ) : null}
      </div>
    );
  }
}
