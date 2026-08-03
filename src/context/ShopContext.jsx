import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../api/client'
import { useAuth } from './AuthContext'

const ShopContext = createContext(null)

export function ShopProvider({ children }) {
  const { isLoggedIn } = useAuth()
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)

  const refreshCounts = useCallback(async () => {
    try {
      const [cart, wishlist] = await Promise.all([api.getCart(), api.getWishlist()])
      setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0))
      setWishlistCount(wishlist.length)
    } catch {
      setCartCount(0)
      setWishlistCount(0)
    }
  }, [isLoggedIn])

  useEffect(() => {
    refreshCounts()
  }, [refreshCounts])

  const value = useMemo(
    () => ({ cartCount, wishlistCount, refreshCounts }),
    [cartCount, wishlistCount, refreshCounts],
  )

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export function useShop() {
  const ctx = useContext(ShopContext)
  if (!ctx) throw new Error('useShop must be used within ShopProvider')
  return ctx
}
