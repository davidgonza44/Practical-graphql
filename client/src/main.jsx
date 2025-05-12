import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, ApolloLink} from '@apollo/client'
import { BrowserRouter } from 'react-router-dom'
import { onError } from '@apollo/client/link/error'
import { setContext } from '@apollo/client/link/context'

const httpLink = createHttpLink({
  uri : 'http://localhost:4000/',
  credentials : "include"
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("prisma-token");
  return { headers : {...headers, authorization : token}}
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
  link : ApolloLink.from([authLink, errorLink, httpLink]),
  cache: new InMemoryCache(),
})


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
    </BrowserRouter>
  </StrictMode>,
)
