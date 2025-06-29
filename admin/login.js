import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(
  'https://ubggdolaodsfctxrhcuo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViZ2dkb2xhb2RzZmN0eHJoY3VvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMDcwMjksImV4cCI6MjA2Njc4MzAyOX0.RU9NISUhf0MhiLS2kF_ISlnOhL_W2c90iPM0E2d5FaE'
)

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault()
  const formData = new FormData(e.target)
  const email = formData.get('email')
  const password = formData.get('password')

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    document.getElementById('error-msg').classList.remove('hidden')
  } else {
    window.location.href = "admin.html"
  }
})
