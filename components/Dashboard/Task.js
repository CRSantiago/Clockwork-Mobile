import {
  View,
  Dimensions,
  Alert,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { useState, useContext } from 'react'

import { AuthContext } from '../../store/auth-context'
import { deleteTask } from '../../api/deleteTask'
import TaskDetail from './TaskDetail'

function Task({ task, onDelete }) {
  //console.log(`task ${task.taskid}`)
  const authCtx = useContext(AuthContext)
  const [detailIsVisible, setDetailIsVisible] = useState(false)
  function handleDetailsPress() {
    // Handle press for View Details button
    setDetailIsVisible(true)
  }

  function handleCloseDetails() {
    setDetailIsVisible(false)
  }

  function handleConfirmDelete() {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete '${task.title}'?`,
      [
        {
          text: 'Delete',
          onPress: handleDelete,
          style: 'destructive',
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    )
  }

  function handleDelete() {
    deleteTask(
      {
        id: authCtx.userid,
        taskId: task.taskid,
      },
      authCtx.token
    )
      .then((response) => {
        if (response.status === 200) {
          onDelete()
        }
      })
      .catch((error) => {
        alert('task could not be deleted!')
      })
  }

  return (
    <View>
      <TaskDetail
        visibility={detailIsVisible}
        taskid={task.taskid}
        onClose={handleCloseDetails}
      />
      <View style={styles.taskContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>{task.title}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.buttonDetails}
            onPress={handleDetailsPress}
          >
            <Text style={styles.buttonText}>View Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonDelete}
            onPress={handleConfirmDelete}
          >
            <Text style={styles.buttonText}>Delete Task</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  taskContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#18a7e0',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textContainer: {
    paddingBottom: 5,
  },
  titleText: {
    color: 'white',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  buttonDetails: {
    backgroundColor: 'blue',
    padding: 5,
    borderRadius: 5,
  },
  buttonDelete: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
    marginLeft: 5,
  },
  buttonText: {
    color: 'white',
  },
})

export default Task
