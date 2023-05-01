import React, { useState, useContext, useEffect } from 'react'
import { View, Dimensions, Text, StyleSheet, ScrollView } from 'react-native'
import { Calendar } from 'react-native-calendars'
import { useIsFocused } from '@react-navigation/native'
import moment from 'moment'

import { AuthContext } from '../../store/auth-context'
import { setTasks } from '../../api/setTask'
import Task from './Task'

function CalendarContent() {
  const authCtx = useContext(AuthContext)
  const isFocused = useIsFocused()

  const [taskElements, setTaskElements] = useState([])
  const [markedDates, setMarkedDates] = useState({})
  const [selected, setSelected] = useState('')
  const [eventsLoaded, setEventsLoaded] = useState(false)

  //Current date variable
  var currentDate = new Date()
  var currentMonth = currentDate.getMonth()
  var currentYear = currentDate.getFullYear()
  const [currDate, setCurrDate] = useState(currentDate)
  const [currMonth, setCurrMonth] = useState(currentMonth)

  const { width, height } = Dimensions.get('window')
  const [selectedDate, setSelectedDate] = useState()
  const [key, setKey] = useState(0)

  const handleDayPress = (date) => {
    const prevSelected = selectedDate
      ? moment(selectedDate).format('YYYY-MM-DD')
      : ''
    setMarkedDates((prevState) => {
      return {
        ...prevState,
        [prevSelected]: { ...prevState[prevSelected], selected: false },
      }
    })

    // Mark the new selected date
    const newSelected = moment(date.dateString).format('YYYY-MM-DD')
    setMarkedDates((prevState) => {
      return {
        ...prevState,
        [newSelected]: { ...prevState[newSelected], selected: true },
      }
    })

    setSelectedDate(date.dateString)
  }

  useEffect(() => {
    if (isFocused) {
      setTasks(authCtx.userid, authCtx.token, currMonth)
        .then((response) => {
          console.log(response.data)
          //Task array
          const taskArray = []
          let foreignid
          let taskid
          let title
          let start
          let end
          const markedDatesObject = {}
          for (let i = 0; i < response.data.length; i++) {
            const task = response.data[i]
            taskid = task.Task
            foreignid = task._id
            //setting the start date to the current task date
            start = new Date(currentYear, currMonth, parseInt(task.day))
            //setting the end date to the current task date
            end = new Date(currentYear, currMonth, parseInt(task.day))

            title = task.title

            taskArray.push({
              foreignidid: foreignid,
              taskid: taskid,
              title: title,
              start: start,
              end: end,
            })

            const date = new Date() // Create a new Date object
            date.setDate(task.day) // Set the day value
            date.setMonth(currMonth) // Set the month value to May

            const dateString = moment(date, 'DD').format('YYYY-MM-DD')
            // console.log(currMonth)
            // console.log(dateString)

            markedDatesObject[dateString] = {
              marked: true,
              // Add any additional properties to be used in the markDates object here
            }
          }
          setMarkedDates(markedDatesObject)
          setTaskElements(taskArray)
          setEventsLoaded(true)
        })
        .catch((error) => {
          console.error(`error:${error}`)
        })
    }
  }, [eventsLoaded, currMonth, isFocused])

  //console.log(taskElements)
  //console.log(markedDates)

  const matchingTasks = taskElements.filter(
    (task) => moment(task.start).format('YYYY-MM-DD') === selectedDate
  )
  const taskMap = matchingTasks.map((task, index) => (
    <Task key={index} task={task} onDelete={handleLoadingAfterDelete} />
  ))

  // force a reload after task deletion to retrieve new calendar
  // passed as prop to Task component
  function handleLoadingAfterDelete() {
    setEventsLoaded(false)
  }
  console.log(currMonth)

  return (
    <View>
      <Calendar
        style={{
          width: width * 0.9,
          height: height * 0.5,
          paddingVertical: 10,
          borderRadius: 10,
        }}
        onDayPress={handleDayPress}
        markedDates={{
          ...markedDates,
          [selectedDate]: {
            selected: true,
            selectedColor: 'blue',
            // Add any additional properties to be used in the markDates object here
          },
        }}
        onMonthChange={(month) => {
          setCurrMonth(month.month - 1)
          setSelected('')
        }}
        key={key}
        initialDate={new Date().setMonth(currMonth)}
      />
      {selectedDate ? (
        <ScrollView
          style={styles.dayContainer}
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View style={{ flexGrow: 1 }}>
            <Text style={styles.dayText}>Task for {selectedDate}</Text>
            {taskMap}
          </View>
        </ScrollView>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  dayContainer: {
    paddingTop: 12,
    paddingBottom: 24,
    marginBottom: 24,
    marginTop: 24,
    backgroundColor: 'white',
    width: Dimensions.get('window').width * 0.9,
    borderRadius: 10,
  },
  dayText: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom: 12,
    color: '#333',
    textAlign: 'center',
  },
  selected: {
    backgroundColor: '#6e3b6e',
    borderRadius: 18,
  },
  selectedDay: {
    backgroundColor: '#6e3b6e',
    borderRadius: 18,
  },
})

export default CalendarContent
