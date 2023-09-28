# curriculum-rest-api
REST api for curriculum data, uses the GraphQL server in https://github.com/slonl/curriculum-graphql-server. It is written in javascript, using nodejs, with the express framework.

The REST api uses the GraphQL server as a backend, the reverse of the traditional role. The advantage is that the code base is very small and simple. You can easily extend / alter the REST api. Each route is generally a thin wrapper around a specific GraphQL query.

You can read more about the data architecture and the `replacedBy`/`replaces` mechanic in the dataset repositories:
- https://github.com/slonl/curriculum-basis
- https://github.com/slonl/curriculum-leerdoelenkaarten
