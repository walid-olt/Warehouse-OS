# 📦 Sprint 2: WarehouseOS Business Logic & Inventory

**🎯 Sprint Goal:** Bring the warehouse to life. You will build the core CRUD (Create, Read, Update, Delete/Archive) operations for Categories and Products, implement a strict Stock Movement system, and build out the Dashboard.

### 🛑 Strict Tech Constraints (Zero Exceptions)

- **TypeScript ONLY:** `.ts` or `.tsx` only. No `.js`.
- **NO `any`:** Strictly type all your variables, props, and API responses.
- **API HANDLERS ONLY:** React components cannot talk to MongoDB directly. All DB operations must happen inside Route Handlers (`/api/...`).
- **SERVER-SIDE VALIDATION:** Every API route must validate incoming data using **Zod**.

---

## 📅 Deadlines & Delivery

- **Launch Date:** July 27, 2026
- **Submission Deadline:** Friday, July 31, 2026, before 18:00 🚨 _(Hard deadline)_
- **Final GitHub Push:** Sunday, August 2, 2026, before 23:59

---

## 📋 Task Breakdown

### Phase 1: Database Models & Zod Schemas 🗄️

_Create these first so your API and Forms know what data to expect._

- [ ] **Category Model**
- `name` (String)
- `description` (String)
- `createdAt` (Date)

- [ ] **Product Model**
- `name` (String) - _Zod: min 3 chars, required_
- `sku` (String) - _Zod: unique, required_
- `description` (String)
- `category` (ObjectId/Ref to Category) - _Required_
- `price` (Number) - _Zod: positive number, required_
- `stockQuantity` (Number) - _Zod: positive integer or 0_
- `isArchived` (Boolean, default: false)

- [ ] **StockMovement Model**
- `productId` (ObjectId/Ref to Product)
- `type` (String: `"IN"` or `"OUT"`)
- `quantity` (Number) - _Zod: positive integer_
- `note` (String, optional)
- `createdAt` (Date)

---

### Phase 2: Category Management 📁

- [ ] Create page `/categories`.
- [ ] Build **Category List**: Fetch and display all categories.
- [ ] Build **Add Category** feature (Form + API Route).
- [ ] Build **Edit Category** feature (Form + API Route).
- [ ] Build **Archive Category** feature (API Route).

---

### Phase 3: Product Management 🏷️

- [ ] Create page `/products`.
- Display list of products showing: Name, SKU, Category, Price, and Stock Quantity.

- [ ] Create page `/products/create` (Add Product).
- Build form with fields: Name, SKU, Description, Category (dropdown), Price, Initial Quantity.
- Create `POST /api/products` route with strict Zod validation.
- ➡️ Redirect to `/products` on success.

- [ ] Create Dynamic Route `/products/[id]` (Product Details).
- Display all product details clearly (Name, SKU, Description, Category, Price, Available Stock).

- [ ] Build **Edit Product** feature.
- [ ] Build **Archive Product** feature.

---

### Phase 4: Stock Movements (The Core Logic) 🔄

- [ ] Create a UI (Page or Modal) to record a movement.
- Fields: Product (dropdown), Type (`IN` or `OUT`), Quantity, Note (optional).

- [ ] Create API Route `POST /api/stock/move`.
- **Rule 1:** Validate data with Zod.
- **Rule 2 (CRITICAL):** If type is `OUT`, query the current stock. **Reject the operation** if the requested quantity is greater than available stock.
- **Rule 3:** If valid, save the `StockMovement` document.
- **Rule 4:** Update the `stockQuantity` on the parent `Product` document.

---

### Phase 5: Dashboard (`/dashboard`) 📊

_Update the dashboard you created in Sprint 1 to show real data._

- [ ] Fetch and display **Total Products**.
- [ ] Fetch and display **Total Categories**.
- [ ] Fetch and display **Low Stock Products** count (define a threshold, e.g., < 10).
- [ ] Fetch and display a list of **Recent Movements** (e.g., last 5 entries).

---

### Phase 6: History & Filtering (Bonus) 🏆

- [ ] Create page `/stock/movements`.
- [ ] Display a table of all movements.
- Columns: Product, Type, Quantity, Date.

- [ ] Add a **Filter** to sort/view movements by specific Product.
