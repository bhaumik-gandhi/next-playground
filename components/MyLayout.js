import { PageHead } from './Page';

const Layout = (props) => (
  <div className='main-container'>
    <PageHead />    
    {props.children}
  </div>
)

export default Layout