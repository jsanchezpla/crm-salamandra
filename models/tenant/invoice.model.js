/**
 * models/tenant/invoice.model.js
 *
 * Schema base para la colección `invoices` de cada tenant.
 * Facturas con líneas, IVA y estado de cobro.
 */

import mongoose from "mongoose";

export const invoiceSchema = new mongoose.Schema(
  {
    number: { type: String, required: true, trim: true }, // "2024-001"
    series: { type: String, default: "A" },

    // Emisor / receptor
    clientId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    clientSnapshot: {
      name: String,
      taxId: String,
      address: String,
    },

    // Tipo
    type: {
      type: String,
      enum: ["invoice", "proforma", "credit_note", "receipt"],
      default: "invoice",
    },

    // Fechas
    issueDate: { type: Date, required: true },
    dueDate: Date,
    paidAt: Date,

    // Líneas
    lines: [
      {
        description: { type: String, required: true },
        quantity: { type: Number, default: 1 },
        unitPrice: { type: Number, required: true },
        vatRate: { type: Number, default: 21 },  // %
        discount: { type: Number, default: 0 },  // %
        total: Number,  // calculado: quantity * unitPrice * (1 - discount/100)
      },
    ],

    // Totales
    subtotal: { type: Number, default: 0 },
    vatAmount: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    currency: { type: String, default: "EUR" },

    // Estado de cobro
    status: {
      type: String,
      enum: ["draft", "sent", "paid", "overdue", "cancelled"],
      default: "draft",
    },
    paymentMethod: String,
    notes: String,

    // Referencia al PDF generado
    pdfUrl: String,

    // Vinculación con proyecto o lead
    projectId: { type: mongoose.Schema.Types.ObjectId },
    leadId: { type: mongoose.Schema.Types.ObjectId },
  },
  { timestamps: true }
);

invoiceSchema.index({ clientId: 1, issueDate: -1 });
invoiceSchema.index({ status: 1 });
invoiceSchema.index({ number: 1 }, { unique: true });
