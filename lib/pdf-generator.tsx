import type { Invoice } from "./types"

export function generateInvoicePDF(invoice: Invoice) {
  // Créer un nouveau document
  const doc = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Facture ${invoice.invoiceNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
    .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 3px solid #2563eb; padding-bottom: 20px; }
    .company { font-size: 24px; font-weight: bold; color: #2563eb; }
    .invoice-number { font-size: 18px; color: #666; }
    .section { margin-bottom: 30px; }
    .section-title { font-size: 14px; font-weight: bold; color: #666; margin-bottom: 10px; }
    .client-info { background: #f8f9fa; padding: 15px; border-radius: 8px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #2563eb; color: white; padding: 12px; text-align: left; }
    td { padding: 10px; border-bottom: 1px solid #ddd; }
    .text-right { text-align: right; }
    .totals { margin-left: auto; width: 300px; margin-top: 20px; }
    .totals-row { display: flex; justify-content: space-between; padding: 8px 0; }
    .total-final { font-size: 18px; font-weight: bold; border-top: 2px solid #333; padding-top: 10px; margin-top: 10px; }
    .signature-section { margin-top: 80px; display: flex; justify-content: space-between; }
    .signature-box { width: 45%; }
    .signature-line { border-top: 1px solid #333; margin-top: 60px; padding-top: 5px; text-align: center; }
    .stamp-box { border: 2px dashed #999; padding: 40px; text-align: center; color: #999; margin-top: 20px; }
    .notes { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="company">DéménaPro</div>
      <div>123 Rue du Commerce</div>
      <div>75001 Paris, France</div>
      <div>Tél: 01 23 45 67 89</div>
      <div>Email: contact@demenapro.fr</div>
    </div>
    <div style="text-align: right;">
      <div class="invoice-number">FACTURE</div>
      <div class="invoice-number">${invoice.invoiceNumber}</div>
      <div style="margin-top: 20px;">
        <div>Date: ${new Date(invoice.date).toLocaleDateString("fr-FR")}</div>
        <div>Échéance: ${new Date(invoice.dueDate).toLocaleDateString("fr-FR")}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">CLIENT</div>
    <div class="client-info">
      <div style="font-weight: bold; font-size: 16px;">${invoice.clientName}</div>
      <div>${invoice.clientEmail}</div>
    </div>
  </div>

  <div class="section">
    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th class="text-right">Quantité</th>
          <th class="text-right">Prix unitaire</th>
          <th class="text-right">Total HT</th>
        </tr>
      </thead>
      <tbody>
        ${invoice.items
          .map(
            (item) => `
          <tr>
            <td>${item.description}</td>
            <td class="text-right">${item.quantity}</td>
            <td class="text-right">${item.unitPrice.toLocaleString("fr-FR")} €</td>
            <td class="text-right">${item.total.toLocaleString("fr-FR")} €</td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-row">
        <span>Sous-total HT:</span>
        <span>${invoice.subtotal.toLocaleString("fr-FR")} €</span>
      </div>
      <div class="totals-row">
        <span>TVA (20%):</span>
        <span>${invoice.tax.toLocaleString("fr-FR")} €</span>
      </div>
      <div class="totals-row total-final">
        <span>Total TTC:</span>
        <span>${invoice.total.toLocaleString("fr-FR")} €</span>
      </div>
    </div>
  </div>

  ${invoice.notes ? `<div class="notes"><strong>Notes:</strong> ${invoice.notes}</div>` : ""}

  <div class="signature-section">
    <div class="signature-box">
      <div style="font-weight: bold; margin-bottom: 10px;">Signature du client</div>
      <div class="signature-line">Signature</div>
    </div>
    <div class="signature-box">
      <div style="font-weight: bold; margin-bottom: 10px;">Cachet de l'entreprise</div>
      <div class="stamp-box">CACHET ÉLECTRONIQUE<br/>DéménaPro</div>
    </div>
  </div>
</body>
</html>
`

  // Créer un blob et télécharger
  const blob = new Blob([doc], { type: "text/html" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `facture-${invoice.invoiceNumber}.html`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
