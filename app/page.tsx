"use client"

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Home() {
  const [events, setEvents] = useState<any[]>([])
  const [selectedDate, setSelectedDate] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [kegiatan, setKegiatan] = useState("")
  const [petugas, setPetugas] = useState("")

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
          title: `${item.nama_kegiatan} - ${item.penanggung_jawab}`,
          date: item.tanggal,
        }))
      )
    }
  }

  function handleDateClick(info: any) {
    setSelectedDate(info.dateStr)
    setShowForm(true)
  }

  async function simpanData() {
    if (!kegiatan || !petugas) {
      alert("Lengkapi data!")
      return
    }

    await supabase.from('kegiatan').insert({
      tanggal: selectedDate,
      nama_kegiatan: kegiatan,
      penanggung_jawab: petugas,
    })

    setShowForm(false)
    setKegiatan("")
    setPetugas("")
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

      {/* FORM POPUP */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-80">
            <h2 className="font-bold text-lg mb-3 text-blue-700">
              Tambah Kegiatan
            </h2>

            <p className="text-sm mb-2">Tanggal: {selectedDate}</p>

            <input
              type="text"
              placeholder="Nama kegiatan"
              className="w-full border p-2 rounded mb-3"
              value={kegiatan}
              onChange={(e) => setKegiatan(e.target.value)}
            />

            <select
              className="w-full border p-2 rounded mb-4"
              value={petugas}
              onChange={(e) => setPetugas(e.target.value)}
            >
              <option value="">Pilih Petugas</option>
              {petugasList.map((p, i) => (
                <option key={i} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Batal
              </button>

              <button
                onClick={simpanData}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
