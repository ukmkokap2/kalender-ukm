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
  const [searchPetugas, setSearchPetugas] = useState("")

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

  const filteredPetugas = petugasList.filter(p =>
    p.toLowerCase().includes(searchPetugas.toLowerCase())
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
    setSearchPetugas("")
    fetchData()
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-400">
        Kalender Kegiatan UKM
      </h1>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        events={events}
      />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          
          {/* overlay blur */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={() => setShowForm(false)}
          />

          {/* GLASS MODAL */}
          <div className="
            relative w-80 p-6 rounded-2xl
            bg-white/80 dark:bg-gray-900/80
            backdrop-blur-xl
            border border-white/40 dark:border-gray-700
            shadow-2xl
            animate-fadeIn
          ">

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
              className="
                w-full mb-3 p-2 rounded-lg
                border border-gray-300 dark:border-gray-600
                bg-white dark:bg-gray-800
                text-gray-800 dark:text-white
                placeholder-gray-400
                focus:ring-2 focus:ring-blue-500 outline-none
              "
            />

            {/* SEARCH */}
            <input
              type="text"
              placeholder="Cari petugas..."
              value={searchPetugas}
              onChange={(e)=>setSearchPetugas(e.target.value)}
              className="
                w-full mb-2 p-2 rounded-lg
                border border-gray-300 dark:border-gray-600
                bg-white dark:bg-gray-800
                text-gray-800 dark:text-white
                placeholder-gray-400
                focus:ring-2 focus:ring-blue-500 outline-none
              "
            />

            <div className="max-h-40 overflow-y-auto rounded-lg border border-gray-300 dark:border-gray-600 mb-2">
              {filteredPetugas.map((p,i)=>(
                <div
                  key={i}
                  onClick={()=>{
                    setPetugas(p)
                    setSearchPetugas(p)
                  }}
                  className={`
                    px-3 py-2 cursor-pointer
                    text-gray-800 dark:text-gray-200
                    hover:bg-blue-100 dark:hover:bg-blue-900/40
                    ${petugas===p && "bg-blue-200 dark:bg-blue-800"}
                  `}
                >
                  {p}
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
                className="
                  px-4 py-1 rounded-lg
                  bg-gray-200 dark:bg-gray-700
                  text-gray-700 dark:text-gray-200
                  hover:scale-105 transition
                "
              >
                Batal
              </button>

              <button
                onClick={simpanData}
                className="
                  px-4 py-1 rounded-lg text-white
                  bg-gradient-to-r from-blue-600 to-blue-500
                  hover:from-blue-700 hover:to-blue-600
                  shadow-md hover:shadow-lg
                  hover:scale-105 transition
                "
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
