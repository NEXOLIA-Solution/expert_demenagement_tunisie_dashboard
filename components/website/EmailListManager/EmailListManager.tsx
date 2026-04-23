'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Trash2, RefreshCw, Mail, Plus, X } from 'lucide-react'

// Interface pour typage des emails
interface EmailEntry {
  _id: string
  email: string
  createdAt: string
  updatedAt: string
}

export default function EmailListManager() {
  const [emails, setEmails] = useState<EmailEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState('')

  // États pour le modal d'ajout
  const [showModal, setShowModal] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [modalError, setModalError] = useState('')

  const API_URL = process.env.NEXT_PUBLIC_API_BASE

  const fetchEmails = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await axios.get(`${API_URL}/email-list/api/all`)
      setEmails(response.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des emails')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmails()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet email ?')) return

    setDeleteLoading(id)
    setError('')
    setSuccessMessage('')
    try {
      await axios.delete(`${API_URL}/email-list/api/${id}`)
      setEmails(prev => prev.filter(email => email._id !== id))
      setSuccessMessage('Email supprimé avec succès')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression')
    } finally {
      setDeleteLoading(null)
    }
  }

  const handleAddEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setModalError('')
    setError('')
    setSuccessMessage('')

    try {
      await axios.post(`${API_URL}/email-list/api/register`, { email: newEmail })
      setShowModal(false)
      setNewEmail('')
      setSuccessMessage('Email ajouté avec succès')
      fetchEmails() // Rafraîchir la liste
    } catch (err: any) {
      setModalError(err.response?.data?.message || 'Erreur lors de l\'ajout')
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Mail className="w-6 h-6 text-blue-500" />
          Gestion des emails
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ajouter un email
          </button>
          <button
            onClick={fetchEmails}
            className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
            title="Rafraîchir"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      {/* Tableau */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Chargement...</div>
      ) : emails.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Aucun email enregistré</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'inscription
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {emails.map((entry) => (
                <tr key={entry._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {entry.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(entry.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button
                      onClick={() => handleDelete(entry._id)}
                      disabled={deleteLoading === entry._id}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Supprimer"
                    >
                      {deleteLoading === entry._id ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal d'ajout d'email */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-black opacity-50"
              onClick={() => setShowModal(false)}
            ></div>
            
            {/* Modal content */}
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Ajouter un email
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddEmail}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="exemple@domaine.com"
                  />
                </div>

                {modalError && (
                  <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                    {modalError}
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Ajout...' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}