import {
	ApolloClient,
	ApolloProvider,
	gql,
	InMemoryCache,
	useLazyQuery,
} from '@apollo/client';
import React, { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';

const client = new ApolloClient({
	uri: 'http://localhost:4000/graphql',
	cache: new InMemoryCache(),
});

const HELLO_QUERY = gql`
	query Hello($message: String!) {
		hello(message: $message)
	}
`;

const DATE_QUERY = gql`
  query {
    currentDate
  }
`;

function Hello() {
	const [message, setMessage] = useState('');
	const [getGreeting, { loading, error, data }] = useLazyQuery(HELLO_QUERY);

	const handleSubmit = (e) => {
		e.preventDefault();
		getGreeting({ variables: { message } });
	};

	if (loading) return <p>Cargando...</p>;
	if (error) return <p>Error :(</p>;

	return (
		<div>
			<Form onSubmit={handleSubmit}>
				<Form.Group controlId="formMessage">
					<Form.Control
						type="text"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						placeholder="Escribe tu mensaje"
					/>
				</Form.Group>
				<Button className="mt-2" variant="primary" type="submit">
					Enviar
				</Button>
			</Form>
			{data && <h2 className="mt-3">{data.hello}</h2>}
		</div>
	);
}

function Date() {
	const [getDate, { loading, error, data }] = useLazyQuery(DATE_QUERY);
  
	const handleButtonClick = () => {
	  getDate();
	};
  
	if (loading) return <p>Cargando...</p>;
	if (error) return <p>Error :(</p>;
  
	return (
	  <div>
		<Button className='mt-2' variant="primary" onClick={handleButtonClick}>
		  Mostrar fecha actual
		</Button>
		{data && <h2 className='mt-3'>{data.currentDate}</h2>}
	  </div>
	);
  }

function App() {
	return (
		<ApolloProvider client={client}>
			<Container className="my-5">
				<Row>
					<Col xs={12} md={{ span: 6, offset: 3 }}>
						<h1>Aplicación React y GraphQL</h1>
						<Hello />
						<Date/>
					</Col>
				</Row>
			</Container>
		</ApolloProvider>
	);
}
export default App;
