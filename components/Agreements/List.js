import Link from "next/link";
import AgreementService from "../../libs/AgreementService";
import DatePicker from "react-datepicker";
import moment from "moment";
import { get, orderBy } from 'lodash';

export default class Create extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      filter: [
        {
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
        }
      ],
      showFilter: false,
      errMsg: "",
      loading: true,
      sortedBy: '',
      sortOrder: 'desc'
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

  handleChange = (date, forDate, index) => {
    console.log(date.toDate(), forDate);
    this.updateData({
      target: { name: forDate, value: date }
    }, index);
  };

  getValueInput = index => {
    if (!this.state.filter[index].selectedField) {
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
    } else if (this.state.filter[index].selectedField === "name") {
      return (
        <input
          name="name"
          type="text"
          className="form-input"
          placeholder="Search Name"
          style={{ backgroundColor: "#fff", width: "15%" }}
          onChange={e => this.updateData(e, index)}
          value={get(this.state, `filter[${index}].form.name`)}
        />
      );
    } else if (this.state.filter[index].selectedField === "startDate") {
      return (
        <div style={{ display: "inline-block", width: "15%", marginRight: '15px' }}>
          <DatePicker
            selected={get(this.state, `filter[${index}].form.startDate`)}
            onChange={date => this.handleChange(date, "startDate", index)}
            showTimeSelect
            timeFormat="HH:mm"
            dateFormat="DD MMM YYYY - HH:mm:ss A"
            timeCaption="time"
            placeholderText="Start Date"
            className="form-input"
          />
        </div>
      );
    } else if (this.state.filter[index].selectedField === "endDate") {
      return (
        <div style={{ display: "inline-block", width: "15%", marginRight: '15px' }}>
          <DatePicker
            selected={this.state.filter[index].form.endDate}
            onChange={date => this.handleChange(date, "endDate", index)}
            showTimeSelect
            timeFormat="HH:mm"
            dateFormat="DD MMM YYYY - HH:mm:ss A"
            timeCaption="time"
            placeholderText="End Date"
            className="form-input"
          />
        </div>
      );
    } else if (this.state.filter[index].selectedField === "value") {
      return (
        <input
          name="value"
          type="number"
          className="form-input"
          placeholder="Search Value"
          style={{ backgroundColor: "#fff", width: "15%" }}
          onChange={e => this.updateData(e, index)}
        />
      );
    } else if (this.state.filter[index].selectedField === "status") {
      return (
        <select
          name="status"
          onChange={e => this.updateData(e, index)}
          className="form-input"
          style={{ backgroundColor: "#fff", width: "15%" }}
        >
          {this.status.map(status => <option key={status} value={status}>{status}</option>)}
        </select>
      );
    }
  };

  selectField = (e, index) => {
    let filter = this.state.filter;

    filter[index] = {
      ...this.state.filter[index],
      [e.target.name]: e.target.value
    }

    this.setState({
      filter
    }, () => console.log(this.state.filter));
  };

  updateData = (e, index) => {
    let name = e.target.name;
    let value = e.target.value;
    console.log(name, value, index);

    let filter = this.state.filter;

    filter[index] = {
      ...this.state.filter[index],
      form: {
        ...this.state.filter[index].form,
        [name]: value
      }
    }

    this.setState({
      filter,
      errMsg: ""
    });
  };

  filter = () => {
    console.log(this.state);
    // if (this.state.selectedField == "") {
    //   this.setState({
    //     errMsg: "Please, select Field"
    //   });
    //   return;
    // } else if (this.state.selectedOperator == "") {
    //   this.setState({
    //     errMsg: "Please, select operator"
    //   });
    //   return;
    // } else if (
    //   !this.state.form[this.state.selectedField] ||
    //   this.state.form[this.state.selectedField] == ""
    // ) {
    //   this.setState({
    //     errMsg: "Please, filter with some value"
    //   });
    //   return;
    // } else {
    //   this.setState({
    //     errMsg: ""
    //   });
    // }
    let filterArr = [];

    this.state.filter.map((f, i) =>  {
      let obj = {
        operation: f.selectedOperator,
        [f.selectedField]: f.form[f.selectedField]
      };
      if (obj.startDate) {
        obj.startDate = moment(obj.startDate).valueOf();
      } else if (obj.endDate) {
        obj.endDate = moment(obj.endDate).valueOf();
      }
      filterArr.push(obj);
    });
    
    AgreementService.filter(filterArr)
      .then(res => {
        this.setState({
          data: res.data
        });
      })
      .catch(err => {
        console.error(err);
      });
    console.log(filterArr);
  };

  delete = id => {
    if (confirm('Are you sure')) {
      AgreementService.delete([id])
        .then(res => {
          console.log(res);
          this.getAgreements();
        })
        .catch(err => {
          console.error(err);
        });
    }
  };

  addFilter = () => {
    let filter = this.state.filter;

    filter.push({
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
    })

    this.setState({
      filter
    })
  }

  deleteFilter = index => {
    let filter = this.state.filter;
    console.log(index);
    filter.splice(index, 1);

    this.setState({
      filter
    }, () => console.log("d", this.state.filter))
  }

  toggleFilter = () => {
    this.setState({
      showFilter: !this.state.showFilter
    })
  }

  sortListing = (field) => {
    let data = this.state.data;

    let order = this.state.sortOrder === 'asc' ? 'desc' : 'asc' 
    console.log(field, order);

    let sortedData = orderBy(data, [field], [order]);

    this.setState({
      data: sortedData,
      sortedBy: field,
      sortOrder: order
    })
  }

  render() {
    return (
      <div className="list-container">
        <div className='create-btn-link'>
          <Link href="/create">
            <a className='btn-lnk'>{`Create New Agreement`}</a>
          </Link>
        </div>

        <div className='filter-search' onClick={() => this.toggleFilter()}>
          {this.state.showFilter ? 'Hide Filter' : 'Show Filter'}
        </div>
        {
          this.state.showFilter
          ?
          <div>
            <div className="advance-search-container">
              {this.state.filter.map((filter, index) => (
                <div key={index}>
                  <select
                    name="selectedField"
                    className="form-input"
                    style={{
                      backgroundColor: "#fff",
                      width: "17%",
                      marginRight: "15px"
                    }}
                    onChange={e => this.selectField(e, index)}
                    value={this.state.filter[index].selectedField}
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
                    onChange={e => this.selectField(e, index)}
                    value={this.state.filter[index].selectedOperator}
                  >
                    {this.operators.map(field => (
                      <option key={field.key} value={field.key}>
                        {field.value}
                      </option>
                    ))}
                  </select>

                  {this.getValueInput(index)}

                  {
                    index !== 0
                    ?
                      <button
                        className="form-btn"
                        style={{ marginBottom: "15px", width: "100px", marginLeft: "15px" }}
                        onClick={() => this.deleteFilter(index)}
                      >
                        Delete
                      </button>
                    :
                      null
                  }

                  {
                    this.state.filter.length - 1 === index
                    ?
                      <button
                        className="form-btn"
                        style={{ marginBottom: "15px", width: "100px", marginLeft: "15px" }}
                        onClick={() => this.addFilter()}
                      >
                        Add
                      </button>
                    :
                      null
                  }

                  
                </div>
              ))}
            
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
          </div>
          :
          null
        }

        

        <div className="grid-header-container">
          <div className="grid-header" style={{ fontWeight: "600", 'cursor': 'pointer' }} onClick={() => this.sortListing('name')} title='sort'>
            <div>Agreement Name</div>
          </div>
          <div className="grid-header" style={{ fontWeight: "600", 'cursor': 'pointer' }} onClick={() => this.sortListing('startDate')} title='sort'>
            Start Date
          </div>
          <div className="grid-header" style={{ fontWeight: "600", 'cursor': 'pointer' }} onClick={() => this.sortListing('endDate')} title='sort'>
            End Date
          </div>
          <div className="grid-header" style={{ fontWeight: "600", 'cursor': 'pointer' }} onClick={() => this.sortListing('value')} title='sort'>
            Agreement Value
          </div>
          <div className="grid-header" style={{ fontWeight: "600", 'cursor': 'pointer' }} onClick={() => this.sortListing('status')} title='sort'>
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
            <Link href={`/edit/${agrmnt.id}`}>
              <a                
                style={{ marginRight: "15px", textDecoration: "none", color: '#589eff', fontWeight: '600' }}
              >
                Edit
              </a>
            </Link>
              <a
                href="#"
                style={{ textDecoration: "none", color: '#589eff', fontWeight: '600' }}
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
