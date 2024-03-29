<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <Card class="calendar-card">
    <h2 id="header">Activity Calendar</h2>
    <VCalendar v-model:value="selectedDate" :attributes="attributes" />
  </Card>
</template>

<script setup lang="ts">
import Card from '@/components/Card.vue'
import { ref, onMounted, defineProps } from 'vue'
import { getAttemptsByUserId } from '@/api/attemptHooks'

interface Attempt {
  attemptTime: string
}

interface Event {
  title: string
  date: Date
}

const props = defineProps({
  id: { type: Number, required: true }
})

const selectedDate = ref<Date | null>(null)
const calendarEvents = ref<Event[]>([])
const attributes = ref<
  Array<{
    dates: Date
    content: string
    highlight: { color: string; fillMode: string }
    popover: { label: string; visibility: string; hideIndicator: boolean }
  }>
>([])

const fetchActivityData = async () => {
  try {
    const userId = props.id
    const attempts: Attempt[] = (await getAttemptsByUserId(userId)) as Attempt[]
    console.log('attempts:', attempts)

    // Map attempts to VCalendar event format
    const events: Event[] = attempts.map((attempt) => ({
      title: '✔',
      date: new Date(attempt.attemptTime) // Parse attemptTime into a Date object
    }))

    calendarEvents.value = events

    // Create a set of unique days with quiz attempts
    const uniqueDays = new Set(
      events.map((event) => {
        const date = new Date(event.date)
        return new Date(date.getFullYear(), date.getMonth(), date.getDate())
      })
    )

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

onMounted(async () => {
  await fetchActivityData()
  console.log('calendarEvents:', calendarEvents.value)
})
</script>

<style>
#header {
  font-size: 2rem;
  margin-bottom: 20px;
}
</style>
