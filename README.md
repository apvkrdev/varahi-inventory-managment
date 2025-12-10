# Varahi Inventory Manager - Caustic Soda Flakes

A complete, production-ready full-stack MERN application for managing inventory, sales, purchases, and payments.

## 🚀 Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: SCSS (Sass) - No Tailwind CSS
- **State Management**: Jotai
- **Backend**: Next.js API Routes & Server Actions
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth with Credentials Provider
- **Password Hashing**: bcryptjs

## 📋 Key Features

- ✅ User authentication with secure passwords
- ✅ Purchases management with supplier tracking
- ✅ Sales management with payment tracking
- ✅ Payment recording and history
- ✅ Dashboard with real-time analytics
- ✅ Responsive SCSS-based UI
- ✅ Protected routes with middleware
- ✅ Server Actions for type-safe mutations

## 🛠️ Installation

### Prerequisites
- Node.js 18+
- MongoDB

### Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local`:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key
MONGODB_URI=mongodb://localhost:27017/trading-inventory
```

3. Start MongoDB and dev server:
```bash
mongod  # Terminal 1
npm run dev  # Terminal 2
```

4. Visit http://localhost:3000

## 📱 Usage

1. **Register** at `/register`
2. **Login** at `/login`
3. Use **Dashboard** for analytics
4. Manage **Purchases**, **Sales**, **Payments**

## 🗄️ Database Models

- **User** - Authentication with hashed passwords
- **Purchase** - Supplier purchases tracking
- **Sale** - Customer sales with payment status
- **Payment** - Payment records linked to sales

## 🎨 SCSS Structure

- `styles/variables.scss` - Colors, spacing, breakpoints
- `styles/mixins.scss` - Responsive utilities, component mixins
- `styles/globals.scss` - Global resets
- Component modules - Isolated component styles

## 📊 Server Actions

```typescript
// Purchases
await getPurchases()
await createPurchase(data)

// Sales
await getSales()
await createSale(data)
await updateSalePayment(saleId, amount)

// Payments
await getPayments()
await createPayment(data)

// Dashboard
await getDashboardStats()
```

## 🔐 Authentication

- Credentials-based login/registration
- Bcryptjs password hashing
- Session-based auth (24-hour expiry)
- Protected routes via middleware

## 🌟 Jotai Atoms

Client-side state atoms for:
- Selected sale
- Modal state
- Theme mode
- Form states
- Loading/error/success messages

## 📈 API Endpoints

- `POST /api/auth/register` - Register user
- `GET|POST /api/purchases` - Purchases CRUD
- `GET|POST /api/sales` - Sales CRUD
- `PATCH /api/sales/[id]` - Update payment
- `GET|POST /api/payments` - Payments CRUD

## 🚀 Commands

```bash
npm run dev      # Development
npm run build    # Build
npm start        # Production
npm run lint     # Linting
```

## 🚢 Deploy

**Vercel** (Recommended):
1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Auto-deploy on push

## 📁 Project Structure

```
app/
  (authenticated)/
    dashboard/
    purchases/
    sales/
    payments/
  api/
  login/
  register/

lib/
  actions/      - Server actions
  db/           - MongoDB connection
  models/       - Mongoose schemas
  store/        - Jotai atoms

components/     - Reusable UI components
styles/         - SCSS files
middleware.ts   - Route protection
```

## ✨ Features Breakdown

### Dashboard
- Total purchased quantity
- Total sold quantity
- Remaining stock
- Total purchase amount
- Amount received
- Pending amount
- Recent transactions feed

### Purchases
- Add new purchases
- Track supplier details
- View purchase history
- Automatic amount calculation

### Sales
- Create sales records
- Track customer payments
- Add payment records
- Auto-calculate pending amounts
- Modal for payment entry

### Payments
- Record payment receipts
- Filter sales by pending status
- Update sale payment status
- View payment history

## 🔒 Security Features

- Password hashing with bcryptjs (10 rounds)
- NextAuth session management
- Middleware route protection
- CSRF protection via NextAuth
- Type-safe server actions

## 🎯 Production Ready

- ✅ Error handling
- ✅ Input validation
- ✅ Type safety (TypeScript)
- ✅ Responsive design
- ✅ SEO optimized
- ✅ Performance optimized
- ✅ Security hardened

## 📝 Notes

- All mutations use Server Actions (type-safe)
- All requests require authentication
- Pending amount auto-calculated on sales
- Payment updates sale status automatically
- Dashboard stats update in real-time

## 🆘 Troubleshooting

**MongoDB Connection Failed**
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env.local`

**Auth Issues**
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches domain
- Clear cookies if session problems persist

**SCSS Errors**
- Ensure sass is installed: `npm install sass`
- Check for syntax errors in `.scss` files

---

**Ready to use! 🎉**
