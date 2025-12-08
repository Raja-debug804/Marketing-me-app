import React from 'react'

interface FormFieldProps {
  label: string
  helper?: string
  error?: string
  required?: boolean
  children: React.ReactNode
}

export default function FormField({ label, helper, error, required, children }: FormFieldProps) {
  return (
    <div className="form-field">
      <label className="form-label">
        {label}
        {required && <span style={{ color: '#dc2626' }}> *</span>}
      </label>
      {children}
      {helper && <div className="form-helper">{helper}</div>}
      {error && <div className="form-helper" style={{ color: '#dc2626' }}>{error}</div>}
    </div>
  )
}
