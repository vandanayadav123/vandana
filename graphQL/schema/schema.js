const { graphql, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLList, GraphQLNonNull } = require("graphql");
const axios = require('axios');
const _ = require('lodash');
// const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = graphql;
//const users = [{ id: '10', firstName: 'vandana', age: 10 }, { id: '11', firstName: 'akhilesh', age: 20 }, { id: '12', firstName: 'srikanth', age: 30 }]
const companyType = new GraphQLObjectType({
    name: 'Company',// name of model/table/collection
    fields: () => ({
        id: { type: GraphQLString },
       description:{type:GraphQLString},
        users: {
            type: new GraphQLList(userType),
            resolve(pValue, args) {
                return axios.get(`http://localhost:3000/companies/${pValue.id}/users`).then(res => res.data)
            }
        }
    })
});
const userType = new GraphQLObjectType({
    name: 'User',// name of model/table/collection
    fields: () => ({
        id: { type: GraphQLString },

        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        company: {
            type: companyType,
            resolve(pValue, args) {
                return axios.get(`http://localhost:3000/companies/${pValue.companyId}`).then(res => res.data)
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'UserDetail', //name of model/table/collection
    fields: {
        user:
        {
            type: userType, args: { id: { type: GraphQLString } },
            resolve(pValue, args) { return axios.get(`http://localhost:3000/users/${args.id}`).then(res => res.data) }
        },
        company: {
            type: companyType, args: { id: { type: GraphQLString } },
            resolve(pValue, args) { return axios.get(`http://localhost:3000/companies/${args.id}`).then(res => res.data) }
        },
        users: {
            type: new GraphQLList(userType),
            resolve(pValue, args) {
                return axios.get(`http://localhost:3000/users`).then(res => res.data)
            }
        }
    }
});
 const mutation = new GraphQLObjectType({
     name :"mutation",
     fields:{
         addUser:{
             type: userType,
             args:{firstName:{type:new GraphQLNonNull(GraphQLString)},age:{type:new GraphQLNonNull(GraphQLInt)},companyId:{type:new GraphQLNonNull(GraphQLString)}},
             resolve(pValue,args){
                return axios.post(`http://localhost:3000/users`,{...args}).then(res=>res.data)
             }
         },
         deleteUser:{
            type: userType,
            args:{id:{type:new GraphQLNonNull(GraphQLString)}},
            resolve(pValue,{id}){
               return axios.delete(`http://localhost:3000/users/${id}`).then(res=>res.data)
            }
        },
        editUSer:{
            type: userType,
            args:{
                id : {type :new GraphQLNonNull(GraphQLString)},
                firstName:{type:new GraphQLNonNull(GraphQLString)},
            age:{type:new GraphQLNonNull(GraphQLInt)},
            companyId:{type:new GraphQLNonNull(GraphQLString)}
        },
            resolve(pValue,args){
               return axios.patch(`http://localhost:3000/users/${args.id}`,args).then(res=>res.data)
            }
        }
     }
 })


module.exports = new GraphQLSchema({ query: RootQuery,mutation });