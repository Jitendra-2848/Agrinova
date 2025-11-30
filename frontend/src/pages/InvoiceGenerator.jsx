import html2canvas from "html2canvas";
import toast from "react-hot-toast";

export const generateInvoice = async (order) => {
  try {
    const productData = order.product?.[0] || {};
    const priceData = productData.price || {};
    const deliveryData = productData.delivery || {};
    
    const totalAmount = Number(priceData.amount) || 0;
    const discount = Number(priceData.discount) || 0;
    const deliveryCharge = Number(order.charge) || 0;
    const quantity = Number(productData.quantity) || 1;
    const isNegotiated = priceData.isNegotiated || false;
    const unitPrice = ((totalAmount - deliveryCharge + discount) / quantity).toFixed(2);

    const invoiceHTML = `
      <div style="width: 800px; background: white; padding: 40px; font-family: 'Segoe UI', Arial, sans-serif;">
        
        <!-- Watermark -->
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); opacity: 0.03; font-size: 100px; font-weight: bold; color: #10b981;">AGRINOVA</div>

        <!-- Header -->
        <div style="text-align: center; border-bottom: 3px solid #10b981; padding-bottom: 20px; margin-bottom: 30px;">
          <div style="display: inline-flex; align-items: center; gap: 10px; margin-bottom: 8px;">
            <div style="width: 45px; height: 45px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
              </svg>
            </div>
            <h1 style="margin: 0; font-size: 32px; color: #1f2937;">Agri<span style="color: #10b981;">Nova</span></h1>
          </div>
          <p style="margin: 0; color: #6b7280; font-size: 12px;">Farm to Market - Direct Trade Platform</p>
        </div>

        <!-- Invoice Title -->
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="margin: 0; font-size: 28px; color: #1f2937; background: linear-gradient(135deg, #f0fdf4, #dcfce7); padding: 12px 30px; border-radius: 10px; display: inline-block; border: 2px solid #10b981;">TAX INVOICE</h2>
          <div style="margin-top: 15px; display: flex; justify-content: center; gap: 40px;">
            <div style="text-align: left;">
              <p style="margin: 0; font-size: 11px; color: #6b7280;">Invoice No.</p>
              <p style="margin: 3px 0 0 0; font-size: 14px; font-weight: bold; color: #1f2937;">#${order.tracking_id.slice(0, 10).toUpperCase()}</p>
            </div>
            <div style="text-align: left;">
              <p style="margin: 0; font-size: 11px; color: #6b7280;">Date</p>
              <p style="margin: 3px 0 0 0; font-size: 14px; font-weight: bold; color: #1f2937;">${new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
            </div>
          </div>
        </div>

        <!-- Customer Info -->
        <div style="background: #f9fafb; padding: 18px; border-radius: 10px; margin-bottom: 25px; border-left: 4px solid #10b981;">
          <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #1f2937; font-weight: bold;">📍 Delivery Address</h3>
          <p style="margin: 0; color: #4b5563; line-height: 1.6; font-size: 13px;">
            ${deliveryData.address || "N/A"}<br/>
            <strong>Pincode:</strong> ${deliveryData.pincode || "N/A"} | <strong>City:</strong> ${deliveryData.city || "N/A"}
          </p>
        </div>

        <!-- Order Details -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden;">
          <thead>
            <tr style="background: linear-gradient(135deg, #10b981, #059669);">
              <th style="padding: 12px; text-align: left; color: white; font-size: 13px;">Description</th>
              <th style="padding: 12px; text-align: center; color: white; font-size: 13px;">Qty</th>
              <th style="padding: 12px; text-align: right; color: white; font-size: 13px;">Price</th>
              <th style="padding: 12px; text-align: right; color: white; font-size: 13px;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr style="background: #fff; border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px; font-size: 13px; color: #1f2937;">Agricultural Product</td>
              <td style="padding: 12px; text-align: center; font-weight: bold; font-size: 13px; color: #1f2937;">${quantity}</td>
              <td style="padding: 12px; text-align: right; font-size: 13px; color: #1f2937;">₹${unitPrice}</td>
              <td style="padding: 12px; text-align: right; font-weight: bold; font-size: 13px; color: #1f2937;">₹${(totalAmount - deliveryCharge + discount).toFixed(2)}</td>
            </tr>
            ${discount > 0 ? `
            <tr style="background: #f0fdf4; border-bottom: 1px solid #e5e7eb;">
              <td colspan="3" style="padding: 12px; font-size: 13px; color: #059669; font-weight: bold;">💎 Negotiation Discount</td>
              <td style="padding: 12px; text-align: right; font-weight: bold; font-size: 13px; color: #059669;">-₹${discount.toFixed(2)}</td>
            </tr>` : ''}
            <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
              <td colspan="3" style="padding: 12px; font-size: 13px; color: #1f2937;">🚚 Delivery (${order.total_distance.toFixed(0)} km)</td>
              <td style="padding: 12px; text-align: right; font-weight: bold; font-size: 13px; color: #1f2937;">₹${deliveryCharge.toFixed(2)}</td>
            </tr>
            <tr style="background: linear-gradient(135deg, #f0fdf4, #dcfce7);">
              <td colspan="3" style="padding: 15px; text-align: right; font-size: 16px; font-weight: bold; color: #1f2937;">Grand Total</td>
              <td style="padding: 15px; text-align: right; font-size: 20px; font-weight: bold; color: #059669;">₹${totalAmount.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <!-- Payment & Status -->
        <div style="display: flex; gap: 15px; margin-bottom: 25px;">
          <div style="flex: 1; background: #f9fafb; padding: 15px; border-radius: 8px; border: 1px dashed #d1d5db;">
            <p style="margin: 0; font-size: 11px; color: #6b7280;">Payment Method</p>
            <p style="margin: 5px 0 0 0; font-size: 14px; font-weight: bold; color: #1f2937;">${priceData.method?.toUpperCase() || "COD"}</p>
          </div>
          <div style="flex: 1; background: #f0fdf4; padding: 15px; border-radius: 8px; border: 1px solid #10b981;">
            <p style="margin: 0; font-size: 11px; color: #6b7280;">Status</p>
            <p style="margin: 5px 0 0 0;"><span style="background: #10b981; color: white; padding: 4px 10px; border-radius: 8px; font-size: 12px; font-weight: bold;">✓ ${order.status}</span></p>
          </div>
          ${isNegotiated ? `
          <div style="flex: 1; background: #faf5ff; padding: 15px; border-radius: 8px; border: 1px solid #a855f7;">
            <p style="margin: 0; font-size: 11px; color: #6b7280;">Deal Type</p>
            <p style="margin: 5px 0 0 0;"><span style="background: #a855f7; color: white; padding: 4px 10px; border-radius: 8px; font-size: 12px; font-weight: bold;">Negotiated</span></p>
          </div>` : ''}
        </div>

        <!-- Tracking ID -->
        <div style="background: linear-gradient(135deg, #f0fdf4, #dcfce7); padding: 12px; border-radius: 8px; margin-bottom: 25px; text-align: center; border: 1px solid #10b981;">
          <p style="margin: 0; font-size: 11px; color: #6b7280;">Tracking ID</p>
          <p style="margin: 5px 0 0 0; font-size: 13px; font-weight: bold; color: #059669; font-family: 'Courier New', monospace; letter-spacing: 1px;">${order.tracking_id}</p>
        </div>

        <!-- Signature -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; padding: 20px 0; border-top: 2px dashed #d1d5db;">
          <div style="text-align: center;">
            <p style="margin: 0 0 40px 0; font-size: 11px; color: #9ca3af; font-style: italic;">Computer Generated</p>
            <div style="border-top: 2px solid #1f2937; padding-top: 5px; width: 180px;">
              <p style="margin: 0; font-size: 12px; font-weight: bold; color: #1f2937;">Authorized Signatory</p>
              <p style="margin: 2px 0 0 0; font-size: 10px; color: #6b7280;">AgriNova Platform</p>
            </div>
          </div>
          <div style="text-align: center;">
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#10b981" stroke-width="2" stroke-dasharray="4,2"/>
              <circle cx="50" cy="50" r="40" fill="#f0fdf4" stroke="#10b981" stroke-width="1.5"/>
              <path d="M 35 50 L 45 60 L 65 40" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round"/>
              <text x="50" y="78" text-anchor="middle" font-size="9" font-weight="bold" fill="#059669">VERIFIED</text>
              <text x="50" y="88" text-anchor="middle" font-size="7" fill="#6b7280">AgriNova</text>
            </svg>
          </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #f0fdf4, #dcfce7); border-radius: 8px; border: 2px solid #10b981; margin-top: 20px;">
          <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold; color: #1f2937;">Thank you for your business! 🌾</p>
          <p style="margin: 0 0 10px 0; font-size: 12px; color: #4b5563;">AgriNova - Empowering Farmers, Connecting Markets</p>
          <div style="display: flex; justify-content: center; gap: 20px; font-size: 11px; color: #6b7280; flex-wrap: wrap;">
            <span>📧 prajapatijitendra2848@gmail.com</span>
            <span>📞 +91 75750 66951</span>
            <span>📍 Ahmedabad, Gujarat</span>
          </div>
        </div>

        <!-- Terms -->
        <div style="margin-top: 15px; padding: 12px; background: #f9fafb; border-radius: 6px; border-left: 3px solid #10b981;">
          <p style="margin: 0 0 5px 0; font-size: 10px; font-weight: bold; color: #1f2937;">Terms & Conditions:</p>
          <p style="margin: 0; font-size: 9px; color: #6b7280; line-height: 1.5;">
            1. Computer-generated invoice, no signature required. 2. Payment as agreed. 3. Returns only if defective. 4. Disputes subject to Ahmedabad jurisdiction.
          </p>
        </div>

      </div>
    `;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = invoiceHTML;
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    document.body.appendChild(tempDiv);

    const canvas = await html2canvas(tempDiv, { scale: 2, backgroundColor: "#fff", logging: false });
    
    const link = document.createElement("a");
    link.download = `AgriNova_Invoice_${order.tracking_id.slice(0, 8)}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();

    document.body.removeChild(tempDiv);
    toast.success("Invoice downloaded! 📄");
    
  } catch (error) {
    console.error("Invoice generation error:", error);
    toast.error("Failed to generate invoice");
  }
};