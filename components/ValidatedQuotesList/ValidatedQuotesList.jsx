import React, { useState, useEffect } from 'react';

const ValidatedQuotesList = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [invoiceLoading, setInvoiceLoading] = useState({}); // État de chargement par devis
  const [notification, setNotification] = useState({ message: '', type: '' });

  useEffect(() => {
    const fetchValidatedQuotes = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/quote/api/validated`);
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && Array.isArray(data.quotes)) {
          setQuotes(data.quotes);
        } else {
          throw new Error('Format de réponse inattendu');
        }
      } catch (err) {
        setError(err.message);
        console.error('Erreur lors de la récupération des devis :', err);
      } finally {
        setLoading(false);
      }
    };

    fetchValidatedQuotes();
  }, []);

  const handleInitializeInvoice = async (quoteId) => {
    // Confirmation avant action
    if (!window.confirm('Voulez-vous initialiser une facture pour ce devis ?')) return;

    setInvoiceLoading(prev => ({ ...prev, [quoteId]: true }));
    setNotification({ message: '', type: '' });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/facture/api/${quoteId}`, {
        method: 'POST', // Ou GET selon votre API (POST recommandé pour création)
        headers: {
          'Content-Type': 'application/json',
        },
        // Si besoin d'envoyer des données supplémentaires :
        // body: JSON.stringify({ ... })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erreur HTTP ${response.status}`);
      }

      const result = await response.json();
      setNotification({
        message: `Facture initialisée avec succès pour le devis ${quoteId}`,
        type: 'success'
      });
      // Optionnel : rafraîchir la liste ou rediriger
      // setTimeout(() => setNotification({ message: '', type: '' }), 5000);
    } catch (err) {
      console.error('Erreur lors de l\'initialisation de la facture :', err);
      setNotification({
        message: `Erreur : ${err.message}`,
        type: 'error'
      });
    } finally {
      setInvoiceLoading(prev => ({ ...prev, [quoteId]: false }));
    }
  };

  if (loading) {
    return <div className="loading">📦 Chargement des devis validés...</div>;
  }

  if (error) {
    return <div className="error">⚠️ Erreur : {error}</div>;
  }

  if (quotes.length === 0) {
    return <div className="no-data">✅ Aucun devis validé trouvé.</div>;
  }

  return (
    <div className="validated-quotes-container">
      <div className="header">
        <h2>📄 Devis validés <span className="badge">{quotes.length}</span></h2>
        {notification.message && (
          <div className={`toast ${notification.type}`}>
            {notification.message}
          </div>
        )}
      </div>

      <div className="table-wrapper">
        <table className="quotes-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Type déménagement</th>
              <th>Prix HT</th>
              <th>Prix TTC</th>
              <th>Date devis</th>
              <th>Date début</th>
              <th>Commentaire admin</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((quote) => (
              <tr key={quote._id}>
                <td data-label="Client">{quote.firstName} {quote.lastName}</td>
                <td data-label="Email">{quote.email}</td>
                <td data-label="Téléphone">{quote.phone}</td>
                <td data-label="Type déménagement">
                  <span className="move-type">{quote.moveType}</span>
                </td>
                <td data-label="Prix HT">{parseFloat(quote.priceHT).toFixed(2)} dt</td>
                <td data-label="Prix TTC">{parseFloat(quote.priceTTC).toFixed(2)} dt</td>
                <td data-label="Date devis">{new Date(quote.quoteDate).toLocaleDateString()}</td>
                <td data-label="Date début">{new Date(quote.moveStartDate).toLocaleDateString()}</td>
                <td data-label="Commentaire admin">{quote.adminComment || '-'}</td>
                <td data-label="Action">

                  {quote.isFactured?"Facture Initialiser":<button
                    className="invoice-btn"
                    onClick={() => handleInitializeInvoice(quote._id)}
                    disabled={invoiceLoading[quote._id]}
                  >
                    {invoiceLoading[quote._id] ? (
                      <>⏳ Initialisation...</>
                    ) : (
                      <>    🧾 Initialiser facture</>
                    )}
                  </button>}

                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .validated-quotes-container {
          padding: 24px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background: #f8fafc;
          min-height: 100vh;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }

        h2 {
          color: #0f172a;
          font-weight: 600;
          font-size: 1.8rem;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .badge {
          background: #3b82f6;
          color: white;
          font-size: 0.9rem;
          font-weight: 500;
          padding: 4px 10px;
          border-radius: 40px;
        }

        .toast {
          padding: 12px 20px;
          border-radius: 12px;
          font-weight: 500;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          animation: slideIn 0.3s ease;
        }

        .toast.success {
          background: #dcfce7;
          color: #166534;
          border-left: 5px solid #22c55e;
        }

        .toast.error {
          background: #fee2e2;
          color: #991b1b;
          border-left: 5px solid #ef4444;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .table-wrapper {
          overflow-x: auto;
          border-radius: 20px;
          background: white;
          box-shadow: 0 8px 20px rgba(0,0,0,0.05);
        }

        .quotes-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }

        .quotes-table th {
          background: #f1f5f9;
          color: #1e293b;
          font-weight: 600;
          padding: 16px 12px;
          border-bottom: 2px solid #e2e8f0;
          text-align: left;
        }

        .quotes-table td {
          padding: 14px 12px;
          border-bottom: 1px solid #e2e8f0;
          color: #334155;
        }

        .quotes-table tr:hover td {
          background-color: #f8fafc;
        }

        .move-type {
          background: #e0f2fe;
          color: #0369a1;
          padding: 4px 10px;
          border-radius: 30px;
          font-size: 0.8rem;
          font-weight: 500;
          display: inline-block;
        }

        .invoice-btn {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border: none;
          color: white;
          padding: 8px 16px;
          border-radius: 40px;
          font-weight: 500;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }

        .invoice-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          transform: translateY(-1px);
          box-shadow: 0 6px 14px rgba(37, 99, 235, 0.3);
        }

        .invoice-btn:active:not(:disabled) {
          transform: translateY(1px);
        }

        .invoice-btn:disabled {
          background: #94a3b8;
          cursor: not-allowed;
          opacity: 0.7;
        }

        /* Responsive : transformation en cartes sur petits écrans */
        @media (max-width: 768px) {
          .validated-quotes-container {
            padding: 16px;
          }

          .quotes-table thead {
            display: none;
          }

          .quotes-table,
          .quotes-table tbody,
          .quotes-table tr,
          .quotes-table td {
            display: block;
            width: 100%;
          }

          .quotes-table tr {
            margin-bottom: 20px;
            background: white;
            border-radius: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            padding: 12px;
          }

          .quotes-table td {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 8px;
            border-bottom: 1px solid #e2e8f0;
            text-align: right;
          }

          .quotes-table td::before {
            content: attr(data-label);
            font-weight: 600;
            color: #0f172a;
            text-align: left;
            flex: 1;
          }

          .quotes-table td:last-child {
            border-bottom: none;
            justify-content: flex-end;
            gap: 12px;
          }

          .invoice-btn {
            width: auto;
          }
        }

        .loading, .error, .no-data {
          padding: 40px;
          text-align: center;
          font-size: 1.1rem;
          background: white;
          border-radius: 24px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          margin: 20px;
        }

        .error {
          color: #dc2626;
          background: #fef2f2;
        }

        .loading {
          color: #3b82f6;
        }

        .no-data {
          color: #475569;
        }
      `}</style>
    </div>
  );
};

export default ValidatedQuotesList;