import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import './App.css';

// Apollo Client setup
const client = new ApolloClient({
  uri: '/graphql', // Adjust the URI if it's different for your backend
  cache: new InMemoryCache(),
  headers: {
    authorization: localStorage.getItem('id_token') || '',
  },
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
};

export default App;