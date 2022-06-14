import { request, gql } from 'graphql-request'

export const queries = {
    users: `
      query {
        users: Users {
            firstName
            lastName
            userId
        }
      }
    `
}

export const mutations = {
    CreateUser: (input) => {return {
        params: {input},
        query: `
            mutation($input: CreateUserInput!) {
                CreateUser(input: $input) {
                    userId
                    firstName
                    lastName
                    email
                }
            }
        `
    }}
}

export const api = {
    call: (query) => {
        if(query.params !== undefined) {
            return request('http://localhost:8080/graphql', query.query, query.params)
        }
        else {
            return request('http://localhost:8080/graphql', query);
        }
    }
}

