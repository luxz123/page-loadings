"use client"

import type React from "react"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Eye, EyeOff, Mountain, Cloud, Check, X } from "lucide-react"

// Tipe data untuk form
interface FormData {
  namaBapak: string
  namaIbu: string
  namaAdik: string
  namaKakak: string
  nik: string
  email: string
  namaKamu: string
  kataSandi: string
}

// Tipe data untuk error validasi
interface FormErrors {
  namaBapak?: string
  namaIbu?: string
  namaAdik?: string
  namaKakak?: string
  nik?: string
  email?: string
  namaKamu?: string
  kataSandi?: string
}

export default function LoginPage() {
  // State untuk posisi mouse (parallax effect)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // State untuk form data
  const [formData, setFormData] = useState<FormData>({
    namaBapak: "",
    namaIbu: "",
    namaAdik: "",
    namaKakak: "",
    nik: "",
    email: "",
    namaKamu: "",
    kataSandi: "",
  })

  // State untuk error validasi
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showModal, setShowModal] = useState(false)

  // Handler untuk parallax effect berdasarkan posisi mouse
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      setMousePosition({ x, y })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Fungsi validasi email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Fungsi validasi NIK (16 digit angka)
  const validateNIK = (nik: string): boolean => {
    return /^\d{16}$/.test(nik)
  }

  // Fungsi validasi form
  const validateField = useCallback((name: string, value: string): string | undefined => {
    switch (name) {
      case "namaBapak":
        return value.trim() ? undefined : "Nama Bapak wajib diisi"
      case "namaIbu":
        return value.trim() ? undefined : "Nama Ibu wajib diisi"
      case "namaAdik":
        return value.trim() ? undefined : "Nama Adik wajib diisi"
      case "namaKakak":
        return value.trim() ? undefined : "Nama Kakak wajib diisi"
      case "nik":
        if (!value.trim()) return "NIK wajib diisi"
        if (!/^\d*$/.test(value)) return "NIK harus berupa angka"
        if (value.length !== 16) return "NIK harus tepat 16 digit"
        return undefined
      case "email":
        if (!value.trim()) return "Email wajib diisi"
        if (!validateEmail(value)) return "Format email tidak valid"
        return undefined
      case "namaKamu":
        return value.trim() ? undefined : "Nama Kamu wajib diisi"
      case "kataSandi":
        if (!value) return "Kata Sandi wajib diisi"
        if (value.length < 100) return `Kata Sandi minimal 100 karakter (${value.length}/100)`
        return undefined
      default:
        return undefined
    }
  }, [])

  // Handler untuk perubahan input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Khusus NIK, hanya izinkan angka
    if (name === "nik" && value && !/^\d*$/.test(value)) {
      return
    }

    setFormData((prev) => ({ ...prev, [name]: value }))

    // Validasi real-time jika field sudah pernah disentuh
    if (touched[name]) {
      const error = validateField(name, value)
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  // Handler untuk blur (field kehilangan fokus)
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  // Cek apakah form valid
  const isFormValid = useMemo(() => {
    const allFieldsFilled = Object.values(formData).every((v) => v.trim() !== "")
    const noErrors = Object.keys(formData).every((key) => !validateField(key, formData[key as keyof FormData]))
    return allFieldsFilled && noErrors
  }, [formData, validateField])

  // Hitung kekuatan kata sandi
  const passwordStrength = useMemo(() => {
    const length = formData.kataSandi.length
    if (length === 0) return { level: 0, label: "Belum diisi", color: "bg-muted" }
    if (length < 50) return { level: 1, label: "Sangat Lemah", color: "bg-red-500" }
    if (length < 100) return { level: 2, label: "Lemah", color: "bg-orange-500" }
    if (length < 150) return { level: 3, label: "Cukup Kuat", color: "bg-yellow-500" }
    return { level: 4, label: "Kuat", color: "bg-green-500" }
  }, [formData.kataSandi])

  // Handler untuk submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isFormValid) {
      setShowModal(true)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Background animasi gunung dan awan dengan parallax effect */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Langit dengan gradien */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-800" />

        {/* Bintang-bintang */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 40}%`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: Math.random() * 0.7 + 0.3,
              }}
            />
          ))}
        </div>

        {/* Awan bergerak - Layer belakang */}
        <div className="absolute w-full h-full">
          {[...Array(5)].map((_, i) => (
            <div
              key={`cloud-back-${i}`}
              className="absolute animate-cloud-slow"
              style={{
                left: `${i * 25 - 10}%`,
                top: `${15 + i * 5}%`,
                animationDelay: `${i * 8}s`,
                transform: `translateX(${mousePosition.x * 5}px)`,
              }}
            >
              <Cloud className="w-32 h-20 text-slate-700/30" fill="currentColor" />
            </div>
          ))}
        </div>

        {/* Gunung belakang dengan parallax */}
        <svg
          className="absolute bottom-0 w-full h-[60%] transition-transform duration-300 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 5}px)`,
          }}
          viewBox="0 0 1440 600"
          preserveAspectRatio="xMidYMax slice"
        >
          <defs>
            <linearGradient id="mountain-back" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
          </defs>
          {/* Gunung belakang */}
          <path
            d="M0,600 L0,400 L200,200 L400,350 L600,150 L800,300 L1000,100 L1200,250 L1440,180 L1440,600 Z"
            fill="url(#mountain-back)"
          />
        </svg>

        {/* Awan bergerak - Layer depan */}
        <div className="absolute w-full h-full">
          {[...Array(4)].map((_, i) => (
            <div
              key={`cloud-front-${i}`}
              className="absolute animate-cloud-fast"
              style={{
                left: `${i * 30 - 15}%`,
                top: `${25 + i * 8}%`,
                animationDelay: `${i * 6}s`,
                transform: `translateX(${mousePosition.x * 15}px)`,
              }}
            >
              <Cloud className="w-48 h-28 text-slate-600/40" fill="currentColor" />
            </div>
          ))}
        </div>

        {/* Gunung depan dengan parallax */}
        <svg
          className="absolute bottom-0 w-full h-[50%] transition-transform duration-200 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 10}px)`,
          }}
          viewBox="0 0 1440 500"
          preserveAspectRatio="xMidYMax slice"
        >
          <defs>
            <linearGradient id="mountain-front" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="50%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            {/* Salju di puncak gunung */}
            <linearGradient id="snow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f1f5f9" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
          </defs>
          {/* Gunung depan */}
          <path
            d="M0,500 L0,350 L150,250 L300,400 L450,200 L600,320 L750,150 L900,280 L1050,180 L1200,300 L1350,220 L1440,280 L1440,500 Z"
            fill="url(#mountain-front)"
          />
          {/* Puncak bersalju */}
          <path d="M450,200 L420,240 L480,240 Z" fill="url(#snow)" opacity="0.9" />
          <path d="M750,150 L710,200 L790,200 Z" fill="url(#snow)" opacity="0.9" />
          <path d="M1050,180 L1010,230 L1090,230 Z" fill="url(#snow)" opacity="0.9" />
        </svg>

        {/* Kabut di bawah */}
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-slate-900/80 to-transparent" />
      </div>

      {/* Form Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-md">
          {/* Card Form */}
          <div className="backdrop-blur-xl bg-slate-900/70 border border-slate-700/50 rounded-2xl shadow-2xl p-6 sm:p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 mb-4 shadow-lg shadow-cyan-500/25">
                <Mountain className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Selamat Datang</h1>
              <p className="text-slate-400 text-sm">Silakan lengkapi data diri Anda</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Nama Bapak */}
              <div>
                <label htmlFor="namaBapak" className="block text-sm font-medium text-slate-300 mb-1.5">
                  Nama Bapak <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="namaBapak"
                  name="namaBapak"
                  value={formData.namaBapak}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={!!errors.namaBapak}
                  aria-describedby={errors.namaBapak ? "namaBapak-error" : undefined}
                  className={`w-full px-4 py-2.5 bg-slate-800/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.namaBapak && touched.namaBapak
                      ? "border-red-500 focus:ring-red-500/50"
                      : "border-slate-600 focus:ring-cyan-500/50 focus:border-cyan-500"
                  }`}
                  placeholder="Masukkan nama bapak"
                />
                {errors.namaBapak && touched.namaBapak && (
                  <p id="namaBapak-error" className="mt-1 text-xs text-red-400 flex items-center gap-1" role="alert">
                    <X className="w-3 h-3" /> {errors.namaBapak}
                  </p>
                )}
              </div>

              {/* Nama Ibu */}
              <div>
                <label htmlFor="namaIbu" className="block text-sm font-medium text-slate-300 mb-1.5">
                  Nama Ibu <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="namaIbu"
                  name="namaIbu"
                  value={formData.namaIbu}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={!!errors.namaIbu}
                  aria-describedby={errors.namaIbu ? "namaIbu-error" : undefined}
                  className={`w-full px-4 py-2.5 bg-slate-800/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.namaIbu && touched.namaIbu
                      ? "border-red-500 focus:ring-red-500/50"
                      : "border-slate-600 focus:ring-cyan-500/50 focus:border-cyan-500"
                  }`}
                  placeholder="Masukkan nama ibu"
                />
                {errors.namaIbu && touched.namaIbu && (
                  <p id="namaIbu-error" className="mt-1 text-xs text-red-400 flex items-center gap-1" role="alert">
                    <X className="w-3 h-3" /> {errors.namaIbu}
                  </p>
                )}
              </div>

              {/* Nama Adik & Kakak dalam satu baris di desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nama Adik */}
                <div>
                  <label htmlFor="namaAdik" className="block text-sm font-medium text-slate-300 mb-1.5">
                    Nama Adik <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="namaAdik"
                    name="namaAdik"
                    value={formData.namaAdik}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={!!errors.namaAdik}
                    aria-describedby={errors.namaAdik ? "namaAdik-error" : undefined}
                    className={`w-full px-4 py-2.5 bg-slate-800/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                      errors.namaAdik && touched.namaAdik
                        ? "border-red-500 focus:ring-red-500/50"
                        : "border-slate-600 focus:ring-cyan-500/50 focus:border-cyan-500"
                    }`}
                    placeholder="Nama adik"
                  />
                  {errors.namaAdik && touched.namaAdik && (
                    <p id="namaAdik-error" className="mt-1 text-xs text-red-400 flex items-center gap-1" role="alert">
                      <X className="w-3 h-3" /> {errors.namaAdik}
                    </p>
                  )}
                </div>

                {/* Nama Kakak */}
                <div>
                  <label htmlFor="namaKakak" className="block text-sm font-medium text-slate-300 mb-1.5">
                    Nama Kakak <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="namaKakak"
                    name="namaKakak"
                    value={formData.namaKakak}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={!!errors.namaKakak}
                    aria-describedby={errors.namaKakak ? "namaKakak-error" : undefined}
                    className={`w-full px-4 py-2.5 bg-slate-800/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                      errors.namaKakak && touched.namaKakak
                        ? "border-red-500 focus:ring-red-500/50"
                        : "border-slate-600 focus:ring-cyan-500/50 focus:border-cyan-500"
                    }`}
                    placeholder="Nama kakak"
                  />
                  {errors.namaKakak && touched.namaKakak && (
                    <p id="namaKakak-error" className="mt-1 text-xs text-red-400 flex items-center gap-1" role="alert">
                      <X className="w-3 h-3" /> {errors.namaKakak}
                    </p>
                  )}
                </div>
              </div>

              {/* NIK */}
              <div>
                <label htmlFor="nik" className="block text-sm font-medium text-slate-300 mb-1.5">
                  NIK <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="nik"
                  name="nik"
                  value={formData.nik}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength={16}
                  inputMode="numeric"
                  aria-invalid={!!errors.nik}
                  aria-describedby={errors.nik ? "nik-error" : "nik-hint"}
                  className={`w-full px-4 py-2.5 bg-slate-800/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.nik && touched.nik
                      ? "border-red-500 focus:ring-red-500/50"
                      : "border-slate-600 focus:ring-cyan-500/50 focus:border-cyan-500"
                  }`}
                  placeholder="16 digit angka"
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.nik && touched.nik ? (
                    <p id="nik-error" className="text-xs text-red-400 flex items-center gap-1" role="alert">
                      <X className="w-3 h-3" /> {errors.nik}
                    </p>
                  ) : (
                    <p id="nik-hint" className="text-xs text-slate-500">
                      Nomor Induk Kependudukan
                    </p>
                  )}
                  <span className={`text-xs ${formData.nik.length === 16 ? "text-green-400" : "text-slate-500"}`}>
                    {formData.nik.length}/16
                  </span>
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={`w-full px-4 py-2.5 bg-slate-800/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.email && touched.email
                      ? "border-red-500 focus:ring-red-500/50"
                      : "border-slate-600 focus:ring-cyan-500/50 focus:border-cyan-500"
                  }`}
                  placeholder="contoh@email.com"
                />
                {errors.email && touched.email && (
                  <p id="email-error" className="mt-1 text-xs text-red-400 flex items-center gap-1" role="alert">
                    <X className="w-3 h-3" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Nama Kamu */}
              <div>
                <label htmlFor="namaKamu" className="block text-sm font-medium text-slate-300 mb-1.5">
                  Nama Kamu <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="namaKamu"
                  name="namaKamu"
                  value={formData.namaKamu}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={!!errors.namaKamu}
                  aria-describedby={errors.namaKamu ? "namaKamu-error" : undefined}
                  className={`w-full px-4 py-2.5 bg-slate-800/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.namaKamu && touched.namaKamu
                      ? "border-red-500 focus:ring-red-500/50"
                      : "border-slate-600 focus:ring-cyan-500/50 focus:border-cyan-500"
                  }`}
                  placeholder="Masukkan nama Anda"
                />
                {errors.namaKamu && touched.namaKamu && (
                  <p id="namaKamu-error" className="mt-1 text-xs text-red-400 flex items-center gap-1" role="alert">
                    <X className="w-3 h-3" /> {errors.namaKamu}
                  </p>
                )}
              </div>

              {/* Kata Sandi */}
              <div>
                <label htmlFor="kataSandi" className="block text-sm font-medium text-slate-300 mb-1.5">
                  Kata Sandi <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="kataSandi"
                    name="kataSandi"
                    value={formData.kataSandi}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={!!errors.kataSandi}
                    aria-describedby="kataSandi-hint"
                    className={`w-full px-4 py-2.5 pr-12 bg-slate-800/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                      errors.kataSandi && touched.kataSandi
                        ? "border-red-500 focus:ring-red-500/50"
                        : "border-slate-600 focus:ring-cyan-500/50 focus:border-cyan-500"
                    }`}
                    placeholder="Minimal 100 karakter"
                  />
                  {/* Tombol tampilkan/sembunyikan kata sandi */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Indikator kekuatan kata sandi */}
                <div className="mt-2 space-y-1.5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-all ${
                          passwordStrength.level >= level ? passwordStrength.color : "bg-slate-700"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <p id="kataSandi-hint" className="text-xs text-slate-400">
                      {passwordStrength.label}
                    </p>
                    <span
                      className={`text-xs ${formData.kataSandi.length >= 100 ? "text-green-400" : "text-slate-500"}`}
                    >
                      {formData.kataSandi.length}/100
                      {formData.kataSandi.length >= 100 && <Check className="inline w-3 h-3 ml-1" />}
                    </span>
                  </div>
                </div>
                {errors.kataSandi && touched.kataSandi && formData.kataSandi.length < 100 && (
                  <p className="mt-1 text-xs text-red-400 flex items-center gap-1" role="alert">
                    <X className="w-3 h-3" /> Kurang {100 - formData.kataSandi.length} karakter lagi
                  </p>
                )}
              </div>

              {/* Tombol Submit */}
              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 ${
                  isFormValid
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 cursor-pointer"
                    : "bg-slate-700 text-slate-400 cursor-not-allowed"
                }`}
              >
                {isFormValid ? "Daftar Sekarang" : "Lengkapi Semua Data"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Modal Konfirmasi */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in duration-300">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mb-4">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h2 id="modal-title" className="text-xl font-bold text-white">
                Pendaftaran Berhasil!
              </h2>
              <p className="text-slate-400 text-sm mt-1">Berikut ringkasan data Anda</p>
            </div>

            {/* Ringkasan Data (tanpa kata sandi) */}
            <div className="space-y-3 bg-slate-800/50 rounded-lg p-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Nama:</span>
                <span className="text-white font-medium">{formData.namaKamu}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Email:</span>
                <span className="text-white font-medium">{formData.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">NIK:</span>
                <span className="text-white font-medium">
                  {formData.nik.slice(0, 4)}****{formData.nik.slice(-4)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Nama Bapak:</span>
                <span className="text-white font-medium">{formData.namaBapak}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Nama Ibu:</span>
                <span className="text-white font-medium">{formData.namaIbu}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Nama Adik:</span>
                <span className="text-white font-medium">{formData.namaAdik}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Nama Kakak:</span>
                <span className="text-white font-medium">{formData.namaKakak}</span>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/25"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* CSS untuk animasi awan */}
      <style jsx>{`
        /* Animasi awan lambat untuk layer belakang */
        @keyframes cloud-slow {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(calc(100vw + 100%));
            opacity: 0;
          }
        }

        /* Animasi awan cepat untuk layer depan */
        @keyframes cloud-fast {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(calc(100vw + 100%));
            opacity: 0;
          }
        }

        .animate-cloud-slow {
          animation: cloud-slow 60s linear infinite;
        }

        .animate-cloud-fast {
          animation: cloud-fast 40s linear infinite;
        }
      `}</style>
    </div>
  )
}
