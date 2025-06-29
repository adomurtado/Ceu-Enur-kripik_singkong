import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://ubggdolaodsfctxrhcuo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViZ2dkb2xhb2RzZmN0eHJoY3VvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMDcwMjksImV4cCI6MjA2Njc4MzAyOX0.RU9NISUhf0MhiLS2kF_ISlnOhL_W2c90iPM0E2d5FaE'
const supabase = createClient(supabaseUrl, supabaseKey)

async function fetchProduk() {
  const { data, error } = await supabase.from('produk').select('*')
  const list = document.getElementById('produk-list')
  const select = document.querySelector('select[name="produk_id"]')
  if (error) return console.error(error)
  list.innerHTML = ''
  data.forEach(item => {
    list.innerHTML += `<div class='border p-2 rounded bg-white shadow'>
      <img src="${item.gambar_url}" class="w-full h-32 object-cover mb-2" />
      <h3 class="font-bold">${item.nama}</h3>
      <p>Rp${item.harga}</p>
    </div>`
    select.innerHTML += `<option value="${item.id}">${item.nama}</option>`
  })
}

document.getElementById('order-form').addEventListener('submit', async (e) => {
  e.preventDefault()
  const form = e.target
  const { nama, alamat, kontak, produk_id, jumlah, catatan } = Object.fromEntries(new FormData(form))
  const { error } = await supabase.from('pemesanan').insert([{ nama_pemesan: nama, alamat, kontak, produk_id, jumlah, catatan }])
  document.getElementById('status').textContent = error ? 'Gagal mengirim pesanan' : 'Pesanan berhasil dikirim!'
  if (!error) form.reset()
})

async function fetchTestimoni() {
  const { data, error } = await supabase.from('testimoni').select('*').order('waktu', { ascending: false })
  const list = document.getElementById('testimoni-list')
  if (error) return console.error(error)
  data.forEach(t => {
    list.innerHTML += `<div class='p-2 bg-white rounded shadow'>
      <p class='italic'>"${t.komentar}"</p>
      <p class='text-sm mt-1 text-gray-600'>- ${t.nama}, ⭐ ${t.rating}</p>
    </div>`
  })
}

fetchProduk()
fetchTestimoni()
