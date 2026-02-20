"use client"

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function Home() {
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const { data } = await supabase.from('kegiatan').select('*')
    if (data) {
      setEvents(
        data.map(item => ({
          title: item.nama_kegiatan,
          date: item.tanggal
        }))
      )
    }
  }

  async function handleDateClick(info:any) {
    const nama = prompt("Nama kegiatan:")
    if (!nama) return

    await supabase.from('kegiatan').insert({
      tanggal: info.dateStr,
      nama_kegiatan: nama
    })

    fetchData()
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">
        Kalender Kegiatan UKM
      </h1>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        events={events}
      />
    </div>
  )
}