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
    const subtotal = totalAmount - deliveryCharge + discount;
    const unitPrice = (subtotal / quantity).toFixed(2);

    const invoiceHTML = `
      <div style="width: 750px; background: #fff; padding: 40px; font-family: Arial, sans-serif; color: #333;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #10b981; padding-bottom: 20px; margin-bottom: 25px;">
          <div>
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 40px; height: 40px; background: #10b981; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                </svg>
              </div>
              <div>
                <h1 style="margin: 0; font-size: 24px; font-weight: 700;">AgriNova</h1>
                <p style="margin: 0; font-size: 11px; color: #666;">Farm to Market Platform</p>
              </div>
            </div>
            <div style="margin-top: 12px; font-size: 10px; color: #555; line-height: 1.5;">
              <p style="margin: 0;">Ahmedabad, Gujarat - 382405</p>
            </div>
          </div>
          <div style="text-align: right;">
            <h2 style="margin: 0; font-size: 20px; font-weight: 700; color: #10b981;">BILL INVOICE</h2>
            <div style="margin-top: 10px; font-size: 11px; color: #555;">
              <p style="margin: 3px 0;"><strong>Invoice:</strong> #${order.tracking_id.slice(0, 10).toUpperCase()}</p>
              <p style="margin: 3px 0;"><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
            </div>
          </div>
        </div>

        <!-- Addresses -->
        <div style="display: flex; gap: 30px; margin-bottom: 25px;">
          <div style="flex: 1; background: #f8f8f8; padding: 15px; border-radius: 6px;">
            <h4 style="margin: 0 0 8px 0; font-size: 11px; font-weight: 700; color: #10b981;">DELIVERY ADDRESS:</h4>
            <p style="margin: 0; font-size: 11px; color: #444; line-height: 1.5;">
              ${deliveryData.address || "N/A"}<br/>
              ${deliveryData.city || "N/A"} - ${deliveryData.pincode || "N/A"}
            </p>
          </div>
        </div>

        <!-- Items Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px;">
          <thead>
            <tr style="background: #10b981; color: white;">
              <th style="padding: 10px; text-align: left; font-weight: 600;">Description</th>
              <th style="padding: 10px; text-align: center; font-weight: 600;">Qty</th>
              <th style="padding: 10px; text-align: right; font-weight: 600;">Rate</th>
              <th style="padding: 10px; text-align: right; font-weight: 600;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px;">Agricultural Product</td>
              <td style="padding: 10px; text-align: center;">${quantity}</td>
              <td style="padding: 10px; text-align: right;">${unitPrice}</td>
              <td style="padding: 10px; text-align: right;">${subtotal.toFixed(2)}</td>
            </tr>
            ${discount > 0 ? `
            <tr style="border-bottom: 1px solid #eee; color: #10b981;">
              <td colspan="3" style="padding: 10px;">Discount${isNegotiated ? ' (Negotiated)' : ''}</td>
              <td style="padding: 10px; text-align: right;">-${discount.toFixed(2)}</td>
            </tr>` : ''}
            <tr style="border-bottom: 1px solid #eee;">
              <td colspan="3" style="padding: 10px;">Delivery Charges (${order.total_distance.toFixed(0)} km)</td>
              <td style="padding: 10px; text-align: right;">${deliveryCharge.toFixed(2)}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr style="background: #f0fdf4;">
              <td colspan="3" style="padding: 12px; text-align: right; font-weight: 700; font-size: 13px;">Total (INR)</td>
              <td style="padding: 12px; text-align: right; font-weight: 700; font-size: 14px; color: #10b981;">${totalAmount.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>

        <!-- Payment Info -->
        <div style="display: flex; gap: 15px; margin-bottom: 20px; font-size: 10px;">
          <div style="flex: 1; background: #f8f8f8; padding: 10px; border-radius: 4px;">
            <span style="color: #666;">Payment:</span>
            <strong style="margin-left: 5px;">${priceData.method?.toUpperCase() || "COD"}</strong>
          </div>
          <div style="flex: 1; background: #f8f8f8; padding: 10px; border-radius: 4px;">
            <span style="color: #666;">Status:</span>
            <strong style="margin-left: 5px; color: #10b981;">PAID</strong>
          </div>
          <div style="flex: 2; background: #f8f8f8; padding: 10px; border-radius: 4px;">
            <span style="color: #666;">Tracking:</span>
            <strong style="margin-left: 5px; font-family: monospace; font-size: 9px;">${order.tracking_id}</strong>
          </div>
        </div>

        <!-- Footer -->
        <div style="border-top: 1px solid #eee; padding-top: 15px; display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 9px; color: #888; line-height: 1.4;">
            <p style="margin: 0;">Computer generated invoice. No signature required.</p>
            <p style="margin: 2px 0 0 0;">Terms: Payment as agreed. Returns within 48hrs for defective goods.</p>
          </div>
          <div style="text-align: center;">
            <svg width="60" height="60" viewBox="0 0 60 60">
              <circle cx="30" cy="30" r="28" fill="none" stroke="#10b981" stroke-width="1.5" stroke-dasharray="3,2"/>
              <circle cx="30" cy="30" r="24" fill="#f0fdf4" stroke="#10b981" stroke-width="1"/>
              <path d="M 20 30 L 26 36 L 40 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round"/>
              <text x="30" y="48" text-anchor="middle" font-size="6" font-weight="bold" fill="#10b981">VERIFIED</text>
            </svg>
          </div>
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
    link.download = `Invoice_${order.tracking_id.slice(0, 8)}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();

    document.body.removeChild(tempDiv);
    toast.success("Invoice downloaded");
    
  } catch (error) {
    console.error("Invoice error:", error);
    toast.error("Failed to generate invoice");
  }
};