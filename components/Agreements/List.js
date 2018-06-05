import Link from 'next/link'
import AgreementService from '../../libs/AgreementService';

export default class Create extends React.Component {

  constructor() {
    super();
    this.state={
      data: []
    },
    this.fields = ['name','startDate', 'endDate', 'value', 'status'];
  }

  componentDidMount() {
    AgreementService.get()
      .then(res => {
        console.log(res);
        this.setState({
          data: res.data
        })
      })
  }

  render() {
    return(
      <div className="list-container">
        <div>
            <Link href="/create">
              <a style={{fontSize: '18px'}}>Create</a>
            </Link>
        </div>

        <div className="advance-search-container">
          <div>
          <select
            name="status"
            onChange={e => this.updateData(e)}
            className="form-input"
            style={{ backgroundColor: "#fff", width: "17%" }}
          >
            {this.fields.map(field => <option key={field}>{field.toUpperCase()}</option>)}
          </select>
          </div>
        </div>
        
        <div className='grid-header-container'>
          <div className='grid-header'>Agreement Name</div>
          <div className='grid-header'>Start Date</div>
          <div className='grid-header'>End Date</div>
          <div className='grid-header'>Agreement Value</div>
          <div className='grid-header'>Agreement Status</div>
          <div className='grid-header'>Actions</div>
        </div>

        {this.state.data.map((agrmnt, index) => (
          <div className='grid-header-container' key={index}>               
              <div className='grid-header'>{agrmnt.name}</div>
              <div className='grid-header'>{agrmnt.start_date}</div>
              <div className='grid-header'>{agrmnt.end_date}</div>
              <div className='grid-header'>{agrmnt.value}</div>
              <div className='grid-header'>{agrmnt.status}</div>
              <div className='grid-header'>Actions</div>
          </div>
        ))}

      </div>
    )
  }
}