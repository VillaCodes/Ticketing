import axios from 'axios';

const indexComponent = ({ currentUser }) => {
  console.log(currentUser);
  return <h1>Hi There, You</h1>
};

indexComponent.getInitialProps = async () => {

  const response = await axios.get('/api/users/currentuser');

  return response.data;
};


export default indexComponent;