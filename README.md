# Vivaio Manager 🌿

Applicazione Next.js per la gestione completa di un vivaio di ulivi e agrumi con inventario, ordinazioni e monitoraggio finanziario.

## Requisiti

- Node.js 16+ 
- npm o yarn

## Installazione e Avvio

### 1. Installa le dipendenze
```bash
npm install
```

### 2. Avvia il server di sviluppo
```bash
npm run dev
```

### 3. Apri nel browser
Vai a **http://localhost:3000**

## Caratteristiche

### 📋 Inventario
- Visualizza tutte le piante (ulivi e agrumi) con giacenze
- Aggiungi nuove varietà
- Modifica le quantità con conferma a due step
- Modifica additiva: +5 aggiunge 5 piante, -3 ne toglie 3
- Visualizzazione visuale della differenza
- Alert giacenze basse (< 15 unità)

### 📦 Ordinazioni
- Crea ordinazioni con cliente, piante, quantità e importo
- Gestione stato ordine (In sospeso, Confermato, Spedito, Consegnato)
- Tracciamento pagamenti (In sospeso, Parziale, Pagato)
- Scalamento automatico giacenze quando ordini viene creato
- Modifica stato ordine
- Ripristino giacenze se annulli ordine
- Visualizzazione totale ordine

### 📊 Dashboard
- **KPI Principali**: Ricavi incassati, Ricavi in sospeso, Spese totali, Utile/Perdita
- **Stato Inventario**: Totale piante, Varietà, Ordini attivi
- **Gestione Spese**: Aggiungi, visualizza e elimina spese
- Calcolo automatico utile netto (Ricavi - Spese)

## Come usare

### Aggiungere una pianta
1. Tab "Inventario"
2. Clicca "+ Nuova pianta"
3. Compila nome, tipo (ulivo/agrumi) e giacenza
4. Clicca "Aggiungi pianta"

### Modificare la giacenza
1. Nel tab "Inventario", clicca sul numero di piante (badge colorato)
2. Inserisci la modifica: +5 per aggiungere, -3 per togliere
3. Visualizza il calcolo: giacenza attuale + modifica = nuova giacenza
4. Clicca "Conferma" e conferma nella finestra
5. La giacenza si aggiorna

### Creare un'ordinazione
1. Tab "Ordinazioni"
2. Clicca "+ Nuova ordinazione"
3. Inserisci nome cliente
4. Seleziona piante e quantità (puoi aggiungere più articoli)
5. Scegli stato ordine e stato pagamento
6. Inserisci importo totale ordine
7. Clicca "Crea ordinazione"
8. L'inventario si aggiorna automaticamente

### Registrare una spesa
1. Tab "Dashboard"
2. Clicca "+ Nuova spesa"
3. Descrivi la spesa (es: "Fertilizzante")
4. Inserisci importo
5. Clicca "Registra spesa"
6. La Dashboard aggiorna automaticamente l'utile netto

## Struttura progetto

```
vivaio-manager/
├── app/
│   ├── components/
│   │   └── VivaioCultivare.tsx    # Componente principale
│   ├── page.tsx                    # Home page
│   ├── layout.tsx                  # Layout root
│   └── globals.css                 # Stili globali
├── package.json                    # Dipendenze
├── tailwind.config.js              # Config Tailwind
├── postcss.config.js               # Config PostCSS
├── next.config.js                  # Config Next.js
└── README.md                       # Questo file
```

## Tech Stack

- **Next.js 14** - Framework React
- **React 18** - UI library
- **Tailwind CSS** - Styling
- **Lucide React** - Icone
- **TypeScript** - Type safety

## Deployment su Vercel

1. Carica il progetto su GitHub
2. Vai a [vercel.com](https://vercel.com)
3. Importa il repository
4. Clicca "Deploy"
5. L'app sarà live in pochi secondi!

## Perseveranza nell'uso

I dati rimangono in memoria durante la sessione. Per persistenza permanente, considera:
- Aggiungere localStorage per salvataggio locale
- Integrare un database (Firebase, Supabase, MongoDB)
- Aggiungere autenticazione per multi-utente

## Contatti e supporto

Per domande o modifiche, contatta lo sviluppatore.

---

Buona gestione del vivaio! 🌿🍊
