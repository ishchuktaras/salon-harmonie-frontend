// ABRA Flexi API Integration Service
// Implementuje REST API komunikaci s ABRA Flexi systémem

interface AbraFlexiConfig {
  baseUrl: string
  username: string
  password: string
  company: string
}

interface AbraFlexiInvoice {
  kod?: string
  typDokl: string
  firma: string
  datVyst: string
  datSplat: string
  sumCelkem: number
  sumZklZakl: number
  sumDphZakl: number
  poznam?: string
  polozkyFaktury: AbraFlexiInvoiceItem[]
}

interface AbraFlexiInvoiceItem {
  nazev: string
  mnozMj: number
  cenaMj: number
  szbDph: string
  typCenyDphK: string
}

interface AbraFlexiContact {
  kod?: string
  nazev: string
  email?: string
  tel?: string
  poznam?: string
}

interface DailySummaryData {
  date: string
  totalRevenue: number
  transactions: any[]
  servicesRevenue: number
  productsRevenue: number
  cashPayments: number
  cardPayments: number
}

class AbraFlexiService {
  private config: AbraFlexiConfig

  constructor(config: AbraFlexiConfig) {
    this.config = config
  }

  private getAuthHeader(): string {
    const credentials = btoa(`${this.config.username}:${this.config.password}`)
    return `Basic ${credentials}`
  }

  private async makeRequest(endpoint: string, method = "GET", data?: any): Promise<any> {
    const url = `${this.config.baseUrl}/c/${this.config.company}/${endpoint}`

    const headers: HeadersInit = {
      Authorization: this.getAuthHeader(),
      "Content-Type": "application/json",
      Accept: "application/json",
    }

    const options: RequestInit = {
      method,
      headers,
    }

    if (data && (method === "POST" || method === "PUT")) {
      options.body = JSON.stringify(data)
    }

    try {
      const response = await fetch(url, options)

      if (!response.ok) {
        throw new Error(`ABRA Flexi API Error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("ABRA Flexi API Request Failed:", error)
      throw error
    }
  }

  // Vytvoření nového kontaktu v adresáři
  async createContact(contactData: {
    name: string
    email?: string
    phone?: string
    notes?: string
  }): Promise<string> {
    const abraContact: AbraFlexiContact = {
      nazev: contactData.name,
      email: contactData.email,
      tel: contactData.phone,
      poznam: contactData.notes,
    }

    const response = await this.makeRequest("adresar", "POST", {
      winstrom: {
        adresar: [abraContact],
      },
    })

    // Vrátí ID vytvořeného kontaktu
    return response.winstrom.results[0].id
  }

  // Aktualizace existujícího kontaktu
  async updateContact(contactId: string, contactData: Partial<AbraFlexiContact>): Promise<void> {
    await this.makeRequest(`adresar/${contactId}`, "PUT", {
      winstrom: {
        adresar: [contactData],
      },
    })
  }

  // Vytvoření faktury za služby a produkty
  async createInvoice(invoiceData: {
    clientName: string
    clientId?: string
    items: Array<{
      name: string
      quantity: number
      price: number
      type: "service" | "product"
    }>
    total: number
    date: string
    paymentMethod: "cash" | "card"
  }): Promise<string> {
    const polozky: AbraFlexiInvoiceItem[] = invoiceData.items.map((item) => ({
      nazev: item.name,
      mnozMj: item.quantity,
      cenaMj: item.price,
      szbDph: "vysoká", // 21% DPH pro služby a produkty
      typCenyDphK: "bezDph",
    }))

    const faktura: AbraFlexiInvoice = {
      typDokl: "FAKTURA",
      firma: invoiceData.clientId || "code:HOTOVOST", // Pokud není klient, použije se hotovostní prodej
      datVyst: invoiceData.date,
      datSplat: invoiceData.date,
      sumCelkem: invoiceData.total,
      sumZklZakl: Math.round(invoiceData.total / 1.21), // Základ bez DPH
      sumDphZakl: Math.round(invoiceData.total - invoiceData.total / 1.21), // DPH
      poznam: `Platba: ${invoiceData.paymentMethod === "cash" ? "Hotově" : "Kartou"}`,
      polozkyFaktury: polozky,
    }

    const response = await this.makeRequest("faktura-vydana", "POST", {
      winstrom: {
        "faktura-vydana": [faktura],
      },
    })

    return response.winstrom.results[0].id
  }

  // Odeslání denní uzávěrky
  async sendDailySummary(summaryData: DailySummaryData): Promise<void> {
    try {
      // 1. Vytvoření souhrnné faktury za celý den
      const dailyInvoiceData = {
        clientName: "Denní tržby",
        items: [
          {
            name: "Tržby za služby",
            quantity: 1,
            price: summaryData.servicesRevenue,
            type: "service" as const,
          },
          {
            name: "Tržby za produkty",
            quantity: 1,
            price: summaryData.productsRevenue,
            type: "product" as const,
          },
        ],
        total: summaryData.totalRevenue,
        date: summaryData.date,
        paymentMethod: "cash" as const, // Souhrnná faktura
      }

      const invoiceId = await this.createInvoice(dailyInvoiceData)

      // 2. Vytvoření záznamu o hotovostních a kartových platbách
      await this.createPaymentRecords(summaryData)

      console.log(`Denní uzávěrka úspěšně odeslána do ABRA Flexi. ID faktury: ${invoiceId}`)
    } catch (error) {
      console.error("Chyba při odesílání denní uzávěrky:", error)
      throw error
    }
  }

  // Vytvoření záznamů o platbách
  private async createPaymentRecords(summaryData: DailySummaryData): Promise<void> {
    // Záznam hotovostních plateb
    if (summaryData.cashPayments > 0) {
      await this.makeRequest("pokladni-pohyb", "POST", {
        winstrom: {
          "pokladni-pohyb": [
            {
              typPohybuK: "typPohybu.prijem",
              castka: summaryData.cashPayments,
              datVyst: summaryData.date,
              popis: `Hotovostní platby za ${summaryData.date}`,
            },
          ],
        },
      })
    }

    // Záznam kartových plateb
    if (summaryData.cardPayments > 0) {
      await this.makeRequest("banka", "POST", {
        winstrom: {
          banka: [
            {
              typPohybuK: "typPohybu.prijem",
              castka: summaryData.cardPayments,
              datVyst: summaryData.date,
              popis: `Kartové platby za ${summaryData.date}`,
            },
          ],
        },
      })
    }
  }

  // Test připojení k ABRA Flexi
  async testConnection(): Promise<boolean> {
    try {
      await this.makeRequest("adresar", "GET")
      return true
    } catch (error) {
      console.error("Test připojení k ABRA Flexi selhal:", error)
      return false
    }
  }

  // Získání seznamu kontaktů
  async getContacts(limit = 100): Promise<any[]> {
    const response = await this.makeRequest(`adresar?limit=${limit}`)
    return response.winstrom.adresar || []
  }

  // Synchronizace klienta při vytvoření/aktualizaci
  async syncClient(clientData: {
    id: string
    name: string
    email?: string
    phone?: string
    notes?: string
    abraFlexiId?: string
  }): Promise<string> {
    try {
      if (clientData.abraFlexiId) {
        // Aktualizace existujícího kontaktu
        await this.updateContact(clientData.abraFlexiId, {
          nazev: clientData.name,
          email: clientData.email,
          tel: clientData.phone,
          poznam: clientData.notes,
        })
        return clientData.abraFlexiId
      } else {
        // Vytvoření nového kontaktu
        const abraFlexiId = await this.createContact({
          name: clientData.name,
          email: clientData.email,
          phone: clientData.phone,
          notes: clientData.notes,
        })

        // TODO: Uložit abraFlexiId do databáze klienta
        console.log(`Nový klient synchronizován s ABRA Flexi. ID: ${abraFlexiId}`)

        return abraFlexiId
      }
    } catch (error) {
      console.error("Chyba při synchronizaci klienta:", error)
      throw error
    }
  }
}

// Singleton instance pro ABRA Flexi službu
let abraFlexiService: AbraFlexiService | null = null

export function getAbraFlexiService(): AbraFlexiService {
  if (!abraFlexiService) {
    // Konfigurace by měla být načtena z environment variables
    const config: AbraFlexiConfig = {
      baseUrl: process.env.NEXT_PUBLIC_ABRA_FLEXI_URL || "https://demo.flexibee.eu:5434",
      username: process.env.NEXT_PUBLIC_ABRA_FLEXI_USERNAME || "winstrom",
      password: process.env.NEXT_PUBLIC_ABRA_FLEXI_PASSWORD || "winstrom",
      company: process.env.NEXT_PUBLIC_ABRA_FLEXI_COMPANY || "demo",
    }

    abraFlexiService = new AbraFlexiService(config)
  }

  return abraFlexiService
}

export { AbraFlexiService }
export type { DailySummaryData, AbraFlexiConfig }
