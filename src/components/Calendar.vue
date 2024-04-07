<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <Card class="calendar-card">
    <div class="calendar-container">
      <div class="calendar-item">
        <h2 id="header">Activity Calendar</h2>
        <VCalendar v-model:value="selectedDate" :attributes="attributes" />
      </div>
      <div class="streak-info">
        <span class="streak-label">Current streak</span>
        <span class="fire-emoji">{{ streak }} 🔥</span>
      </div>
      <div class="timer-container">
        <span v-if="!isQuizCompletedToday"> Time until your streak ends: {{ countdown }} </span>
        <span v-if="!isQuizCompletedToday">
          Your streak will end if you don't complete a quiz today!
        </span>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import Card from '@/components/Card.vue'
import { ref, onMounted, defineProps } from 'vue'
import { getAttemptsByUserId } from '@/api/attemptHooks'
import { format, addDays } from 'date-fns'

interface Attempt {
  attemptTime: string
}

interface Event {
  title: string
  date: string // Change the type of 'date' to string
}

const props = defineProps({
  id: { type: Number, required: true }
})

const selectedDate = ref<Date | null>(null)
const calendarEvents = ref<Event[]>([])
const attributes = ref<
  Array<{
    dates: string
    content: string
    highlight: { color: string; fillMode: string }
    popover: { label: string; visibility: string; hideIndicator: boolean }
  }>
>([])
const streak = ref(0)
const countdown = ref('')
const isQuizCompletedToday = ref(false)


/**
 * Calculates the time until midnight in UTC.
 * @returns The time in milliseconds until midnight UTC.
 */
const calculateTimeUntilMidnightUTC = () => {
  const now = new Date()
  const midnightUTC = new Date(now)
  midnightUTC.setUTCHours(24, 0, 0, 0) // Set to midnight UTC

  const timeUntilMidnight = midnightUTC.getTime() - now.getTime()

  return timeUntilMidnight
}

/**
 * Updates the countdown timer until midnight UTC.
 */
const updateTimer = () => {
  const timeUntilMidnight = calculateTimeUntilMidnightUTC()

  const hours = Math.floor(timeUntilMidnight / (1000 * 60 * 60))
  const minutes = Math.floor((timeUntilMidnight % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeUntilMidnight % (1000 * 60)) / 1000)

  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`
  const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`

  countdown.value = `${hours}:${formattedMinutes}:${formattedSeconds}`
}

/**
 * Fetches activity data for the user based on the provided props.
 */
const fetchActivityData = async () => {
  try {
    const userId = props.id
    const attempts = await getAttemptsByUserId(userId, 100, 0)

    const events: Event[] = attempts.content.map((attempt: Attempt) => ({
      title: '✔',
      date: attempt.attemptTime // Use the attemptTime directly
    }))

    calendarEvents.value = events

    // Create a set of unique days with quiz attempts
    const uniqueDays = new Set(
      events.map((event) => {
        return format(new Date(event.date), 'yyyy-MM-dd') // Format the date using date-fns
      })
    ) 
    const todaysDate = format(new Date(), 'yyyy-MM-dd')
    let prevDay = todaysDate
    for (const day of Array.from(uniqueDays)) {
      if (day === prevDay) {
        streak.value += 1
        if (day === todaysDate) {
          isQuizCompletedToday.value = true
        }
        prevDay = format(addDays(new Date(day), -1), 'yyyy-MM-dd') // Move to the previous day
      }
    }

    // Convert unique days to attributes format
    attributes.value = Array.from(uniqueDays).map((day) => ({
      dates: day,
      content: 'white',
      highlight: {
        color: 'green',
        fillMode: 'outline'
      },
      popover: {
        label: 'You completed a quiz this day! Good job! 🎉',
        visibility: 'hover',
        hideIndicator: true
      }
    }))
  } catch (error) {
    console.error('Error fetching activity data:', error)
  }
}

updateTimer()
setInterval(updateTimer, 1000)

/**
 * Resets the timer daily to update the countdown and quiz completion status.
 */
const resetTimerDaily = () => {
  const timeUntilMidnight = calculateTimeUntilMidnightUTC()
  setTimeout(() => {
    updateTimer()
    isQuizCompletedToday.value = false
    resetTimerDaily()
  }, timeUntilMidnight - 5000)
}

resetTimerDaily()

onMounted(async () => {
  await fetchActivityData()
})
</script>

<style>
#header {
  font-size: 2rem;
  margin-bottom: 20px;
  text-align: center;
}

.calendar-container {
  display: flex;
  flex-direction: row;
  align-items: center; /* Align items vertically */
}

.calendar-item {
  margin-right: 20px;
}

.streak-info {
  display: grid;
  grid-template-rows: auto;
  justify-items: center;
  width: -webkit-fill-available;
}

.streak-label {
  font-size: 1.5rem;
}

.fire-emoji {
  font-size: 1.5rem;
}

.timer-container {
  display: grid;
  grid-template-rows: auto;
  font-size: 1.5rem;
  margin-left: 20px;
  width: -webkit-fill-available;
}
@media (max-width: 750px) {
  .calendar-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
  }
}
</style>
