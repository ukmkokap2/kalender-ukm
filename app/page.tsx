"use client"

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Home() {
  const [events, setEvents] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState("")
  const [kegiatan, setKegiatan] = useState("")
  const [petugas, setPetugas] = useState("")
  const [search, setSearch] = useState("")

  const petugasList = [
    "dr. Arum Ermi Wijayanti","dr. Erry Kurniawan","drg. Purba Pramana",
    "Iwan Riswandi, AMK","Insana Prasetya, AMK","Susilowati, A.Md.Kep",
    "Suminten, A.Md","Cahyani Agustina Prihastuti, S.Tr.Keb",
    "Tri Murni, A.Md.Keb","Siti Khotijah, S.Tr.Keb","Lilian Adven CN, S.Tr.Keb",
    "Noor Syamsiah, S.Tr.Keb","Hadrotul Ma'wa, S.Tr.Kes","Yuniarti Parptiwi, AMAK",
    "Latiful Hakim, AMD","Widiarto, SST","Sahir, AMKL",
    "Setyo Hadiriyanto, A.Md","Ade Doni Irawan, A.Md.Farm",
    "Tri Anggoro, S.M.","Ria Wahyu Dewanti, S.Farm.Apt",
    "Siti Hidayati, S.Far.Apt","Zelin Afika, SE","Devta Virga Nirwana",
    "Muh Tozidaini","Khasanatun Masruroh, S.Gz.","Rina Prasetya, Amd. Keb.",
    "Kardiyono","Rina Dwi Mawarti","Dwi Tyas Wardani",
    "Sutriyanto","Sunarta","NINIK SRIWIJIASTUTI","MUJIYANA","MUJIMAN",
    "HARYANTA","ANTO ARIYANTO","ENIK MULYANI","ERNI KUSRINI",
    "AMIRUDIN","FEBRI EKO SUSANTI","SUWANTI","FUAD WARDANI","MARJOKO"
  ]

  const filteredPetugas = petugasList.filter(n =>
    n.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    const { data } = await supabase.from('kegiatan').select('*')

    if (data) {
      setEvents(
        data.map(item => ({
          title: `${item.nama_kegiatan} - ${item.penanggung_jawab}`,
          date: item.tanggal
        }))
      )
    }
  }

  function handleDateClick(info:any) {
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
      penanggung_jawab: petugas
    })

    setShowForm(false)
    setKegiatan("")
    setPetugas("")
    setSearch("")
    fetchData()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">

      {/* HEADER */}
      <div className="bg-white dark:bg-gray-900 shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between">
          <h1 className="text-xl font-bold text-blue-700 dark:text-blue-400">
            Sistem Kalender Kegiatan UKM
          </h1>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Puskesmas Kokap II
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-5">

          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            dateClick={handleDateClick}
            events={events}
            height="auto"
          />

        </div>
      </div>

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={()=>setShowForm(false)}
          />

          <div className="relative w-80 p-6 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/40 dark:border-gray-700 shadow-2xl animate-fadeIn">

            <h2 className="text-lg font-bold mb-3 text-blue-700 dark:text-blue-400">
              Tambah Kegiatan
            </h2>

            <p className="text-sm mb-3 text-gray-700 dark:text-gray-300">
              Tanggal: {selectedDate}
            </p>

            <input
              type="text"
              placeholder="Nama kegiatan"
              value={kegiatan}
              onChange={(e)=>setKegiatan(e.target.value)}
              className="w-full mb-3 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="text"
              placeholder="Cari petugas..."
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              className="w-full mb-2 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <div className="max-h-40 overflow-y-auto rounded-lg border border-gray-300 dark:border-gray-600 mb-2">
              {filteredPetugas.map((n,i)=>(
                <div
                  key={i}
                  onClick={()=>{
                    setPetugas(n)
                    setSearch(n)
                  }}
                  className={`px-3 py-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/40 ${petugas===n && "bg-blue-200 dark:bg-blue-800"}`}
                >
                  {n}
                </div>
              ))}
            </div>

            {petugas && (
              <p className="text-sm text-green-600 dark:text-green-400 mb-2">
                ✔ Dipilih: {petugas}
              </p>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={()=>setShowForm(false)}
                className="px-4 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:scale-105 transition"
              >
                Batal
              </button>

              <button
                onClick={simpanData}
                className="px-4 py-1 rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-md hover:shadow-lg hover:scale-105 transition"
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
