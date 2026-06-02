-- M3: Commerce policies and checkout helpers

-- Users can insert/update payments for their own orders
CREATE POLICY "Users insert own payments" ON public.payments
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid())
  );

CREATE POLICY "Users update own payments" ON public.payments
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid())
  );

-- Allow confirming pending orders after payment
CREATE POLICY "Users confirm own pending orders" ON public.orders
  FOR UPDATE USING (
    auth.uid() = user_id AND status IN ('pending', 'confirmed')
  ) WITH CHECK (
    auth.uid() = user_id AND status IN ('pending', 'confirmed', 'cancelled')
  );

-- Grant execute on stock decrement to authenticated users
GRANT EXECUTE ON FUNCTION public.decrement_stock(UUID, INT) TO authenticated;
