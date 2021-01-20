import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
} from 'react-native';
import { Query } from 'react-apollo';
import TodoItem from './TodoItem';
import LoadOlder from './LoadOlder';
import LoadNewer from './LoadNewer';
import CenterSpinner from '../Util/CenterSpinner';
import gql from 'graphql-tag';

export const FETCH_TODOS = gql`
query getMyTodos($is_public:Boolean){
  todos(where:{is_public:{_eq:$is_public}},order_by:{created_at:desc}){
  	id
    title
    created_at
    is_completed
    is_public
    user{
      name
    }
  }
}
`

const Todos = (isPublic,...props) => {

  const [newTodosExist, setNewTodosExist] = React.useState(true);
  

  const data = {
    todos: []
  }
  
  return (
    <Query query={FETCH_TODOS}>
      {({ data,error, loading }) => {
        if(error) {
          console.log(error)
          return <Text>Error</Text>
        }
        if(loading){
          return<CenterSpinner/>
        }
        if (!data || !data.todos) return null;
        return (
          <View style={styles.container}>
            <LoadNewer show={newTodosExist && isPublic} styles={styles} isPublic={props.isPublic} />
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContainer}>
              <FlatList
                data={data.todos}
                renderItem={({ item }) => <TodoItem item={item} isPublic={props.isPublic} />}
                keyExtractor={(item) => item.id.toString()}
              />
              <LoadOlder
                isPublic={props.isPublic}
                styles={styles}
              />
            </ScrollView>
          </View>
        )
      }}
    </Query>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 0.8,
    paddingHorizontal: 10,
    backgroundColor: '#F7F7F7'
  },
  scrollViewContainer: {
    justifyContent: 'flex-start'
  },
  banner: {
    flexDirection: 'column',
    backgroundColor: '#39235A',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  pagination: {
    flexDirection: 'row',
    backgroundColor: '#39235A',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    borderRadius: 5,
    marginBottom: 20,
    paddingVertical: 5,
  },
  buttonText: {
    color: 'white'
  }
});

export default Todos;