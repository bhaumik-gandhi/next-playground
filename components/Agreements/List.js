import Link from 'next/link'

export default class Create extends React.Component {

  constructor() {
    super();
    this.state={
      data: [{
        name: 'abc asdad asd',
        start_date: '15-06-2018',
        end_date: '15-1-2325',
        value: 5,
        status: 'Active'
      },{
        name: 'abc asdad asd',
        start_date: '15-06-2018',
        end_date: '15-1-2325',
        value: 5,
        status: 'Active'
      },{
        name: 'abc asdad asd',
        start_date: '15-06-2018',
        end_date: '15-1-2325',
        value: 5,
        status: 'Active'
      },{
        name: 'abc asdad asd',
        start_date: '15-06-2018',
        end_date: '15-1-2325',
        value: 5,
        status: 'Active'
      }]
    }
  }

  render() {
    return(
      <div className="list-container">
        <div>
            <Link href="/create">
              <a style={{fontSize: '18px'}}>Create</a>
            </Link>
        </div>
        
        <div className='grid-header-container'>
          <div className='grid-header'>Agreement Name</div>
          <div className='grid-header'>Start Date</div>
          <div className='grid-header'>End Date</div>
          <div className='grid-header'>Agreement Value</div>
          <div className='grid-header'>Agreement Status</div>
          <div className='grid-header'>Actions</div>
        </div>

        {this.state.data.map(agrmnt => (
          <div className='grid-header-container'>               
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