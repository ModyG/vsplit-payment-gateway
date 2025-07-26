# VSplit Payment Gateway - Live Demo

This is a comprehensive Next.js demo application showcasing the VSplit Payment Gateway in action. Perfect for demonstrating to merchants and testing the integration.

## 🚀 Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.example .env.local
   ```

   Then edit `.env.local` and add your Stripe keys:

   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
   STRIPE_SECRET_KEY=sk_test_your_secret_key_here
   ```

3. **Run the demo:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**
   ```
   http://localhost:3000
   ```

## 🎯 Demo Scenarios

### 1. Basic Split Payment (`/demo/basic`)

- Simple 2-way split between merchant and platform
- Adjustable split percentages
- Perfect for SaaS platforms and simple marketplaces

### 2. Restaurant Delivery (`/demo/restaurant`)

- 3-way split: Restaurant, Driver, Platform
- Real-world food delivery scenario
- Order tracking and status updates

### 3. Marketplace (`/demo/marketplace`)

- Multi-vendor marketplace with different commission rates
- Multiple items from different vendors
- Complex split calculations

### 4. More Coming Soon

- Freelance Platform (Escrow payments)
- Event Tickets (Multi-stakeholder splits)
- Custom Integration Builder

## 🛠 Technology Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Payment Gateway:** VSplit (@vegaci_shared/vsplit-payment-gateway)
- **Payments:** Stripe
- **Language:** TypeScript

## 📱 Features

- **Responsive Design:** Works perfectly on desktop and mobile
- **Real-time Updates:** Live payment status and split calculations
- **Interactive Examples:** Fully functional payment demos
- **Code Examples:** Implementation code shown for each scenario
- **TypeScript Support:** Full type safety throughout

## 🔧 Deployment

### Deploy to Vercel (Recommended)

1. **Connect to GitHub:**

   - Push this demo to your GitHub repository
   - Connect your GitHub repo to Vercel

2. **Set Environment Variables in Vercel:**

   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ```

3. **Deploy:**
   - Vercel will automatically deploy on push
   - Your demo will be available at `https://your-app.vercel.app`

### Deploy to Netlify

1. **Build the app:**

   ```bash
   npm run build
   ```

2. **Deploy the `out` folder** to Netlify

## 📖 Using for Merchant Demos

### For Sales Presentations:

1. **Start with Basic Demo** - Show simple concept
2. **Move to Restaurant** - Demonstrate real-world use case
3. **Show Marketplace** - Highlight complex scenarios
4. **Review Code Examples** - Technical implementation

### Key Selling Points:

- ✅ **Instant Setup** - Just add Stripe keys and go
- ✅ **TypeScript First** - Full type safety and IntelliSense
- ✅ **React Ready** - Pre-built components and hooks
- ✅ **Stripe Powered** - Secure, PCI compliant infrastructure
- ✅ **Flexible Splits** - Support any split scenario
- ✅ **Real-time** - Instant payment distribution

## 🔗 Links

- **Live Demo:** [Add your Vercel URL here]
- **NPM Package:** https://www.npmjs.com/package/@vegaci_shared/vsplit-payment-gateway
- **GitHub:** https://github.com/ModyG/vsplit-payment-gateway
- **Documentation:** [Your domain]/docs

## 📞 Support

For questions about the VSplit Payment Gateway:

- 📧 Email: [your-email@domain.com]
- 💬 GitHub Issues: https://github.com/ModyG/vsplit-payment-gateway/issues
- 📚 Documentation: [Your domain]/docs

## 📄 License

This demo is part of the VSplit Payment Gateway project. See the main repository for license details.
