"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";

// INTERFACES (No changes)
export interface InvoiceItem {
  sl: number;
  description: string;
  price: string;
  qty: number;
  total: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  customer: {
    name: string;
    address: string;
    phone?: string;
    email?: string;
  };
  contact: {
    phone: string;
    address: string;
    website: string;
  };
  items: InvoiceItem[];
  subTotal: number | string;
  DeliveryCharge: number;
  totalAmount: string;
  paymentMethod: string;
  footerMessage: string;
  companyTagline: string;
}

// --- FONT REGISTRATION FIXED ---

const InvoicePDF = ({ invoice }: { invoice: InvoiceData }) => {
  // Construct the base URL for local assets
  // This ensures it works on both development (localhost) and production
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

  // ✅ Registering local fonts with absolute paths
  Font.register({
    family: "Hind Siliguri",
    fonts: [
      { src: `${baseUrl}/fonts/HindSiliguri-Regular.ttf`, fontWeight: 400 },
      { src: `${baseUrl}/fonts/HindSiliguri-Medium.ttf`, fontWeight: 500 },
      { src: `${baseUrl}/fonts/HindSiliguri-Bold.ttf`, fontWeight: 700 },
    ],
  });

  // STYLES (No changes needed here, as the fontFamily is already set)
  const styles = StyleSheet.create({
    page: {
      backgroundColor: "#F3F4F6",
      padding: 30,
      fontFamily: "Hind Siliguri", // This now correctly uses the local font
    },
    container: {
      backgroundColor: "#FFFFFF",
      padding: 30,
      flex: 1,
    },
    // ... all other styles remain the same
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      borderBottomWidth: 1,
      borderBottomColor: "#E5E7EB",
      paddingBottom: 20,
      marginBottom: 20,
    },
    headerText: {
      color: "#111827",
    },
    invoiceTitle: {
      fontSize: 28,
      fontWeight: 700,
    },
    companyTagline: {
      fontSize: 10,
      color: "#6B7280",
    },
    logo: {
      width: 120,
      height: "auto",
    },
    detailsSection: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 30,
    },
    detailBlock: {
      maxWidth: "50%",
    },
    detailLabel: {
      fontSize: 10,
      fontWeight: 500,
      color: "#4B5563",
    },
    customerName: {
      fontSize: 14,
      fontWeight: 700,
      color: "#1F2937",
      marginBottom: 4,
    },
    customerInfo: {
      fontSize: 10,
      color: "#4B5563",
    },
    invoiceInfo: {
      textAlign: "right",
    },
    infoValue: {
      fontSize: 10,
      color: "#1F2937",
      fontWeight: 500,
      marginBottom: 8,
    },
    table: {
      width: "100%",
    },
    tableHeader: {
      flexDirection: "row",
      backgroundColor: "#F9FAFB",
      borderBottomWidth: 1,
      borderBottomColor: "#E5E7EB",
      padding: 8,
    },
    tableHeaderCell: {
      fontSize: 9,
      fontWeight: 700,
      color: "#4B5563",
      textTransform: "uppercase",
    },
    tableRow: {
      flexDirection: "row",
      padding: 8,
      borderBottomWidth: 1,
      borderBottomColor: "#F3F4F6",
    },
    tableCell: {
      fontSize: 10,
      color: "#374151",
    },
    summaryContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginTop: 20,
    },
    totals: {
      width: "45%",
    },
    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 3,
    },
    totalLabel: {
      fontSize: 10,
      color: "#4B5563",
    },
    totalValue: {
      fontSize: 10,
      fontWeight: 500,
      color: "#1F2937",
    },
    divider: {
      borderTopWidth: 1,
      borderTopColor: "#E5E7EB",
      marginVertical: 4,
    },
    grandTotalLabel: {
      fontSize: 14,
      fontWeight: 700,
      color: "#111827",
    },
    footer: {
      position: "absolute",
      bottom: 30,
      left: 30,
      right: 30,
      borderTopWidth: 1,
      borderTopColor: "#E5E7EB",
      paddingTop: 10,
      textAlign: "center",
    },
    footerText: {
      fontSize: 9,
      color: "#6B7280",
    },
  });

  const logoUrl = `${baseUrl}/logo.png`;

  return (
    <Document
      author="Future com"
      title={`Invoice #${invoice.invoiceNumber}`}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* All the View/Text components below this line are unchanged */}
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.invoiceTitle}>Invoice</Text>
              <Text style={styles.companyTagline}>
                {invoice.companyTagline}
              </Text>
            </View>
            <Image src={logoUrl} style={styles.logo} />
          </View>

          <View style={styles.detailsSection}>
            <View style={styles.detailBlock}>
              <Text style={styles.detailLabel}>Billed To</Text>
              <Text style={styles.customerName}>{invoice.customer.name}</Text>
              <Text style={styles.customerInfo}>
                {invoice.customer.address}
              </Text>
              {invoice.customer.phone && (
                <Text style={styles.customerInfo}>
                  {invoice.customer.phone}
                </Text>
              )}
              {invoice.customer.email && (
                <Text style={styles.customerInfo}>
                  {invoice.customer.email}
                </Text>
              )}
            </View>
            <View style={[styles.detailBlock, styles.invoiceInfo]}>
              <Text style={styles.detailLabel}>Invoice Number</Text>
              <Text style={styles.infoValue}>{invoice.invoiceNumber}</Text>
              <Text style={styles.detailLabel}>Invoice Date</Text>
              <Text style={styles.infoValue}>{invoice.date}</Text>
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { width: "10%" }]}>#</Text>
              <Text style={[styles.tableHeaderCell, { width: "40%" }]}>
                Item
              </Text>
              <Text
                style={[
                  styles.tableHeaderCell,
                  { width: "15%", textAlign: "center" },
                ]}
              >
                Qty
              </Text>
              <Text
                style={[
                  styles.tableHeaderCell,
                  { width: "15%", textAlign: "right" },
                ]}
              >
                Price
              </Text>
              <Text
                style={[
                  styles.tableHeaderCell,
                  { width: "20%", textAlign: "right" },
                ]}
              >
                Total
              </Text>
            </View>
            {invoice.items.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: "10%" }]}>
                  {index + 1}
                </Text>
                <Text
                  style={[styles.tableCell, { width: "40%", fontWeight: 500 }]}
                >
                  {item.description}
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    { width: "15%", textAlign: "center" },
                  ]}
                >
                  {item.qty}
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    { width: "15%", textAlign: "right" },
                  ]}
                >
                  ৳ {Number(item.price).toFixed(2)}
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    { width: "20%", textAlign: "right", fontWeight: 500 },
                  ]}
                >
                  ৳ {Number(item.total).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.summaryContainer}>
            <View style={styles.totals}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal</Text>
                <Text style={styles.totalValue}>
                  ৳ {Number(invoice.subTotal).toFixed(2)}
                </Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Delivery Charge</Text>
                <Text style={styles.totalValue}>
                  ৳ {Number(invoice.DeliveryCharge).toFixed(2)}
                </Text>
              </View>
              <View style={styles.divider}></View>
              <View style={[styles.totalRow]}>
                <Text style={styles.grandTotalLabel}>Total</Text>
                <Text style={styles.grandTotalLabel}>
                  ৳ {Number(invoice.totalAmount).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {invoice.contact.address} | {invoice.contact.phone} |{" "}
              {invoice.contact.website}
            </Text>
            <Text style={styles.footerText}>Thank you for your business!</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
