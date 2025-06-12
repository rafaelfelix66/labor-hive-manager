import puppeteer from 'puppeteer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface BillData {
  id: string;
  billNumber: string;
  service: string;
  hoursWorked: number;
  serviceRate: number;
  totalClient: number;
  totalProvider: number;
  status: string;
  dueDate: Date | null;
  paidDate: Date | null;
  createdAt: Date;
  client: {
    companyName: string;
    entity: string;
    markupType?: string;
    markupValue?: string | number;
    commission?: string | number;
  };
  provider: {
    services: string[];
    hourlyRate: number;
    application: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    };
  };
}

export const generateBillPDF = async (billId: string): Promise<Buffer> => {
  try {
    // Fetch bill data
    const bill = await prisma.bill.findUnique({
      where: { id: billId },
      include: {
        client: {
          select: {
            companyName: true,
            entity: true,
            markupType: true,
            markupValue: true,
            commission: true
          }
        },
        provider: {
          include: {
            application: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true
              }
            }
          }
        }
      }
    });

    if (!bill) {
      throw new Error('Bill not found');
    }

    const billData: BillData = {
      id: bill.id,
      billNumber: bill.billNumber,
      service: bill.service,
      hoursWorked: parseFloat(bill.hoursWorked.toString()),
      serviceRate: parseFloat(bill.serviceRate.toString()),
      totalClient: parseFloat(bill.totalClient.toString()),
      totalProvider: parseFloat(bill.totalProvider.toString()),
      status: bill.status,
      dueDate: bill.dueDate,
      paidDate: bill.paidDate,
      createdAt: bill.createdAt,
      client: {
        companyName: bill.client.companyName,
        entity: bill.client.entity,
        markupType: bill.client.markupType || undefined,
        markupValue: bill.client.markupValue ? parseFloat(bill.client.markupValue.toString()) : undefined,
        commission: bill.client.commission ? parseFloat(bill.client.commission.toString()) : undefined,
      },
      provider: {
        services: bill.provider.services,
        hourlyRate: parseFloat(bill.provider.hourlyRate.toString()),
        application: bill.provider.application
      }
    };

    // Generate HTML template
    const htmlTemplate = generateBillHTML(billData);

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-features=TranslateUI',
        '--disable-ipc-flooding-protection',
        '--disable-extensions',
        '--disable-default-apps',
        '--no-default-browser-check',
        '--disable-sync'
      ]
    });

    const page = await browser.newPage();
    await page.setContent(htmlTemplate, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    await browser.close();
    return Buffer.from(pdfBuffer);

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

const generateBillHTML = (bill: BillData): string => {
  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  
  const formatDate = (date: Date | null) => 
    date ? new Date(date).toLocaleDateString('en-US') : 'N/A';

  const markup = bill.totalClient - bill.totalProvider;
  const profitMargin = ((markup / bill.totalClient) * 100).toFixed(2);

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bill ${bill.billNumber}</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background: #fff;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
            }
            .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 40px;
                border-bottom: 3px solid #2563eb;
                padding-bottom: 20px;
            }
            .logo {
                font-size: 32px;
                font-weight: bold;
                color: #2563eb;
            }
            .bill-number {
                font-size: 24px;
                font-weight: bold;
                color: #666;
            }
            .bill-info {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 40px;
                margin-bottom: 40px;
            }
            .info-section {
                background: #f8fafc;
                padding: 20px;
                border-radius: 8px;
                border-left: 4px solid #2563eb;
            }
            .info-section h3 {
                color: #2563eb;
                margin-bottom: 15px;
                font-size: 18px;
            }
            .info-row {
                margin-bottom: 8px;
                display: flex;
                justify-content: space-between;
            }
            .info-label {
                font-weight: 600;
                color: #666;
            }
            .service-details {
                background: #fff;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 30px;
            }
            .service-details h3 {
                color: #1f2937;
                margin-bottom: 20px;
                font-size: 20px;
                border-bottom: 2px solid #e5e7eb;
                padding-bottom: 10px;
            }
            .detail-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
            }
            .detail-item {
                display: flex;
                justify-content: space-between;
                padding: 12px 0;
                border-bottom: 1px solid #f3f4f6;
            }
            .calculations {
                background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
                border-radius: 8px;
                padding: 25px;
                margin-bottom: 30px;
            }
            .calculations h3 {
                color: #0369a1;
                margin-bottom: 20px;
                font-size: 20px;
                text-align: center;
            }
            .calc-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 20px;
            }
            .calc-item {
                text-align: center;
                padding: 15px;
                background: white;
                border-radius: 6px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .calc-label {
                font-size: 14px;
                color: #666;
                margin-bottom: 5px;
            }
            .calc-value {
                font-size: 18px;
                font-weight: bold;
            }
            .client-pays { color: #059669; }
            .provider-gets { color: #0369a1; }
            .profit { color: #7c3aed; }
            .base-total { color: #374151; }
            .status {
                display: inline-block;
                padding: 8px 16px;
                border-radius: 20px;
                font-weight: bold;
                text-transform: uppercase;
                font-size: 12px;
            }
            .status.paid { background: #dcfce7; color: #166534; }
            .status.pending { background: #fef3c7; color: #92400e; }
            .status.overdue { background: #fee2e2; color: #991b1b; }
            .footer {
                margin-top: 40px;
                text-align: center;
                font-size: 12px;
                color: #666;
                border-top: 2px solid #e5e7eb;
                padding-top: 20px;
            }
            .breakdown {
                background: #f9fafb;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 20px;
            }
            .breakdown h4 {
                color: #374151;
                margin-bottom: 15px;
            }
            .breakdown-item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
                padding: 5px 0;
            }
            .breakdown-total {
                border-top: 2px solid #d1d5db;
                padding-top: 10px;
                margin-top: 10px;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <!-- Header -->
            <div class="header">
                <div class="logo">LaborPro</div>
                <div>
                    <div class="bill-number">Bill ${bill.billNumber}</div>
                    <div class="status ${bill.status.toLowerCase()}">
                        ${bill.status}
                    </div>
                </div>
            </div>

            <!-- Bill Information -->
            <div class="bill-info">
                <div class="info-section">
                    <h3>Bill To (Client)</h3>
                    <div class="info-row">
                        <span class="info-label">Company:</span>
                        <span>${bill.client.companyName}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Entity:</span>
                        <span>${bill.client.entity}</span>
                    </div>
                </div>

                <div class="info-section">
                    <h3>Service Provider</h3>
                    <div class="info-row">
                        <span class="info-label">Name:</span>
                        <span>${bill.provider.application.firstName} ${bill.provider.application.lastName}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Email:</span>
                        <span>${bill.provider.application.email}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Phone:</span>
                        <span>${bill.provider.application.phone}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Hourly Rate:</span>
                        <span>${formatCurrency(bill.provider.hourlyRate)}</span>
                    </div>
                </div>
            </div>

            <!-- Service Details -->
            <div class="service-details">
                <h3>Service Details</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="info-label">Service:</span>
                        <span>${bill.service}</span>
                    </div>
                    <div class="detail-item">
                        <span class="info-label">Hours Worked:</span>
                        <span>${bill.hoursWorked}h</span>
                    </div>
                    <div class="detail-item">
                        <span class="info-label">Service Rate:</span>
                        <span>${formatCurrency(bill.serviceRate)}/hour</span>
                    </div>
                    <div class="detail-item">
                        <span class="info-label">Base Total:</span>
                        <span>${formatCurrency(bill.hoursWorked * bill.serviceRate)}</span>
                    </div>
                </div>
            </div>

            <!-- Financial Breakdown -->
            ${bill.client.markupType || bill.client.commission ? `
            <div class="breakdown">
                <h4>Financial Breakdown</h4>
                <div class="breakdown-item">
                    <span>Base Amount (${bill.hoursWorked}h × ${formatCurrency(bill.serviceRate)}):</span>
                    <span>${formatCurrency(bill.hoursWorked * bill.serviceRate)}</span>
                </div>
                ${bill.client.markupType ? `
                <div class="breakdown-item">
                    <span>Markup (${bill.client.markupType === 'Percent' ? bill.client.markupValue + '%' : formatCurrency(Number(bill.client.markupValue))}):</span>
                    <span>+${formatCurrency(markup)}</span>
                </div>` : ''}
                <div class="breakdown-item breakdown-total">
                    <span>Client Total:</span>
                    <span>${formatCurrency(bill.totalClient)}</span>
                </div>
                ${bill.client.commission ? `
                <div class="breakdown-item">
                    <span>Commission (${bill.client.commission}%):</span>
                    <span>-${formatCurrency((bill.hoursWorked * bill.serviceRate) * (Number(bill.client.commission) / 100))}</span>
                </div>` : ''}
                <div class="breakdown-item breakdown-total">
                    <span>Provider Receives:</span>
                    <span>${formatCurrency(bill.totalProvider)}</span>
                </div>
            </div>` : ''}

            <!-- Calculations -->
            <div class="calculations">
                <h3>Financial Summary</h3>
                <div class="calc-grid">
                    <div class="calc-item">
                        <div class="calc-label">Base Total</div>
                        <div class="calc-value base-total">${formatCurrency(bill.hoursWorked * bill.serviceRate)}</div>
                    </div>
                    <div class="calc-item">
                        <div class="calc-label">Client Pays</div>
                        <div class="calc-value client-pays">${formatCurrency(bill.totalClient)}</div>
                    </div>
                    <div class="calc-item">
                        <div class="calc-label">Provider Gets</div>
                        <div class="calc-value provider-gets">${formatCurrency(bill.totalProvider)}</div>
                    </div>
                    <div class="calc-item">
                        <div class="calc-label">Profit (${profitMargin}%)</div>
                        <div class="calc-value profit">${formatCurrency(markup)}</div>
                    </div>
                </div>
            </div>

            <!-- Dates -->
            <div class="bill-info">
                <div class="info-section">
                    <h3>Important Dates</h3>
                    <div class="info-row">
                        <span class="info-label">Created:</span>
                        <span>${formatDate(bill.createdAt)}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Due Date:</span>
                        <span>${formatDate(bill.dueDate)}</span>
                    </div>
                    ${bill.paidDate ? `
                    <div class="info-row">
                        <span class="info-label">Paid Date:</span>
                        <span>${formatDate(bill.paidDate)}</span>
                    </div>` : ''}
                </div>
                <div class="info-section">
                    <h3>Services Provided</h3>
                    ${bill.provider.services.map(service => `
                    <div class="info-row">
                        <span>• ${service}</span>
                    </div>
                    `).join('')}
                </div>
            </div>

            <!-- Footer -->
            <div class="footer">
                <p>Generated by LaborPro Billing System on ${new Date().toLocaleDateString('en-US')}</p>
                <p>This is an automatically generated document.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};