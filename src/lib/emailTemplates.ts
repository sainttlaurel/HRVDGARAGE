/**
 * Professional Email Templates for HRVD Car Trading
 * Used for admin notifications and customer communications
 */

export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

/**
 * Base email styles - shared across all templates
 */
const baseStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: #1f2937;
    background-color: #f3f4f6;
  }
  .container {
    max-width: 600px;
    margin: 20px auto;
    background-color: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
  .header {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    color: #ffffff;
    padding: 40px 32px;
    text-align: center;
    border-bottom: 4px solid #dc2626;
  }
  .header h1 {
    margin: 0;
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -0.5px;
  }
  .header p {
    margin: 8px 0 0 0;
    font-size: 14px;
    opacity: 0.9;
    font-weight: 500;
  }
  .badge {
    display: inline-block;
    background-color: #dc2626;
    color: white;
    padding: 6px 14px;
    border-radius: 24px;
    font-size: 12px;
    font-weight: 700;
    margin-top: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .badge.success {
    background-color: #16a34a;
  }
  .badge.info {
    background-color: #2563eb;
  }
  .content {
    padding: 40px 32px;
  }
  .intro {
    margin-top: 0;
    color: #1f2937;
    font-size: 16px;
    line-height: 1.7;
  }
  .section {
    margin-bottom: 32px;
  }
  .section-title {
    font-size: 13px;
    font-weight: 700;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .info-row {
    display: flex;
    justify-content: space-between;
    padding: 14px 0;
    border-bottom: 1px solid #f3f4f6;
  }
  .info-row:last-child {
    border-bottom: none;
  }
  .info-label {
    font-weight: 600;
    color: #1f2937;
    min-width: 140px;
  }
  .info-value {
    color: #6b7280;
    text-align: right;
    flex: 1;
    word-break: break-word;
  }
  .info-value a {
    color: #dc2626;
    text-decoration: none;
    font-weight: 500;
  }
  .info-value a:hover {
    text-decoration: underline;
  }
  .highlight-box {
    background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
    border-left: 4px solid #dc2626;
    padding: 20px;
    border-radius: 8px;
    margin-top: 12px;
  }
  .highlight-box.success {
    border-left-color: #16a34a;
  }
  .highlight-box.info {
    border-left-color: #2563eb;
  }
  .highlight-box p {
    margin: 0;
    color: #1f2937;
    line-height: 1.7;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
  .detail-box {
    background-color: #f9fafb;
    border: 2px solid #e5e7eb;
    padding: 20px;
    border-radius: 8px;
    margin-top: 12px;
  }
  .detail-title {
    font-size: 16px;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 12px 0;
  }
  .detail-text {
    font-size: 14px;
    color: #6b7280;
    margin: 0;
    line-height: 1.8;
  }
  .cta-button {
    display: inline-block;
    background-color: #dc2626;
    color: white;
    padding: 14px 32px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    margin-top: 28px;
    transition: all 0.2s;
    font-size: 15px;
  }
  .cta-button:hover {
    background-color: #b91c1c;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
  }
  .cta-button.success {
    background-color: #16a34a;
  }
  .cta-button.success:hover {
    background-color: #15803d;
    box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
  }
  .footer {
    background-color: #f9fafb;
    padding: 28px 32px;
    text-align: center;
    border-top: 1px solid #e5e7eb;
    font-size: 12px;
    color: #9ca3af;
  }
  .footer p {
    margin: 0;
    line-height: 1.6;
  }
  .footer-divider {
    margin: 12px 0;
  }
  .logo {
    font-size: 24px;
    margin-right: 8px;
  }
  @media (max-width: 600px) {
    .container {
      margin: 0;
      border-radius: 0;
    }
    .header {
      padding: 32px 24px;
    }
    .content {
      padding: 24px;
    }
    .info-row {
      flex-direction: column;
    }
    .info-value {
      text-align: left;
      margin-top: 4px;
    }
    .footer {
      padding: 20px 24px;
    }
  }
`

/**
 * New Inquiry Notification Email
 * Sent to admin when customer submits inquiry
 */
export const newInquiryTemplate = (data: {
  firstName: string
  lastName: string
  email: string
  phone: string
  message: string
  timestamp: string
}): EmailTemplate => {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1><span class="logo">🚗</span>HRVD Car Trading</h1>
      <p>New Customer Inquiry</p>
      <div class="badge">ACTION REQUIRED</div>
    </div>

    <!-- Content -->
    <div class="content">
      <p class="intro">
        You have received a new inquiry from a potential customer. Please review the details below and respond promptly to provide excellent customer service.
      </p>

      <!-- Customer Info -->
      <div class="section">
        <div class="section-title">👤 Customer Information</div>
        <div class="info-row">
          <span class="info-label">Name:</span>
          <span class="info-value">${data.firstName} ${data.lastName}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Email:</span>
          <span class="info-value"><a href="mailto:${data.email}">${data.email}</a></span>
        </div>
        <div class="info-row">
          <span class="info-label">Phone:</span>
          <span class="info-value"><a href="tel:${data.phone}">${data.phone}</a></span>
        </div>
        <div class="info-row">
          <span class="info-label">Received:</span>
          <span class="info-value">${data.timestamp}</span>
        </div>
      </div>

      <!-- Message -->
      <div class="section">
        <div class="section-title">💬 Message</div>
        <div class="highlight-box">
          <p>${data.message}</p>
        </div>
      </div>

      <!-- CTA -->
      <p style="margin-top: 28px; color: #6b7280; font-size: 14px; line-height: 1.7;">
        Please respond to this inquiry as soon as possible. Quick responses lead to better customer satisfaction and higher conversion rates.
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong>HRVD Car Trading Admin Notification</strong></p>
      <p class="footer-divider">This is an automated email from your admin system.</p>
      <p style="opacity: 0.7;">Please do not reply to this address. Use the customer's contact information above.</p>
    </div>
  </div>
</body>
</html>
  `.trim()

  const text = `
HRVD CAR TRADING - NEW CUSTOMER INQUIRY

CUSTOMER INFORMATION
Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone}
Received: ${data.timestamp}

MESSAGE
${data.message}

---
Please respond to this inquiry as soon as possible.
HRVD Car Trading Admin Notification System
  `.trim()

  return {
    subject: `🚗 New Inquiry from ${data.firstName} ${data.lastName}`,
    html,
    text
  }
}

/**
 * New Part Order Notification Email
 * Sent to admin when customer places part order
 */
export const newPartOrderTemplate = (data: {
  partName: string
  partBrand: string
  partPrice: string
  quantity: number
  customerName: string
  customerEmail: string
  customerPhone: string
  deliveryOption: string
  timestamp: string
}): EmailTemplate => {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1><span class="logo">🚗</span>HRVD Car Trading</h1>
      <p>New Part Order Received</p>
      <div class="badge success">NEW ORDER</div>
    </div>

    <!-- Content -->
    <div class="content">
      <p class="intro">
        A customer has placed a new order for a part. Please review the details and contact the customer to confirm the order and arrange payment/delivery.
      </p>

      <!-- Part Info -->
      <div class="section">
        <div class="section-title">🔧 Part Details</div>
        <div class="detail-box">
          <p class="detail-title">${data.partBrand} ${data.partName}</p>
          <p class="detail-text">
            <strong>Price:</strong> ${data.partPrice}<br>
            <strong>Quantity:</strong> ${data.quantity} unit(s)<br>
            <strong>Delivery Option:</strong> ${data.deliveryOption}
          </p>
        </div>
      </div>

      <!-- Customer Info -->
      <div class="section">
        <div class="section-title">👤 Customer Information</div>
        <div class="info-row">
          <span class="info-label">Name:</span>
          <span class="info-value">${data.customerName}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Email:</span>
          <span class="info-value"><a href="mailto:${data.customerEmail}">${data.customerEmail}</a></span>
        </div>
        <div class="info-row">
          <span class="info-label">Phone:</span>
          <span class="info-value"><a href="tel:${data.customerPhone}">${data.customerPhone}</a></span>
        </div>
        <div class="info-row">
          <span class="info-label">Order Date:</span>
          <span class="info-value">${data.timestamp}</span>
        </div>
      </div>

      <!-- CTA -->
      <p style="margin-top: 28px; color: #6b7280; font-size: 14px; line-height: 1.7;">
        Please contact the customer within 24 hours to confirm the order and arrange payment and delivery details.
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong>HRVD Car Trading Admin Notification</strong></p>
      <p class="footer-divider">This is an automated email from your admin system.</p>
      <p style="opacity: 0.7;">Please do not reply to this address. Use the customer's contact information above.</p>
    </div>
  </div>
</body>
</html>
  `.trim()

  const text = `
HRVD CAR TRADING - NEW PART ORDER

PART DETAILS
Brand: ${data.partBrand}
Name: ${data.partName}
Price: ${data.partPrice}
Quantity: ${data.quantity}
Delivery: ${data.deliveryOption}

CUSTOMER INFORMATION
Name: ${data.customerName}
Email: ${data.customerEmail}
Phone: ${data.customerPhone}
Order Date: ${data.timestamp}

---
Please contact the customer to confirm the order.
HRVD Car Trading Admin Notification System
  `.trim()

  return {
    subject: `🛒 New Part Order - ${data.partBrand} ${data.partName}`,
    html,
    text
  }
}

/**
 * New Vehicle Inquiry Notification Email
 * Sent to admin when customer inquires about a vehicle
 */
export const newVehicleInquiryTemplate = (data: {
  vehicleBrand: string
  vehicleModel: string
  vehicleYear: number
  vehiclePrice: string
  customerName: string
  customerEmail: string
  customerPhone: string
  inquiryType: string
  message: string
  timestamp: string
}): EmailTemplate => {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1><span class="logo">🚗</span>HRVD Car Trading</h1>
      <p>New Vehicle Inquiry</p>
      <div class="badge info">INQUIRY</div>
    </div>

    <!-- Content -->
    <div class="content">
      <p class="intro">
        A customer has inquired about one of your vehicles. Please review the details and respond promptly to move the sale forward.
      </p>

      <!-- Vehicle Info -->
      <div class="section">
        <div class="section-title">🚙 Vehicle Details</div>
        <div class="detail-box">
          <p class="detail-title">${data.vehicleYear} ${data.vehicleBrand} ${data.vehicleModel}</p>
          <p class="detail-text">
            <strong>Price:</strong> ${data.vehiclePrice}<br>
            <strong>Inquiry Type:</strong> ${data.inquiryType}
          </p>
        </div>
      </div>

      <!-- Customer Info -->
      <div class="section">
        <div class="section-title">👤 Customer Information</div>
        <div class="info-row">
          <span class="info-label">Name:</span>
          <span class="info-value">${data.customerName}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Email:</span>
          <span class="info-value"><a href="mailto:${data.customerEmail}">${data.customerEmail}</a></span>
        </div>
        <div class="info-row">
          <span class="info-label">Phone:</span>
          <span class="info-value"><a href="tel:${data.customerPhone}">${data.customerPhone}</a></span>
        </div>
        <div class="info-row">
          <span class="info-label">Inquiry Date:</span>
          <span class="info-value">${data.timestamp}</span>
        </div>
      </div>

      <!-- Message -->
      <div class="section">
        <div class="section-title">💬 Message</div>
        <div class="highlight-box info">
          <p>${data.message}</p>
        </div>
      </div>

      <!-- CTA -->
      <p style="margin-top: 28px; color: #6b7280; font-size: 14px; line-height: 1.7;">
        Please respond to the customer's inquiry as soon as possible. Prompt communication significantly improves the chances of closing the sale.
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong>HRVD Car Trading Admin Notification</strong></p>
      <p class="footer-divider">This is an automated email from your admin system.</p>
      <p style="opacity: 0.7;">Please do not reply to this address. Use the customer's contact information above.</p>
    </div>
  </div>
</body>
</html>
  `.trim()

  const text = `
HRVD CAR TRADING - NEW VEHICLE INQUIRY

VEHICLE DETAILS
Year: ${data.vehicleYear}
Brand: ${data.vehicleBrand}
Model: ${data.vehicleModel}
Price: ${data.vehiclePrice}
Inquiry Type: ${data.inquiryType}

CUSTOMER INFORMATION
Name: ${data.customerName}
Email: ${data.customerEmail}
Phone: ${data.customerPhone}
Inquiry Date: ${data.timestamp}

MESSAGE
${data.message}

---
Please respond to the customer's inquiry.
HRVD Car Trading Admin Notification System
  `.trim()

  return {
    subject: `🚗 Vehicle Inquiry - ${data.vehicleYear} ${data.vehicleBrand} ${data.vehicleModel}`,
    html,
    text
  }
}
