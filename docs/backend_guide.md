# SwiftCart Backend Guide (Step-by-Step) 🚀

Hello! Agar aap backend development me naye hain, toh ye guide aapko help karegi samajhne me ki humne backend ko kaise organize kiya hai. Humne **Controller-Service Pattern** use kiya hai, jo ki ek expert standard hai.

---

### 1. App Ka Structure (Architectural Flow)
Backend me jab bhi koi request aati hai (jaise: "Sare products dikhao"), wo is raaste se guzarti hai:
`Route` ➔ `Middleware` ➔ `Controller` ➔ `Service` ➔ `Prisma (Database)`

### 2. Step-by-Step Logic 🧠

#### Step A: Routes (`src/routes/productRoutes.ts`)
Ye file batati hai ki kaunsa URL kis function ko call karega. 
*Example:* `GET /api/products` ➔ `productController.getProducts`

#### Step B: Controller (`src/controllers/productController.ts`)
Controller ka kaam hai **Request** ko lena aur **Response** dena. 
- Ye database se baat nahi karta directly.
- Ye sirf check karta hai ki user ne kya data bheja hai (query params, body, etc.).
- Phir ye **Service** ko awaaz lagata hai.

#### Step C: Service (`src/services/productService.ts`) **[NEW]**
Ye humare backend ka "Dimaag" (Brain) hai. Sari database queries (Prisma) yahi likhi hoti hain.
- **Kyu?** Taaki agar kal ko hum database badle ya logic change kare, toh humein sirf ek jagah change karna pade. 
- Isse code clean rehta hai aur errors kam hote hain.

---

### 3. Ek Example: Get All Products logic
1. **Request aayi**: User ne bola "Electronics" category ke products chahiye.
2. **Controller ne pakda**: `req.query` se `category` nikala aur `productService.findAllProducts()` ko bhej diya.
3. **Service ne Prisma chalaya**: 
   ```typescript
   prisma.product.findMany({ where: { category: 'Electronics' } })
   ```
4. **Data wapas gaya**: Service ne data Controller ko diya, aur Controller ne aapke Frontend (React) ko bhej diya.

---

### 4. Indian Rupees (INR) Handling
Humne prices ko database me `Float` format me rakha hai. Frontend me humne ek utility banayi hai `formatCurrency.ts` jo ise automatic **₹** symbol ke saath dikhati hai. Isse calculation asaan rehti hai aur display professional lagta hai.

### 5. Pro Tip for Clean Code
Hamesha functions ke naam aise rakho jo unka kaam batayein, jaise `findProductById` ya `createNewProduct`. Isse koi bhi doosra developer aapka code aasani se samajh sakta hai.

Happy Coding! Agar kuch na samjh aaye toh mujhse pucho. 😊
