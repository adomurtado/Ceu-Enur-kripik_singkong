import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(
  'https://ubggdolaodsfctxrhcuo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViZ2dkb2xhb2RzZmN0eHJoY3VvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMDcwMjksImV4cCI6MjA2Njc4MzAyOX0.RU9NISUhf0MhiLS2kF_ISlnOhL_W2c90iPM0E2d5FaE'
)

supabase.auth.getSession().then(({ data: { session } }) => {
  if (!session) {
    window.location.href = "index.html"
  }
})

document.getElementById('logout-btn').addEventListener('click', async () => {
  await supabase.auth.signOut()
  window.location.href = "index.html"
})

async function fetchProduk() {
  const { data, error } = await supabase.from('produk').select('*').order('created_at')
  const list = document.getElementById('produk-list')
  list.innerHTML = ''
  data.forEach(p => {
    list.innerHTML += `<div class="bg-white p-4 shadow rounded relative">
      <button onclick="hapusProduk('${p.id}')" class="absolute top-2 right-2 text-red-500">🗑</button>
      <h2 class="font-bold">${p.nama}</h2>
      <p>${p.deskripsi}</p>
      <p class="text-sm">Rp${p.harga} • Stok: ${p.stok}</p>
      <img src="${p.gambar_url}" class="mt-2 w-full h-32 object-cover" />
    </div>`
  })
}

async function hapusProduk(id) {
  await supabase.from('produk').delete().eq('id', id)
  fetchProduk()
}

document.getElementById('produk-form').addEventListener('submit', async (e) => {
  e.preventDefault()
  const form = e.target
  const formData = new FormData(form)
  const file = formData.get('gambar')
  const filename = `${Date.now()}-${file.name}`

  const { error: uploadError } = await supabase.storage.from('produk').upload(filename, file, {
    cacheControl: '3600',
    upsert: false
  })
  if (uploadError) return alert('Upload gagal')

  const { data } = supabase.storage.from('produk').getPublicUrl(filename)
  const gambar_url = data.publicUrl

  const nama = formData.get('nama')
  const deskripsi = formData.get('deskripsi')
  const harga = parseInt(formData.get('harga'))
  const stok = parseInt(formData.get('stok'))

  await supabase.from('produk').insert([{ nama, deskripsi, harga, stok, gambar_url }])
  form.reset()
  fetchProduk()
})

window.hapusProduk = hapusProduk
fetchProduk()
