"use client"

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Home() {
  const [events, setEvents] = useState<any[]>([])

  // daftar petugas
  const petugasList = [
    "dr. Arum Ermi Wijayanti",
    "dr. Erry Kurniawan",
    "drg. Purba Pramana",
    "Iwan Riswandi, AMK",
    "Insana Prasetya, AMK",
    "Susilowati, A.Md.Kep",
    "Suminten, A.Md",
    "Cahyani Agustina Prihastuti, S.Tr.Keb",
    "Tri Murni, A.Md.Keb",
    "Siti Khotijah, S.Tr.Keb",
    "Lilian Adven CN, S.Tr.Keb",
    "Noor Syamsiah, S.Tr.Keb",
    "Hadrotul Ma'wa, S.Tr.Kes",
    "Yuniarti Parptiwi, AMAK",
    "Latiful Hakim, AMD",
    "Widiarto, SST",
    "Sahir, AMKL",
    "Setyo Hadiriyanto, A.Md",
    "Ade Doni Irawan, A.Md.Farm",
    "Tri Anggoro, S.M.",
    "Ria Wahyu Dewanti, S.Farm.Apt",
    "Siti Hidayati, S.Far.Apt",
    "Zelin Afika, SE",
    "Devta Virga Nirwana",
    "Muh Tozidaini",
    "Khasanatun Masruroh, S.Gz.",
    "Rina Prasetya, Amd. Keb.",
    "Kardiyono",
    "Rina Dwi Mawarti",
    "Dwi Tyas Wardani",
    "Sutriyanto",
    "Sunarta",
    "NINIK SRIWIJIASTUTI",
    "MUJIYANA",
    "MUJIMAN",
    "HARYANTA",
    "ANTO ARIYANTO",
    "ENIK MULYANI",
    "ERNI KUSRINI",
    "AMIRUDIN",
    "FEBRI EKO SUSANTI",
    "SUWANTI",
    "FUAD WARDANI",
    "MARJOKO"
  ]

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const { data } = await supabase.from('kegiatan').select('*')

    if (data) {
      setEvents(
        data.map((item) => ({
          title: `${item.nama_kegiatan}${item.penanggung_jawab ? " - " + item.penanggung_jawab : ""}`,
          date: item.tanggal,
        }))
      )
    }
  }

  async function handleDateClick(info: any) {

    const pilihan = prompt(
      "Pilih nomor petugas:\n\n" +
      petugasList.map((p, i) => `${i + 1}. ${p}`).join("\n")
    )

    if (!pilihan) return

    const namaPetugas = petugasList[Number(pilihan) - 1]

    if (!namaPetugas) {
      alert("Nomor tidak valid")
      return
    }

    const kegiatan = prompt("Nama kegiatan:")
    if (!kegiatan) return

    await supabase.from('kegiatan').insert({
      tanggal: info.dateStr,
      nama_kegiatan: kegiatan,
      penanggung_jawab: namaPetugas
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
