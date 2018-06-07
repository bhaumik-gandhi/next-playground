import { Create } from '../components/Agreements';
import Layout from '../components/MyLayout';

export default class EditAgreement extends React.Component {

  constructor(props) {
    super(props);
    console.log(props);
  }

  render() {
    console.log("props", )
    return <Layout> 
      <Create id={this.props.url.query.id}/>
    </Layout>
  }
}