# VSplit Demo - Deployment Guide

## 🚀 Quick Deploy to Vercel

### Method 1: One-Click Deploy (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FModyG%2Fvsplit-payment-gateway&project-name=vsplit-demo&repository-name=vsplit-demo&root-directory=demo%2Fvsplit-demo&env=NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,STRIPE_SECRET_KEY)

### Method 2: Manual Deploy

1. **Fork/Clone the repository**
2. **Push to your GitHub**
3. **Connect to Vercel:**

   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set root directory to `demo/vsplit-demo`

4. **Set Environment Variables in Vercel:**

   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
   STRIPE_SECRET_KEY=sk_test_your_secret_key_here
   ```

5. **Deploy!** 🎉

## 🔧 Environment Variables

| Variable                             | Description                      | Required    |
| ------------------------------------ | -------------------------------- | ----------- |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key      | ✅ Yes      |
| `STRIPE_SECRET_KEY`                  | Your Stripe secret key           | ✅ Yes      |
| `NEXT_PUBLIC_VSPLIT_API_ENDPOINT`    | VSplit API endpoint              | ❌ Optional |
| `NEXT_PUBLIC_VSPLIT_ENVIRONMENT`     | Environment (sandbox/production) | ❌ Optional |

## 📱 Getting Stripe Keys

1. **Create Stripe Account:** [stripe.com](https://stripe.com)
2. **Get Test Keys:** Go to Dashboard → Developers → API Keys
3. **Copy Keys:**
   - Publishable key: `pk_test_...`
   - Secret key: `sk_test_...`

## 🎯 Post-Deployment

After deploying:

1. **Test all demo scenarios**
2. **Update the main README** with your live demo URL
3. **Share with merchants** and prospects
4. **Monitor usage** in Vercel analytics

## 🔗 Other Deployment Options

### Netlify

```bash
npm run build
# Deploy the 'out' folder to Netlify
```

### AWS Amplify

- Connect your GitHub repository
- Set build command: `npm run build`
- Set publish directory: `out`

### Railway

```bash
# Connect GitHub repo to Railway
# Set start command: npm start
```

## 📊 Analytics & Monitoring

Consider adding:

- **Vercel Analytics** for usage tracking
- **Sentry** for error monitoring
- **PostHog** for user behavior analysis
- **Google Analytics** for detailed insights

## 🛡️ Security Notes

- Always use **test keys** for the demo
- Never commit secrets to GitHub
- Use environment variables in production
- Enable HTTPS (automatic on Vercel)

## 📞 Support

Need help deploying?

- 📧 Email: [your-email]
- 💬 GitHub Issues: [Create Issue](https://github.com/ModyG/vsplit-payment-gateway/issues)
- 📚 Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
