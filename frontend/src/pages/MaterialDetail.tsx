import { ArrowLeft, Download, FileText } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { AppShell } from '../components/AppShell'
import { materialService } from '../features/materials/services'
import { getApiMessage } from '../api/client'
import type { Material } from '../types/api'
import { useAuthStore } from '../store/auth'
export function MaterialDetail() { const { id } = useParams(); const [material, setMaterial] = useState<Material | null>(null); const [error, setError] = useState(''); const user = useAuthStore((s) => s.user); const navigate = useNavigate(); useEffect(() => { if (id) void materialService.detail(Number(id)).then(setMaterial).catch((e: unknown) => setError(getApiMessage(e, 'This material could not be found.'))) }, [id]); return <AppShell><main className="mx-auto max-w-3xl px-5 py-14 lg:px-8">{error ? <div className="rounded-2xl bg-coral/10 p-8 text-coral">{error}</div> : !material ? <div className="h-80 animate-pulse rounded-3xl bg-ink/10" /> : <article className="rounded-3xl border border-ink/10 bg-paper p-7 shadow-soft sm:p-12"><Link to="/" className="mb-12 inline-flex items-center gap-2 text-sm font-bold text-ink/55"><ArrowLeft size={16} /> Back to materials</Link><div className="grid h-16 w-16 place-items-center rounded-2xl bg-gold/15 text-gold"><FileText size={28} /></div><p className="mt-9 text-sm font-bold uppercase tracking-wider text-coral">{material.course_code}</p><h1 className="mt-2 font-display text-5xl leading-tight">{material.title}</h1><p className="mt-6 max-w-xl leading-7 text-ink/65">{material.description || 'No description was added for this material.'}</p><div className="mt-10 flex flex-wrap gap-3"><button 
onClick={async () => {
  if (!user) {
    navigate('/login')
    return
  }

  const blob = await materialService.download(material.id)

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = material.title
  link.click()

  URL.revokeObjectURL(url)
}} className="flex items-center gap-2 rounded-xl bg-coral px-5 py-3 font-bold text-white hover:bg-ink"><Download size={18} /> Download file</button><span className="rounded-xl bg-cream px-5 py-3 text-sm text-ink/60">Added {new Date(material.created_at).toLocaleDateString()}</span></div></article>}</main></AppShell> }
