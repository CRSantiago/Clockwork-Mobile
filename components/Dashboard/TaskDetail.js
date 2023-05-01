import { useEffect, useContext, useCallback } from 'react'
import {
  Modal,
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  Dimensions,
  LogBox,
  Keyboard,
  ScrollView,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Picker } from '@react-native-picker/picker'
import DatePicker from 'react-native-datepicker'

import { getTask } from '../../api/getTask'
import { updateTask } from '../../api/updateTask'
import { AuthContext } from '../../store/auth-context'
import { useState } from 'react'

function TaskDetail({ visibility, taskid, onClose }) {
  //console.log(`task details: ${taskid}`)
  const authCtx = useContext(AuthContext)
  const [taskInfo, setTaskInfo] = useState(null)
  const [makeEditable, setMakeEditable] = useState(false)
  const [formData, setFormData] = useState({})
  const [selectedInterval, setSelectedInterval] = useState('none')
  const [selectedNotify, setSelectedNotify] = useState('none')
  const [updatedTask, setUpdatedTask] = useState(false)

  const getTaskCallback = useCallback(() => {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`'])
    getTask(taskid, authCtx.token)
      .then((response) => setTaskInfo(response.data[0]))
      .catch(console.log('could not resolve task'))
  }, [taskid, authCtx.token, updatedTask])

  useEffect(() => {
    getTaskCallback()
  }, [getTaskCallback, updatedTask])

  console.log(taskInfo)

  function handleMakeEditable() {
    setMakeEditable(true)
    setFormData({
      title: taskInfo.title,
      user: authCtx.userid,
      task_id: taskInfo._id,
      datestart: taskInfo.datestart,
      dateend: taskInfo.dateend,
      description: taskInfo.description,
      interval: {
        unit: taskInfo.interval.unit,
        value: taskInfo.interval.value === null ? 0 : taskInfo.interval.value,
      },
      notes: taskInfo.notes,
      notifyintensity: taskInfo.notifyintensity,
    })
  }

  function handleCloseDetails() {
    setMakeEditable(false)
    setFormData({})
    onClose()
  }

  function handleCancelEditable() {
    setMakeEditable(false)
  }

  const handleChange = useCallback(
    (value, name) => {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }))
    },
    [setFormData]
  )

  const handleNotifyChange = useCallback((value, name) => {
    setSelectedNotify(value)
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }, [])

  const handleDateChange = (value, name) => {
    const parsedDate = new Date(Date.parse(value))
    setFormData((prevState) => ({
      ...prevState,
      [name]: parsedDate,
    }))
  }

  const handleIntervalChange = (value, name) => {
    setSelectedInterval(value)
    setFormData((prevState) => ({
      ...prevState,
      interval: {
        ...prevState.interval,
        [name]: value,
      },
    }))
  }

  function handleSubmit() {
    console.log(formData)
    updateTask(formData, authCtx.token)
      .then((response) => {
        console.log(response)
        setUpdatedTask(true)
      })
      .catch((e) => console.log(e))
    setMakeEditable(false)
  }

  return (
    <Modal visible={visibility} animationType="slide">
      <KeyboardAwareScrollView
        style={{ flex: 1, backgroundColor: '#1b4965' }}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View style={styles.taskDetailContainer}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={styles.mainTitle}>Task Details</Text>
            {taskInfo && (
              <View>
                <View style={styles.textContainer}>
                  <Text style={styles.textTitle}>Title:</Text>
                  {!makeEditable && (
                    <Text style={styles.textStyles}>{taskInfo.title}</Text>
                  )}
                  {makeEditable && (
                    <TextInput
                      style={styles.input}
                      value={formData.title}
                      onChangeText={(value) => handleChange(value, 'title')}
                    />
                  )}
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.textTitle}>Description:</Text>
                  {!makeEditable && (
                    <Text style={styles.textStyles}>
                      {taskInfo.description === ''
                        ? 'no description'
                        : taskInfo.description}
                    </Text>
                  )}
                  {makeEditable && (
                    <TextInput
                      style={styles.input}
                      value={formData.description}
                      onChangeText={(value) =>
                        handleChange(value, 'description')
                      }
                    />
                  )}
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.textTitle}>Date Start:</Text>
                  {!makeEditable && (
                    <Text style={styles.textStyles}>
                      {new Date(taskInfo.datestart).toDateString()}
                    </Text>
                  )}
                  {makeEditable && (
                    <View>
                      <DatePicker
                        style={{
                          width: 200,
                          backgroundColor: 'white',
                        }}
                        date={
                          formData.datestart
                            ? new Date(formData.datestart).toISOString()
                            : new Date().toISOString()
                        }
                        mode="date"
                        placeholder="Select date"
                        format="YYYY-MM-DD"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                          datePicker: { backgroundColor: 'black' },
                        }}
                        onDateChange={(date) =>
                          handleDateChange(date, 'datestart')
                        }
                      />
                    </View>
                  )}
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.textTitle}>Date End:</Text>
                  {!makeEditable && (
                    <Text style={styles.textStyles}>
                      {new Date(taskInfo.dateend).toDateString()}
                    </Text>
                  )}
                  {makeEditable && (
                    <View>
                      <DatePicker
                        style={{
                          width: 200,
                          backgroundColor: 'white',
                        }}
                        date={
                          formData.datestart
                            ? new Date(formData.dateend).toISOString()
                            : new Date().toISOString()
                        }
                        mode="date"
                        placeholder="Select date"
                        format="YYYY-MM-DD"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                          datePicker: { backgroundColor: 'black' },
                        }}
                        onDateChange={(date) =>
                          handleDateChange(date, 'dateend')
                        }
                      />
                    </View>
                  )}
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.textTitle}>Interval:</Text>
                  {!makeEditable && (
                    <Text style={styles.textStyles}>
                      {taskInfo.interval.unit}
                    </Text>
                  )}
                  {makeEditable && (
                    <Picker
                      style={{
                        backgroundColor: '#fff',
                        color: '#000',
                        borderWidth: 1,
                        borderColor: '#ccc',
                        width: '100%',
                      }}
                      itemStyle={{ height: 30, paddingVertical: 20 }}
                      selectedValue={selectedInterval}
                      onValueChange={(value) =>
                        handleIntervalChange(value, 'unit')
                      }
                    >
                      <Picker.Item label="none" value="none" />
                      <Picker.Item label="Days" value="days" />
                      <Picker.Item label="Weeks" value="weeks" />
                      <Picker.Item label="Month" value="months" />
                    </Picker>
                  )}
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.textTitle}>Interval Value:</Text>
                  {!makeEditable && (
                    <Text style={styles.textStyles}>
                      {taskInfo.interval.value}
                    </Text>
                  )}
                  {makeEditable && (
                    <TextInput
                      style={styles.input}
                      value={formData.interval.value.toString()}
                      onChangeText={(value) =>
                        handleIntervalChange(value, 'value')
                      }
                      keyboardType="numeric"
                    />
                  )}
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.textTitle}>Notify Intensity:</Text>
                  {!makeEditable && (
                    <Text style={styles.textStyles}>
                      {taskInfo.notifyintensity}
                    </Text>
                  )}
                  {makeEditable && (
                    <Picker
                      style={{
                        backgroundColor: '#fff',
                        color: '#000',
                        borderWidth: 1,
                        borderColor: '#ccc',
                        width: '100%',
                      }}
                      itemStyle={{ height: 30, paddingVertical: 20 }}
                      selectedValue={selectedNotify}
                      onValueChange={(value) =>
                        handleNotifyChange(value, 'notifyintensity')
                      }
                    >
                      <Picker.Item label="none" value="none" />
                      <Picker.Item label="Mild" value="mild" />
                      <Picker.Item label="Moderate" value="moderate" />
                      <Picker.Item label="Urgent" value="urgent" />
                    </Picker>
                  )}
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.textTitle}>Notes:</Text>
                  {!makeEditable && (
                    <Text style={styles.textStyles}>
                      {taskInfo.notes === '' ? 'none' : taskInfo.notes}
                    </Text>
                  )}
                  {makeEditable && (
                    <TextInput
                      style={styles.input}
                      value={formData.notes}
                      onChangeText={(value) => handleChange(value, 'notes')}
                    />
                  )}
                </View>
              </View>
            )}
            <View>
              {makeEditable && (
                <View style={styles.buttonContainer}>
                  <Button
                    title="Submit"
                    onPress={handleSubmit}
                    color="yellow"
                  />
                  <Button
                    title="Cancel"
                    onPress={handleCancelEditable}
                    color="#E10600"
                  />
                </View>
              )}
              {!makeEditable && (
                <View style={styles.buttonContainer}>
                  <Button
                    title="Edit"
                    onPress={handleMakeEditable}
                    color="yellow"
                  />
                  <Button
                    title="Close"
                    onPress={handleCloseDetails}
                    color="#E10600"
                  />
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </KeyboardAwareScrollView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  taskDetailContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    flex: 1,
    backgroundColor: '#1b4965',
  },
  textContainer: {
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainTitle: {
    textAlign: 'center',
    fontSize: 18,
    color: 'white',
    marginBottom: 24,
  },
  textTitle: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    paddingBottom: 5,
  },
  textStyles: {
    textAlign: 'center',
    color: '#6acfe8',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    textAlign: 'center',
    backgroundColor: 'white',
    width: Dimensions.get('window').width * 0.5,
    padding: 5,
  },
})

export default TaskDetail
