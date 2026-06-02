# Test Cases & Acceptance Criteria
# ClothCart MVP

---

## F-001: Authentication

### TC-AUTH-001: Email Registration — Happy Path
**Precondition:** Email not registered  
**Steps:**
1. Navigate to `/register`
2. Enter valid email, password (8+ chars, 1 upper, 1 number), full name
3. Submit form

**Expected:** Account created, user logged in, redirected to home, welcome email sent  
**Acceptance Criteria:**
- [ ] HTTP 201 from `/api/v1/auth/register`
- [ ] Profile row created in `profiles` table
- [ ] Session cookie set
- [ ] Password not returned in response

### TC-AUTH-002: Email Registration — Duplicate Email
**Steps:** Register with existing email  
**Expected:** HTTP 409, error message "Email already registered"  
**Acceptance Criteria:**
- [ ] No duplicate profile created
- [ ] User remains on register page with error

### TC-AUTH-003: Login — Valid Credentials
**Steps:** Enter registered email + correct password  
**Expected:** HTTP 200, session created, redirect to previous page or home  
**Acceptance Criteria:**
- [ ] JWT access + refresh tokens issued
- [ ] `/api/v1/auth/me` returns user profile

### TC-AUTH-004: Login — Invalid Credentials
**Steps:** Enter wrong password 5 times  
**Expected:** HTTP 401; after 5th attempt, account locked 15 min  
**Acceptance Criteria:**
- [ ] Lockout message displayed
- [ ] 6th attempt within 15 min returns 429

### TC-AUTH-005: OTP Login — Happy Path
**Steps:** Enter +91 phone, receive OTP, enter correct OTP  
**Expected:** User logged in or registered if new  
**Acceptance Criteria:**
- [ ] OTP expires after 5 minutes
- [ ] Max 3 OTP resends per hour

### TC-AUTH-006: Password Reset
**Steps:** Request reset → click email link → set new password → login  
**Expected:** New password works; old password fails  
**Acceptance Criteria:**
- [ ] Reset link expires after 1 hour
- [ ] Link single-use

### TC-AUTH-007: Logout
**Steps:** Click logout while authenticated  
**Expected:** Session invalidated, redirect to home, protected routes blocked  
**Acceptance Criteria:**
- [ ] Refresh token revoked
- [ ] `/api/v1/auth/me` returns 401

### TC-AUTH-008: Session Refresh
**Steps:** Wait for access token expiry with valid refresh token  
**Expected:** Silent refresh, no logout  
**Acceptance Criteria:**
- [ ] New access token issued automatically

---

## F-002: Product Catalog

### TC-CAT-001: Browse by Category — Men
**Steps:** Click Men category  
**Expected:** Only men's products displayed  
**Acceptance Criteria:**
- [ ] All products have category.gender = 'men' or men subcategory
- [ ] Product cards show image, name, price, rating, stock badge
- [ ] 24 products per page default

### TC-CAT-002: Pagination
**Steps:** Navigate to page 2  
**Expected:** Next 24 products loaded; URL shows `?page=2`  
**Acceptance Criteria:**
- [ ] Pagination meta correct (total, totalPages)
- [ ] Page 1 products not duplicated

### TC-CAT-003: Out of Stock Display
**Precondition:** Product variant stock_quantity = 0  
**Expected:** "Out of Stock" badge; Add to Cart disabled  
**Acceptance Criteria:**
- [ ] Stock badge visible on card
- [ ] No add-to-cart action possible

### TC-CAT-004: Featured Products on Home
**Steps:** Load home page  
**Expected:** Featured products section shows is_featured = true products  
**Acceptance Criteria:**
- [ ] Max 8 featured products
- [ ] Images lazy-loaded

---

## F-003: Search & Filters

### TC-SRCH-001: Keyword Search
**Steps:** Search "cotton shirt"  
**Expected:** Results match name, description, brand, or tags  
**Acceptance Criteria:**
- [ ] Min 2 characters required
- [ ] Debounce 300ms
- [ ] Result count displayed

### TC-SRCH-002: Combined Filters
**Steps:** Filter: Men + Brand Nike + Price ₹500–2000 + Size M  
**Expected:** Only matching products shown  
**Acceptance Criteria:**
- [ ] Filters combine with AND logic
- [ ] URL reflects all active filters
- [ ] Clear filters resets all

### TC-SRCH-003: Sort by Price Low to High
**Steps:** Apply sort price_asc  
**Expected:** Products ordered by base_price ascending  
**Acceptance Criteria:**
- [ ] First product has lowest price
- [ ] Sort persists on pagination

### TC-SRCH-004: Sort by Popularity
**Steps:** Apply sort popularity  
**Expected:** Products ordered by order count descending  
**Acceptance Criteria:**
- [ ] Best-selling product appears first

### TC-SRCH-005: Empty Search Results
**Steps:** Search nonsense string "xyzabc123"  
**Expected:** Empty state with suggestion to browse categories  
**Acceptance Criteria:**
- [ ] No error thrown
- [ ] Helpful empty state UI

---

## F-004: Product Detail

### TC-PROD-001: View Product Detail
**Steps:** Click product from listing  
**Expected:** Full detail page with gallery, variants, description, reviews  
**Acceptance Criteria:**
- [ ] All FR-PROD-001 fields displayed
- [ ] Correct product loaded by slug

### TC-PROD-002: Image Zoom
**Steps:** Hover image (desktop) or pinch (mobile)  
**Expected:** Zoomed view of image  
**Acceptance Criteria:**
- [ ] Lightbox opens on click
- [ ] Thumbnail navigation works

### TC-PROD-003: Variant Selection
**Steps:** Select size L, color Blue  
**Expected:** Price/images update if variant-specific; stock checked  
**Acceptance Criteria:**
- [ ] Cannot select OOS size/color combo
- [ ] SKU displayed for selected variant

### TC-PROD-004: Related Products
**Steps:** Scroll to related section  
**Expected:** Up to 8 products from same category, excluding current  
**Acceptance Criteria:**
- [ ] Current product not in related list
- [ ] Links navigate to correct product

---

## F-005: Shopping Cart

### TC-CART-001: Add to Cart
**Precondition:** Product in stock, size/color selected  
**Steps:** Click Add to Cart  
**Expected:** Item added; cart count badge updates  
**Acceptance Criteria:**
- [ ] HTTP 201 from POST `/cart/items`
- [ ] Toast confirmation shown
- [ ] Cart drawer opens (optional)

### TC-CART-002: Update Quantity
**Steps:** Increase quantity to 3  
**Expected:** Line total and cart total recalculated  
**Acceptance Criteria:**
- [ ] Cannot exceed stock_quantity
- [ ] Subtotal = Σ(price × qty)

### TC-CART-003: Remove Item
**Steps:** Click remove on cart item  
**Expected:** Item removed; totals updated  
**Acceptance Criteria:**
- [ ] HTTP 204
- [ ] Empty cart shows empty state

### TC-CART-004: Price Calculations
**Precondition:** Cart subtotal ₹800  
**Expected:** Tax 18%, shipping ₹99 (below ₹999 threshold)  
**Acceptance Criteria:**
- [ ] tax = (800) × 0.18 = ₹144
- [ ] shipping = ₹99
- [ ] total = 800 + 144 + 99 = ₹1043

### TC-CART-005: Free Shipping Threshold
**Precondition:** Cart subtotal ₹1200  
**Expected:** shipping = ₹0  
**Acceptance Criteria:**
- [ ] "Free shipping" badge shown
- [ ] total = subtotal + tax

### TC-CART-006: Guest Cart Merge on Login
**Precondition:** Guest has 2 items in cart  
**Steps:** Login  
**Expected:** Guest cart items merged into user cart  
**Acceptance Criteria:**
- [ ] No duplicate variant entries
- [ ] Quantities summed for same variants

### TC-CART-007: Add OOS Item
**Steps:** Attempt add when stock = 0  
**Expected:** HTTP 400, error "Insufficient stock"  
**Acceptance Criteria:**
- [ ] Cart unchanged

---

## F-006: Wishlist

### TC-WISH-001: Add to Wishlist (Authenticated)
**Steps:** Click heart icon while logged in  
**Expected:** Product saved to wishlist; heart filled  
**Acceptance Criteria:**
- [ ] HTTP 201
- [ ] Persists across sessions

### TC-WISH-002: Add to Wishlist (Guest)
**Steps:** Click heart while not logged in  
**Expected:** Login prompt modal  
**Acceptance Criteria:**
- [ ] No wishlist entry created
- [ ] After login, can add

### TC-WISH-003: Move to Cart
**Steps:** Click "Move to Cart" on wishlist item  
**Expected:** Item added to cart, removed from wishlist  
**Acceptance Criteria:**
- [ ] Variant selection if multiple variants
- [ ] Cart count updated

### TC-WISH-004: Remove from Wishlist
**Steps:** Click remove/heart toggle  
**Expected:** Item removed from wishlist  
**Acceptance Criteria:**
- [ ] HTTP 204

---

## F-007: Checkout & Payments

### TC-CHK-001: Checkout Requires Auth
**Steps:** Navigate to `/checkout` as guest  
**Expected:** Redirect to login  
**Acceptance Criteria:**
- [ ] Return URL preserved

### TC-CHK-002: Address Validation
**Steps:** Submit address with invalid pincode "12345"  
**Expected:** Validation error  
**Acceptance Criteria:**
- [ ] Pincode must be 6 digits
- [ ] All required fields validated

### TC-CHK-003: Pincode Serviceability
**Steps:** Enter unserviceable pincode  
**Expected:** Error "Delivery not available to this pincode"  
**Acceptance Criteria:**
- [ ] Cannot proceed to payment

### TC-CHK-004: Card Payment — Success
**Steps:** Select Card → Place Order → Complete Razorpay test payment  
**Expected:** Order confirmed, payment status completed  
**Acceptance Criteria:**
- [ ] Unique order_number generated
- [ ] Stock decremented
- [ ] Confirmation email sent
- [ ] Redirect to confirmation page

### TC-CHK-005: Payment Failure
**Steps:** Fail Razorpay payment  
**Expected:** Order stays pending; retry option shown  
**Acceptance Criteria:**
- [ ] Stock NOT decremented
- [ ] User can retry payment

### TC-CHK-006: COD Order
**Steps:** Select COD, place order  
**Expected:** Order created with payment_method = cod, status confirmed  
**Acceptance Criteria:**
- [ ] No Razorpay gateway invoked
- [ ] COD disabled for orders > ₹5000

### TC-CHK-007: OOS at Checkout
**Precondition:** Item goes OOS between cart add and checkout  
**Steps:** Attempt place order  
**Expected:** Blocked with OOS item highlighted  
**Acceptance Criteria:**
- [ ] Order not created

---

## F-008: Order Management

### TC-ORD-001: View Order History
**Steps:** Navigate to `/orders`  
**Expected:** Paginated list, newest first  
**Acceptance Criteria:**
- [ ] Only user's own orders visible
- [ ] Status badge on each order

### TC-ORD-002: Order Detail Timeline
**Steps:** Click order  
**Expected:** Timeline shows status progression  
**Acceptance Criteria:**
- [ ] All status timestamps displayed
- [ ] Tracking number shown if shipped

### TC-ORD-003: Cancel Order — Before Shipment
**Precondition:** Order status = confirmed  
**Steps:** Click Cancel → Confirm  
**Expected:** Status = cancelled; stock restored  
**Acceptance Criteria:**
- [ ] cancelled_at timestamp set
- [ ] Refund initiated if paid online

### TC-ORD-004: Cancel Order — After Shipped
**Precondition:** Order status = shipped  
**Steps:** Attempt cancel  
**Expected:** Cancel button disabled; suggest return  
**Acceptance Criteria:**
- [ ] HTTP 400

### TC-ORD-005: Admin Update Status
**Steps:** Admin changes status to shipped with tracking #  
**Expected:** Customer sees updated status; notification sent  
**Acceptance Criteria:**
- [ ] tracking_number saved
- [ ] shipped_at timestamp set

---

## F-009: Reviews & Ratings

### TC-REV-001: Submit Review — Verified Purchase
**Precondition:** Delivered order containing product  
**Steps:** Rate 5 stars, write review, submit  
**Expected:** Review created with status pending  
**Acceptance Criteria:**
- [ ] HTTP 201
- [ ] Not visible until approved

### TC-REV-002: Submit Review — Not Purchased
**Steps:** Attempt review without purchase  
**Expected:** HTTP 403  
**Acceptance Criteria:**
- [ ] Error "Verified purchase required"

### TC-REV-003: Duplicate Review
**Steps:** Submit second review for same product  
**Expected:** HTTP 409  
**Acceptance Criteria:**
- [ ] Existing review unchanged

### TC-REV-004: Admin Approve Review
**Steps:** Admin approves pending review  
**Expected:** Review visible on product page; avg rating updated  
**Acceptance Criteria:**
- [ ] status = approved
- [ ] product_ratings_view updated

### TC-REV-005: Admin Reject Review
**Steps:** Admin rejects review  
**Expected:** Review hidden; not counted in rating  
**Acceptance Criteria:**
- [ ] status = rejected

---

## F-010: Returns & Refunds

### TC-RET-001: Request Return — Within Window
**Precondition:** Delivered 3 days ago  
**Steps:** Select item, reason "size_issue", submit  
**Expected:** Return created with status requested  
**Acceptance Criteria:**
- [ ] HTTP 201
- [ ] Confirmation shown

### TC-RET-002: Request Return — Outside Window
**Precondition:** Delivered 10 days ago  
**Steps:** Attempt return  
**Expected:** HTTP 400 "Return window expired"  
**Acceptance Criteria:**
- [ ] No return record created

### TC-RET-003: Admin Approve Return
**Steps:** Admin approves return  
**Expected:** Status = approved; customer notified  
**Acceptance Criteria:**
- [ ] refund_amount calculated

### TC-RET-004: Refund Completed
**Steps:** Admin marks refunded  
**Expected:** Status = refunded; resolved_at set  
**Acceptance Criteria:**
- [ ] Customer sees refund status in returns page

---

## F-011/F-012: Admin Panel

### TC-ADM-001: Admin Access Control
**Steps:** Customer navigates to `/admin`  
**Expected:** Redirect or 403  
**Acceptance Criteria:**
- [ ] Only admin/support roles allowed

### TC-ADM-002: Dashboard Metrics
**Steps:** Admin loads dashboard  
**Expected:** Revenue, order counts, top products displayed  
**Acceptance Criteria:**
- [ ] Metrics match DB aggregates
- [ ] Load time < 2s

### TC-ADM-003: Create Product
**Steps:** Fill product form with variants and upload images  
**Expected:** Product created and visible in catalog  
**Acceptance Criteria:**
- [ ] Product + variants + images in DB
- [ ] Images in Supabase Storage

### TC-ADM-004: Update Inventory
**Steps:** Set variant stock to 50  
**Expected:** stock_quantity updated; inventory_log created  
**Acceptance Criteria:**
- [ ] Log entry with reason "adjustment"
- [ ] Product card reflects new stock

### TC-ADM-005: Soft Delete Product
**Steps:** Delete product  
**Expected:** is_active = false; not visible in catalog  
**Acceptance Criteria:**
- [ ] Still visible in admin list
- [ ] Existing orders unaffected

---

## Non-Functional Test Cases

### TC-NFR-001: Page Load Performance
**Steps:** Lighthouse audit on home, product listing, product detail  
**Expected:** Performance score ≥ 90  
**Acceptance Criteria:**
- [ ] LCP < 2.5s
- [ ] CLS < 0.1

### TC-NFR-002: API Response Time
**Steps:** Load test GET `/products` with 100 concurrent requests  
**Expected:** p95 < 500ms  
**Acceptance Criteria:**
- [ ] No 5xx errors

### TC-NFR-003: Mobile Responsiveness
**Steps:** Test all screens at 320px, 768px, 1280px  
**Expected:** No horizontal scroll; touch targets ≥ 44px  
**Acceptance Criteria:**
- [ ] Sticky nav works on mobile

### TC-NFR-004: Accessibility
**Steps:** Run axe-core on all major pages  
**Expected:** Zero critical/serious violations  
**Acceptance Criteria:**
- [ ] Keyboard navigation complete
- [ ] Screen reader labels present

### TC-NFR-005: Security — XSS
**Steps:** Submit `<script>alert(1)</script>` in review text  
**Expected:** Script escaped/sanitized  
**Acceptance Criteria:**
- [ ] No script execution

### TC-NFR-006: Security — RLS
**Steps:** Customer A tries to access Customer B's orders via API  
**Expected:** HTTP 403 or empty result  
**Acceptance Criteria:**
- [ ] RLS policy enforced

### TC-NFR-007: HTTPS
**Steps:** Attempt HTTP access  
**Expected:** Redirect to HTTPS  
**Acceptance Criteria:**
- [ ] HSTS header present

---

## MVP Sign-Off Checklist

- [ ] All P0 test cases pass
- [ ] All P1 test cases pass (≥ 90%)
- [ ] NFR performance targets met
- [ ] NFR security checks pass
- [ ] Production deployment successful
- [ ] Smoke test on production passed
- [ ] Stakeholder demo completed
