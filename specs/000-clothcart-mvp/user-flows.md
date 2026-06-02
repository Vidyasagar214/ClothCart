# User Flows
# ClothCart MVP

---

## Flow 1: Guest Browse → Purchase

```mermaid
flowchart TD
    A[Land on Home] --> B[Browse Category]
    B --> C[Apply Filters/Sort]
    C --> D[View Product Detail]
    D --> E{Add to Cart?}
    E -->|Yes| F[Select Size/Color/Qty]
    F --> G[Add to Cart]
    G --> H[View Cart]
    H --> I{Logged in?}
    I -->|No| J[Login/Register Prompt]
    J --> K[Authenticate]
    K --> L[Checkout]
    I -->|Yes| L
    L --> M[Enter Shipping Address]
    M --> N[Select Payment Method]
    N --> O[Review Order]
    O --> P[Place Order]
    P --> Q{Payment Type}
    Q -->|Online| R[Razorpay Gateway]
    R --> S[Payment Verified]
    Q -->|COD| S
    S --> T[Order Confirmation]
    T --> U[Track Order]
```

---

## Flow 2: User Registration (Email)

```mermaid
flowchart TD
    A[Click Register] --> B[Enter Email, Password, Name]
    B --> C{Valid?}
    C -->|No| D[Show Validation Errors]
    D --> B
    C -->|Yes| E[Create Account via Supabase]
    E --> F[Send Welcome Email]
    F --> G[Auto Login]
    G --> H[Merge Guest Cart if exists]
    H --> I[Redirect to Home/Checkout]
```

---

## Flow 3: User Registration (Mobile OTP)

```mermaid
flowchart TD
    A[Choose Mobile Login] --> B[Enter Phone Number]
    B --> C[Send OTP via Twilio]
    C --> D[Enter 6-digit OTP]
    D --> E{Valid OTP?}
    E -->|No| F[Show Error / Resend]
    F --> D
    E -->|Yes| G{Existing User?}
    G -->|No| H[Enter Name → Create Account]
    G -->|Yes| I[Login]
    H --> I
    I --> J[Redirect]
```

---

## Flow 4: Search & Filter

```mermaid
flowchart TD
    A[Type in Search Bar] --> B[Debounce 300ms]
    B --> C[API: GET /products/search?q=]
    C --> D[Display Results]
    D --> E[Open Filter Panel]
    E --> F[Select Filters]
    F --> G[Apply Sort]
    G --> H[Update URL Query Params]
    H --> I[Re-fetch Products]
    I --> D
```

---

## Flow 5: Wishlist Management

```mermaid
flowchart TD
    A[Click Heart on Product] --> B{Logged in?}
    B -->|No| C[Show Login Modal]
    C --> D[Login]
    D --> E[Add to Wishlist]
    B -->|Yes| E
    E --> F[View Wishlist Page]
    F --> G{Action}
    G -->|Move to Cart| H[Select Variant if needed]
    H --> I[Add to Cart + Remove from Wishlist]
    G -->|Remove| J[Delete from Wishlist]
```

---

## Flow 6: Order Tracking

```mermaid
flowchart TD
    A[Go to Orders] --> B[View Order List]
    B --> C[Click Order]
    C --> D[View Timeline]
    D --> E{Status}
    E -->|Pending/Confirmed| F[Cancel Order Option]
    E -->|Shipped| G[View Tracking Number]
    E -->|Delivered| H[Write Review / Request Return]
    F --> I[Confirm Cancel]
    I --> J[Restock Inventory]
    J --> K[Refund if Paid]
```

---

## Flow 7: Product Review

```mermaid
flowchart TD
    A[Delivered Order] --> B[Click Write Review]
    B --> C{Verified Purchase?}
    C -->|No| D[403 Error]
    C -->|Yes| E[Rate 1-5 Stars]
    E --> F[Write Review Text]
    F --> G[Submit]
    G --> H[Status: Pending]
    H --> I[Admin Moderates]
    I --> J{Decision}
    J -->|Approve| K[Visible on Product Page]
    J -->|Reject| L[Hidden, User Notified]
```

---

## Flow 8: Return Request

```mermaid
flowchart TD
    A[Order Delivered] --> B{Within 7 days?}
    B -->|No| C[Return Window Expired]
    B -->|Yes| D[Select Order Item]
    D --> E[Choose Reason]
    E --> F[Submit Return Request]
    F --> G[Status: Requested]
    G --> H[Admin Reviews]
    H --> I{Decision}
    I -->|Approve| J[Schedule Pickup]
    J --> K[Status: Picked Up]
    K --> L[Process Refund]
    L --> M[Status: Refunded]
    I -->|Reject| N[Notify Customer with Reason]
```

---

## Flow 9: Admin Product Management

```mermaid
flowchart TD
    A[Admin Login] --> B[Dashboard]
    B --> C[Products Module]
    C --> D{Action}
    D -->|Create| E[Product Form]
    E --> F[Add Variants + Images]
    F --> G[Upload to Supabase Storage]
    G --> H[Save Product]
    D -->|Edit| I[Load Product]
    I --> E
    D -->|Inventory| J[Update Stock Levels]
    J --> K[Log Inventory Change]
```

---

## Flow 10: Admin Order Fulfillment

```mermaid
flowchart TD
    A[New Order Notification] --> B[View in Admin Orders]
    B --> C[Verify Payment]
    C --> D[Update Status: Confirmed]
    D --> E[Pick & Pack]
    E --> F[Update Status: Processing]
    F --> G[Add Tracking Number]
    G --> H[Update Status: Shipped]
    H --> I[Send Shipping Email/SMS]
    I --> J[Delivery Confirmed]
    J --> K[Update Status: Delivered]
```

---

## Edge Cases & Error Flows

| Scenario | Flow |
|----------|------|
| Out of stock at checkout | Block checkout, show OOS items, suggest remove |
| Payment failure | Show retry option, order stays pending |
| Session expired | Redirect to login, preserve cart |
| Invalid pincode | Address validation error, suggest correction |
| Duplicate review | 409 error, show existing review |
| Cancel after shipped | Disable cancel, suggest return flow |
| COD order > ₹5000 | Block COD, suggest online payment |
